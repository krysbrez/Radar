#!/usr/bin/env python3
"""
stitch.py — connects news_agent JSON output → app/src/data/articles.js

Usage:
  python stitch.py news_agent/test_out.json
  python stitch.py news_agent/examples/crypto.json news_agent/examples/markets.json
  python stitch.py news_agent/examples/*.json
"""

import sys
import json
import re
import unicodedata
from pathlib import Path
from datetime import datetime
from email.utils import parsedate_to_datetime

ARTICLES_JS = Path(__file__).parent / "app/src/data/articles.js"

# ── Mapping tables ────────────────────────────────────────────────────────────

CATEGORY_MAP = {
    "crypto":      ("krypto",       "Krypto",       "bg-orange-500/20 text-orange-300"),
    "stocks":      ("investovani",  "Investování",  "bg-blue-500/20 text-blue-300"),
    "forex":       ("forex",        "Forex",        "bg-purple-500/20 text-purple-300"),
    "real_estate": ("nemovitosti",  "Reality",      "bg-emerald-500/20 text-emerald-300"),
    "cars":        ("auta",         "Auta",         "bg-amber-500/20 text-amber-300"),
    "markets":     ("investovani",  "Trhy",         "bg-sky-500/20 text-sky-300"),
    "other":       ("investovani",  "Radar",        "bg-white/10 text-white/60"),
}

CZECH_MONTHS = ["ledna", "února", "března", "dubna", "května", "června",
                "července", "srpna", "září", "října", "listopadu", "prosince"]


# ── Helpers ───────────────────────────────────────────────────────────────────

def slugify(text):
    """Create a URL-safe id from Czech text."""
    text = unicodedata.normalize("NFD", text)
    text = "".join(c for c in text if unicodedata.category(c) != "Mn")
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text).strip("-")
    return text[:60]


def format_date(published_str):
    """Parse RFC 2822 or ISO date → '13. 4. 2026'."""
    if not published_str:
        return datetime.now().strftime("%-d. %-m. %Y")
    try:
        dt = parsedate_to_datetime(published_str)
        return f"{dt.day}. {dt.month}. {dt.year}"
    except Exception:
        try:
            dt = datetime.fromisoformat(published_str.replace("Z", "+00:00"))
            return f"{dt.day}. {dt.month}. {dt.year}"
        except Exception:
            return datetime.now().strftime("%-d. %-m. %Y")


def estimate_read_time(body):
    words = len(body.split())
    minutes = max(2, round(words / 200))
    return f"{minutes} min"


def build_body(article):
    """Build a structured long-form article body from enriched fields."""
    parts = []

    # Opening paragraph — main context
    summary_long = article.get("radar_summary_long", "").strip()
    if summary_long:
        parts.append(summary_long)

    # What specifically happened / what changed
    what_changed = article.get("what_changed", "").strip()
    if what_changed:
        parts.append(f"**Co se stalo**\n\n{what_changed}")

    # Context section
    context = article.get("context", "").strip()
    if context:
        parts.append(f"**Kontext**\n\n{context}")

    # Key numbers
    key_numbers = article.get("key_numbers", "").strip()
    if key_numbers:
        parts.append(f"**Klíčová čísla**\n\n{key_numbers}")

    # What to watch next
    what_to_watch = article.get("what_to_watch", "").strip()
    if what_to_watch:
        parts.append(f"**Co sledovat dál**\n\n{what_to_watch}")

    # Practical takeaway
    takeaway = article.get("practical_takeaway", "").strip()
    if takeaway:
        parts.append(f"**Praktický závěr**\n\n{takeaway}")

    # Source reference
    if article.get("link"):
        source_name = article.get("source", article["link"])
        parts.append(f"*Zdroj: [{source_name}]({article['link']})*")

    return "\n\n".join(parts)


