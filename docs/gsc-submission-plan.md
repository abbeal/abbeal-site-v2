# GSC Submission Plan — Vague 1

**Owner :** Sébastien Lonjon (sebastien.lonjon@abbeal.com)
**Property :** sc-domain:abbeal.com
**Date de génération :** 2026-05-01
**Objectif :** soumettre manuellement les 12 URLs business prioritaires à GSC pour accélérer l'indexation des pages clés en post-relaunch tri-géo.

---

## ⚠️ Prérequis — à vérifier AVANT toute soumission

1. **Hreflang en prod** : actuellement absent du HTML servi (cf. seo-vague1-validation-report.md §1). Soumettre des URLs sans hreflang fonctionnel risque de gaspiller le budget "Request Indexing" GSC (limite ~10/jour). **Soit attendre que le fix hreflang soit en prod, soit accepter que les pages soient indexées en silo (sans consolidation cross-locale)**.
2. **Sitemap re-soumis** : aller dans GSC > Sitemaps, vérifier que `https://abbeal.com/sitemap.xml` est listé avec status "Success" et 336 URLs détectées. Si non, re-submit.
3. **Cache Vercel propre** : si un déploiement récent a été fait, attendre 5 min après promote pour que les Edge caches soient warm.

---

## 12 URLs prioritaires (par jour)

### Jour 1 — fr-ca (priorité business #1, CA = 50%)

| # | URL | Pourquoi prio |
|---|---|---|
| 1 | https://abbeal.com/fr-ca | Home — geo proxy CA y atterrit, fondation tri-géo |
| 2 | https://abbeal.com/fr-ca/mobbeal | Mobbeal QC — proposition unique mobilité Tokyo↔Montréal |
| 3 | https://abbeal.com/fr-ca/services/recrutement-technique | Service principal QC, ciblage "ingénieurs IA Montréal" |
| 4 | https://abbeal.com/fr-ca/cases/mobilite-canada-data-platform | Case study local QC, preuve de delivery |

### Jour 2 — ja (priorité business #2, JP = 35%)

| # | URL | Pourquoi prio |
|---|---|---|
| 5 | https://abbeal.com/ja | Home JP — pivot stratégique JETRO |
| 6 | https://abbeal.com/ja/mobbeal | Mobbeal JP — terme branded à indexer prio |
| 7 | https://abbeal.com/ja/cases/legacy-cobol-japon-modernisation | Case study Japon = preuve crédibilité marché local |
| 8 | https://abbeal.com/ja/cases/robotique-jp-ros2-flotte | Case study robotique JP = positionnement différenciant |

### Jour 3 — en (priorité business #3, marché global expat & sourcing intl)

| # | URL | Pourquoi prio |
|---|---|---|
| 9 | https://abbeal.com/en | Home EN — landing inbound LinkedIn international |
| 10 | https://abbeal.com/en/mobbeal | Mobbeal EN — sourcing engineers visa Tokyo |
| 11 | https://abbeal.com/en/careers | Talents pipeline international |
| 12 | https://abbeal.com/en/about | Pitch tri-géo Follow-the-Sun en EN |

---

## Procédure pas à pas (à répéter pour chaque URL)

1. Ouvrir https://search.google.com/search-console (compte sebastien.lonjon@abbeal.com)
2. Sélectionner property `sc-domain:abbeal.com`
3. En haut, **URL Inspection** → coller l'URL complète
4. Attendre le rapport (~10s)
5. Vérifier l'état :
   - ✅ "URL is on Google" = déjà indexée → noter la date de dernier crawl, passer à la suivante
   - ⚠️ "URL is not on Google" → cliquer **Request Indexing** → attendre la confirmation (~1min)
   - ❌ Erreur (5xx, robots, redirect, soft 404) → noter dans le tableau de suivi, ne PAS request indexing tant que l'erreur n'est pas corrigée
6. Cocher la ligne dans le tableau de suivi ci-dessous

### Quota GSC à connaître

- **Request Indexing** : ~10-12 URLs/jour par property (limite officielle Google, peut être moins si abus détecté).
- Si on hit la limite, le bouton devient grisé avec message "Quota exceeded". Reprendre le lendemain.

---

## Tableau de suivi (à remplir au fil de l'eau)

| # | URL | Date soumis | Status pre-submit | Indexée le | Notes |
|---|---|---|---|---|---|
| 1 | /fr-ca | __________ | __________ | __________ | |
| 2 | /fr-ca/mobbeal | __________ | __________ | __________ | |
| 3 | /fr-ca/services/recrutement-technique | __________ | __________ | __________ | |
| 4 | /fr-ca/cases/mobilite-canada-data-platform | __________ | __________ | __________ | |
| 5 | /ja | __________ | __________ | __________ | |
| 6 | /ja/mobbeal | __________ | __________ | __________ | |
| 7 | /ja/cases/legacy-cobol-japon-modernisation | __________ | __________ | __________ | |
| 8 | /ja/cases/robotique-jp-ros2-flotte | __________ | __________ | __________ | |
| 9 | /en | __________ | __________ | __________ | |
| 10 | /en/mobbeal | __________ | __________ | __________ | |
| 11 | /en/careers | __________ | __________ | __________ | |
| 12 | /en/about | __________ | __________ | __________ | |

---

## Vérification 14 jours après soumission (J+14)

À faire le **2026-05-18** (J+14 si soumission terminée 2026-05-04).

### Critères de succès

| Critère | Cible | Comment mesurer |
|---|---|---|
| Pages indexées sur les 12 soumises | ≥ 10/12 (>83%) | GSC > Pages > filtrer par chacune des 12 URLs |
| Pages totales indexées (sitemap-wide) | ≥ 100 (vs 57 actuel) | GSC > Pages > onglet "Indexed" |
| "Détectée actuellement non indexée" | ≤ 150 (vs 207 actuel) | GSC > Pages > onglet "Not indexed" → catégorie "Discovered – currently not indexed" |
| Impressions search 14j (sur les 12 URLs) | ≥ 50 cumulées | GSC > Performance > filtrer par page |

### Si critères NON atteints à J+14

→ Diagnostic obligatoire :
1. Re-vérifier hreflang (cf. action P0 du rapport principal). Si toujours absent, c'est probablement la cause #1.
2. Vérifier la présence de canonicals corrects sur chaque URL soumise (`<link rel="canonical">`).
3. Vérifier qu'aucune URL n'a un `noindex` accidentel (chercher `<meta name="robots" content="noindex"` dans le HTML servi).
4. Vérifier dans GSC > Pages > "Page with redirect" si aucune des 12 URLs n'est redirigée vers une autre.
5. Si tout est propre côté technique, c'est un problème d'autorité de domaine — booster avec backlinks externes (mention LinkedIn pages, partenaires, presse JETRO).

---

## Vague 2 (post-fix hreflang) — à planifier

Une fois le hreflang fixé en prod et confirmé en HTML servi, soumettre la **deuxième vague** :
- 12 URLs supplémentaires : top 3 insights × 4 locales (Mobbeal playbook + RAG production + Tech radar 2026)
- Procédure identique à celle ci-dessus.

---

**Fin du plan.**
