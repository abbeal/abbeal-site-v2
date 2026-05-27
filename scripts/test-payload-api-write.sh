#!/usr/bin/env bash
#
# Test end-to-end de l'API write Payload (la mecanique que Cowork utilisera).
#
# Prerequis :
#  1. Dev server lance : PAYLOAD_SECRET=dev-only pnpm dev
#  2. Tu as genere un API Key dans /admin/collections/users/{ton-id}
#     (toggle "Enable API Key", clique "Generate New API Key", copie la valeur)
#  3. Tu exportes la cle avant de lancer ce script :
#     export PAYLOAD_API_KEY="ta-cle-generee-depuis-l-admin"
#
# Usage :
#   ./scripts/test-payload-api-write.sh
#
# Ce qu'on teste (4 endpoints) :
#   1. GET    /api/articles                 — list
#   2. POST   /api/articles                 — create
#   3. GET    /api/articles/{id}            — read by id
#   4. PATCH  /api/articles/{id}            — update (FR + EN locale)
#   5. DELETE /api/articles/{id}            — cleanup
#
# Si tout passe : Cowork peut programmer le meme flow pour publier
# automatiquement un nouvel article quand un besoin commercial arrive.

set -euo pipefail

# --- Config ---
BASE_URL="${BASE_URL:-http://127.0.0.1:3000}"
API_KEY="${PAYLOAD_API_KEY:?Erreur : exporte PAYLOAD_API_KEY=... avant de lancer (voir header du script)}"
AUTH_HEADER="Authorization: users API-Key ${API_KEY}"

# Slug de test horodate pour eviter les collisions si on relance
TEST_SLUG="test-cowork-$(date +%s)"

# Couleurs
G="\033[0;32m"
R="\033[0;31m"
Y="\033[1;33m"
N="\033[0m"

echo -e "${Y}═════════════════════════════════════════${N}"
echo -e "${Y}  Test API write Payload (flow Cowork)   ${N}"
echo -e "${Y}═════════════════════════════════════════${N}"
echo "  Base URL : ${BASE_URL}"
echo "  Slug test: ${TEST_SLUG}"
echo ""

# ─── 1. LIST ───────────────────────────────────────────────────────────────
echo -e "${Y}[1/5] GET /api/articles (list)${N}"
list_response=$(curl -sS -w "\n%{http_code}" -H "${AUTH_HEADER}" "${BASE_URL}/api/articles?limit=5")
http_code=$(echo "${list_response}" | tail -1)
body=$(echo "${list_response}" | sed '$d')
if [ "${http_code}" = "200" ]; then
  total=$(echo "${body}" | python3 -c "import sys,json; print(json.load(sys.stdin)['totalDocs'])")
  echo -e "${G}  ✓ ${http_code} — ${total} articles en DB${N}"
else
  echo -e "${R}  ✗ ${http_code}${N}"
  echo "${body}" | head -3
  exit 1
fi
echo ""

# ─── 2. CREATE ─────────────────────────────────────────────────────────────
echo -e "${Y}[2/5] POST /api/articles (create FR)${N}"
create_payload=$(cat <<EOF
{
  "slug": "${TEST_SLUG}",
  "title": "Article cree par Cowork (test API)",
  "excerpt": "Article de test cree via POST /api/articles pour valider le flow programmatique Cowork.",
  "metaDescription": "Test meta description SEO pour valider la persistance des champs Translatable.",
  "tag": "Engineering",
  "readTime": "2 min",
  "publishedAt": "$(date -u +%Y-%m-%d)",
  "featured": false,
  "body": [
    { "blockType": "h2", "content": "Pourquoi ce test ?" },
    { "blockType": "p", "content": "Cowork va recevoir un nouveau besoin commercial. Cowork ecrit l'article ici, en FR, EN, JA. L'article apparait sur abbeal.com sans intervention manuelle." },
    { "blockType": "callout", "tone": "teal", "content": "Si tu lis ca dans l'admin Payload, la chaine create -> persist -> read fonctionne." },
    { "blockType": "list", "items": [
      { "text": "API Key authentifiee" },
      { "text": "Body blocks corrects (h2 + p + callout + list)" },
      { "text": "Locale FR ecrite par defaut" }
    ], "ordered": false }
  ]
}
EOF
)
create_response=$(curl -sS -w "\n%{http_code}" \
  -X POST "${BASE_URL}/api/articles" \
  -H "${AUTH_HEADER}" \
  -H "Content-Type: application/json" \
  -d "${create_payload}")
