#!/usr/bin/env python3
"""
RADAR Watcher Agent — auta/Sauto.cz + nemovitosti/Sreality.cz (self-contained)

Reads active watcher_requests from Supabase, searches Sauto.cz and
Sreality.cz for listings matching stored filters, deduplicates via
watcher_alerts, optionally sends email alerts via Resend.

Required env vars:
  SUPABASE_URL          (= VITE_SUPABASE_URL)
  SUPABASE_SERVICE_KEY  (service role — bypasses RLS)
Optional:
  RESEND_API_KEY        (email disabled if not set)
  WATCHER_FROM_EMAIL    (default: hlidac@radar-newsletter.cz)
"""

import os
import sys
import time
import logging
import unicodedata
from datetime import datetime, timedelta, timezone
import requests as http

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger("watcher")

# ── Config ────────────────────────────────────────────────────────────────────

SUPABASE_URL         = os.environ.get("SUPABASE_URL", "").rstrip("/")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
RESEND_API_KEY       = os.environ.get("RESEND_API_KEY", "")
FROM_EMAIL           = os.environ.get("WATCHER_FROM_EMAIL", "hlidac@radar-newsletter.cz")

# Email delivery is intentionally disabled until Resend sender domain is
# verified and production-ready. Set to True only when ready.
EMAIL_ENABLED = False

# Reject listings priced below this (CZK). Real used cars on Sauto are
# essentially never under 10k — anything lower is spam, parts, or a
# listing error and would produce noisy/useless alerts.
MIN_PRICE_FLOOR = 10_000

# Time-based cooldown: if a fingerprint was already alerted within this
# window, skip re-alerting even if it resurfaces under a new URL. Older
# fingerprint hits still count as long-term dedup (same physical car).
COOLDOWN_DAYS = 7

# Cap new user-facing alerts per request per run. Broad queries (e.g.
# "Škoda Octavia, do 250k Kč") match dozens of listings on first contact;
# without a cap this floods watcher_alerts and would later spam the user.
MAX_NEW_PER_RUN = 5

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    log.error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set.")
    sys.exit(1)

SB_HEADERS = {
    "apikey":        SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type":  "application/json",
    "Prefer":        "return=representation",
}

# ── Supabase helpers ──────────────────────────────────────────────────────────

def sb_get(table, params):
    r = http.get(f"{SUPABASE_URL}/rest/v1/{table}",
                 headers=SB_HEADERS, params=params, timeout=10)
    r.raise_for_status()
    return r.json()

def sb_post(table, payload):
    r = http.post(f"{SUPABASE_URL}/rest/v1/{table}",
                  headers=SB_HEADERS, json=payload, timeout=10)
    r.raise_for_status()
    return r.json()

def get_active_requests():
    return sb_get("watcher_requests", {"active": "eq.true", "select": "*"})

def _parse_iso(ts: str):
    if not ts:
        return None
    try:
        return datetime.fromisoformat(str(ts).replace("Z", "+00:00"))
    except Exception:
        return None

