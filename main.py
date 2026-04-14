"""
RADAR News Agent — Main
Spusť: python main.py

Výstup: ../src/data/news.json  (nebo nastavíš OUTPUT_PATH)
"""

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from fetcher import fetch_all, deduplicate
from processor import pre_filter, process_with_claude

# ── Kam uložit output ────────────────────────────────────────
# Ve výchozím nastavení jde do src/data/news.json (React projekt)
# Uprav pokud má tvůj projekt jinou strukturu
OUTPUT_PATH = os.environ.get(
    "NEWS_OUTPUT_PATH",
    str(Path(__file__).parent.parent / "src" / "data" / "news.json"),
)


def run():
    print("\n🚀 RADAR News Agent — start\n")
    start = datetime.now(timezone.utc)

    # 1. Fetch
    raw = fetch_all(max_per_feed=15)
    if not raw:
        print("❌ Žádné články nebyly staženy. Zkontroluj síť nebo RSS zdroje.")
        sys.exit(1)

    # 2. Deduplicate
    unique = deduplicate(raw)

    # 3. Pre-filter (rychlý, bez AI)
    filtered = pre_filter(unique)
    print(f"[MAIN] Po filtraci: {len(filtered)} článků jde do Claude\n")

    # 4. Claude processing (category + summary + score)
    final = process_with_claude(filtered)

    # 5. Ulož output
    output = {
        "generated_at": start.isoformat(),
        "total": len(final),
        "articles": final,
    }

    out_path = Path(OUTPUT_PATH)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    elapsed = (datetime.now(timezone.utc) - start).seconds
    print(f"\n✅ Hotovo! {len(final)} článků uloženo → {out_path} ({elapsed}s)\n")


if __name__ == "__main__":
    run()
