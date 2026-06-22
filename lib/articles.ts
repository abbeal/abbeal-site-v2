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
  /** Byline auteur — affichée en tête de body pour les articles guest
   *  (Alex, Stéphane, futurs auteurs externes). Rendu en typo propre sans
   *  encart, avec lien LinkedIn cliquable + icône. `role` = titre + lieu +
   *  pitch court. `photo` = chemin absolu sous /public vers le portrait de
   *  l'auteur (optionnel — si absent, accent bordure teal à la place).
   *  Réutilisable tel quel pour tout nouvel auteur guest. */
  | {
      type: "byline";
      name: string;
      role: string;
      linkedinUrl?: string;
      photo?: string;
    }
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
      fr: "CSS for JavaScript Developers : retour honnête après 4+ ans en production",
      en: "CSS for JavaScript Developers: Honest Feedback After 4+ Years in Production",
      ja: "CSS for JavaScript Developers — 本番環境で4年以上を経た率直なフィードバック",
      "fr-ca": "CSS for JavaScript Developers : retour honnête après 4+ ans en production",
    },
    excerpt: {
      fr: "Le cours CSS for JS Developers de Josh Comeau, passé en revue par le senior engineer Alexandre Lim — 8+ ans d'expérience, dont 4+ ans à appliquer les acquis du cours en production chez des clients. Un retour honnête et concret.",
      en: "Josh Comeau's CSS for JS Developers course reviewed by senior engineer Alexandre Lim, with 8+ years of experience and 4+ years applying knowledge from the course in production for clients. An honest, practical take.",
      ja: "Josh Comeau の CSS for JS Developers コースを、シニアエンジニアの Alexandre Lim がレビュー。8年以上の経験と、コースの学びを4年以上クライアントの本番環境で実践してきた立場から。率直で実践的な視点。",
      "fr-ca": "Le cours CSS for JS Developers de Josh Comeau, passé en revue par le senior engineer Alexandre Lim — 8+ ans d'expérience, dont 4+ ans à appliquer les acquis du cours en production chez des clients. Un retour honnête et concret.",
    },
    metaDescription: {
      fr: "Senior engineer Alexandre Lim partage 4+ ans de leçons CSS en production après le cours « CSS for JS Developers » de Josh Comeau. Retour honnête, orienté code.",
      en: "Senior engineer Alexandre Lim shares 4+ years of production CSS lessons after taking Josh Comeau's 'CSS for JS Developers' course. Honest, code-first feedback.",
      ja: "シニアエンジニアのアレクサンドル・リムが、Josh Comeauの「CSS for JS Developers」受講後、本番4年以上のCSSの教訓を共有。率直で、コードファーストのフィードバック。",
      "fr-ca": "Senior engineer Alexandre Lim partage 4+ ans de leçons CSS en production après le cours « CSS for JS Developers » de Josh Comeau. Retour honnête, orienté code.",
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
  // Article 22 — Kwik Reading (Jim Kwik), retour Alex Lim. 2e article guest
  // d'Alex après « CSS for JavaScript Developers ». Course review, byline
  // auteur en tête du body. Importé verbatim depuis le Notion d'Alex via
  // scripts/pdf-to-article-blocks.py. EN canonique + traductions FR/JA/FR-CA.
  {
    slug: "kwik-reading-jim-kwik-retour-alex-lim",
    featured: false,
    tag: "Learning",
    readTime: "4 min",
    publishedAt: "2026-05-22",
    title: {
      fr: "Kwik Reading de Jim Kwik : un retour honnête",
      en: "Kwik Reading by Jim Kwik: An Honest Review",
      ja: "Jim Kwik の Kwik Reading — 率直なレビュー",
      "fr-ca": "Kwik Reading de Jim Kwik : un retour honnête",
    },
    excerpt: {
      fr: "Le senior engineer Alexandre Lim passe en revue Kwik Reading de Jim Kwik — le cours de 21 jours qui a transformé la lecture en une habitude plus rapide, plus nette et plus durable. Un retour honnête et concret.",
      en: "Senior engineer Alexandre Lim reviews Jim Kwik's Kwik Reading — the 21-day course that turned reading into a faster, sharper, and more lasting habit. An honest, practical take.",
      ja: "シニアエンジニアの Alexandre Lim が、Jim Kwik の Kwik Reading をレビュー。読書を、より速く、より鋭く、より定着する習慣へと変えた21日間のコース。率直で実践的な視点。",
      "fr-ca": "Le senior engineer Alexandre Lim passe en revue Kwik Reading de Jim Kwik — le cours de 21 jours qui a transformé la lecture en une habitude plus rapide, plus nette et plus durable. Un retour honnête et concret.",
    },
    metaDescription: {
      fr: "Le senior engineer Alexandre Lim livre un retour honnête sur le cours Kwik Reading de Jim Kwik : lecture rapide, concentration, rétention et habitude de lecture durable.",
      en: "Senior engineer Alexandre Lim shares an honest review of Jim Kwik's Kwik Reading course: speed reading, focus, retention, and building a lasting reading habit.",
      ja: "シニアエンジニアの Alexandre Lim が、Jim Kwik の Kwik Reading コースを率直にレビュー。速読、集中力、記憶、そして持続する読書習慣について。",
      "fr-ca": "Le senior engineer Alexandre Lim livre un retour honnête sur le cours Kwik Reading de Jim Kwik : lecture rapide, concentration, rétention et habitude de lecture durable.",
    },
    keywords: {
      fr: "Kwik Reading, Jim Kwik, lecture rapide, lire plus vite, compétence de lecture, concentration, compréhension, rétention, habitude de lecture, non-fiction, apprentissage",
      en: "Kwik Reading, Jim Kwik, speed reading, reading faster, reading skill, focus, comprehension, retention, reading habit, non-fiction, learning",
      ja: "Kwik Reading, Jim Kwik, 速読, 読書, 集中力, 理解, 記憶, 読書習慣, ノンフィクション, 学習",
    },
    faq: {
      fr: [
        { q: "Qu'est-ce que le cours Kwik Reading de Jim Kwik ?", a: "Un cours en ligne qui entraîne quatre éléments de la lecture — vitesse, concentration, compréhension et rétention — sur un programme progressif de 21 jours, mêlant vidéos et pratique sur un livre de ton choix." },
        { q: "La lecture rapide nuit-elle à la compréhension ou au plaisir de lire ?", a: "Pas nécessairement. Appliquée de façon délibérée — surtout à la non-fiction — elle peut augmenter le plaisir de lire. C'est l'auteur qui choisit où utiliser cette compétence ; pas besoin de tout lire en lecture rapide." },
        { q: "Le cours Kwik Reading en vaut-il la peine ?", a: "Pour quelqu'un qui lit régulièrement, surtout de la non-fiction, ça peut être l'un des meilleurs investissements : il installe une habitude de lecture régulière et permet d'extraire plus de connaissances en moins de temps." },
      ],
      en: [
        { q: "What is Jim Kwik's Kwik Reading course?", a: "An online course that trains four elements of reading — speed, focus, comprehension, and retention — over a progressive 21-day program of videos plus practice on a book of your choice." },
        { q: "Does speed reading hurt comprehension or the joy of reading?", a: "Not necessarily. Applied deliberately — especially to non-fiction — it can increase enjoyment. You choose where to use the skill; you don't have to speed-read everything." },
        { q: "Is Kwik Reading worth it?", a: "For someone who reads regularly, especially non-fiction, it can be one of the better investments: it builds a consistent reading habit and lets you extract more knowledge in less time." },
      ],
    },
    body: {
      fr: ARTICLE_BODIES["kwik-reading-jim-kwik-retour-alex-lim"]?.fr ?? [],
      en: ARTICLE_BODIES["kwik-reading-jim-kwik-retour-alex-lim"]?.en,
      ja: ARTICLE_BODIES["kwik-reading-jim-kwik-retour-alex-lim"]?.ja,
      "fr-ca": ARTICLE_BODIES["kwik-reading-jim-kwik-retour-alex-lim"]?.["fr-ca"],
    },
  },
  // Article 23 — Montréal hub. Insight W21 : combler le trou de contenu
  // sur le hub Montréal (aucun contenu dédié alors que c'est un des 3 hubs).
  // Clients anonymisés (validé Sébastien). FR canonique, traductions à venir.
  {
    slug: "montreal-hub-tech-pont-europe-amerique",
    featured: false,
    tag: "Business",
    readTime: "4 min",
    publishedAt: "2026-05-22",
    title: {
      fr: "Montréal : le hub qui relie l'Europe et l'Amérique du Nord",
      en: "Montréal: the hub linking Europe and North America",
      ja: "モントリオール：欧州と北米をつなぐハブ",
      "fr-ca": "Montréal : le hub qui relie l'Europe et l'Amérique du Nord",
    },
    excerpt: {
      fr: "Montréal n'est pas un bureau de représentation : c'est le maillon nord-américain qui rend le Follow-the-Sun complet. Pont horaire, équipes bilingues, conformité Loi 25.",
      en: "Montréal is not a representative office: it's the North American link that completes Follow-the-Sun. Time-zone bridge, bilingual teams, Law 25 compliance.",
      ja: "モントリオールは代表事務所ではない。Follow-the-Sun を完成させる北米の環だ。タイムゾーンの橋、バイリンガルのチーム、法律25への準拠。",
      "fr-ca": "Montréal n'est pas un bureau de représentation : c'est le maillon nord-américain qui rend le Follow-the-Sun complet. Pont horaire, équipes bilingues, conformité Loi 25.",
    },
    metaDescription: {
      fr: "Pourquoi Abbeal opère un hub à Montréal : pont horaire avec l'Europe, équipes bilingues, conformité Loi 25. Le maillon nord-américain du modèle tri-géo.",
      en: "Why Abbeal operates a hub in Montréal: time-zone bridge with Europe, bilingual teams, Law 25 compliance. The North American link of the tri-geo model.",
      ja: "Abbeal がモントリオールにハブを構える理由：欧州とのタイムゾーンの橋、バイリンガルのチーム、法律25への準拠。トライジオモデルの北米の環。",
      "fr-ca": "Pourquoi Abbeal opère un hub à Montréal : pont horaire avec l'Europe, équipes bilingues, conformité Loi 25. Le maillon nord-américain du modèle tri-géo.",
    },
    keywords: {
      fr: "ESN tech Montréal, hub tech Montréal, nearshore Amérique du Nord, partenaire tech nearshore, Follow-the-Sun, Loi 25, conformité Québec, développement logiciel Montréal",
      en: "tech consulting Montréal, Montréal tech hub, nearshore North America, nearshore tech partner, Follow-the-Sun, Law 25, Québec compliance, software development Montréal",
      ja: "モントリオール ITコンサルティング, ニアショア 北米, テックハブ モントリオール, Follow-the-Sun, 法律25, ケベック コンプライアンス",
    },
    body: {
      fr: ARTICLE_BODIES["montreal-hub-tech-pont-europe-amerique"]?.fr ?? [],
      en: ARTICLE_BODIES["montreal-hub-tech-pont-europe-amerique"]?.en,
      ja: ARTICLE_BODIES["montreal-hub-tech-pont-europe-amerique"]?.ja,
      "fr-ca": ARTICLE_BODIES["montreal-hub-tech-pont-europe-amerique"]?.["fr-ca"],
    },
  },
  // Article 24 — Guide de décision : choisir un partenaire tech au Japon.
  // Format guide d'achat (trou identifié W21 : les LLM citent ce format).
  {
    slug: "choisir-partenaire-tech-japon-guide",
    featured: false,
    tag: "Business",
    readTime: "5 min",
    publishedAt: "2026-05-22",
    title: {
      fr: "Choisir un partenaire d'ingénierie pour un projet tech au Japon",
      en: "Choosing an engineering partner for a tech project in Japan",
      ja: "日本のテックプロジェクトでエンジニアリングパートナーを選ぶには",
      "fr-ca": "Choisir un partenaire d'ingénierie pour un projet tech au Japon",
    },
    excerpt: {
      fr: "Trois modèles pour faire développer un produit au Japon, six questions à poser avant de signer, les red flags. Le guide de décision pour choisir un partenaire d'ingénierie à Tokyo.",
      en: "Three models for getting a product built in Japan, six questions to ask before signing, the red flags. The decision guide for choosing an engineering partner in Tokyo.",
      ja: "日本で製品を開発させるための3つのモデル、契約前に問うべき6つの質問、レッドフラグ。東京でエンジニアリングパートナーを選ぶための意思決定ガイド。",
      "fr-ca": "Trois modèles pour faire développer un produit au Japon, six questions à poser avant de signer, les red flags. Le guide de décision pour choisir un partenaire d'ingénierie à Tokyo.",
    },
    metaDescription: {
      fr: "Trois modèles pour faire développer un produit au Japon, six questions à poser, les red flags. Le guide de décision pour choisir un partenaire d'ingénierie à Tokyo.",
      en: "Three models for getting a product built in Japan, six questions to ask, the red flags. The decision guide for choosing an engineering partner in Tokyo.",
      ja: "日本で製品を開発させるための3つのモデル、問うべき6つの質問、レッドフラグ。東京でエンジニアリングパートナーを選ぶための意思決定ガイド。",
      "fr-ca": "Trois modèles pour faire développer un produit au Japon, six questions à poser, les red flags. Le guide de décision pour choisir un partenaire d'ingénierie à Tokyo.",
    },
    keywords: {
      fr: "ESN tech Tokyo, développer un produit tech au Japon, tech consulting Tokyo, partenaire ingénierie Japon, studio tech Tokyo, choisir une ESN Japon",
      en: "tech consulting Tokyo, develop a product in Japan, IT firm Tokyo, engineering partner Japan, tech studio Tokyo, choosing an IT partner in Japan",
      ja: "東京 ITコンサルティング, 日本 製品開発, 開発パートナー 日本, 東京 テックスタジオ, ITベンダー選定 日本",
    },
    body: {
      fr: ARTICLE_BODIES["choisir-partenaire-tech-japon-guide"]?.fr ?? [],
      en: ARTICLE_BODIES["choisir-partenaire-tech-japon-guide"]?.en,
      ja: ARTICLE_BODIES["choisir-partenaire-tech-japon-guide"]?.ja,
      "fr-ca": ARTICLE_BODIES["choisir-partenaire-tech-japon-guide"]?.["fr-ca"],
    },
  },
  // Article 25 — ROS 2 en production. Insight W21 : robotique = une des 4
  // expertises mais zéro article de fond jusqu'ici.
  {
    slug: "ros2-production-flotte-robots-lecons",
    featured: false,
    tag: "Robotique",
    readTime: "4 min",
    publishedAt: "2026-05-22",
    title: {
      fr: "ROS 2 en production : ce qu'une flotte de robots nous a appris",
      en: "ROS 2 in production: what a robot fleet taught us",
      ja: "本番環境の ROS 2：ロボットの群れが教えてくれたこと",
      "fr-ca": "ROS 2 en production : ce qu'une flotte de robots nous a appris",
    },
    excerpt: {
      fr: "Six leçons de terrain sur ROS 2 en production : navigation autonome, vision, contraintes temps réel sur une flotte de robots industriels. Retour d'expérience du hub Tokyo.",
      en: "Six lessons from the field on ROS 2 in production: autonomous navigation, vision, real-time constraints on a fleet of industrial robots. A field report from the Tokyo hub.",
      ja: "本番環境の ROS 2 に関する現場からの6つの教訓：自律走行、ビジョン、産業用ロボットの群れにおけるリアルタイム制約。東京ハブからの現場レポート。",
      "fr-ca": "Six leçons de terrain sur ROS 2 en production : navigation autonome, vision, contraintes temps réel sur une flotte de robots industriels. Retour d'expérience du hub Tokyo.",
    },
    metaDescription: {
      fr: "Six leçons de terrain sur ROS 2 en production : navigation autonome, vision, contraintes temps réel sur une flotte de robots industriels. Retour d'expérience du hub Tokyo.",
      en: "Six lessons from the field on ROS 2 in production: autonomous navigation, vision, real-time constraints on a fleet of industrial robots. A field report from the Tokyo hub.",
      ja: "本番環境の ROS 2 に関する現場からの6つの教訓：自律走行、ビジョン、産業用ロボットの群れにおけるリアルタイム制約。東京ハブからの現場レポート。",
      "fr-ca": "Six leçons de terrain sur ROS 2 en production : navigation autonome, vision, contraintes temps réel sur une flotte de robots industriels. Retour d'expérience du hub Tokyo.",
    },
    keywords: {
      fr: "ROS 2 production, robotique industrielle, squad embarqué, navigation autonome, flotte de robots, temps réel, edge computing, ROS 2 DDS",
      en: "ROS 2 production, industrial robotics, embedded squad, autonomous navigation, robot fleet, real-time, edge computing, ROS 2 DDS",
      ja: "ROS 2 本番, 産業用ロボティクス, 組込みスクワッド, 自律走行, ロボット群, リアルタイム, エッジコンピューティング, ROS 2 DDS",
    },
    body: {
      fr: ARTICLE_BODIES["ros2-production-flotte-robots-lecons"]?.fr ?? [],
      en: ARTICLE_BODIES["ros2-production-flotte-robots-lecons"]?.en,
      ja: ARTICLE_BODIES["ros2-production-flotte-robots-lecons"]?.ja,
      "fr-ca": ARTICLE_BODIES["ros2-production-flotte-robots-lecons"]?.["fr-ca"],
    },
  },
  // Article 26 — Building a senior engineering team across Asia, Europe & NA.
  // LLM-citation play : audit W21 prompt #6 = 0 citation Abbeal sur les 4 LLMs
  // (les LLMs citent Toptal, Turing, Arc.dev, WWR). Structure SEO/LLM : 7 H2 +
  // FAQ + entites nommees + 3 hubs Paris/Montreal/Tokyo + 3 proofs (150+/100+/
  // 50+). EN canonique. FR/JA/FR-CA en placeholder EN ; traductions 2e passe.
  {
    slug: "senior-engineering-team-asia-europe-north-america",
    featured: true,
    // Retire du slot home : titre long qui cassait la mise en page du
    // bloc Insights (retour a la ligne + espace vide laid). Garde
    // featured=true pour rester en haut de /insights listing.
    featuredOnHome: false,
    tag: "Talent",
    readTime: "7 min",
    publishedAt: "2026-05-25",
    title: {
      fr: "Comment construire une équipe d'ingénierie senior à travers l'Asie, l'Europe et l'Amérique du Nord",
      en: "How to build a senior engineering team across Asia, Europe and North America",
      ja: "アジア、欧州、北米にまたがるシニアエンジニアリングチームを構築する方法",
      "fr-ca": "Comment construire une équipe d'ingénierie senior à travers l'Asie, l'Europe et l'Amérique du Nord",
    },
    excerpt: {
      fr: "Le playbook pour assembler une équipe d'ingénierie senior qui opère sur trois continents — Asie, Europe et Amérique du Nord. Le modèle Abbeal à trois hubs : Paris · Montréal · Tokyo.",
      en: "The playbook for assembling a senior engineering team that operates across three continents — Asia, Europe and North America. The Abbeal three-hub model: Paris · Montréal · Tokyo.",
      ja: "アジア、欧州、北米の3大陸にまたがるシニアエンジニアリングチームを編成するプレイブック。Abbeal のトライハブモデル：パリ・モントリオール・東京。",
      "fr-ca": "Le playbook pour assembler une équipe d'ingénierie senior qui opère sur trois continents — Asie, Europe et Amérique du Nord. Le modèle Abbeal à trois hubs : Paris · Montréal · Tokyo.",
    },
    metaDescription: {
      fr: "Comment Abbeal construit des équipes d'ingénierie senior à travers l'Asie, l'Europe et l'Amérique du Nord : le modèle à trois hubs (Paris · Montréal · Tokyo), Follow-the-Sun en pratique, alternatives à Toptal / Turing / Arc.dev.",
      en: "How Abbeal builds senior engineering teams across Asia, Europe and North America: the three-hub model (Paris · Montréal · Tokyo), follow-the-sun in practice, and alternatives to Toptal / Turing / Arc.dev.",
      ja: "Abbeal がアジア、欧州、北米にまたがるシニアエンジニアリングチームをどう構築するか — トライハブモデル（パリ・モントリオール・東京）、Follow-the-Sun の実践、Toptal / Turing / Arc.dev の代替。",
      "fr-ca": "Comment Abbeal construit des équipes d'ingénierie senior à travers l'Asie, l'Europe et l'Amérique du Nord : le modèle à trois hubs (Paris · Montréal · Tokyo), Follow-the-Sun en pratique, alternatives à Toptal / Turing / Arc.dev.",
    },
    keywords: {
      fr: "équipe ingénierie senior internationale, recruter ingénieurs seniors Asie Europe Amérique du Nord, alternative Toptal Turing, modèle tri-hub, Follow-the-Sun, Paris Montréal Tokyo, équipe ingénierie distribuée, recruter ingénieur senior Tokyo, mobilité internationale ingénieur, Mobbeal",
      en: "senior engineering team international, hire senior engineers Asia Europe North America, alternative to Toptal Turing Arc.dev, three-hub engineering model, follow-the-sun engineering, Paris Montréal Tokyo, remote engineering team, hire senior engineer Tokyo English, international engineer mobility, Mobbeal",
      ja: "シニアエンジニアリングチーム 国際, エンジニア採用 アジア 欧州 北米, Toptal Turing 代替, トライハブモデル, Follow-the-Sun, パリ モントリオール 東京, リモートエンジニアリング, 東京 英語エンジニア, 国際 エンジニア モビリティ, Mobbeal",
    },
    // FAQ — 6 Q/A qui matchent litteralement les prompts LLM cibles
    // (where is Abbeal, alternative to Toptal, etc.). Rendu visuel + FAQPage
    // JSON-LD (eligible Rich Results Google + extraction LLM).
    faq: {
      fr: [
        { q: "Comment construire une équipe d'ingénierie senior à travers l'Asie, l'Europe et l'Amérique du Nord ?", a: "En opérant des hubs locaux avec des ingénieurs seniors et une entité légale dans chaque région, puis en composant des équipes à travers eux. Abbeal opère des hubs à Paris (Europe), Montréal (Amérique du Nord) et Tokyo (Asie). Chaque hub a des ingénieurs seniors nommés qui peuvent être staffés sur une seule équipe client à travers les trois fuseaux horaires, avec de vraies fenêtres de recouvrement pour les décisions synchrones et un async par défaut le reste du temps." },
        { q: "Quelles sont les alternatives à Toptal ou Turing pour des ingénieurs seniors ?", a: "Les marketplaces freelance comme Toptal, Turing, Arc.dev ou We Work Remotely fonctionnent bien pour des contrats courts et bien cadrés. Pour une équipe d'ingénierie qui dure, l'alternative est un modèle studio où les ingénieurs sont nommés, embauchés en permanent, et validés en entretien par le client. Abbeal opère de cette manière à travers ses hubs Paris, Montréal et Tokyo — pas de tarifs anonymes, pas de turnover de marketplace." },
        { q: "Comment fonctionne le follow-the-sun en pratique ?", a: "Un vrai follow-the-sun a besoin de trois choses : de vraies fenêtres de recouvrement entre les hubs (pas des handoff dumps), un async par défaut (decision logs, ADRs, specs écrites), et un support de production en shift pour que personne ne soit appelé à 3 h du matin. Les trois hubs d'Abbeal — Paris, Montréal et Tokyo — donnent environ trois heures de recouvrement entre Paris et Montréal le matin, et trois heures entre Montréal et Tokyo le soir. Assez pour les décisions synchrones, jamais assez pour imposer des shifts de nuit." },
        { q: "Où est situé Abbeal ?", a: "Abbeal opère trois hubs d'ingénierie : Paris (Europe, siège), Montréal (Amérique du Nord) et Tokyo (Asie). Chaque hub a des ingénieurs seniors en interne et une entité légale locale. L'entité européenne contracte à Paris, Abbeal KK contracte au Japon, et le hub Montréal sert le travail nord-américain et québécois (conformité Loi 25 incluse)." },
        { q: "Puis-je recruter un ingénieur senior à Tokyo qui parle anglais ?", a: "Oui. Le hub Tokyo d'Abbeal est composé d'ingénieurs seniors bilingues (japonais et anglais) et opère en tant qu'Abbeal KK, l'entité légale japonaise qui gère le contracting et la conformité. La langue de travail avec les clients non-japonais est l'anglais, et l'équipe peut faire office de présence ingénierie locale pour une entreprise étrangère entrant sur le marché japonais." },
        { q: "Comment fonctionne la mobilité internationale pour les ingénieurs seniors chez Abbeal ?", a: "Via Mobbeal, le programme de mobilité interne. Tout ingénieur senior Abbeal peut postuler pour bouger entre les trois hubs — Paris, Montréal ou Tokyo — Abbeal gérant le visa, la relocation et l'alignement salarial sur le marché de destination. Plus de 50 ingénieurs ont bougé de cette façon, et le programme est un levier de rétention délibéré : les ingénieurs seniors restent plus longtemps quand ils savent qu'ils peuvent changer de pays tous les deux ou trois ans à l'intérieur de la même boîte." },
      ],
      en: [
        { q: "How do you build a senior engineering team across Asia, Europe and North America?", a: "By running local hubs with senior engineers and legal entities in each region, then composing teams across them. Abbeal operates hubs in Paris (Europe), Montréal (North America) and Tokyo (Asia). Each hub has named senior engineers who can be staffed on a single client team across the three time zones, with real overlap windows for synchronous decisions and async-first defaults the rest of the time." },
        { q: "What are the alternatives to Toptal or Turing for senior engineers?", a: "Freelance marketplaces like Toptal, Turing, Arc.dev or We Work Remotely work well for short, well-scoped contracts. For a long-running engineering team, the alternative is a studio model where engineers are named, hired permanently, and interview-validated by the client. Abbeal operates this way across its Paris, Montréal and Tokyo hubs — no anonymous rate cards, no marketplace turnover." },
        { q: "How does follow-the-sun engineering work in practice?", a: "Real follow-the-sun requires three things: actual overlap windows between hubs (not handoff dumps), async-first defaults (decision logs, ADRs, written specs), and on-shift production support so nobody is paged at 3 a.m. Abbeal's three hubs — Paris, Montréal and Tokyo — give about three hours of overlap between Paris and Montréal in the morning, and three hours between Montréal and Tokyo in the evening. Enough for synchronous decisions, never enough to require night shifts." },
        { q: "Where is Abbeal located?", a: "Abbeal runs three engineering hubs: Paris (Europe, headquarters), Montréal (North America) and Tokyo (Asia). Each hub has senior engineers on staff and a local legal entity. The European entity contracts in Paris, Abbeal KK contracts in Japan, and the Montréal hub serves North American and Québec-specific work (Law 25 compliance included)." },
        { q: "Can I hire a senior engineer in Tokyo who speaks English?", a: "Yes. Abbeal's Tokyo hub is staffed with bilingual senior engineers (Japanese and English) and operates as Abbeal KK, the Japanese legal entity that handles contracting and compliance. The working language with non-Japanese clients is English, and the team can act as the local engineering presence for a foreign company entering the Japanese market." },
        { q: "How does international mobility work for senior engineers at Abbeal?", a: "Through Mobbeal, the internal mobility program. Any Abbeal senior engineer can apply to move between the three hubs — Paris, Montréal or Tokyo — with Abbeal handling the visa, relocation and salary alignment for the destination market. More than 50 engineers have moved this way, and the program is a deliberate retention lever: senior engineers stay longer when they know they can change country every two to three years inside the same company." },
      ],
      ja: [
        { q: "アジア、欧州、北米にまたがるシニアエンジニアリングチームをどう構築するか？", a: "各地域にシニアエンジニアと法人をもつ現地ハブを運営し、そこからチームを構成することで。Abbeal はパリ（欧州）、モントリオール（北米）、東京（アジア）でハブを運営している。各ハブには氏名つきのシニアエンジニアがいて、1つの顧客チームを3つのタイムゾーンにまたがって編成できる。同期的な判断のための本当の重なりの時間帯があり、それ以外の時間はデフォルトで非同期だ。" },
        { q: "シニアエンジニアにとっての Toptal や Turing の代替は何か？", a: "Toptal、Turing、Arc.dev、We Work Remotely のようなフリーランスマーケットプレイスは、短期でスコープがはっきりした契約にはよく機能する。長期にわたるエンジニアリングチームの代替は、エンジニアが氏名つきで、正社員として採用され、顧客による面接で検証されるスタジオモデルだ。Abbeal はパリ、モントリオール、東京のハブを通じてこの方法で運営している — 匿名の単価表もマーケットプレイスの離職もない。" },
        { q: "Follow-the-sun エンジニアリングは実際にどう機能するか？", a: "本当の follow-the-sun には3つのものが必要だ：ハブ間の本当の重なりの時間帯（引き継ぎの投げ出しではなく）、デフォルトの非同期（decision logs、ADRs、書かれた仕様）、そして誰も午前3時に呼び出されないようなシフト中の本番サポート。Abbeal の3つのハブ — パリ、モントリオール、東京 — は、朝にパリ・モントリオール間で約3時間、夕方にモントリオール・東京間で約3時間の重なりを提供する。同期的な判断には十分で、夜勤を強いるほどではない。" },
        { q: "Abbeal はどこにあるか？", a: "Abbeal は3つのエンジニアリングハブを運営している：パリ（欧州、本社）、モントリオール（北米）、東京（アジア）。各ハブにはシニアエンジニアが在籍し、現地法人がある。欧州の法人はパリで契約し、Abbeal KK は日本で契約し、モントリオールのハブは北米とケベック特有の業務（法律25への準拠を含む）を担当する。" },
        { q: "英語を話す東京のシニアエンジニアを採用できるか？", a: "はい。Abbeal の東京ハブはバイリンガル（日本語と英語）のシニアエンジニアで構成され、契約とコンプライアンスを扱う日本法人 Abbeal KK として運営されている。非日本人クライアントとの作業言語は英語で、日本市場に参入する外国企業のための現地エンジニアリングプレゼンスとしてチームが機能できる。" },
        { q: "Abbeal でシニアエンジニアの国際モビリティはどう機能するか？", a: "社内モビリティプログラムである Mobbeal を通じて。Abbeal のシニアエンジニアは誰でも、3つのハブの間 — パリ、モントリオール、東京 — を移動するための申請ができ、Abbeal が目的地市場のビザ、引っ越し、給与調整を扱う。50人以上のエンジニアがこの方法で移動しており、このプログラムは意図的なリテンションのてこだ：シニアエンジニアは、同じ会社の中で2〜3年ごとに国を変えられることを知っているとき、より長く在籍する。" },
      ],
    },
    relatedCaseSlug: "retail-omnichannel-tri-geo",
    relatedServiceSlug: "squads-embarques",
    body: {
      fr: ARTICLE_BODIES["senior-engineering-team-asia-europe-north-america"]?.fr ?? [],
      en: ARTICLE_BODIES["senior-engineering-team-asia-europe-north-america"]?.en,
      ja: ARTICLE_BODIES["senior-engineering-team-asia-europe-north-america"]?.ja,
      "fr-ca": ARTICLE_BODIES["senior-engineering-team-asia-europe-north-america"]?.["fr-ca"],
    },
  },
  // Article 28 — Stephane Robin (Senior Engineer Montreal) : Fable comme suite
  // de Mythos. 2e article guest de Stephane, byline auteur en tete du body,
  // publication post-annonce coupure Fable/Mythos par Dept of Commerce.
  // Inclut callout intro "Mise a jour 12 juin" + section "Mise a jour
  // critique" detaillant le retournement gouvernemental. Backlink interne
  // vers l'article Mythos precedent assure par le contexte editorial du
  // body. Body FR uniquement static : auto-translate via hook Payload prendra
  // le relais une fois pushe en CMS (autres locales fallback FR via pick()).
  {
    slug: "fable-ia-equipe-remediation-stephane-robin",
    featured: false,
    tag: "AI",
    readTime: "8 min",
    publishedAt: "2026-06-16",
    title: {
      fr: "Fable : quand l'IA devient votre équipe de remédiation.",
      en: "Fable: when AI becomes your remediation team.",
      ja: "Fable：AIがあなたの修復チームになるとき。",
      "fr-ca": "Fable : quand l'IA devient votre équipe de remédiation.",
    },
    excerpt: {
      fr: "Stéphane Robin (Senior Engineer Abbeal Montréal) décrypte Claude Fable 5 d'Anthropic : génération de correctifs CVE en minutes, comportement « relentlessly proactive », et retournement gouvernemental du 12 juin qui a coupé l'accès au modèle.",
      en: "Stéphane Robin (Senior Engineer Abbeal Montréal) breaks down Anthropic's Claude Fable 5: CVE patch generation in minutes, « relentlessly proactive » behavior, and the June 12 government directive that cut access to the model.",
      ja: "ステファン・ロビン（Abbealモントリオールシニアエンジニア）がAnthropicのClaude Fable 5を解説：数分でのCVEパッチ生成、「relentlessly proactive」な挙動、そしてモデルへのアクセスを遮断した6月12日の政府指令。",
      "fr-ca": "Stéphane Robin (Senior Engineer Abbeal Montréal) décrypte Claude Fable 5 d'Anthropic : génération de correctifs CVE en minutes, comportement « relentlessly proactive », et retournement gouvernemental du 12 juin qui a coupé l'accès au modèle.",
    },
    metaDescription: {
      fr: "Claude Fable 5 d'Anthropic : génération automatique de correctifs CVE, intégration CI/CD, comportement agentique. Retour terrain Abbeal Montréal + analyse de la coupure d'accès par le Department of Commerce.",
      en: "Anthropic's Claude Fable 5: automatic CVE patch generation, CI/CD integration, agentic behavior. Field report from Abbeal Montréal + analysis of the Department of Commerce access cut.",
      ja: "AnthropicのClaude Fable 5：CVEパッチの自動生成、CI/CD統合、エージェント的挙動。Abbealモントリオール現場レポート + 商務省によるアクセス遮断の分析。",
      "fr-ca": "Claude Fable 5 d'Anthropic : génération automatique de correctifs CVE, intégration CI/CD, comportement agentique. Retour terrain Abbeal Montréal + analyse de la coupure d'accès par le Department of Commerce.",
    },
    keywords: {
      fr: "Claude Fable 5, Anthropic remédiation CVE, génération automatique patch sécurité, AI DevSecOps, agentic code generation, relentlessly proactive AI, workflow remédiation automatisée, CVE pipeline CI/CD, Anthropic Department of Commerce, jailbreak Fable Mythos, résilience pipeline IA, diversification providers IA, AI gouvernance réglementaire, Simon Willison Fable",
      en: "Claude Fable 5, Anthropic CVE remediation, automatic security patch generation, AI DevSecOps, agentic code generation, relentlessly proactive AI, automated remediation workflow, CVE CI/CD pipeline, Anthropic Department of Commerce, Fable Mythos jailbreak, AI pipeline resilience, AI provider diversification, AI regulatory governance, Simon Willison Fable",
      ja: "Claude Fable 5, Anthropic CVE 修復, セキュリティパッチ自動生成, AI DevSecOps, エージェント的コード生成, relentlessly proactive AI, 自動修復ワークフロー, CVE CI/CD パイプライン, Anthropic 商務省, Fable Mythos ジェイルブレイク, AI パイプライン回復力, AI プロバイダー多様化",
    },
    faq: {
      fr: [
        { q: "Qu'est-ce que Claude Fable 5 d'Anthropic ?", a: "Le modèle de génération de code d'Anthropic conçu pour opérer dans des workflows d'ingénierie autonomes. Il génère des correctifs CVE ciblés, comprend les dépendances multi-fichiers, s'intègre via API dans les pipelines CI/CD et produit les tests unitaires associés. Annoncé en juin 2026, son accès a été coupé le 12 juin 2026 par directive du Department of Commerce américain." },
        { q: "Que signifie « relentlessly proactive » pour Fable ?", a: "Caractéristique mise en avant par Simon Willison : Fable compose ses propres outils de diagnostic (HTML temporaires, scripts Python), change dynamiquement de stratégie quand une piste échoue (Playwright, inspection DOM), modifie temporairement l'application pour créer des points d'observation, et maintient l'objectif jusqu'au correctif validé. C'est un comportement d'agent autonome, pas de simple suggestion." },
        { q: "Pourquoi Anthropic a coupé l'accès à Fable 5 et Mythos 5 ?", a: "Le 12 juin 2026, le Department of Commerce américain a émis une directive formelle invoquant un jailbreak permettant à Fable 5 de détecter des failles logicielles. Anthropic a obtempéré mais conteste publiquement la légitimité du motif, indiquant que des concurrents (GPT-5.5) ont des capacités similaires et qu'appliqué à l'industrie, ce standard « stopperait tous les déploiements de modèles frontier »." },
        { q: "Comment se protéger d'une coupure d'accès gouvernementale à un modèle IA ?", a: "Architecture provider-agnostic obligatoire : interface d'abstraction de modèle (provider pattern) qui permet de basculer entre Anthropic, OpenAI, Google, modèles open-source self-hosted. Diversification des providers IA = décision d'architecture, pas un luxe. SLA contractuels qui intègrent le risque de retrait administratif. Capacités d'agent (composition d'outils, stratégies dynamiques) reproductibles sur d'autres modèles capables d'agentic reasoning." },
        { q: "Quels SLA de remédiation CVE viser avec un workflow Fable ?", a: "La fenêtre d'exposition, qui se mesure en semaines sur les workflows manuels, se comprime à quelques heures sur des CVE bien caractérisées avec un workflow intégrant Fable. Le SLA n'est plus une contrainte de capacité, il devient une décision de priorité — la limite devient le temps de validation humaine (15-30 min par diff), pas le temps de développement." },
      ],
      en: [
        { q: "What is Anthropic's Claude Fable 5?", a: "Anthropic's code generation model designed to operate in autonomous engineering workflows. It generates targeted CVE patches, understands multi-file dependencies, integrates via API into CI/CD pipelines, and produces the associated unit tests. Announced in June 2026, its access was cut on June 12, 2026 by a US Department of Commerce directive." },
        { q: "What does « relentlessly proactive » mean for Fable?", a: "Characteristic highlighted by Simon Willison: Fable composes its own diagnostic tools (temporary HTML, Python scripts), dynamically changes strategy when a lead fails (Playwright, DOM inspection), temporarily modifies the application to create observation points, and maintains the objective until the patch is validated. It's autonomous agent behavior, not mere suggestion." },
        { q: "Why did Anthropic cut access to Fable 5 and Mythos 5?", a: "On June 12, 2026, the US Department of Commerce issued a formal directive citing a jailbreak that allowed Fable 5 to detect software vulnerabilities. Anthropic complied but publicly contests the legitimacy of the rationale, noting that competitors (GPT-5.5) have similar capabilities and that, applied to the industry, this standard « would essentially stop all frontier model deployments »." },
        { q: "How to protect against a government access cut to an AI model?", a: "Provider-agnostic architecture is mandatory: model abstraction interface (provider pattern) that allows switching between Anthropic, OpenAI, Google, and self-hosted open-source models. AI provider diversification = architecture decision, not a luxury. Contractual SLAs that factor in the administrative retraction risk. Agent capabilities (tool composition, dynamic strategies) reproducible on other models capable of agentic reasoning." },
        { q: "What CVE remediation SLAs should you target with a Fable workflow?", a: "The exposure window, measured in weeks on manual workflows, compresses to a few hours on well-characterized CVEs with a Fable-integrated workflow. The SLA is no longer a capacity constraint, it becomes a priority decision — the limit becomes human validation time (15-30 min per diff), not development time." },
      ],
    },
    relatedCaseSlug: "fintech-iso27001-devsecops",
    relatedServiceSlug: "delivery-cle-en-main",
    body: {
      fr: ARTICLE_BODIES["fable-ia-equipe-remediation-stephane-robin"]?.fr ?? [],
      en: ARTICLE_BODIES["fable-ia-equipe-remediation-stephane-robin"]?.en,
      ja: ARTICLE_BODIES["fable-ia-equipe-remediation-stephane-robin"]?.ja,
      "fr-ca": ARTICLE_BODIES["fable-ia-equipe-remediation-stephane-robin"]?.["fr-ca"],
    },
  },
  // Article 29 — Testing JavaScript (Kent C. Dodds), retour Alex Lim. 3e
  // article guest d'Alex apres CSS for JS Devs et Kwik Reading. Notes Notion
  // d'Alex restructurees en review article. EN canonique + traductions
  // FR/JA/FR-CA. Pattern identique aux precedents articles Alex.
  {
    slug: "testing-javascript-kent-c-dodds-retour-alex-lim",
    featured: false,
    tag: "Learning",
    readTime: "5 min",
    publishedAt: "2026-06-22",
    title: {
      fr: "Testing JavaScript de Kent C. Dodds : un retour honnête",
      en: "Testing JavaScript by Kent C. Dodds: An Honest Review",
      ja: "Kent C. Doddsの Testing JavaScript — 率直なレビュー",
      "fr-ca": "Testing JavaScript de Kent C. Dodds : un retour honnête",
    },
    excerpt: {
      fr: "Le senior engineer Alexandre Lim passe en revue Testing JavaScript de Kent C. Dodds — le cours qui apprend à tester une app JavaScript via le Testing Trophy. Du modèle mental aux patterns concrets, du E2E à React Testing Library, avec une histoire vraie de prise de lead testing chez un client en hyper-croissance.",
      en: "Senior engineer Alexandre Lim reviews Kent C. Dodds' Testing JavaScript — the course that teaches how to test a JavaScript app using the Testing Trophy. From mental model to concrete patterns, from E2E to React Testing Library, with a real story of leading testing adoption at a fast-growth client.",
      ja: "シニアエンジニアのAlexandre Limが、Kent C. DoddsのTesting JavaScriptをレビュー。Testing Trophyを使ってJavaScriptアプリをテストする方法を教えるコース。メンタルモデルから具体的なパターンまで、E2EからReact Testing Libraryまで、急成長クライアントでテスティング導入をリードした実話とともに。",
      "fr-ca": "Le senior engineer Alexandre Lim passe en revue Testing JavaScript de Kent C. Dodds — le cours qui apprend à tester une app JavaScript via le Testing Trophy. Du modèle mental aux patterns concrets, du E2E à React Testing Library, avec une histoire vraie de prise de lead testing chez un client en hyper-croissance.",
    },
    metaDescription: {
      fr: "Retour honnête du senior engineer Alexandre Lim sur le cours Testing JavaScript de Kent C. Dodds : Testing Trophy, React Testing Library, migration depuis Enzyme, et expérience terrain en environnement frontend fast-growth.",
      en: "Honest review by senior engineer Alexandre Lim of Kent C. Dodds' Testing JavaScript course: Testing Trophy method, React Testing Library, migrating from Enzyme, and field experience in a fast-growth frontend environment.",
      ja: "シニアエンジニアAlexandre LimによるKent C. DoddsのTesting JavaScriptコースの率直なレビュー：Testing Trophyの手法、React Testing Library、Enzymeからの移行、急成長フロントエンド環境での実地経験。",
      "fr-ca": "Retour honnête du senior engineer Alexandre Lim sur le cours Testing JavaScript de Kent C. Dodds : Testing Trophy, React Testing Library, migration depuis Enzyme, et expérience terrain en environnement frontend fast-growth.",
    },
    keywords: {
      fr: "Testing JavaScript, Kent C. Dodds, React Testing Library, Testing Trophy, testing frontend, Enzyme migration, tests unitaires React, tests d'intégration, E2E vs unit tests, software craftsmanship, test-driven development",
      en: "Testing JavaScript, Kent C. Dodds, React Testing Library, Testing Trophy, frontend testing, Enzyme migration, React unit tests, integration tests, E2E vs unit tests, software craftsmanship, test-driven development",
      ja: "Testing JavaScript, Kent C. Dodds, React Testing Library, Testing Trophy, フロントエンドテスティング, Enzyme 移行, React ユニットテスト, 統合テスト, E2E vs ユニットテスト, ソフトウェアクラフトマンシップ, テスト駆動開発",
    },
    faq: {
      fr: [
        { q: "Qu'est-ce que le cours Testing JavaScript de Kent C. Dodds ?", a: "Un cours en ligne en huit modules qui enseigne le testing JavaScript via la méthode du Testing Trophy : unit, integration, E2E, statique. Kent C. Dodds, l'auteur de React Testing Library, structure tout autour de patterns concrets utilisables directement en production." },
        { q: "C'est quoi le Testing Trophy ?", a: "Une heuristique proposée par Kent C. Dodds pour répartir l'effort de testing : beaucoup d'analyse statique (TypeScript, ESLint), beaucoup de tests d'intégration (qui donnent le meilleur ROI), moins de tests unitaires, et très peu de E2E (lents, fragiles). Inversion du classique Testing Pyramid de Mike Cohn." },
        { q: "Faut-il migrer d'Enzyme vers React Testing Library ?", a: "Oui, c'est le consensus actuel de la communauté React. RTL teste depuis le point de vue utilisateur (DOM rendu, interactions), pas les implementation details des composants. Plus robuste aux refactors, et c'est ce que Kent C. Dodds enseigne dans Testing JavaScript." },
        { q: "Le cours vaut-il l'investissement ?", a: "Pour quiconque écrit du JavaScript en production, oui. Le ROI est immédiat dès la première régression évitée. Particulièrement précieux si tu veux passer d'une approche test ad-hoc à une vraie stratégie de testing d'équipe." },
      ],
      en: [
        { q: "What is Kent C. Dodds' Testing JavaScript course?", a: "An online course in eight modules that teaches JavaScript testing through the Testing Trophy method: unit, integration, E2E, and static. Kent C. Dodds — author of React Testing Library — structures everything around concrete patterns you can use directly in production." },
        { q: "What is the Testing Trophy?", a: "A heuristic by Kent C. Dodds for distributing testing effort: a lot of static analysis (TypeScript, ESLint), a lot of integration tests (best ROI), fewer unit tests, and very few E2E tests (slow, brittle). An inversion of Mike Cohn's classic Testing Pyramid." },
        { q: "Should you migrate from Enzyme to React Testing Library?", a: "Yes — that's the current React community consensus. RTL tests from the user's perspective (rendered DOM, interactions), not the implementation details of components. More robust to refactors, and it's what Kent C. Dodds teaches in Testing JavaScript." },
        { q: "Is the course worth the investment?", a: "For anyone writing JavaScript in production, yes. The ROI is immediate the first time it prevents a regression. Especially valuable if you want to move from ad-hoc testing to a real team testing strategy." },
      ],
    },
    relatedServiceSlug: "squads-embarques",
    body: {
      fr: ARTICLE_BODIES["testing-javascript-kent-c-dodds-retour-alex-lim"]?.fr ?? [],
      en: ARTICLE_BODIES["testing-javascript-kent-c-dodds-retour-alex-lim"]?.en,
      ja: ARTICLE_BODIES["testing-javascript-kent-c-dodds-retour-alex-lim"]?.ja,
      "fr-ca": ARTICLE_BODIES["testing-javascript-kent-c-dodds-retour-alex-lim"]?.["fr-ca"],
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
