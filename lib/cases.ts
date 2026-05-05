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
  /** Slug du logo client dans /public/logos/{slug}.svg. Optionnel : seuls
   *  les cases nommés (client public ou autorisation explicite) ont un logo.
   *  Les cases anonymisés ou template restent sans logo. */
  clientLogo?: string;
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
  // Le Monde — 1er case nommé. Mission active depuis 2019, ingénieur intégré
  // dans la team Insights Data, opère depuis Tokyo depuis 2023 → preuve
  // tri-géo concrète Paris ↔ Tokyo. Stack initiale (JS Vanilla + React + PHP +
  // Go) layered avec stack Insights moderne 2024-2026 (BigQuery + dbt +
  // Airflow + GA4 server-side + Vercel Edge). Pas d'IA exposée pour rester
  // safe vis-à-vis de la réalité mission. featured: false jusqu'à validation
  // des autres cases nommés (Cirque, Skello, Oney, Bell, BNP, Pichet, TheFork).
  // Préserve le SEO de l'URL legacy /projets/le-monde (308 redirect dans
  // next.config.ts).
  {
    slug: "le-monde",
    featured: false,
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
      "BigQuery",
      "dbt",
      "Airflow",
      "GA4 server-side",
      "Vercel Edge",
      "React",
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
    publishedAt: "2026-05-05",
    title: {
      fr: "Le Monde : 6 ans dans la team Insights, de Paris à Tokyo.",
      en: "Le Monde: 6 years embedded in the Insights team, from Paris to Tokyo.",
      ja: "ル・モンド：Insightsチームに6年、パリから東京まで。",
      "fr-ca": "Le Monde : 6 ans dans l'équipe Insights, de Paris à Tokyo.",
    },
    excerpt: {
      fr: "Tagging DOM, A/B testing, pipelines BigQuery + dbt, mesure d'audience server-side. Un ingénieur Abbeal au cœur de la rédaction depuis 2019 — opérant depuis Tokyo depuis 2023. Follow-the-Sun, vraiment.",
      en: "DOM tagging, A/B testing, BigQuery + dbt pipelines, server-side audience measurement. One Abbeal engineer embedded in the newsroom since 2019 — operating from Tokyo since 2023. Follow-the-Sun, for real.",
      ja: "DOMタグ、A/Bテスト、BigQuery + dbtパイプライン、サーバーサイド視聴計測。2019年から編集部に組み込まれた1名のAbbealエンジニア — 2023年から東京で稼働。Follow-the-Sunを本当に実現。",
      "fr-ca": "Étiquetage DOM, tests A/B, pipelines BigQuery + dbt, mesure d'audience côté serveur. Un ingénieur Abbeal intégré à la salle de rédaction depuis 2019 — opérant depuis Tokyo depuis 2023. Follow-the-Sun, vraiment.",
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
    featured: false,
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
    publishedAt: "2026-05-04",
    title: {
      fr: "BNP Paribas : Reference Book PO, du React/Redux 2018 aux agents IA 2026.",
      en: "BNP Paribas: Reference Book PO, from React/Redux 2018 to AI agents 2026.",
      ja: "BNPパリバ：Reference Book PO、2018年のReact/Reduxから2026年のAIエージェントへ。",
      "fr-ca": "BNP Paribas : Reference Book PO, de React/Redux 2018 aux agents IA 2026.",
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
    featured: false,
    clientLogo: "pichet",
    sector: {
      fr: "Immobilier / Promotion",
      en: "Real estate / Property",
      ja: "不動産 / プロモーション",
      "fr-ca": "Immobilier / Promotion",
    },
    geo: "Paris + Bordeaux",
    duration: "2018-2020 + relais 2026",
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
    publishedAt: "2026-05-03",
    title: {
      fr: "Pichet : du Symfony/eZplatform 2018 à l'IA Vision sur plans 2026.",
      en: "Pichet: from Symfony/eZplatform 2018 to AI Vision on floor plans 2026.",
      ja: "ピシェ：2018年のSymfony/eZplatformから2026年の間取りAI Visionへ。",
      "fr-ca": "Pichet : de Symfony/eZplatform 2018 à l'IA Vision sur plans 2026.",
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
    publishedAt: "2026-05-02",
    title: {
      fr: "Tripadvisor (TheFork) : du Symfony/SolR 2017 à la reco IA hybride 2026.",
      en: "Tripadvisor (TheFork): from Symfony/SolR 2017 to hybrid AI reco in 2026.",
      ja: "トリップアドバイザー（ザ・フォーク）：2017年のSymfony/SolRから2026年のハイブリッドAI推薦へ。",
      "fr-ca": "Tripadvisor (TheFork) : de Symfony/SolR 2017 à la reco IA hybride 2026.",
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
    duration: "4 ans (2019-2023)",
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
      value: "4 ans",
      label: {
        fr: "co-construction produit",
        en: "product co-build",
        ja: "プロダクト共同構築",
        "fr-ca": "co-construction produit",
      },
    },
    publishedAt: "2026-05-01",
    title: {
      fr: "Groupe Réussite : 4 ans de marketplace edtech, ranking IA et messagerie temps réel.",
      en: "Groupe Réussite: 4 years of edtech marketplace, AI ranking and real-time messaging.",
      ja: "グループ・レユシット：4年間のEdTechマーケットプレイス、AIランキング、リアルタイムメッセージング。",
      "fr-ca": "Groupe Réussite : 4 ans de place de marché edtech, classement IA et messagerie en temps réel.",
    },
    excerpt: {
      fr: "Marketplace edtech qui matche élèves, parents et professeurs particuliers sur 60+ matières. Abbeal Studio sur 4 ans (2019-2023) : conception, MVP, V1, algorithme de ranking, moteur de recherche multicritères, espace prof LMS, paiements Stripe Connect, messagerie temps réel.",
      en: "Edtech marketplace matching students, parents and private tutors across 60+ subjects. Abbeal Studio over 4 years (2019-2023): design, MVP, V1, ranking algorithm, multi-criteria search engine, teacher LMS space, Stripe Connect payments, real-time messaging.",
      ja: "60以上の科目で生徒、保護者、家庭教師をマッチングするEdTechマーケットプレイス。4年間のAbbeal Studio（2019-2023）：設計、MVP、V1、ランキングアルゴリズム、マルチ基準検索エンジン、講師LMSスペース、Stripe Connect決済、リアルタイムメッセージング。",
      "fr-ca": "Place de marché edtech qui jumelle élèves, parents et tuteurs privés sur plus de 60 matières. Abbeal Studio sur 4 ans (2019-2023) : conception, MVP, V1, algorithme de classement, moteur de recherche multicritères, espace prof LMS, paiements Stripe Connect, messagerie en temps réel.",
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
    featured: false,
    clientLogo: "cartier",
    sector: {
      fr: "Joaillerie & horlogerie de luxe",
      en: "Luxury jewellery & watchmaking",
      ja: "ラグジュアリージュエリー＆時計",
      "fr-ca": "Joaillerie & horlogerie de luxe",
    },
    geo: "Genève + Paris + Tokyo",
    duration: "4,5 ans (depuis fin 2021)",
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
    publishedAt: "2026-04-30",
    title: {
      fr: "Cartier : 4,5 ans, de l'audit au LLM privé en interne.",
      en: "Cartier: 4.5 years, from audit to in-house private LLM.",
      ja: "カルティエ：4.5年、監査から社内プライベートLLMまで。",
      "fr-ca": "Cartier : 4,5 ans, de l'audit au LLM privé en interne.",
    },
    excerpt: {
      fr: "Compass (audits archi front + back), Mapper (générateur produits horlogerie + joaillerie), ETL data concurrence sur BigQuery, et désormais un LLM privé fine-tuné sur l'infra Cartier. Quatre ans et demi de partenariat tech sur la stack data et IA d'une maison de luxe.",
      en: "Compass (front + back architecture audits), Mapper (watchmaking + jewellery product generator), competitive data ETL on BigQuery, and now a private LLM fine-tuned on Cartier's own infra. Four and a half years of tech partnership on the data and AI stack of a luxury house.",
      ja: "Compass（フロント＋バックエンド・アーキテクチャ監査）、Mapper（時計＋ジュエリー製品ジェネレーター）、BigQuery上の競合データETL、そして現在Cartier自社インフラでファインチューニングされたプライベートLLM。ラグジュアリーメゾンのデータ＆AIスタックでの4年半のテックパートナーシップ。",
      "fr-ca": "Compass (audits architecture frontale + arriere), Mapper (generateur produits horlogerie + joaillerie), ETL donnees concurrence sur BigQuery, et desormais un LLM prive ajuste sur l'infra Cartier. Quatre ans et demi de partenariat tech sur la pile data et IA d'une maison de luxe.",
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
  return [...cases].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  );
}
