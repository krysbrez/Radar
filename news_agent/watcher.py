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

EMAIL_ENABLED = bool(RESEND_API_KEY)

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

SAUTO_API = "https://www.sauto.cz/api/search/v1/car"

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

def _parse_int(val):
    try:
        return int(str(val).replace(" ", "").replace("\xa0", "").replace(",", ""))
    except (ValueError, TypeError):
        return 0

def search_sauto(filters):
    znacka     = filters.get("znacka", "")
    model      = filters.get("model", "")
    max_price  = filters.get("max_price", 0)
    rok_od     = filters.get("rok_od", 0)
    rok_do     = filters.get("rok_do", 0)
    km_max     = filters.get("km_max", 0)
    palivo     = filters.get("palivo", "")
    prevodovka = filters.get("prevodovka", "")
    karoserie  = filters.get("karoserie", "")

    api_params = {"condition": "used", "sort": "date_desc", "limit": 50}
    if znacka:     api_params["manufacturer"] = znacka
    if model:      api_params["model"]        = model
    if max_price:  api_params["priceMax"]     = int(max_price)
    if rok_od:     api_params["yearFrom"]     = int(rok_od)
    if rok_do:     api_params["yearTo"]       = int(rok_do)
    if km_max:     api_params["mileageMax"]   = int(km_max)
    if palivo     and palivo     in PALIVO_MAP:     api_params["fuel"]         = PALIVO_MAP[palivo]
    if prevodovka and prevodovka in PREVODOVKA_MAP: api_params["transmission"] = PREVODOVKA_MAP[prevodovka]
    if karoserie  and karoserie  in KAROSERIE_MAP:  api_params["bodyStyle"]    = KAROSERIE_MAP[karoserie]

    active = [f"{k}={v}" for k, v in api_params.items() if k not in ("condition", "sort", "limit")]
    log.info(f"  Sauto filters: {', '.join(active) if active else 'none'}")

    try:
        r = http.get(SAUTO_API, params=api_params, timeout=15, headers={
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 (compatible; RADAR-Watcher/2.0)",
        })
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        log.error(f"  Sauto API error: {e}")
        return []

    raw = data.get("items") or data.get("data") or data.get("results") or []
    if not raw:
        log.warning(f"  Sauto empty results for '{znacka} {model}'. Keys: {list(data.keys())}")
        return []

    results = []
    skipped = 0
    for item in raw:
        price = _parse_int(item.get("price") or item.get("priceTotal") or item.get("totalPrice") or 0)
        year  = _parse_int(item.get("year")  or item.get("yearOfManufacture") or 0)
        km    = _parse_int(item.get("mileage") or item.get("km") or item.get("odometer") or 0)

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
            "year":   year,
            "km":     km,
        })

    if skipped:
        log.info(f"  Post-filter removed {skipped} listings")
    log.info(f"  Sauto: {len(results)} qualifying listings for '{znacka} {model}'")
    return results

# ── Alert email ───────────────────────────────────────────────────────────────

def send_alert_email(to_email, req, listing):
    if not EMAIL_ENABLED:
        log.info(f"  [email disabled] match logged but not sent → {to_email}: {listing['url']}")
        return

    params     = req.get("params", {}) or {}
    znacka     = (params.get("znacka") or "").strip()
    model_name = (params.get("model")  or "").strip()
    price_fmt  = f"{int(listing['price']):,}".replace(",", "\u00a0")
    target_fmt = (f"{int(req['target_price']):,}".replace(",", "\u00a0")
                  if req.get("target_price") else "—")

    detail_parts = []
    if listing.get("year"): detail_parts.append(str(listing["year"]))
    if listing.get("km"):   detail_parts.append(f"{int(listing['km']):,} km".replace(",", "\u00a0"))
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
      RADAR Hlídač · radar-newsletter.cz · Toto upozornění bylo odesláno jednorázově pro tento inzerát.
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
    else:
        log.error(f"  Resend error {r.status_code}: {r.text[:200]}")

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
        "znacka":     znacka,
        "model":      (p.get("model") or "").strip(),
        "max_price":  int(target_price) if target_price else 0,
        "rok_od":     int(p["rokOd"]) if p.get("rokOd") else 0,
        "rok_do":     int(p["rokDo"]) if p.get("rokDo") else 0,
        "km_max":     int(p["kmMax"]) if p.get("kmMax") else 0,
        "palivo":     p.get("palivo",     ""),
        "prevodovka": p.get("prevodovka", ""),
        "karoserie":  p.get("karoserie",  ""),
    }

    listings     = search_sauto(filters)
    alerted_urls = get_alerted_urls(req_id)
    new_alerts   = 0

    for listing in listings:
        if listing["url"] in alerted_urls:
            continue
        detail_parts = []
        if listing.get("year"): detail_parts.append(str(listing["year"]))
        if listing.get("km"):   detail_parts.append(f"{listing['km']:,} km".replace(",", "\u00a0"))
        detail_str = f" ({', '.join(detail_parts)})" if detail_parts else ""
        log.info(f"  New match: {listing['title']}{detail_str} @ {listing['price']:,} Kč".replace(",", "\u00a0"))
        insert_alert(req_id, listing["url"], listing["price"])
        send_alert_email(email, req, listing)
        alerted_urls.add(listing["url"])
        new_alerts += 1
        time.sleep(0.5)

    log.info(f"  → {new_alerts} new alert(s) sent")

def main():
    log.info("═" * 60)
    log.info("RADAR Watcher — auta/Sauto run starting")
    log.info(f"Email delivery: {'ENABLED' if EMAIL_ENABLED else 'DISABLED (set RESEND_API_KEY to enable)'}")

    reqs = get_active_requests()
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
