/**
 * Case studies manifest — 10 engagements clients anonymisés.
 * Même pattern que articles.ts : body en blocs typés, body localisé FR (EN/JA en fallback).
 */

import type { Locale } from "./i18n";
import type { ArticleBlock } from "./articles";
import bodies from "./case-bodies.json";

type BodiesMap = Record<string, { fr: ArticleBlock[]; en?: ArticleBlock[]; ja?: ArticleBlock[] }>;
const CASE_BODIES = bodies as BodiesMap;

type Translatable<T> = { fr: T } & Partial<Record<Exclude<Locale, "fr">, T>>;

export type CaseStudy = {
  slug: string;
  featured: boolean; // 4 cases mises en avant
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
