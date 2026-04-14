import os
import re
import sys
import json
import time
import hashlib
import argparse
from pathlib import Path
from datetime import datetime, timezone
import feedparser
from openai import OpenAI

MODEL     = "google/gemma-3-12b-it:free"
CACHE_DIR = Path(__file__).parent / ".cache"

CATEGORY_KEYWORDS = {
    "crypto":      ["bitcoin", "crypto", "ethereum", "btc", "eth", "krypto", "blockchain", "altcoin", "defi", "nft"],
    "stocks":      ["stock", "akcie", "shares", "nasdaq", "s&p", "dow", "ipo", "equity", "dividend", "earnings"],
    "forex":       ["forex", "currency", "eur", "usd", "czk", "exchange rate", "kurz", "měna", "gbp", "jpy"],
    "real_estate": ["real estate", "nemovitost", "byt", "dům", "house", "property", "mortgage", "hypotéka", "housing"],
    "cars":        ["car", "auto", "vehicle", "bmw", "toyota", "porsche", "ev", "elektromobil", "motoring"],
    "markets":     ["market", "trh", "index", "commodity", "gold", "zlato", "oil", "ropa", "inflation", "inflace", "fed", "ecb"],
}


# ── Helpers ───────────────────────────────────────────────────────────────────

def classify(title, summary):
    text = (title + " " + summary).lower()
    best_cat, best_count, total = "other", 0, 0
    for cat, keywords in CATEGORY_KEYWORDS.items():
        count = sum(1 for kw in keywords if kw in text)
        total += count
        if count > best_count:
            best_count, best_cat = count, cat
    return best_cat, min(total, 10)


def extract_image(entry):
    for m in entry.get("media_content", []):
        url = m.get("url", "")
        if url:
            return url
    for t in entry.get("media_thumbnail", []):
        if t.get("url"):
            return t["url"]
    for enc in entry.get("enclosures", []):
        if enc.get("type", "").startswith("image/") and enc.get("href"):
            return enc["href"]
    m = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', entry.get("summary") or "")
    return m.group(1) if m else ""


def normalize_title(title):
    return " ".join(title.lower().split())


def deduplicate(articles):
    seen_links, seen_titles, result = set(), set(), []
    for a in articles:
        tn = normalize_title(a["title"])
        if (a["link"] and a["link"] in seen_links) or tn in seen_titles:
            continue
        seen_links.add(a["link"])
        seen_titles.add(tn)
        result.append(a)
    return result


# ── Ingestion ─────────────────────────────────────────────────────────────────

def fetch_feed(url, limit, source_category=None):
    feed = feedparser.parse(url)
    if feed.bozo and not feed.entries:
        raise ValueError("prázdný/broken feed")
    source = feed.feed.get("title") or url
    articles = []
    for entry in feed.entries[:limit]:
        title = entry.get("title") or "(bez názvu)"
        text  = re.sub(r"<[^>]+>", " ", entry.get("summary") or entry.get("description") or "").strip()
        cat, score = classify(title, text)
        articles.append({
            "title":              title,
            "link":               entry.get("link") or "",
            "published":          entry.get("published") or entry.get("updated") or "",
            "summary":            text,
            "category":           source_category or cat,
            "source":             source,
            "relevance_score":    score,
            "image_url":          extract_image(entry),
            "radar_headline":     "",
            "radar_summary_short":"",
            "radar_summary_long": "",
            "why_it_matters":     "",
            "tone":               "neutral",
            "tags":               [],
        })
    return articles


# ── LLM layer ─────────────────────────────────────────────────────────────────

def with_retry(fn, retries=3, wait=15):
    for attempt in range(retries):
        try:
            return fn()
        except Exception as e:
            if "429" in str(e) and attempt < retries - 1:
                print(f"  Rate limit — čekám {wait}s (pokus {attempt + 1}/{retries})")
                time.sleep(wait)
                wait = min(wait * 2, 60)
            else:
                raise


def cache_key(articles):
    raw = ",".join(a["link"] or a["title"] for a in articles)
    return hashlib.md5(raw.encode()).hexdigest()


def load_cache(key):
    path = CACHE_DIR / f"{key}.json"
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return None


def save_cache(key, data):
    CACHE_DIR.mkdir(exist_ok=True)
    (CACHE_DIR / f"{key}.json").write_text(
        json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8"
    )


