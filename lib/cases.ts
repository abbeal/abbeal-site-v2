/**
 * Case studies manifest — 10 engagements clients anonymisés.
 * Même pattern que articles.ts : body en blocs typés, body localisé FR (EN/JA en fallback).
 */

import type { Locale } from "./i18n";
import type { ArticleBlock } from "./articles";
import bodies from "./case-bodies.json";

type BodiesMap = Record<
  string,
  {
    fr: ArticleBlock[];
    en?: ArticleBlock[];
    ja?: ArticleBlock[];
    "fr-ca"?: ArticleBlock[];
  }
>;
const CASE_BODIES = bodies as BodiesMap;

type Translatable<T> = { fr: T } & Partial<Record<Exclude<Locale, "fr">, T>>;

export type CaseStudy = {
  slug: string;
  featured: boolean; // 4 cases mises en avant
  /** True = exemple sectoriel basé sur notre méthodologie, pas un client
   *  identifié. Affiche un badge "Modèle sectoriel" pour rester honnête
   *  vs un vrai retour d'engagement. À retirer dès que le cas est associé
   *  à un client public ou anonymisé avec accord. */
  template?: boolean;
  /** Slug du logo client dans /public/logos/{slug}.{ext}. Optionnel : seuls
   *  les cases nommés (client public ou autorisation explicite) ont un logo.
   *  Les cases anonymisés ou template restent sans logo. */
  clientLogo?: string;
  /** Extension du fichier logo (default "svg"). Permet d'utiliser PNG quand
   *  le logo officiel n'est pas disponible en SVG. */
  clientLogoExt?: "svg" | "png";
  /** Slug d'un 2e logo client (cas multi-clients : ex Neobrain × PwC où
   *  Neobrain est notre client direct et PwC le client final). Si présent,
   *  affiché à droite du logo principal avec un séparateur "×". */
  clientLogoSecondary?: string;
  /** Extension du 2e logo (default "svg"). */
  clientLogoSecondaryExt?: "svg" | "png";
  sector: Translatable<string>; // "FinTech", "Mobilité", "Robotique", …
  geo: string; // "Paris", "Tokyo", "Tri-geo", "Montréal"
  duration: string; // "9 mois", "14 mois"
  teamSize: number;
  techStack: string[]; // ["Go", "K8s", "Karpenter"]
  kpi: { value: string; label: Translatable<string> }; // KPI principal pour la carte
  publishedAt: string; // ISO date
  title: Translatable<string>;
  excerpt: Translatable<string>;
  body: Translatable<ArticleBlock[]>;
};

