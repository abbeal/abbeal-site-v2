# Article de lancement — Medium / Maddyness / FrenchWeb

> Draft 2026-04-22 (v2). Publier depuis le profil Sébastien Lonjon. Target: CTOs, VPs Engineering, Founders tech, communauté French Tech.
> Longueur: ~1500 mots. Reading time: ~7 min. Backlinks vers abbeal.com ciblés.
>
> **v2 note** : le problème ESN n'est pas le T&M en soi (on fait aussi du T&M sur staff augmentation). Le problème, c'est le matching médiocre + le scope vague + l'absence d'accountability. Angle corrigé.

---

## Titre (3 variantes, tu choisis)

**A — Personnelle, punchy (recommandée) :**
> "J'ai commencé commercial chez Alten. Dix ans plus tard, j'ai fondé l'inverse."

**B — Data-driven :**
> "Ce qu'on a appris en 10 ans et 100 projets tech : retours terrain sans bullshit."

**C — Honnête :**
> "Le problème des ESN n'est pas la facturation. C'est le matching."

---

## Sous-titre (deck)

> Le jour où j'ai arrêté de vendre du CV-puzzle, mon métier a changé. Abbeal, dix ans plus tard : 3 hubs (Paris, Montréal, Tokyo), 100+ clients, 50+ ingés expatriés. Ce qu'on a appris — y compris ce qui nous distingue vraiment des ESN classiques (spoiler : ce n'est pas ce qu'on dit en général).

---

## Article complet (à copier-coller sur Medium)

### Intro (hook en 3 lignes)

En 2014, j'étais commercial junior chez Alten. Mon boulot : vendre des journées d'ingénieurs à des CTO pressés.

Un vendredi après-midi, un DSI me demande : "J'ai besoin de quelqu'un qui livre." Je lui envoie trois CVs. Je crois aux trois. Il choisit le moins cher. Le mec tient six semaines avant d'être out.

J'ai fait ce job deux ans de plus. J'ai appris comment marche le marché de l'ingénierie tech en France. Et j'ai appris ce qui dysfonctionne vraiment.

### Le problème n'est pas ce qu'on dit

On répète partout que le modèle ESN est cassé à cause du Time & Material (T&M). C'est un raccourci un peu facile.

Le T&M — facturer un ingénieur à la journée — est un modèle parfaitement légitime quand :
- le scope est flou ou évolutif (par définition du besoin client)
- la prestation est du staff augmentation pur (l'ingé rejoint l'équipe cliente)
- le client veut garder le pilotage produit

Chez Abbeal on fait du T&M régulièrement. En 2026, ça représente encore plus de la moitié de notre CA.

**Ce qui est cassé dans les ESN classiques, ce n'est pas le mode de facturation. C'est trois choses qui se cumulent :**

1. **Le matching est médiocre.** Le commercial cherche à caser un profil disponible, pas le profil idéal. Un ingé qui a lu 30 articles sur le RAG se retrouve vendu "senior en IA en production". Le client ne fait la différence qu'au bout de 8 semaines — quand c'est trop tard.