def article_to_js_obj(a):
    cat_key = a.get("category", "other")
    cat_slug, tag_label, tag_color = CATEGORY_MAP.get(cat_key, CATEGORY_MAP["other"])
    headline = a.get("radar_headline") or a.get("title", "")
    slug = slugify(headline)
    body = build_body(a)

    obj = {
        "id": slug,
        "tag": tag_label,
        "tagColor": tag_color,
        "title": headline,
        "excerpt": a.get("radar_summary_short") or a.get("summary", "")[:200],
        "body": body,
        "whyMatters": a.get("why_it_matters", ""),
        "readTime": estimate_read_time(body),
        "date": format_date(a.get("published", "")),
        "author": "Radar Redakce",
        "category": cat_slug,
        "sourceLink": a.get("link", ""),
    }
    if a.get("image_url"):
        obj["image"] = a["image_url"]

    return obj


def js_escape(s):
    """Escape backticks and ${} for template literal embedding."""
    s = s.replace("\\", "\\\\")
    s = s.replace("`", "\\`")
    s = s.replace("${", "\\${")
    return s


def clean_str(s):
    """Collapse newlines/tabs to single space for double-quoted JS strings."""
    s = re.sub(r"[\r\n\t]+", " ", s)
    s = re.sub(r" {2,}", " ", s)
    return s.strip()


def obj_to_js(obj):
    lines = ["  {"]
    for k, v in obj.items():
        if k == "body":
            lines.append(f"    body: `{js_escape(v)}`,")
        elif isinstance(v, str):
            cleaned = clean_str(v)
            escaped = cleaned.replace("\\", "\\\\").replace('"', '\\"')
            lines.append(f'    {k}: "{escaped}",')
        elif isinstance(v, bool):
            lines.append(f'    {k}: {"true" if v else "false"},')
        else:
            lines.append(f"    {k}: {json.dumps(v, ensure_ascii=False)},")
    lines.append("  }")
    return "\n".join(lines)


# ── Load existing articles ────────────────────────────────────────────────────

def load_existing_ids(js_path):
    """Extract existing article ids to avoid duplicates."""
    try:
        text = js_path.read_text(encoding="utf-8")
        return set(re.findall(r'\bid:\s*"([^"]+)"', text))
    except Exception:
        return set()


def load_existing_source_links(js_path):
    """Extract existing sourceLinks to avoid duplicates from same source."""
    try:
        text = js_path.read_text(encoding="utf-8")
        return set(re.findall(r'\bsourceLink:\s*"([^"]+)"', text))
    except Exception:
        return set()


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("Usage: python stitch.py <input.json> [input2.json ...]")
        sys.exit(1)

    existing_ids = load_existing_ids(ARTICLES_JS)
    existing_links = load_existing_source_links(ARTICLES_JS)

    new_articles = []
    for path in sys.argv[1:]:
        try:
            data = json.loads(Path(path).read_text(encoding="utf-8"))
        except Exception as e:
            print(f"✗ Cannot read {path}: {e}")
            continue

        articles = data.get("articles", [])
        print(f"  {path}: {len(articles)} articles")
        for a in articles:
            # Skip if not LLM-enriched (no Czech radar_headline)
            if not a.get("radar_headline") and not a.get("radar_summary_short"):
                print(f"    skip (not enriched): {a.get('title', '')[:60]}")
                continue
            obj = article_to_js_obj(a)
            if obj["id"] in existing_ids:
                print(f"    skip (id exists): {obj['id']}")
                continue
            if obj.get("sourceLink") and obj["sourceLink"] in existing_links:
                print(f"    skip (link exists): {obj['id']}")
                continue
            new_articles.append(obj)
            existing_ids.add(obj["id"])
            if obj.get("sourceLink"):
                existing_links.add(obj["sourceLink"])

    if not new_articles:
        print("Nothing new to add.")
        return

    # Read current articles.js
    current = ARTICLES_JS.read_text(encoding="utf-8")

    # Build new entries as JS string
    entries_js = ",\n".join(obj_to_js(a) for a in new_articles)

    # Insert after "export const ARTICLES = ["
    marker = "export const ARTICLES = ["
    pos = current.index(marker) + len(marker)
    # Skip whitespace/newline right after [
    insert_at = pos
    new_content = (
        current[:insert_at]
        + "\n"
        + entries_js
        + ","
        + current[insert_at:]
    )

    ARTICLES_JS.write_text(new_content, encoding="utf-8")
    print(f"\n✓ Added {len(new_articles)} article(s) to articles.js")
    for a in new_articles:
        print(f"  + [{a['category']}] {a['id']}")


if __name__ == "__main__":
    main()
