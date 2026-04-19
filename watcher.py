#!/usr/bin/env python3
"""
RADAR Watcher Agent — Sprint 3: multi-category dispatch
────────────────────────────────────────────────────────────
Čte aktivní watcher_requests ze Supabase (libovolná kategorie),
dispatchuje do správného source adapteru (Sauto, Sreality, …),
předchází duplicitním alertům přes watcher_alerts,
posílá alert emaily přes Resend.

Architektura:
  watcher.py              ← tento soubor: entry, DB, email, hlavní smyčka
  sources/__init__.py     ← registry category → search fn
  sources/sauto.py        ← Sauto.cz adapter
  sources/sreality.py     ← Sreality.cz adapter

Přidání nového marketplace:
  1. sources/<name>.py   → funkce search_<name>(filters) -> list[Listing]
  2. sources/__init__.py → přidat do SEARCHERS
  3. EMAIL_CONFIG níže   → subject a content tuning

Spuštění:
  lokálně:       python news_agent/watcher.py
  GH Actions:    cron 5 * * * *   (hodinově)

Povinné env vars:
  SUPABASE_URL          (= VITE_SUPABASE_URL)
  SUPABASE_SERVICE_KEY  (service role – bypass RLS)
Volitelné:
  RESEND_API_KEY        (bez něj email jen zaloguje)
  WATCHER_FROM_EMAIL    (default: hlidac@radar-newsletter.cz)
"""

import os
import sys
import time
import logging
import requests as http

from sources import get_searcher, supported_categories

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
)
log = logging.getLogger("watcher")

# ── Config ────────────────────────────────────────────────────

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

# ── Email config per category ─────────────────────────────────
# Subject, hero emoji/title a description line se liší podle toho,
# jestli hlídáme auto nebo byt. Zbytek HTML je sdílený (brand consistent).

EMAIL_CONFIG = {
    "auta": {
        "emoji":       "🚗",
        "kicker":      "RADAR · Hlídač aut",
        "hero":        "Nová nabídka na auto, které hlídáš",
        "subject_fmt": "🚗 RADAR Hlídač: {title} — {price_fmt} Kč",
        "context_fmt": "Radar našel inzerát <strong>{what}</strong> pod tvou cílovou cenu {target_fmt} Kč.",
    },
    "nemovitosti": {
        "emoji":       "🏠",
        "kicker":      "RADAR · Hlídač bytů",
        "hero":        "Nová nemovitost pod tvou cenou",
        "subject_fmt": "🏠 RADAR Hlídač: {title} — {price_fmt} Kč",
        "context_fmt": "Radar našel <strong>{what}</strong> pod tvou cílovou cenu {target_fmt} Kč.",
    },
}

# ── Supabase helpers ──────────────────────────────────────────

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


def get_active_requests_all() -> list[dict]:
    """Vrátí všechny aktivní watcher_requests napříč kategoriemi."""
    return sb_get("watcher_requests", {
        "active": "eq.true",
        "select": "*",
    })


def get_alerted_urls(request_id: str) -> set[str]:
    rows = sb_get("watcher_alerts", {
        "request_id": f"eq.{request_id}",
        "select":     "listing_url",
    })
    return {r["listing_url"] for r in rows}


def insert_alert(request_id: str, listing_url: str, listing_price: int):
    sb_post("watcher_alerts", {
        "request_id":    request_id,
        "listing_url":   listing_url,
        "listing_price": listing_price,
    })

# ── Helper: popis "co" inzerátu pro email ─────────────────────

def _describe_what(category: str, params: dict) -> str:
    """Lidsky čitelný popis toho, co se hlídá, do těla emailu."""
    if category == "auta":
        znacka = (params.get("znacka") or "").strip()
        model  = (params.get("model")  or "").strip()
        return f"{znacka} {model}".strip() or "auto"
    if category == "nemovitosti":
        kat    = (params.get("kategorie_main") or "byt").lower()
        dispo  = params.get("dispozice") or []
        dispo_str = (", ".join(dispo) if isinstance(dispo, list) else str(dispo))
        return f"{kat} {dispo_str}".strip() if dispo_str else kat
    return category

# ── Alert email (generic, category-aware) ─────────────────────

def _format_listing_detail(listing: dict) -> str:
    """Vyformátuje category-specific řádek s detailem (km, locality apod.)."""
    d = listing.get("detail", {}) or {}
    src = listing.get("source", "")
    parts = []
    if src == "sauto":
        if d.get("year"): parts.append(str(d["year"]))
        if d.get("km"):   parts.append(f"{int(d['km']):,} km".replace(",", "\u00a0"))
        if d.get("fuel"): parts.append(str(d["fuel"]))
    elif src == "sreality":
        if d.get("locality"): parts.append(str(d["locality"]))
        if d.get("area"):     parts.append(f"{int(d['area'])} m²")
    return " · ".join(parts)