2. **Le scope reste délibérément flou.** "On se cale en sprint." Traduction : personne ne s'engage sur un livrable mesurable. Ni l'ESN (qui facture à la journée), ni l'ingé (qui livre ce qu'il peut), ni le client (qui ne sait pas ce qu'il voulait vraiment).

3. **L'exit est un tabou.** Si tu as bien fait ton boulot, tu t'es rendu indispensable. Si tu as mal fait ton boulot, on déménage avant que ça se voie. Dans les deux cas, l'ingé reste. On n'appelle jamais ça "dette d'exit", mais c'est exactement ce que c'est.

Le T&M ne crée pas ces problèmes. Il les amplifie quand on empile les trois.

### Ce qu'on a essayé de changer

En 2015, on a fondé Abbeal sur trois paris — pas sur le rejet du T&M.

1. **Sourcer les ingés nous-mêmes, ingénieur par ingénieur.** Pas de pool de CVs génériques. Nos commerciaux ne signent pas un deal sans que l'ingé technique pressenti ait validé qu'il est aligné avec le besoin.
2. **Définir un périmètre avec acceptance criteria avant de démarrer.** Même en T&M, même pour 3 mois, même sur un besoin flou. Ça force le client à préciser ce qu'il veut. Ça nous force à dire non aux missions sans sortie visible.
3. **Avoir une exit checklist formalisée, signée à la fin de chaque mission.** Tu dois pouvoir nous virer sans dette cachée. Code documenté, runbook à jour, succession formalisée, accès transférés.

Sur le mode de facturation, on fait les trois :
- **T&M** (staff augmentation intégré aux équipes clientes, scope évolutif)
- **Forfait** (delivery clé en main, scope cadré, engagement output)
- **Hybride** (cadrage court en T&M, puis build en forfait avec acceptance criteria écrits)

Le mode dépend du projet, pas du dogme.

C'était vendredi-après-midi simple sur le papier. On a mis dix ans à l'opérer vraiment.

### Ce qu'on a appris (les 5 trucs qui comptent)

#### 1. Le "senior" est un prix, pas un niveau

On dit "senior" dans le métier comme on dit "premium" dans l'e-commerce : ça veut tout et rien dire. Un ingé qui a lu 30 articles sur le RAG et un ingé qui a cassé un RAG en prod, ce n'est pas le même tarif. Mais c'est le même tarif.

Notre filtre interne : est-ce que l'ingé a déjà vécu un incident P1 à 3h du matin sur la techno qu'il va implémenter ? Si non, ce n'est pas du senior au sens Abbeal.

Ça coûte de sourcer comme ça. Notre conversion rate sur les CVs reçus est sous les 2%. Mais les placements tiennent 18 mois en moyenne contre 6 dans l'industrie.

#### 2. Follow-the-Sun, ça marche, mais pas comme on le dit

Trois hubs (Paris, Montréal, Tokyo), handoff toutes les 8h, standup async. Sur le papier, c'est du 24/7 fluide. En vrai, la qualité du handoff dépend à 90% de la qualité de la doc laissée.

Ce qu'on a appris à la dure :
- Chaque squad écrit un "daily summary" en 3 bullets avant la fin de sa shift — pas plus, pas moins.
- Une décision prise dans un fuseau doit être documentée sous 30 min dans l'outil partagé.
- On fait des rotations : chaque ingé passe 3-6 mois dans un autre hub tous les 2 ans, sinon les silos se forment.

Résultat mesuré sur nos projets tri-geo : lead time moyen d'un ticket à 2.3 jours, contre 4.1 sur équipes mono-fuseau équivalentes.

#### 3. L'IA en production n'est pas une feature, c'est une architecture

Depuis 2023, on nous demande du "RAG" à toutes les sauces. Notre règle : on n'implémente pas un RAG sans avoir d'abord un jeu d'évaluations et une métrique métier mesurable.

Sur un projet bancaire récent, on nous a demandé un assistant interne pour répondre aux questions des conseillers. Le POC interne tournait à 10 000 €/mois d'inférence. On a refait l'architecture : modèle local Mistral 7B pour 80% des requêtes simples, Claude Sonnet en fallback pour les complexes, routing hybride, cache embedding.

Résultat : 900 €/mois, qualité équivalente mesurée sur 2000 cas de test.

Ce qui compte, ce n'est pas le modèle. C'est le routing, le cache, les évals, et la capacité à dire "on ne déploie pas cette version parce que la qualité a baissé de 3% sur le dataset X".

#### 4. Le Japon n'est pas un marché tech exotique, c'est un marché tech en crise

On a ouvert Tokyo en 2021. On pensait vendre du conseil occidental à des boîtes japonaises — classique expat.

On s'est planté. Les boîtes japonaises ne veulent pas du conseil occidental. Elles veulent des ingés occidentaux embarqués dans leurs équipes, qui parlent japonais (ou du keigo basique) et qui comprennent que la prise de décision se fait par nemawashi, pas en réunion.

Mais il y a une vraie demande : 85% des grandes entreprises japonaises maintiennent encore du COBOL critique, et les dévs COBOL partent à la retraite massivement. En 2024, on a migré 4M lignes de COBOL pour une banque régionale, en 14 mois, avec une méthode multi-agents IA (Archéologue qui documente, Architecte qui recompose en Java, Nettoyeur qui supprime le mort).

Ce marché va exploser dans les 3 prochaines années. Peu de monde est prêt.

#### 5. L'ingé veut du sens, pas juste du salaire

On a 50+ ingés expatriés via notre programme Mobbeal. Tous ont quitté un CDI bien payé en France pour aller à Tokyo ou Montréal.

Quand on leur demande pourquoi, la réponse n'est jamais "le salaire". C'est toujours une des trois :
- "Je voulais bosser sur du Rust en prod, pas en side project."
- "Je voulais voir comment les Japonais font de la robotique dans la vraie vie."
- "Je voulais passer 2 ans à faire autre chose que du CRUD."

C'est ce qu'on appelle chez nous le "boring B2B SaaS fatigue". Les meilleurs ingés qu'on recrute ne veulent plus faire de dashboard Stripe en plus beau. Ils veulent toucher des systèmes qui comptent.

Le travail d'une ESN moderne, c'est d'amener ces gens-là à ces systèmes-là. Pas de les caser où il y a une mission ouverte.

### Ce qui reste à prouver

Abbeal n'est pas parfait. On a fait des erreurs, et on en referait.

On a mis trop longtemps à oser refuser des missions. Il nous a fallu 5 ans pour comprendre qu'un client qui nous demande "pouvez-vous baisser votre TJM ?" est un client qui ne va pas nous faire gagner d'argent, il va nous en faire perdre. On a appris à dire non proprement. C'est encore un chantier.

On reste petit (~50 ingés) parce qu'on refuse de grandir plus vite que notre capacité à sourcer sérieusement. On refuse deux-tiers des deals qu'on qualifie. C'est frustrant commercialement. C'est la seule façon de tenir la promesse.

On se trompe aussi sur certains sourcings. Environ 5% de nos ingés ne tiennent pas les 18 mois. Quand ça arrive, on assume : on remplace rapidement et on absorbe la perte. C'est le coût de la promesse matching.

### Pourquoi je raconte ça maintenant

On vient de refondre abbeal.com. On a aussi écrit publiquement, pour la première fois, nos méthodes : 10 case studies anonymisés, 10 articles techniques, un tech radar, un playbook Mobbeal, un glossaire technique de 50+ termes. Tout est sur [abbeal.com](https://abbeal.com).

Si vous êtes CTO ou VP Engineering et que vous cherchez une ESN qui se donne le droit de dire non, on a peut-être des choses à se dire.

Si vous êtes ingé senior et que vous voulez toucher du Rust en prod à Tokyo, ou du RAG bancaire à Paris, ou une data platform à Montréal, on recrute.

Dans les deux cas, on essaiera d'abord de matcher — pas de vendre.

---

**Sébastien Lonjon, CEO & founder Abbeal.**

Paris · Montréal · Tokyo.

[abbeal.com](https://abbeal.com) · [LinkedIn](https://www.linkedin.com/in/sebastienlonjon/) · contact@abbeal.com

---

## Checklist publication

- [ ] Relire, ajuster ton si besoin (surtout les sections 3 et 4 — les chiffres doivent rester exacts)
- [ ] Pub le mardi ou jeudi matin (8h30-10h CET)
- [ ] Upload sur Medium (profil perso, pas publication Medium payante) — tags : `engineering`, `startups`, `tech`, `frenchtech`, `career`
- [ ] Copier-coller le même article sur `dev.to` (publication simultanée boost SEO)
- [ ] Proposer à Maddyness → contact@maddyness.com, format "Tribune d'un CEO"
- [ ] Proposer à FrenchWeb → redaction@frenchweb.fr
- [ ] Proposer à BFM Business → "La tribune tech"
- [ ] Partager sur LinkedIn (post différent du post de lancement, plus court, qui renvoie vers l'article)
- [ ] Partager sur HN (Show HN: Rebuilt our engineering firm's site after 10 years)

## Metrics à tracker après pub

- Vues Medium (stats built-in)
- Backlinks entrants sur abbeal.com (Search Console → Liens)
- Nouveaux signups contact/ form (Vercel Analytics)
- Mentions sur Twitter/X + LinkedIn (Google Alerts sur "Abbeal")

## Variantes courtes pour réseaux sociaux

### Twitter/X (2 tweets thread)

> T1 : En 2014, j'étais commercial junior chez Alten. Un DSI me demande "un qui livre". J'envoie 3 CVs. Il choisit le moins cher. 6 semaines et c'est out.
>
> J'ai mis 2 ans à comprendre ce qui dysfonctionne vraiment dans les ESN. Spoiler : ce n'est pas le T&M.
>
> 10 ans après : thread ↓

> T2 : Ce qu'on a appris : abbeal.com + article complet [lien Medium]

### LinkedIn post court (en complément du post manifesto)

> Il y a 10 ans j'étais commercial chez Alten. Je vendais des journées d'ingé. Je refilais 3 CVs et j'espérais. J'ai arrêté.
>
> Aujourd'hui je raconte ce qu'on a appris en 10 ans chez Abbeal — 100 clients, 3 hubs, 50 expatriés. Ce qui marche, ce qui casse, ce qu'on fait différemment (y compris ce qui n'est pas ce qu'on dit en général sur les ESN).
>
> À lire ici [lien Medium].

---

*Rédigé en avril 2026. Tu peux réutiliser, modifier, découper.*
