"""
RADAR News Agent — RSS Sources
Kategorie: stocks, crypto, forex, real_estate, cars, markets
"""

SOURCES = [
    # ── STOCKS ──────────────────────────────────────────────
    {
        "url": "https://feeds.finance.yahoo.com/rss/2.0/headline?s=^GSPC,^DJI,AAPL,MSFT&region=US&lang=en-US",
        "category_hint": "stocks",
        "language": "en",
    },
    {
        "url": "https://www.cnbc.com/id/10001147/device/rss/rss.html",
        "category_hint": "stocks",
        "language": "en",
    },

    # ── CRYPTO ──────────────────────────────────────────────
    {
        "url": "https://cointelegraph.com/rss",
        "category_hint": "crypto",
        "language": "en",
    },
    {
        "url": "https://coindesk.com/arc/outboundfeeds/rss/",
        "category_hint": "crypto",
        "language": "en",
    },

    # ── FOREX ────────────────────────────────────────────────
    {
        "url": "https://www.forexfactory.com/ff_calendar.php?week=this&ifeed=1",
        "category_hint": "forex",
        "language": "en",
    },
    {
        "url": "https://www.dailyfx.com/feeds/news",
        "category_hint": "forex",
        "language": "en",
    },

    # ── MARKETS (general) ────────────────────────────────────
    {
        "url": "https://feeds.reuters.com/reuters/businessNews",
        "category_hint": "markets",
        "language": "en",
    },
    {
        "url": "https://rss.ft.com/rss/companies/financialservices",
        "category_hint": "markets",
        "language": "en",
    },

    # ── REAL ESTATE (CZ) ────────────────────────────────────
    {
        "url": "https://www.novinky.cz/rss/bydleni",
        "category_hint": "real_estate",
        "language": "cs",
    },

    # ── CARS ────────────────────────────────────────────────
    {
        "url": "https://www.auto.cz/feed",
        "category_hint": "cars",
        "language": "cs",
    },
    {
        "url": "https://www.autobild.cz/rss/clanky.xml",
        "category_hint": "cars",
        "language": "cs",
    },
]
