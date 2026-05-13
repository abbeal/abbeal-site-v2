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
      fr: "Follow-the-sun delivery : vos roadmaps avancent pendant que vous dormez.",
      en: "Follow-the-Sun Software Delivery: 24/7 Engineering Across 3 Hubs.",
      ja: "フォロー・ザ・サン開発：あなたが寝ている間にロードマップが進む。",
      "fr-ca": "Follow-the-sun delivery : vos feuilles de route avancent pendant que vous dormez.",
    },
    subtitle: {
      fr: "Comment Abbeal opère vraiment 24/7 entre Paris, Montréal et Tokyo. Handoffs structurés, overlap maîtrisé, zéro dette technique. Un modèle tri-géo qui transforme les fuseaux horaires en avantage compétitif, pas en cauchemar opérationnel.",
      en: "How Abbeal actually runs 24/7 across Paris, Montréal and Tokyo. Structured handoffs, mastered overlap, zero technical debt. A tri-geo model that turns time zones into a competitive edge, not an operational nightmare.",
      ja: "Abbealがパリ・モントリオール・東京の3拠点で運営する24/7開発モデル。構造化されたハンドオフ、計算された重なり、技術的負債ゼロ。タイムゾーンを競争優位に変える、運用の悪夢ではなく。",
      "fr-ca": "Comment Abbeal opère vraiment 24/7 entre Paris, Montréal et Tokyo. Passations structurées, chevauchement maîtrisé, zéro dette technique. Un modèle tri-pôle qui transforme les fuseaux horaires en avantage compétitif, pas en cauchemar opérationnel.",
    },
    metaDescription: {
      fr: "Comment Abbeal opère 24/7 entre Paris, Montréal et Tokyo. Handoffs structurés, overlap maîtrisé, zéro dette. Un modèle tri-géo qui transforme les fuseaux en avantage compétitif.",
      en: "How Abbeal runs 24/7 across Paris, Montréal and Tokyo. Structured handoffs, mastered overlap, no debt. A tri-geo model that turns time zones into a competitive edge.",
      ja: "Abbealがパリ・モントリオール・東京の3拠点で運営する24/7開発モデル。構造化されたハンドオフ、計算された重なり、技術的負債ゼロ。タイムゾーンを競争優位に変える。",
      "fr-ca": "Comment Abbeal opère 24/7 entre Paris, Montréal et Tokyo. Passations structurées, chevauchement maîtrisé, zéro dette. Un modèle tri-pôle qui transforme les fuseaux en avantage compétitif.",
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
    keywords: [
      "tech consulting Tokyo",
      "IT staffing Japan",
      "senior developer recruitment Japan",
      "tech consulting Japan",
      "external CTO Tokyo",
      "engineering Japan western enterprise",
    ],
    relatedCaseSlugs: ["money-forward", "le-monde", "cartier"],
    relatedArticleSlug: "souverainete-secnumcloud-vs-appi",
    tape: {
      fr: "// TOKYO",
      en: "// TOKYO",
      ja: "// 東京",
      "fr-ca": "// TOKYO",
    },
    h1: {
      fr: "Tech Consulting à Tokyo — Équipes ingé seniors pour les entreprises occidentales.",
      en: "Tech Consulting in Tokyo — Senior engineering teams for Western enterprises.",
      ja: "東京のテックコンサルティング — 欧米企業向けシニアエンジニアリングチーム。",
      "fr-ca": "Conseil techno à Tokyo — Équipes d'ingénierie seniors pour les entreprises occidentales.",
    },
    subtitle: {
      fr: "Hub Tokyo opérationnel depuis 2018 : Money Forward (digital banking from-scratch), Cartier (LLM privé), Le Monde (Insights data depuis Tokyo). On parle JFSA, on staffe en JLPT N2+, on livre en mode hybride Tamachi/remote.",
      en: "Tokyo hub operational since 2018: Money Forward (greenfield digital banking), Cartier (private LLM), Le Monde (Insights data from Tokyo). We speak JFSA, we staff at JLPT N2+, we ship hybrid mode Tamachi/remote.",
      ja: "2018年から稼働中の東京拠点：マネーフォワード（ゼロから構築するデジタルバンキング）、カルティエ（プライベートLLM）、ル・モンド（東京からのInsightsデータ）。JFSAに対応し、JLPT N2+でスタッフィングし、田町/リモートのハイブリッドモードで納品します。",
      "fr-ca": "Pôle Tokyo opérationnel depuis 2018 : Money Forward (banque numérique greenfield), Cartier (LLM privé), Le Monde (Insights data depuis Tokyo). On parle JFSA, on place en JLPT N2+, on livre en mode hybride Tamachi/à distance.",
    },
    metaDescription: {
      fr: "Tech consulting à Tokyo : équipes ingé seniors bilingues (JLPT N2+) pour entreprises occidentales. Clients : Money Forward, Cartier, Le Monde. Hub depuis 2018.",
      en: "Tech consulting in Tokyo: senior bilingual engineering teams (JLPT N2+) for Western enterprises. Clients: Money Forward, Cartier, Le Monde. Hub since 2018.",
      ja: "東京のテックコンサルティング：欧米企業向けシニアバイリンガルエンジニアリングチーム（JLPT N2+）。クライアント：マネーフォワード、カルティエ、ル・モンド。2018年から拠点。",
      "fr-ca": "Conseil techno à Tokyo : équipes d'ingénierie seniors bilingues (JLPT N2+) pour entreprises occidentales. Clients : Money Forward, Cartier, Le Monde. Pôle depuis 2018.",
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
    keywords: [
      "engineering jobs Tokyo",
      "developer jobs Japan",
      "tech jobs Tokyo expat",
      "外資系 エンジニア 採用",
      "Tokyo developer relocation",
      "Mobbeal Tokyo",
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
      fr: "Engineering jobs à Tokyo — Garde ton job, change de vie. Programme Mobbeal.",
      en: "Engineering Jobs in Tokyo — Keep your job, change your life. The Mobbeal programme.",
      ja: "東京のエンジニアリング職 — 仕事はそのまま、人生を変える。Mobbealプログラム。",
      "fr-ca": "Emplois en ingénierie à Tokyo — Garde ton emploi, change de vie. Programme Mobbeal.",
    },
    subtitle: {
      fr: "Tokyo te tente ? Abbeal a déjà installé 50+ ingés à Tokyo via Mobbeal. On prend en charge visa, logement, famille, école, et on te place chez Money Forward, Le Monde, Cartier ou autres clients. Tu codes, tu vis ta vie japonaise, on gère le reste.",
      en: "Tokyo calling? Abbeal has already relocated 50+ engineers to Tokyo via Mobbeal. We handle visa, housing, family, schools — and we staff you at Money Forward, Le Monde, Cartier or other clients. You code, you live your Japanese life, we handle the rest.",
      ja: "東京に挑戦したい？Abbealは既にMobbeal経由で50名以上のエンジニアを東京に派遣しました。ビザ、住居、家族、学校を弊社が対応し、マネーフォワード、ル・モンド、カルティエなどのクライアントにアサインします。あなたはコーディングし、日本での生活を楽しむ、残りは弊社が対応します。",
      "fr-ca": "Tokyo te tente ? Abbeal a déjà installé 50+ ingés à Tokyo via Mobbeal. On prend en charge visa, logement, famille, école, et on te place chez Money Forward, Le Monde, Cartier ou autres clients. Tu codes, tu vis ta vie japonaise, on gère le reste.",
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
      fr: "Une ESN tri-géo qui opère vraiment depuis Tokyo.",
      en: "A tri-geo engineering firm that actually operates from Tokyo.",
      ja: "東京から本当に運営する三拠点エンジニアリングファーム。",
      "fr-ca": "Une compagnie d'ingénierie tri-pôle qui opère vraiment depuis Tokyo.",
    },
    subtitle: {
      fr: "Hub permanent à Higashi-Azabu (Minato-ku) depuis 2018. Recrutement local de seniors JP, pont culturel FR/JP, projets tech ambitieux pour CTOs européens et japonais. Pas une boîte aux lettres, pas un BPO : un vrai bureau, une vraie équipe, du vrai code livré depuis Tokyo.",
      en: "Permanent hub in Higashi-Azabu (Minato-ku) since 2018. Local senior hiring in JP, FR/JP cultural bridge, ambitious tech projects for European and Japanese CTOs. Not a mailbox, not a BPO: a real office, a real team, real code shipped from Tokyo.",
      ja: "2018年から麻布十番（港区）に常設拠点。JPシニアの現地採用、FR/JP文化的架け橋、欧州と日本のCTO向けの野心的なテックプロジェクト。郵便箱ではなく、BPOでもない：本物のオフィス、本物のチーム、東京から出荷される本物のコード。",
      "fr-ca": "Pôle permanent à Higashi-Azabu (Minato-ku) depuis 2018. Recrutement local de seniors JP, pont culturel FR/JP, projets technos ambitieux pour CTOs européens et japonais. Pas une boîte aux lettres, pas un BPO : un vrai bureau, une vraie équipe, du vrai code livré depuis Tokyo.",
    },
    metaDescription: {
      fr: "Abbeal est une ESN tri-géo avec un hub permanent à Tokyo (Higashi-Azabu). Recrutement local de seniors JP, pont culturel FR/JP, projets tech ambitieux pour CTOs européens et japonais.",
      en: "Abbeal is a tri-geo engineering firm with a permanent Tokyo hub (Higashi-Azabu). Local senior hiring in JP, FR/JP cultural bridge, ambitious tech projects for European and Japanese CTOs.",
      ja: "Abbealは東京（麻布十番）に常設拠点を持つ三拠点エンジニアリングファーム。JPシニアの現地採用、FR/JP文化的架け橋、欧州と日本のCTO向けの野心的なプロジェクト。",
      "fr-ca": "Abbeal est une compagnie d'ingénierie tri-pôle avec un hub permanent à Tokyo (Higashi-Azabu). Recrutement local de seniors JP, pont culturel FR/JP, projets technos ambitieux.",
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
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return landingPages.find((p) => p.slug === slug);
}

export const landingPageSlugs = landingPages.map((p) => p.slug);
