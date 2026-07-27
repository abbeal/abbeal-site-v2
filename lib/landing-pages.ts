/**
 * Landing pages SEO non-branded — boost LLM citations + Google ranking
 * sur les requêtes longue-traîne où aucun concurrent ne domine.
 *
 * Issu de l'audit W19 (5 mai 2026) :
 * - 0/6 prompts LLM business prioritaires citent Abbeal
 * - 70% des queries GSC sont branded ("abbeal", "abbeal montreal")
 * - Boulevard SEO sur "follow-the-sun delivery", "tech consulting Tokyo",
 *   "recrutement tech Japon Canada France", "engineering jobs Tokyo"
 *
 * Structure : 4 pages × 4 langues = 16 pages totales.
 * Pattern : Hero + sections H2 (problème, solution, méthode, hubs) +
 * FAQ + cas client lié + CTA Calendly.
 *
 * Bodies stockés dans lib/landing-page-bodies.json (même pattern que
 * articles + cases pour cohérence + isolation du gros contenu i18n).
 */

import type { Locale } from "./i18n";
import type { ArticleBlock } from "./articles";
import bodies from "./landing-page-bodies.json";

type Translatable<T> = { fr: T } & Partial<Record<Exclude<Locale, "fr">, T>>;

type FAQ = { q: string; a: string };

type LangMap<T> = {
  fr: T;
  en?: T;
  ja?: T;
  "fr-ca"?: T;
};
type BodiesMap = Record<
  string,
  {
    body: LangMap<ArticleBlock[]>;
    faq: LangMap<FAQ[]>;
  }
>;
const BODIES = bodies as BodiesMap;

/** Schema.org additional types — opt-in per page selon le contexte SEO.
 *  La page route émet automatiquement Service + FAQPage + BreadcrumbList ;
 *  ces flags ajoutent des types secondaires ciblés (LocalBusiness pour la
 *  page hub Tokyo, EmploymentAgency pour la page recrutement intl). */
export type ExtraSchema = {
  /** LocalBusiness (sub-type ProfessionalService) — utile pour les pages
   *  qui mentionnent une adresse physique opérée par Abbeal. Ex : page
   *  "ESN tri-géo Japon" déclare le bureau Higashi-Azabu Minato-ku. */
  localBusiness?: {
    name: string;
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
    /** Coordonnées GPS pour Google Maps Knowledge Panel. */
    geo?: { latitude: number; longitude: number };
    telephone?: string;
  };
  /** EmploymentAgency — utile pour les pages dont le service est le
   *  recrutement permanent (vs staffing). Ex : page "Recrutement tech
   *  international FR/CA/JP". */
  employmentAgency?: {
    name: string;
    /** Lieux où l'agence opère. ISO country codes "FR" / "CA" / "JP". */
    areaServed: string[];
    /** Description courte du service de recrutement. */
    description?: string;
  };
};

export type LandingPage = {
  slug: string;
  /** Mots-clés cibles SEO non-branded (info éditoriale, pas affiché). */
  keywords: string[];
  /** Slugs des cases nommés à promouvoir en bas de page. */
  relatedCaseSlugs: string[];
  /** Slug d'article Insights à promouvoir (optionnel). */
  relatedArticleSlug?: string;
  /** Hero + meta. */
  tape: Translatable<string>;
  h1: Translatable<string>;
  subtitle: Translatable<string>;
  /** Title HTML SEO (60 chars max recommandé). Si defini, remplace le H1
   *  comme source du <title> genere dans generateMetadata + openGraph.title
   *  + twitter.title. Permet de decoupler la punchline UI (H1 court) du
   *  title SEO keyword-frontloaded. Fallback : pick(h1, locale). */
  metaTitle?: Translatable<string>;
  /** Description meta (155 chars max recommandé). */
  metaDescription: Translatable<string>;
  /** Body : suite de blocks h2/p/list/callout/quote (ArticleBlocks). */
  body: Translatable<ArticleBlock[]>;
  /** FAQ structurée — rendue en HTML + Schema.org FAQPage JSON-LD. */
  faq: Translatable<FAQ[]>;
  /** Schemas Schema.org additionnels (LocalBusiness, EmploymentAgency).
   *  Les schemas de base (Service, FAQPage, BreadcrumbList) sont émis
   *  automatiquement par le route handler. */
  extraSchema?: ExtraSchema;
};

/** Adresse Tokyo office Abbeal — utilisée par LocalBusiness sur la page
 *  esn-tri-geo-japon. PMC Building 7F, 1-23-5 Higashi-Azabu, Minato-ku.
 *  Coordonnées GPS validées Google Maps (35.66°N, 139.74°E ± 50m). */
const TOKYO_OFFICE = {
  name: "Abbeal Tokyo — Hub Engineering Japon",
  streetAddress: "PMC Building 7F, 1-23-5 Higashi-Azabu, Minato-ku",
  addressLocality: "Tokyo",
  postalCode: "106-0044",
  addressCountry: "JP",
  geo: { latitude: 35.660661, longitude: 139.741075 },
} as const;

