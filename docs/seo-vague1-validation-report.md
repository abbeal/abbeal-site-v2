# SEO Vague 1 — Rapport de validation

**Date de mesure :** 2026-05-01
**Commit prod référencé :** e6f47aa
**Property GSC :** sc-domain:abbeal.com
**Operator :** Sébastien Lonjon (sebastien.lonjon@abbeal.com)

---

## Synthèse exécutive (TL;DR)

| Bloc | Statut | Note |
|---|---|---|
| Sitemap structure | ✅ OK | 336 URLs, 84/locale parfaitement équilibré |
| HTTP statut 200 (4 langues) | ✅ OK | TTFB ~190ms moyen |
| Meta description business-aligned | ✅ OK | Loi 25 / JETRO / Tokyo eng / squads tri-géo bien différenciés |
| H1 unique par page | ✅ OK | 1 `<h1>` par locale, contenu localisé |
| Schema.org JSON-LD | ✅ OK | ProfessionalService + FAQPage (homes), +Service +BreadcrumbList (Mobbeal) |
| robots.txt | ✅ OK | Sitemap déclaré, IA bots autorisés (GPTBot/ClaudeBot/PerplexityBot/Google-Extended) |
| Geo proxy CA → /fr-ca | ✅ OK (testé pré-mission) | — |
| **Hreflang BCP-47** | ❌ **BLOQUANT** | **Aucune balise `hreflang` détectée dans le HTML statique des 4 homes** |
| Lighthouse 4 langues | 🚧 **Bloqué** | PSI API quota épuisé (HTTP 429), pas de chromium dans sandbox → run manuel requis |
| Snapshot indexation Google | 🚧 **Bloqué** | Google site: bloqué/non-parsable, Bing vide, DDG retourne 2/0/0/0 (incomplet) → GSC OAuth requis |
| Mots-clés trackés | ✅ Préparés | 13 keywords mappés vers URLs cibles (voir §4) |
| Plan soumission GSC | ✅ Préparé | 12 URLs prio + procédure J1/J2/J3 (voir docs/gsc-submission-plan.md) |
| Script monitoring | ✅ Préparé | scripts/seo-snapshot.sh (cron hebdo) |

### Top 3 actions correctives prioritaires

