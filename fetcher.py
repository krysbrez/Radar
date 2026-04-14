"""
RADAR News Agent — Fetcher
Stáhne a parsuje RSS feedy ze sources.py
"""

import feedparser
import hashlib
from datetime import datetime, timezone
from typing import Optional
from sources import SOURCES


def _parse_date(entry) -> str:
    """Vrátí ISO timestamp z RSS entry, nebo teď."""
    for attr in ("published_parsed", "updated_parsed"):
        t = getattr(entry, attr, None)
        if t:
            return datetime(*t[:6], tzinfo=timezone.utc).isoformat()
    return datetime.now(timezone.utc).isoformat()


def _make_id(url: str) -> str:
    """Unikátní hash URL pro dedup."""
    return hashlib.md5(url.encode()).hexdigest()


def fetch_all(max_per_feed: int = 15) -> list[dict]:
    """
    Stáhne všechny RSS feedy a vrátí raw seznam článků.
    Každý článek: id, title, url, published_at, source_name,
                  category_hint, language, description
    """
    raw_articles = []

    for source in SOURCES:
        try:
            feed = feedparser.parse(source["url"])
            feed_title = feed.feed.get("title", source["url"])

            for entry in feed.entries[:max_per_feed]:
                url = entry.get("link", "")
                if not url:
                    continue

                article = {
                    "id": _make_id(url),
                    "title": entry.get("title", "").strip(),
                    "url": url,
                    "published_at": _parse_date(entry),
                    "source_name": feed_title,
                    "category_hint": source["category_hint"],
                    "language": source["language"],
                    # description pro Claude summarizaci
                    "description": (
                        entry.get("summary", "")
                        or entry.get("description", "")
                    ).strip()[:1000],  # omez délku pro API
                }
                raw_articles.append(article)

        except Exception as e:
            print(f"[FETCHER] ⚠️  Chyba při načítání {source['url']}: {e}")

    print(f"[FETCHER] ✅ Staženo {len(raw_articles)} článků z {len(SOURCES)} zdrojů")
    return raw_articles


def deduplicate(articles: list[dict]) -> list[dict]:
    """Odstraní duplicity podle URL hash."""
    seen = set()
    unique = []
    for a in articles:
        if a["id"] not in seen:
            seen.add(a["id"])
            unique.append(a)
    removed = len(articles) - len(unique)
    if removed:
        print(f"[FETCHER] 🔁 Odstraněno {removed} duplicit")
    return unique
