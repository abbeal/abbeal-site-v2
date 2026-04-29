# Prompts prêts à coller dans Cowork

> Séquence de prompts pour qu'un agent Cowork exécute les publications externes d'Abbeal. Chaque prompt est **autonome** (copie-colle direct, sans contexte préalable) et référence le brief complet `docs/cowork-publications-externes.md` que tu auras mis dans le Project Knowledge de Cowork au préalable.

---

## Setup préalable (5 min, à faire une fois)

### 1. Créer un Project Cowork "Abbeal — Publications externes"

1. Ouvre https://cowork.app → **New Project**
2. Nom : `Abbeal — Publications externes`
3. Dans **Project Knowledge / System Prompt**, colle le contenu complet de :
   - `/Users/sebastienlonjon/Documents/Claude/abbeal-site-v2/docs/cowork-publications-externes.md` (le brief)
   - `/Users/sebastienlonjon/Documents/Claude/abbeal-site-v2/ABBEAL_DESIGN_SYSTEM.md` (style/ton, utile pour les captions)
4. Settings : Authorize browser automation (indispensable pour créer des comptes Crunchbase, Wikidata, etc.)

### 2. Credentials à préparer (à stocker dans 1Password)

```
Email principal       : contact@abbeal.com
Email Sébastien perso : sebastien.lonjon@abbeal.com (pour Wikipedia)
Password pattern      : (utilise 1Password pour générer par site)
Téléphone vérif       : (ton numéro perso pour SMS 2FA)
Logo Abbeal           : /public/brand/mark-teal.png + wordmark-teal.png
OG image              : https://abbeal.com/brand/og-image.png
```

---

## Prompt 1 — Master plan (colle EN PREMIER)

```
Tu vas exécuter la checklist de publications externes Abbeal décrite dans le brief `cowork-publications-externes.md` (déjà chargé en Project Knowledge).

MISSION :
Enregistrer Abbeal sur 8 plateformes d'autorité (Crunchbase, Wikidata, LinkedIn, Glassdoor, Clutch, GoodFirms, Pappers, GitHub) pour améliorer le référencement Google et la visibilité dans les LLMs (ChatGPT, Claude, Perplexity, Gemini).

ORDRE D'EXÉCUTION (strict) :
1. Crunchbase (source LLMs #1)
2. Wikidata (Knowledge Graph Google)
3. LinkedIn Company Page (refresh 7,6k abonnés existants)
4. Glassdoor (claim fiche E1145298 existante)
5. Clutch (B2B services)
6. GoodFirms (B2B services alt)
7. Pappers / Societe.com (vérif cohérence adresse)
8. GitHub @abbeal organization (si existe)

RÈGLES ABSOLUES :
- JAMAIS créer de faux avis / fake reviews (Glassdoor, Clutch, etc.) — ban permanent si détecté.
- JAMAIS poster les credentials (login/password/token) dans les résumés ou le chat. Stocke-les dans 1Password en local.
- JAMAIS spammer les emails presse — 1 email par journaliste / mois max.
- Respecte les délais de quarantaine Wikipedia (4 jours pour nouveau compte).
- Rate limiting : pour les annuaires secondaires (Europages, Kompass), 1-2 soumissions par jour max.

DONNÉES SOURCE :
Utilise UNIQUEMENT les YAML data de la section "Identité entreprise" du brief. Si une info te manque, demande-la — ne l'invente pas.

RAPPORT :
Après chaque plateforme traitée, fournis :
- URL de la fiche créée
- Statut (soumis / approved / pending review)
- Délai d'attente estimé
- Actions de suivi nécessaires (répondre à email de vérif, appeler support, etc.)

DÉMARRE par la plateforme #1 (Crunchbase). Confirme que tu as bien accès au brief avant de commencer.
```

---

## Prompt 2 — Crunchbase (priorité #1)