def get_alerted_keys(request_id):
    """
    Returns (alerted_urls, recent_fps, old_fps) for this request.
      recent_fps : fingerprints alerted within COOLDOWN_DAYS → cooldown skip
      old_fps    : fingerprints alerted before that         → long-term dedup
    Falls back to URL-only if fingerprint column doesn't exist yet.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=COOLDOWN_DAYS)
    try:
        rows = sb_get("watcher_alerts", {
            "request_id": f"eq.{request_id}",
            "select":     "listing_url,listing_fingerprint,created_at",
        })
        urls, recent, old = set(), set(), set()
        for r in rows:
            if r.get("listing_url"):
                urls.add(r["listing_url"])
            fp = r.get("listing_fingerprint")
            if not fp:
                continue
            ts = _parse_iso(r.get("created_at"))
            if ts and ts >= cutoff:
                recent.add(fp)
            else:
                old.add(fp)
        return urls, recent, old
    except http.HTTPError as e:
        log.warning(f"  dedup: fingerprint/created_at column missing ({e}); "
                    f"falling back to URL-only dedup. "
                    f"Migration: ALTER TABLE watcher_alerts "
                    f"ADD COLUMN listing_fingerprint text;")
        rows = sb_get("watcher_alerts", {
            "request_id": f"eq.{request_id}",
            "select":     "listing_url",
        })
        return {r["listing_url"] for r in rows}, set(), set()

def insert_alert(request_id, listing_url, listing_price, listing_fingerprint=None):
    payload = {
        "request_id":    request_id,
        "listing_url":   listing_url,
        "listing_price": listing_price,
    }
    if listing_fingerprint:
        payload["listing_fingerprint"] = listing_fingerprint
    try:
        sb_post("watcher_alerts", payload)
    except http.HTTPError as e:
        # Column missing — retry without fingerprint so MVP keeps running
        if listing_fingerprint and "fingerprint" in str(e).lower():
            log.warning("  dedup: writing alert without fingerprint (column missing)")
            payload.pop("listing_fingerprint", None)
            sb_post("watcher_alerts", payload)
        else:
            raise

# ── Shared parsing helpers ────────────────────────────────────────────────────

def _parse_int(val) -> int:
    try:
        return int(str(val).replace(" ", "").replace("\xa0", "").replace(",", "").split(".")[0])
    except (ValueError, TypeError):
        return 0

def _parse_year(val) -> int:
    """Extract year from ISO date string like '2016-03-01'."""
    if not val:
        return 0
    try:
        return int(str(val)[:4])
    except (ValueError, TypeError):
        return 0

def _to_seo(text: str) -> str:
    """Convert Czech brand/model name to URL slug (removes diacritics, lowercases)."""
    normalized = unicodedata.normalize("NFD", text)
    ascii_str  = "".join(c for c in normalized if unicodedata.category(c) != "Mn")
    return ascii_str.lower().strip().replace(" ", "-")

# ── Sauto.cz search (inline) ──────────────────────────────────────────────────
#
# API: https://www.sauto.cz/api/v1/items/search
# Confirmed working params (inspected April 2026):
#   category_id=838          personal cars
#   manufacturer_model_seo   "skoda:octavia" or just "skoda" (SEO slugs, colon-separated)
#   condition_seo=ojete      used cars
#   price_to                 max price CZK
#   tachometer_to            max mileage km
#   limit                    result count
# NOT supported by API (applied in Python post-filter):
#   year_from / year_to      use manufacturing_date field
#   fuel, transmission, body apply after fetch
# Response: { results: [...], pagination: {...} }
# Listing URL: https://www.sauto.cz/inzerce/osobni/{mfr_seo}/{model_seo}/{id}

SAUTO_API = "https://www.sauto.cz/api/v1/items/search"
SAUTO_HEADERS = {
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (compatible; RADAR-Watcher/3.0)",
}

# Known brand aliases / canonical forms. Anything not listed is matched
# exactly (no substring matching) to avoid false positives like "audi"
# leaking into "audi-sport" or "mercedes" grabbing unrelated trims.
BRAND_ALIASES = {
    "mercedes":       "mercedes-benz",
    "mercedes-benz":  "mercedes-benz",
    "vw":             "volkswagen",
    "volkswagen":     "volkswagen",
    "skoda":          "skoda",
    "škoda":          "skoda",
}

def _canon_brand(seo: str) -> str:
    s = (seo or "").lower().strip()
    return BRAND_ALIASES.get(s, s)

def _brand_matches(actual_seo: str, expected_seo: str) -> bool:
    """Strict: canonical brand must match exactly (handles mercedes↔mercedes-benz)."""
    if not expected_seo:
        return True
    return _canon_brand(actual_seo) == _canon_brand(expected_seo)

def _model_matches(actual_seo: str, expected_seo: str) -> bool:
    """Strict: model SEO must match exactly. No substring — 'fabia' ≠ 'fabia-combi'."""
    if not expected_seo:
        return True
    return (actual_seo or "").lower().strip() == expected_seo.lower().strip()

def search_sauto(filters: dict) -> list:
    znacka     = filters.get("znacka", "")
    model      = filters.get("model", "")
    max_price  = filters.get("max_price", 0)
    rok_od     = filters.get("rok_od", 0)
    rok_do     = filters.get("rok_do", 0)
    km_max     = filters.get("km_max", 0)

    if not znacka:
        log.warning("  [sauto] No brand (znacka) — skipping")
        return []

    # Build manufacturer_model_seo slug
    mfr_seo   = _to_seo(znacka)
    model_seo = _to_seo(model) if model else ""
    mfr_slug  = f"{mfr_seo}:{model_seo}" if model_seo else mfr_seo

    api_params = {
        "category_id":            838,
        "condition_seo":          "ojete",
        "manufacturer_model_seo": mfr_slug,
        "limit":                  50,
    }
    if max_price: api_params["price_to"]      = int(max_price)
    if km_max:    api_params["tachometer_to"] = int(km_max)
    # Filter out obvious junk at the API level too
    api_params["price_from"] = MIN_PRICE_FLOOR

    log.info(f"  Sauto query: manufacturer_model_seo={mfr_slug}"
             + (f", price_to={max_price}" if max_price else "")
             + (f", tachometer_to={km_max}" if km_max else "")
             + (f", year_from={rok_od} [post-filter]" if rok_od else "")
             + (f", year_to={rok_do} [post-filter]" if rok_do else ""))

    try:
        r = http.get(SAUTO_API, params=api_params, timeout=15, headers=SAUTO_HEADERS)
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        log.error(f"  Sauto API error: {e}")
        return []

    raw = data.get("results") or []
    warnings = data.get("warnings") or {}

    if not raw:
        log.warning(f"  Sauto: no results for '{mfr_slug}'. "
                    f"total={data.get('pagination', {}).get('total')} warnings={warnings}")
        return []

    # If Sauto warns that manufacturer_model_seo is unsupported/unknown,
    # the results are unfiltered — abort rather than store wrong matches.
    unsupported = warnings.get("unsupported_filters") or []
    if "manufacturer_model_seo" in unsupported:
        log.error(f"  Sauto: manufacturer_model_seo='{mfr_slug}' rejected by API "
                  f"(slug unknown). Zero matches stored to avoid false alerts.")
        return []

    total = data.get('pagination', {}).get('total', '?')
    log.info(f"  Sauto: {total} total matches, fetched {len(raw)}, applying post-filters…")

    results = []
    skipped_price = skipped_year = skipped_km = 0
    skipped_brand = skipped_model = skipped_too_cheap = 0

    for item in raw:
        price = _parse_int(item.get("price") or 0)
        year  = _parse_year(item.get("manufacturing_date") or item.get("in_operation_date"))
        km    = _parse_int(item.get("tachometer") or 0)

        # Brand/model guard — rejects items if API silently ignored our slug.
        # Now STRICT: exact canonical-brand match + exact model match.
        item_mfr   = (item.get("manufacturer_cb") or {}).get("seo_name", "")
        item_model = (item.get("model_cb") or {}).get("seo_name", "")
        if not _brand_matches(item_mfr, mfr_seo):
            skipped_brand += 1; continue
        if model_seo and not _model_matches(item_model, model_seo):
            skipped_model += 1; continue

        # Numeric post-filters
        if price < MIN_PRICE_FLOOR:                   skipped_too_cheap += 1; continue
        if max_price and price > max_price:           skipped_price += 1; continue
        if rok_od    and year and year < int(rok_od): skipped_year  += 1; continue
        if rok_do    and year and year > int(rok_do): skipped_year  += 1; continue
        if km_max    and km   and km   > int(km_max): skipped_km    += 1; continue

        title = (item.get("name") or
                 f"{item.get('manufacturer_cb', {}).get('name', znacka)} "
                 f"{item.get('model_cb', {}).get('name', model)}").strip()

        item_id     = item.get("id", "")
        mfr_seo_r   = item_mfr or mfr_seo
        model_seo_r = item_model or model_seo or "osobni"
        url = f"https://www.sauto.cz/inzerce/osobni/{mfr_seo_r}/{model_seo_r}/{item_id}"

        # Unified listing shape: { title, price, url, source, detail }
        # Fingerprint is computed per-source by _listing_fingerprint() later.
        results.append({
            "title":  title,
            "price":  price,
            "url":    url,
            "source": "sauto",
            "detail": {
                "year":       year,
                "km":         km,
                "brand_seo":  mfr_seo_r,
                "model_seo":  model_seo_r,
            },
        })

    skip_parts = []
    if skipped_brand:     skip_parts.append(f"{skipped_brand} wrong brand")
    if skipped_model:     skip_parts.append(f"{skipped_model} wrong model")
    if skipped_too_cheap: skip_parts.append(f"{skipped_too_cheap} below price floor ({MIN_PRICE_FLOOR})")
    if skipped_price:     skip_parts.append(f"{skipped_price} over price")
    if skipped_year:      skip_parts.append(f"{skipped_year} wrong year")
    if skipped_km:        skip_parts.append(f"{skipped_km} over km")
    if skip_parts:
        log.info(f"  Post-filter removed: {', '.join(skip_parts)}")
    log.info(f"  Sauto: {len(results)} qualifying listings after all filters")
    return results

# ── Sreality.cz search (inline) ───────────────────────────────────────────────
#
# API: https://www.sreality.cz/api/cs/v2/estates
# Response: { result_size, _embedded: { estates: [...] } }
# Listing URL: https://www.sreality.cz/detail/{seo.locality}/{hash_id}

SREALITY_API = "https://www.sreality.cz/api/cs/v2/estates"
SREALITY_HEADERS = {
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (compatible; RADAR-Watcher/3.0)",
}

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
    "1+kk":     2,
    "1+1":      3,
    "2+kk":     4,
    "2+1":      5,
    "3+kk":     6,
    "3+1":      7,
    "4+kk":     8,
    "4+1":      9,
    "5+kk":    10,
    "5+1":     11,
    "6-a-vice":12,
    "atypicky":16,
}

def _build_sreality_url(estate: dict) -> str:
    """Sestaví plnou URL inzerátu ze SEO slugu + hash_id."""
    hash_id = estate.get("hash_id", "")
    if not hash_id:
        return ""
    seo = estate.get("seo", {}) or {}
    slug = seo.get("locality", "")
    if slug:
        return f"https://www.sreality.cz/detail/{slug}/{hash_id}"
    return f"https://www.sreality.cz/detail/{hash_id}"

def search_sreality(filters: dict) -> list:
    """
    Query Sreality.cz public JSON API.
    Returns unified list of { title, price, url, source, detail }.
    """
    kategorie_main = (filters.get("kategorie_main") or "byt").lower()
    kategorie_type = (filters.get("kategorie_type") or "prodej").lower()
    max_price      = filters.get("max_price", 0)
    min_area       = filters.get("min_area", 0)
    region_id      = filters.get("region_id", 0)
    district_id    = filters.get("district_id", 0)
    dispozice      = filters.get("dispozice") or []

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
        codes = [str(DISPOZICE_MAP[d]) for d in dispozice if d in DISPOZICE_MAP]
        if codes:
            api_params["category_sub_cb"] = ",".join(codes)

    active = [f"{k}={v}" for k, v in api_params.items()
              if k not in ("per_page", "page", "tms")]
    log.info(f"  [sreality] filters: {', '.join(active) if active else 'none'}")

    try:
        r = http.get(SREALITY_API, params=api_params, timeout=15, headers=SREALITY_HEADERS)
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        log.error(f"  [sreality] API error: {e}")
        return []

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

        if max_price and price > max_price:
            skipped += 1
            continue

        title    = (estate.get("name") or estate.get("title") or "Inzerát").strip()
        locality = estate.get("locality") or ""
        area     = _parse_int(estate.get("usable_area") or estate.get("floor_area") or 0)

        url = _build_sreality_url(estate)
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

# ── Fingerprint (source-aware) ────────────────────────────────────────────────

KM_BUCKET_STEP     = 5_000    # km rounded down to nearest 5 000
PRICE_BUCKET_STEP  = 10_000   # Kč rounded down to nearest 10 000 (auta)
AREA_BUCKET_STEP   = 5        # m² rounded down to nearest 5
PRICE_BUCKET_NEMOV = 100_000  # Kč rounded down to nearest 100k (nemovitosti)

def _listing_fingerprint(listing: dict) -> str:
    """
    Source-aware stable ID for a physical listing, tolerant of minor drift.
    auta        → brand | model | year | km_bucket | price_bucket
    nemovitosti → locality_head | area_bucket | price_bucket_100k
    """
    source = (listing.get("source") or "").lower()
    price  = int(listing.get("price") or 0)
    d      = listing.get("detail") or {}

    if source == "sauto":
        b  = _canon_brand(d.get("brand_seo") or "")
        m  = (d.get("model_seo") or "").lower().strip()
        y  = int(d.get("year") or 0)
        kb = (int(d.get("km") or 0) // KM_BUCKET_STEP) * KM_BUCKET_STEP
        pb = (price // PRICE_BUCKET_STEP) * PRICE_BUCKET_STEP
        return f"sauto|{b}|{m}|{y}|{kb}|{pb}"

    if source == "sreality":
        loc = (d.get("locality") or "").split(",")[0].strip().lower()
        ab  = (int(d.get("area") or 0) // AREA_BUCKET_STEP) * AREA_BUCKET_STEP
        pb  = (price // PRICE_BUCKET_NEMOV) * PRICE_BUCKET_NEMOV
        return f"sreality|{loc}|{ab}|{pb}"

    # Unknown source — degrade to URL-based fingerprint so dedup still works
    return f"{source}|{listing.get('url','')}"

# ── Category dispatch layer ───────────────────────────────────────────────────

SEARCHERS = {
    "auta":        search_sauto,
    "nemovitosti": search_sreality,
}

def get_searcher(category: str):
    """Return the searcher callable for the given category (or None)."""
    return SEARCHERS.get((category or "").strip().lower())

def supported_categories() -> list:
    return [c for c, fn in SEARCHERS.items() if fn is not None]

def _build_filters(category: str, req: dict):
    """
    Translate a Supabase watcher_requests row into adapter-specific filters.
    Returns None for unsupported categories or missing required fields.
    """
    p            = req.get("params", {}) or {}
    target_price = req.get("target_price") or 0
    cat          = (category or "").strip().lower()

    if cat == "auta":
        znacka = (p.get("znacka") or "").strip()
        if not znacka:
            return None
        return {
            "znacka":    znacka,
            "model":     (p.get("model") or "").strip(),
            "max_price": int(target_price) if target_price else 0,
            "rok_od":    int(p["rokOd"]) if p.get("rokOd") else 0,
            "rok_do":    int(p["rokDo"]) if p.get("rokDo") else 0,
            "km_max":    int(p["kmMax"]) if p.get("kmMax") else 0,
        }

    if cat == "nemovitosti":
        return {
            "kategorie_main": (p.get("kategorie_main") or "byt").lower(),
            "kategorie_type": (p.get("kategorie_type") or "prodej").lower(),
            "max_price":      int(target_price) if target_price else 0,
            "min_area":       int(p["minArea"])    if p.get("minArea")    else 0,
            "region_id":      int(p["regionId"])   if p.get("regionId")   else 0,
            "district_id":    int(p["districtId"]) if p.get("districtId") else 0,
            "dispozice":      list(p.get("dispozice") or []),
        }

    return None

def _describe_what(category: str, params: dict) -> str:
    """Human-readable 'what is being watched' for emails/logs."""
    cat = (category or "").strip().lower()
    p   = params or {}
    if cat == "auta":
        z = (p.get("znacka") or "").strip()
        m = (p.get("model")  or "").strip()
        return (z + (" " + m if m else "")).strip()
    if cat == "nemovitosti":
        main = (p.get("kategorie_main") or "byt").lower()
        disp = p.get("dispozice") or []
        return f"{main} {', '.join(disp)}" if disp else main
    return cat

def _priority_sort(listings: list, target_price: int) -> list:
    """
    Best-first ordering so the cap keeps the MOST interesting listings.
    Primary: biggest discount below target (price - target; more negative = better).
    Tiebreak: newer year, then lower mileage.
    Nemovitosti fall back to plain price order (year/km default to 0).
    """
    tp = int(target_price or 0)
    def score(l):
        price = int(l.get("price") or 0)
        d = l.get("detail") or {}
        year = -int(d.get("year") or 0)   # newer → smaller → earlier
        km   =  int(d.get("km")   or 0)
        discount = price - tp if tp else price
        return (discount, year, km)
    return sorted(listings, key=score)

def _format_listing_detail(listing: dict) -> str:
    """Short detail line: year/km for auta, locality/area for nemovitosti."""
    d   = listing.get("detail") or {}
    src = (listing.get("source") or "").lower()
    parts = []
    if src == "sauto":
        if d.get("year"): parts.append(str(d["year"]))
        if d.get("km"):
            parts.append(f"{int(d['km']):,}\u00a0km".replace(",", "\u00a0"))
    elif src == "sreality":
        if d.get("locality"): parts.append(str(d["locality"]))
        if d.get("area"):     parts.append(f"{int(d['area'])} m²")
    else:
        for k in ("year", "km", "locality", "area"):
            if d.get(k): parts.append(str(d[k]))
    return " · ".join(parts)

EMAIL_CONFIG = {
    "auta": {
        "emoji":       "🚗",
        "kicker":      "RADAR · Hlídač cen",
        "hero":        "Nová nabídka na auto, které hlídáš 🚗",
        "subject_fmt": "🚗 RADAR Hlídač: {title} — {price_fmt} Kč",
        "context_fmt": ("Radar našel inzerát <strong>{what}</strong> "
                        "pod tvou cílovou cenu {target_fmt} Kč."),
    },
    "nemovitosti": {
        "emoji":       "🏠",
        "kicker":      "RADAR · Hlídač nemovitostí",
        "hero":        "Nová nabídka nemovitosti, kterou hlídáš 🏠",
        "subject_fmt": "🏠 RADAR Hlídač: {title} — {price_fmt} Kč",
        "context_fmt": ("Radar našel inzerát <strong>{what}</strong> "
                        "pod tvou cílovou cenu {target_fmt} Kč."),
    },
}

# ── Alert email ───────────────────────────────────────────────────────────────

def send_alert_email(to_email, req, listing) -> bool:
    """Returns True if email was successfully sent, False otherwise."""
    if not EMAIL_ENABLED:
        return False  # silently skip — logged at summary level

    category = (req.get("category") or "").strip().lower()
    cfg      = EMAIL_CONFIG.get(category, EMAIL_CONFIG["auta"])
    params   = req.get("params", {}) or {}
    what     = _describe_what(category, params)

    price_fmt  = f"{int(listing['price']):,}".replace(",", "\u00a0")
    target_fmt = (f"{int(req['target_price']):,}".replace(",", "\u00a0")
                  if req.get("target_price") else "—")
    detail_line = _format_listing_detail(listing)

    subject = cfg["subject_fmt"].format(title=listing['title'], price_fmt=price_fmt)
    context = cfg["context_fmt"].format(what=what, target_fmt=target_fmt)

    html = f"""<!DOCTYPE html><html><body style="font-family:sans-serif;background:#000613;color:#fff;padding:24px;max-width:560px">
  <div style="background:#000e20;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px">
    <p style="color:#ffd700;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:3px;margin:0 0 16px">{cfg["kicker"]}</p>
    <h1 style="color:#fff;font-size:22px;margin:0 0 8px">{cfg["hero"]}</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 24px">{context}</p>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="margin:0 0 6px;color:#fff;font-weight:700;font-size:16px">{listing['title']}</p>
      <p style="margin:0 0 6px;color:#22c55e;font-size:24px;font-weight:900">{price_fmt} Kč</p>
      {f'<p style="margin:0;color:rgba(255,255,255,0.45);font-size:12px">{detail_line}</p>' if detail_line else ''}
    </div>
    <a href="{listing['url']}" style="display:inline-block;background:#ffd700;color:#000;font-weight:900;font-size:13px;text-decoration:none;padding:12px 24px;border-radius:50px">
      Zobrazit inzerát →
    </a>
    <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:24px 0 0">
      RADAR Hlídač · radar-newsletter.cz
    </p>
  </div>
