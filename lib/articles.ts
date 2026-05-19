/**
 * Articles manifest — 10 long-form posts.
 * Body content stored as block array for typed rendering.
 * EN/JA bodies optional — fallback to FR with locale notice.
 */

import type { Locale } from "./i18n";
import bodies from "./article-bodies.json";

type BodiesMap = Record<
  string,
  {
    fr: ArticleBlock[];
    en?: ArticleBlock[];
    ja?: ArticleBlock[];
    "fr-ca"?: ArticleBlock[];
  }
>;
const ARTICLE_BODIES = bodies as BodiesMap;

export type ArticleBlock =
  | { type: "h2"; content: string }
  | { type: "h3"; content: string }
  | { type: "p"; content: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; content: string; author?: string }
  | { type: "code"; lang?: string; content: string }
  | { type: "callout"; tone?: "default" | "teal" | "ink"; content: string }
  /** Outbound link CTA — ex: backlink vers le site client */
  | { type: "link"; label: string; href: string; external?: boolean }
  /** Header de section "plateforme" — combine logo + nom + lien externe.
   *  Ex utilise dans /insights/apprendre-japonais-tokyo... pour Anki/
   *  WaniKani/Bunpro. logoSrc = chemin absolu sous /public (ex
   *  "/article-assets/anki.svg"). */
  | {
      type: "platformHeader";
      name: string;
      logoSrc: string;
      href: string;
      tagline?: string;
    }
  /** Image illustrative dans le body. src = chemin absolu sous /public.
   *  Caption optionnelle affichée en dessous, italique gris. */
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    };

type Translatable<T> = { fr: T } & Partial<Record<Exclude<Locale, "fr">, T>>;

