#!/usr/bin/env bash
# scripts/seo-snapshot.sh
# Snapshot SEO hebdo abbeal.com — Lighthouse 4 langues + index estim + structural checks
# Usage  : ./scripts/seo-snapshot.sh
# Cron   : 0 8 * * 1   (lundi 8h UTC)
# Requis : jq, curl. Pour Lighthouse: PSI_API_KEY ou chromium local + lighthouse npm.
# Output : reports/seo-snapshot-YYYY-MM-DD.md

set -euo pipefail

# --- Config ---
DOMAIN="abbeal.com"
LOCALES=("fr" "en" "ja" "fr-ca")
DATE=$(date +%Y-%m-%d)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${REPO_ROOT}/reports"
OUT_FILE="${OUT_DIR}/seo-snapshot-${DATE}.md"
mkdir -p "$OUT_DIR"

PSI_KEY="${PSI_API_KEY:-}"

# --- Helpers ---
log() { echo "[$(date +%H:%M:%S)] $*" >&2; }

psi_score() {
  local url="$1"
  local key_param=""
  [ -n "$PSI_KEY" ] && key_param="&key=$PSI_KEY"
  curl -sf --max-time 30 "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&strategy=mobile${key_param}" 2>/dev/null | \
    jq -c '{
      perf:  (.lighthouseResult.categories.performance.score // null),
      a11y:  (.lighthouseResult.categories.accessibility.score // null),
      seo:   (.lighthouseResult.categories.seo.score // null),
      bp:    (.lighthouseResult.categories["best-practices"].score // null),
      lcp:   (.lighthouseResult.audits["largest-contentful-paint"].displayValue // "n/a"),
      cls:   (.lighthouseResult.audits["cumulative-layout-shift"].displayValue // "n/a"),
      tbt:   (.lighthouseResult.audits["total-blocking-time"].displayValue // "n/a"),
      err:   (.error.message // null)
    }' 2>/dev/null || echo '{"err":"curl_failed"}'
}

http_check() {
  local url="$1"
  curl -sLo /dev/null -w "%{http_code} %{time_total}" --max-time 10 "$url"
}

hreflang_count() {
  local url="$1"
  # Case-insensitive: Next 16 emits hrefLang (camelCase React attr) in HTML.
  # A pure -c 'hreflang' match returns 0 on Next 16 output → false positive
  # ("INSUFFICIENT") even though the tags are present and Google parses them
  # case-insensitively.
  curl -sL --max-time 10 "$url" | grep -cEi 'hreflang' || echo 0
}

sitemap_count_per_locale() {
  curl -sL --max-time 10 "https://${DOMAIN}/sitemap.xml" | \
    grep -oE "<loc>[^<]+</loc>" | sed 's|<loc>||;s|</loc>||' | \
    awk -F'/' '{print $4}' | sort | uniq -c | sort -rn
}

# --- Begin report ---
{
  echo "# SEO Snapshot — ${DATE}"
  echo ""
  echo "**Run timestamp (UTC) :** ${TIMESTAMP}"
  echo "**Domain :** ${DOMAIN}"
  echo "**PSI mode :** $([ -n "$PSI_KEY" ] && echo "API key configured" || echo "⚠️  no API key (will likely 429)")"
  echo ""
  echo "---"
  echo ""
  echo "## 1. HTTP availability + TTFB"
  echo ""
  echo "| Locale | Status | Latence |"
  echo "|---|---|---|"
  for lang in "${LOCALES[@]}"; do
    log "HTTP check /$lang"
    result=$(http_check "https://${DOMAIN}/${lang}")
    code=$(echo "$result" | awk '{print $1}')
    time=$(echo "$result" | awk '{print $2}')
    echo "| /${lang} | ${code} | ${time}s |"
  done

  echo ""
  echo "## 2. Hreflang presence"
  echo ""
  echo "| Locale | hreflang occurrences in HTML |"
  echo "|---|---|"
  for lang in "${LOCALES[@]}"; do
    log "Hreflang /$lang"
    count=$(hreflang_count "https://${DOMAIN}/${lang}")
    flag="✅"
    [ "$count" -lt 4 ] && flag="❌ INSUFFICIENT"
    echo "| /${lang} | ${count} ${flag} |"
  done

  echo ""
  echo "## 3. Sitemap"
  echo ""
  echo "\`\`\`"
  sitemap_count_per_locale
  echo "\`\`\`"

  echo ""
  echo "## 4. Lighthouse (PageSpeed Insights)"
  echo ""
  echo "| Locale | Perf | A11y | SEO | BP | LCP | CLS | TBT | Erreur |"
  echo "|---|---|---|---|---|---|---|---|---|"
  for lang in "${LOCALES[@]}"; do
    log "PSI /$lang"
    json=$(psi_score "https://${DOMAIN}/${lang}")
    perf=$(echo "$json" | jq -r '.perf // "n/a"')
    a11y=$(echo "$json" | jq -r '.a11y // "n/a"')
    seo=$(echo "$json"  | jq -r '.seo  // "n/a"')
    bp=$(echo "$json"   | jq -r '.bp   // "n/a"')
    lcp=$(echo "$json"  | jq -r '.lcp  // "n/a"')
    cls=$(echo "$json"  | jq -r '.cls  // "n/a"')
    tbt=$(echo "$json"  | jq -r '.tbt  // "n/a"')
    err=$(echo "$json"  | jq -r '.err  // ""')
    echo "| /${lang} | ${perf} | ${a11y} | ${seo} | ${bp} | ${lcp} | ${cls} | ${tbt} | ${err} |"
  done

  echo ""
  echo "## 5. Schema.org JSON-LD presence"
  echo ""
  echo "| Locale | @types found |"
  echo "|---|---|"
  for lang in "${LOCALES[@]}"; do
    log "Schema /$lang"
    types=$(curl -sL --max-time 10 "https://${DOMAIN}/${lang}" | \
      grep -oE '<script type="application/ld\+json">[^<]+</script>' | \
      sed 's/<script[^>]*>//;s|</script>||' | \
      jq -r '."@type" // "n/a"' 2>/dev/null | tr '\n' ',' | sed 's/,$//')
    echo "| /${lang} | ${types:-n/a} |"
  done

  echo ""
  echo "## 6. Estimated indexation (Google site:)"
  echo ""
  echo "_NOTE_: Google a changé son layout en 2026 — le compteur \"About X results\" n'est plus dans le HTML statique."
  echo "Pour un comptage fiable : utiliser GSC API (searchanalytics.query) ou Ahrefs/SEMrush."
  echo "Tentative best-effort ci-dessous (peut retourner 0) :"
  echo ""
  echo "| Locale | Best-effort count |"
  echo "|---|---|"
  for lang in "${LOCALES[@]}"; do
    count=$(curl -sLA "Mozilla/5.0" --max-time 10 \
      "https://www.google.com/search?q=site%3A${DOMAIN}%2F${lang}%2F&hl=en" 2>/dev/null | \
      grep -oE "About [0-9,]+ result" | head -1 | grep -oE "[0-9,]+" || echo "n/a")
    echo "| /${lang} | ${count:-n/a} |"
    sleep 2
  done

  echo ""
  echo "---"
  echo ""
  echo "## Alertes (à scanner visuellement)"
  echo ""
  echo "- ❌ Si une ligne hreflang affiche 0 occurrences → escalader immédiatement"
  echo "- ❌ Si Perf mobile < 0.85 sur une locale → ouvrir un report détaillé"
  echo "- ❌ Si SEO < 0.95 → vérifier meta description, h1, canonical"
  echo "- ⚠️  Si TTFB > 500ms → vérifier Vercel Edge cache hit ratio"
  echo ""
  echo "_Generated by scripts/seo-snapshot.sh_"
} > "$OUT_FILE"

log "Done. Report written to: $OUT_FILE"
echo "$OUT_FILE"
