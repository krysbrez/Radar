#!/usr/bin/env python3
"""
RADAR Watcher Agent — auta/Sauto.cz

Reads active watcher_requests from Supabase, searches Sauto.cz for
listings matching stored filters, deduplicates via watcher_alerts,
optionally sends email alerts via Resend.

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

def get_alerted_urls(request_id):
    rows = sb_get("watcher_alerts", {
        "request_id": f"eq.{request_id}",
        "select": "listing_url",
    })
    return {r["listing_url"] for r in rows}

def insert_alert(request_id, listing_url, listing_price):
    sb_post("watcher_alerts", {
        "request_id":    request_id,
        "listing_url":   listing_url,
        "listing_price": listing_price,
    })

# ── Sauto.cz search ───────────────────────────────────────────────────────────
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

def _to_seo(text: str) -> str:
    """Convert Czech brand/model name to URL slug (removes diacritics, lowercases)."""
    normalized = unicodedata.normalize("NFD", text)
    ascii_str  = "".join(c for c in normalized if unicodedata.category(c) != "Mn")
    return ascii_str.lower().strip().replace(" ", "-")

def _seo_matches(actual: str, expected_seo: str) -> bool:
    """
    Fuzzy-match returned item's SEO name against what we searched for.
    Handles cases where the API silently ignores an unknown slug and returns
    unrelated results. Both directions checked to handle compound names
    (e.g. 'mercedes-benz' contains 'mercedes').
    """
    if not expected_seo:
        return True
    a = (actual or "").lower().strip()
    e = expected_seo.lower().strip()
    return e in a or a in e

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

def search_sauto(filters: dict) -> list[dict]:
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
    skipped_price = skipped_year = skipped_km = skipped_brand = 0

    for item in raw:
        price = _parse_int(item.get("price") or 0)
        year  = _parse_year(item.get("manufacturing_date") or item.get("in_operation_date"))
        km    = _parse_int(item.get("tachometer") or 0)

        # Brand/model guard — rejects items if API silently ignored our slug
        item_mfr   = (item.get("manufacturer_cb") or {}).get("seo_name", "")
        item_model = (item.get("model_cb") or {}).get("seo_name", "")
        if not _seo_matches(item_mfr, mfr_seo):
            skipped_brand += 1; continue
        if model_seo and not _seo_matches(item_model, model_seo):
            skipped_brand += 1; continue

        # Numeric post-filters
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

        results.append({"title": title, "price": price, "url": url, "year": year, "km": km})

    skip_parts = []
    if skipped_brand: skip_parts.append(f"{skipped_brand} wrong brand/model")
    if skipped_price: skip_parts.append(f"{skipped_price} over price")
    if skipped_year:  skip_parts.append(f"{skipped_year} wrong year")
    if skipped_km:    skip_parts.append(f"{skipped_km} over km")
    if skip_parts:
        log.info(f"  Post-filter removed: {', '.join(skip_parts)}")
    log.info(f"  Sauto: {len(results)} qualifying listings after all filters")
    return results

# ── Alert email ───────────────────────────────────────────────────────────────

def send_alert_email(to_email, req, listing) -> bool:
    """Returns True if email was successfully sent, False otherwise."""
    if not EMAIL_ENABLED:
        return False  # silently skip — logged at summary level

    params     = req.get("params", {}) or {}
    znacka     = (params.get("znacka") or "").strip()
    model_name = (params.get("model")  or "").strip()
    price_fmt  = f"{int(listing['price']):,}".replace(",", "\u00a0")
    target_fmt = (f"{int(req['target_price']):,}".replace(",", "\u00a0")
                  if req.get("target_price") else "—")

    detail_parts = []
    if listing.get("year"): detail_parts.append(str(listing["year"]))
    if listing.get("km"):   detail_parts.append(f"{int(listing['km']):,}\u00a0km".replace(",", "\u00a0"))
    detail_line = " · ".join(detail_parts)

    html = f"""<!DOCTYPE html><html><body style="font-family:sans-serif;background:#000613;color:#fff;padding:24px;max-width:560px">
  <div style="background:#000e20;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px">
    <p style="color:#ffd700;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:3px;margin:0 0 16px">RADAR · Hlídač cen</p>
    <h1 style="color:#fff;font-size:22px;margin:0 0 8px">Nová nabídka na auto, které hlídáš 🚗</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 24px">
      Radar našel inzerát <strong style="color:#fff">{znacka} {model_name}</strong> pod tvou cílovou cenu {target_fmt} Kč.
    </p>
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
                      "subject": f"🚗 RADAR Hlídač: {listing['title']} — {price_fmt} Kč",
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

    log.info(f"Request {req_id} [{category}]: target ≤ {target_price} Kč → {email}")

    if category != "auta":
        log.warning(f"  category '{category}' not yet supported — skipping")
        return

    znacka = (p.get("znacka") or "").strip()
    if not znacka:
        log.warning("  No brand (znacka) — skipping")
        return

    filters = {
        "znacka":    znacka,
        "model":     (p.get("model") or "").strip(),
        "max_price": int(target_price) if target_price else 0,
        "rok_od":    int(p["rokOd"]) if p.get("rokOd") else 0,
        "rok_do":    int(p["rokDo"]) if p.get("rokDo") else 0,
        "km_max":    int(p["kmMax"]) if p.get("kmMax") else 0,
    }

    listings     = search_sauto(filters)
    alerted_urls = get_alerted_urls(req_id)
    n_matched = n_stored = n_emailed = 0

    for listing in listings:
        n_matched += 1
        if listing["url"] in alerted_urls:
            continue  # already alerted, skip silently

        detail_parts = []
        if listing.get("year"): detail_parts.append(str(listing["year"]))
        if listing.get("km"):   detail_parts.append(f"{listing['km']:,}\u00a0km".replace(",", "\u00a0"))
        detail_str = f" ({', '.join(detail_parts)})" if detail_parts else ""
        log.info(f"  Match: {listing['title']}{detail_str} @ {listing['price']:,}\u00a0Kč".replace(",", "\u00a0"))

        insert_alert(req_id, listing["url"], listing["price"])
        alerted_urls.add(listing["url"])
        n_stored += 1

        if send_alert_email(email, req, listing):
            n_emailed += 1

        time.sleep(0.5)

    log.info(
        f"  → matched={n_matched} | new (not seen before)={n_stored} | "
        f"emailed={n_emailed} ({'disabled' if not EMAIL_ENABLED else 'enabled'})"
    )

def main():
    log.info("═" * 60)
    log.info("RADAR Watcher — auta/Sauto run starting")
    log.info(f"Email delivery: {'ENABLED' if EMAIL_ENABLED else 'DISABLED (set RESEND_API_KEY to enable)'}")

    reqs      = get_active_requests()
    auta_reqs = [r for r in reqs if (r.get("category") or "").strip().lower() == "auta"]
    log.info(f"Active requests: {len(reqs)} total, {len(auta_reqs)} auta")

    for req in auta_reqs:
        try:
            process_request(req)
        except Exception as e:
            log.error(f"Failed processing request {req.get('id')}: {e}")
        time.sleep(1)

    log.info("Watcher run complete")
    log.info("═" * 60)

if __name__ == "__main__":
    main()
