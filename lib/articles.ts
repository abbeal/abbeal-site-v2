/**
 * Articles manifest — 10 long-form posts.
 * Body content stored as block array for typed rendering.
 * EN/JA bodies optional — fallback to FR with locale notice.
 */

import type { Locale } from "./i18n";
import bodies from "./article-bodies.json";

type BodiesMap = Record<string, { fr: ArticleBlock[]; en?: ArticleBlock[]; ja?: ArticleBlock[] }>;
const ARTICLE_BODIES = bodies as BodiesMap;

export type ArticleBlock =
  | { type: "h2"; content: string }
  | { type: "h3"; content: string }
  | { type: "p"; content: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; content: string; author?: string }
  | { type: "code"; lang?: string; content: string }
  | { type: "callout"; tone?: "default" | "teal" | "ink"; content: string };

type Translatable<T> = { fr: T } & Partial<Record<Exclude<Locale, "fr">, T>>;

export type Article = {
  slug: string;
  featured: boolean; // top 3 shown on home
  tag: string;
  readTime: string;
  publishedAt: string; // ISO date
  title: Translatable<string>;
  excerpt: Translatable<string>;
  body: Translatable<ArticleBlock[]>;
};

export type Resolved<T> = T extends Translatable<infer U> ? U : never;

export const articles: Article[] = [
  // Article 1 — IA, featured
  {
    slug: "agents-ia-production",
    featured: true,
    tag: "IA",
    readTime: "8 min",
    publishedAt: "2026-04-12",
    title: {
      fr: "Agents IA en production : éviter le théâtre de démo.",
      en: "AI agents in production: avoiding the demo theatre.",
      ja: "本番のAIエージェント：デモ劇場を避ける。",
    },
    excerpt: {
      fr: "Fiabilité, coûts, sécurité, évaluation. Sept patterns qu'on utilise vraiment chez nos clients.",
      en: "Reliability, cost, security, evaluation. Seven patterns we actually use with our clients.",
      ja: "信頼性、コスト、セキュリティ、評価。クライアントで実際に使う7つのパターン。",
    },
    body: {
      fr: ARTICLE_BODIES["agents-ia-production"]?.fr ?? [],
      en: ARTICLE_BODIES["agents-ia-production"]?.en,
      ja: ARTICLE_BODIES["agents-ia-production"]?.ja,
    },
  },
  // Article 2 — GreenOps, featured
  {
    slug: "greenops-7-leviers",
    featured: true,
    tag: "GreenOps",
    readTime: "6 min",
    publishedAt: "2026-04-08",
    title: {
      fr: "GreenOps : sept leviers qui coupent 30 % de votre facture cloud.",
      en: "GreenOps: seven levers that cut 30% of your cloud bill.",
      ja: "GreenOps：クラウド請求を30%削減する7つのレバー。",
    },
    excerpt: {
      fr: "Sans sacrifier la performance. Cas concrets : −30 % sur la facture, mêmes SLOs.",
      en: "Without sacrificing performance. Concrete cases: -30% on the bill, same SLOs.",
      ja: "パフォーマンスを犠牲にせず。具体例：請求-30%、SLO同等。",
    },
    body: {
      fr: ARTICLE_BODIES["greenops-7-leviers"]?.fr ?? [],
      en: ARTICLE_BODIES["greenops-7-leviers"]?.en,
      ja: ARTICLE_BODIES["greenops-7-leviers"]?.ja,
    },
  },
  // Article 3 — Tech radar, featured
  {
    slug: "tech-radar-2026",
    featured: true,
    tag: "Tech radar",
    readTime: "10 min",
    publishedAt: "2026-04-01",
    title: {
      fr: "Tech Radar 2026 : pourquoi Rust et ROS 2 dominent.",
      en: "Tech Radar 2026: why Rust and ROS 2 dominate.",
      ja: "Tech Radar 2026：なぜRustとROS 2が支配するか。",
    },
    excerpt: {
      fr: "Critères, retours d'expérience, trade-offs. Ce qu'on adopte vraiment vs ce qu'on évalue.",
      en: "Criteria, field reports, trade-offs. What we actually adopt vs what we assess.",
      ja: "基準、現場レポート、トレードオフ。実際にAdoptするものとAssessするもの。",
    },
    body: {
      fr: ARTICLE_BODIES["tech-radar-2026"]?.fr ?? [],
      en: ARTICLE_BODIES["tech-radar-2026"]?.en,
      ja: ARTICLE_BODIES["tech-radar-2026"]?.ja,
    },
  },
  // Article 4 — Follow-the-Sun
  {
    slug: "follow-the-sun-sans-bruler-equipes",
    featured: false,
    tag: "Engineering",
    readTime: "7 min",
    publishedAt: "2026-03-25",
    title: {
      fr: "Follow-the-Sun : 24/7 sans brûler les équipes.",
      en: "Follow-the-Sun: 24/7 without burning teams out.",
      ja: "Follow-the-Sun：チームを燃え尽きさせずに24/7。",
    },
    excerpt: {
      fr: "Trois fuseaux, trois équipes, une roadmap qui avance pendant que vous dormez. Comment on l'opère vraiment.",
      en: "Three time zones, three teams, a roadmap that moves while you sleep. How we actually operate it.",
      ja: "3つのタイムゾーン、3つのチーム、あなたが寝ている間に進むロードマップ。私たちの実際の運用。",
    },
    body: {
      fr: ARTICLE_BODIES["follow-the-sun-sans-bruler-equipes"]?.fr ?? [],
      en: ARTICLE_BODIES["follow-the-sun-sans-bruler-equipes"]?.en,
      ja: ARTICLE_BODIES["follow-the-sun-sans-bruler-equipes"]?.ja,
    },
  },
  // Article 5 — Legacy modernization
  {
    slug: "legacy-modernization-multi-agents",
    featured: false,
    tag: "Legacy",
    readTime: "9 min",
    publishedAt: "2026-03-18",
    title: {
      fr: "Legacy Modernization : trois agents IA qui font le travail de trente devs.",
      en: "Legacy Modernization: three AI agents doing the work of thirty devs.",
      ja: "レガシー・モダナイゼーション：30人の開発者の仕事をする3つのAIエージェント。",
    },
    excerpt: {
      fr: "Archéologue, Architecte, Nettoyeur. Notre méthode multi-agents pour migrer 20 ans de COBOL en six mois.",
      en: "Archaeologist, Architect, Cleaner. Our multi-agent method to migrate 20 years of COBOL in six months.",
      ja: "考古学者、建築家、清掃人。20年分のCOBOLを6ヶ月で移行するマルチエージェント手法。",
    },
    body: {
      fr: ARTICLE_BODIES["legacy-modernization-multi-agents"]?.fr ?? [],
      en: ARTICLE_BODIES["legacy-modernization-multi-agents"]?.en,
      ja: ARTICLE_BODIES["legacy-modernization-multi-agents"]?.ja,
    },
  },
  // Article 6 — RAG case study
  {
    slug: "rag-production-10k-a-900",
    featured: false,
    tag: "IA",
    readTime: "8 min",
    publishedAt: "2026-03-10",
    title: {
      fr: "RAG en production : de 10 000 € à 900 € par mois.",
      en: "RAG in production: from €10,000 to €900 per month.",
      ja: "本番のRAG：月額10,000ユーロから900ユーロへ。",
    },
    excerpt: {
      fr: "Une banque européenne, un pipeline RAG, une stratégie hybride. Comment on a divisé les coûts d'inférence par dix.",
      en: "A European bank, a RAG pipeline, a hybrid strategy. How we cut inference costs by ten.",
      ja: "欧州銀行、RAGパイプライン、ハイブリッド戦略。推論コストを10分の1にした方法。",
    },
    body: {
      fr: ARTICLE_BODIES["rag-production-10k-a-900"]?.fr ?? [],
      en: ARTICLE_BODIES["rag-production-10k-a-900"]?.en,
      ja: ARTICLE_BODIES["rag-production-10k-a-900"]?.ja,
    },
  },
  // Article 7 — COBOL retirement
  {
    slug: "cobol-pas-mort-developpeurs-oui",
    featured: false,
    tag: "Legacy",
    readTime: "5 min",
    publishedAt: "2026-03-03",
    title: {
      fr: "COBOL n'est pas mort. Les devs qui le maintenaient, oui.",
      en: "COBOL isn't dead. The devs who maintained it, yes.",
      ja: "COBOLは死んでいない。それを保守していた開発者は、はい。",
    },
    excerpt: {
      fr: "2025, 85 % des grandes entreprises japonaises sur des systèmes critiques sans personne pour les comprendre. Notre offre.",
      en: "2025, 85% of large Japanese firms running critical systems with nobody who understands them. Our offer.",
      ja: "2025年、大手日本企業の85%が誰も理解できない基幹システムで動いている。私たちの提案。",
    },
    body: {
      fr: ARTICLE_BODIES["cobol-pas-mort-developpeurs-oui"]?.fr ?? [],
      en: ARTICLE_BODIES["cobol-pas-mort-developpeurs-oui"]?.en,
      ja: ARTICLE_BODIES["cobol-pas-mort-developpeurs-oui"]?.ja,
    },
  },
  // Article 8 — Sovereignty FR/JP
  {
    slug: "souverainete-secnumcloud-vs-appi",
    featured: false,
    tag: "Cloud",
    readTime: "9 min",
    publishedAt: "2026-02-25",
    title: {
      fr: "Souveraineté numérique : SecNumCloud vs APPI, comment on navigue.",
      en: "Digital sovereignty: SecNumCloud vs APPI, how we navigate.",
      ja: "デジタル主権：SecNumCloud vs APPI、私たちのナビゲーション。",
    },
    excerpt: {
      fr: "Obsession française pour la souveraineté vs pragmatisme japonais. Architectures hybrides qui passent les deux audits.",
      en: "French obsession with sovereignty vs Japanese pragmatism. Hybrid architectures that pass both audits.",
      ja: "フランスの主権へのこだわり vs 日本のプラグマティズム。両方の監査を通すハイブリッドアーキテクチャ。",
    },
    body: {
      fr: ARTICLE_BODIES["souverainete-secnumcloud-vs-appi"]?.fr ?? [],
      en: ARTICLE_BODIES["souverainete-secnumcloud-vs-appi"]?.en,
      ja: ARTICLE_BODIES["souverainete-secnumcloud-vs-appi"]?.ja,
    },
  },
  // Article 9 — Talent acquisition
  {
    slug: "recruter-top-1-tech-process-48h",
    featured: false,
    tag: "Talent",
    readTime: "6 min",
    publishedAt: "2026-02-18",
    title: {
      fr: "Recruter le Top 1 % tech : le process 48 h d'Abbeal.",
      en: "Hiring the top 1% in tech: Abbeal's 48-hour process.",
      ja: "トップ1%のテック人材採用：Abbealの48時間プロセス。",
    },
    excerpt: {
      fr: "Sourcing par des ingés, validation technique courte, closing en 48 h. Comment on évite les CV-puzzle.",
      en: "Engineer-led sourcing, short technical validation, closing in 48 hours. How we avoid CV-puzzles.",
      ja: "エンジニアによるソーシング、短い技術検証、48時間でクロージング。CVパズルを避ける方法。",
    },
    body: {
      fr: ARTICLE_BODIES["recruter-top-1-tech-process-48h"]?.fr ?? [],
      en: ARTICLE_BODIES["recruter-top-1-tech-process-48h"]?.en,
      ja: ARTICLE_BODIES["recruter-top-1-tech-process-48h"]?.ja,
    },
  },
  // Article 10 — Mobbeal playbook
  {
    slug: "mobbeal-playbook-garde-ton-job",
    featured: false,
    tag: "Mobbeal",
    readTime: "8 min",
    publishedAt: "2026-02-10",
    title: {
      fr: "Mobbeal Playbook : garde ton job, change de vie.",
      en: "Mobbeal Playbook: keep your job, change your life.",
      ja: "Mobbealプレイブック：仕事はそのまま、人生を変える。",
    },
    excerpt: {
      fr: "50+ talents expatriés en cinq ans. Le modèle qu'on a affiné, les pièges, les wins. Et qui on cherche.",
      en: "50+ engineers relocated in five years. The model we refined, the pitfalls, the wins. And who we're looking for.",
      ja: "5年で50人以上が海外赴任。私たちが洗練したモデル、落とし穴、成功。そして探している人材。",
    },
    body: {
      fr: ARTICLE_BODIES["mobbeal-playbook-garde-ton-job"]?.fr ?? [],
      en: ARTICLE_BODIES["mobbeal-playbook-garde-ton-job"]?.en,
      ja: ARTICLE_BODIES["mobbeal-playbook-garde-ton-job"]?.ja,
    },
  },
  // Article 11 — EN-first piece. AI agents in production, framed for the
  // English-speaking enterprise CTO market (Tokyo / Mtl / NY). FR body is a
  // short pointer back to the existing FR-language piece on the same topic.
  // Strengthens /en differentiation against /fr to fight the GSC duplicate
  // perception flagged 2026-04-30.
  {
    slug: "ai-agents-french-banks",
    featured: false,
    tag: "AI",
    readTime: "7 min",
    publishedAt: "2026-04-28",
    title: {
      fr: "Agents IA dans les banques françaises : 7 leçons côté production.",
      en: "AI agents in production: 7 patterns French banks taught us.",
      ja: "本番のAIエージェント：フランスの銀行から学んだ7つのパターン。",
    },
    excerpt: {
      fr: "Article publié en anglais. Synthèse FR ci-dessous, version complète en EN.",
      en: "Field notes from BNP, SocGen and a top-3 French insurer. What changes when your agent runs against COBOL cores, ACPR audit logs and a 4 ms p99 budget.",
      ja: "BNP、SocGen、フランス大手保険会社からのフィールドノート。COBOLコア、ACPR監査ログ、4ms p99予算に対してエージェントが動作する場合の変更点。",
    },
    body: {
      fr: ARTICLE_BODIES["ai-agents-french-banks"]?.fr ?? [],
      en: ARTICLE_BODIES["ai-agents-french-banks"]?.en,
      ja: ARTICLE_BODIES["ai-agents-french-banks"]?.ja,
    },
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured);
}

export function getAllArticles(): Article[] {
  return [...articles].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1,
  );
}

/** Pick localized field with fallback to FR */
export function pick<T>(field: Translatable<T>, locale: Locale): T {
  return (field[locale] as T) ?? field.fr;
}
