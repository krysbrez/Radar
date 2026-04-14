"""
RADAR News Agent — Processor
1. Odfiltruje low-value / nerelevantní obsah
2. Zavolá Claude API pro category + summary + relevance_score
3. Vrátí čistý strukturovaný output
"""

import json
import os
import re
import time
from typing import Optional
import anthropic

# ── Konfigurace ──────────────────────────────────────────────
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
BATCH_SIZE = 8           # kolik článků zpracovat v jednom Claude volání
MAX_ARTICLES_OUT = 30    # max výsledků v news.json

VALID_CATEGORIES = {"stocks", "crypto", "forex", "real_estate", "cars", "markets"}

# Klíčová slova pro rychlé odfiltrování (před Claude)
LOW_VALUE_PATTERNS = [
    r"\b(quiz|contest|win a|giveaway|subscribe now|sign up)\b",
    r"\b(sponsored|advertisement|press release|pr newswire)\b",
    r"\b(celebrity|gossip|entertainment|sports score)\b",
]


# ── Pre-filter (rychlý, bez AI) ──────────────────────────────

def _is_low_value(article: dict) -> bool:
    text = (article["title"] + " " + article["description"]).lower()
    for pattern in LOW_VALUE_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    # Odfiltruj články bez titulku nebo URL
    if not article["title"] or not article["url"]:
        return True
    return False


def pre_filter(articles: list[dict]) -> list[dict]:
    filtered = [a for a in articles if not _is_low_value(a)]
    removed = len(articles) - len(filtered)
    if removed:
        print(f"[PROCESSOR] 🗑️  Pre-filter odstranil {removed} low-value článků")
    return filtered


# ── Claude batch processing ───────────────────────────────────

def _build_prompt(articles: list[dict]) -> str:
    items = []
    for i, a in enumerate(articles):
        items.append(
            f"[{i}] TITLE: {a['title']}\n"
            f"    SOURCE: {a['source_name']}\n"
            f"    HINT: {a['category_hint']}\n"
            f"    DESC: {a['description'][:300] or '(no description)'}\n"
        )

    articles_text = "\n".join(items)

    return f"""You are a financial news classifier and summarizer for RADAR, a Czech finance platform for young people (18-30).

For each article below, return a JSON array with one object per article. Use the same index order.

Each object must have exactly these fields:
- "idx": integer (same as input index)
- "category": one of: stocks, crypto, forex, real_estate, cars, markets
- "summary": 1-2 sentences, casual and clear Czech-smart tone. If the article is in Czech, summarize in Czech. If English, summarize in English.
- "relevance_score": float 0.0-1.0 (1.0 = very relevant to young Czech investors)
- "keep": boolean (false if the article is not relevant to finance/investing at all)

Rules:
- relevance_score below 0.3 = probably not worth showing
- be strict: clickbait, vague opinion pieces, non-finance content → keep: false
- summary must be punchy, max 2 sentences, no corporate language

Return ONLY the JSON array, no other text.

Articles:
{articles_text}"""


def _call_claude(articles: list[dict], client: anthropic.Anthropic) -> list[dict]:
    prompt = _build_prompt(articles)

    try:
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}],
        )
        raw = response.content[0].text.strip()

        # Ošetři případné ```json bloky
        if raw.startswith("```"):
            raw = re.sub(r"^```[a-z]*\n?", "", raw)
            raw = re.sub(r"\n?```$", "", raw)

        results = json.loads(raw)
        return results

    except Exception as e:
        print(f"[PROCESSOR] ⚠️  Claude API chyba: {e}")
        return []


def process_with_claude(articles: list[dict]) -> list[dict]:
    """
    Zpracuje články přes Claude v batchích.
    Vrátí obohacené články s category, summary, relevance_score.
    """
    if not ANTHROPIC_API_KEY:
        raise ValueError("ANTHROPIC_API_KEY není nastavený!")

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    processed = []

    # Zpracuj po dávkách
    for batch_start in range(0, len(articles), BATCH_SIZE):
        batch = articles[batch_start: batch_start + BATCH_SIZE]
        print(f"[PROCESSOR] 🤖 Zpracovávám batch {batch_start // BATCH_SIZE + 1} ({len(batch)} článků)...")

        claude_results = _call_claude(batch, client)

        for result in claude_results:
            idx = result.get("idx", -1)
            if idx < 0 or idx >= len(batch):
                continue
            if not result.get("keep", True):
                continue

            article = batch[idx].copy()

            # Přiřaď výsledky z Claude
            category = result.get("category", article["category_hint"])
            article["category"] = category if category in VALID_CATEGORIES else article["category_hint"]
            article["summary"] = result.get("summary", "")
            article["relevance_score"] = float(result.get("relevance_score", 0.5))

            # Odstraň interní pole
            article.pop("description", None)
            article.pop("category_hint", None)
            article.pop("language", None)

            if article["relevance_score"] >= 0.3 and article["summary"]:
                processed.append(article)

        # Pauza mezi batchy (rate limit)
        if batch_start + BATCH_SIZE < len(articles):
            time.sleep(1)

    # Seřaď podle relevance + data
    processed.sort(key=lambda x: (x["relevance_score"], x["published_at"]), reverse=True)

    return processed[:MAX_ARTICLES_OUT]