```
Tâche : créer un profil entreprise Crunchbase complet pour Abbeal.

ÉTAPES :
1. Navigate to https://www.crunchbase.com/add-new
2. Si pas connecté, crée un compte avec contact@abbeal.com. Password via 1Password. Vérifie l'email.
3. Clic "Add Company" → formulaire entreprise.
4. Remplis TOUS les champs avec les YAML data du brief, section "Identité entreprise" + "CRUNCHBASE".
5. Logo à uploader : https://abbeal.com/brand/mark-teal.png
6. Social links à ajouter :
   - LinkedIn: https://www.linkedin.com/company/abbeal
   - YouTube: https://www.youtube.com/@abbeal8017
   - Website: https://abbeal.com
7. Founders (ajouter les 2) :
   - Sébastien Lonjon (CEO), LinkedIn: https://www.linkedin.com/in/sebastienlonjon/
   - Vianney Blanquart (COO), LinkedIn: https://www.linkedin.com/in/vianneyblanquart/
8. Industries : Information Technology, Software, Professional Services, Artificial Intelligence, Robotics, IT Consulting
9. Description courte : utilise le "EN (1 phrase)" du brief
10. Description longue : utilise le "EN (paragraphe long, 150 mots)" du brief
11. Soumets pour review.

RAPPORT ATTENDU :
- URL du profil créé (format : https://www.crunchbase.com/organization/abbeal)
- Statut : "pending review" (attendre 3-5 jours ouvrés)
- Credentials Crunchbase stockés en 1Password

DURÉE : 20-30 min.
```

---

## Prompt 3 — Wikidata (priorité #2)

```
Tâche : créer un item Wikidata pour Abbeal (Q-identifier).

PRÉ-REQUIS :
- Avoir un compte Wikipedia/Wikidata actif depuis au moins 4 jours (si pas de compte, crée-en un avec sebastien.lonjon@abbeal.com et attends 4 jours avant de reprendre cette tâche)

ÉTAPES :
1. Navigate to https://www.wikidata.org/wiki/Special:NewItem
2. Login avec le compte Wikipedia
3. Crée un nouvel item avec :
   - Label (en) : Abbeal
   - Label (fr) : Abbeal
   - Description (en) : French software engineering company
   - Description (fr) : Entreprise française d'ingénierie logicielle
4. Ajoute les "Statements" (P-properties) listées dans la section WIKIDATA du brief, en particulier :
   - P31 (instance of) : Q4830453 (business enterprise)
   - P17 (country) : Q142 (France)
   - P571 (inception) : 2015
   - P856 (official website) : https://abbeal.com
   - P159 (headquarters location) : Q90 (Paris)
   - P1128 (employees) : 51-100
   - P452 (industry) : Q189004 (IT consulting) + Q1412554 (software industry)
5. Pour les fondateurs (P112), cherche d'abord si Sébastien Lonjon et Vianney Blanquart ont des items Wikidata. Si oui, link. Si non, crée-les comme items Person basiques.
6. Ajoute des sources (P854 / formatter URL) où possible : pappers.fr, abbeal.com, linkedin.com.
7. Save.

RAPPORT ATTENDU :
- URL de l'item créé (format : https://www.wikidata.org/wiki/Q[nouveau_id])
- Q-identifier à noter (ex. Q123456789)
- Confirmation que les 2 fondateurs sont linkés ou créés
- Credentials Wikidata stockés en 1Password

DURÉE : 30-45 min.
```

---

## Prompt 4 — LinkedIn Company Page (priorité #3)

```
Tâche : mettre à jour la LinkedIn Company Page d'Abbeal (https://www.linkedin.com/company/abbeal), qui a 7,6k abonnés.

PRÉ-REQUIS :
- Accès admin à la page (Sébastien ou Vianney). Si pas accès, demande-moi.

ÉTAPES :
1. Login LinkedIn avec compte admin.
2. Navigate to https://www.linkedin.com/company/abbeal/admin/
3. Overview tab :
   - About : remplacer par le "EN (paragraphe long, 150 mots)" du brief
   - Website : https://abbeal.com
   - Industry : IT Services and IT Consulting
   - Company size : 51-200 employees
   - Headquarters : Paris, France
   - Company type : Privately held
   - Founded : 2015
   - Specialties : ajouter les 10 domaines suivants : Software Engineering, Applied AI, Data Engineering, Robotics, Legacy Modernization, Technical Recruitment, International Mobility, DevSecOps, Cloud Infrastructure, GreenOps
4. Overview tab (suite) :
   - Tagline : "La Tech qu'on aurait aimé trouver. On l'a fondée."
5. Branding :
   - Upload logo wordmark-teal.png (https://abbeal.com/brand/wordmark-teal.png)
   - Cover banner 1128×191 : si on n'en a pas de propre, laisser la bannière actuelle. Sinon upload.
6. Pages tab :
   - Ajouter "Mobbeal" comme showcase page si pas déjà fait
7. Locations :
   - Add Paris : 54 rue Greneta, 75002 Paris, France (primary)
   - Add Montréal : 4388 Rue Saint-Denis, H2J 2L1, Québec, Canada
   - Add Tokyo : 1-23-5 Higashi-Azabu, Minato-ku, 106-0044 Tokyo, Japon
8. Save chaque section.

RAPPORT ATTENDU :
- Confirmation des sections mises à jour
- Lien vers la page après refresh
- Screenshots avant/après si possible

DURÉE : 20 min.
```