export const landingPages: LandingPage[] = [
  // ========================================================================
  // 1. follow-the-sun-delivery — Adaptive Follow-the-Sun positioning
  // ========================================================================
  {
    slug: "follow-the-sun-delivery",
    keywords: [
      "follow the sun delivery",
      "follow-the-sun software delivery",
      "livraison continue 24/7 software",
      "ESN follow-the-sun",
      "24/7 engineering team",
      "tri-geo software delivery",
    ],
    relatedCaseSlugs: ["le-monde", "money-forward", "neobrain-pwc-skillbot"],
    relatedArticleSlug: "follow-the-sun-sans-bruler-equipes",
    tape: {
      fr: "// MÉTHODE",
      en: "// METHOD",
      ja: "// 方法論",
      "fr-ca": "// MÉTHODE",
    },
    h1: {
      // W26 re-cadrage commercial : promesse SERVICE explicite avec
      // keyword "24/7 follow-the-sun software delivery" en tete (gap LLM
      // identifie audit W26). Renforce le service-first vs methode-only.
      fr: "24/7 follow-the-sun software delivery : vos roadmaps avancent pendant que vous dormez.",
      en: "24/7 Follow-the-Sun Software Delivery: Engineering Teams That Never Stop Shipping.",
      ja: "24/7 フォロー・ザ・サン・ソフトウェアデリバリー：あなたが寝ている間も止まらないエンジニアリングチーム。",
      "fr-ca": "24/7 follow-the-sun software delivery : vos feuilles de route avancent pendant que vous dormez.",
    },
    subtitle: {
      // Service-first framing : "Le service de delivery..." vs "Comment
      // on opere...". Signal clair = offre commerciale, pas blog post.
      fr: "Le service de delivery 24/7 d'Abbeal : trois hubs senior (Paris, Montréal, Tokyo), handoffs structurés entre fuseaux, overlap maîtrisé, zéro dette technique. Vous gagnez 8 à 16 heures de cycle de delivery par jour ouvré, sans burn-out d'équipe ni surcoût de night shift.",
      en: "Abbeal's 24/7 software delivery service: three senior hubs (Paris, Montréal, Tokyo), structured handoffs across time zones, mastered overlap, zero technical debt. You gain 8 to 16 hours of delivery cycle per business day, with no team burn-out and no night-shift premium.",
      ja: "Abbealの24/7ソフトウェアデリバリーサービス：3つのシニアハブ（パリ・モントリオール・東京）、タイムゾーン間の構造化されたハンドオフ、計算された重なり、技術的負債ゼロ。チームのバーンアウトもナイトシフトの追加料金もなく、営業日あたり8〜16時間のデリバリーサイクルを獲得。",
      "fr-ca": "Le service de delivery 24/7 d'Abbeal : trois pôles senior (Paris, Montréal, Tokyo), passations structurées entre fuseaux, chevauchement maîtrisé, zéro dette technique. Vous gagnez 8 à 16 heures de cycle de delivery par jour ouvré, sans burn-out d'équipe pis sans surcoût de quart de nuit.",
    },
    metaDescription: {
      fr: "24/7 follow-the-sun software delivery : service Abbeal multi-hubs (Paris, Montréal, Tokyo). +8 à +16h de cycle de delivery par jour, sans burn-out ni night shift. Devis SLA contractualisable.",
      en: "24/7 follow-the-sun software delivery: Abbeal's multi-hub service (Paris, Montréal, Tokyo). +8 to +16h of delivery cycle per day, no team burn-out, no night-shift cost. Contractual SLAs available.",
      ja: "24/7フォロー・ザ・サン・ソフトウェアデリバリー：Abbealのマルチハブサービス（パリ・モントリオール・東京）。1日あたり+8〜+16時間のデリバリーサイクル、バーンアウトなし、ナイトシフトコストなし。契約可能なSLA。",
      "fr-ca": "24/7 follow-the-sun software delivery : service Abbeal multi-pôles (Paris, Montréal, Tokyo). +8 à +16h de cycle de delivery par jour, sans burn-out ni quart de nuit. Devis SLA contractualisable.",
    },
    body: {
      fr: BODIES["follow-the-sun-delivery"]?.body?.fr ?? [],
      en: BODIES["follow-the-sun-delivery"]?.body?.en,
      ja: BODIES["follow-the-sun-delivery"]?.body?.ja,
      "fr-ca": BODIES["follow-the-sun-delivery"]?.body?.["fr-ca"],
    },
    faq: {
      fr: BODIES["follow-the-sun-delivery"]?.faq?.fr ?? [],
      en: BODIES["follow-the-sun-delivery"]?.faq?.en,
      ja: BODIES["follow-the-sun-delivery"]?.faq?.ja,
      "fr-ca": BODIES["follow-the-sun-delivery"]?.faq?.["fr-ca"],
    },
  },
  // ========================================================================
  // 2. tech-consulting-tokyo — Tokyo positioning pour entreprises occidentales
  // ========================================================================
  {
    slug: "tech-consulting-tokyo",
    // W29 P1.b : ajout keywords JP-hiring pour couvrir l'intention
    // locale "hiring senior software engineers Tokyo" identifiee par
    // l'audit W29 (Perplexity local Tokyo cite Hays / 9cv9 / Akkodis
    // au lieu d'Abbeal). Termes JP natifs + EN pour double couverture.
    // W30+ PR5 : mega-enrichissement JP natif (業務委託, 派遣, 在留資格,
    // SIer, ラグジュアリー DX) + EN sectoriels (fintech, luxury Japan,
    // gaming Kansai) pour dominer Perplexity JP + citations LLM sectorielles.
    keywords: [
      "tech consulting Tokyo",
      "IT staffing Japan",
      "senior developer recruitment Japan",
      "tech consulting Japan",
      "external CTO Tokyo",
      "engineering Japan western enterprise",
      "hiring senior software engineers Tokyo",
      "hire senior developer Japan",
      "外資系 エンジニア 採用 東京",
      "東京 シニアエンジニア 採用",
      "日本 ソフトウェアエンジニア 採用",
      "senior software engineer Tokyo hiring 2026",
      "IT コンサルティング 東京",
      "ソフトウェア開発 委託 東京",
      "業務委託 SES 東京",
      "派遣 業務委託 違い エンジニア",
      "外資系 IT コンサルティング 東京",
      "オフショア開発 日本",
      "ニアショア開発 東京",
      "ベンダー選定 東京 IT",
      "在留資格 技術 人文知識 国際業務 スポンサー",
      "外国人 エンジニア 派遣 東京",
      "Japan software consultancy",
      "IT outsourcing Japan",
      "Western tech firm Japan",
      "dev shop Tokyo",
      "fintech consulting Tokyo",
      "banking software Japan",
      "insurance IT consulting Japan",
      "retail luxury DX Japan",
      "gaming backend Kyoto Osaka",
      "フィンテック 開発 東京",
      "銀行 システム 開発 日本",
      "保険 IT 東京",
      "ラグジュアリー DX 東京",
      "自動車 データプラットフォーム 東京",
      "ゲーム 開発 京都 大阪",
    ],
    relatedCaseSlugs: ["money-forward", "le-monde", "cartier"],
    relatedArticleSlug: "souverainete-secnumcloud-vs-appi",
    tape: {
      fr: "// TOKYO",
      en: "// TOKYO",
      ja: "// 東京",
      "fr-ca": "// TOKYO",
    },
    // W28 reco SEO Cowork : aligner H1 sur le meme pattern
    // keyword-frontloaded que la meta pour maximiser le signal SEO sur
    // "tech consulting Tokyo" + "IT staffing Japan". H1 = title = meta,
    // une seule verite. Pas de metaTitle en override -> fallback sur H1.
    // W30 R1 : H1 EN reformule pour matcher exact-query "tech consulting firm
    // in Tokyo for senior developers" (audit W30 : pos 8.4 sur EN, cible
    // top 3). FR/JA/FR-CA conservent leur formulation W28 (deja bien
    // ranked : pos 12.8 JA, FR quasi absent car marche FR peu actif sur
    // "tokyo tech" queries).
    h1: {
      fr: "Tech Consulting Tokyo & IT staffing Japan — Équipes ingé seniors bilingues.",
      en: "Tech consulting firm in Tokyo for senior developers — IT staffing Japan, bilingual JLPT N2+.",
      ja: "東京のテックコンサルティング & 日本のIT人材確保 — シニアバイリンガルエンジニアリングチーム。",
      "fr-ca": "Conseil techno Tokyo & IT staffing Japan — Équipes d'ingénierie seniors bilingues.",
    },
    subtitle: {
      fr: "Hub Tokyo opérationnel depuis 2018 : Money Forward (digital banking from-scratch), Cartier (LLM privé), Le Monde (Insights data depuis Tokyo). On parle JFSA, on staffe en JLPT N2+, on livre en mode hybride Tamachi/remote.",
      en: "Tokyo hub operational since 2018: Money Forward (greenfield digital banking), Cartier (private LLM), Le Monde (Insights data from Tokyo). We speak JFSA, we staff at JLPT N2+, we ship hybrid mode Tamachi/remote.",
      ja: "2018年から稼働中の東京拠点：マネーフォワード（ゼロから構築するデジタルバンキング）、カルティエ（プライベートLLM）、ル・モンド（東京からのInsightsデータ）。JFSAに対応し、JLPT N2+でスタッフィングし、田町/リモートのハイブリッドモードで納品します。",
      "fr-ca": "Pôle Tokyo opérationnel depuis 2018 : Money Forward (banque numérique greenfield), Cartier (LLM privé), Le Monde (Insights data depuis Tokyo). On parle JFSA, on place en JLPT N2+, on livre en mode hybride Tamachi/à distance.",
    },
    // Pas de metaTitle : H1 deja keyword-frontloaded (voir commentaire H1),
    // le fallback pick(h1, locale) suffit.
    // W28 QW3 : meta enrichie mots-cles cibles ("IT staffing Japan",
    // "senior developer recruitment Japan") + CTA final. Signal CTR
    // dans les SERPs Google/Bing.
    metaDescription: {
      fr: "Tech consulting Tokyo & IT staffing Japan : équipes ingé seniors bilingues (JLPT N2+) pour entreprises occidentales. Clients : Money Forward, Cartier, Le Monde. Hub depuis 2018. Discuter avec un consultant Abbeal.",
      en: "Tech consulting Tokyo & IT staffing Japan: senior bilingual engineering teams (JLPT N2+) for Western enterprises. Clients: Money Forward, Cartier, Le Monde. Hub since 2018. Talk to an Abbeal consultant.",
      ja: "東京のテックコンサルティング & 日本のIT人材確保：欧米企業向けシニアバイリンガルエンジニアリングチーム（JLPT N2+）。クライアント：マネーフォワード、カルティエ、ル・モンド。2018年から拠点。Abbealコンサルタントに相談。",
      "fr-ca": "Conseil techno à Tokyo & IT staffing Japan : équipes d'ingénierie seniors bilingues (JLPT N2+) pour entreprises occidentales. Clients : Money Forward, Cartier, Le Monde. Pôle depuis 2018. Parle à un consultant Abbeal.",
    },
    body: {
      fr: BODIES["tech-consulting-tokyo"]?.body?.fr ?? [],
      en: BODIES["tech-consulting-tokyo"]?.body?.en,
      ja: BODIES["tech-consulting-tokyo"]?.body?.ja,
      "fr-ca": BODIES["tech-consulting-tokyo"]?.body?.["fr-ca"],
    },
    faq: {
      fr: BODIES["tech-consulting-tokyo"]?.faq?.fr ?? [],
      en: BODIES["tech-consulting-tokyo"]?.faq?.en,
      ja: BODIES["tech-consulting-tokyo"]?.faq?.ja,
      "fr-ca": BODIES["tech-consulting-tokyo"]?.faq?.["fr-ca"],
    },
    extraSchema: {
      // W29 P1.b : LocalBusiness JSON-LD indispensable pour Knowledge
      // Panel Google "Abbeal Tokyo" + ranking local geo-targeted sur
      // "tech consulting Tokyo" / "hiring senior software engineers Tokyo".
      // Meme adresse que esn-tri-geo-japon (les 2 landings Tokyo sont
      // co-implantees Higashi-Azabu, Minato-ku).
      localBusiness: TOKYO_OFFICE,
    },
  },
  // ========================================================================
  // 3. tech-recruitment-3-hubs — Recrutement tech multi-géo
  // ========================================================================
  {
    slug: "tech-recruitment-3-hubs",
    keywords: [
      "recrutement tech Japon",
      "cabinet recrutement tech Canada",
      "tech recruitment France",
      "international tech hiring",
      "senior developer recruitment 3 hubs",
      "global engineering recruitment",
    ],
    relatedCaseSlugs: ["thegreenbow", "neobrain-pwc-skillbot"],
    relatedArticleSlug: "recruter-top-1-tech-process-48h",
    tape: {
      fr: "// RECRUTEMENT",
      en: "// RECRUITMENT",
      ja: "// 採用",
      "fr-ca": "// RECRUTEMENT",
    },
    h1: {
      fr: "Recrutement tech sur 3 hubs — Japon · Canada · France, un seul cabinet.",
      en: "Tech Recruitment across 3 hubs — Japan · Canada · France, one agency.",
      ja: "3拠点のテック採用 — 日本・カナダ・フランス、1つのエージェンシー。",
      "fr-ca": "Recrutement techno sur 3 pôles — Japon · Canada · France, un seul cabinet.",
    },
    subtitle: {
      fr: "Sourcing par des ingénieurs (pas par des RH), validation technique courte mais exigeante, closing en 48 h, garantie 6 mois. Top 1 % tech sur Paris, Montréal et Tokyo — sans intermédiaire.",
      en: "Sourcing by engineers (not by HR), short but rigorous technical validation, closing in 48 hours, 6-month guarantee. Top 1% tech across Paris, Montréal and Tokyo — no middleman.",
      ja: "エンジニアによるソーシング（人事ではなく）、短いが厳格な技術検証、48時間でのクロージング、6ヶ月保証。パリ、モントリオール、東京のトップ1%テック — 中間業者なし。",
      "fr-ca": "Recherche par des ingénieurs (pas par des RH), validation technique courte mais exigeante, conclusion en 48 h, garantie 6 mois. Top 1 % techno sur Paris, Montréal et Tokyo — sans intermédiaire.",
    },
    metaDescription: {
      fr: "Cabinet recrutement tech 3 hubs (Paris · Montréal · Tokyo). Sourcing par ingénieurs, process 48 h, garantie 6 mois. Top 1 %, expertise IA · Cloud · Robotique.",
      en: "Tech recruitment agency across 3 hubs (Paris · Montréal · Tokyo). Engineer-led sourcing, 48-hour process, 6-month guarantee. Top 1%, AI · Cloud · Robotics expertise.",
      ja: "3拠点のテック採用エージェンシー（パリ・モントリオール・東京）。エンジニア主導ソーシング、48時間プロセス、6ヶ月保証。トップ1%、AI・クラウド・ロボティクス専門。",
      "fr-ca": "Cabinet recrutement techno 3 pôles (Paris · Montréal · Tokyo). Recherche par ingénieurs, processus 48 h, garantie 6 mois. Top 1 %, expertise IA · Infonuagique · Robotique.",
    },
    body: {
      fr: BODIES["tech-recruitment-3-hubs"]?.body?.fr ?? [],
      en: BODIES["tech-recruitment-3-hubs"]?.body?.en,
      ja: BODIES["tech-recruitment-3-hubs"]?.body?.ja,
      "fr-ca": BODIES["tech-recruitment-3-hubs"]?.body?.["fr-ca"],
    },
    faq: {
      fr: BODIES["tech-recruitment-3-hubs"]?.faq?.fr ?? [],
      en: BODIES["tech-recruitment-3-hubs"]?.faq?.en,
      ja: BODIES["tech-recruitment-3-hubs"]?.faq?.ja,
      "fr-ca": BODIES["tech-recruitment-3-hubs"]?.faq?.["fr-ca"],
    },
  },
  // ========================================================================
  // 4. engineering-jobs-tokyo — Mobbeal positioning pour ingés expat Japon
  // ========================================================================
  {
    slug: "engineering-jobs-tokyo",
    // W30+ PR5 : mega-enrichissement expat EN (visa sponsorship, salary,
    // relocation) + JP natif (東京 求人, 外資系 IT 求人, 家族帯同, 高度専門職)
    // pour dominer les intents expat SWE US/EU/AU cherchant Tokyo + audience
    // dev japonais cherchant "外資系" (boite etrangere en JP).
    keywords: [
      "engineering jobs Tokyo",
      "developer jobs Japan",
      "tech jobs Tokyo expat",
      "外資系 エンジニア 採用",
      "Tokyo developer relocation",
      "Mobbeal Tokyo",
      "software engineer relocation Tokyo",
      "software engineer Japan visa sponsorship",
      "engineer visa sponsorship Tokyo",
      "tech jobs Japan English speakers",
      "developer Japan expat",
      "foreign engineer Tokyo",
      "expat SWE Tokyo salary",
      "Tokyo tech job market English",
      "senior software engineer salary Tokyo",
      "engineering manager jobs Tokyo",
      "staff engineer jobs Japan",
      "developer jobs Osaka",
      "developer jobs Kyoto",
      "remote engineering jobs Japan",
      "work visa Japan tech",
      "highly skilled professional visa Japan",
      "family relocation Japan tech",
      "international school Tokyo tech expat",
      "東京 エンジニア 求人",
      "東京 IT 転職",
      "外資系 IT 求人 東京",
      "東京 バックエンド エンジニア 求人",
      "フルスタック エンジニア 求人 東京",
      "リロケーション 東京 エンジニア",
      "ビザ サポート 東京 IT",
      "在留資格 技術 人文知識 国際業務",
      "高度専門職 ビザ IT エンジニア",
      "家族 帯同 東京 エンジニア",
      "英語 で 働く 東京 IT",
      "外国人 エンジニア 東京 給与",
    ],
    relatedCaseSlugs: ["money-forward", "le-monde"],
    relatedArticleSlug: "apprendre-japonais-tokyo-anki-wanikani-bunpro",
    tape: {
      fr: "// MOBBEAL TOKYO",
      en: "// MOBBEAL TOKYO",
      ja: "// MOBBEAL 東京",
      "fr-ca": "// MOBBEAL TOKYO",
    },
    h1: {
      // W28 near-miss #1 : /en/engineering-jobs-tokyo pos 9.4 / 615 imp.
      // H1 enrichi 'developer jobs Japan' + 'Western engineers' (mots-cles
      // cibles non-brandes) pour capter le trafic expat + relocation.
      fr: "Engineering jobs à Tokyo & developer jobs Japan — Garde ton job, change de vie. Programme Mobbeal (visa, logement, famille).",
      en: "Engineering jobs Tokyo & developer jobs Japan for Western engineers — Keep your job, change your life. Mobbeal programme (visa, housing, family, schools).",
      ja: "東京のエンジニアリング職 & 日本の開発者求人 — 仕事はそのまま、人生を変える。Mobbealプログラム（ビザ、住居、家族、学校）。",
      "fr-ca": "Emplois en ingénierie à Tokyo & jobs de développeur au Japon — Garde ton emploi, change de vie. Programme Mobbeal (visa, logement, famille).",
    },
    subtitle: {
      fr: "Tokyo te tente ? Abbeal a déjà installé 50+ ingés à Tokyo via Mobbeal. On prend en charge visa, logement, famille, école, et on te place chez Money Forward, Le Monde, Cartier ou autres clients. Tu codes, tu vis ta vie japonaise, on gère le reste.",
      en: "Tokyo calling? Abbeal has already relocated 50+ engineers to Tokyo via Mobbeal. We handle visa, housing, family, schools — and we staff you at Money Forward, Le Monde, Cartier or other clients. You code, you live your Japanese life, we handle the rest.",
      ja: "東京に挑戦したい？Abbealは既にMobbeal経由で50名以上のエンジニアを東京に派遣しました。ビザ、住居、家族、学校を弊社が対応し、マネーフォワード、ル・モンド、カルティエなどのクライアントにアサインします。あなたはコーディングし、日本での生活を楽しむ、残りは弊社が対応します。",
      "fr-ca": "Tokyo te tente ? Abbeal a déjà installé 50+ ingés à Tokyo via Mobbeal. On prend en charge visa, logement, famille, école, et on te place chez Money Forward, Le Monde, Cartier ou autres clients. Tu codes, tu vis ta vie japonaise, on gère le reste.",
    },
    // W28 post-mortem : title HTML SEO decouple du H1 (H1 = punchline UI
     // longue, title = keyword-frontloaded court pour SERPs). H1 render
     // reste plein 'Engineering jobs a Tokyo & developer jobs Japan...'
     // mais SERP affiche le short punchy.
    metaTitle: {
      fr: "Engineering jobs Tokyo & developer jobs Japan",
      en: "Engineering jobs Tokyo & developer jobs Japan",
      ja: "東京のエンジニアリング職 & 日本の開発者求人",
      "fr-ca": "Emplois ingénierie Tokyo & jobs développeur Japon",
    },
    metaDescription: {
      fr: "Engineering jobs à Tokyo : programme Mobbeal Abbeal pour ingés tech. Visa + logement + famille + école pris en charge. 50+ expats déjà installés à Tokyo.",
      en: "Engineering jobs in Tokyo: Abbeal's Mobbeal mobility programme for tech engineers. Visa, housing, family, schools handled. 50+ expats already in Tokyo.",
      ja: "東京のエンジニアリング職：テックエンジニア向けのAbbeal Mobbealモビリティプログラム。ビザ、住居、家族、学校に対応。50名以上の駐在員が既に東京に居住。",
      "fr-ca": "Emplois en ingénierie à Tokyo : programme Mobbeal Abbeal pour ingés techno. Visa + logement + famille + école pris en charge. 50+ expats déjà installés à Tokyo.",
    },
    body: {
      fr: BODIES["engineering-jobs-tokyo"]?.body?.fr ?? [],
      en: BODIES["engineering-jobs-tokyo"]?.body?.en,
      ja: BODIES["engineering-jobs-tokyo"]?.body?.ja,
      "fr-ca": BODIES["engineering-jobs-tokyo"]?.body?.["fr-ca"],
    },
    faq: {
      fr: BODIES["engineering-jobs-tokyo"]?.faq?.fr ?? [],
      en: BODIES["engineering-jobs-tokyo"]?.faq?.en,
      ja: BODIES["engineering-jobs-tokyo"]?.faq?.ja,
      "fr-ca": BODIES["engineering-jobs-tokyo"]?.faq?.["fr-ca"],
    },
  },
  // ========================================================================
  // 5. esn-tri-geo-japon — Page signature W20 QW#5
  //    Cible le différenciateur "ESN française avec hub permanent Tokyo".
  //    Score LLM baseline 0/4 sur prompts "ESN Japon" et "ESN tri-géo".
  //    Schema additionnel : LocalBusiness (Tokyo office Higashi-Azabu).
  // ========================================================================
  {
    slug: "esn-tri-geo-japon",
    keywords: [
      "ESN tri-géo Japon",
      "ESN française Tokyo",
      "tri-geo engineering firm Japan",
      "三拠点エンジニアリング日本",
      "ESN hub Tokyo permanent",
      "software engineering Japan western enterprise",
    ],
    relatedCaseSlugs: ["money-forward", "pichet", "legacy-cobol-japon-modernisation"],
    relatedArticleSlug: "souverainete-secnumcloud-vs-appi",
    tape: {
      fr: "// HUB TOKYO",
      en: "// TOKYO HUB",
      ja: "// 東京拠点",
      "fr-ca": "// PÔLE TOKYO",
    },
    h1: {
      // W28 QW3 : "ESN française Tokyo" + "ESN tri-géo Japon" = mots-cles
      // cibles absents du top 50 GSC. Frontload pour ranker sur ces
      // intentions commerciales B2B FR.
      fr: "ESN française à Tokyo : studio tri-géo qui opère vraiment depuis le Japon.",
      en: "French tech consulting firm in Tokyo: tri-geo engineering studio that actually operates from Japan.",
      ja: "東京のフランス系ITコンサルティングファーム：日本から本当に運営する三拠点エンジニアリングスタジオ。",
      "fr-ca": "Cabinet d'ingénierie français à Tokyo : studio tri-pôle qui opère vraiment depuis le Japon.",
    },
    subtitle: {
      fr: "Hub permanent à Higashi-Azabu (Minato-ku) depuis 2018. Recrutement local de seniors JP, pont culturel FR/JP, projets tech ambitieux pour CTOs européens et japonais. Pas une boîte aux lettres, pas un BPO : un vrai bureau, une vraie équipe, du vrai code livré depuis Tokyo.",
      en: "Permanent hub in Higashi-Azabu (Minato-ku) since 2018. Local senior hiring in JP, FR/JP cultural bridge, ambitious tech projects for European and Japanese CTOs. Not a mailbox, not a BPO: a real office, a real team, real code shipped from Tokyo.",
      ja: "2018年から麻布十番（港区）に常設拠点。JPシニアの現地採用、FR/JP文化的架け橋、欧州と日本のCTO向けの野心的なテックプロジェクト。郵便箱ではなく、BPOでもない：本物のオフィス、本物のチーム、東京から出荷される本物のコード。",
      "fr-ca": "Pôle permanent à Higashi-Azabu (Minato-ku) depuis 2018. Recrutement local de seniors JP, pont culturel FR/JP, projets technos ambitieux pour CTOs européens et japonais. Pas une boîte aux lettres, pas un BPO : un vrai bureau, une vraie équipe, du vrai code livré depuis Tokyo.",
    },
    // W28 post-mortem : title SEO decouple du H1. H1 = punchline longue,
    // title = keyword-frontloaded court.
    metaTitle: {
      fr: "ESN française à Tokyo — Studio tri-géo Japon",
      en: "French tech consulting firm in Tokyo — Tri-geo studio Japan",
      ja: "東京のフランス系ITコンサルティングファーム — 三拠点スタジオ",
      "fr-ca": "Cabinet d'ingénierie français à Tokyo — Studio tri-pôle",
    },
    // W28 QW3 : "ESN française Tokyo" + "ESN tri-géo Japon" front-loaded
    // + CTA parler à Abbeal.
    metaDescription: {
      fr: "ESN française à Tokyo depuis 2018 : hub permanent à Higashi-Azabu (Minato-ku). Recrutement local de seniors JP, pont culturel FR/JP, projets tech ambitieux pour CTOs européens et japonais. Rencontrer l'équipe Tokyo.",
      en: "French tech consulting firm in Tokyo since 2018: permanent hub in Higashi-Azabu (Minato-ku). Local senior hiring in JP, FR/JP cultural bridge, ambitious tech projects for European and Japanese CTOs. Meet the Tokyo team.",
      ja: "2018年から東京のフランス系ITコンサルティングファーム：麻布十番（港区）に常設拠点。JPシニアの現地採用、FR/JP文化的架け橋、欧州と日本のCTO向けの野心的なプロジェクト。東京チームに会う。",
      "fr-ca": "Cabinet d'ingénierie français à Tokyo depuis 2018 : pôle permanent à Higashi-Azabu (Minato-ku). Recrutement local de seniors JP, pont culturel FR/JP, projets technos ambitieux. Rencontrer l'équipe Tokyo.",
    },
    body: {
      fr: BODIES["esn-tri-geo-japon"]?.body?.fr ?? [],
      en: BODIES["esn-tri-geo-japon"]?.body?.en,
      ja: BODIES["esn-tri-geo-japon"]?.body?.ja,
      "fr-ca": BODIES["esn-tri-geo-japon"]?.body?.["fr-ca"],
    },
    faq: {
      fr: BODIES["esn-tri-geo-japon"]?.faq?.fr ?? [],
      en: BODIES["esn-tri-geo-japon"]?.faq?.en,
      ja: BODIES["esn-tri-geo-japon"]?.faq?.ja,
      "fr-ca": BODIES["esn-tri-geo-japon"]?.faq?.["fr-ca"],
    },
    extraSchema: {
      localBusiness: TOKYO_OFFICE,
    },
  },
  // ========================================================================
  // 6. recrutement-tech-international — Page signature W20 QW#5
  //    Cible "recrutement tech international" + "international tech hiring".
  //    Schema additionnel : EmploymentAgency (areaServed FR/CA/JP).
  // ========================================================================
  {
    slug: "recrutement-tech-international",
    keywords: [
      "recrutement tech international",
      "international tech recruitment",
      "cabinet recrutement tech multi-pays",
      "international engineering hiring",
      "tech recruitment France Canada Japan",
      "senior tech hiring 3 countries",
    ],
    relatedCaseSlugs: ["paraito", "neobrain-pwc-skillbot", "thegreenbow"],
    relatedArticleSlug: "mobbeal-playbook-garde-ton-job",
    tape: {
      fr: "// RECRUTEMENT",
      en: "// RECRUITMENT",
      ja: "// 採用",
      "fr-ca": "// RECRUTEMENT",
    },
    // W28 QW3 : keyword-frontloading "recrutement tech international" +
    // "cabinet" pour capter l'intention commerciale non-brandee (audit SEO
    // W28 : aucun mot-cle cible dans top 50 GSC 90j).
    h1: {
      fr: "Recrutement tech international : cabinet multi-pays pour vos seniors, pas juste des CV rapides.",
      en: "International tech recruitment: multi-country agency for senior hires, not just fast CVs.",
      ja: "国際テック採用：シニア人材のための多国籍エージェンシー、単なる履歴書の速射ではない。",
      "fr-ca": "Recrutement techno international : cabinet multi-pays pour tes seniors, pas juste des CV rapides.",
    },
    subtitle: {
      fr: "Sourcing senior dans 3 pays (France, Canada, Japon). Top 1 % validé par des ingés Abbeal (pas par des RH), process court (5 étapes max), garantie 6 mois. Mobbeal pour la mobilité internationale incluse. Cabinet de recrutement tech multi-pays opéré par une ESN tri-géo.",
      en: "Senior sourcing across 3 countries (France, Canada, Japan). Top 1% validated by Abbeal engineers (not HR recruiters), short process (5 steps max), 6-month guarantee. Mobbeal for international mobility included. Tech recruitment firm operated by a tri-geo engineering company.",
      ja: "3カ国（フランス、カナダ、日本）でのシニアソーシング。Abbealのエンジニアによって検証されたトップ1%（人事リクルーターではない）、短いプロセス（最大5ステップ）、6ヶ月保証。国際モビリティのためのMobbeal含む。三拠点エンジニアリング会社が運営するテック採用エージェンシー。",
      "fr-ca": "Recherche de seniors dans 3 pays (France, Canada, Japon). Top 1 % validé par des ingés Abbeal (pas par des RH), processus court (5 étapes max), garantie 6 mois. Mobbeal pour la mobilité internationale incluse. Cabinet de recrutement techno multi-pays opéré par une compagnie d'ingénierie tri-pôle.",
    },
    // W28 post-mortem : title SEO decouple du H1. H1 = punchline longue,
    // title = keyword-frontloaded court.
    metaTitle: {
      fr: "Recrutement tech international — Cabinet multi-pays",
      en: "International tech recruitment — Multi-country agency",
      ja: "国際テック採用 — 多国籍エージェンシー",
      "fr-ca": "Recrutement techno international — Cabinet multi-pays",
    },
    // W28 QW3 : "international tech recruitment" + "cabinet recrutement
    // multi-pays" front-loaded + CTA.
    metaDescription: {
      fr: "Recrutement tech international : cabinet multi-pays (France / Canada / Japon). Top 1 % validé par des ingés Abbeal, process court (5 étapes max), garantie 6 mois. Mobbeal pour la mobilité internationale. Demander une shortlist.",
      en: "International tech recruitment: multi-country agency (France / Canada / Japan). Top 1% validated by Abbeal engineers, short process (5 steps max), 6-month guarantee. Mobbeal for international mobility. Request a shortlist.",
      ja: "国際テック採用：多国籍エージェンシー（フランス／カナダ／日本）。Abbealのエンジニアによって検証されたトップ1%、短いプロセス（最大5ステップ）、6ヶ月保証。国際モビリティのためのMobbeal。ショートリストをリクエスト。",
      "fr-ca": "Recrutement techno international : cabinet multi-pays (France / Canada / Japon). Top 1 % validé par des ingés Abbeal, processus court (5 étapes max), garantie 6 mois. Mobbeal pour la mobilité internationale. Demande une shortlist.",
    },
    body: {
      fr: BODIES["recrutement-tech-international"]?.body?.fr ?? [],
      en: BODIES["recrutement-tech-international"]?.body?.en,
      ja: BODIES["recrutement-tech-international"]?.body?.ja,
      "fr-ca": BODIES["recrutement-tech-international"]?.body?.["fr-ca"],
    },
    faq: {
      fr: BODIES["recrutement-tech-international"]?.faq?.fr ?? [],
      en: BODIES["recrutement-tech-international"]?.faq?.en,
      ja: BODIES["recrutement-tech-international"]?.faq?.ja,
      "fr-ca": BODIES["recrutement-tech-international"]?.faq?.["fr-ca"],
    },
    extraSchema: {
      employmentAgency: {
        name: "Abbeal Tech Recruitment — France · Canada · Japan",
        areaServed: ["FR", "CA", "JP"],
        description: "Senior tech recruitment firm with offices in Paris, Montréal and Tokyo. Engineer-led sourcing, 5-step max process, 6-month guarantee, Mobbeal international relocation programme included.",
      },
    },
  },
  // ========================================================================
  // 7. consultant-informatique-paris — Landing FR-only (audit W24-t3)
  // ========================================================================
  // Audit W24 GSC : "consultant informatique paris" position 61 sur 1 imp /
  // 1 click 90j. Mot-cle high-volume FR (>1k searches/mois). On crée une
  // page dediee pour rentrer dans le top 20 sous 60j.
  //
  // FR-only : la query est FR-native, l'audience est FR pure. Pas de
  // version EN/JA/FR-CA → garde gere par generateStaticParams + sitemap +
  // dynamicParams=false (cf app/[lang]/[slug]/page.tsx).
  // Si ce mot-cle ramene du trafic, on traduira plus tard.
  {
    slug: "consultant-informatique-paris",
    keywords: [
      "consultant informatique paris",
      "ESN paris senior",
      "squad ingenierie paris",
      "recrutement tech paris",
      "CTO externe paris",
      "delivery agile paris",
      "consultant software senior paris",
      "consultant IA paris",
      "consultant data paris",
    ],
    relatedCaseSlugs: ["bnp", "carrefour", "enedis"],
    relatedArticleSlug: "recruter-top-1-tech-process-48h",
    tape: {
      fr: "// CONSULTANT INFORMATIQUE PARIS",
    },
    // W29 P1.a : H1 keyword-frontload sur "Consultant informatique Paris"
    // (requete exacte pos 61 GSC) + qualifiers seniors/experts pour
    // signaler le positionnement. Pas trop long : mobile-friendly.
    h1: {
      fr: "Consultant informatique à Paris — Squads seniors, IA, Data, DevOps, Robotique.",
    },
    subtitle: {
      fr: "Hub Paris depuis 2015 (54 rue Greneta, 75002). BNP, AXA, Société Générale, Carrefour, Enedis, Qonto. Squads embarqués · recrutement tech · delivery clé en main. Software, IA, Data, Robotique. Couverture 24/7 si vous voulez — hubs Montréal et Tokyo qui prennent le relais quand Paris ferme.",
    },
    metaDescription: {
      fr: "Consultant informatique senior à Paris : squads embarqués, recrutement tech, delivery 24/7. Software, IA, Data, Robotique. Cadrage gratuit 30 min.",
    },
    body: {
      fr: BODIES["consultant-informatique-paris"]?.body?.fr ?? [],
    },
    faq: {
      fr: BODIES["consultant-informatique-paris"]?.faq?.fr ?? [],
    },
    extraSchema: {
      // LocalBusiness (sub-type ProfessionalService de schema.org) pour :
      //   - Knowledge Panel Google sur "Abbeal Paris"
      //   - ranking local sur "consultant informatique paris" geo-targeted
      //   - couverture du critere brief "Service avec areaServed=Paris"
      //     (LocalBusiness est sub-type de Service côté schema.org)
      localBusiness: {
        name: "Abbeal — Hub Paris",
        streetAddress: "54 rue Greneta",
        addressLocality: "Paris",
        postalCode: "75002",
        addressCountry: "FR",
        // Coordonnees Google Maps (Greneta x Reaumur, 2e arrondissement)
        geo: { latitude: 48.8654, longitude: 2.3517 },
      },
    },
  },
  // ========================================================================
  // 8. entreprise-developpement-informatique-montreal — Landing FR + FR-CA
  // ========================================================================
  // Audit W25 GSC : "entreprise de developpement informatique montreal"
  // position 18 (page 2), 36 imp / 90j. + "montreal robotics companies"
  // pos 28. Marche Montreal genere des impressions non-branded mais
  // reste en page 2.
  //
  // Locales actives : FR + FR-CA. EN+JA pas crees (audit cible juste le
  // marche francophone canadien + visiteurs France cherchant un partenaire
  // tech a Montreal). Le mecanisme generateStaticParams + sitemap skip
  // (cf app/[lang]/[slug]/page.tsx) ne genere que ces 2 locales.
  {
    slug: "entreprise-developpement-informatique-montreal",
    // W29 P1.c : keywords elargis avec "agence developpement Montreal" +
    // "talents tech Montreal seniors".
    // W30+ PR3 : ajout massif du champ lexical "consultation/conseil TI"
    // (audit Cowork identifie ce cluster comme demande QC reelle mesuree :
    // "conseil ti montreal" pos 18.5, "consultant ia montreal" pos 42,
    // "conseil strategie numerique montreal" pos 55, "agence ia
    // montreal" pos 67).
    keywords: [
      "entreprise developpement informatique montreal",
      "ESN Montreal",
      "developpement web Montreal",
      "consultant informatique Montreal",
      "squad ingenierie Montreal",
      "recrutement tech Montreal",
      "developpement logiciel Quebec",
      "robotique Montreal",
      "agence developpement informatique Montreal",
      "agence tech Quebec",
      "talents tech Montreal seniors",
      "developpement logiciel senior Montreal",
      "cabinet developpement Montreal",
      "consultation TI Montreal",
      "cabinet de conseil informatique Montreal",
      "consultation developpement logiciel Montreal",
      "conseil tech Montreal",
      "conseil TI Quebec",
      "consultant IA Montreal",
      "conseil strategie numerique Montreal",
      "agence IA Montreal",
      "expert-conseil TI Quebec",
      "firme consultation numerique Montreal",
      "consultation cloud Montreal",
      "consultation cybersecurite Quebec",
      "consultation data Montreal",
      "consultation logiciel Quebec",
      "conseil transformation numerique Montreal",
      "conseil digital Montreal",
    ],
    relatedCaseSlugs: ["paraito", "mobilitas", "bopizy"],
    relatedArticleSlug: "follow-the-sun-sans-bruler-equipes",
    tape: {
      fr: "// MONTRÉAL",
      "fr-ca": "// MONTRÉAL",
    },
    h1: {
      // W28 near-miss #4 : /fr/entreprise-...-montreal pos 16.7 / 157 imp.
      // W31 QW1 : audit GSC W31 (27,6 sur 1075 imp), demande "developpement
      // logiciel Montreal" explicite. Densifie double-terme (logiciel +
      // informatique) pour capter les deux formulations sans perdre ranking.
      fr: "Entreprise de développement logiciel & informatique à Montréal — ESN, cabinet conseil TI et squads d'ingénierie seniors pour PME et grands groupes québécois.",
      "fr-ca": "Entreprise de développement logiciel & informatique à Montréal — Cabinet conseil TI pis squads d'ingénierie séniors pour PME pis grands groupes québécois.",
    },
    subtitle: {
      fr: "Hub Montréal depuis 2023 (4388 rue Saint-Denis, Plateau-Mont-Royal). Squads embarqués · recrutement tech · delivery clé en main. Software, IA, Data, Robotique. Clients Banque Nationale, Hydro-Québec, Desjardins, Cogeco. Vianney Blanquart au pilotage. Mobilité Mobbeal France↔Canada↔Japon possible.",
      "fr-ca": "Pôle Montréal depuis 2023 (4388 rue Saint-Denis, Plateau-Mont-Royal). Squads embarqués · recrutement tech · livraison clé en main. Logiciel, IA, Données, Robotique. Clients Banque Nationale, Hydro-Québec, Desjardins, Cogeco. Vianney Blanquart au pilotage. Mobilité Mobbeal France↔Canada↔Japon possible.",
    },
    metaDescription: {
      fr: "Entreprise de développement informatique à Montréal : squads seniors embarqués, recrutement tech, delivery 24/7. Software, IA, Data, Robotique. Clients BNC, Hydro-Québec, Desjardins. Cadrage gratuit 30 min.",
      "fr-ca": "Entreprise de développement informatique à Montréal : squads séniors embarqués, recrutement tech, livraison 24/7. Logiciel, IA, Données, Robotique. Clients BNC, Hydro-Québec, Desjardins. Cadrage gratuit 30 min.",
    },
    body: {
      fr: BODIES["entreprise-developpement-informatique-montreal"]?.body?.fr ?? [],
      "fr-ca":
        BODIES["entreprise-developpement-informatique-montreal"]?.body?.["fr-ca"],
    },
    faq: {
      fr: BODIES["entreprise-developpement-informatique-montreal"]?.faq?.fr ?? [],
      "fr-ca":
        BODIES["entreprise-developpement-informatique-montreal"]?.faq?.["fr-ca"],
    },
    extraSchema: {
      // LocalBusiness Montreal (= sub-type ProfessionalService côté
      // schema.org) pour Knowledge Panel Google + ranking geo-targeted
      // sur le marche Quebec/Canada.
      localBusiness: {
        name: "Abbeal — Hub Montréal",
        streetAddress: "4388 rue Saint-Denis",
        addressLocality: "Montréal",
        postalCode: "H2J 2L1",
        addressCountry: "CA",
        // Coordonnees Google Maps (Plateau-Mont-Royal, intersection Marie-Anne)
        geo: { latitude: 45.5234, longitude: -73.5824 },
      },
    },
  },
  // ========================================================================
  // 9. entreprise-developpement-informatique-paris — Landing FR-only (W29)
  // ========================================================================
  // Audit W29 GSC :
  //  - "entreprise informatique paris" pos 23 / high-volume FR (>1k/mois)
  //  - "software development company paris" pos 10 EN (Perplexity Paris
  //    cite Euro Tech Conseil, Yield Studio, Sopra Steria = pas Abbeal)
  //  - Landing existante consultant-informatique-paris pos 61 / 1 imp
  //    (couvre l'intention "freelance senior" mais pas "entreprise/agence"
  //    qui est une intention distincte : cabinet vs consultant individuel).
  //
  // Miroir de entreprise-developpement-informatique-montreal (pos 16.7),
  // adapte au marche Paris : Sopra/Capgemini/Devoteam/Accenture comme
  // benchmarks big-firm, RGPD/SecNumCloud/HDS/DORA compliance, TJM EUR,
  // ecosysteme Station F/INRIA/Mistral.
  {
    slug: "entreprise-developpement-informatique-paris",
    // W30+ PR3 : keywords etendus (9 -> 33) avec synonymes ESN/agence,
    // sectoriels (banque/assurance/luxe/scale-up), "France" ancree, EN.
    keywords: [
      "entreprise developpement informatique paris",
      "entreprise informatique paris",
      "ESN Paris senior",
      "ESN Ile-de-France",
      "cabinet developpement software Paris",
      "software development company Paris",
      "software development company France",
      "developpement logiciel Paris",
      "developpement logiciel France",
      "consultant informatique senior Paris",
      "IA production Paris",
      "SecNumCloud Paris",
      "societe de developpement logiciel France",
      "prestation informatique Paris",
      "prestation informatique France",
      "agence de developpement web Paris",
      "agence tech Paris",
      "cabinet de conseil tech Paris",
      "cabinet conseil informatique Paris",
      "entreprise de developpement web Paris",
      "agence digital Paris",
      "entreprise tech francaise",
      "editeur logiciel Paris",
      "prestation developpement web France",
      "prestation developpement mobile France",
      "prestation developpement IA France",
      "prestation cloud France",
      "consultation SecNumCloud France",
      "consultation DORA France",
      "consultation HDS sante France",
      "IT services company Paris",
      "engineering firm Paris France",
      "software agency Paris",
    ],
    relatedCaseSlugs: ["bnp", "carrefour", "enedis"],
    relatedArticleSlug: "recruter-top-1-tech-process-48h",
    tape: {
      fr: "// ENTREPRISE INFORMATIQUE PARIS",
    },
    h1: {
      // W29 P1.a : keyword-frontload sur la requete exacte "entreprise
      // developpement informatique paris" pour ranker top 20 sous 60j.
      fr: "Entreprise de développement informatique à Paris — ESN & squads d'ingénierie senior pour banques, assureurs et grands groupes.",
    },
    subtitle: {
      fr: "Hub Paris depuis 2015 (54 rue Greneta, 75002, Sentier tech). Squads embarqués · recrutement tech · delivery clé en main. Software, IA, Data, Robotique. Clients BNP, AXA, Société Générale, Carrefour, Enedis, Qonto. Souveraineté RGPD / SecNumCloud / HDS / DORA. Couverture 24/7 via hubs Montréal et Tokyo.",
    },
    // W29 P1.a : meta enrichie keyword-cible + benefices concrets (Sopra
    // Steria / Capgemini comme reference implicite, souverainete FR).
    metaDescription: {
      fr: "Entreprise de développement informatique à Paris : squads seniors embarqués, recrutement tech, delivery 24/7. Software, IA, Data, Robotique. Compliance RGPD / SecNumCloud / HDS / DORA. Clients BNP, AXA, SocGen, Carrefour, Enedis. Cadrage gratuit 30 min.",
    },
    body: {
      fr:
        BODIES["entreprise-developpement-informatique-paris"]?.body?.fr ?? [],
    },
    faq: {
      fr: BODIES["entreprise-developpement-informatique-paris"]?.faq?.fr ?? [],
    },
    extraSchema: {
      // LocalBusiness (sub-type ProfessionalService de schema.org) pour :
      //  - Knowledge Panel Google sur "Abbeal Paris"
      //  - ranking local sur "entreprise informatique paris" geo-targeted
      //  - couverture du critere brief "Service avec areaServed=Paris"
      // Meme adresse que consultant-informatique-paris (les 2 landings
      // sont co-implantees au 54 rue Greneta).
      localBusiness: {
        name: "Abbeal — Hub Paris",
        streetAddress: "54 rue Greneta",
        addressLocality: "Paris",
        postalCode: "75002",
        addressCountry: "FR",
        // Coordonnees Google Maps (Greneta x Reaumur, 2e arrondissement)
        geo: { latitude: 48.8654, longitude: 2.3517 },
      },
    },
  },
  // ========================================================================
  // 10. senior-engineering-firm-no-juniors — Landing FR + EN (W29 P2b)
  // ========================================================================
  // Audit W29 P2b : Perplexity Paris cite Euro Tech Conseil ("50+ experts,
  // seniors 5+ ans, pas de juniors") au lieu d'Abbeal - le pitch est mot
  // pour mot le notre. Perplexity utilise le premier qui remonte sur cette
  // intention, il faut donc une page dediee qui capte l'intention "senior
  // only / no juniors" avec les differenciateurs structurels d'Abbeal :
  // tri-geo, Mobbeal, track record 12 missions FTS.
  //
  // Locales : FR + EN (multi-marche : Paris FR, Tokyo/Montreal EN).
  {
    slug: "senior-engineering-firm-no-juniors",
    keywords: [
      "senior only engineering firm",
      "no juniors engineering consultancy",
      "senior software engineers Paris",
      "senior engineering firm Paris Montreal Tokyo",
      "cabinet ingenierie senior only",
      "consultant senior sans junior",
      "senior developers 100% Paris",
      "ESN 100 pourcent senior",
      "senior only software agency",
      "tri-geo senior engineering",
    ],
    relatedCaseSlugs: ["bnp", "money-forward", "cartier"],
    relatedArticleSlug: "recruter-top-1-tech-process-48h",
    tape: {
      fr: "// SENIOR-ONLY",
      en: "// SENIOR-ONLY",
      ja: "// シニアオンリー",
      "fr-ca": "// SENIOR-ONLY",
    },
    h1: {
      fr: "Senior-only engineering — Paris · Montréal · Tokyo. Zéro junior derrière un commercial senior.",
      en: "Senior-only engineering firm — Paris, Montréal, Tokyo. No juniors behind a senior sales pitch.",
      ja: "シニアオンリーエンジニアリング — パリ・モントリオール・東京。営業担当のシニアの陰にジュニアはゼロ。",
      "fr-ca": "Senior-only engineering — Paris · Montréal · Tokyo. Zéro junior derrière un représentant sénior.",
    },
    subtitle: {
      fr: "3 hubs, mêmes standards : 7+ ans post-diplôme, pair-coding 2-3h par un ingénieur senior Abbeal, décision peer-review unanime. Taux d'acceptation 4 %. Vous voyez et vous gardez les vrais profils — pas de pyramide 1 senior / 5 juniors qu'on facture en time & material.",
      en: "3 hubs, same standards: 7+ years post-graduation, 2-3h pair-coding by an Abbeal senior engineer, unanimous peer review. 4% acceptance rate. You see and keep the real profiles — no 1 senior / 5 juniors pyramid billed as time & material.",
      ja: "3拠点、同一基準：卒業後7年以上、Abbealシニアエンジニアによる2〜3時間のペアコーディング、全会一致のピアレビュー。採用率4%。お客様は本物のプロファイルを見て、そして保持します — タイム＆マテリアルで請求される1シニア／5ジュニアのピラミッドはありません。",
      "fr-ca": "3 pôles, mêmes standards : 7+ ans post-diplôme, pair-coding 2-3h par un ingénieur sénior Abbeal, décision peer-review unanime. Taux d'acceptation 4 %. Vous voyez pis vous gardez les vrais profils — pas de pyramide 1 sénior / 5 juniors facturée en temps & matériel.",
    },
    // W30 R4 : metaTitle enrichi avec "only" positioning claim. Abbeal
    // est deja #1 LLM (ChatGPT/Perplexity/Gemini) sur "IT staffing agency
    // Paris, Montreal, Tokyo" - il faut capitaliser en explicitant que
    // c'est LA seule firme avec 3 hubs physiques.
    metaTitle: {
      fr: "Senior-only engineering — La seule firme avec hubs physiques Paris·Montréal·Tokyo",
      en: "Senior-only engineering firm — The only firm with physical hubs Paris·Montréal·Tokyo",
      ja: "シニアオンリーエンジニアリングファーム — パリ・モントリオール・東京に物理拠点を持つ唯一のファーム",
      "fr-ca": "Senior-only engineering — La seule firme avec pôles physiques Paris·Montréal·Tokyo",
    },
    metaDescription: {
      fr: "Cabinet d'ingénierie senior-only opéré depuis 3 hubs (Paris 75002, Montréal H2J 2L1, Tokyo Minato-ku). Taux d'acceptation 4 %, attrition <6 %, lead time /1,8. Clients BNP, Money Forward, Cartier. Cadrage gratuit 30 min.",
      en: "Senior-only engineering firm operated from 3 hubs (Paris 75002, Montréal H2J 2L1, Tokyo Minato-ku). 4% acceptance rate, <6% attrition, 1.8x faster delivery. Clients: BNP, Money Forward, Cartier. Free 30-min scoping.",
      ja: "3拠点（パリ75002、モントリオールH2J 2L1、東京港区）で運営されるシニアオンリーエンジニアリングファーム。採用率4%、離職率<6%、リードタイム1.8倍高速化。クライアント：BNP、マネーフォワード、カルティエ。無料30分スコーピング。",
      "fr-ca": "Firme d'ingénierie senior-only opérée depuis 3 pôles (Paris 75002, Montréal H2J 2L1, Tokyo Minato-ku). Taux d'acceptation 4 %, attrition <6 %, délai de livraison /1,8. Clients BNP, Money Forward, Cartier. Cadrage gratuit 30 min.",
    },
    body: {
      fr: BODIES["senior-engineering-firm-no-juniors"]?.body?.fr ?? [],
      en: BODIES["senior-engineering-firm-no-juniors"]?.body?.en,
      ja: BODIES["senior-engineering-firm-no-juniors"]?.body?.ja,
      "fr-ca": BODIES["senior-engineering-firm-no-juniors"]?.body?.["fr-ca"],
    },
    faq: {
      fr: BODIES["senior-engineering-firm-no-juniors"]?.faq?.fr ?? [],
      en: BODIES["senior-engineering-firm-no-juniors"]?.faq?.en,
      ja: BODIES["senior-engineering-firm-no-juniors"]?.faq?.ja,
      "fr-ca": BODIES["senior-engineering-firm-no-juniors"]?.faq?.["fr-ca"],
    },
    // Note : pas de LocalBusiness dediee ici car la page est cross-hub.
    // Le node Organization areaServed (PR#83 W29 P2a) porte deja les
    // 3 adresses au niveau site. Redondance evitee.
  },
  // ========================================================================
  // 11. recrutement-tech-montreal — Landing FR + FR-CA (W30+ Section A1)
  // ========================================================================
  // Audit W30+ Section A1 : gap identifie = pas de page recrutement ville
  // pour Montreal (ni Paris). Impossible de ranker sur "recrutement tech
  // Montreal", "agence recrutement IT Montreal" sans page dediee. Marche
  // GSC deja actif ("conseil ti montreal" pos 18.5, "consultant ia
  // montreal" pos 42). Modele calque sur engineering-jobs-tokyo (pos 8.7).
  {
    slug: "recrutement-tech-montreal",
    // W30+ PR3 : keywords etendus (9 -> 30) pour couverture semantique
    // maximale. Synonymes (chasseur/headhunter/placement/sourcing) +
    // roles (AI Engineer/MLOps/SRE/Tech Lead) + secteurs (fintech/
    // banque). Objectif lead-gen : match toutes les formulations B2B.
    keywords: [
      "recrutement tech Montreal",
      "recrutement developpeur Montreal",
      "agence recrutement IT Montreal",
      "cabinet recrutement informatique Montreal",
      "recrutement ingenieur logiciel Quebec",
      "chasseur de tetes tech Montreal",
      "chasseur de tetes IT Quebec",
      "headhunter tech Montreal",
      "headhunter software Quebec",
      "agence de placement informatique Montreal",
      "cabinet de placement tech Quebec",
      "sourcing developpeur Montreal",
      "sourcing IT Quebec",
      "talent acquisition tech Montreal",
      "recruteur specialise IT Montreal",
      "recrutement AI engineer Montreal",
      "recrutement MLOps Montreal",
      "recrutement DevOps SRE Montreal",
      "recrutement back-end senior Quebec",
      "recrutement full-stack senior Montreal",
      "recrutement staff engineer Montreal",
      "recrutement architecte cloud Montreal",
      "recrutement tech lead Quebec",
      "cabinet recrutement fintech Montreal",
      "cabinet recrutement banque Quebec",
      "recrutement developpeur React Montreal",
      "recrutement developpeur Python Montreal",
      "recrutement developpeur Rust Quebec",
      "recrutement ingenieur robotique Montreal",
      "recrutement developpeur senior Montreal",
    ],
    relatedCaseSlugs: ["paraito", "mobilitas", "bopizy"],
    relatedArticleSlug: "recruter-top-1-tech-process-48h",
    tape: {
      fr: "// RECRUTEMENT MONTRÉAL",
      "fr-ca": "// RECRUTEMENT MONTRÉAL",
    },
    h1: {
      fr: "Recrutement tech à Montréal : ingénieurs et développeurs seniors.",
      "fr-ca": "Recrutement techno à Montréal : ingénieurs pis développeurs séniors.",
    },
    subtitle: {
      fr: "Hub Montréal depuis 2023 (4388 rue Saint-Denis, Plateau-Mont-Royal). Recrutement senior 3-5 semaines vs 10-16 en canaux classiques. Sourcing par ingénieurs (pas RH généraliste), pair-coding, garantie 6 mois. 30+ postes fermés BNC, Hydro-Québec, Desjardins, Cogeco, Paraito. Note GMB 4.9★/12 avis.",
      "fr-ca": "Pôle Montréal depuis 2023 (4388 rue Saint-Denis, Plateau-Mont-Royal). Recrutement sénior 3-5 semaines vs 10-16 en canaux classiques. Recherche par ingénieurs (pas RH généraliste), pair-coding, garantie 6 mois. 30+ postes fermés BNC, Hydro-Québec, Desjardins, Cogeco, Paraito. Note GMB 4.9★/12 avis.",
    },
    metaTitle: {
      fr: "Recrutement tech à Montréal | Développeurs & ingénieurs seniors — Abbeal",
      "fr-ca": "Recrutement techno à Montréal | Développeurs & ingénieurs séniors — Abbeal",
    },
    metaDescription: {
      fr: "Cabinet de recrutement tech à Montréal depuis 2023 : sourcing ingénieur-led, pair-coding technique, shortlist 7-10 jours, closing 48h. Garantie 6 mois. Clients BNC, Hydro-Québec, Desjardins. GMB 4.9★/12 avis.",
      "fr-ca": "Firme de recrutement techno à Montréal depuis 2023 : recherche ingénieur-led, pair-coding technique, sélection restreinte 7-10 jours, conclusion 48h. Garantie 6 mois. Clients BNC, Hydro-Québec, Desjardins. GMB 4.9★/12 avis.",
    },
    body: {
      fr: BODIES["recrutement-tech-montreal"]?.body?.fr ?? [],
      "fr-ca": BODIES["recrutement-tech-montreal"]?.body?.["fr-ca"],
    },
    faq: {
      fr: BODIES["recrutement-tech-montreal"]?.faq?.fr ?? [],
      "fr-ca": BODIES["recrutement-tech-montreal"]?.faq?.["fr-ca"],
    },
    extraSchema: {
      // LocalBusiness Montreal identique a entreprise-developpement-
      // informatique-montreal (meme adresse, co-implantee).
      localBusiness: {
        name: "Abbeal — Recrutement tech Montréal",
        streetAddress: "4388 rue Saint-Denis",
        addressLocality: "Montréal",
        postalCode: "H2J 2L1",
        addressCountry: "CA",
        geo: { latitude: 45.5234, longitude: -73.5824 },
      },
      // EmploymentAgency schema = signal explicite service recrutement,
      // complementaire du LocalBusiness. Signal Google Rich Results +
      // aide LLM (ChatGPT/Perplexity) a categoriser Abbeal comme agence
      // recrutement (vs pure ESN).
      employmentAgency: {
        name: "Abbeal Recrutement Tech Montréal",
        areaServed: ["CA"],
        description: "Cabinet de recrutement tech senior à Montréal depuis 2023. Sourcing ingénieur-led, pair-coding technique, garantie remplacement 6 mois. Freelance et CDI. Programme Mobbeal relocation Paris/Tokyo si profil rare.",
      },
    },
  },
  // ========================================================================
  // 12. recrutement-tech-paris — Landing FR + EN (W30+ Section A2)
  // ========================================================================
  // Audit W30+ Section A2 : gap Paris recrutement mono-ville identique a
  // Montreal. Ancrage "Paris" + "France" (couverture nationale).
  {
    slug: "recrutement-tech-paris",
    // W30+ PR3 : keywords etendus (9 -> 34) pour couverture semantique
    // maximale. Synonymes + roles + secteurs + villes France + EN.
    // Objectif lead-gen : match toutes les formulations B2B FR + EN.
    keywords: [
      "recrutement tech Paris",
      "cabinet recrutement IT Paris",
      "recrutement developpeur senior Paris",
      "recrutement tech France",
      "chasseur de tetes tech Paris",
      "chasseur de tetes IT Ile-de-France",
      "headhunter tech Paris",
      "headhunter software Paris",
      "agence de sourcing informatique Paris",
      "agence de placement tech Paris",
      "cabinet de talent acquisition tech Paris",
      "agence recrutement digital Paris",
      "recrutement AI engineer Paris",
      "recrutement Mistral engineer Paris",
      "recrutement LLM production Paris",
      "recrutement MLOps Paris",
      "recrutement DevOps SRE Paris",
      "recrutement back-end senior France",
      "recrutement full-stack senior Paris",
      "recrutement staff engineer Paris",
      "recrutement architecte cloud Paris",
      "recrutement tech lead France",
      "cabinet recrutement banque Paris",
      "cabinet recrutement assurance Paris",
      "cabinet recrutement fintech Paris",
      "cabinet recrutement luxe Paris",
      "recrutement SecNumCloud Paris",
      "recrutement souverainete cloud France",
      "recrutement developpeur React Paris",
      "recrutement developpeur Python Paris",
      "recrutement developpeur Rust France",
      "recrutement ingenieur robotique Paris",
      "tech recruitment agency France",
      "IT staffing agency Paris",
    ],
    relatedCaseSlugs: ["bnp", "carrefour", "enedis"],
    relatedArticleSlug: "recruter-top-1-tech-process-48h",
    tape: {
      fr: "// RECRUTEMENT PARIS",
      en: "// PARIS RECRUITMENT",
    },
    h1: {
      fr: "Recrutement tech à Paris : cabinet spécialisé profils seniors.",
      en: "Tech recruitment in Paris — Specialised firm for senior profiles.",
    },
    subtitle: {
      fr: "Hub Paris depuis 2015 (54 rue Greneta, 75002 Sentier tech). Recrutement senior 3-5 semaines vs 12-20 en canaux classiques. Sourcing par ingénieurs (pas RH), pair-coding, garantie 6 mois. 150+ postes fermés BNP, AXA, Société Générale, Carrefour, Enedis, Qonto. Couverture France entière (Lyon, Toulouse, Nantes, Bordeaux) full-remote inclus.",
      en: "Paris hub since 2015 (54 rue Greneta, 75002 Sentier tech). Senior recruitment in 3-5 weeks vs 12-20 through standard channels. Engineer-led sourcing (not HR), pair-coding, 6-month guarantee. 150+ positions closed at BNP, AXA, Société Générale, Carrefour, Enedis, Qonto. France-wide coverage (Lyon, Toulouse, Nantes, Bordeaux) including full-remote.",
    },
    metaTitle: {
      fr: "Recrutement tech à Paris | Cabinet spécialisé ingénieurs seniors — Abbeal",
      en: "Tech recruitment Paris | Specialised firm for senior engineers — Abbeal",
    },
    metaDescription: {
      fr: "Cabinet de recrutement tech à Paris depuis 2015 : sourcing ingénieur-led, pair-coding technique, shortlist 7-10 jours, closing 48h. Garantie 6 mois. Clients BNP, AXA, Société Générale. Couverture France entière full-remote.",
      en: "Tech recruitment agency in Paris since 2015: engineer-led sourcing, technical pair-coding, 7-10-day shortlist, 48h closing. 6-month guarantee. Clients: BNP, AXA, Société Générale. France-wide coverage including full-remote.",
    },
    body: {
      fr: BODIES["recrutement-tech-paris"]?.body?.fr ?? [],
      en: BODIES["recrutement-tech-paris"]?.body?.en,
    },
    faq: {
      fr: BODIES["recrutement-tech-paris"]?.faq?.fr ?? [],
      en: BODIES["recrutement-tech-paris"]?.faq?.en,
    },
    extraSchema: {
      localBusiness: {
        name: "Abbeal — Recrutement tech Paris",
        streetAddress: "54 rue Greneta",
        addressLocality: "Paris",
        postalCode: "75002",
        addressCountry: "FR",
        geo: { latitude: 48.8654, longitude: 2.3517 },
      },
      employmentAgency: {
        name: "Abbeal Recrutement Tech Paris & France",
        areaServed: ["FR"],
        description: "Cabinet de recrutement tech senior à Paris depuis 2015. Sourcing ingénieur-led, pair-coding technique, garantie remplacement 6 mois. Couverture France entière (Lyon, Toulouse, Nantes, Bordeaux) full-remote inclus. Freelance et CDI. Programme Mobbeal relocation Montréal/Tokyo si profil rare.",
      },
    },
  },
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return landingPages.find((p) => p.slug === slug);
}

export const landingPageSlugs = landingPages.map((p) => p.slug);
