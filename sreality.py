"""
RADAR Watcher — Sreality.cz adapter
────────────────────────────────────────────────────────────
Dotáže veřejné JSON API Sreality.cz:
  https://www.sreality.cz/api/cs/v2/estates

Filtry (klíče v params ze Supabase watcher_requests.params):
  kategorie_main   : "byt" | "dum" | "pozemek"     → category_main_cb
  kategorie_type   : "prodej" | "pronajem"          → category_type_cb
  max_price        : int (Kč)                       → czk_price_summary_order2
  min_area         : int (m²)                       → usable_area
  region_id        : int (Praha=10 atd.)            → locality_region_id
  district_id      : int                            → locality_district_id
  dispozice        : list[str] např. ["2+1","3+kk"] → category_sub_cb

Response shape (zjednodušený):
{
  "result_size": <int>,
  "_embedded": {
    "estates": [
      {
        "hash_id": <int>,
        "name":    "Prodej bytu 3+kk 80 m²",
        "locality":"Praha 5",
        "price":   5000000,
        "seo":     {"locality": "prodej-...", "category_main_cb": 1,
                    "category_sub_cb": 5, "category_type_cb": 1},
        "_links":  {"self": {"href": "/cs/v2/estates/<hash_id>"}},
        "_embedded":{"images":[{"_links":{"view":{"href":"..."}}}]}
      }
    ]
  }
}

URL inzerátu skládáme jako:
  https://www.sreality.cz/detail/{typ-slug}/{hash_id}
kde typ-slug vychází ze seo.locality (obsahuje plný SEO slug).
"""

import logging
import requests as http

log = logging.getLogger("watcher.sreality")

SREALITY_API = "https://www.sreality.cz/api/cs/v2/estates"

# ── Mapování UI → Sreality API hodnoty ───────────────────────
KATEGORIE_MAIN_MAP = {
    "byt":      1,
    "dum":      2,
    "pozemek":  3,
    # 4 = komerční, 5 = ostatní
}
KATEGORIE_TYPE_MAP = {
    "prodej":   1,
    "pronajem": 2,
    "drazba":   3,
}
# dispozice codes podle Sreality pro byty
DISPOZICE_MAP = {
    "1+kk":   2,
    "1+1":    3,
    "2+kk":   4,
    "2+1":    5,
    "3+kk":   6,
    "3+1":    7,
    "4+kk":   8,
    "4+1":    9,
    "5+kk":   10,
    "5+1":    11,
    "6-a-vice": 12,
    "atypicky": 16,
}


def _parse_int(val) -> int:
    try:
        return int(str(val).replace(" ", "").replace("\xa0", "").replace(",", ""))
    except (ValueError, TypeError):
        return 0


def _build_url(estate: dict) -> str:
    """Sestaví plnou URL inzerátu ze SEO slugu + hash_id."""
    hash_id = estate.get("hash_id", "")
    if not hash_id:
        return ""
    seo = estate.get("seo", {}) or {}
    slug = seo.get("locality", "")
    if slug:
        return f"https://www.sreality.cz/detail/{slug}/{hash_id}"
    # fallback – použije jen hash_id
    return f"https://www.sreality.cz/detail/{hash_id}"


def search_sreality(filters: dict) -> list[dict]:
    """
    Query Sreality.cz public JSON API.
    Returns unified list of { title, price, url, source, detail } after
    both API-level and Python-side filtering.
    """
    kategorie_main = (filters.get("kategorie_main") or "byt").lower()
    kategorie_type = (filters.get("kategorie_type") or "prodej").lower()
    max_price      = filters.get("max_price", 0)
    min_area       = filters.get("min_area", 0)
    region_id      = filters.get("region_id", 0)
    district_id    = filters.get("district_id", 0)
    dispozice      = filters.get("dispozice") or []

    # ── Build API query ──────────────────────────────────────
    api_params = {
        "per_page": 50,
        "page":     1,
        "tms":      "_t=1",  # cachebuster-like param Sreality občas vyžaduje
    }

    if kategorie_main in KATEGORIE_MAIN_MAP:
        api_params["category_main_cb"] = KATEGORIE_MAIN_MAP[kategorie_main]
    if kategorie_type in KATEGORIE_TYPE_MAP:
        api_params["category_type_cb"] = KATEGORIE_TYPE_MAP[kategorie_type]
    if max_price:
        api_params["czk_price_summary_order2"] = int(max_price)
    if min_area:
        api_params["usable_area"] = int(min_area)
    if region_id:
        api_params["locality_region_id"] = int(region_id)
    if district_id:
        api_params["locality_district_id"] = int(district_id)
    if dispozice:
        # Sreality očekává seznam oddělený čárkou pro více hodnot
        codes = [str(DISPOZICE_MAP[d]) for d in dispozice if d in DISPOZICE_MAP]
        if codes:
            api_params["category_sub_cb"] = ",".join(codes)

    active = [f"{k}={v}" for k, v in api_params.items() if k not in ("per_page", "page", "tms")]
    log.info(f"  [sreality] filters: {', '.join(active) if active else 'none'}")

    try:
        r = http.get(SREALITY_API, params=api_params, timeout=15, headers={
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; RADAR-Watcher/3.0)",
        })
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        log.error(f"  [sreality] API error: {e}")
        return []

    # Sreality vrací estates v _embedded
    estates = (data.get("_embedded") or {}).get("estates") or []
    if not estates:
        log.warning(f"  [sreality] empty results (result_size={data.get('result_size', 0)})")
        return []

    results = []
    skipped = 0
    for estate in estates:
        # Cena – preferuj price_czk.value_raw, pak price
        price_obj = estate.get("price_czk") or estate.get("price") or 0
        if isinstance(price_obj, dict):
            price = _parse_int(price_obj.get("value_raw") or price_obj.get("value") or 0)
        else:
            price = _parse_int(price_obj)

        # Post-filter cena (server občas vrací mimo range)
        if max_price and price > max_price:
            skipped += 1
            continue

        title    = (estate.get("name") or estate.get("title") or "Inzerát").strip()
        locality = estate.get("locality") or ""
        area     = _parse_int(estate.get("usable_area") or estate.get("floor_area") or 0)

        url = _build_url(estate)
        if not url:
            continue

        # Obrázek (první z images)
        image_url = ""
        images = (estate.get("_embedded") or {}).get("images") or []
        if images:
            links = images[0].get("_links") or {}
            view  = links.get("view") or links.get("self") or {}
            image_url = view.get("href", "")

        results.append({
            "title":  title,
            "price":  price,
            "url":    url,
            "source": "sreality",
            "detail": {
                "locality":  locality,
                "area":      area,
                "image_url": image_url,
            },
        })

    if skipped:
        log.info(f"  [sreality] post-filter removed {skipped} listings")
    log.info(f"  [sreality] {len(results)} qualifying listings "
             f"({kategorie_main} · {kategorie_type})")
    return results
