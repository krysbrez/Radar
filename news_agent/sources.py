# RADAR Source Config
# phase=1 → RSS-ready, tested, working
# phase=2 → scraping/manual adapter needed (future)
#
# Audit: 2026-04-12
# Tested 22 candidates, 5 dead (Reuters×2, CoinDesk, DailyFX, Road&Track),
# 3 removed (iHNed general, Investing.com Forex wrong-cat, Seeking Alpha off-topic)

SOURCES = [

    # ── CRYPTO ──────────────────────────────────────────────────────────────
    {
        "name": "CoinTelegraph",
        "url": "https://cointelegraph.com/rss",
        "category": "crypto",
        "phase": 1, "type": "rss", "lang": "en",
    },
    {
        "name": "Decrypt",
        "url": "https://decrypt.co/feed",
        "category": "crypto",
        "phase": 1, "type": "rss", "lang": "en",
    },
    {
        "name": "The Block",
        "url": "https://www.theblock.co/rss.xml",
        "category": "crypto",
        "phase": 1, "type": "rss", "lang": "en",
    },
    {
        "name": "Bitcoin Magazine",
        "url": "https://bitcoinmagazine.com/.rss/full/",
        "category": "crypto",
        "phase": 1, "type": "rss", "lang": "en",
    },

    # ── STOCKS ──────────────────────────────────────────────────────────────
    {
        "name": "CNBC Top News",
        "url": "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10001147",
        "category": "stocks",
        "phase": 1, "type": "rss", "lang": "en",
    },
    {
        "name": "Yahoo Finance",
        "url": "https://finance.yahoo.com/rss/topstories",
        "category": "stocks",
        "phase": 1, "type": "rss", "lang": "en",
        "note": "No summaries — title+link only",
    },

    # ── FOREX ────────────────────────────────────────────────────────────────
    {
        "name": "FXStreet",
        "url": "https://www.fxstreet.com/rss/news",
        "category": "forex",
        "phase": 1, "type": "rss", "lang": "en",
    },
    {
        "name": "Forexlive",
        "url": "https://www.forexlive.com/feed/news",
        "category": "forex",
        "phase": 1, "type": "rss", "lang": "en",
    },

    # ── MARKETS (general) ───────────────────────────────────────────────────
    {
        "name": "MarketWatch",
        "url": "https://feeds.content.dowjones.io/public/rss/mw_topstories",
        "category": "markets",
        "phase": 1, "type": "rss", "lang": "en",
    },
    {
        "name": "NYT Business",
        "url": "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
        "category": "markets",
        "phase": 1, "type": "rss", "lang": "en",
    },
    {
        "name": "Financial Times",
        "url": "https://www.ft.com/rss/home",
        "category": "markets",
        "phase": 1, "type": "rss", "lang": "en",
        "note": "RSS titles/summaries public; article body paywalled",
    },

    # ── MARKETS — Czech ─────────────────────────────────────────────────────
    {
        "name": "Kurzy.cz",
        "url": "https://www.kurzy.cz/rss/zpravy.xml",
        "category": "markets",
        "phase": 1, "type": "rss", "lang": "cs",
    },
    {
        "name": "E15.cz",
        "url": "https://www.e15.cz/rss",
        "category": "markets",
        "phase": 1, "type": "rss", "lang": "cs",
    },
    {
        "name": "Patria.cz",
        "url": "https://www.patria.cz/rss.xml",
        "category": "markets",
        "phase": 1, "type": "rss", "lang": "cs",
    },

    # ── REAL ESTATE ─────────────────────────────────────────────────────────
    {
        "name": "HousingWire",
        "url": "https://www.housingwire.com/feed/",
        "category": "real_estate",
        "phase": 1, "type": "rss", "lang": "en",
    },
    {
        "name": "Sreality.cz",
        "url": "https://www.sreality.cz",
        "category": "real_estate",
        "phase": 2, "type": "scraping", "lang": "cs",
        "note": "Czech marketplace — needs scraping adapter",
    },
    {
        "name": "Bezrealitky.cz",
        "url": "https://www.bezrealitky.cz",
        "category": "real_estate",
        "phase": 2, "type": "scraping", "lang": "cs",
        "note": "Czech marketplace — needs scraping adapter",
    },
    {
        "name": "Reality.cz",
        "url": "https://www.reality.cz",
        "category": "real_estate",
        "phase": 2, "type": "scraping", "lang": "cs",
        "note": "Czech marketplace — needs scraping adapter",
    },
    {
        "name": "Realtor.com News",
        "url": "https://www.realtor.com/news/feed/",
        "category": "real_estate",
        "phase": 2, "type": "rss", "lang": "en",
        "note": "US-focused luxury content — low relevance for CZ audience",
    },

    # ── CARS ────────────────────────────────────────────────────────────────
    {
        "name": "Autocar",
        "url": "https://www.autocar.co.uk/rss",
        "category": "cars",
        "phase": 1, "type": "rss", "lang": "en",
    },
    {
        "name": "Car and Driver",
        "url": "https://www.caranddriver.com/rss/all.xml",
        "category": "cars",
        "phase": 1, "type": "rss", "lang": "en",
    },
    {
        "name": "Auto.cz",
        "url": "https://www.auto.cz/rss",
        "category": "cars",
        "phase": 1, "type": "rss", "lang": "cs",
    },
    {
        "name": "Sauto.cz",
        "url": "https://www.sauto.cz",
        "category": "cars",
        "phase": 2, "type": "scraping", "lang": "cs",
        "note": "Czech car marketplace — needs scraping adapter",
    },
    {
        "name": "Mobile.de",
        "url": "https://www.mobile.de",
        "category": "cars",
        "phase": 2, "type": "scraping", "lang": "de",
        "note": "German car marketplace — needs scraping adapter",
    },
    {
        "name": "TipCars.com",
        "url": "https://www.tipcars.com",
        "category": "cars",
        "phase": 2, "type": "scraping", "lang": "cs",
        "note": "Czech car marketplace — needs scraping adapter",
    },
]


def get_phase1_sources(category=None):
    """Return all phase-1 RSS sources, optionally filtered by category."""
    sources = [s for s in SOURCES if s["phase"] == 1 and s["type"] == "rss"]
    if category:
        sources = [s for s in sources if s["category"] == category]
    return sources


def get_phase2_sources(category=None):
    """Return phase-2 scraping candidates."""
    sources = [s for s in SOURCES if s["phase"] == 2]
    if category:
        sources = [s for s in sources if s["category"] == category]
    return sources


if __name__ == "__main__":
    from collections import Counter
    p1 = [s for s in SOURCES if s["phase"] == 1]
    p2 = [s for s in SOURCES if s["phase"] == 2]
    print(f"Phase 1 (RSS-ready): {len(p1)}")
    for cat, count in sorted(Counter(s["category"] for s in p1).items()):
        names = [s["name"] for s in p1 if s["category"] == cat]
        print(f"  {cat:12} {count}  {', '.join(names)}")
    print(f"\nPhase 2 (scraping/manual): {len(p2)}")
    for s in p2:
        print(f"  [{s['category']:12}] {s['name']} — {s.get('note', '')}")