export type Article = {
  slug: string;
  /** True = remonté en haut de /insights listing (tri featured DESC, date DESC).
   *  Différent de `featuredOnHome` car la home a un slot limité (3 cards
   *  visibles) et tout `featured` ne mérite pas forcément ce slot scarce.
   */
  featured: boolean;
  /** True = inclus dans le bloc Insights de la homepage (3 cards). Si non
   *  défini : fallback sur `featured`. Permet de désactiver un article du
   *  slot home tout en le gardant en haut de /insights.
   *  Ex : "automatiser-journee-ceo-claude-orchestration" est featured pour
   *  /insights mais featuredOnHome=false pour ne pas surcharger la home
   *  (qui doit garder 3 cards = Agents IA + GreenOps + Tech Radar).
   */
  featuredOnHome?: boolean;
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
      en: "7 patterns for AI agents in production (no demo theater).",
      ja: "本番のAIエージェント：デモ劇場を避ける。",
    },
    excerpt: {
      fr: "Fiabilité, coûts, sécurité, évaluation. Sept patterns qu'on utilise vraiment chez nos clients.",
      en: "Real-world patterns from RAG, agents and MLOps deployments. Senior teams shipping AI from POC to prod across Paris, Montréal, Tokyo.",
      ja: "信頼性、コスト、セキュリティ、評価。クライアントで実際に使う7つのパターン。",
    },
    body: {
      fr: ARTICLE_BODIES["agents-ia-production"]?.fr ?? [],
      en: ARTICLE_BODIES["agents-ia-production"]?.en,
      ja: ARTICLE_BODIES["agents-ia-production"]?.ja,
      "fr-ca": ARTICLE_BODIES["agents-ia-production"]?.["fr-ca"],
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
      "fr-ca": ARTICLE_BODIES["greenops-7-leviers"]?.["fr-ca"],
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
      ja: "Tech Radar 2026：AdoptからHoldまで、現場視点の技術評価。",
    },
    excerpt: {
      fr: "Critères, retours d'expérience, trade-offs. Ce qu'on adopte vraiment vs ce qu'on évalue.",
      en: "Criteria, field reports, trade-offs. What we actually adopt vs what we assess.",
      ja: "Rust、ROS 2、LLM Agentsなど、Abbealのシニアエンジニアが2026年に推す技術と外す技術。adopt/trial/assess/holdの基準も。",
    },
    body: {
      fr: ARTICLE_BODIES["tech-radar-2026"]?.fr ?? [],
      en: ARTICLE_BODIES["tech-radar-2026"]?.en,
      ja: ARTICLE_BODIES["tech-radar-2026"]?.ja,
      "fr-ca": ARTICLE_BODIES["tech-radar-2026"]?.["fr-ca"],
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
      "fr-ca": ARTICLE_BODIES["follow-the-sun-sans-bruler-equipes"]?.["fr-ca"],
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
      "fr-ca": ARTICLE_BODIES["legacy-modernization-multi-agents"]?.["fr-ca"],
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
      "fr-ca": ARTICLE_BODIES["rag-production-10k-a-900"]?.["fr-ca"],
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
      en: "COBOL is not dead. The developers are.",
      ja: "COBOLは死んでいない。それを保守していた開発者は、はい。",
    },
    excerpt: {
      fr: "2025, 85 % des grandes entreprises japonaises sur des systèmes critiques sans personne pour les comprendre. Notre offre.",
      en: "4M lines, 14 months: how a Japanese bank modernized COBOL with multi-agent AI (Archeologist, Architect, Cleaner). Senior pod, Tokyo + Paris.",
      ja: "2025年、大手日本企業の85%が誰も理解できない基幹システムで動いている。私たちの提案。",
    },
    body: {
      fr: ARTICLE_BODIES["cobol-pas-mort-developpeurs-oui"]?.fr ?? [],
      en: ARTICLE_BODIES["cobol-pas-mort-developpeurs-oui"]?.en,
      ja: ARTICLE_BODIES["cobol-pas-mort-developpeurs-oui"]?.ja,
      "fr-ca": ARTICLE_BODIES["cobol-pas-mort-developpeurs-oui"]?.["fr-ca"],
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
      "fr-ca": ARTICLE_BODIES["souverainete-secnumcloud-vs-appi"]?.["fr-ca"],
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
      "fr-ca": ARTICLE_BODIES["recruter-top-1-tech-process-48h"]?.["fr-ca"],
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
      "fr-ca": ARTICLE_BODIES["mobbeal-playbook-garde-ton-job"]?.["fr-ca"],
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
      fr: "Agents IA dans les banques françaises : 7 patterns côté production.",
      en: "AI agents in production: 7 patterns French banks taught us.",
      ja: "本番のAIエージェント：フランスの銀行から学んだ7つのパターン。",
      "fr-ca": "Agents IA dans les banques françaises : 7 patrons côté production.",
    },
    excerpt: {
      fr: "Notes de terrain BNP / Société Générale / assureur top 3 français. Ce qui change quand ton agent tourne contre des cores COBOL, des logs d'audit ACPR et un budget p99 de 4 ms.",
      en: "Field notes from BNP, SocGen and a top-3 French insurer. What changes when your agent runs against COBOL cores, ACPR audit logs and a 4 ms p99 budget.",
      ja: "BNP、SocGen、フランス大手保険会社からのフィールドノート。COBOLコア、ACPR監査ログ、4ms p99予算に対してエージェントが動作する場合の変更点。",
      "fr-ca": "Notes de terrain BNP / Société Générale / assureur top 3 français. Ce qui change quand ton agent tourne contre des noyaux COBOL, des journaux d'audit ACPR et un budget p99 de 4 ms.",
    },
    body: {
      fr: ARTICLE_BODIES["ai-agents-french-banks"]?.fr ?? [],
      en: ARTICLE_BODIES["ai-agents-french-banks"]?.en,
      ja: ARTICLE_BODIES["ai-agents-french-banks"]?.ja,
      "fr-ca": ARTICLE_BODIES["ai-agents-french-banks"]?.["fr-ca"],
    },
  },
  // Article 13 — Hugo : VIE Tokyo, dev fullstack, ex-Toyota France
  {
    slug: "vie-tokyo-developpeur-hugo",
    featured: false,
    tag: "Mobbeal",
    readTime: "5 min",
    publishedAt: "2026-05-06",
    title: {
      fr: "VIE Tokyo : Hugo, développeur fullstack, parti après 3 ans chez Toyota France.",
      en: "VIE Tokyo: Hugo, fullstack developer, left after 3 years at Toyota France.",
      ja: "VIE東京：Hugo、フルスタック開発者、トヨタ・フランスでの3年後に出発。",
      "fr-ca": "VIE Tokyo : Hugo, développeur fullstack, parti après 3 ans chez Toyota France.",
    },
    excerpt: {
      fr: "26 ans, en VIE chez Abbeal Tokyo depuis octobre 2025 sur une mission e-commerce IBM HCL Commerce (Java + JSP). Comment l'expérience Toyota Motor Manufacturing France a façonné son envie de Japon, et comment la flexibilité de son équipe française rend le décalage horaire tenable.",
      en: "26 years old, on VIE at Abbeal Tokyo since October 2025 on an IBM HCL Commerce (Java + JSP) e-commerce mission. How his Toyota Motor Manufacturing France experience shaped his Japan call, and how his French team's flexibility makes the time zone gap manageable.",
      ja: "26歳、2025年10月からAbbeal東京でVIE、IBM HCL Commerce（Java + JSP）のEコマース案件。トヨタモーター・マニュファクチャリング・フランスでの経験が日本志向をどう形作ったか、フランスチームの柔軟性が時差をどう乗り越えやすくしているか。",
      "fr-ca": "26 ans, en VIE chez Abbeal Tokyo depuis octobre 2025 sur un mandat e-commerce IBM HCL Commerce (Java + JSP). Comment l'expérience Toyota Motor Manufacturing France a façonné son envie de Japon, et comment la flexibilité de son équipe française rend le décalage horaire tenable.",
    },
    body: {
      fr: ARTICLE_BODIES["vie-tokyo-developpeur-hugo"]?.fr ?? [],
      en: ARTICLE_BODIES["vie-tokyo-developpeur-hugo"]?.en,
      ja: ARTICLE_BODIES["vie-tokyo-developpeur-hugo"]?.ja,
      "fr-ca": ARTICLE_BODIES["vie-tokyo-developpeur-hugo"]?.["fr-ca"],
    },
  },
  // Article 14 — Alex : 3 ans Tokyo, Senior SE, Next.js/React
  {
    slug: "expat-tokyo-3-ans-alex-senior-engineer",
    featured: false,
    tag: "Mobbeal",
    readTime: "6 min",
    publishedAt: "2026-04-25",
    title: {
      fr: "3 ans à Tokyo : Alex, Senior Software Engineer, comment il vit son décalage de 7-8h.",
      en: "3 years in Tokyo: Alex, Senior Software Engineer, how he lives his 7-8h time gap.",
      ja: "東京で3年：Alex、シニアソフトウェアエンジニア、7-8時間の時差をどう生きるか。",
      "fr-ca": "3 ans à Tokyo : Alex, Senior Software Engineer, comment il vit son décalage de 7-8h.",
    },
    excerpt: {
      fr: "8 ans de dev, 3 ans au Japon. Alex bosse aux horaires français (14h-minuit Tokyo), avec aménagements négociés après 6 mois. Comment il a convaincu son client (« 6 mois pour voir »), et pourquoi ça dure depuis 3 ans.",
      en: "8 years of dev, 3 years in Japan. Alex works on French hours (2pm-midnight Tokyo), with negotiated flex after 6 months. How he convinced his client (\"6 months to see\"), and why it's been running for 3 years.",
      ja: "開発8年、日本3年。Alexはフランス時間（東京の14時-24時）で働き、6ヶ月後に交渉した柔軟性を持つ。クライアントをどう説得したか（「6ヶ月様子見」）、そしてなぜ3年続いているか。",
      "fr-ca": "8 ans de dev, 3 ans au Japon. Alex bosse aux horaires français (14h-minuit Tokyo), avec aménagements négociés après 6 mois. Comment il a convaincu son client (« 6 mois pour voir »), et pourquoi ça dure depuis 3 ans.",
    },
    body: {
      fr: ARTICLE_BODIES["expat-tokyo-3-ans-alex-senior-engineer"]?.fr ?? [],
      en: ARTICLE_BODIES["expat-tokyo-3-ans-alex-senior-engineer"]?.en,
      ja: ARTICLE_BODIES["expat-tokyo-3-ans-alex-senior-engineer"]?.ja,
      "fr-ca": ARTICLE_BODIES["expat-tokyo-3-ans-alex-senior-engineer"]?.["fr-ca"],
    },
  },
  // Article 15 — Kevyn : PVT puis visa travail, ingénieur méca, Amplitude Laser
  {
    slug: "pvt-tokyo-ingenieur-mecanique-kevyn",
    featured: false,
    tag: "Mobbeal",
    readTime: "6 min",
    publishedAt: "2026-04-15",
    title: {
      fr: "PVT Tokyo : Kevyn, ingénieur mécanique chez Amplitude Laser, 1 an au Japon.",
      en: "Working Holiday Tokyo: Kevyn, mechanical engineer at Amplitude Laser, 1 year in Japan.",
      ja: "東京PVT：Kevyn、Amplitude Laserのメカニカルエンジニア、日本1年。",
      "fr-ca": "EIC Tokyo : Kevyn, ingénieur mécanique chez Amplitude Laser, 1 an au Japon.",
    },
    excerpt: {
      fr: "26 ans, ingé méca laser haute énergie. Parti en PVT puis basculé sur visa de travail. Le décalage 7-8h devient un atout : ses nuits Tokyo = jours France, des sujets urgents se débloquent en continuité. Plus une anecdote shintoïste à la pause midi.",
      en: "26 years old, high-energy laser mechanical engineer. Left on Working Holiday then switched to work visa. The 7-8h gap becomes an asset: his Tokyo nights = France days, urgent topics unblock in continuity. Plus a Shinto anecdote on lunch break.",
      ja: "26歳、高エネルギーレーザーのメカニカルエンジニア。PVTで出発後、就労ビザに切り替え。7-8時間の時差が強みに：東京の夜=フランスの昼、緊急の話題が継続的に解決される。プラスお昼休みの神社エピソード。",
      "fr-ca": "26 ans, ingé méca laser haute énergie. Parti en EIC puis basculé sur visa de travail. Le décalage 7-8h devient un atout : ses nuits Tokyo = jours France, des sujets urgents se débloquent en continuité. Plus une anecdote shintoïste à la pause midi.",
    },
    body: {
      fr: ARTICLE_BODIES["pvt-tokyo-ingenieur-mecanique-kevyn"]?.fr ?? [],
      en: ARTICLE_BODIES["pvt-tokyo-ingenieur-mecanique-kevyn"]?.en,
      ja: ARTICLE_BODIES["pvt-tokyo-ingenieur-mecanique-kevyn"]?.ja,
      "fr-ca": ARTICLE_BODIES["pvt-tokyo-ingenieur-mecanique-kevyn"]?.["fr-ca"],
    },
  },
  // Article 16 — Grégorie : VIE Tokyo, OneID, Vue.js + DevOps + React Native
  {
    slug: "vie-tokyo-developpeur-gregorie",
    featured: false,
    tag: "Mobbeal",
    readTime: "5 min",
    publishedAt: "2026-04-05",
    title: {
      fr: "VIE Tokyo : Grégorie, dev fullstack chez OneID, le meilleur des deux mondes.",
      en: "VIE Tokyo: Grégorie, fullstack dev at OneID, the best of both worlds.",
      ja: "VIE東京：Grégorie、OneIDのフルスタック開発者、両世界のベスト。",
      "fr-ca": "VIE Tokyo : Grégorie, dev fullstack chez OneID, le meilleur des deux mondes.",
    },
    excerpt: {
      fr: "22 ans, après 3 ans d'alternance chez OneID. VIE négocié avec un document détaillant les avantages — horaires hybrides FR/JP : matin Tokyo (équipe France dort), soir Tokyo (créneau commun), nuit Tokyo (relais France). Vue.js + DevOps + React Native, Docker en local. Et le danger d'habiter à 2 min d'un Pokémon Center.",
      en: "22 years old, after 3 years of work-study at OneID. VIE negotiated with a doc detailing benefits — hybrid FR/JP hours: morning Tokyo (France team sleeps), evening Tokyo (common slot), night Tokyo (France handover). Vue.js + DevOps + React Native, Docker locally. And the danger of living 2 minutes from a Pokémon Center.",
      ja: "22歳、OneIDで3年間のアルタナンス後。利点を詳述した文書でVIEを交渉 — FR/JPハイブリッド時間：東京の朝（フランスチームは就寝）、東京の夕方（共通時間帯）、東京の夜（フランスへ引継ぎ）。Vue.js + DevOps + React Native、ローカルでDocker。そしてポケモンセンターまで2分の場所に住む危険性。",
      "fr-ca": "22 ans, après 3 ans d'alternance chez OneID. VIE négocié avec un document détaillant les avantages — horaires hybrides FR/JP : matin Tokyo (équipe France dort), soir Tokyo (créneau commun), nuit Tokyo (relais France). Vue.js + DevOps + React Native, Docker en local. Et le danger d'habiter à 2 min d'un Pokémon Center.",
    },
    body: {
      fr: ARTICLE_BODIES["vie-tokyo-developpeur-gregorie"]?.fr ?? [],
      en: ARTICLE_BODIES["vie-tokyo-developpeur-gregorie"]?.en,
      ja: ARTICLE_BODIES["vie-tokyo-developpeur-gregorie"]?.ja,
      "fr-ca": ARTICLE_BODIES["vie-tokyo-developpeur-gregorie"]?.["fr-ca"],
    },
  },
  // Article 12 — Mobbeal témoignage Marie Nuellas (Tokyo). Article RH /
  // expat / proof point Mobbeal pour candidats devs intéressés par Tokyo.
  // Slug SEO longtail "apprendre japonais Tokyo + outils Anki/WaniKani/
  // Bunpro". Contenu original en FR fourni par Marie, traduit EN/JA/FR-CA.
  // Tag "Mobbeal" : matche le pattern existant (mobbeal-playbook). FR-CA
  // disponible en cohérence avec le reste du site multilingue.
  {
    slug: "apprendre-japonais-tokyo-anki-wanikani-bunpro",
    featured: false,
    tag: "Mobbeal",
    readTime: "5 min",
    publishedAt: "2026-05-08",
    title: {
      fr: "Apprendre le japonais à Tokyo après le JLPT N2 : ma routine quotidienne.",
      en: "Learning Japanese in Tokyo after JLPT N2: my daily routine.",
      ja: "東京でJLPT N2取得後の日本語学習：私の日々のルーティン。",
      "fr-ca": "Apprendre le japonais à Tokyo après le JLPT N2 : ma routine quotidienne.",
    },
    excerpt: {
      fr: "Pas de solution miracle pour apprendre une langue. Anki, WaniKani et Bunpro : les trois outils qui me permettent de progresser en japonais au quotidien depuis Tokyo, en complément de mes cours particuliers offerts par Abbeal.",
      en: "No magic bullet to learn a language. Anki, WaniKani and Bunpro: the three tools I use daily to keep progressing in Japanese from Tokyo, on top of the private lessons Abbeal offers me.",
      ja: "言語学習に魔法の解決策はない。Anki、WaniKani、Bunpro：東京から日本語の上達を続けるために毎日使う3つのツール。Abbealが提供してくれる個人レッスンに加えて。",
      "fr-ca": "Pas de solution miracle pour apprendre une langue. Anki, WaniKani et Bunpro : les trois outils qui me permettent de progresser en japonais au quotidien depuis Tokyo, en complément de mes cours particuliers offerts par Abbeal.",
    },
    body: {
      fr: ARTICLE_BODIES["apprendre-japonais-tokyo-anki-wanikani-bunpro"]?.fr ?? [],
      en: ARTICLE_BODIES["apprendre-japonais-tokyo-anki-wanikani-bunpro"]?.en,
      ja: ARTICLE_BODIES["apprendre-japonais-tokyo-anki-wanikani-bunpro"]?.ja,
      "fr-ca": ARTICLE_BODIES["apprendre-japonais-tokyo-anki-wanikani-bunpro"]?.["fr-ca"],
    },
  },
  // Article 17 — Top quartiers Tokyo (lifestyle, par Sébastien Lonjon CEO).
  // Article lifestyle pour humaniser la marque Abbeal/Mobbeal cote CEO :
  // Sebastien partage ses 4 quartiers favoris (Koenji, Shimokitazawa,
  // Kichijoji, Daikanyama) + un n°1 secret (Jiyugaoka) sur demande.
  // CTA Calendly Mobbeal "une nouvelle vie a l'etranger" en fin d'article.
  {
    slug: "tokyo-meilleurs-quartiers-vivre-jiyugaoka-shimokitazawa",
    featured: false,
    tag: "Mobbeal",
    readTime: "6 min",
    publishedAt: "2026-04-20",
    title: {
      fr: "Où vivre à Tokyo ? Mon top 5 (subjectif, assumé), par Sébastien Lonjon.",
      en: "Where to live in Tokyo? My top 5 (subjective, no apologies), by Sébastien Lonjon.",
      ja: "東京でどこに住む？私のトップ5（主観的、堂々と）— Sébastien Lonjonによる。",
      "fr-ca": "Où vivre à Tokyo ? Mon top 5 (subjectif, assumé), par Sébastien Lonjon.",
    },
    excerpt: {
      fr: "Après plus d'un an à Tokyo, le CEO d'Abbeal partage ses 5 quartiers favoris : Kōenji (punk), Shimokitazawa (slow indie), Kichijōji (parc + carte postale), Daikanyama (chic discret) et son n°1 Jiyūgaoka — où il vit avec sa famille (nature, écoles internationales, accès Shibuya).",
      en: "After more than a year in Tokyo, Abbeal's CEO shares his 5 favourite neighbourhoods: Kōenji (punk), Shimokitazawa (slow indie), Kichijōji (park + postcard), Daikanyama (discreet chic) and his #1 Jiyūgaoka — where he lives with his family (nature, international schools, Shibuya access).",
      ja: "東京に1年以上住んだAbbealのCEOが、お気に入りの5エリアを紹介：高円寺（パンク）、下北沢（スロー・インディー）、吉祥寺（公園＋絵葉書）、代官山（控えめな上品さ）、そして1位の自由が丘 — 家族と暮らすエリア（自然、インターナショナルスクール、渋谷へのアクセス）。",
      "fr-ca": "Après plus d'un an à Tokyo, le CEO d'Abbeal partage ses 5 quartiers favoris : Kōenji (punk), Shimokitazawa (slow indie), Kichijōji (parc + carte postale), Daikanyama (chic discret) et son n°1 Jiyūgaoka — où il vit avec sa famille (nature, écoles internationales, accès Shibuya).",
    },
    body: {
      fr: ARTICLE_BODIES["tokyo-meilleurs-quartiers-vivre-jiyugaoka-shimokitazawa"]?.fr ?? [],
      en: ARTICLE_BODIES["tokyo-meilleurs-quartiers-vivre-jiyugaoka-shimokitazawa"]?.en,
      ja: ARTICLE_BODIES["tokyo-meilleurs-quartiers-vivre-jiyugaoka-shimokitazawa"]?.ja,
      "fr-ca": ARTICLE_BODIES["tokyo-meilleurs-quartiers-vivre-jiyugaoka-shimokitazawa"]?.["fr-ca"],
    },
  },
  // Article 18 — Top ramen Tokyo (lifestyle, par Sébastien Lonjon CEO).
  // Sebastien partage ses 4 adresses ramen favorites a Tokyo : Hujishiro,
  // Menya Kokoro, Afuri, Tamotsu + un n°1 secret. Article court, punchy,
  // CTA Calendly Mobbeal en fin pour conversion teletravail international.
  {
    slug: "top-ramen-tokyo-afuri-tamotsu-menya-kokoro",
    featured: false,
    tag: "Mobbeal",
    readTime: "4 min",
    publishedAt: "2026-04-12",
    title: {
      fr: "Mon top ramen à Tokyo : 4 adresses qui m'ont remis à ma place.",
      en: "My top ramen in Tokyo: 4 spots that put me back in my place.",
      ja: "東京の私のトップラーメン：私を戒めた4軒。",
      "fr-ca": "Mon top ramen à Tokyo : 4 adresses qui m'ont remis à ma place.",
    },
    excerpt: {
      fr: "Le CEO d'Abbeal partage son top du moment : Hujishiro (classique sans chichi), Menya Kokoro (mazemen signature), Afuri (yuzu shio finesse), Tamotsu (bouillon profond canard saison). Plus un n°1 gardé pour les contacts directs.",
      en: "Abbeal's CEO shares his current top: Hujishiro (classic, no frills), Menya Kokoro (signature mazemen), Afuri (delicate yuzu shio), Tamotsu (deep broth, seasonal duck). Plus a #1 kept for direct contacts.",
      ja: "AbbealのCEOが今のお気に入りトップを紹介：フジシロ（気取らないクラシック）、麺屋こころ（シグネチャーまぜそば）、Afuri（繊細なゆず塩）、Tamotsu（深いスープ、季節の鴨）。さらに、直接の連絡先のために取っておいた1位も。",
      "fr-ca": "Le CEO d'Abbeal partage son top du moment : Hujishiro (classique sans chichi), Menya Kokoro (mazemen signature), Afuri (yuzu shio finesse), Tamotsu (bouillon profond canard saison). Plus un n°1 gardé pour les contacts directs.",
    },
    body: {
      fr: ARTICLE_BODIES["top-ramen-tokyo-afuri-tamotsu-menya-kokoro"]?.fr ?? [],
      en: ARTICLE_BODIES["top-ramen-tokyo-afuri-tamotsu-menya-kokoro"]?.en,
      ja: ARTICLE_BODIES["top-ramen-tokyo-afuri-tamotsu-menya-kokoro"]?.ja,
      "fr-ca": ARTICLE_BODIES["top-ramen-tokyo-afuri-tamotsu-menya-kokoro"]?.["fr-ca"],
    },
  },
  // Article 19 — Automatiser une journee de CEO d'ESN avec Claude (par Sebastien Lonjon)
  // Article positioning + sales : Sebastien partage la stack Claude + 30
  // workflows orchestres pour automatiser commercial / recrutement / inbound /
  // productivite personnelle. CTA Calendly audit 30 min gratuites a la fin.
  // Featured: true pour pousser sur /insights top (objectif inbound prospects
  // CEO/COO qui veulent industrialiser leur stack). Tag "IA" pour matcher la
  // niche AI orchestration / agents en production.
  {
    slug: "automatiser-journee-ceo-claude-orchestration",
    featured: true,
    // Garde le slot #1 sur /insights listing (featured DESC), mais sort
    // du bloc Insights de la homepage qui doit rester limité a 3 cards
    // (Agents IA + GreenOps + Tech Radar). Évite l'overflow visuel "4
    // cards a la place de 3" demandé par Sebastien.
    featuredOnHome: false,
    tag: "IA",
    readTime: "7 min",
    publishedAt: "2026-05-07",
    title: {
      fr: "Comment j'ai automatisé une journée de CEO d'ESN avec Claude (et ce que vous pouvez en tirer).",
      en: "How I automated a tech consulting CEO's day with Claude (and what you can learn from it).",
      ja: "ClaudeでESNのCEOの1日を自動化した方法（そしてあなたがそこから得られるもの）。",
      "fr-ca": "Comment j'ai automatisé une journée de CEO de firme tech avec Claude (et ce que vous pouvez en tirer).",
    },
    excerpt: {
      fr: "30 workflows orchestrés sur Notion + BoondManager + Google Workspace + LinkedIn + Apollo + Calendly + Tactiq, sans nouveau SaaS. 4 piliers : commercial multicanal anti-doublon, recrutement 48h, inbound SEO/LinkedIn/citations IA, productivité dirigeant. Zéro lead perdu en 6 mois, 15 min/jour vs 3-4h avant.",
      en: "30 workflows orchestrated on Notion + BoondManager + Google Workspace + LinkedIn + Apollo + Calendly + Tactiq, no new SaaS. 4 pillars: multichannel anti-duplicate sales, 48h recruitment, inbound SEO/LinkedIn/AI citations, founder productivity. Zero lost leads in 6 months, 15 min/day vs 3-4h before.",
      ja: "Notion + BoondManager + Google Workspace + LinkedIn + Apollo + Calendly + Tactiqで30のワークフローをオーケストレーション、新しいSaaSなし。4つの柱：マルチチャネル重複防止セールス、48時間採用、インバウンドSEO/LinkedIn/AI引用、創業者の生産性。6ヶ月で失われたリードゼロ、以前の3〜4時間に対して1日15分。",
      "fr-ca": "30 workflows orchestrés sur Notion + BoondManager + Google Workspace + LinkedIn + Apollo + Calendly + Tactiq, sans nouveau SaaS. 4 piliers : commercial multicanal anti-doublon, recrutement 48h, inbound SEO/LinkedIn/citations IA, productivité dirigeant. Zéro lead perdu en 6 mois, 15 min/jour vs 3-4h avant.",
    },
    body: {
      fr: ARTICLE_BODIES["automatiser-journee-ceo-claude-orchestration"]?.fr ?? [],
      en: ARTICLE_BODIES["automatiser-journee-ceo-claude-orchestration"]?.en,
      ja: ARTICLE_BODIES["automatiser-journee-ceo-claude-orchestration"]?.ja,
      "fr-ca": ARTICLE_BODIES["automatiser-journee-ceo-claude-orchestration"]?.["fr-ca"],
    },
  },
  // Article 20 — Alex Lim (Senior SE Tokyo) : retour cours CSS Josh Comeau.
  // Article guest, byline auteur en tete du body, publication initiale sur
  // Notion. SEO longtail "CSS for JavaScript Developers review" + humanise
  // la marque (point de vue ingenieur senior nomme).
  // ATTRIBUTION : lien Notion source + landing css-for-js.dev.
  {
    slug: "css-for-javascript-developers-josh-comeau-retour-alex-lim",
    featured: false,
    tag: "Frontend",
    readTime: "5 min",
    publishedAt: "2026-05-18",
    updatedAt: "2026-05-19",
    title: {
      fr: "CSS for JavaScript Developers — Retour honnête après 4 ans en production.",
      en: "CSS for JavaScript Developers — Honest Feedback After 4 Years in Production.",
      ja: "CSS for JavaScript Developers — 本番4年後の率直なフィードバック。",
      "fr-ca": "CSS for JavaScript Developers — Retour honnête après 4 ans en production.",
    },
    excerpt: {
      fr: "Alexandre Lim partage 4 ans de leçons CSS en production après avoir suivi le cours « CSS for JS Developers » de Josh Comeau. Retour honnête, orienté code.",
      en: "Senior engineer Alexandre Lim shares 4 years of production CSS lessons after taking Josh Comeau's 'CSS for JS Developers' course. Honest, code-first feedback.",
      ja: "シニアエンジニアのアレクサンドル・リムが、Josh Comeauの「CSS for JS Developers」を受講後、本番環境での4年間のCSSの教訓を共有。率直で、コードファーストのフィードバック。",
      "fr-ca": "Alexandre Lim partage 4 ans de leçons CSS en production après avoir suivi le cours « CSS for JS Developers » de Josh Comeau. Retour honnête, orienté code.",
    },
    metaDescription: {
      fr: "Senior engineer Alexandre Lim partage 4 ans de leçons CSS en production après le cours « CSS for JS Developers » de Josh Comeau. Retour honnête, orienté code.",
      en: "Senior engineer Alexandre Lim shares 4 years of production CSS lessons after taking Josh Comeau's 'CSS for JS Developers' course. Honest, code-first feedback.",
      ja: "シニアエンジニアのアレクサンドル・リムが、Josh Comeauの「CSS for JS Developers」受講後、本番4年間のCSSの教訓を共有。率直で、コードファーストのフィードバック。",
      "fr-ca": "Senior engineer Alexandre Lim partage 4 ans de leçons CSS en production après le cours « CSS for JS Developers » de Josh Comeau. Retour honnête, orienté code.",
    },
    keywords: {
      fr: "CSS, Frontend, Josh Comeau, CSS for JavaScript Developers, Modern CSS, Developer Experience, CSS course review, CSS for JS Developers, mental model CSS, modern CSS layouts",
      en: "CSS, Frontend, Josh Comeau, CSS for JavaScript Developers, Modern CSS, Developer Experience, CSS course review, CSS for JS Developers, mental model CSS, modern CSS layouts",
      ja: "CSS, Frontend, Josh Comeau, CSS for JavaScript Developers, モダンCSS, デベロッパー体験, CSSコースレビュー, CSSメンタルモデル",
    },
    faq: {
      fr: [
        { q: "À qui s'adresse le cours « CSS for JavaScript Developers » de Josh Comeau ?", a: "Aux développeurs JS/React qui utilisent CSS au quotidien mais sentent qu'une partie de leur code « marche par magie ». Le cours pose les fondamentaux pour passer de l'intuition à la maîtrise — particulièrement utile aux profils backend devenus fullstack, ou frontend qui veulent solidifier leurs bases CSS." },
        { q: "Combien de temps faut-il pour finir le cours ?", a: "Variable selon le rythme. Une à deux heures par soir + week-ends est un planning courant. Le cours mélange articles, vidéos et exercices, avec un workshop en fin de chaque module. Ce n'est pas une promenade de santé — il faut bloquer du temps." },
        { q: "Le cours est-il toujours pertinent en 2026 ?", a: "Oui. Les fondamentaux CSS (cascade, layout, z-index, modèle visuel) n'ont pas changé. Les nouveautés CSS modernes (container queries, has(), nesting) se greffent par-dessus ces fondamentaux — sans eux, tu te retrouves vite perdu." },
        { q: "Que retire un Senior Engineer de ce cours ?", a: "Capacité à diagnostiquer la racine d'un problème CSS au lieu d'appliquer un patch temporaire — économie directe de dette technique. Capacité à enseigner CSS à ses pairs. Confiance pour aborder des layouts complexes sans hack." },
      ],
      en: [
        { q: "Who is Josh Comeau's 'CSS for JavaScript Developers' course for?", a: "JS/React developers who use CSS daily but feel parts of their code « work by magic ». The course builds fundamentals to shift from intuition to mastery — especially useful for backend engineers turned fullstack, or frontend engineers wanting to solidify their CSS foundations." },
        { q: "How long does it take to finish the course?", a: "Varies by pace. One to two hours per evening plus weekends is a common schedule. The course mixes articles, videos and exercises, with a workshop at the end of each module. It's not a casual walk — you need to block time." },
        { q: "Is the course still relevant in 2026?", a: "Yes. CSS fundamentals (cascade, layout, z-index, visual model) haven't changed. Modern CSS additions (container queries, has(), nesting) build on top of those fundamentals — without them, you get lost fast." },
        { q: "What does a Senior Engineer take from this course?", a: "Ability to diagnose the root cause of a CSS problem instead of applying a temporary patch — direct technical-debt savings. Ability to teach CSS to peers. Confidence to tackle complex layouts without hacks." },
      ],
    },
    relatedCaseSlug: "the-fork",
    relatedServiceSlug: "squads-embarques",
    body: {
      fr: ARTICLE_BODIES["css-for-javascript-developers-josh-comeau-retour-alex-lim"]?.fr ?? [],
      en: ARTICLE_BODIES["css-for-javascript-developers-josh-comeau-retour-alex-lim"]?.en,
      ja: ARTICLE_BODIES["css-for-javascript-developers-josh-comeau-retour-alex-lim"]?.ja,
      "fr-ca": ARTICLE_BODIES["css-for-javascript-developers-josh-comeau-retour-alex-lim"]?.["fr-ca"],
    },
  },
  // Article 21 — Stephane Robin (Senior Engineer Montreal) : Mythos vs dette
  // technique. Article guest, byline auteur en tete du body, publication
  // initiale sur Medium (@electron.libre). SEO ciblee sur "IA + cybersecurite
  // + dette technique" — angle differenciant Abbeal Montreal sur les services
  // financiers regules.
  // ATTRIBUTION : lien Medium original (electron.libre).
  {
    slug: "mythos-ia-cybersecurite-priorites-production-stephane-robin",
    featured: false,
    tag: "AI",
    readTime: "7 min",
    publishedAt: "2026-05-18",
    updatedAt: "2026-05-19",
    title: {
      fr: "Quand l'IA redéfinit la cybersécurité : comment Mythos a changé nos priorités en production.",
      en: "When AI redefines cybersecurity: how Mythos changed our production priorities.",
      ja: "AIがサイバーセキュリティを再定義するとき：Mythosが本番優先順位をどう変えたか。",
      "fr-ca": "Quand l'IA redéfinit la cybersécurité : comment Mythos a changé nos priorités en production.",
    },
    excerpt: {
      fr: "Stéphane Robin (Senior Engineer Abbeal Montréal) explique comment Anthropic Claude Mythos Preview a fait basculer l'évaluation du risque CVE chez un client services financiers. Backlog re-priorisé en 2 semaines, dette technique reclassifiée, leçons pour 2026.",
      en: "Stéphane Robin (Senior Engineer Abbeal Montréal) explains how Anthropic Claude Mythos Preview shifted CVE risk evaluation at a financial-services client. Backlog re-prioritised in 2 weeks, technical debt reclassified, 2026 lessons.",
      ja: "ステファン・ロビン（Abbealモントリオールシニアエンジニア）が、Anthropic Claude Mythos Previewが金融サービスクライアントでCVEリスク評価をどう転換させたかを説明。バックログを2週間で再優先順位付け、技術的負債を再分類、2026年の教訓。",
      "fr-ca": "Stéphane Robin (Senior Engineer Abbeal Montréal) explique comment Anthropic Claude Mythos Preview a fait basculer l'évaluation du risque CVE chez un client services financiers. Liste à faire repriorisée en 2 semaines, dette technique reclassifiée, leçons pour 2026.",
    },
    metaDescription: {
      fr: "Comment Anthropic Claude Mythos Preview a fait basculer l'évaluation du risque CVE en IA cybersécurité banque. Retour terrain Abbeal Montréal : backlog repriorisé en 2 semaines, dette technique reclassifiée.",
      en: "How Anthropic Claude Mythos Preview shifted CVE risk evaluation in AI cybersecurity banking. Field report from Abbeal Montréal: backlog re-prioritised in 2 weeks, technical debt reclassified.",
      ja: "Anthropic Claude Mythos Previewが、AIサイバーセキュリティ銀行のCVEリスク評価をどう転換させたか。Abbealモントリオール現場レポート：バックログを2週間で再優先順位付け、技術的負債を再分類。",
      "fr-ca": "Comment Anthropic Claude Mythos Preview a fait basculer l'évaluation du risque CVE en IA cybersécurité banque. Retour terrain Abbeal Montréal : liste à faire repriorisée en 2 semaines, dette technique reclassifiée.",
    },
    keywords: {
      fr: "IA cybersécurité banque, Anthropic en production, Claude Mythos Preview, CVE risk assessment, Project Glasswing, Spring Boot 3 migration, Java 21 migration, dette technique IA, modernisation legacy financial services, exploit autonome IA",
      en: "AI cybersecurity banking, Anthropic in production, Claude Mythos Preview, CVE risk assessment, Project Glasswing, Spring Boot 3 migration, Java 21 migration, AI technical debt, financial services legacy modernisation, autonomous exploit AI",
      ja: "AIサイバーセキュリティ銀行, Anthropic 本番, Claude Mythos Preview, CVEリスク評価, Project Glasswing, Spring Boot 3 マイグレーション, Java 21 マイグレーション, AI 技術的負債, 金融サービスレガシー近代化, 自律エクスプロイトAI",
    },
    faq: {
      fr: [
        { q: "Qu'est-ce que Claude Mythos Preview d'Anthropic ?", a: "Un modèle Anthropic annoncé en 2026, capable d'identifier et d'exploiter des vulnérabilités de sécurité de manière autonome à grande échelle. Anthropic restreint l'accès via le « Projet Glasswing » à un consortium d'organisations d'infrastructure critique pour permettre des correctifs préventifs avant exploitation à grande échelle." },
        { q: "Pourquoi Mythos change le calcul du risque CVE ?", a: "Avant Mythos, une CVE CVSS 5.0 difficile à exploiter manuellement pouvait rester dans le backlog plusieurs mois. Avec Mythos, toute CVE devient une priorité potentielle — y compris celles qui dormaient dans la dette technique depuis des années. Le critère « trop complexe à exploiter » s'effondre." },
        { q: "Quelles actions concrètes prendre côté équipe sécurité ?", a: "Auditer le CVE backlog à l'aune du risque d'exploitation par IA (pas seulement humaine). Cartographier les composants en dette (Spring Boot, Java, bibliothèques critiques). Mettre en place une pipeline de montée de version continue. Challenger les SLA correctifs : 2 semaines de délai prod est désormais le standard minimum en banque." },
        { q: "Quels chantiers de modernisation prioriser sur une stack Java/Spring ?", a: "Migration Spring Boot 2.x → 3.x (voire 4.x) — non triviale, demande adaptation API + config sécurité + compatibilité dépendances. Migration Java 17 → 21 minimum. Montées de version ciblées sur chaque bibliothèque avec CVE active vers la version « safe » la plus récente compatible." },
      ],
      en: [
        { q: "What is Anthropic's Claude Mythos Preview?", a: "An Anthropic model announced in 2026, capable of identifying and exploiting security vulnerabilities autonomously at scale. Anthropic restricts access via « Project Glasswing » to a consortium of critical-infrastructure organisations to enable preventive patches before large-scale exploitation." },
        { q: "Why does Mythos change the CVE risk calculus?", a: "Before Mythos, a CVSS 5.0 CVE difficult to exploit manually could remain in the backlog for months. With Mythos, every CVE becomes a potential priority — including those that had been dormant in technical debt for years. The « too complex to exploit » criterion collapses." },
        { q: "What concrete actions to take on the security team?", a: "Audit the CVE backlog through the lens of AI-driven exploitation risk (not only human-driven). Map debt components (Spring Boot, Java, critical libraries). Set up a continuous version-upgrade pipeline. Challenge patch SLAs: 2-week production-deployment delay is now the minimum standard in banking." },
        { q: "Which modernisation work to prioritise on a Java/Spring stack?", a: "Spring Boot 2.x → 3.x (or 4.x) migration — non-trivial, requires API adaptation + security config + dependency compatibility. Java 17 → 21 minimum migration. Targeted upgrades of every library with an active CVE to the most recent compatible « safe » version." },
      ],
    },
    relatedCaseSlug: "fintech-iso27001-devsecops",
    relatedServiceSlug: "delivery-cle-en-main",
    body: {
      fr: ARTICLE_BODIES["mythos-ia-cybersecurite-priorites-production-stephane-robin"]?.fr ?? [],
      en: ARTICLE_BODIES["mythos-ia-cybersecurite-priorites-production-stephane-robin"]?.en,
      ja: ARTICLE_BODIES["mythos-ia-cybersecurite-priorites-production-stephane-robin"]?.ja,
      "fr-ca": ARTICLE_BODIES["mythos-ia-cybersecurite-priorites-production-stephane-robin"]?.["fr-ca"],
    },
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured);
}

/**
 * Articles à pousser dans le bloc Insights de la homepage (slot scarce, 3 cards).
 * Filtre sur `featuredOnHome` avec fallback sur `featured` si non défini —
 * permet de désactiver un article du slot home (set false explicitement) tout
 * en le gardant en haut de /insights listing.
 *
 * Cohérent avec getHomeFeaturedCases() côté cases.
 */
export function getHomeFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featuredOnHome ?? a.featured);
}

export function getAllArticles(): Article[] {
  // Tri composite : featured d'abord (les pillars d'expertise tech remontent),
  // puis par date desc (récents en haut). Évite l'effet "wall of Mobbeal" en
  // remontant systématiquement les articles structurants Agents IA / GreenOps
  // / Tech Radar avant les témoignages Mobbeal Tokyo récents.
  return [...articles].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.publishedAt < b.publishedAt ? 1 : -1;
  });
}

/** Pick localized field with fallback to FR */
export function pick<T>(field: Translatable<T>, locale: Locale): T {
  return (field[locale] as T) ?? field.fr;
}
