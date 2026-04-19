"""
RADAR Watcher — Sauto.cz adapter
────────────────────────────────────────────────────────────
Dotáže Sauto.cz internal JSON API (objeveno v DevTools 12. 4. 2026).
Extrahováno z původního watcher.py (sprint 2) → viz git history.

Filtry (klíče v params ze Supabase):
  znacka, model, max_price, rok_od, rok_do, km_max,
  palivo, prevodovka, karoserie

Návratová hodnota: list[dict] s klíči title, price, url, source, detail
kde detail má: year, km, fuel, transmission, body.
"""

import logging
import requests as http

log = logging.getLogger("watcher.sauto")

SAUTO_API = "https://www.sauto.cz/api/search/v1/car"

# ── Mapování UI → Sauto API hodnoty ──────────────────────────
PALIVO_MAP = {
    "benzin":  "petrol",
    "diesel":  "diesel",
    "elektro": "electric",
    "hybrid":  "hybrid",
    "lpg":     "lpg",
}
PREVODOVKA_MAP = {
    "manual":  "manual",
    "automat": "automatic",
}
KAROSERIE_MAP = {
    "sedan":     "sedan",
    "kombi":     "estate",
    "suv":       "suv",
    "hatchback": "hatchback",
    "coupe":     "coupe",
    "cabrio":    "convertible",
    "van":       "van",
    "pickup":    "pickup",
}


def _parse_int(val) -> int:
    """Parse a potentially space-formatted integer from API response."""
    try:
        return int(str(val).replace(" ", "").replace("\xa0", "").replace(",", ""))
    except (ValueError, TypeError):
        return 0


def search_sauto(filters: dict) -> list[dict]:
    """
    Query Sauto.cz internal JSON API with full filter set.
    Returns unified list of { title, price, url, source, detail } after
    both API-level and Python-level filtering.
    """
    znacka     = filters.get("znacka", "")
    model      = filters.get("model", "")
    max_price  = filters.get("max_price", 0)
    rok_od     = filters.get("rok_od", 0)
    rok_do     = filters.get("rok_do", 0)
    km_max     = filters.get("km_max", 0)
    palivo     = filters.get("palivo", "")
    prevodovka = filters.get("prevodovka", "")
    karoserie  = filters.get("karoserie", "")

    if not znacka:
        log.warning("  [sauto] No brand (znacka) — skipping")
        return []

    # ── Build API query ──────────────────────────────────────
    api_params = {
        "condition": "used",
        "sort":      "date_desc",
        "limit":     50,
    }
    if znacka:    api_params["manufacturer"] = znacka
    if model:     api_params["model"]        = model
    if max_price: api_params["priceMax"]     = int(max_price)
    if rok_od:    api_params["yearFrom"]     = int(rok_od)
    if rok_do:    api_params["yearTo"]       = int(rok_do)
    if km_max:    api_params["mileageMax"]   = int(km_max)
    if palivo     and palivo     in PALIVO_MAP:     api_params["fuel"]         = PALIVO_MAP[palivo]
    if prevodovka and prevodovka in PREVODOVKA_MAP: api_params["transmission"] = PREVODOVKA_MAP[prevodovka]
    if karoserie  and karoserie  in KAROSERIE_MAP:  api_params["bodyStyle"]    = KAROSERIE_MAP[karoserie]

    active = [f"{k}={v}" for k, v in api_params.items() if k not in ("condition", "sort", "limit")]
    log.info(f"  [sauto] filters: {', '.join(active) if active else 'none'}")

    try:
        r = http.get(SAUTO_API, params=api_params, timeout=15, headers={
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; RADAR-Watcher/3.0)",
        })
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        log.error(f"  [sauto] API error: {e}")
        return []

    raw = data.get("items") or data.get("data") or data.get("results") or []
    if not raw:
        log.warning(f"  [sauto] empty results for '{znacka} {model}'. "
                    f"Keys: {list(data.keys())}")
        return []

    # ── Parse + Python-side post-filter ──────────────────────
    results = []
    skipped = 0
    for item in raw:
        price = _parse_int(item.get("price") or item.get("priceTotal") or item.get("totalPrice") or 0)
        year  = _parse_int(item.get("year")  or item.get("yearOfManufacture") or 0)
        km    = _parse_int(item.get("mileage") or item.get("km") or item.get("odometer") or 0)

        # Hard post-filters
        if max_price and price > max_price:      skipped += 1; continue
        if rok_od    and year and year < rok_od: skipped += 1; continue
        if rok_do    and year and year > rok_do: skipped += 1; continue
        if km_max    and km   and km   > km_max: skipped += 1; continue

        title = (item.get("title") or item.get("name") or
                 f"{item.get('manufacturer', znacka)} {item.get('model', model)}").strip()

        slug = (item.get("slug") or item.get("adSlug") or
                item.get("id")   or item.get("adId")   or "")
        url = (item.get("url") or item.get("detailUrl") or
               (f"https://www.sauto.cz/inzerce/osobni/{slug}" if slug else ""))

        if not url:
            continue

        results.append({
            "title":  title,
            "price":  price,
            "url":    url,
            "source": "sauto",
            "detail": {
                "year":         year,
                "km":           km,
                "fuel":         item.get("fuel", ""),
                "transmission": item.get("transmission", ""),
                "body":         item.get("bodyStyle") or item.get("category", ""),
            },
        })

    if skipped:
        log.info(f"  [sauto] post-filter removed {skipped} listings")
    log.info(f"  [sauto] {len(results)} qualifying listings for '{znacka} {model}'")
    return results