def enrich_and_summarize(articles, client):
    """One LLM call → editorial enrichment + overview. Cached by article links."""
    key = cache_key(articles)
    cached = load_cache(key)
    if cached:
        print("  Cache hit — přeskočeno volání LLM")
        for i, a in enumerate(articles):
            a.update(cached["enrichments"].get(str(i), {}))
        return articles, cached["overview"]

    # Input — title + more of the summary for better context
    items = [
        {"id": i, "title": a["title"][:100], "s": a["summary"][:400], "cat": a["category"]}
        for i, a in enumerate(articles)
    ]

    prompt = (
        f"Czech financial newsletter RADAR. Enrich {len(articles)} articles. Write substantive, useful Czech content — not filler.\n\n"
        f"{json.dumps(items, ensure_ascii=False)}\n\n"
        "Return ONE JSON object (no markdown, no code block):\n"
        '{"overview":"3-4 Czech sentences weekly summary",'
        '"articles":[{'
        '"id":0,'
        '"radar_headline":"Czech title ≤80 chars, specific and informative",'
        '"radar_summary_short":"2-3 Czech sentences for card preview, include key number or fact",'
        '"radar_summary_long":"Opening paragraph: 4-6 Czech sentences with full context and what specifically happened. Write as a knowledgeable journalist, not a press release.",'
        '"what_changed":"2-4 Czech sentences: what specifically changed, happened, or was announced. Be concrete.",'
        '"context":"3-5 Czech sentences of background context that helps reader understand significance.",'
        '"key_numbers":"Bullet list of 3-5 key numbers/facts using markdown: - **number** — explanation",'
        '"what_to_watch":"2-3 Czech sentences about what signals or developments to monitor next.",'
        '"practical_takeaway":"2-3 Czech sentences of practical insight for an investor or reader.",'
        '"why_it_matters":"1-2 Czech sentences explaining real-world significance.",'
        '"tone":"bullish|bearish|neutral|warning|informative",'
        '"tags":["tag1","tag2","tag3"]}]}'
    )

    def call():
        return client.chat.completions.create(
            model=MODEL,
            max_tokens=4000,
            messages=[
                {"role": "user", "content":
                    "Jsi zkušený editor finančního newsletteru RADAR. Piš česky, věcně, bez klišé. Čtenář je inteligentní investor — piš pro něj, ne pro začátečníka. Každý článek musí být substantivní a užitečný.\n\n" + prompt},
            ],
        ).choices[0].message.content.strip()

    raw = with_retry(call)
    raw = re.sub(r"^```(?:json)?\s*", "", raw).strip()
    raw = re.sub(r"\s*```$", "", raw).strip()

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        # LLM truncated — try to salvage articles array
        m = re.search(r'"articles"\s*:\s*(\[.*)', raw, re.DOTALL)
        if m:
            # close unclosed JSON by truncating at last complete object
            arr_raw = m.group(1)
            last = arr_raw.rfind("},")
            if last == -1:
                last = arr_raw.rfind("}")
            if last != -1:
                arr_raw = arr_raw[: last + 1] + "]"
            try:
                result = {"overview": "", "articles": json.loads(arr_raw)}
            except Exception:
                result = {"overview": "", "articles": []}
        else:
            result = {"overview": "", "articles": []}
    overview = result.get("overview", "")
    enrich_map = {int(e["id"]): e for e in result.get("articles", [])}

    enrichments_to_cache = {}
    for i, a in enumerate(articles):
        e = enrich_map.get(i, {})
        patch = {
            "radar_headline":       e.get("radar_headline", a["title"]),
            "radar_summary_short":  e.get("radar_summary_short", ""),
            "radar_summary_long":   e.get("radar_summary_long", ""),
            "what_changed":         e.get("what_changed", ""),
            "context":              e.get("context", ""),
            "key_numbers":          e.get("key_numbers", ""),
            "what_to_watch":        e.get("what_to_watch", ""),
            "practical_takeaway":   e.get("practical_takeaway", ""),
            "why_it_matters":       e.get("why_it_matters", ""),
            "tone":                 e.get("tone", "neutral"),
            "tags":                 e.get("tags", []),
        }
        a.update(patch)
        enrichments_to_cache[str(i)] = patch

    save_cache(key, {"enrichments": enrichments_to_cache, "overview": overview})
    return articles, overview


# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="RADAR content agent — RSS → editorial JSON")
    parser.add_argument("--feed",       action="append", help="URL RSS feedu")
    parser.add_argument("--use-config", action="store_true", help="Phase-1 zdroje ze sources.py")
    parser.add_argument("--category",   help="Filtr kategorie")
    parser.add_argument("--limit",      type=int, default=5,  help="Článků na feed (default 5)")
    parser.add_argument("--top",        type=int, default=10, help="Top N do LLM (default 10)")
    parser.add_argument("--out",        help="Výstupní JSON soubor")
    args = parser.parse_args()

    if not args.feed and not args.use_config:
        parser.error("Zadej --feed URL nebo --use-config")

    feed_specs = [(url, None) for url in (args.feed or [])]
    if args.use_config:
        from sources import get_phase1_sources
        cfg = get_phase1_sources(args.category)
        feed_specs += [(s["url"], s["category"]) for s in cfg]
        print(f"Config: {len(cfg)} zdrojů" + (f" [{args.category}]" if args.category else ""))

    failed, all_articles = [], []
    for url, src_cat in feed_specs:
        print(f"  Načítám: {url[:70]}")
        try:
            batch = fetch_feed(url, args.limit, src_cat)
            all_articles.extend(batch)
            print(f"    → {len(batch)} článků")
        except Exception as e:
            failed.append({"url": url, "error": str(e)})
            print(f"    ✗ {e}")

    if not all_articles:
        print("Žádné články.")
        sys.exit(0)

    all_articles = deduplicate(all_articles)
    all_articles.sort(key=lambda a: -a["relevance_score"])
    top = all_articles[: args.top]

    print(f"\nDeduplikováno: {len(all_articles)} | LLM zpracuji top {len(top)}")

    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("⚠ OPENROUTER_API_KEY není nastaven — přeskočeno LLM")
        overview, top = "", top
    else:
        client = OpenAI(api_key=api_key, base_url="https://openrouter.ai/api/v1")
        try:
            top, overview = enrich_and_summarize(top, client)
            print("Editorial enrichment OK")
        except Exception as e:
            print(f"⚠ Editorial selhal: {e}")
            overview = ""

    payload = {
        "generated_at":   datetime.now(timezone.utc).isoformat(),
        "category_filter": args.category,
        "article_count":  len(top),
        "failed_feeds":   failed,
        "overview":       overview,
        "articles":       top,
    }

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)
        print(f"Uloženo: {args.out}")
    else:
        print("\n" + "─" * 60)
        print(overview or "(no overview)")
        print("─" * 60)
        for a in top[:3]:
            print(f"\n[{a['category'].upper()}] {a['radar_headline'] or a['title']}")
            print(f"  {a['radar_summary_short']}")
            print(f"  Proč: {a['why_it_matters']}")
            print(f"  Tón: {a['tone']}  Tags: {a['tags']}")


if __name__ == "__main__":
    main()