---

## Prompt 5 — Glassdoor (priorité #4)

```
Tâche : claim et enrichir la fiche Glassdoor d'Abbeal (E1145298, note 3,9/5 sur 33 avis).

ÉTAPES :
1. Navigate to https://www.glassdoor.fr/Reviews/Abbeal-Avis-E1145298.htm
2. Clic "Own this company?" / "Gérer cette entreprise" → login employeur (créer compte si besoin, avec contact@abbeal.com).
3. Vérifier ownership par email sur contact@abbeal.com.
4. Dans le dashboard employeur :
   - Logo : upload wordmark-teal.png
   - Cover photo : upload une photo équipe depuis https://abbeal.com/moments/offsite-chalet-montreal.jpg
   - Company overview : remplacer par le "FR (paragraphe long, 150 mots)" du brief
   - Company size : 51-200 employees
   - Industry : IT Services, Consulting
   - Founded : 2015
   - Locations : les 3 adresses du brief
   - Website : https://abbeal.com
   - Revenue : "Private"
5. Répondre aux 2 avis négatifs de 2022-2023 :
   - "H B" (avis de juin 2022, 1/5) : réponse courte, professionnelle, factuelle, pas défensive. Exemple :
     "Bonjour, nous prenons toujours au sérieux les retours d'expérience. Depuis 2022, Abbeal a évolué significativement (nouveaux hubs Montréal et Tokyo, nouveau management, processus de matching plus rigoureux). Si vous souhaitez échanger directement, écrivez-nous à contact@abbeal.com. — L'équipe Abbeal"
   - "Adrien Carpentier" (avis d'avril 2023, 1/5) : même approche, adapter à l'échange LinkedIn mentionné. Ton courtois.
6. Ne pas créer de faux avis. Ne pas demander à l'équipe d'écrire de faux avis. Glassdoor détecte et ban.

RAPPORT ATTENDU :
- Confirmation claim réussi
- Liens vers les 2 réponses aux avis négatifs
- Checklist des champs mis à jour

DURÉE : 30 min.

SUIVI HORS-COWORK : je (Sébastien) demanderai à 5-10 employés actuels de laisser des avis sur plusieurs semaines (pas d'un coup, rate limiting anti-spam Glassdoor). Tu n'as pas à le faire.
```

---

## Prompt 6 — Clutch (priorité #5)

```
Tâche : créer un profil Clutch.co vérifié pour Abbeal.

ÉTAPES :
1. Navigate to https://clutch.co/get-listed
2. Crée un compte avec contact@abbeal.com.
3. Remplis le formulaire entreprise :
   - Company name : Abbeal
   - Website : https://abbeal.com
   - Logo : upload wordmark-teal.png
   - Founded : 2015
   - Industries served : FinTech, Retail, Industrial, Healthcare, Transportation, Energy, Telecom
   - Services : Custom Software Development, AI Development, IT Staff Augmentation, Data Science & BI, Cloud Consulting
   - Min project size : $25K+
   - Average hourly rate : $100-149/hr
   - Employees : 51-200
   - Locations : Paris (HQ), Montréal, Tokyo
4. Import 3-5 case studies. Pour chacune, utiliser les pages publiques de https://abbeal.com/en/cases/ :
   - robotique-jp-ros2-flotte (ROS 2 / robotics)
   - fintech-iso27001-devsecops (security / compliance)
   - banque-rag-cout-divise-10 (AI)
   - scale-up-mobilite-30-cloud (cloud / GreenOps)
   - legacy-cobol-japon-modernisation (legacy migration)
5. Soumettre pour Clutch verification (ils appelleront Abbeal au téléphone pour vérifier l'existence — prévois le numéro Sébastien ou Vianney).

RAPPORT ATTENDU :
- URL du profil Clutch créé (format : clutch.co/profile/abbeal)
- Statut : "pending verification"
- Numéro de téléphone à prévoir pour l'appel Clutch (prévenir Sébastien en amont)

DURÉE : 30-45 min.

SUIVI : je demanderai ensuite à 3 clients de laisser un verified review (Clutch appelle chaque client pour vérifier — pas d'avis fake possible). Tu n'as pas à gérer ça.
```

