#!/usr/bin/env bash
# run_pipeline.sh — RADAR content pipeline: RSS → LLM → articles.js
#
# Usage:
#   OPENROUTER_API_KEY=sk-or-xxx ./run_pipeline.sh
#   ./run_pipeline.sh crypto        # single category
#   ./run_pipeline.sh "" 5          # all categories, top 5

set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$SCRIPT_DIR/news_agent/.last_run.json"
CATEGORY="${1:-}"
TOP="${2:-8}"

echo "=== RADAR Pipeline $(date '+%Y-%m-%d %H:%M') ==="

# Key check
if [ -z "${OPENROUTER_API_KEY:-}" ] || [ "${#OPENROUTER_API_KEY}" -lt 20 ]; then
  echo ""
  echo "✗ OPENROUTER_API_KEY is missing or looks invalid (len=${#OPENROUTER_API_KEY:-0})."
  echo "  Get a free key at https://openrouter.ai/keys and set it:"
  echo "  export OPENROUTER_API_KEY=sk-or-v1-..."
  echo ""
  exit 1
fi

# Dependencies
python3 -c "import feedparser, openai" 2>/dev/null || {
  echo "→ Installing dependencies..."
  pip3 install feedparser openai --quiet --break-system-packages 2>/dev/null \
    || pip3 install feedparser openai --quiet
}

# Step 1: Fetch + classify + enrich
echo ""
echo "→ Step 1: Fetch feeds & LLM enrichment (top $TOP)..."
ARGS="--use-config --top $TOP --out $OUT"
[ -n "$CATEGORY" ] && ARGS="$ARGS --category $CATEGORY"
python3 "$SCRIPT_DIR/news_agent/processor.py" $ARGS

# Validate enrichment
python3 - <<EOF
import json, sys
d = json.load(open("$OUT"))
enriched = [a for a in d.get("articles",[]) if a.get("radar_headline")]
print(f"  Fetched: {d.get('article_count',0)} | LLM-enriched: {len(enriched)}")
if not enriched:
    print("✗ No enriched articles produced. Check your OPENROUTER_API_KEY.")
    sys.exit(1)
for a in enriched[:3]:
    print(f"  [{a['category']}] {a['radar_headline'][:72]}")
EOF

# Step 2: Stitch into articles.js
echo ""
echo "→ Step 2: Stitch into articles.js..."
python3 "$SCRIPT_DIR/stitch.py" "$OUT"

echo ""
echo "✓ Done. Commit and push app/src/data/articles.js to publish."