def send_alert_email(to_email: str, req: dict, listing: dict):
    category = req.get("category", "")
    cfg = EMAIL_CONFIG.get(category, {
        "emoji":       "🔔",
        "kicker":      "RADAR · Hlídač cen",
        "hero":        "Nová nabídka",
        "subject_fmt": "RADAR Hlídač: {title} — {price_fmt} Kč",
        "context_fmt": "Radar našel <strong>{what}</strong> pod tvou cílovou cenu {target_fmt} Kč.",
    })

    params      = req.get("params", {}) or {}
    what        = _describe_what(category, params)
    price_fmt   = f"{int(listing['price']):,}".replace(",", "\u00a0")
    target_fmt  = (f"{int(req['target_price']):,}".replace(",", "\u00a0")
                   if req.get("target_price") else "—")
    detail_line = _format_listing_detail(listing)

    if not EMAIL_ENABLED:
        log.info(f"  [email disabled] match logged but not sent → {to_email}: {listing['url']}")
        return

    subject = cfg["subject_fmt"].format(title=listing["title"], price_fmt=price_fmt)
    context = cfg["context_fmt"].format(what=what, target_fmt=target_fmt)

    html = f"""
<!DOCTYPE html><html><body style="font-family:sans-serif;background:#000613;color:#fff;padding:24px;max-width:560px">
  <div style="background:#000e20;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:32px">
    <p style="color:#ffd700;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:3px;margin:0 0 16px">{cfg['kicker']}</p>
    <h1 style="color:#fff;font-size:22px;margin:0 0 8px">{cfg['hero']} {cfg['emoji']}</h1>
    <p style="color:rgba(255,255,255,0.5);font-size:14px;margin:0 0 24px">{context}</p>
    <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="margin:0 0 6px;color:#fff;font-weight:700;font-size:16px">{listing['title']}</p>
      <p style="margin:0 0 8px;color:#22c55e;font-size:24px;font-weight:900">{price_fmt} Kč</p>
      {f'<p style="margin:0;color:rgba(255,255,255,0.45);font-size:12px">{detail_line}</p>' if detail_line else ''}
    </div>
    <a href="{listing['url']}" style="display:inline-block;background:#ffd700;color:#000;font-weight:900;font-size:13px;text-decoration:none;padding:12px 24px;border-radius:50px">
      Zobrazit inzerát →
    </a>
    <p style="color:rgba(255,255,255,0.25);font-size:11px;margin:24px 0 0">
      RADAR Hlídač · radar-newsletter.cz · Toto upozornění bylo odesláno jednorázově pro tento inzerát.
    </p>
  </div>
</body></html>
"""

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
    else:
        log.error(f"  Resend error {r.status_code}: {r.text[:200]}")

# ── Filters builder (converts DB row → source-specific filters) ───

def _build_filters(category: str, req: dict) -> dict | None:
    """Složí filter dict pro danou kategorii z watcher_requests řádku."""
    p            = req.get("params", {}) or {}
    target_price = req.get("target_price") or 0

    if category == "auta":
        znacka = (p.get("znacka") or "").strip()
        if not znacka:
            log.warning(f"  request {req['id']}: auta bez značky — skip")
            return None
        return {
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

    if category == "nemovitosti":
        return {
            "kategorie_main": (p.get("kategorie_main") or "byt"),
            "kategorie_type": (p.get("kategorie_type") or "prodej"),
            "max_price":      int(target_price) if target_price else 0,
            "min_area":       int(p["minArea"]) if p.get("minArea") else 0,
            "region_id":      int(p["regionId"])   if p.get("regionId")   else 0,
            "district_id":    int(p["districtId"]) if p.get("districtId") else 0,
            "dispozice":      p.get("dispozice") or [],
        }

    # Jiná kategorie – předej params 1:1 a nech source adapter rozhodnout
    p_out = dict(p)
    if target_price:
        p_out.setdefault("max_price", int(target_price))
    return p_out

# ── Core loop ─────────────────────────────────────────────────

def process_request(req: dict):
    category = (req.get("category") or "").strip().lower()
    req_id   = req["id"]
    email    = req["email"]
    target   = req.get("target_price") or 0

    log.info(f"Request {req_id} [{category}]: target ≤ {target} Kč → {email}")

    searcher = get_searcher(category)
    if not searcher:
        log.warning(f"  unsupported category '{category}' — skip "
                    f"(supported: {supported_categories()})")
        return

    filters = _build_filters(category, req)
    if filters is None:
        return

    listings     = searcher(filters)
    alerted_urls = get_alerted_urls(req_id)
    new_alerts   = 0

    for listing in listings:
        if listing["url"] in alerted_urls:
            continue

        detail_str = _format_listing_detail(listing)
        log.info(f"  New match: {listing['title']}"
                 f"{f' ({detail_str})' if detail_str else ''}"
                 f" @ {listing['price']:,} Kč".replace(",", "\u00a0"))

        insert_alert(req_id, listing["url"], listing["price"])
        send_alert_email(email, req, listing)
        alerted_urls.add(listing["url"])
        new_alerts += 1
        time.sleep(0.5)

    log.info(f"  → {new_alerts} new alert(s) sent")


def main():
    log.info("═" * 60)
    log.info("RADAR Watcher — multi-category run starting")
    log.info(f"Email delivery: {'ENABLED' if EMAIL_ENABLED else 'DISABLED (set RESEND_API_KEY)'}")
    log.info(f"Supported categories: {', '.join(supported_categories())}")

    reqs = get_active_requests_all()
    log.info(f"Active requests total: {len(reqs)}")

    # Seřaď podle kategorie pro přehledný log
    reqs.sort(key=lambda r: (r.get("category", ""), r.get("id", "")))

    by_cat = {}
    for req in reqs:
        by_cat.setdefault(req.get("category", "?"), 0)
        by_cat[req.get("category", "?")] += 1
    for cat, cnt in by_cat.items():
        log.info(f"  {cat}: {cnt}")

    for req in reqs:
        try:
            process_request(req)
        except Exception as e:
            log.error(f"Failed processing request {req.get('id')}: {e}")
        time.sleep(1)

    log.info("Watcher run complete")
    log.info("═" * 60)


if __name__ == "__main__":
    main()