---

## Prompt 7 — GoodFirms (priorité #6)

```
Tâche : créer un profil GoodFirms.co pour Abbeal (similaire à Clutch, plus accessible).

ÉTAPES :
1. Navigate to https://www.goodfirms.co/companies/add
2. Inscription avec contact@abbeal.com.
3. Mêmes données que Clutch (cf. prompt #6) : logo, founded, services, industries, employees, locations, case studies.
4. Soumettre.

RAPPORT ATTENDU :
- URL profil créé
- Statut

DURÉE : 20 min (plus rapide que Clutch).
```

---

## Prompt 8 — Pappers / Societe.com (vérif administrative)

```
Tâche : vérifier la cohérence de l'adresse légale d'Abbeal sur Pappers.fr et Societe.com.

CONTEXTE :
- Adresse siège déclarée site : 54 rue Greneta, 75002 Paris
- Adresse sur Pappers actuellement : 7 IMPASSE DE MONT-LOUIS, 75011 PARIS (probablement ancienne, non mise à jour au INSEE)

ÉTAPES :
1. Naviguer sur https://www.pappers.fr/entreprise/abbeal-790172928
2. Lire la date de dernier update + l'adresse officielle INSEE.
3. Si l'adresse est 7 IMPASSE DE MONT-LOUIS → NOTER qu'une démarche de changement de siège social au greffe est nécessaire (environ 200€, 3-4 semaines). C'est une action humaine, Cowork ne peut pas le faire. Rapport la situation à Sébastien.
4. Si l'adresse est déjà 54 rue Greneta → rien à faire, cohérent.
5. Vérifier aussi Societe.com (https://www.societe.com/societe/abbeal-790172928.html) pour cohérence.
6. Si Pappers permet à l'entreprise d'enrichir sa fiche (description, logo, photos), le faire avec les data du brief.

RAPPORT ATTENDU :
- Adresse officielle INSEE actuelle
- Recommandation claire : "cohérent" OU "démarche changement siège nécessaire"
- Si enrichissement possible : screenshot avant/après

DURÉE : 15 min.
```

---

## Prompt 9 — GitHub @abbeal organization

```
Tâche : vérifier et créer/enrichir le profil GitHub @abbeal.

ÉTAPES :
1. Navigate to https://github.com/abbeal
2. Si l'organization existe :
   - Check son README. S'il est vide ou obsolète, créer/update un `.github` repo avec un README.md pro contenant :
     - Titre : "Abbeal — tri-geo engineering hub"
     - Pitch : paragraphe long EN du brief
     - Links : abbeal.com, LinkedIn, articles, cases
     - Open roles (si recrutement actif) : lien careers
   - Logo organization : https://abbeal.com/brand/mark-teal.png
3. Si l'organization n'existe pas :
   - Créer @abbeal avec contact@abbeal.com
   - Plan : Free (open source only) ou Team si besoin private repos
   - Public profile : description + website + location Paris
4. Ne pas publier de code interne. Uniquement projets OSS si Abbeal en a. Sinon, juste profile + README.

RAPPORT ATTENDU :
- URL du profil GitHub
- Statut : créé / existant enrichi / rien à faire

DURÉE : 20 min si création, 10 min si enrichissement.

IMPORTANT : GitHub est crawlé activement par ClaudeBot, GPTBot, etc. Une présence propre = signal LLM fort.
```

---

## Prompt 10 — Annuaires secondaires (batch)

```
Tâche : inscrire Abbeal sur 5 annuaires B2B secondaires, un par jour (rate limiting anti-spam).

ORDRE :
Jour 1 : Wellfound (ex-AngelList) — https://wellfound.com → créer company + open roles
Jour 2 : Europages — https://www.europages.fr → inscription B2B, description FR
Jour 3 : Kompass — https://fr.kompass.com → inscription B2B, description FR
Jour 4 : Pages Jaunes Pro — https://www.pagesjaunes.fr → fiche entreprise
Jour 5 : The Manifest — https://themanifest.com → profil (powered by Clutch, mention duplicate)

Pour chaque : utiliser les YAML data + descriptions du brief. Ne pas spammer tous les annuaires d'un coup.

RAPPORT ATTENDU :
Par jour, URL créée + statut.

DURÉE : 15-20 min / jour, sur 5 jours.
```

