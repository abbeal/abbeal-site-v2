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
  /** ISO date du dernier refresh éditorial. Si défini ≠ publishedAt :
   *  - JSON-LD BlogPosting.dateModified utilise cette valeur
   *  - UI rend "Publié le X · Mis à jour le Y" en pied de header
   *  - Signal de fraîcheur SEO + LLM crawlers. */
  updatedAt?: string;
  title: Translatable<string>;
  excerpt: Translatable<string>;
  /** Meta description SEO étendue (140-160 chars idéal vs excerpt qui
   *  peut être plus court). Si défini, remplace excerpt dans
   *  <meta name="description"> et openGraph.description. Le excerpt
   *  reste utilisé pour la card listing (rester concis). */
  metaDescription?: Translatable<string>;
  /** Mots-clés SEO ciblés (Schema.org keywords). Si défini, remplace
   *  le simple `tag` dans BlogPosting.keywords. */
  keywords?: Translatable<string>;
  /** FAQ structurée — rendue en Schema.org FAQPage JSON-LD pour
   *  éligibilité Rich Results Google + extraction LLM (ChatGPT,
   *  Perplexity, Claude). Optionnellement rendue en UI en fin
   *  d'article. */
  faq?: Translatable<{ q: string; a: string }[]>;
  /** Slug d'un case study à promouvoir en lien interne enrichi. Permet
   *  un internal linking ≥5 (3 articles related + 1 case + 1 service)
   *  vs 3 articles seulement avant. */
  relatedCaseSlug?: string;
  /** Slug d'un service Abbeal à promouvoir (squads-embarques,
   *  recrutement-technique, delivery-cle-en-main). Idem internal
   *  linking enrichi. */
  relatedServiceSlug?: string;
  body: Translatable<ArticleBlock[]>;
};

export type Resolved<T> = T extends Translatable<infer U> ? U : never;