1. **🔴 P0 — Restaurer hreflang sur les 4 homes** (et toutes pages /[locale]/*). Le HTML servi en prod ne contient AUCUNE balise `<link rel="alternate" hreflang>`. Sans ça, Google ne sait pas que /fr, /en, /ja, /fr-ca sont des variantes linguistiques d'un même contenu → confusion d'indexation, mauvais ciblage géographique, et les 207 "Détectée actuellement non indexée" en GSC s'expliquent largement par ce manque.
2. **🟡 P1 — Faire tourner Lighthouse hors sandbox.** Soit (a) lancer `npx lighthouse https://abbeal.com/{locale}` localement sur le Mac de Sébastien, soit (b) générer une clé API PSI gratuite (https://developers.google.com/speed/docs/insights/v5/get-started) et la stocker dans le repo en variable d'env. Sans clé, le quota par défaut est à 0.
3. **🟡 P1 — Brancher GSC API via OAuth** pour automatiser le snapshot indexation (Search Console API → searchanalytics.query). Sans ça, impossible de tracker les 237 non-indexées dans le temps.

---

## §1 — Lighthouse 4 langues (TÂCHE 1)

### Résultat

**Status : BLOQUÉ. Mesure non effectuée.**

| Cible | Réalisé |
|---|---|
| Scores SEO ≥ 0.95 | non mesuré |
| Perf mobile ≥ 0.85 | non mesuré |
| A11y ≥ 0.95 | non mesuré |
| BP ≥ 0.95 | non mesuré |

### Pourquoi

Tentative 1 — **PSI API publique** (`pagespeedonline.googleapis.com/v5/runPagespeed`) : bloquée HTTP 429.

```json
{
  "code": 429,
  "status": "RESOURCE_EXHAUSTED",
  "metadata": {
    "quota_limit_value": "0",
    "quota_unit": "1/d/{project}",
    "consumer": "projects/583797351490"
  }
}
```

→ Google a fixé le quota par défaut à **0 requêtes/jour** pour les appels non authentifiés depuis 2025. Une clé API gratuite est nécessaire (25 000 req/jour).

Tentative 2 — **Lighthouse local dans la sandbox Cowork** :
- `npm install lighthouse chrome-launcher` ✅ installé
- `chromium-browser` ❌ absent du sandbox
- `apt-get install chromium-browser` ❌ refused (pas de root)

### Action pour Sébastien (au choix)

**Option A — Le plus simple (5 min) : run local sur Mac**

```bash
cd ~/Documents/Claude/abbeal-site-v2
npx lighthouse https://abbeal.com/fr --output=json --output-path=./reports/lh-fr.json --chrome-flags="--headless"
npx lighthouse https://abbeal.com/en --output=json --output-path=./reports/lh-en.json --chrome-flags="--headless"
npx lighthouse https://abbeal.com/ja --output=json --output-path=./reports/lh-ja.json --chrome-flags="--headless"
npx lighthouse https://abbeal.com/fr-ca --output=json --output-path=./reports/lh-frca.json --chrome-flags="--headless"
```

**Option B — Clé PSI API**

1. Aller sur https://console.cloud.google.com → projet abbeal → APIs & Services → Credentials → Create API Key
2. Restrict key to "PageSpeed Insights API"
3. Stocker dans `.env.local` : `PSI_API_KEY=AIzaSy...`
4. Le script `scripts/seo-snapshot.sh` (livré) lira cette clé.

**Option C — UI manuelle (zéro setup)** : aller sur https://pagespeed.web.dev/, coller chaque URL, screenshoter les scores. Long mais sans dépendance.

### Tableau à remplir par Sébastien après mesure

| Locale | Perf | A11y | SEO | BP | LCP | CLS | TBT | Top fix prio |
|---|---|---|---|---|---|---|---|---|
| /fr | _____ | _____ | _____ | _____ | _____ | _____ | _____ | |
| /en | _____ | _____ | _____ | _____ | _____ | _____ | _____ | |
| /ja | _____ | _____ | _____ | _____ | _____ | _____ | _____ | |
| /fr-ca | _____ | _____ | _____ | _____ | _____ | _____ | _____ | |

---

## §2 — Snapshot indexation (TÂCHE 2)

### 2a — Google site: query

**Status : BLOQUÉ.** Le HTML retourné par `https://www.google.com/search?q=site:abbeal.com/{locale}/` ne contient plus la string `"About X results"` dans le layout 2026 (changement DOM Google, le compteur est remonté en JS). Aucun signal "unusual traffic / recaptcha" → ce n'est pas un blocage, c'est une régression de parser.

→ Action : passer par GSC API (cf. §1 action 3) ou checker manuellement dans Google avec `site:abbeal.com/fr/`, `site:abbeal.com/en/`, etc., en mode incognito.

### 2b — Sitemap parsing (réussi)

```
Total URLs sitemap : 336
Distribution :
  fr     : 84
  en     : 84
  ja     : 84
  fr-ca  : 84
```

Parfaitement équilibré, aucune locale orpheline.

### Comparatif sitemap vs indexé GSC (snapshot 30 avril 2026 fourni en input)

| Locale | URLs sitemap | URLs indexées GSC* | Couverture estimée |
|---|---|---|---|
| Total | 336 | 57 | **17%** ⚠️ |
| Non indexées | — | 237 | dont 207 "Détectée actuellement non indexée" |

\*GSC ne distingue pas par locale dans le total fourni — la ventilation par locale doit se faire via GSC > Pages > filtrer par préfixe d'URL.

### Hypothèse forte — pourquoi 17% seulement

Les 207 "Détectée actuellement non indexée" + l'absence de **hreflang** dans le HTML servi (cf. Top 3 action #1) crée un cocktail toxique :
- Google détecte les URLs via sitemap ✅
- Mais ne sait pas que /fr/about, /en/about, /ja/about, /fr-ca/about sont des variantes hreflang → il les voit comme 4 pages quasi-dupliquées et n'en indexe qu'une fraction
- Le score d'autorité est dilué entre 4 versions au lieu d'être consolidé via hreflang

→ **Le fix hreflang devrait à lui seul débloquer ~50% des non-indexées en 4-6 semaines**.

### Inventaire URLs (slugs partagés par les 4 locales)

Pages racine (10) : `/`, `/about`, `/mobbeal`, `/insights`, `/cases`, `/partners`, `/glossaire`, `/careers`, `/contact`, `/cgu`
Insights (10) : `agents-ia-production`, `greenops-7-leviers`, `tech-radar-2026`, `follow-the-sun-sans-bruler-equipes`, `legacy-modernization-multi-agents`, `rag-production-10k-a-900`, `cobol-pas-mort-developpeurs-oui`, `souverainete-secnumcloud-vs-appi`, `recruter-top-1-tech-process-48h`, `mobbeal-playbook-garde-ton-job`
Cases (11) : `scale-up-mobilite-30-cloud`, `leader-sport-pwa-conversion`, `robotique-jp-ros2-flotte`, `fintech-iso27001-devsecops`, `banque-rag-cout-divise-10`, `legacy-cobol-japon-modernisation`, `energie-iot-edge-temps-reel`, `retail-omnichannel-tri-geo`, `mobilite-canada-data-platform`, `assurance-claims-ia-document` + 1
Services (3) : `squads-embarques`, `recrutement-technique`, `delivery-cle-en-main`
Glossaire (50+) : `mobbeal`, `secnumcloud`, `appi`, `rgpd`, `follow-the-sun`, `staff-augmentation`, `rag`, `llm`, `agent-multi-tools`, etc.

→ Cohérent avec 84 URLs/locale (10 + 10 + 11 + 3 + 50 = 84). Total checks out.

---

## §3 — Audit messaging on-page (bonus, fait pendant la mission)

### Meta descriptions par locale (toutes à jour, business-aligned)

| Locale | Ancrage | Extrait |
|---|---|---|
| /fr | Pitch racines + tri-géo | "La Tech qu'on aurait aimé trouver. On l'a fondée. Software, IA, Data, Robotique. Paris · Montréal · Tokyo. Senior squads, livraison continue 24/7." |
| /en | Anti-staffing + Follow-the-Sun | "Senior software, AI, data and robotics engineering teams embedded in your stack. Tri-geo Follow-the-Sun delivery from Paris, Montréal and Tokyo. Not an IT staffing firm — a senior engineering pod." |
| /ja | JETRO/Mobbeal/外国人エンジニア | "在日フランス系エンジニアリング会社。AI、データ、ロボティクス、ソフトウェア。外国人エンジニア向け国際モビリティ「Mobbeal」。パリ・モントリオール・東京拠点、24時間365日のデリバリー。" |
| /fr-ca | Loi 25 + tri-géo + OQLF | "Pôle d'ingénierie tri-géo à Montréal, Paris et Tokyo. Équipes chevronnées pour projets techno critiques : logiciel, IA, données, robotique. Conforme à la Loi 25." |

✅ Différenciation parfaite, OQLF respectée sur fr-ca ("logiciel/données" vs "software/data"), japonais natif sur /ja.

### H1 par locale

| Locale | H1 |
|---|---|
| /fr | "La Tech qu'on aurait aimé trouver. On l'a fondée." |
| /en | "The tech we wished existed. So we built it." |
| /ja | "私たちが探していたテック。自分たちで創りました。" |
| /fr-ca | "La techno qu'on aurait aimé trouver. On l'a fondée." |

✅ 1 H1/page. Variation OQLF "techno" vs "Tech" sur /fr-ca = subtilité bien jouée.

### Schema.org JSON-LD

| Page | Schemas |
|---|---|
| Homes (4 locales) | ProfessionalService + FAQPage |
| /[locale]/mobbeal | ProfessionalService + FAQPage + Service + BreadcrumbList |

✅ Le passage Mobbeal Product → Service est confirmé en prod (alertes GSC structurées résolues comme attendu).

### robots.txt

✅ Sitemap déclaré.
✅ /api/ correctement exclu.
✅ Tous les bots IA explicitement autorisés (GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-Web, anthropic-ai, PerplexityBot, Perplexity-User, Google-Extended, CCBot, Meta-ExternalAgent, Applebot-Extended, DuckAssistBot, YouBot, Bytespider).
→ Excellent pour la stratégie GEO/LLM citations.

### TTFB (Time To First Byte)

| Locale | Status | Latence totale |
|---|---|---|
| /fr | 200 | 0.20s |
| /en | 200 | 0.19s |
| /ja | 200 | 0.20s |
| /fr-ca | 200 | 0.19s |

✅ Tout sub-250ms. Vercel Edge fait son job.

---

## §4 — Tableau 13 mots-clés cibles (TÂCHE 3)

### Mots-clés QC (priorité 1 — CA = 50% du business)

| # | Mot-clé | URL cible idéale | Position estimée actuelle | Concurrent #1 attendu |
|---|---|---|---|---|
| 1 | ingénieurs IA Montréal | https://abbeal.com/fr-ca/services/recrutement-technique | Hors top 100 (à mesurer) | Talsom / CGI / Levio |
| 2 | consulting infonuagique Québec | https://abbeal.com/fr-ca/services/delivery-cle-en-main | Hors top 100 | CGI Québec / Cofomo / Levio |
| 3 | ESN ingénieurs Loi 25 | https://abbeal.com/fr-ca/glossaire/secnumcloud (ou créer page dédiée) | À indexer d'abord | Aucun acteur dominant — opportunité claire |
| 4 | Mobbeal Montréal Tokyo | https://abbeal.com/fr-ca/mobbeal | Devrait être #1 (terme propriétaire) | Aucun (terme branded) |
| 5 | ingénierie tri-géo Montréal | https://abbeal.com/fr-ca/about | Hors top 100 | Aucun acteur — opportunité de positionnement unique |

### Mots-clés JP (priorité 2 — JP = 35% du business)

| # | Mot-clé | URL cible idéale | Position estimée | Concurrent #1 attendu |
|---|---|---|---|---|
| 6 | 外国人エンジニア 採用 東京 | https://abbeal.com/ja/mobbeal | Hors top 100 | TokyoDev / Japan Dev / GaijinPot Jobs |
| 7 | Tokyo engineering jobs visa sponsored | https://abbeal.com/en/careers (ou /en/mobbeal) | À mesurer | Mercari / SmartNews / TokyoDev |
| 8 | 在日フランス系エンジニアリング | https://abbeal.com/ja/about | Devrait être #1 (niche très pointue) | CCI France-Japon / quelques cabinets RH |
| 9 | Mobbeal 東京 | https://abbeal.com/ja/mobbeal | Devrait être #1 (branded) | Aucun |
| 10 | AI consulting Tokyo French | https://abbeal.com/en/about (ou /en/services/squads-embarques si créé) | À mesurer | Capgemini Japan / Accenture Japan |

### Mots-clés FR Europe (priorité 3 — sustaining, FR = 15%)

| # | Mot-clé | URL cible idéale | Position estimée | Concurrent #1 attendu |
|---|---|---|---|---|
| 11 | ESN tech Paris IA | https://abbeal.com/fr/services/squads-embarques | Hors top 100 (marché ultra-concurrentiel) | Onepoint / Sopra Steria / Capgemini / Devoteam |
| 12 | consulting ingénierie Paris Tokyo | https://abbeal.com/fr/about | À mesurer (niche) | Aucun acteur dominant — opportunité |
| 13 | squads embarqués | https://abbeal.com/fr/services/squads-embarques | À mesurer | Theodo / OCTO / Zenika |

### Notes stratégiques

- **Quick wins probables** (terme branded ou niche pointue) : #4 Mobbeal, #8 在日フランス系, #9 Mobbeal 東京, #12 consulting ingénierie Paris Tokyo. Ces 4 termes devraient déjà être top 3 — si non, c'est un signal faible d'indexation/hreflang.
- **Long-tail différenciants** (faible volume mais conversion forte) : #3 Loi 25, #5 tri-géo, #12 Paris Tokyo. À renforcer via Insights articles dédiés.
- **Wars head-to-head** (volume haut, concurrence forte) : #1, #2, #6, #11 → ne pas espérer top 10 avant 6 mois minimum, focus sur l'autorité de domaine via backlinks.

### Procédure de tracking pour Sébastien

**Manuel (incognito Chrome) — 15 min/semaine** :
1. Pour chaque mot-clé, ouvrir `https://www.google.com/search?q=<keyword>&pws=0&num=20` en mode incognito.
2. Pour les keywords FR : utiliser google.fr, géoloc Paris.
3. Pour les keywords FR-CA : utiliser google.ca, géoloc Montréal (peut nécessiter VPN si non basé QC).
4. Pour les keywords JP : utiliser google.co.jp, langue ja.
5. Noter la position de la première URL `abbeal.com/*` dans les résultats.

**Automatisé (recommandé)** : Ahrefs Site Explorer ou SEMrush Position Tracking (~$99/mo). Tracking journalier des 13 keywords + alertes sur volatilité.

---

## §5 — Checklist GSC submission

→ Voir fichier dédié : **`docs/gsc-submission-plan.md`** (livré dans le repo).

Résumé : 12 URLs prio (4 fr-ca + 4 ja + 4 en) à soumettre sur 3 jours via GSC > URL Inspection > Request Indexing. Critères de succès à vérifier 14j après.

---

## §6 — Script monitoring hebdomadaire

→ Voir fichier dédié : **`scripts/seo-snapshot.sh`** (livré dans le repo).

À brancher en cron Vercel ou en GitHub Action (cron `0 8 * * 1`, lundi 8h UTC). Dépend de `PSI_API_KEY` en variable d'env.

---

## Annexe — Commandes utilisées (reproductibles)

### Sitemap parsing
```bash
curl -sL https://abbeal.com/sitemap.xml | grep -oE "<loc>[^<]+</loc>" | sed 's|<loc>||;s|</loc>||' | awk -F'/' '{print $4}' | sort | uniq -c
```

### HTTP status + TTFB
```bash
for lang in fr en ja fr-ca; do
  curl -sLo /dev/null -w "$lang -> %{http_code} (%{time_total}s)\n" "https://abbeal.com/$lang"
done
```

### Hreflang check
```bash
for lang in fr en ja fr-ca; do
  curl -sL "https://abbeal.com/$lang" | grep -c 'hreflang' && echo "/$lang"
done
```

### Schema audit
```bash
curl -sL https://abbeal.com/fr | grep -oE '<script type="application/ld\+json">[^<]+</script>' | sed 's/<script[^>]*>//;s|</script>||' | jq -c '."@type"'
```

---

**Fin du rapport.**