---

## Prompt 11 — Presse tech (actions humaines à préparer)

```
Tâche : préparer les envois presse mais NE PAS envoyer les emails automatiquement.

Les pitches presse doivent être envoyés manuellement par Sébastien depuis son adresse sebastien.lonjon@abbeal.com pour maximiser le taux de réponse. Cowork prépare les drafts, Sébastien envoie.

ÉTAPES :
1. Ouvrir le brief `cowork-publications-externes.md`, section "PRESSE & MÉDIAS TECH"
2. Pour chaque média (Maddyness, FrenchWeb, BFM, Les Échos, podcasts), générer un Gmail draft avec le template email fourni.
3. Les drafts doivent être dans le dossier "Brouillons" de sebastien.lonjon@abbeal.com, PAS envoyés.
4. Ne pas remplir le champ "To" si le contact n'est pas identifiable (laisser placeholder [redaction@...]).
5. Liste les drafts créés dans le rapport.

RAPPORT ATTENDU :
- Nombre de drafts Gmail créés
- Liste des médias visés
- Suggestions de timing d'envoi (mardi ou jeudi matin, 1 par semaine, pas en masse)

DURÉE : 20 min.
```

---

## Prompt 12 — Wikipedia FR (DIFFÉRÉ — wait for press)

```
Tâche : DRAFT ONLY. Ne pas publier.

CONTEXTE :
Wikipedia FR exige 2+ sources secondaires indépendantes (presse nationale, tech media, podcast tech) pour qu'un article d'entreprise soit accepté. Abbeal n'en a probablement pas encore 2 au moment où tu lis ça. Il faut ATTENDRE.

ÉTAPES :
1. Vérifier si Abbeal a déjà 2+ sources presse/podcast indépendantes (recherche Google "Abbeal" + filtres site:maddyness.com OR site:frenchweb.fr OR site:lesechos.fr OR site:bfmtv.com).
2. Si OUI → créer un compte Wikipedia avec sebastien.lonjon@abbeal.com, attendre 4 jours, puis publier le draft Wikipedia FR (fourni dans le brief section WIKIPEDIA FR) en remplaçant [SOURCE À AJOUTER] par les vraies URLs presse.
3. Si NON → ne rien faire. Noter dans le rapport "pas encore de sources presse suffisantes. Réessayer dans 3-6 mois après publication Medium + podcasts + tribunes".

RAPPORT ATTENDU :
- Nombre de sources presse indépendantes identifiées
- Décision : "go publish" OU "wait"
```

---

## Template de suivi (à remplir par Cowork au fil de l'eau)

Après chaque tâche :

```markdown
## [Plateforme] — [Date]

**Statut** : ✅ terminé / 🟡 pending review / 🔴 bloqué

**URL** : [URL de la fiche créée]

**Credentials** : stockés dans 1Password (tag : abbeal-[plateforme])

**Actions de suivi** :
- [ ] Vérifier email de validation reçu
- [ ] Relance dans X jours si pas de réponse
- [ ] Upload case studies additionnels
- [ ] ...

**Notes** :
[Problèmes rencontrés, particularités]
```

---

## Anti-patterns (à rappeler à Cowork)

- ❌ Ne jamais créer de faux avis / faux témoignages (Glassdoor, Clutch)
- ❌ Ne jamais spammer les emails presse (1 par journaliste par mois max)
- ❌ Ne jamais commit / afficher les credentials en clair
- ❌ Ne jamais publier sur Wikipedia avant d'avoir 2+ sources presse
- ❌ Ne jamais fermer le brief même après "succès" — beaucoup de plateformes demandent du follow-up (vérif téléphone, email, etc.)
- ❌ Ne jamais modifier le site abbeal.com / le code — c'est hors scope Cowork (c'est mon boulot)

---

## Priorités finales (si tu ne peux en faire que 3)

1. **Crunchbase** (LLMs)
2. **Wikidata** (Knowledge Graph Google)
3. **Glassdoor** (claim + réponses avis négatifs — immédiat pour le SEO recrutement)

Le reste peut attendre 2-4 semaines.

---

*Prompts version 2026-04-22. À adapter selon les spécificités de l'interface Cowork.*