export const articles: Article[] = [
  // Article 1 — IA, featured
  // Refresh W21 quick win SEO (19 mai 2026) : meta description étendue
  // (140-160 chars cible), keywords explicites, FAQ schema 5 Q/A, body
  // enrichi avec compléments ciblés (LiteLLM, accuracy 64→91, LangGraph,
  // tools list, Llama 3.3 70B). datePublished préservé.
  {
    slug: "agents-ia-production",
    featured: true,
    tag: "IA",
    readTime: "9 min",
    publishedAt: "2026-04-12",
    updatedAt: "2026-05-19",
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
    metaDescription: {
      fr: "7 patterns LLM production : retrieval, evals CI, agents garde-fous, observability, cost routing multi-LLM. Stack Claude + Pinecone + LangGraph + LiteLLM.",
      en: "7 LLM production patterns: retrieval, CI evals, agent guardrails, AI observability, multi-LLM cost routing. Stack Claude + Pinecone + LangGraph + LiteLLM.",
      ja: "7つのLLM本番パターン：retrieval、CI evals、エージェント・ガードレール、AI可観測性、マルチLLMコストルーティング。Claude + Pinecone + LangGraph + LiteLLM。",
    },
    keywords: {
      fr: "LLM production deployment, agents IA production, RAG enterprise, retrieval augmented generation, LangGraph workflow, Pinecone vector database, Claude 3.7 Sonnet enterprise, LiteLLM routing, LLM observability Langfuse, LLM evals CI promptfoo, AI cost optimization, multi-LLM routing, privacy by design AI, on-prem LLM Llama vLLM",
      en: "LLM production deployment, AI agents production, RAG enterprise, retrieval augmented generation, LangGraph workflow, Pinecone vector database, Claude 3.7 Sonnet enterprise, LiteLLM routing, LLM observability Langfuse, LLM evals CI promptfoo, AI cost optimization, multi-LLM routing, privacy by design AI, on-prem LLM Llama vLLM",
      ja: "LLM production deployment, AIエージェント本番, RAGエンタープライズ, LangGraphワークフロー, Pineconeベクトルデータベース, Claude 3.7 Sonnet, LiteLLM, LLM可観測性, LLM evals CI, AIコスト最適化, マルチLLMルーティング, プライバシー・バイ・デザイン, オンプレLLM Llama vLLM",
    },
    faq: {
      fr: [
        { q: "Pourquoi 90 % des projets AI ne passent pas en prod ?", a: "Trois causes dominantes : (1) accuracy non-mesurée en continu (pas d'evals CI, le modèle régresse silencieusement), (2) absence de cost guards (un agent qui boucle peut coûter 10 k€ en une nuit), (3) sécurité/compliance non-baked-in (GDPR, secret bancaire, leak prompt-injection). Les 7 patterns adressent ces trois gaps." },
        { q: "Quels outils pour les evals LLM en CI ?", a: "Promptfoo + Langfuse forment la base solide : Promptfoo pour les tests dataset-vs-judge dans la pipeline GitHub Actions, Langfuse pour le tracking continu en production. LangSmith est l'alternative SaaS one-stop si tu es déjà chez LangChain. Helicone pour l'observability multi-provider léger." },
        { q: "Comment limiter le coût d'un agent LLM en prod ?", a: "Pattern 5 (Cost guards) : LiteLLM en routing layer pour switcher dynamiquement Claude Haiku (cheap) ↔ Sonnet (medium) ↔ Opus (premium) selon la complexité de la requête. Sur un projet Customer Support, on a divisé le coût LLM par 3.4 en 6 semaines sans dégrader la qualité." },
        { q: "Quel vector database choisir en 2026 ?", a: "Pinecone reste notre default pour les workloads >10M vecteurs avec SLA stricts. PostgreSQL + pgvector pour les workloads <1M où on bénéficie déjà de Postgres en prod (95% des cas chez nos clients FinTech). Qdrant si on a besoin d'un déploiement self-hosted GPU avec filtres complexes." },
        { q: "Comment garantir la privacy AI face au GDPR / APPI ?", a: "Pattern 7 (Privacy by design) : LLM self-hosted via vLLM ou Modal pour les use cases sensibles (santé, banking, JP APPI), avec Llama 3.3 70B comme fallback ouvert. Anonymisation prompt-side via Microsoft Presidio. Pas d'envoi de PII à OpenAI/Anthropic sans contrat enterprise + DPA signé." },
      ],
      en: [
        { q: "Why do 90% of AI projects fail to reach production?", a: "Three dominant causes: (1) unmeasured accuracy (no CI evals, the model silently regresses), (2) absence of cost guards (a looping agent can burn €10k overnight), (3) security/compliance not baked-in (GDPR, banking secrecy, prompt-injection leaks). The 7 patterns address those three gaps." },
        { q: "What tools for LLM evals in CI?", a: "Promptfoo + Langfuse form a solid base: Promptfoo for dataset-vs-judge tests in the GitHub Actions pipeline, Langfuse for continuous production tracking. LangSmith is the SaaS one-stop alternative if you're already on LangChain. Helicone for lightweight multi-provider observability." },
        { q: "How to limit a production LLM agent's cost?", a: "Pattern 5 (Cost guards): LiteLLM as routing layer to dynamically switch Claude Haiku (cheap) ↔ Sonnet (medium) ↔ Opus (premium) by request complexity. On a Customer Support project, we divided LLM cost by 3.4× in 6 weeks without quality degradation." },
        { q: "Which vector database to choose in 2026?", a: "Pinecone remains our default for >10M-vector workloads with strict SLAs. PostgreSQL + pgvector for <1M workloads where Postgres is already in prod (95% of cases at our FinTech clients). Qdrant if self-hosted GPU deployment with complex filters is needed." },
        { q: "How to guarantee AI privacy facing GDPR / APPI?", a: "Pattern 7 (Privacy by design): self-hosted LLM via vLLM or Modal for sensitive use cases (health, banking, JP APPI), with Llama 3.3 70B as open fallback. Prompt-side anonymisation via Microsoft Presidio. No PII sent to OpenAI/Anthropic without enterprise contract + signed DPA." },
      ],
    },
    relatedCaseSlug: "bnp",
    relatedServiceSlug: "delivery-cle-en-main",
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
  // Refresh majeur W21 (21 mai 2026) : passage Q2 2026 — Rust/ROS 2/
  // OpenTofu/Pinecone/Anthropic Claude en Adopt, Bun/Astro/DSPy en Trial,
  // Cypress standalone/Jest standalone/MongoDB en Hold. Body refondu sur
  // 4 langues (39 blocks FR/EN, 37 JA/FR-CA). datePublished préservé pour
  // garder antériorité SEO ; slug inchangé pour préserver backlinks.
  {
    slug: "tech-radar-2026",
    featured: true,
    tag: "Tech radar",
    readTime: "12 min",
    publishedAt: "2026-04-01",
    updatedAt: "2026-05-21",
    title: {
      fr: "Tech Radar 2026 Q2 : Rust, ROS 2, OpenTofu, Pinecone, Claude en Adopt.",
      en: "Tech Radar 2026 Q2: Rust, ROS 2, OpenTofu, Pinecone, Claude in Adopt.",
      ja: "Tech Radar 2026 Q2：Rust、ROS 2、OpenTofu、Pinecone、ClaudeがAdoptに。",
    },
    excerpt: {
      fr: "Critères, retours d'expérience, trade-offs. Ce qu'on adopte vraiment vs ce qu'on évalue.",
      en: "Criteria, field reports, trade-offs. What we actually adopt vs what we assess.",
      ja: "Rust、ROS 2、LLM Agentsなど、Abbealのシニアエンジニアが2026年に推す技術と外す技術。adopt/trial/assess/holdの基準も。",
    },
    metaDescription: {
      fr: "Le Tech Radar trimestriel Abbeal Q2 2026. Rust et ROS 2 en Adopt, Bun et DSPy en Trial, Cypress et MongoDB en Hold. Rationale détaillée 35 technos.",
      en: "Abbeal's Q2 2026 quarterly Tech Radar. Rust and ROS 2 in Adopt, Bun and DSPy in Trial, Cypress and MongoDB in Hold. Detailed rationale on 35 techs.",
      ja: "Abbealの2026年Q2四半期Tech Radar。RustとROS 2がAdopt、BunとDSPyがTrial、CypressとMongoDBがHold。35技術の詳細な根拠。",
    },
    keywords: {
      fr: "tech radar 2026, Rust production, ROS 2 robotique, OpenTofu vs Terraform, Pinecone vector database, LangGraph agents, Karpenter EKS, Cypress vs Playwright, Jest vs Vitest, MongoDB vs PostgreSQL pgvector, technology adoption matrix, Adopt Trial Assess Hold",
      en: "tech radar 2026, Rust production, ROS 2 robotics, OpenTofu vs Terraform, Pinecone vector database, LangGraph agents, Karpenter EKS, Cypress vs Playwright, Jest vs Vitest, MongoDB vs PostgreSQL pgvector, technology adoption matrix, Adopt Trial Assess Hold",
      ja: "tech radar 2026, Rust本番, ROS 2ロボティクス, OpenTofu vs Terraform, Pineconeベクトルデータベース, LangGraphエージェント, Karpenter EKS, Cypress vs Playwright, Jest vs Vitest, MongoDB vs PostgreSQL pgvector, 技術採用マトリックス",
    },
    faq: {
      fr: [
        { q: "Quand sort le prochain Tech Radar Abbeal ?", a: "Tous les trimestres. Le prochain (Q3 2026) sort en août 2026. Le vote des Tech Leads des 3 hubs (Paris, Montréal, Tokyo) se déroule sur les 2 dernières semaines du trimestre, publication la première semaine du trimestre suivant." },
        { q: "Pourquoi Rust passe en Adopt en 2026 Q2 ?", a: "Rust était Trial en 2025. Le passage Adopt s'appuie sur 4 missions livrées en pure-prod (Robotique Tokyo, API Mobilité Urbaine, ETL FinTech, edge proxy CloudFlare) + maturité écosystème (Tokio 1.x, Axum, SeaORM, sqlx) + convergence des compétences senior. Argument décisif : 60-80 % d'économie mémoire vs Java/Go sur les workloads à forte concurrence, sans le compromis productivité de C++." },
        { q: "Faut-il migrer de Cypress vers Playwright ?", a: "Oui, on le recommande activement. Playwright a 3× temps CI, support multi-browser natif, debugger intégré, communauté plus active. Cypress était Adopt en 2023, passe en Hold en 2026 Q2. Migration documentée en 5 étapes chez un client SaaS B2B (effort 2-3 sprints pour un test suite moyenne de 200 tests E2E)." },
        { q: "OpenTofu remplace-t-il vraiment Terraform ?", a: "Oui, pour les nouveaux projets et les renewals. OpenTofu 1.7 est stable, state migration testée et documentée. On migre activement nos missions Terraform existantes vers OpenTofu lors des renouvellements de contrats. License BSL de Terraform 1.6+ a accéléré le shift sur tout le marché." },
        { q: "Comment Abbeal vote son Tech Radar ?", a: "Vote trimestriel des Tech Leads des 3 hubs (Paris, Montréal, Tokyo). Pas démocratique : chaque Tech Lead apporte des données mesurables (latence, mémoire, time-to-merge, bugs, courbe d'apprentissage). Documents partagés en Notion. Les choix sont accessibles au client sous mission via le mandate technique (avec escape hatch documenté si dérogation)." },
      ],
      en: [
        { q: "When does the next Abbeal Tech Radar come out?", a: "Every quarter. The next one (Q3 2026) ships in August 2026. Tech Leads from the 3 hubs (Paris, Montréal, Tokyo) vote over the last 2 weeks of the quarter, publication the first week of the next quarter." },
        { q: "Why does Rust move to Adopt in Q2 2026?", a: "Rust was Trial in 2025. The Adopt move is based on 4 missions delivered in pure-prod (Tokyo Robotics, Urban Mobility API, FinTech ETL, CloudFlare edge proxy) + ecosystem maturity (Tokio 1.x, Axum, SeaORM, sqlx) + senior skills convergence. Decisive argument: 60-80% memory savings vs Java/Go on high-concurrency workloads, without C++'s productivity compromise." },
        { q: "Should you migrate from Cypress to Playwright?", a: "Yes, we actively recommend it. Playwright has 3× CI time, native multi-browser support, integrated debugger, more active community. Cypress was Adopt in 2023, moves to Hold in Q2 2026. Migration documented in 5 steps at a SaaS B2B client (2-3 sprints for a 200-test E2E suite)." },
        { q: "Does OpenTofu really replace Terraform?", a: "Yes, for new projects and renewals. OpenTofu 1.7 is stable, state migration tested and documented. We actively migrate our existing Terraform missions to OpenTofu at contract renewals. Terraform 1.6+'s BSL license accelerated the shift across the entire market." },
        { q: "How does Abbeal vote its Tech Radar?", a: "Quarterly vote of Tech Leads from the 3 hubs (Paris, Montréal, Tokyo). Not democratic: each Tech Lead brings measurable data (latency, memory, time-to-merge, bugs, learning curve). Documents shared in Notion. Choices are accessible to mission clients via the technical mandate (with documented escape hatch if derogation needed)." },
      ],
    },
    relatedCaseSlug: "robotique-jp-ros2-flotte",
    relatedServiceSlug: "squads-embarques",
    body: {
      fr: ARTICLE_BODIES["tech-radar-2026"]?.fr ?? [],
      en: ARTICLE_BODIES["tech-radar-2026"]?.en,
      ja: ARTICLE_BODIES["tech-radar-2026"]?.ja,
      "fr-ca": ARTICLE_BODIES["tech-radar-2026"]?.["fr-ca"],
    },
  },
  // Article 4 — Follow-the-Sun
  // Refresh W21 quick win SEO (19 mai 2026) : meta description étendue,
  // keywords explicites (tri-geo, async-first, follow-the-sun handoff),
  // FAQ schema 5 Q/A. Pas de modif slug ni H1 (préserve backlinks et
  // identité éditoriale). datePublished préservé.
  {
    slug: "follow-the-sun-sans-bruler-equipes",
    featured: false,
    tag: "Engineering",
    readTime: "7 min",
    publishedAt: "2026-03-25",
    updatedAt: "2026-05-19",
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
    metaDescription: {
      fr: "Adaptive Follow-the-Sun Abbeal : 3 hubs Paris-Montréal-Tokyo synchronisés. Lead time -44 %, attrition <6 %, NPS interne 72. Anti-patterns à éviter.",
      en: "Abbeal Adaptive Follow-the-Sun: 3 synchronized hubs Paris-Montreal-Tokyo. Lead time -44%, attrition <6%, internal NPS 72. Anti-patterns to avoid.",
      ja: "Abbeal Adaptive Follow-the-Sun：パリ・モントリオール・東京の3拠点同期。リードタイム-44%、離職率<6%、社内NPS 72。回避すべきアンチパターン。",
    },
    keywords: {
      fr: "tri-geo delivery, global engineering team, distributed teams 24/7, async-first delivery, follow-the-sun software, time zone coverage engineering, follow-the-sun handoff, Paris Montréal Tokyo engineering, async daily stand-up, RFC markdown engineering, tri-geographical software delivery",
      en: "tri-geo delivery, global engineering team, distributed teams 24/7, async-first delivery, follow-the-sun software, time zone coverage engineering, follow-the-sun handoff, Paris Montreal Tokyo engineering, async daily stand-up, RFC markdown engineering, tri-geographical software delivery",
      ja: "トライジオ・デリバリー, グローバル・エンジニアリングチーム, 24/7分散チーム, 非同期ファースト・デリバリー, follow-the-sunソフトウェア, タイムゾーン・カバレッジ, follow-the-sunハンドオフ, パリ・モントリオール・東京エンジニアリング, 非同期デイリースタンドアップ, RFCマークダウン",
    },
    faq: {
      fr: [
        { q: "Qu'est-ce que le Follow-the-Sun delivery ?", a: "Un modèle où 3 équipes situées sur 3 fuseaux horaires complémentaires (Paris CET, Montréal EST, Tokyo JST) se passent la roadmap en relais. Quand Paris ferme à 18h CET, Montréal prend la main. Quand Montréal ferme à 21h EST, Tokyo enchaîne. Quand Tokyo ferme à 19h JST, Paris reprend. Couverture 24/5 sans astreinte nocturne." },
        { q: "Combien de temps d'overlap entre hubs nécessaire ?", a: "1 heure × 2 par jour sanctuarisée (Paris 17h-18h ↔ Montréal 11h-12h, Tokyo 18h-19h ↔ Paris 10h-11h). Aucune meeting interne ni autre interruption pendant ces fenêtres — réservées exclusivement au handoff actif et aux questions client en synchrone." },
        { q: "Comment éviter le burn-out sur le Follow-the-Sun ?", a: "Trois règles non-négociables : (1) ownership de domaines fonctionnels stricts par hub (pas de zone partagée éditable par 3 hubs), (2) tickets calibrés pour finir dans un shift ou être explicitement passés, (3) on-call rotatif sur l'on-call de production, jamais sur le travail de jour. Résultat mesuré : attrition <6 %, NPS interne 72." },
        { q: "Pour quels projets le Follow-the-Sun est-il adapté ?", a: "Idéal pour : 24/5 SLA stricts (financial, gaming, e-commerce mondial), runs critiques production sans astreinte nocturne, projets lourds avec lead time qui doit baisser drastiquement (-44 % observé sur 12 missions Abbeal). Peu adapté à : missions de moins de 6 semaines (coût onboarding tri-hub trop élevé), missions mono-équipe <5 personnes (overlap non rentable)." },
        { q: "Quels outils pour l'async-first delivery ?", a: "Notion ou Confluence pour les RFC markdown (un handoff = un RFC mis à jour). Slack en thread-first (pas de DM, pas de canal sans archives). Linear ou Jira avec convention stricte sur le statut et l'assignee. Tactiq ou Otter pour transcrire les rares meetings sync. GitHub PR review obligatoire entre hubs en overlap window." },
      ],
      en: [
        { q: "What is Follow-the-Sun delivery?", a: "A model where 3 teams across 3 complementary time zones (Paris CET, Montréal EST, Tokyo JST) hand off the roadmap relay-style. When Paris closes at 6 PM CET, Montréal picks up. When Montréal closes at 9 PM EST, Tokyo continues. When Tokyo closes at 7 PM JST, Paris resumes. 24/5 coverage without night on-call." },
        { q: "How much overlap between hubs is needed?", a: "1 hour × 2 per day sanctuarised (Paris 5-6 PM ↔ Montréal 11 AM-12 PM, Tokyo 6-7 PM ↔ Paris 10-11 AM). No internal meeting or other interruption during these windows — exclusively reserved for active handoff and synchronous client questions." },
        { q: "How to avoid burn-out on Follow-the-Sun?", a: "Three non-negotiable rules: (1) strict functional-domain ownership per hub (no shared zone editable by 3 hubs), (2) tickets calibrated to complete in one shift or be explicitly passed, (3) rotating on-call on production on-call only, never on day work. Measured result: attrition <6%, internal NPS 72." },
        { q: "What projects suit Follow-the-Sun?", a: "Ideal for: strict 24/5 SLAs (financial, gaming, global e-commerce), critical production runs without night on-call, heavy projects where lead time must drop drastically (-44% observed across 12 Abbeal engagements). Less suited to: missions under 6 weeks (tri-hub onboarding cost too high), single-team missions <5 people (overlap unprofitable)." },
        { q: "What tools for async-first delivery?", a: "Notion or Confluence for RFC markdown (one handoff = one updated RFC). Slack thread-first (no DMs, no channel without archives). Linear or Jira with strict status and assignee convention. Tactiq or Otter to transcribe rare sync meetings. Mandatory GitHub PR review between hubs in overlap window." },
      ],
    },
    relatedCaseSlug: "le-monde",
    relatedServiceSlug: "delivery-cle-en-main",
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
  // Enrichissement W21 (25 mai 2026) : ajout section "Quatre cas concrets
  // 2024-2025" (Sebastien Paris->Tokyo, Lea Montreal->Paris, Hiro Tokyo->
  // Montreal, Karim Paris->Montreal record 4 sem) + stats agregees (52
  // mobilites, 12 sem moyenne, 11 k€, 91% reussite). Meta description +
  // keywords + FAQ 6 Q/A. datePublished et slug preserves.
  {
    slug: "mobbeal-playbook-garde-ton-job",
    featured: false,
    tag: "Mobbeal",
    readTime: "10 min",
    publishedAt: "2026-02-10",
    updatedAt: "2026-05-25",
    title: {
      fr: "Mobbeal Playbook : garde ton job, change de vie.",
      en: "Mobbeal Playbook: keep your job, change your life.",
      ja: "Mobbealプレイブック：仕事はそのまま、人生を変える。",
    },
    excerpt: {
      fr: "52 mobilités opérées entre Paris, Montréal, Tokyo. Le modèle qu'on a affiné, les pièges, les wins. Et qui on cherche.",
      en: "52 mobilities operated between Paris, Montréal, Tokyo. The model we refined, the pitfalls, the wins. And who we're looking for.",
      ja: "パリ、モントリオール、東京の間で運営された52のモビリティ。私たちが洗練したモデル、落とし穴、成功。そして探している人材。",
    },
    metaDescription: {
      fr: "52 mobilités opérées depuis 2018 entre Paris, Montréal, Tokyo. Visa, logement, fiscalité : Mobbeal orchestre l'expatriation tech en 12 semaines (vs 28 marché).",
      en: "52 international mobilities since 2018 between Paris, Montreal, Tokyo. Visa, housing, taxation: Mobbeal orchestrates tech expat in 12 weeks (vs 28 market).",
      ja: "2018年以降、パリ、モントリオール、東京の間で52のモビリティを運営。ビザ、住居、税務：Mobbealはテックエンジニアの海外赴任を12週間で実現（市場28週間と比較）。",
    },
    keywords: {
      fr: "VIE Tokyo, passeport talent salarié qualifié, International Mobility Program IMP, work permit Canada intra-company transfer, visa développeur Japon, relocation tech engineer, expatriation ingénieur logiciel, programme mobilité internationale ESN, certificate of eligibility CoE Japon, LMIA-exempt Canada",
      en: "VIE Tokyo, passeport talent salarié qualifié, International Mobility Program IMP, work permit Canada intra-company transfer, developer visa Japan, tech engineer relocation, software engineer expat, ESN international mobility programme, Certificate of Eligibility CoE Japan, LMIA-exempt Canada",
      ja: "VIE東京, パスポートタレント・サラリエ・クォリフィエ, International Mobility Program IMP, カナダ就労許可企業内転勤, 日本開発者ビザ, テックエンジニア再配置, ソフトウェアエンジニア海外赴任, ESN国際モビリティプログラム, 在留資格認定証明書CoE日本, LMIA免除カナダ",
    },
    faq: {
      fr: [
        { q: "Combien de temps prend une mobilité Tokyo depuis Paris ?", a: "En moyenne 12 semaines de la décision à l'opérationnel (vs 28 semaines marché). Cas concret 2024 — Sébastien Lonjon : 4 mois entre la décision et le full opérationnel à Tokyo, sponsoring via Abbeal K.K. existante + cabinet immigration sous contrat Mobbeal. Sans ces 2 actifs, doublez le délai." },
        { q: "Quels visas pour un développeur français au Japon ?", a: "Le visa standard est Engineer / Specialist in Humanities / International Services, sponsoring via une entité japonaise (la nôtre : Abbeal K.K.). Délai : 4-6 mois de la décision au visa estampillé. Le Certificate of Eligibility (CoE) est la phase critique côté Japon, géré par notre cabinet immigration BizUp Solutions à Tokyo." },
        { q: "Le client paie-t-il un surcoût pendant l'expatriation ?", a: "Non. L'ingé reste payé par l'entité Abbeal locale (Paris, Montréal ou Tokyo selon départ). Le client continue de facturer le TJM normal de l'ingé en consulting. Mobbeal facture séparément l'opérationnel mobilité au client (8-15 k€ par mobilité), payable en une fois ou amorti sur 12 mois selon la mission." },
        { q: "Mobbeal couvre quels pays ?", a: "Trois pays opérés en direct grâce à nos 3 entités juridiques actives : France (Abbeal SAS, 54 rue Greneta Paris), Canada (Abbeal Inc., 4388 Saint-Denis Montréal), Japon (Abbeal K.K., PMC Building Higashi-Azabu Tokyo). Tous trois ont >3 ans d'historique fiscal et sont éligibles aux visas intra-groupe rapides." },
        { q: "Quel taux de réussite >24 mois ?", a: "91 % sur 52 mobilités opérées depuis 2018. C'est notre KPI principal — on ne facture pas une mobilité réussie, on facture une intégration durable. Si l'ingé rentre dans son pays d'origine en moins de 12 mois, Abbeal réopère gratuitement. Le programme d'onboarding culturel de 90 jours (cours de langue, meeting hebdo hub local, accompagnement administratif) est la clé." },
        { q: "Mobbeal est-il accessible aux freelances ?", a: "Non. Mobbeal opère uniquement pour les ingés salariés Abbeal (CDI dans l'une des 3 entités) ou pour les ingés sous staffing Abbeal chez nos clients enterprise. Les freelances doivent passer par les cabinets RH classiques. Le sponsoring intra-groupe est ce qui débloque les délais visa courts." },
      ],
      en: [
        { q: "How long does a Tokyo mobility from Paris take?", a: "On average 12 weeks from decision to operational (vs 28 weeks market). Concrete 2024 case — Sébastien Lonjon: 4 months between decision and full operational in Tokyo, sponsorship via existing Abbeal K.K. + immigration firm under Mobbeal contract. Without those 2 assets, double the timeline." },
        { q: "What visas for a French developer in Japan?", a: "The standard visa is Engineer / Specialist in Humanities / International Services, sponsored via a Japanese entity (ours: Abbeal K.K.). Timeline: 4-6 months from decision to stamped visa. The Certificate of Eligibility (CoE) is the critical phase on the Japan side, handled by our immigration firm BizUp Solutions in Tokyo." },
        { q: "Does the client pay a surcharge during the expatriation?", a: "No. The engineer remains paid by the local Abbeal entity (Paris, Montréal or Tokyo depending on origin). The client keeps billing the engineer's normal TJM in consulting. Mobbeal bills the mobility operational separately to the client (€8-15k per mobility), payable upfront or amortised over 12 months depending on the mission." },
        { q: "Which countries does Mobbeal cover?", a: "Three countries operated directly thanks to our 3 active legal entities: France (Abbeal SAS, 54 rue Greneta Paris), Canada (Abbeal Inc., 4388 Saint-Denis Montréal), Japan (Abbeal K.K., PMC Building Higashi-Azabu Tokyo). All three have >3 years of fiscal history and are eligible for fast intra-group visas." },
        { q: "What success rate at >24 months?", a: "91% across 52 mobilities operated since 2018. That's our main KPI — we don't bill for a successful mobility, we bill for a lasting integration. If the engineer returns home in less than 12 months, Abbeal re-operates for free. The 90-day cultural onboarding programme (language courses, weekly local hub meeting, admin support) is the key." },
        { q: "Is Mobbeal accessible to freelancers?", a: "No. Mobbeal operates only for Abbeal salaried engineers (CDI in one of the 3 entities) or for engineers under Abbeal staffing at our enterprise clients. Freelancers must go through classic HR firms. Intra-group sponsorship is what unlocks the short visa timelines." },
      ],
    },
    relatedCaseSlug: "money-forward",
    relatedServiceSlug: "recrutement-technique",
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
  // Article 20 — Output-based vs T&M (Business). Création W21 brief (2 juin
  // 2026, W23 lundi). Cible "outcome-based consulting" + "ESN forfait vs régie".
  // Featured + featuredOnHome=true : sujet stratégique pricing/positioning,
  // mérite slot scarce home. 78% portfolio Abbeal en Output-based 2026.
  {
    slug: "output-based-vs-time-material",
    featured: true,
    featuredOnHome: false, // home garde Agents IA + GreenOps + Tech Radar
    tag: "Business",
    readTime: "11 min",
    publishedAt: "2026-06-02",
    title: {
      fr: "Output-based vs Time & Material : pourquoi on a tué le T&M chez Abbeal.",
      en: "Output-based vs Time & Material: why we killed T&M at Abbeal.",
      ja: "Output-based vs Time & Material：AbbealがT&Mを葬った理由。",
      "fr-ca": "Output-based vs Time & Material : pourquoi on a tué le T&M chez Abbeal.",
    },
    excerpt: {
      fr: "78 % du portfolio Abbeal en Output-based en 2026. Marge brute +18 pts, NPS +24, durée moyenne mission ×1,7. Comment on opère et 3 conditions de succès.",
      en: "78% of Abbeal portfolio runs on Output-based pricing in 2026. Gross margin +18 pts, NPS +24, engagement length ×1.7. How we operate and 3 success conditions.",
      ja: "2026年、Abbealポートフォリオの78%がOutput-basedで稼働。粗利益+18pts、NPS+24、平均ミッション期間×1.7。運用方法と3つの成功条件。",
      "fr-ca": "78 % du portfolio Abbeal en Output-based en 2026. Marge brute +18 pts, NPS +24, durée moyenne de mandat ×1,7. Comment on opère et 3 conditions de succès.",
    },
    metaDescription: {
      fr: "78 % du portfolio Abbeal en Output-based en 2026. Marge brute +18 pts, NPS +24, durée moyenne mission ×1,7. Comment on opère et 3 conditions de succès.",
      en: "78% of Abbeal portfolio runs on Output-based pricing in 2026. Gross margin +18 pts, NPS +24, engagement length ×1.7. How we operate and 3 success conditions.",
      ja: "2026年Abbealポートフォリオの78%がOutput-basedで稼働。粗利益+18pts、NPS+24、平均ミッション期間×1.7。運用方法と3つの成功条件を解説。",
      "fr-ca": "78 % du portfolio Abbeal en Output-based en 2026. Marge brute +18 pts, NPS +24, durée moyenne mandat ×1,7. Comment on opère et 3 conditions de succès.",
    },
    keywords: {
      fr: "output-based pricing, time and material vs forfait, fixed price tech consulting, ESN forfait vs régie, output-based ESN, body shopping vs forfait, outcome-based consulting, change request software, sprint forfait, scoping payé ESN",
      en: "output-based pricing, time and material vs fixed price, tech consulting pricing, output-based consulting, body shopping vs fixed price, outcome-based consulting, change request software, sprint fixed price, paid scoping consulting, outcome based engagement",
      ja: "アウトプットベースプライシング, time and material vs 定額, 固定価格テックコンサルティング, ESN forfait vs régie, アウトプットベースESN, アウトカムベースコンサルティング, change request ソフトウェア, スプリント定額, 有給スコーピング",
    },
    faq: {
      fr: [
        { q: "Qu'est-ce qu'un contrat Output-based vs T&M ?", a: "Le T&M (Time & Material) facture à la journée : TJM × jours bookés. L'Output-based facture le livrable : forfait fixe pour un sprint, une feature ou une milestone. Le client paie le résultat, pas l'effort. Abbeal opère 3 variantes : forfait par sprint (2 sem), forfait par feature (2-6 sem), Outcome-based (forfait + bonus si KPI business atteint)." },
        { q: "Pour quels types de mission l'Output-based est-il adapté ?", a: "Quand le scope est cadrable (= produit défini, pas un POC), l'équipe Abbeal est >3 ingés, la mission >3 mois, et le client a un PM ou Product Owner mature. Sur ces critères, l'Output-based bat le T&M sur 5 métriques (marge, NPS, durée, re-signature, vélocité). Pour les POCs ou les missions <2 mois, le T&M reste pertinent (overhead du scoping non amortissable)." },
        { q: "Quelle marge supplémentaire vs T&M ?", a: "+18 pts de marge brute Abbeal mesurée sur 12 missions Output-based vs 12 T&M comparables (2024-2025) : T&M 28 % → Output-based 46 %. Mécaniquement : l'équipe shippe plus vite (-20 % de jours pour le même scope), donc la marge sur le forfait fixe augmente. Le client n'est pas perdant : il paie le même prix global ou moins, et reçoit un produit qui marche." },
        { q: "Comment gérer un changement de scope en Output-based ?", a: "Change Request structurée : on chiffre l'impact (jours ingés × TJM équivalent), on documente la dérogation, on signe avant d'exécuter. Pas de « tu peux pas juste me rajouter ça vite fait ». Cette discipline est non-négociable côté Abbeal et c'est elle qui rend le modèle économiquement viable sur 14 mois moyens (vs 8 mois en T&M)." },
        { q: "Quelles entreprises ont adopté ce modèle ?", a: "Chez Abbeal, 78 % du portfolio 2026 Q2 est en Output-based. Côté marché : ThoughtWorks, Pivotal Labs (avant rachat VMware), 18F (US Government Services), une partie de Pivotal/Tanzu et plusieurs scale-ups SaaS. La résistance reste forte côté grands achats (Big 4, Sopra, Capgemini) formés au T&M depuis 30 ans. Sur 12 missions Abbeal Output-based 2024-2025, on a fait passer le format à 11 acheteurs sur 12." },
      ],
      en: [
        { q: "What is an Output-based contract vs T&M?", a: "T&M (Time & Material) bills by the day: TJM × booked days. Output-based bills the deliverable: fixed forfait for a sprint, a feature or a milestone. The client pays the result, not the effort. Abbeal operates 3 variants: sprint forfait (2 weeks), feature forfait (2-6 weeks), Outcome-based (forfait + bonus if business KPI hit)." },
        { q: "What types of missions suit Output-based?", a: "When scope is framable (= defined product, not a POC), Abbeal team is >3 engineers, mission >3 months, and the client has a mature PM or Product Owner. On those criteria, Output-based beats T&M on 5 metrics (margin, NPS, length, re-sign, velocity). For POCs or <2-month missions, T&M remains relevant (scoping overhead not amortisable)." },
        { q: "What additional margin vs T&M?", a: "+18 pts of Abbeal gross margin measured across 12 Output-based missions vs 12 comparable T&M (2024-2025): T&M 28% → Output-based 46%. Mechanically: team ships faster (-20% days for same scope), so margin on the fixed forfait grows. Client doesn't lose: same global price or less, and receives a working product." },
        { q: "How to handle scope change on Output-based?", a: "Structured Change Request: we quantify impact (engineer days × equivalent TJM), document the derogation, sign before executing. No « can you just add this quickly ». This discipline is non-negotiable on Abbeal side and what makes the model economically viable over 14-month averages (vs 8 months on T&M)." },
        { q: "Which firms have adopted this model?", a: "At Abbeal, 78% of Q2 2026 portfolio is Output-based. Market side: ThoughtWorks, Pivotal Labs (before VMware acquisition), 18F (US Government Services), part of Pivotal/Tanzu, and several SaaS scale-ups. Resistance remains strong from large procurement (Big 4, Sopra, Capgemini) trained on T&M for 30 years. On 12 Abbeal Output-based missions 2024-2025, we got the format past 11 buyers out of 12." },
      ],
    },
    relatedCaseSlug: "fintech-iso27001-devsecops",
    relatedServiceSlug: "delivery-cle-en-main",
    body: {
      fr: ARTICLE_BODIES["output-based-vs-time-material"]?.fr ?? [],
      en: ARTICLE_BODIES["output-based-vs-time-material"]?.en,
      ja: ARTICLE_BODIES["output-based-vs-time-material"]?.ja,
      "fr-ca": ARTICLE_BODIES["output-based-vs-time-material"]?.["fr-ca"],
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