http_code=$(echo "${create_response}" | tail -1)
body=$(echo "${create_response}" | sed '$d')
if [ "${http_code}" = "201" ]; then
  doc_id=$(echo "${body}" | python3 -c "import sys,json; print(json.load(sys.stdin)['doc']['id'])")
  echo -e "${G}  ✓ ${http_code} — created doc id=${doc_id}${N}"
else
  echo -e "${R}  ✗ ${http_code}${N}"
  echo "${body}" | head -10
  exit 1
fi
echo ""

# ─── 3. READ ───────────────────────────────────────────────────────────────
echo -e "${Y}[3/5] GET /api/articles/${doc_id}${N}"
read_response=$(curl -sS -w "\n%{http_code}" -H "${AUTH_HEADER}" "${BASE_URL}/api/articles/${doc_id}")
http_code=$(echo "${read_response}" | tail -1)
body=$(echo "${read_response}" | sed '$d')
if [ "${http_code}" = "200" ]; then
  title=$(echo "${body}" | python3 -c "import sys,json; print(json.load(sys.stdin)['title'])")
  block_count=$(echo "${body}" | python3 -c "import sys,json; print(len(json.load(sys.stdin)['body']))")
  echo -e "${G}  ✓ ${http_code} — title='${title}', ${block_count} blocks${N}"
else
  echo -e "${R}  ✗ ${http_code}${N}"
  echo "${body}" | head -5
  exit 1
fi
echo ""

# ─── 4. UPDATE (ajoute la locale EN) ────────────────────────────────────────
echo -e "${Y}[4/5] PATCH /api/articles/${doc_id}?locale=en (ajoute traduction EN)${N}"
update_payload=$(cat <<EOF
{
  "title": "Article created by Cowork (API test)",
  "excerpt": "Test article created via POST /api/articles to validate the programmatic Cowork flow.",
  "body": [
    { "blockType": "h2", "content": "Why this test?" },
    { "blockType": "p", "content": "Cowork receives a new business need. Cowork writes the article here in FR, EN, JA. The article appears on abbeal.com without manual intervention." }
  ]
}
EOF
)
update_response=$(curl -sS -w "\n%{http_code}" \
  -X PATCH "${BASE_URL}/api/articles/${doc_id}?locale=en" \
  -H "${AUTH_HEADER}" \
  -H "Content-Type: application/json" \
  -d "${update_payload}")
http_code=$(echo "${update_response}" | tail -1)
body=$(echo "${update_response}" | sed '$d')
if [ "${http_code}" = "200" ]; then
  en_title=$(echo "${body}" | python3 -c "import sys,json; print(json.load(sys.stdin)['doc']['title'])")
  echo -e "${G}  ✓ ${http_code} — EN title='${en_title}'${N}"
else
  echo -e "${R}  ✗ ${http_code}${N}"
  echo "${body}" | head -5
  exit 1
fi
echo ""

# ─── 5. DELETE (cleanup) ────────────────────────────────────────────────────
echo -e "${Y}[5/5] DELETE /api/articles/${doc_id} (cleanup)${N}"
delete_response=$(curl -sS -w "\n%{http_code}" \
  -X DELETE "${BASE_URL}/api/articles/${doc_id}" \
  -H "${AUTH_HEADER}")
http_code=$(echo "${delete_response}" | tail -1)
if [ "${http_code}" = "200" ]; then
  echo -e "${G}  ✓ ${http_code} — deleted${N}"
else
  echo -e "${R}  ✗ ${http_code}${N}"
  exit 1
fi
echo ""

# ─── Resume ─────────────────────────────────────────────────────────────────
echo -e "${G}═════════════════════════════════════════${N}"
echo -e "${G}  ✅ TOUS LES TESTS PASSENT                ${N}"
echo -e "${G}═════════════════════════════════════════${N}"
echo ""
echo "Cowork peut maintenant utiliser le meme flow :"
echo "  1. Auth via API Key (header 'Authorization: users API-Key <key>')"
echo "  2. POST /api/articles avec un payload JSON (body en Blocks)"
echo "  3. PATCH /api/articles/{id}?locale=en pour ajouter une traduction"
echo ""
echo "Doc API auto-generee : ${BASE_URL}/api/graphql-playground (GraphQL)"
echo "                       ${BASE_URL}/api (REST endpoints listing)"