export const cases: CaseStudy[] = [
  // Paraito — case nommé. Legaltech québécoise (IA appliquée au droit
  // immobilier, automatisation Registre foncier QC). Mission Abbeal :
  // recrutement permanent de 3 hires stratégiques (2 AI Engineers + 1
  // Lead Platform), dont 1 mobilité internationale France→Montréal via
  // Mobbeal. Source : brief Vianney Blanquart 2026-05-06.
  // Logo officiel paraito.svg telecharge depuis paraito.ca.
  {
    slug: "paraito",
    featured: false,
    clientLogo: "paraito",
    sector: {
      fr: "Legaltech / Droit immobilier",
      en: "Legaltech / Real estate law",
      ja: "リーガルテック / 不動産法",
      "fr-ca": "Legaltech / Droit immobilier",
    },
    geo: "Montréal",
    duration: "Recrutement permanent 2026",
    teamSize: 3,
    techStack: [
      "AI Engineering",
      "Platform Engineering",
      "Recrutement permanent",
      "Mobbeal France→Montréal",
      "Shortlists 3-5 candidats",
      "2 semaines closing",
    ],
    kpi: {
      value: "3 hires",
      label: {
        fr: "AI Engineers + Lead Platform",
        en: "AI Engineers + Lead Platform",
        ja: "AIエンジニア + リードプラットフォーム",
        "fr-ca": "AI Engineers + Lead Platform",
      },
    },
    publishedAt: "2026-04-12",
    title: {
      fr: "Paraito : staffing AI & Platform pour scaler une legaltech québécoise.",
      en: "Paraito: AI & Platform staffing to scale a Quebec legaltech.",
      ja: "パライト：ケベック州リーガルテックのスケールアップのためのAI & プラットフォームスタッフィング。",
      "fr-ca": "Paraito : recrutement IA & plateforme pour passer à l'échelle une legaltech québécoise.",
    },
    excerpt: {
      fr: "Paraito automatise le Registre foncier du Québec pour les notaires (−70 % temps de collecte, 3× plus de dossiers à effectif constant). Abbeal a livré 3 recrutements permanents (2 AI Engineers + 1 Lead Platform), dont 1 mobilité France→Montréal via Mobbeal — différenciant fort sur un marché tech québécois en tension IA.",
      en: "Paraito automates Quebec's Land Registry for notaries (−70% collection time, 3× more files handled at constant headcount). Abbeal delivered 3 permanent hires (2 AI Engineers + 1 Lead Platform), including 1 France→Montreal relocation via Mobbeal — a strong differentiator on a tight Quebec AI tech market.",
      ja: "パライトは公証人向けにケベック州不動産登記簿を自動化（収集時間-70%、同人員で3倍のファイル処理）。Abbealは3名の正社員採用（AIエンジニア2名 + リードプラットフォーム1名）を実現、Mobbeal経由のフランス→モントリオール1名のモビリティを含む — ケベックAI技術市場の人材不足における強い差別化要因。",
      "fr-ca": "Paraito automatise le Registre foncier du Québec pour les notaires (−70 % temps de collecte, 3× plus de dossiers à effectif constant). Abbeal a livré 3 recrutements permanents (2 AI Engineers + 1 Lead Platform), dont 1 mobilité France→Montréal via Mobbeal — différenciateur fort sur un marché tech québécois en tension IA.",
    },
    body: {
      fr: CASE_BODIES["paraito"]?.fr ?? [],
      en: CASE_BODIES["paraito"]?.en,
      ja: CASE_BODIES["paraito"]?.ja,
      "fr-ca": CASE_BODIES["paraito"]?.["fr-ca"],
    },
  },
  // Mobilitas — case nommé. Cabinet québécois immigration (PVT, résidence
  // permanente, regroupement familial...). Mission Abbeal Studio 2025 :
  // plateforme complète multilingue (FR/EN/ES/PT) avec prise RDV en ligne,
  // intégration QuickBooks, espace client signature électronique. Résultat :
  // 10h/sem économisées + 100% RDV en ligne (vs WhatsApp avant).
  // Source : brief Vianney Blanquart 2026-05-06.
  // Logo officiel mobilitas.png telecharge depuis mobilitas.ca.
  {
    slug: "mobilitas",
    featured: false,
    clientLogo: "mobilitas",
    clientLogoExt: "png",
    sector: {
      fr: "Legaltech / Immigration",
      en: "Legaltech / Immigration",
      ja: "リーガルテック / 移民",
      "fr-ca": "Legaltech / Immigration",
    },
    geo: "Montréal",
    duration: "Studio 2025",
    teamSize: 3,
    techStack: [
      "Next.js + React",
      "QuickBooks API",
      "Calendly",
      "PandaDoc",
      "Multilingue FR/EN/ES/PT",
      "SEO + Analytics",
    ],
    kpi: {
      value: "10h/sem",
      label: {
        fr: "économisées en travail manuel",
        en: "saved on manual work",
        ja: "手作業時間削減",
        "fr-ca": "économisées en travail manuel",
      },
    },
    publishedAt: "2026-03-18",
    title: {
      fr: "Mobilitas : digitalisation complète d'un cabinet d'immigration, du clic à la facture.",
      en: "Mobilitas: full digitalisation of an immigration practice, from click to invoice.",
      ja: "モビリタス：移民事務所の完全デジタル化、クリックから請求書まで。",
      "fr-ca": "Mobilitas : numérisation complète d'un cabinet d'immigration, du clic à la facture.",
    },
    excerpt: {
      fr: "Avant Abbeal : acquisition WhatsApp, RDV éclatés sur Calendly individuels, facturation Excel manuelle. Après : landing multilingue FR/EN/ES/PT, RDV 100% en ligne avec routage par expertise, QuickBooks intégré (création client + facture + Calendly auto), espace client signé électroniquement. Résultat mesuré : 10h/sem de manuel en moins.",
      en: "Before Abbeal: WhatsApp acquisition, fragmented Calendly accounts, manual Excel billing. After: FR/EN/ES/PT landing, 100% online booking routed by expertise, native QuickBooks integration (client + invoice + Calendly auto), e-signed client portal. Measured: 10h/week of manual work saved.",
      ja: "Abbeal前：WhatsApp獲得、個別Calendlyアカウント、Excel手動請求。後：FR/EN/ES/PT対応ランディング、専門分野別ルーティングによる100%オンライン予約、QuickBooksネイティブ統合（クライアント + 請求書 + Calendly自動）、電子署名付きクライアントポータル。実測：週10時間の手作業削減。",
      "fr-ca": "Avant Abbeal : acquisition WhatsApp, RDV éclatés sur Calendly individuels, facturation Excel manuelle. Après : page d'accueil multilingue FR/EN/ES/PT, RDV 100% en ligne avec acheminement par expertise, QuickBooks intégré (création client + facture + Calendly auto), espace client signé électroniquement. Résultat mesuré : 10h/sem de manuel en moins.",
    },
    body: {
      fr: CASE_BODIES["mobilitas"]?.fr ?? [],
      en: CASE_BODIES["mobilitas"]?.en,
      ja: CASE_BODIES["mobilitas"]?.ja,
      "fr-ca": CASE_BODIES["mobilitas"]?.["fr-ca"],
    },
  },
  // Bopizy — case nommé. SaaS click & collect française pour marchands de
  // proximité (bouchers, charcutiers, producteurs). Squad cross-Atlantique
  // 2 devs full-time depuis Montréal sur fuseau européen pour synchronisme
  // avec fondateurs France. Architecture microservices + computer vision
  // (photo étal → fiche e-commerce) + IA générative (GPT-3.5/Gemini).
  // Source : brief Vianney Blanquart 2026-05-06.
  // Logo officiel bopizy.png telecharge depuis bopizy.com.
  {
    slug: "bopizy",
    featured: false,
    clientLogo: "bopizy",
    clientLogoExt: "png",
    sector: {
      fr: "E-commerce / Click & Collect",
      en: "E-commerce / Click & Collect",
      ja: "Eコマース / クリック & コレクト",
      "fr-ca": "Commerce électronique / Click & Collect",
    },
    geo: "Lille (opéré depuis Montréal)",
    duration: "Mission 9 mois (2024-2025)",
    teamSize: 2,
    techStack: [
      "Nuxt 3 + Vue.js + TypeScript",
      "Node.js + DDD",
      "MongoDB Atlas",
      "GCP (Cloud Run, Pub/Sub)",
      "Computer Vision",
      "GPT-3.5 / Gemini",
    ],
    kpi: {
      value: "5 min",
      label: {
        fr: "pour créer son e-shop marchand",
        en: "to set up your merchant e-shop",
        ja: "マーチャントeショップ開設まで",
        "fr-ca": "pour créer sa boutique en ligne",
      },
    },
    publishedAt: "2026-02-25",
    title: {
      fr: "Bopizy : squad cross-Atlantique pour scaler une SaaS click & collect française.",
      en: "Bopizy: cross-Atlantic squad to scale a French click & collect SaaS.",
      ja: "Bopizy：フランスのクリック&コレクトSaaSをスケールアップする大西洋横断スクワッド。",
      "fr-ca": "Bopizy : équipe transatlantique pour passer à l'échelle un SaaS click & collect français.",
    },
    excerpt: {
      fr: "Bopizy démocratise le click & collect pour les marchands de proximité (« les oubliés de la digitalisation »). Le marchand prend son étal en photo, la computer vision génère sa fiche e-shop. Squad Abbeal de 2 devs depuis Montréal sur fuseau européen : architecture +10 microservices Cloud Run + Pub/Sub, parcours onboarding IA générative (GPT-3.5/Gemini), DDD/Zod/Auth0. Production avec premiers clients printemps 2025.",
      en: "Bopizy democratises click & collect for local merchants (\"those forgotten by digitalisation\"). The merchant photographs their stall, computer vision generates the e-shop product page. Abbeal squad of 2 devs from Montreal on European time zone: architecture of 10+ microservices Cloud Run + Pub/Sub, onboarding journey with generative AI (GPT-3.5/Gemini), DDD/Zod/Auth0. Production with first clients spring 2025.",
      ja: "Bopizyは地元商店（「デジタル化に取り残された人々」）向けにクリック&コレクトを民主化。商人が屋台を撮影し、コンピュータビジョンがeショップ商品ページを生成。モントリオールから欧州タイムゾーンでAbbeal 2名のスクワッド：10以上のマイクロサービスCloud Run + Pub/Subアーキテクチャ、生成AI（GPT-3.5/Gemini）によるオンボーディングジャーニー、DDD/Zod/Auth0。2025年春に最初のクライアントとともに本番稼働。",
      "fr-ca": "Bopizy démocratise le click & collect pour les marchands de proximité (« les oubliés de la numérisation »). Le marchand prend son étal en photo, la vision par ordinateur génère sa fiche e-boutique. Équipe Abbeal de 2 développeurs depuis Montréal sur fuseau européen : architecture +10 microservices Cloud Run + Pub/Sub, parcours d'intégration IA générative (GPT-3.5/Gemini), DDD/Zod/Auth0. Production avec premiers clients printemps 2025.",
    },
    body: {
      fr: CASE_BODIES["bopizy"]?.fr ?? [],
      en: CASE_BODIES["bopizy"]?.en,
      ja: CASE_BODIES["bopizy"]?.ja,
      "fr-ca": CASE_BODIES["bopizy"]?.["fr-ca"],
    },
  },
  // TheGreenBow — case nommé. Editeur français de cybersécurité (VPN
  // souverains, fondé 1998, racheté par groupe Athena en 2025). Reprise en
  // urgence du dev de la Console Bowrealis (CMC) après rupture du précédent
  // prestataire en août 2025. Squad Abbeal de 3 experts (front-end senior,
  // back-end Go, archi/DevSecOps), Q1 2026 cible de sortie.
  //
  // CAVEATS PROD :
  // - TODO_VERIFY : obtenir accord ecrit de Mathieu Isai et/ou Filip Hermans
  //   (TheGreenBow) pour utiliser le nom du client comme reference publique.
  //   Contentieux financier de fevrier 2026 solde debut avril 2026 → terrain
  //   sain pour la demande, formalité a effectuer.
  // - Formulation au present prudent : non-renouvellement annonce nov. 2025
  //   pour 2 des 3 consultants. Eviter "squad active" → "squad mobilisee
  //   sur la mission" suffit.
  // - Pas de citation client (a recolter aupres de Mathieu Isai ou Filip
  //   Hermans pour renforcer la page apres validation).
  // - Pas de mention contractuelle Dassault/Thales (juste evoques comme
  //   "clients publics du portefeuille TheGreenBow").
  // Logo officiel thegreenbow.svg telecharge depuis thegreenbow.com.
  // Featured: false jusqu'a validation client.
  {
    slug: "thegreenbow",
    featured: false,
    clientLogo: "thegreenbow",
    sector: {
      fr: "Cybersécurité / VPN souverains",
      en: "Cybersecurity / Sovereign VPN",
      ja: "サイバーセキュリティ / ソブリンVPN",
      "fr-ca": "Cybersécurité / RPV souverains",
    },
    geo: "Paris",
    duration: "Reprise en urgence (depuis août 2025)",
    teamSize: 3,
    techStack: [
      "HTML + CSS + PicoCSS",
      "Go (Golang)",
      "Figma + design system",
      "GitLab CI/CD",
      "DevSecOps",
      "Architecture distribuée",
    ],
    kpi: {
      value: "Squad de 3",
      label: {
        fr: "experts mobilisés en quelques semaines",
        en: "experts mobilized in weeks",
        ja: "数週間でモバイライズした3名のエキスパート",
        "fr-ca": "experts mobilisés en quelques semaines",
      },
    },
    publishedAt: "2025-12-22",
    title: {
      fr: "TheGreenBow : reprise en urgence de la Console VPN d'un éditeur cybersécurité français.",
      en: "TheGreenBow: emergency takeover of the VPN console of a French cybersecurity vendor.",
      ja: "TheGreenBow：フランスのサイバーセキュリティベンダーのVPNコンソールの緊急引継ぎ。",
      "fr-ca": "TheGreenBow : reprise en urgence de la console RPV d'un éditeur cybersécurité français.",
    },
    excerpt: {
      fr: "Éditeur français de cybersécurité (VPN souverains, certifications ANSSI, clients défense/admin). Squad Abbeal de 3 experts (front-end senior + back-end Go + DevSecOps) mobilisée en quelques semaines pour reprendre le dev de la Console Bowrealis après rupture du précédent prestataire et sécuriser la sortie produit Q1 2026.",
      en: "French cybersecurity vendor (sovereign VPN, ANSSI certifications, defense and government clients). Abbeal squad of 3 experts (senior front-end + Go back-end + DevSecOps) mobilized in weeks to take over Bowrealis Console development after the previous vendor walked off, and secure the Q1 2026 product release.",
      ja: "フランスのサイバーセキュリティベンダー（ソブリンVPN、ANSSI認証、防衛・政府機関クライアント）。前任ベンダーの離脱後、Bowrealis Console開発を引き継ぎ2026年Q1の製品リリースを確保するため、数週間でモバイライズされた3名のエキスパート（シニアフロントエンド + GoバックエンドDevSecOps）からなるAbbealスクワッド。",
      "fr-ca": "Editeur francais de cybersecurite (RPV souverains, certifications ANSSI, clients defense/administration). Squad Abbeal de 3 experts (frontal senior + arriere-plan Go + DevSecOps) mobilisee en quelques semaines pour reprendre le developpement de la console Bowrealis apres rupture du precedent fournisseur et securiser la sortie produit Q1 2026.",
    },
    body: {
      fr: CASE_BODIES["thegreenbow"]?.fr ?? [],
      en: CASE_BODIES["thegreenbow"]?.en,
      ja: CASE_BODIES["thegreenbow"]?.ja,
      "fr-ca": CASE_BODIES["thegreenbow"]?.["fr-ca"],
    },
  },
  // Money Forward — case nommé. Mission Abbeal sur le volet Data Engineering
  // d'une nouvelle banque digitale construite from-scratch à Tokyo (joint
  // venture entre Money Forward et un grand groupe bancaire japonais — NE
  // JAMAIS nommer SMBC dans le contenu public, l'Article 9 du Service
  // Agreement Money Forward × Abbeal K.K. autorise uniquement le nom et
  // logo Money Forward).
  //
  // CAVEATS PROD (Garde-fous éditoriaux) :
  // - JAMAIS écrire SMBC ou Sumitomo Mitsui (NDA) → "grand groupe bancaire
  //   japonais" / "top-tier Japanese banking group" / "日本の大手銀行グループ"
  // - Pas de stakeholders client (Guillaume Barroux, Kuroda-san, Saito-san,
  //   Nishimoto-san), pas de Monthly Rates, pas de durée exacte SOW
  // - Pas de noms de consultants → "Senior Data Engineer", "Mid-Career Data
  //   Engineer", profils anonymisés
  // - TODO_VERIFY : confirmer que la version Yousign signée du Service
  //   Agreement (envoyée à Daisuke MF le 6 avril 2026) conserve l'Article 9
  //   inchangé avant publication
  // - TODO_VERIFY : faire valider le bloc EN par Money Forward avant publication
  //
  // Logo officiel money-forward.svg deja present dans /public/logos/.
  // Featured: false jusqu'à validation Money Forward.
  {
    slug: "money-forward",
    featured: true,
    clientLogo: "money-forward",
    sector: {
      fr: "Banking digitale / FinTech",
      en: "Digital banking / FinTech",
      ja: "デジタルバンキング / FinTech",
      "fr-ca": "Banque numérique / FinTech",
    },
    geo: "Tokyo (Tamachi)",
    duration: "Mission en cours",
    teamSize: 2,
    techStack: [
      "Databricks + Delta Lake",
      "dbt + Apache Spark",
      "AWS Tokyo Region",
      "Unity Catalog + Great Expectations",
      "Terraform + GitHub Actions",
      "Amazon QuickSight",
    ],
    kpi: {
      value: "Data Hub",
      label: {
        fr: "digital bank from-scratch Tokyo",
        en: "from-scratch digital bank Tokyo",
        ja: "ゼロから構築のデジタルバンク東京",
        "fr-ca": "banque numérique from-scratch Tokyo",
      },
    },
    publishedAt: "2025-11-12",
    title: {
      fr: "Money Forward : data backbone d'une nouvelle banque digitale à Tokyo.",
      en: "Money Forward: data backbone of a brand-new digital bank in Tokyo.",
      ja: "マネーフォワード：東京の新規デジタルバンクのデータ基盤。",
      "fr-ca": "Money Forward : pile data d'une nouvelle banque numérique à Tokyo.",
    },
    excerpt: {
      fr: "Money Forward, leader FinTech japonais coté à Tokyo, s'est associé à un grand groupe bancaire japonais pour lancer une nouvelle banque digitale construite from-scratch. Abbeal accompagne sur le volet Data Engineering : conception et industrialisation du Data Hub (Databricks + Delta Lake + dbt + AWS Tokyo) qui sert le reporting JFSA, l'AML, le risk management.",
      en: "Money Forward, a Japanese FinTech leader listed in Tokyo, partnered with a top-tier Japanese banking group to launch a brand-new digital bank built from scratch. Abbeal partners on the Data Engineering side: designing and operating the Data Hub (Databricks + Delta Lake + dbt + AWS Tokyo) serving JFSA reporting, AML, risk management.",
      ja: "東京証券取引所上場の日本FinTechリーダー、マネーフォワードは、日本の大手銀行グループとのジョイントベンチャーとして、ゼロから構築する新しいデジタルバンクを立ち上げました。Abbealはデータエンジニアリング領域で参画：JFSA報告、AML、リスクマネジメントを担うData Hub（Databricks + Delta Lake + dbt + AWS東京）の設計・運用。",
      "fr-ca": "Money Forward, chef de file FinTech japonais cote a Tokyo, s'est associe a un grand groupe bancaire japonais pour lancer une nouvelle banque numerique batie a partir de zero. Abbeal accompagne sur le volet Data Engineering : conception et industrialisation du Data Hub (Databricks + Delta Lake + dbt + AWS Tokyo) qui sert le reporting JFSA, l'AML, la gestion des risques.",
    },
    body: {
      fr: CASE_BODIES["money-forward"]?.fr ?? [],
      en: CASE_BODIES["money-forward"]?.en,
      ja: CASE_BODIES["money-forward"]?.ja,
      "fr-ca": CASE_BODIES["money-forward"]?.["fr-ca"],
    },
  },
  // Neobrain × PwC — case nommé multi-clients. Abbeal en sous-traitance de
  // Neobrain (SaaS RH français, Talent Marketplace) pour livrer SkillBot,
  // un agent IA Agentic intégré dans Microsoft Teams chez PwC USA (35 000+
  // collaborateurs). Mission active depuis sept. 2024. Equipe Abbeal :
  // Pauline (lead conception), Antoine + Martial (dev), Sara (DevOps senior),
  // renforts LangChain sourcés en quelques semaines. Sponsor commercial :
  // Sébastien Lonjon (CEO Abbeal). Logos disponibles : neobrain.svg
  // (officiel, telecharge) + pwc.svg (deja present). Quote Alexis Muninger
  // (Head of Product Data Neobrain) integree dans le body.
  {
    slug: "neobrain-pwc-skillbot",
    featured: false,
    clientLogo: "neobrain",
    clientLogoSecondary: "pwc",
    sector: {
      fr: "Agentic AI / SaaS RH",
      en: "Agentic AI / HR SaaS",
      ja: "Agentic AI / HR SaaS",
      "fr-ca": "Agentic AI / SaaS RH",
    },
    geo: "Paris + Boston",
    duration: "Mission en cours",
    teamSize: 4,
    techStack: [
      "Python 3.11 + FastAPI",
      "LangChain + GPT",
      "MS Teams Bot Framework",
      "Microsoft Graph",
      "Azure + Argo CD + K8s",
      "MongoDB",
    ],
    kpi: {
      value: "35 000+",
      label: {
        fr: "collaborateurs PwC sur SkillBot",
        en: "PwC employees on SkillBot",
        ja: "SkillBot利用PwC社員",
        "fr-ca": "employes PwC sur SkillBot",
      },
    },
    publishedAt: "2025-07-12",
    title: {
      fr: "Neobrain × PwC : SkillBot, l'agent IA RH dans Microsoft Teams.",
      en: "Neobrain × PwC: SkillBot, the HR AI agent inside Microsoft Teams.",
      ja: "Neobrain × PwC：Microsoft Teams内のHR AIエージェント、SkillBot。",
      "fr-ca": "Neobrain × PwC : SkillBot, l'agent IA RH dans Microsoft Teams.",
    },
    excerpt: {
      fr: "Chatbot Agentic AI livré chez PwC pour 35 000+ collaborateurs USA, intégré nativement dans Microsoft Teams. Staff augmentation IA + DevOps senior + sourcing express LangChain pour Neobrain (Talent Marketplace IA). Du POC au go-live PwC sans dérapage de scope ni planning critique.",
      en: "Agentic AI chatbot shipped at PwC for 35,000+ US employees, natively integrated into Microsoft Teams. AI staff augmentation + senior DevOps + express LangChain sourcing for Neobrain (AI Talent Marketplace). From POC to PwC go-live with no scope or critical schedule slip.",
      ja: "PwCで35,000人以上の米国社員向けに納品されたAgentic AIチャットボット、Microsoft Teamsにネイティブ統合。Neobrain（AI Talent Marketplace）のためのAIスタッフ増強+シニアDevOps+LangChain即時ソーシング。POCからPwC本番投入までスコープ・重要スケジュール逸脱なし。",
      "fr-ca": "Robot conversationnel Agentic AI livre chez PwC pour 35 000+ employes USA, integre nativement dans Microsoft Teams. Augmentation d'equipe IA + DevOps senior + recrutement express LangChain pour Neobrain (place de marche talents IA). Du POC au go-live PwC sans glissement de portee ni d'echeancier critique.",
    },
    body: {
      fr: CASE_BODIES["neobrain-pwc-skillbot"]?.fr ?? [],
      en: CASE_BODIES["neobrain-pwc-skillbot"]?.en,
      ja: CASE_BODIES["neobrain-pwc-skillbot"]?.ja,
      "fr-ca": CASE_BODIES["neobrain-pwc-skillbot"]?.["fr-ca"],
    },
  },
  // Le Monde — 1er case nommé. Mission active depuis 2019, ingénieur intégré
  // dans la team Insights Data, opère depuis Tokyo depuis 2023 → preuve
  // tri-géo concrète Paris ↔ Tokyo. Contenu mis a jour avec les vraies
  // infos d'Alexandre L. (15/01/2026 via Slack) :
  // - Stack reelle : JavaScript vanilla (sans framework) + Go + PHP
  // - IA : automatisation des code reviews avec Codex (mode pilote)
  // - Methodes : Agile sprints 2 semaines + animation des retros + pair
  //   programming + demos techniques
  // - Sujets actuels : outil analytics interne Forecast, unification de la
  //   collecte de donnees (qualite des algos reco / articles les plus lus),
  //   maintenance et evolution de la CMP (Consent Management Platform,
  //   conformite IAB TCF europeen)
  // Préserve le SEO de l'URL legacy /projets/le-monde (308 redirect dans
  // next.config.ts).
  {
    slug: "le-monde",
    featured: true,
    clientLogo: "le-monde",
    sector: {
      fr: "Média / Presse nationale",
      en: "National media",
      ja: "全国メディア",
      "fr-ca": "Média / Presse nationale",
    },
    geo: "Paris + Tokyo",
    duration: "6 ans",
    teamSize: 1,
    techStack: [
      "JavaScript vanilla",
      "Go",
      "PHP",
      "Codex (code review IA)",
      "Forecast (analytics interne)",
      "CMP IAB TCF",
    ],
    kpi: {
      value: "6 ans",
      label: {
        fr: "intégré team Insights",
        en: "embedded in Insights team",
        ja: "Insightsチームに組み込み",
        "fr-ca": "intégré équipe Insights",
      },
    },
    publishedAt: "2025-09-18",
    title: {
      fr: "Le Monde : 6 ans dans la team Insights, de Paris à Tokyo.",
      en: "Le Monde: 6 years embedded in the Insights team, from Paris to Tokyo.",
      ja: "ル・モンド：Insightsチームに6年、パリから東京まで。",
      "fr-ca": "Le Monde : 6 ans dans l'équipe Insights, de Paris à Tokyo.",
    },
    excerpt: {
      fr: "Outil analytics interne Forecast, unification de la collecte data (algos reco + articles les plus lus), CMP IAB TCF européenne, code reviews automatisées via Codex. Stack JavaScript vanilla + Go + PHP, sprints 2 semaines, animation des rétros + pair programming. Un ingénieur Abbeal au cœur de la rédaction depuis 2019 — opérant depuis Tokyo depuis 2023.",
      en: "Forecast internal analytics tool, data collection unification (reco algos + most-read articles), European IAB TCF CMP, AI-assisted code reviews via Codex. Vanilla JavaScript + Go + PHP stack, 2-week sprints, retros animation + pair programming. One Abbeal engineer embedded in the newsroom since 2019 — operating from Tokyo since 2023.",
      ja: "社内アナリティクスツールForecast、データ収集統一（推薦アルゴリズム + 最多閲覧記事）、欧州IAB TCF対応CMP、Codex経由のAIコードレビュー自動化。JavaScript vanilla + Go + PHPスタック、2週間スプリント、レトロのアニメーション + ペアプログラミング。2019年から編集部に組み込まれた1名のAbbealエンジニア — 2023年から東京で稼働。",
      "fr-ca": "Outil analytique interne Forecast, unification de la collecte de donnees (algos de recommandation + articles les plus lus), CMP IAB TCF europeenne, revues de code automatisees via Codex. Pile JavaScript vanilla + Go + PHP, sprints de 2 semaines, animation des retros + pair programming. Un ingenieur Abbeal integre a la salle de redaction depuis 2019 — operant depuis Tokyo depuis 2023.",
    },
    body: {
      fr: CASE_BODIES["le-monde"]?.fr ?? [],
      en: CASE_BODIES["le-monde"]?.en,
      ja: CASE_BODIES["le-monde"]?.ja,
      "fr-ca": CASE_BODIES["le-monde"]?.["fr-ca"],
    },
  },
  // BNP Paribas — case nommé. Mission historique 2018-2019 (Reference Book PO
  // Marketplace) avec Sébastien, Raphaël et Ulric. Présenté avec stack
  // modernisée 2026 : on raconte l'engagement initial + ce qu'on déploie
  // aujourd'hui sur les mêmes problématiques (RAG, agents IA produits,
  // event-driven). Préserve SEO /projets/bnp.
  {
    slug: "bnp",
    featured: true,
    clientLogo: "bnp",
    sector: {
      fr: "Banque tier-1",
      en: "Tier-1 bank",
      ja: "大手銀行",
      "fr-ca": "Banque de premier rang",
    },
    geo: "Paris",
    duration: "Engagement multi-année",
    teamSize: 3,
    techStack: [
      "Next.js 16",
      "Claude Sonnet",
      "LangGraph",
      "pgvector",
      "AWS Bedrock",
      "Apache Kafka",
    ],
    kpi: {
      value: "RAG",
      label: {
        fr: "catalog produits PO",
        en: "PO product catalog",
        ja: "PO製品カタログ",
        "fr-ca": "catalogue produits PO",
      },
    },
    publishedAt: "2025-12-08",
    title: {
      fr: "BNP Paribas : Reference Book PO, de React/Redux aux agents IA produits.",
      en: "BNP Paribas: Reference Book PO, from React/Redux to product AI agents.",
      ja: "BNPパリバ：Reference Book PO、React/Reduxから製品AIエージェントへ。",
      "fr-ca": "BNP Paribas : Reference Book PO, de React/Redux aux agents IA produits.",
    },
    excerpt: {
      fr: "Trois ingénieurs Abbeal au cœur de la Marketplace PO. Plateforme React/Redux/Node initialement, désormais augmentée d'un RAG produits, d'agents Claude pour assistance PM, et d'une couche event-driven Kafka pour scaler.",
      en: "Three Abbeal engineers at the core of the PO Marketplace. React/Redux/Node platform initially, now augmented with a product RAG, Claude agents for PM assistance, and an event-driven Kafka layer to scale.",
      ja: "BNPのPOマーケットプレイスの中核に3名のAbbealエンジニア。当初React/Redux/Nodeプラットフォーム、現在は製品RAG、PMアシスタント用Claudeエージェント、スケール用イベント駆動Kafka層で強化。",
      "fr-ca": "Trois ingénieurs Abbeal au cœur de la place de marché PO. Plateforme React/Redux/Node au départ, désormais augmentée d'un RAG produits, d'agents Claude pour assistance PM, et d'une couche événementielle Kafka pour mise à l'échelle.",
    },
    body: {
      fr: CASE_BODIES["bnp"]?.fr ?? [],
      en: CASE_BODIES["bnp"]?.en,
      ja: CASE_BODIES["bnp"]?.ja,
      "fr-ca": CASE_BODIES["bnp"]?.["fr-ca"],
    },
  },
  // Pichet — case nommé. Promoteur immobilier français, Adrien D. 2018-2020
  // sur PHP 7/8 + Symfony 4/5 + eZplatform + K8s + AWS. Stack présentée =
  // approche moderne 2026 (Next.js + headless CMS + AI vision pour analyse
  // plans + LLM personnalisation fiches). Préserve SEO /projets/pichet.
  {
    slug: "pichet",
    featured: true,
    clientLogo: "pichet",
    sector: {
      fr: "Immobilier / Promotion",
      en: "Real estate / Property",
      ja: "不動産 / プロモーション",
      "fr-ca": "Immobilier / Promotion",
    },
    geo: "Paris + Bordeaux",
    duration: "Mission Studio 2018-2020",
    teamSize: 1,
    techStack: [
      "Next.js 16",
      "Sanity",
      "Claude Vision",
      "pgvector",
      "Snowflake",
      "Vercel",
    ],
    kpi: {
      value: "AI Vision",
      label: {
        fr: "analyse plans 2D/3D",
        en: "2D/3D floor plans analysis",
        ja: "2D/3D間取り分析",
        "fr-ca": "analyse plans 2D/3D",
      },
    },
    publishedAt: "2025-10-22",
    title: {
      fr: "Pichet : du Symfony/eZplatform à l'IA Vision sur plans immobiliers.",
      en: "Pichet: from Symfony/eZplatform to AI Vision on property floor plans.",
      ja: "ピシェ：Symfony/eZplatformから不動産間取りのAI Visionへ。",
      "fr-ca": "Pichet : de Symfony/eZplatform à l'IA Vision sur plans immobiliers.",
    },
    excerpt: {
      fr: "Promoteur immobilier français premium. Plateforme catalogue refondue (Symfony 4/5 + eZplatform + K8s) puis modernisée : Next.js 16, CMS headless, Claude Vision pour interpréter plans 2D/3D, recherche sémantique sur biens via pgvector.",
      en: "Premium French property developer. Catalog platform rebuilt (Symfony 4/5 + eZplatform + K8s) then modernized: Next.js 16, headless CMS, Claude Vision interpreting 2D/3D floor plans, semantic search via pgvector.",
      ja: "フランスのプレミアム不動産デベロッパー。カタログプラットフォームを再構築（Symfony 4/5 + eZplatform + K8s）後にモダナイゼーション：Next.js 16、ヘッドレスCMS、2D/3D間取りを解釈するClaude Vision、pgvectorによるセマンティック検索。",
      "fr-ca": "Promoteur immobilier français haut de gamme. Plateforme catalogue refondue (Symfony 4/5 + eZplatform + K8s) puis modernisée : Next.js 16, CMS sans interface, Claude Vision pour interpréter plans 2D/3D, recherche sémantique sur biens via pgvector.",
    },
    body: {
      fr: CASE_BODIES["pichet"]?.fr ?? [],
      en: CASE_BODIES["pichet"]?.en,
      ja: CASE_BODIES["pichet"]?.ja,
      "fr-ca": CASE_BODIES["pichet"]?.["fr-ca"],
    },
  },
  // Tripadvisor (groupe propriétaire de TheFork, filiale depuis 2014) — case
  // nommé. Engagement initial sur la stack TheFork (Racem 2017-2018, Symfony
  // 3 + Node.js + RabbitMQ + SolR). Présenté ici sous l'ombrelle Tripadvisor
  // (marque-mère reconnue mondialement) avec stack moderne 2026. Slug
  // "the-fork" conservé pour préserver le SEO de l'URL legacy /projets/the-fork.
  {
    slug: "the-fork",
    featured: false,
    clientLogo: "tripadvisor",
    sector: {
      fr: "Travel-tech / Marketplace resto",
      en: "Travel-tech / Restaurant marketplace",
      ja: "トラベルテック / レストランマーケットプレイス",
      "fr-ca": "Travel-tech / Place de marché resto",
    },
    geo: "Paris + Europe",
    duration: "Engagement initial 2017-2018",
    teamSize: 1,
    techStack: [
      "React Native",
      "Algolia",
      "Mistral 7B",
      "pgvector",
      "Apache Kafka",
      "Datadog",
    ],
    kpi: {
      value: "Hybrid",
      label: {
        fr: "moteur de reco IA",
        en: "AI reco engine",
        ja: "AI推薦エンジン",
        "fr-ca": "moteur de recommandations IA",
      },
    },
    publishedAt: "2025-08-15",
    title: {
      fr: "Tripadvisor (TheFork) : du Symfony/SolR à la reco IA hybride.",
      en: "Tripadvisor (TheFork): from Symfony/SolR to hybrid AI recommendation.",
      ja: "トリップアドバイザー（ザ・フォーク）：Symfony/SolRからハイブリッドAI推薦へ。",
      "fr-ca": "Tripadvisor (TheFork) : de Symfony/SolR à la reco IA hybride.",
    },
    excerpt: {
      fr: "TheFork (filiale Tripadvisor depuis 2014), plateforme de réservation resto européenne. Backend Symfony 3 + Node.js + RabbitMQ + SolR à l'origine — augmenté aujourd'hui d'embeddings Mistral 7B, search Algolia, reco LLM-augmented et observabilité Datadog full-stack.",
      en: "TheFork (Tripadvisor subsidiary since 2014), European restaurant booking platform. Symfony 3 + Node.js + RabbitMQ + SolR backend originally — now augmented with Mistral 7B embeddings, Algolia search, LLM-augmented recommendations and full-stack Datadog observability.",
      ja: "ザ・フォーク（2014年からトリップアドバイザー子会社）、欧州レストラン予約プラットフォーム。当初Symfony 3 + Node.js + RabbitMQ + SolRバックエンド — 現在Mistral 7B埋め込み、Algolia検索、LLM強化推薦、フルスタックDatadog観測性で強化。",
      "fr-ca": "TheFork (filiale Tripadvisor depuis 2014), plateforme de réservation resto européenne. Backend Symfony 3 + Node.js + RabbitMQ + SolR à l'origine — augmenté aujourd'hui d'embeddings Mistral 7B, recherche Algolia, recommandations augmentées par LLM et observabilité Datadog en pile complète.",
    },
    body: {
      fr: CASE_BODIES["the-fork"]?.fr ?? [],
      en: CASE_BODIES["the-fork"]?.en,
      ja: CASE_BODIES["the-fork"]?.ja,
      "fr-ca": CASE_BODIES["the-fork"]?.["fr-ca"],
    },
  },
  // Groupe Réussite — case nommé. Marketplace edtech (cours particuliers)
  // accompagnée par Abbeal Studio de novembre 2019 à 2023 (4 ans). Équipe :
  // Adrien Casanova (CTO Abbeal, lead), Aurélie Largent, Nikhil Kohli,
  // Baptiste Manach. Stack initiale React + Next.js 12.2 — modernisée 2026 :
  // Next.js 16 + React 19 + Algolia + pgvector pour matching IA + Mistral
  // pour personnalisation + Stripe Connect + Pusher temps réel. Backlink
  // sortant vers https://groupe-reussite.fr/ demandé par le client (Aghilas
  // Hached, 21/04/2025) : intégré dans le body. Logo wordmark provisoire à
  // remplacer par le vrai (Gmail thread `1962482ba3b63612`).
  {
    slug: "groupe-reussite",
    featured: false,
    clientLogo: "groupe-reussite",
    sector: {
      fr: "Edtech / Marketplace",
      en: "Edtech / Marketplace",
      ja: "EdTech / マーケットプレイス",
      "fr-ca": "Edtech / Place de marché",
    },
    geo: "Paris",
    duration: "Studio 2019-2023",
    teamSize: 4,
    techStack: [
      "Next.js 16",
      "React 19",
      "Algolia",
      "pgvector",
      "Stripe Connect",
      "Pusher",
    ],
    kpi: {
      value: "Algorithme",
      label: {
        fr: "ranking IA professeurs",
        en: "AI tutor ranking",
        ja: "AI講師ランキング",
        "fr-ca": "classement IA tuteurs",
      },
    },
    publishedAt: "2025-06-25",
    title: {
      fr: "Groupe Réussite : marketplace edtech, ranking IA et messagerie temps réel.",
      en: "Groupe Réussite: edtech marketplace, AI ranking and real-time messaging.",
      ja: "グループ・レユシット：EdTechマーケットプレイス、AIランキング、リアルタイムメッセージング。",
      "fr-ca": "Groupe Réussite : place de marché edtech, classement IA et messagerie en temps réel.",
    },
    excerpt: {
      fr: "Marketplace edtech qui matche élèves, parents et professeurs particuliers sur 60+ matières. Abbeal Studio en co-construction (2019-2023) : conception, MVP, V1, algorithme de ranking, moteur de recherche multicritères, espace prof LMS, paiements Stripe Connect, messagerie temps réel.",
      en: "Edtech marketplace matching students, parents and private tutors across 60+ subjects. Abbeal Studio in co-build mode (2019-2023): design, MVP, V1, ranking algorithm, multi-criteria search engine, teacher LMS space, Stripe Connect payments, real-time messaging.",
      ja: "60以上の科目で生徒、保護者、家庭教師をマッチングするEdTechマーケットプレイス。Abbeal Studio共同構築（2019-2023）：設計、MVP、V1、ランキングアルゴリズム、マルチ基準検索エンジン、講師LMSスペース、Stripe Connect決済、リアルタイムメッセージング。",
      "fr-ca": "Place de marché edtech qui jumelle élèves, parents et tuteurs privés sur plus de 60 matières. Abbeal Studio en co-construction (2019-2023) : conception, MVP, V1, algorithme de classement, moteur de recherche multicritères, espace prof LMS, paiements Stripe Connect, messagerie en temps réel.",
    },
    body: {
      fr: CASE_BODIES["groupe-reussite"]?.fr ?? [],
      en: CASE_BODIES["groupe-reussite"]?.en,
      ja: CASE_BODIES["groupe-reussite"]?.ja,
      "fr-ca": CASE_BODIES["groupe-reussite"]?.["fr-ca"],
    },
  },
  // Cartier (Groupe Richemont) — case nommé. Relation entamée fin 2021 (NDA
  // signé dec 2021), 4,5 ans de partenariat tech continu. Trajectoire :
  // audits Compass (Front 2023, Back 2025) -> Mapper V1+1.1 horlogerie/
  // joaillerie -> ETL data concurrence sur BigQuery -> POC LLM Web Dev
  // (mai 2023) -> LLM privé fine-tuné sur infra Cartier (2026, en cours).
  // Equipe Abbeal : Bertrand Behaghel (co-founder, kick-off), Adrien
  // Casanova (lead Mapper), Adrien Abdi (Compass2). TODO_VERIFY_CONSULTANTS:
  // liste exacte des consultants staffés en delivery a reconstituer via
  // Boond. CAVEATS : pas de citation client (autorisation requise auprès
  // d'Alexandre Poussard / brand-legal Richemont), pas de montants
  // facturés, pas de noms de contacts, formulation prudente sur la perf
  // du LLM privé. Logo cartier.svg deja present dans /public/logos/.
  // Featured: false jusqu'à validation.
  {
    slug: "cartier",
    featured: true,
    clientLogo: "cartier",
    sector: {
      fr: "Joaillerie & horlogerie de luxe",
      en: "Luxury jewellery & watchmaking",
      ja: "ラグジュアリージュエリー＆時計",
      "fr-ca": "Joaillerie & horlogerie de luxe",
    },
    geo: "Genève + Paris + Tokyo",
    duration: "Multi-projets depuis 2021",
    teamSize: 3,
    techStack: [
      "GCP (BigQuery, Cloud Run, Dataflow)",
      "Python + FastAPI",
      "Next.js + D3",
      "LLM privé fine-tuné",
      "RAG + eval & monitoring",
      "Firebase Auth + SSO",
    ],
    kpi: {
      value: "LLM privé",
      label: {
        fr: "fine-tuné sur infra Cartier",
        en: "fine-tuned on Cartier infra",
        ja: "Cartierインフラでファインチューニング",
        "fr-ca": "ajusté sur infra Cartier",
      },
    },
    publishedAt: "2026-01-15",
    title: {
      fr: "Cartier : de l'audit au LLM privé en interne.",
      en: "Cartier: from audit to in-house private LLM.",
      ja: "カルティエ：監査から社内プライベートLLMまで。",
      "fr-ca": "Cartier : de l'audit au LLM privé en interne.",
    },
    excerpt: {
      fr: "Compass (audits archi front + back), Mapper (générateur produits horlogerie + joaillerie), ETL data concurrence sur BigQuery, et désormais un LLM privé fine-tuné sur l'infra Cartier. Un partenariat tech long-terme sur la stack data et IA d'une maison de luxe.",
      en: "Compass (front + back architecture audits), Mapper (watchmaking + jewellery product generator), competitive data ETL on BigQuery, and now a private LLM fine-tuned on Cartier's own infra. A long-term tech partnership on the data and AI stack of a luxury house.",
      ja: "Compass（フロント＋バックエンド・アーキテクチャ監査）、Mapper（時計＋ジュエリー製品ジェネレーター）、BigQuery上の競合データETL、そして現在Cartier自社インフラでファインチューニングされたプライベートLLM。ラグジュアリーメゾンのデータ＆AIスタックでの長期テックパートナーシップ。",
      "fr-ca": "Compass (audits architecture frontale + arriere), Mapper (generateur produits horlogerie + joaillerie), ETL donnees concurrence sur BigQuery, et desormais un LLM prive ajuste sur l'infra Cartier. Un partenariat tech long-terme sur la pile data et IA d'une maison de luxe.",
    },
    body: {
      fr: CASE_BODIES["cartier"]?.fr ?? [],
      en: CASE_BODIES["cartier"]?.en,
      ja: CASE_BODIES["cartier"]?.ja,
      "fr-ca": CASE_BODIES["cartier"]?.["fr-ca"],
    },
  },
  {
    slug: "scale-up-mobilite-30-cloud",
    featured: false,
    sector: { fr: "Mobilité urbaine", en: "Urban mobility", ja: "都市モビリティ", "fr-ca": "Mobilité urbaine" },
    geo: "Paris + Montréal",
    duration: "9 mois",
    teamSize: 4,
    techStack: ["Go", "Kubernetes", "Karpenter", "Prometheus", "OpenTelemetry"],
    kpi: { value: "−30%", label: { fr: "facture cloud", en: "cloud bill", ja: "クラウド請求", "fr-ca": "facture cloud" } },
    publishedAt: "2026-01-15",
    title: {
      fr: "Scale-up mobilité : −30 % de facture cloud, mêmes SLOs.",
      en: "Mobility scale-up: −30% cloud bill, same SLOs.",
      ja: "モビリティスケールアップ：クラウド請求−30%、SLO同等。",
    },
    excerpt: {
      fr: "Facture AWS doublée en 18 mois sans trafic proportionnel. Audit GreenOps, refonte, Karpenter, ARM64. Résultat mesuré.",
      en: "AWS bill doubled in 18 months without matching traffic growth. GreenOps audit, refactor, Karpenter, ARM64. Measured outcome.",
      ja: "18ヶ月でAWS請求が2倍、トラフィック増加は比例せず。GreenOps監査、リファクタ、Karpenter、ARM64。計測済みの成果。",
    },
    body: {
      fr: CASE_BODIES["scale-up-mobilite-30-cloud"]?.fr ?? [],
      en: CASE_BODIES["scale-up-mobilite-30-cloud"]?.en,
      ja: CASE_BODIES["scale-up-mobilite-30-cloud"]?.ja,
    },
  },
  {
    slug: "leader-sport-pwa-conversion",
    featured: false,
    sector: { fr: "E-commerce sport", en: "Sports e-commerce", ja: "スポーツEC", "fr-ca": "Commerce électronique sport" },
    geo: "Paris",
    duration: "6 mois",
    teamSize: 5,
    techStack: ["Next.js 16", "Vercel", "Cloudflare", "GA4"],
    kpi: { value: "+18%", label: { fr: "conversion mobile", en: "mobile conversion", ja: "モバイルCV", "fr-ca": "conversion mobile" } },
    publishedAt: "2026-01-08",
    title: {
      fr: "Leader sport : PWA, +18 % conversion mobile, Lighthouse 92.",
      en: "Sports leader: PWA, +18% mobile conversion, Lighthouse 92.",
      ja: "スポーツ大手：PWA、モバイルCV+18%、Lighthouse 92。",
    },
    excerpt: {
      fr: "Lighthouse mobile à 38, conversion en chute. Next.js App Router, edge, image, splitting. Livré en 6 mois.",
      en: "Mobile Lighthouse at 38, conversion falling. Next.js App Router, edge, images, splitting. Delivered in 6 months.",
      ja: "モバイルLighthouseが38、CV低下。Next.js App Router、edge、画像、splitting。6ヶ月で納品。",
    },
    body: {
      fr: CASE_BODIES["leader-sport-pwa-conversion"]?.fr ?? [],
      en: CASE_BODIES["leader-sport-pwa-conversion"]?.en,
      ja: CASE_BODIES["leader-sport-pwa-conversion"]?.ja,
    },
  },
  {
    slug: "robotique-jp-ros2-flotte",
    featured: false,
    sector: { fr: "Robotique industrielle", en: "Industrial robotics", ja: "産業ロボティクス", "fr-ca": "Robotique industrielle" },
    geo: "Tokyo",
    duration: "14 mois",
    teamSize: 7,
    techStack: ["ROS 2 Humble", "Rust", "Isaac Sim", "Cyclone DDS"],
    kpi: { value: "+40%", label: { fr: "throughput entrepôt", en: "warehouse throughput", ja: "倉庫スループット", "fr-ca": "débit entrepôt" } },
    publishedAt: "2026-01-02",
    title: {
      fr: "Industriel japonais : 80 AGV, ROS 2, +40 % throughput entrepôt.",
      en: "Japanese industrial: 80 AGVs, ROS 2, +40% warehouse throughput.",
      ja: "日本メーカー：AGV80台、ROS 2、倉庫スループット+40%。",
    },
    excerpt: {
      fr: "Flotte lente, collisions, downtime. Refonte Nav2, perception fusion, planification multi-agents. Zéro collision sur 6 mois.",
      en: "Slow fleet, collisions, downtime. Nav2 refactor, perception fusion, multi-agent planning. Zero collisions in 6 months.",
      ja: "低速なフリート、衝突、ダウンタイム。Nav2刷新、知覚フュージョン、マルチエージェント計画。6ヶ月で衝突ゼロ。",
    },
    body: {
      fr: CASE_BODIES["robotique-jp-ros2-flotte"]?.fr ?? [],
      en: CASE_BODIES["robotique-jp-ros2-flotte"]?.en,
      ja: CASE_BODIES["robotique-jp-ros2-flotte"]?.ja,
    },
  },
  {
    slug: "fintech-iso27001-devsecops",
    featured: false,
    sector: { fr: "FinTech SaaS", en: "FinTech SaaS", ja: "FinTech SaaS", "fr-ca": "FinTech SaaS" },
    geo: "Tri-geo",
    duration: "11 mois",
    teamSize: 6,
    techStack: ["Terraform", "Vault", "Snyk", "GitHub Actions", "AWS"],
    kpi: { value: "9 mois", label: { fr: "ISO 27001 (vs 18 estimé)", en: "ISO 27001 (vs 18 est.)", ja: "ISO 27001（18ヶ月見積りに対し）", "fr-ca": "ISO 27001 (vs 18 estimé)" } },
    publishedAt: "2025-12-20",
    title: {
      fr: "FinTech SaaS : ISO 27001 en 9 mois, zéro régression de vélocité.",
      en: "FinTech SaaS: ISO 27001 in 9 months, zero velocity regression.",
      ja: "FinTech SaaS：9ヶ月でISO 27001取得、ベロシティ低下ゼロ。",
    },
    excerpt: {
      fr: "Roadmap freezée par la certif. DevSecOps, IaC policies, Vault, runbook incidents. DORA reste elite.",
      en: "Roadmap frozen by cert. DevSecOps, IaC policies, Vault, incident runbook. DORA stays elite.",
      ja: "認証によりロードマップ凍結。DevSecOps、IaCポリシー、Vault、インシデントrunbook。DORAはelite維持。",
    },
    body: {
      fr: CASE_BODIES["fintech-iso27001-devsecops"]?.fr ?? [],
      en: CASE_BODIES["fintech-iso27001-devsecops"]?.en,
      ja: CASE_BODIES["fintech-iso27001-devsecops"]?.ja,
    },
  },
  {
    slug: "banque-rag-cout-divise-10",
    featured: false,
    sector: { fr: "Banque tier-1", en: "Tier-1 bank", ja: "大手銀行", "fr-ca": "Banque de premier rang" },
    geo: "Paris",
    duration: "7 mois",
    teamSize: 4,
    techStack: ["Mistral 7B", "vLLM", "Qdrant", "LangSmith", "AWS Bedrock"],
    kpi: { value: "/10", label: { fr: "coût inférence mensuel", en: "monthly inference cost", ja: "月次推論コスト", "fr-ca": "coût inférence mensuel" } },
    publishedAt: "2025-12-10",
    title: {
      fr: "Banque européenne : RAG hybride, coût d'inférence divisé par dix.",
      en: "European bank: hybrid RAG, inference cost cut tenfold.",
      ja: "欧州銀行：ハイブリッドRAG、推論コスト10分の1。",
    },
    excerpt: {
      fr: "POC RAG à 10 000 €/mois. Architecture hybride local+cloud, cache, reranking. 900 €/mois à qualité égale.",
      en: "RAG PoC at €10,000/month. Hybrid local+cloud architecture, cache, reranking. €900/month at equal quality.",
      ja: "RAGのPoCが月1万ユーロ。ローカル+クラウドのハイブリッド、キャッシュ、reranking。品質同等で月900ユーロ。",
    },
    body: {
      fr: CASE_BODIES["banque-rag-cout-divise-10"]?.fr ?? [],
      en: CASE_BODIES["banque-rag-cout-divise-10"]?.en,
      ja: CASE_BODIES["banque-rag-cout-divise-10"]?.ja,
    },
  },
  {
    slug: "legacy-cobol-japon-modernisation",
    featured: false,
    sector: { fr: "Banque régionale", en: "Regional bank", ja: "地方銀行", "fr-ca": "Banque régionale" },
    geo: "Tokyo",
    duration: "14 mois",
    teamSize: 8,
    techStack: ["COBOL", "Java 21", "Spring Boot", "AWS Bedrock", "OpenSearch"],
    kpi: { value: "60%", label: { fr: "parc migré en 14 mois", en: "migrated in 14 months", ja: "14ヶ月で移行完了", "fr-ca": "parc migré en 14 mois" } },
    publishedAt: "2025-11-28",
    title: {
      fr: "Banque japonaise : 4M lignes COBOL, 3 agents IA, 60 % migré en 14 mois.",
      en: "Japanese bank: 4M lines of COBOL, 3 AI agents, 60% migrated in 14 months.",
      ja: "日本の銀行：COBOL 400万行、AIエージェント3体、14ヶ月で60%移行。",
    },
    excerpt: {
      fr: "9 dévs à la retraite dans 3 ans. Méthode multi-agents Abbeal : Archéologue, Architecte, Nettoyeur. Bounded contexts.",
      en: "9 devs retiring in 3 years. Abbeal multi-agent method: Archaeologist, Architect, Cleaner. Bounded contexts.",
      ja: "3年以内に9人が退職。Abbealマルチエージェント手法：考古学者、建築家、清掃人。Bounded contexts。",
    },
    body: {
      fr: CASE_BODIES["legacy-cobol-japon-modernisation"]?.fr ?? [],
      en: CASE_BODIES["legacy-cobol-japon-modernisation"]?.en,
      ja: CASE_BODIES["legacy-cobol-japon-modernisation"]?.ja,
    },
  },
  {
    slug: "energie-iot-edge-temps-reel",
    featured: false,
    sector: { fr: "Énergie", en: "Energy", ja: "エネルギー", "fr-ca": "Énergie" },
    geo: "Paris",
    duration: "10 mois",
    teamSize: 5,
    techStack: ["ONNX", "Edge TPU", "Kafka", "Flink", "MLflow"],
    kpi: { value: "< 5s", label: { fr: "détection anomalies", en: "anomaly detection", ja: "異常検知", "fr-ca": "détection d'anomalies" } },
    publishedAt: "2025-11-15",
    title: {
      fr: "Énergéticien : 50 000 capteurs, détection temps réel, 2,4 M€ économisés.",
      en: "Energy utility: 50,000 sensors, real-time detection, €2.4M saved.",
      ja: "エネルギー会社：5万センサー、リアルタイム検知、240万ユーロ削減。",
    },
    excerpt: {
      fr: "Anomalies détectées avec 8h de retard. Edge ML sur passerelles, fallback cloud, drift monitoring. −70 % incidents non détectés.",
      en: "Anomalies detected 8h late. Edge ML on gateways, cloud fallback, drift monitoring. −70% undetected incidents.",
      ja: "異常検知が8時間遅延。ゲートウェイ上のエッジML、クラウドfallback、ドリフト監視。未検知インシデント−70%。",
    },
    body: {
      fr: CASE_BODIES["energie-iot-edge-temps-reel"]?.fr ?? [],
      en: CASE_BODIES["energie-iot-edge-temps-reel"]?.en,
      ja: CASE_BODIES["energie-iot-edge-temps-reel"]?.ja,
    },
  },
  {
    slug: "retail-omnichannel-tri-geo",
    featured: false,
    sector: { fr: "Maison de luxe", en: "Luxury brand", ja: "ラグジュアリーブランド", "fr-ca": "Maison de luxe" },
    geo: "Tri-geo",
    duration: "22 mois",
    teamSize: 11,
    techStack: ["commercetools", "Algolia", "Snowflake", "Next.js", "AWS multi-region"],
    kpi: { value: "+24%", label: { fr: "conversion cross-canal", en: "cross-channel conversion", ja: "クロスチャネルCV", "fr-ca": "conversion omnicanal" } },
    publishedAt: "2025-10-30",
    title: {
      fr: "Maison de luxe : 280 boutiques, MACH, follow-the-sun, ROI en 18 mois.",
      en: "Luxury house: 280 stores, MACH, follow-the-sun, ROI in 18 months.",
      ja: "ラグジュアリーブランド：280店舗、MACH、follow-the-sun、18ヶ月でROI。",
    },
    excerpt: {
      fr: "Silos stocks/commandes/CRM. Architecture MACH, commerce composable, CDP unifiée, équipe globale sur 3 hubs.",
      en: "Silos across stock/orders/CRM. MACH architecture, composable commerce, unified CDP, global team on 3 hubs.",
      ja: "在庫・受注・CRMのサイロ化。MACHアーキテクチャ、composable commerce、CDP統合、3ハブ体制。",
    },
    body: {
      fr: CASE_BODIES["retail-omnichannel-tri-geo"]?.fr ?? [],
      en: CASE_BODIES["retail-omnichannel-tri-geo"]?.en,
      ja: CASE_BODIES["retail-omnichannel-tri-geo"]?.ja,
    },
  },
  {
    slug: "mobilite-canada-data-platform",
    featured: false,
    sector: { fr: "Transport", en: "Transport", ja: "交通", "fr-ca": "Transport" },
    geo: "Montréal",
    duration: "9 mois",
    teamSize: 6,
    techStack: ["Databricks", "dbt", "Tableau", "Airflow", "Azure"],
    kpi: { value: "60%", label: { fr: "analystes autonomes", en: "autonomous analysts", ja: "自律アナリスト", "fr-ca": "analystes autonomes" } },
    publishedAt: "2025-10-12",
    title: {
      fr: "Opérateur canadien : 12 silos data → lakehouse, KPIs temps réel.",
      en: "Canadian operator: 12 data silos → lakehouse, real-time KPIs.",
      ja: "カナダのオペレーター：データサイロ12個→lakehouse、リアルタイムKPI。",
    },
    excerpt: {
      fr: "KPIs incohérents, dashboards en retard de 48h. Lakehouse Databricks, medallion, dbt, BI self-service.",
      en: "Inconsistent KPIs, dashboards 48h late. Databricks lakehouse, medallion, dbt, self-service BI.",
      ja: "KPI不整合、ダッシュボード48時間遅延。Databricks lakehouse、medallion、dbt、セルフサービスBI。",
    },
    body: {
      fr: CASE_BODIES["mobilite-canada-data-platform"]?.fr ?? [],
      en: CASE_BODIES["mobilite-canada-data-platform"]?.en,
      ja: CASE_BODIES["mobilite-canada-data-platform"]?.ja,
    },
  },
  {
    slug: "assurance-claims-ia-document",
    featured: false,
    sector: { fr: "Assurance globale", en: "Global insurance", ja: "グローバル保険", "fr-ca": "Assurance mondiale" },
    geo: "Paris + Tokyo",
    duration: "12 mois",
    teamSize: 9,
    techStack: ["LayoutLMv3", "Claude Sonnet", "AWS Textract", "Camunda", "FastAPI"],
    kpi: { value: "−70%", label: { fr: "temps traitement sinistres", en: "claims processing time", ja: "請求処理時間", "fr-ca": "délai traitement sinistres" } },
    publishedAt: "2025-09-28",
    title: {
      fr: "Assureur global : 80 000 sinistres/mois, −70 % de temps de traitement.",
      en: "Global insurer: 80,000 claims/month, −70% processing time.",
      ja: "グローバル保険会社：月8万件、処理時間−70%。",
    },
    excerpt: {
      fr: "OCR vieillissant, 14 jours de cycle. Layout-aware extraction, multimodal LLM, validation humaine sur exceptions.",
      en: "Aging OCR, 14-day cycle. Layout-aware extraction, multimodal LLM, human validation on exceptions.",
      ja: "老朽化したOCR、サイクル14日。レイアウト対応抽出、マルチモーダルLLM、例外時の人間検証。",
    },
    body: {
      fr: CASE_BODIES["assurance-claims-ia-document"]?.fr ?? [],
      en: CASE_BODIES["assurance-claims-ia-document"]?.en,
      ja: CASE_BODIES["assurance-claims-ia-document"]?.ja,
    },
  },
  // Case 11 — Loi 25 fintech Montréal.
  // TODO_VERIFY_CLIENT: storyline plausible mais non basée sur un client réel
  // identifié à ce jour. À remplacer par un vrai cas anonymisé dès qu'un
  // client QC ayant fait sa mise en conformité Loi 25 avec Abbeal accepte
  // la publication. Le contenu factuel sur la Loi 25 (entrée en vigueur
  // sept. 2023, art. 8/9, sanctions CAI jusqu'à 4% CA mondial) est exact.
  {
    slug: "loi-25-fintech-conformite-6-semaines",
    featured: false,
    template: true,
    sector: { fr: "FinTech", en: "FinTech", ja: "フィンテック", "fr-ca": "Techno financière" },
    geo: "Montréal",
    duration: "6 semaines",
    teamSize: 3,
    techStack: ["Next.js", "PostgreSQL", "Vercel", "OneTrust", "Cypress"],
    kpi: {
      value: "6 sem",
      label: {
        fr: "vers conformité Loi 25",
        en: "to Law 25 compliance",
        ja: "Loi 25準拠まで",
        "fr-ca": "vers conformité à la Loi 25",
      },
    },
    publishedAt: "2026-04-22",
    title: {
      fr: "Fintech montréalaise : conformité Loi 25 livrée en 6 semaines.",
      en: "Montréal fintech: Law 25 compliance shipped in 6 weeks.",
      ja: "モントリオールのフィンテック：6週間でLoi 25準拠。",
      "fr-ca": "Techno financière montréalaise : conformité à la Loi 25 livrée en 6 semaines.",
    },
    excerpt: {
      fr: "Audit complet, pipeline de consentement, gouvernance des accès. Sans freezer le roadmap produit. Auditée par la CAI sans réserve.",
      en: "Complete audit, consent pipeline, access governance. Without freezing the product roadmap. Audited by CAI with zero reservations.",
      ja: "完全な監査、同意パイプライン、アクセスガバナンス。製品ロードマップを凍結せず。CAIから条件なしで監査済み。",
      "fr-ca": "Audit complet, pipeline de consentement, gouvernance des accès. Sans freezer la feuille de route produit. Auditée par la CAI sans réserve.",
    },
    body: {
      fr: CASE_BODIES["loi-25-fintech-conformite-6-semaines"]?.fr ?? [],
      en: CASE_BODIES["loi-25-fintech-conformite-6-semaines"]?.en,
      ja: CASE_BODIES["loi-25-fintech-conformite-6-semaines"]?.ja,
      "fr-ca": CASE_BODIES["loi-25-fintech-conformite-6-semaines"]?.["fr-ca"],
    },
  },
];

export function getCase(slug: string): CaseStudy | undefined {
  return cases.find((c) => c.slug === slug);
}

export function getFeaturedCases(): CaseStudy[] {
  return cases.filter((c) => c.featured);
}

export function getAllCases(): CaseStudy[] {
  // Tri composite : featured d'abord (clients iconic Cartier/BNP/Money Forward
  // /Pichet/Le Monde remontent), puis par date desc en fallback. Cohérent
  // avec getAllArticles() et le marquee homepage qui pousse les 5 featured.
  return [...cases].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.publishedAt < b.publishedAt ? 1 : -1;
  });
}
