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
};

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
      fr: "Follow-the-Sun Delivery — 3 hubs synchrones livrent 24/7 sans burn-out.",
      en: "Follow-the-Sun Delivery — 3 synced hubs ship 24/7 without burning out.",
      ja: "Follow-the-Sun デリバリー — 3拠点同期で24/7納品、燃え尽きなし。",
      "fr-ca": "Follow-the-Sun Delivery — 3 pôles synchrones livrent 24/7 sans épuisement.",
    },
    subtitle: {
      fr: "Comment Abbeal opère vraiment le delivery 24/7 sur Paris, Montréal et Tokyo. Pas un slogan : une méthode chiffrée, testée sur 6 ans de mission active chez Le Monde, et reproductible chez vous.",
      en: "How Abbeal actually runs 24/7 delivery across Paris, Montréal and Tokyo. Not a slogan: a measurable method, battle-tested on a 6-year ongoing engagement at Le Monde, reproducible at your scale.",
      ja: "Abbealがパリ・モントリオール・東京で24/7デリバリーを実際にどう運用しているか。スローガンではなく、ル・モンドの6年間継続中のエンゲージメントで実証済みの定量的な方法論、貴社規模で再現可能。",
      "fr-ca": "Comment Abbeal opère vraiment la livraison 24/7 sur Paris, Montréal et Tokyo. Pas un slogan : une méthode chiffrée, testée sur 6 ans de mandat actif au Monde, reproductible chez vous.",
    },
    metaDescription: {
      fr: "Follow-the-Sun delivery : 3 hubs synchrones (Paris · Montréal · Tokyo) qui livrent 24/7 sans burn-out. Méthode Abbeal, chiffrée, testée 6 ans en prod.",
      en: "Follow-the-Sun delivery: 3 synced hubs (Paris · Montréal · Tokyo) shipping 24/7 without burnout. Abbeal's measurable method, battle-tested for 6 years in production.",
      ja: "Follow-the-Sun デリバリー：3つの同期拠点（パリ・モントリオール・東京）が24/7納品、燃え尽きなし。Abbealの定量的方法論、6年間の本番実績。",
      "fr-ca": "Follow-the-Sun delivery : 3 pôles synchrones (Paris · Montréal · Tokyo) qui livrent 24/7 sans épuisement. Méthode Abbeal, chiffrée, testée 6 ans en production.",
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
];

export function getLandingPage(slug: string): LandingPage | undefined {
  return landingPages.find((p) => p.slug === slug);
}

export const landingPageSlugs = landingPages.map((p) => p.slug);
