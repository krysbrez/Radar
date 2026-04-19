"""
RADAR Watcher — Source Registry
────────────────────────────────────────────────────────────
Mapuje category (uživatelský alert) → search funkci, která
dotáže konkrétní marketplace a vrátí seznam inzerátů.

Přidání nového marketplace (např. Bezrealitky, TipCars):
  1. Vytvoř news_agent/sources/<name>.py se funkcí
     search_<name>(filters: dict) -> list[Listing]
  2. Importuj ji sem a přidej do SEARCHERS dict.
  3. Přidej do EMAIL_CONFIG v watcher.py vlastní subject/emoji.

Každý search adapter vrací list dictů tohoto tvaru:
  {
    "title":  str,
    "price":  int,           # CZK
    "url":    str,           # plná URL inzerátu
    "source": str,           # "sauto" | "sreality" | ...
    "detail": dict,          # category-specific (year/km pro auta,
                             #                    locality/area pro byty)
  }
"""

from .sauto import search_sauto
from .sreality import search_sreality

# ── Registry: category → search function ──────────────────────
SEARCHERS = {
    "auta":         search_sauto,
    "nemovitosti":  search_sreality,
}


def get_searcher(category: str):
    """Vrátí search funkci pro danou kategorii, nebo None."""
    return SEARCHERS.get(category)


def supported_categories() -> list[str]:
    """Vrátí seznam všech podporovaných kategorií."""
    return list(SEARCHERS.keys())