</body></html>"""

    r = http.post("https://api.resend.com/emails",
                  headers={"Authorization": f"Bearer {RESEND_API_KEY}",
                           "Content-Type":  "application/json"},
                  json={
                      "from":    f"RADAR Hlídač <{FROM_EMAIL}>",
                      "to":      [to_email],
                      "subject": subject,
                      "html":    html,
                  }, timeout=10)

    if r.status_code in (200, 201):
        log.info(f"  ✓ Alert sent → {to_email}")
        return True
    else:
        log.error(f"  Resend error {r.status_code}: {r.text[:200]}")
        return False

# ── Core loop ─────────────────────────────────────────────────────────────────

def process_request(req):
    p            = req.get("params", {}) or {}
    category     = (req.get("category") or "").strip().lower()
    req_id       = req["id"]
    email        = req["email"]
    target_price = req.get("target_price") or 0

    what = _describe_what(category, p)
    log.info(f"Request {req_id} [{category}] '{what}': "
             f"target ≤ {target_price} Kč → {email}")

    searcher = get_searcher(category)
    if searcher is None:
        log.warning(f"  category '{category}' not yet supported — skipping")
        return

    filters = _build_filters(category, req)
    if filters is None:
        log.warning(f"  required filter missing for [{category}] — skipping")
        return

    listings = searcher(filters)
    listings = _priority_sort(listings, filters.get("max_price") or target_price)
    alerted_urls, recent_fps, old_fps = get_alerted_keys(req_id)
    is_first_run = (not alerted_urls and not recent_fps and not old_fps)
    if is_first_run:
        log.info(f"  First run for this request — top {MAX_NEW_PER_RUN} become real "
                 f"alerts, remainder silently seeded as baseline (no email flood).")

    n_matched = n_stored = n_emailed = 0
    n_dup_url = n_dup_fp = n_cooldown = n_seeded = n_capped = 0

    for listing in listings:
        n_matched += 1
        fp = _listing_fingerprint(listing)

        if listing["url"] in alerted_urls:
            n_dup_url += 1
            continue
        if fp and fp in recent_fps:
            n_cooldown += 1
            log.info(f"  Cooldown skip ({COOLDOWN_DAYS}d): {listing['title']} "
                     f"[fp={fp}]")
            continue
        if fp and fp in old_fps:
            n_dup_fp += 1
            log.info(f"  Dedup (fingerprint, old): {listing['title']} — same listing, "
                     f"different URL [fp={fp}]")
            continue

        # Cap handling
        if n_stored >= MAX_NEW_PER_RUN:
            if is_first_run:
                # Silent baseline seed: write to DB so next run doesn't re-flood,
                # but don't log as match, don't email, don't count as "new".
                insert_alert(req_id, listing["url"], listing["price"], fp)
                alerted_urls.add(listing["url"])
                if fp:
                    recent_fps.add(fp)
                n_seeded += 1
            else:
                # Normal run past cap — defer to next run for natural throttling.
                n_capped += 1
            continue

        detail_str = _format_listing_detail(listing)
        detail_tag = f" ({detail_str})" if detail_str else ""
        log.info(f"  Match [{listing.get('source','?')}]: "
                 f"{listing['title']}{detail_tag} @ "
                 f"{listing['price']:,}\u00a0Kč".replace(",", "\u00a0"))

        insert_alert(req_id, listing["url"], listing["price"], fp)
        alerted_urls.add(listing["url"])
        if fp:
            recent_fps.add(fp)  # freshly alerted → inside cooldown window
        n_stored += 1

        if send_alert_email(email, req, listing):
            n_emailed += 1

        time.sleep(0.5)

    log.info(
        f"  → matched={n_matched} | dup_url={n_dup_url} | "
        f"dup_fingerprint={n_dup_fp} | cooldown_skip={n_cooldown} | "
        f"new={n_stored}/{MAX_NEW_PER_RUN} | "
        f"seeded_silently={n_seeded} | capped_deferred={n_capped} | "
        f"emailed={n_emailed} "
        f"({'disabled' if not EMAIL_ENABLED else 'enabled'})"
    )

def main():
    log.info("═" * 60)
    log.info("RADAR Watcher — multi-source run starting")
    log.info(f"Supported categories: {supported_categories()}")
    log.info(f"Email delivery: {'ENABLED' if EMAIL_ENABLED else 'DISABLED (set RESEND_API_KEY to enable)'}")

    reqs = get_active_requests()
    by_cat = {}
    for r in reqs:
        c = (r.get("category") or "").strip().lower()
        by_cat.setdefault(c, []).append(r)

    supported = set(supported_categories())
    handled   = [r for c, rs in by_cat.items() for r in rs if c in supported]
    skipped   = {c: len(rs) for c, rs in by_cat.items() if c not in supported}
    log.info(f"Active requests: {len(reqs)} total | "
             f"by category: {{ {', '.join(f'{c}={len(rs)}' for c, rs in by_cat.items())} }}")
    if skipped:
        log.info(f"Unsupported categories skipped: {skipped}")

    for req in handled:
        try:
            process_request(req)
        except Exception as e:
            log.error(f"Failed processing request {req.get('id')}: {e}")
        time.sleep(1)

    log.info("Watcher run complete")
    log.info("═" * 60)

if __name__ == "__main__":
    main()
