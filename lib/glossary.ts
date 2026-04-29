/**
 * Glossaire technique Abbeal — 50+ termes que les CTOs / VPs / ingés
 * cherchent en réalité. Chaque entrée = une mini-page SEO + une entrée
 * structurée DefinedTerm/DefinedTermSet pour LLMs.
 *
 * Tri-lingue FR / EN / JA. `term`, `short`, `definition` sont des objets
 * `{ fr, en, ja }`. Les noms techniques restent en anglais dans les 3
 * langues ; en JA, on ajoute la lecture katakana quand pertinent.
 */

export type Locale = "fr" | "en" | "ja";

export type I18nString = {
  fr: string;
  en: string;
  ja: string;
};

export type GlossaryCategory =
  | "IA"
  | "Infrastructure"
  | "Engineering"
  | "Data"
  | "Robotique"
  | "Méthodes"
  | "Sécurité"
  | "Business";

export type GlossaryEntry = {
  slug: string;
  term: I18nString;
  short: I18nString; // 1 phrase
  definition: I18nString; // 2-4 phrases
  category: GlossaryCategory;
  relatedTerms?: string[]; // slugs
};

export const CATEGORY_I18N: Record<GlossaryCategory, I18nString> = {
  IA: { fr: "IA", en: "AI", ja: "AI" },
  Infrastructure: {
    fr: "Infrastructure",
    en: "Infrastructure",
    ja: "インフラ",
  },
  Engineering: {
    fr: "Engineering",
    en: "Engineering",
    ja: "エンジニアリング",
  },
  Data: { fr: "Data", en: "Data", ja: "データ" },
  Robotique: { fr: "Robotique", en: "Robotics", ja: "ロボティクス" },
  Méthodes: { fr: "Méthodes", en: "Methods", ja: "手法" },
  Sécurité: { fr: "Sécurité", en: "Security", ja: "セキュリティ" },
  Business: { fr: "Business", en: "Business", ja: "ビジネス" },
};

export const glossary: GlossaryEntry[] = [
  // === IA ===
  {
    slug: "rag",
    term: {
      fr: "RAG (Retrieval-Augmented Generation)",
      en: "RAG (Retrieval-Augmented Generation)",
      ja: "RAG（Retrieval-Augmented Generation）",
    },
    short: {
      fr: "Architecture IA qui combine recherche documentaire et génération LLM.",
      en: "AI architecture that combines document retrieval with LLM generation.",
      ja: "ドキュメント検索とLLM生成を組み合わせるAIアーキテクチャです。",
    },
    definition: {
      fr: "Plutôt que d'entraîner un LLM sur ses données, on lui fournit à chaque requête un contexte récupéré via recherche (BM25, vector DB, hybride). Avantage : factualité ancrée, mise à jour en temps réel, pas de fine-tuning coûteux. Pièges : qualité de l'indexation, latence retrieval, hallucinations sur contexte bruité.",
      en: "Instead of training an LLM on your data, you feed it context retrieved on each query via search (BM25, vector DB, hybrid). Upside: grounded factuality, real-time updates, no expensive fine-tuning. Gotchas: indexing quality, retrieval latency, hallucinations on noisy context.",
      ja: "LLMを自社データで学習させる代わりに、クエリごとに検索（BM25、ベクトルDB、ハイブリッド）で取得したコンテキストを渡します。メリットは事実性の担保、リアルタイム更新、高コストなファインチューニング不要の3点です。落とし穴はインデックス品質、リトリーバルのレイテンシ、ノイズの多いコンテキストでのハルシネーションです。",
    },
    category: "IA",
    relatedTerms: ["vector-db", "embedding", "llm", "fine-tuning"],
  },
  {
    slug: "llm",
    term: {
      fr: "LLM (Large Language Model)",
      en: "LLM (Large Language Model)",
      ja: "LLM（Large Language Model）",
    },
    short: {
      fr: "Modèle de langage à grande échelle, entraîné sur du texte massif.",
      en: "Large-scale language model trained on massive text corpora.",
      ja: "大規模なテキストで学習された大規模言語モデルです。",
    },
    definition: {
      fr: "GPT-5, Claude Sonnet 4.7, Mistral Large, Gemini, Llama. Produit du texte cohérent en complétant un prompt. Forces : génération libre, raisonnement simple. Faiblesses : hallucinations factuelles, coût d'inférence, biais d'entraînement, connaissance figée à la date de cutoff.",
      en: "GPT-5, Claude Sonnet 4.7, Mistral Large, Gemini, Llama. Produces coherent text by completing a prompt. Strengths: open-ended generation, simple reasoning. Weaknesses: factual hallucinations, inference cost, training bias, knowledge frozen at cutoff date.",
      ja: "GPT-5、Claude Sonnet 4.7、Mistral Large、Gemini、Llamaなどが該当します。プロンプトを補完して一貫性あるテキストを生成します。強みは自由なテキスト生成と単純な推論です。弱みはハルシネーション、推論コスト、学習データのバイアス、カットオフ日時点で知識が固定される点です。",
    },
    category: "IA",
    relatedTerms: ["rag", "fine-tuning", "inference", "token"],
  },
  {
    slug: "agent-multi-tools",
    term: {
      fr: "Agent IA (multi-tools)",
      en: "AI agent (multi-tool)",
      ja: "AIエージェント（マルチツール）",
    },
    short: {
      fr: "LLM orchestrant des outils (API, base de données, code execution) pour accomplir une tâche.",
      en: "An LLM orchestrating tools (APIs, databases, code execution) to complete a task.",
      ja: "API、データベース、コード実行などのツールをLLMがオーケストレーションしてタスクを遂行します。",
    },
    definition: {
      fr: "Le LLM décide dynamiquement quel outil appeler via tool calling / function calling. Utile pour tâches bornées (résumé+action, extraction+écriture DB). Piège : fiable sur chemins courts, flaky sur workflows longs sans évaluations et fallbacks. À verrouiller avec observabilité (traces LangSmith, Helicone).",
      en: "The LLM dynamically decides which tool to call via tool calling / function calling. Useful for bounded tasks (summarize+act, extract+write to DB). Gotcha: reliable on short paths, flaky on long workflows without evals and fallbacks. Lock it down with observability (LangSmith, Helicone traces).",
      ja: "LLMがツールコーリング／ファンクションコーリングで呼び出すツールを動的に決定します。要約＋アクション、抽出＋DB書き込みなど、範囲が明確なタスクに向いています。短い処理では信頼できますが、評価とフォールバックがない長いワークフローでは不安定になります。LangSmithやHeliconeなどのトレースによる可観測性で担保してください。",
    },
    category: "IA",
    relatedTerms: ["llm", "tool-calling", "eval"],
  },
  {
    slug: "embedding",
    term: {
      fr: "Embedding",
      en: "Embedding",
      ja: "エンベディング（Embedding）",
    },
    short: {
      fr: "Représentation vectorielle d'un texte ou d'un média.",
      en: "Vector representation of a piece of text or media.",
      ja: "テキストやメディアのベクトル表現です。",
    },
    definition: {
      fr: "Vecteur dense (768-3072 dimensions) produit par un modèle (OpenAI text-embedding-3, Cohere, Voyage). Utilisé pour mesurer la similarité sémantique (cosine) entre documents dans une vector DB. Base de la retrieval dans un RAG.",
      en: "A dense vector (768-3072 dimensions) produced by a model (OpenAI text-embedding-3, Cohere, Voyage). Used to measure semantic similarity (cosine) between documents in a vector DB. Foundation of retrieval in a RAG pipeline.",
      ja: "OpenAIのtext-embedding-3、Cohere、Voyageなどのモデルが生成する768〜3072次元の密ベクトルです。ベクトルDB内のドキュメント間の意味的類似度（コサイン類似度）の測定に使われます。RAGにおけるリトリーバルの基盤です。",
    },
    category: "IA",
    relatedTerms: ["rag", "vector-db"],
  },
  {
    slug: "vector-db",
    term: {
      fr: "Vector DB",
      en: "Vector DB",
      ja: "ベクトルDB（Vector DB）",
    },
    short: {
      fr: "Base de données optimisée pour requêtes vectorielles ANN.",
      en: "Database optimized for ANN vector queries.",
      ja: "ANN（近似最近傍）ベクトル検索に最適化されたデータベースです。",
    },
    definition: {
      fr: "Qdrant, Pinecone, Weaviate, pgvector, Elasticsearch avec HNSW. Stocke des embeddings et répond en ms à un 'top-k nearest neighbors'. Critères de choix : latence, coût storage, filters métadonnées, réplication multi-région.",
      en: "Qdrant, Pinecone, Weaviate, pgvector, Elasticsearch with HNSW. Stores embeddings and answers top-k nearest neighbors queries in milliseconds. Selection criteria: latency, storage cost, metadata filters, multi-region replication.",
      ja: "Qdrant、Pinecone、Weaviate、pgvector、HNSW付きElasticsearchなどがあります。エンベディングを保存し、top-k最近傍検索にミリ秒で応答します。選定基準はレイテンシ、ストレージコスト、メタデータフィルタ、マルチリージョンレプリケーションです。",
    },
    category: "IA",
    relatedTerms: ["embedding", "rag"],
  },
  {
    slug: "fine-tuning",
    term: {
      fr: "Fine-tuning",
      en: "Fine-tuning",
      ja: "ファインチューニング（Fine-tuning）",
    },
    short: {
      fr: "Continuer l'entraînement d'un LLM sur un jeu de données spécifique.",
      en: "Continuing training of an LLM on a specific dataset.",
      ja: "特定のデータセットでLLMの学習を継続することです。",
    },
    definition: {
      fr: "LoRA, full fine-tuning, RLHF, DPO. Utile pour style, format de sortie ou domaine très spécifique (code juridique, medical). Coût : GPU + dataset labellisé + évaluation. Souvent, un bon RAG + prompting fait le travail sans fine-tuning.",
      en: "LoRA, full fine-tuning, RLHF, DPO. Useful for style, output format, or highly specific domains (legal code, medical). Cost: GPUs + labeled dataset + evaluation. Often, a solid RAG + prompting gets the job done without fine-tuning.",
      ja: "LoRA、フルファインチューニング、RLHF、DPOなどがあります。スタイル、出力フォーマット、または法律コードや医療など非常に特殊なドメインに有効です。コストはGPU、ラベル付きデータセット、評価の3点です。多くの場合、しっかりしたRAG＋プロンプティングでファインチューニングなしに対応できます。",
    },
    category: "IA",
    relatedTerms: ["llm", "rag", "eval"],
  },
  {
    slug: "eval",
    term: {
      fr: "Eval (évaluation LLM)",
      en: "Eval (LLM evaluation)",
      ja: "Eval（LLM評価）",
    },
    short: {
      fr: "Jeu de tests automatisés pour mesurer la qualité d'un LLM.",
      en: "Automated test suite measuring the quality of an LLM.",
      ja: "LLMの品質を測定するための自動テストスイートです。",
    },
    definition: {
      fr: "Comme les tests unitaires, mais pour des sorties de LLM. Promptfoo, LangSmith, Braintrust, Lilypad. Dataset de cas (input → output attendu) + critères (exact match, LLM-as-judge, embedding sim). Essentiel avant chaque déploiement prod.",
      en: "Like unit tests, but for LLM outputs. Promptfoo, LangSmith, Braintrust, Lilypad. A dataset of cases (input → expected output) plus criteria (exact match, LLM-as-judge, embedding similarity). Essential before any production deployment.",
      ja: "ユニットテストのLLM出力版です。Promptfoo、LangSmith、Braintrust、Lilypadなどがあります。入力と期待される出力のケースデータセットに、完全一致、LLM-as-judge、エンベディング類似度などの評価基準を組み合わせます。本番デプロイ前に不可欠です。",
    },
    category: "IA",
    relatedTerms: ["llm", "agent-multi-tools"],
  },
  {
    slug: "inference",
    term: {
      fr: "Inference",
      en: "Inference",
      ja: "推論（Inference）",
    },
    short: {
      fr: "Exécution d'un modèle IA à la demande (par opposition au training).",
      en: "Running an AI model on demand (as opposed to training).",
      ja: "学習ではなく、必要に応じてAIモデルを実行することです。",
    },
    definition: {
      fr: "Coût principal en prod pour un LLM : chaque requête consomme des GPU-secondes. Levers d'optim : prompt caching, batching, quantization, model routing (Claude Haiku pour requêtes simples, Sonnet pour complexes), vLLM self-hosted.",
      en: "The dominant production cost for an LLM: every request burns GPU-seconds. Optimization levers: prompt caching, batching, quantization, model routing (Claude Haiku for simple queries, Sonnet for complex ones), self-hosted vLLM.",
      ja: "LLMの本番環境における主要コストで、リクエストごとにGPU秒を消費します。最適化手段はプロンプトキャッシング、バッチング、量子化、モデルルーティング（簡単なクエリはClaude Haiku、複雑なものはSonnet）、セルフホストのvLLMなどです。",
    },
    category: "IA",
    relatedTerms: ["llm", "token"],
  },
  {
    slug: "token",
    term: {
      fr: "Token",
      en: "Token",
      ja: "トークン（Token）",
    },
    short: {
      fr: "Unité de découpage d'un texte pour un LLM (~0.75 mot en EN).",
      en: "Text chunking unit for an LLM (~0.75 word in English).",
      ja: "LLMがテキストを分割する単位で、英語では約0.75単語に相当します。",
    },
    definition: {
      fr: "Les LLMs facturent à l'input + output tokens. Exemple : 1K tokens GPT-4 = ~750 mots EN = $0.003 à $0.06 selon le modèle. Contexte max : 128K (GPT-4) à 2M (Gemini 1.5). Toujours mesurer avant de scaler.",
      en: "LLMs bill on input + output tokens. Example: 1K GPT-4 tokens = ~750 English words = $0.003 to $0.06 depending on the model. Max context: 128K (GPT-4) to 2M (Gemini 1.5). Always measure before scaling.",
      ja: "LLMは入力トークンと出力トークンに対して課金します。例えばGPT-4の1Kトークンは英語で約750単語に相当し、モデルにより0.003〜0.06ドルです。最大コンテキストは128K（GPT-4）から2M（Gemini 1.5）まで。スケールさせる前に必ず計測してください。",
    },
    category: "IA",
    relatedTerms: ["llm", "inference"],
  },
  {
    slug: "hallucination",
    term: {
      fr: "Hallucination",
      en: "Hallucination",
      ja: "ハルシネーション（Hallucination）",
    },
    short: {
      fr: "Le LLM génère un contenu plausible mais factuellement faux.",
      en: "The LLM produces content that sounds plausible but is factually wrong.",
      ja: "LLMがもっともらしいが事実と異なる内容を生成することです。",
    },
    definition: {
      fr: "Peut être partiel (mauvais chiffre, fausse date) ou total (invention d'API, de jurisprudence). Mitigation : RAG ancré, instructions strictes, évals ciblées, confidence thresholding. Jamais 100% éliminable sur un LLM probabiliste.",
      en: "Can be partial (wrong number, wrong date) or total (invented API, fictional case law). Mitigation: grounded RAG, strict instructions, targeted evals, confidence thresholding. Never 100% eliminable on a probabilistic LLM.",
      ja: "数値や日付の誤りなど部分的なもの、APIや判例の捏造など全面的なものがあります。対策はRAGによる根拠付け、厳密な指示、的を絞った評価、信頼度閾値の設定です。確率的なLLMでは100%排除することはできません。",
    },
    category: "IA",
    relatedTerms: ["llm", "rag", "eval"],
  },

  // === Infrastructure ===
  {
    slug: "kubernetes",
    term: {
      fr: "Kubernetes",
      en: "Kubernetes",
      ja: "Kubernetes（クーバネティス）",
    },
    short: {
      fr: "Orchestrateur open-source de containers pour déploiements scalables.",
      en: "Open-source container orchestrator for scalable deployments.",
      ja: "スケーラブルなデプロイを実現するオープンソースのコンテナオーケストレーターです。",
    },
    definition: {
      fr: "Standard de fait. Ressources : Pod, Deployment, Service, Ingress. Complexité importante — à considérer avec ROI (équipe < 10 devs, souvent overkill). Managed : EKS (AWS), GKE (GCP), AKS (Azure). Cost optimization : Karpenter, KEDA, VPA.",
      en: "De facto standard. Resources: Pod, Deployment, Service, Ingress. Significant complexity — weigh the ROI (teams under 10 devs, usually overkill). Managed options: EKS (AWS), GKE (GCP), AKS (Azure). Cost optimization: Karpenter, KEDA, VPA.",
      ja: "事実上の業界標準です。主要リソースはPod、Deployment、Service、Ingressです。複雑度が高く、ROIを見極める必要があります（10名未満の開発チームではオーバースペックになりがち）。マネージド版はEKS（AWS）、GKE（GCP）、AKS（Azure）です。コスト最適化にはKarpenter、KEDA、VPAを活用します。",
    },
    category: "Infrastructure",
    relatedTerms: ["karpenter", "container", "greenops"],
  },
  {
    slug: "karpenter",
    term: {
      fr: "Karpenter",
      en: "Karpenter",
      ja: "Karpenter（カーペンター）",
    },
    short: {
      fr: "Autoscaler de nœuds Kubernetes AWS-native, alternative à Cluster Autoscaler.",
      en: "AWS-native Kubernetes node autoscaler, alternative to Cluster Autoscaler.",
      ja: "AWSネイティブのKubernetesノードオートスケーラーで、Cluster Autoscalerの代替です。",
    },
    definition: {
      fr: "Provisionne les instances EC2 en fonction des pods en attente, sans pools d'instances pré-définis. Économies cloud typiques : 20-40%. Supporte spot, ARM64, multi-AZ. Open source depuis 2024 (CNCF incubating).",
      en: "Provisions EC2 instances based on pending pods, with no pre-defined instance pools. Typical cloud savings: 20-40%. Supports spot, ARM64, multi-AZ. Open source since 2024 (CNCF incubating).",
      ja: "待機中のPodに応じてEC2インスタンスをプロビジョニングし、事前定義されたインスタンスプールを必要としません。クラウドコスト削減効果は通常20〜40%です。スポット、ARM64、マルチAZに対応。2024年からオープンソース（CNCF Incubating）です。",
    },
    category: "Infrastructure",
    relatedTerms: ["kubernetes", "greenops"],
  },
  {
    slug: "greenops",
    term: {
      fr: "GreenOps / FinOps",
      en: "GreenOps / FinOps",
      ja: "GreenOps / FinOps",
    },
    short: {
      fr: "Pratiques de maîtrise du coût cloud (et par extension de l'empreinte carbone).",
      en: "Practices for controlling cloud costs (and by extension carbon footprint).",
      ja: "クラウドコスト（および副次的にカーボンフットプリント）を管理する実践手法です。",
    },
    definition: {
      fr: "Leviers classiques : rightsizing compute, Spot instances, ARM64, Karpenter, cache CDN, lifecycle S3, query optimization data warehouses. Abbeal obtient −30% en moyenne sur les factures cloud sans dégrader les SLOs.",
      en: "Classic levers: rightsizing compute, Spot instances, ARM64, Karpenter, CDN caching, S3 lifecycle, data warehouse query optimization. Abbeal delivers an average 30% cut on cloud bills without degrading SLOs.",
      ja: "典型的な手段はコンピュートのライトサイジング、Spotインスタンス、ARM64、Karpenter、CDNキャッシュ、S3のライフサイクル、データウェアハウスのクエリ最適化です。AbbealはSLOを損なうことなく、クラウド請求額を平均30%削減します。",
    },
    category: "Infrastructure",
    relatedTerms: ["kubernetes", "karpenter", "slo"],
  },
  {
    slug: "opentofu",
    term: {
      fr: "OpenTofu",
      en: "OpenTofu",
      ja: "OpenTofu",
    },
    short: {
      fr: "Fork communautaire open-source de Terraform, compatible API.",
      en: "Community-driven open-source fork of Terraform, API-compatible.",
      ja: "TerraformのコミュニティオープンソースフォークでAPI互換です。",
    },
    definition: {
      fr: "Créé après le passage de Terraform en licence BSL en août 2023. Piloté par la Linux Foundation. Compatibilité drop-in avec providers Terraform. Abbeal migre systématiquement ses nouveaux projets.",
      en: "Created after Terraform switched to the BSL license in August 2023. Stewarded by the Linux Foundation. Drop-in compatible with Terraform providers. Abbeal systematically migrates new projects to it.",
      ja: "2023年8月のTerraformのBSLライセンス移行を受けて誕生しました。Linux Foundationが運営しています。Terraformプロバイダとドロップイン互換です。Abbealは新規プロジェクトを体系的にOpenTofuへ移行しています。",
    },
    category: "Infrastructure",
    relatedTerms: ["terraform", "iac"],
  },
  {
    slug: "terraform",
    term: {
      fr: "Terraform",
      en: "Terraform",
      ja: "Terraform",
    },
    short: {
      fr: "Outil Infrastructure as Code d'HashiCorp pour provisionner du cloud.",
      en: "HashiCorp's Infrastructure as Code tool for provisioning cloud resources.",
      ja: "クラウドリソースをプロビジョニングするHashiCorpのInfrastructure as Codeツールです。",
    },
    definition: {
      fr: "Syntaxe HCL, providers pour 200+ services. Point de vigilance : state file (à stocker distant, locké), modules (factorisation), drift detection. Alternative : OpenTofu (licence open), Pulumi (TypeScript/Python).",
      en: "HCL syntax, providers for 200+ services. Watch out for: state file (store it remote and locked), modules (factorization), drift detection. Alternatives: OpenTofu (open license), Pulumi (TypeScript/Python).",
      ja: "HCL構文を使用し、200以上のサービス向けプロバイダがあります。注意点はステートファイル（リモート保存かつロック）、モジュール（共通化）、ドリフト検出です。代替としてOpenTofu（オープンライセンス）やPulumi（TypeScript/Python）があります。",
    },
    category: "Infrastructure",
    relatedTerms: ["opentofu", "iac"],
  },
  {
    slug: "iac",
    term: {
      fr: "IaC (Infrastructure as Code)",
      en: "IaC (Infrastructure as Code)",
      ja: "IaC（Infrastructure as Code）",
    },
    short: {
      fr: "Déclarer son infrastructure dans du code versionné (Git).",
      en: "Declaring your infrastructure as version-controlled code (Git).",
      ja: "インフラをバージョン管理されたコード（Git）として宣言する手法です。",
    },
    definition: {
      fr: "Outils : Terraform, OpenTofu, Pulumi, CloudFormation, CDK. Avantages : reproductibilité, review en PR, rollback, drift detection. Pattern GitOps : infra répond à commits Git via CI/CD.",
      en: "Tools: Terraform, OpenTofu, Pulumi, CloudFormation, CDK. Upsides: reproducibility, PR reviews, rollback, drift detection. GitOps pattern: infrastructure reacts to Git commits via CI/CD.",
      ja: "主要ツールはTerraform、OpenTofu、Pulumi、CloudFormation、CDKです。メリットは再現性、PRレビュー、ロールバック、ドリフト検出です。GitOpsパターンでは、CI/CD経由でGitコミットに応じてインフラが変化します。",
    },
    category: "Infrastructure",
    relatedTerms: ["terraform", "opentofu"],
  },
  {
    slug: "container",
    term: {
      fr: "Container",
      en: "Container",
      ja: "コンテナ（Container）",
    },
    short: {
      fr: "Unité d'exécution isolée packageant code + runtime + dépendances.",
      en: "Isolated execution unit packaging code + runtime + dependencies.",
      ja: "コード、ランタイム、依存関係をパッケージ化する独立した実行単位です。",
    },
    definition: {
      fr: "Docker, containerd, runc. Image build → registry → run. Base des architectures modernes (Kubernetes, Cloud Run, Fargate). Piège : image bloat (alpine > debian-slim), runtime de base (distroless pour sécurité).",
      en: "Docker, containerd, runc. Image build → registry → run. Foundation of modern architectures (Kubernetes, Cloud Run, Fargate). Gotcha: image bloat (alpine > debian-slim), base runtime (distroless for security).",
      ja: "Docker、containerd、runcなどがあります。イメージビルド→レジストリ→実行というフローです。Kubernetes、Cloud Run、Fargateなどモダンアーキテクチャの基盤です。注意点はイメージ肥大化（alpine＞debian-slim）とベースランタイム（セキュリティ向上にdistrolessを推奨）です。",
    },
    category: "Infrastructure",
    relatedTerms: ["kubernetes"],
  },
  {
    slug: "edge",
    term: {
      fr: "Edge computing",
      en: "Edge computing",
      ja: "エッジコンピューティング（Edge computing）",
    },
    short: {
      fr: "Exécution de code proche de l'utilisateur (CDN extend).",
      en: "Running code close to the user (a CDN extension).",
      ja: "ユーザーに近い場所でコードを実行することです（CDNの拡張）。",
    },
    definition: {
      fr: "Vercel Edge Functions, Cloudflare Workers, AWS Lambda@Edge. Latences < 50ms partout dans le monde. Limite : runtime restreint (V8 isolate, pas Node complet), stateless. Bon pour routing, personnalisation, auth, rewrites.",
      en: "Vercel Edge Functions, Cloudflare Workers, AWS Lambda@Edge. Under 50ms latency anywhere in the world. Limits: restricted runtime (V8 isolate, not full Node), stateless. Good fit for routing, personalization, auth, rewrites.",
      ja: "Vercel Edge Functions、Cloudflare Workers、AWS Lambda@Edgeなどがあります。世界中どこでもレイテンシ50ms未満を実現します。制約はランタイムが限定的（V8アイソレートでフルのNodeではない）でステートレスな点です。ルーティング、パーソナライズ、認証、リライト用途に適しています。",
    },
    category: "Infrastructure",
    relatedTerms: ["serverless", "cdn"],
  },
  {
    slug: "serverless",
    term: {
      fr: "Serverless",
      en: "Serverless",
      ja: "サーバーレス（Serverless）",
    },
    short: {
      fr: "Exécution à la demande sans gestion de serveurs (FaaS ou managed).",
      en: "On-demand execution with no server management (FaaS or managed).",
      ja: "サーバー管理不要でオンデマンドに実行する形態（FaaSまたはマネージド）です。",
    },
    definition: {
      fr: "AWS Lambda, Google Cloud Functions, Vercel Functions, Cloudflare Workers. Facturation à la ms + mémoire. Parfait pour charges variables, cron jobs, webhooks. Limites : cold starts, timeout, stateless.",
      en: "AWS Lambda, Google Cloud Functions, Vercel Functions, Cloudflare Workers. Billed per millisecond + memory. Perfect for variable workloads, cron jobs, webhooks. Limits: cold starts, timeouts, stateless.",
      ja: "AWS Lambda、Google Cloud Functions、Vercel Functions、Cloudflare Workersなどがあります。課金はミリ秒単位＋メモリです。可変ワークロード、cronジョブ、Webhookに最適です。制約はコールドスタート、タイムアウト、ステートレス設計です。",
    },
    category: "Infrastructure",
    relatedTerms: ["edge", "container"],
  },
  {
    slug: "cdn",
    term: {
      fr: "CDN (Content Delivery Network)",
      en: "CDN (Content Delivery Network)",
      ja: "CDN（Content Delivery Network）",
    },
    short: {
      fr: "Réseau de caches distribués géographiquement pour servir les assets.",
      en: "Geographically distributed cache network that serves assets.",
      ja: "アセット配信のために地理的に分散されたキャッシュネットワークです。",
    },
    definition: {
      fr: "Cloudflare, Fastly, Vercel, AWS CloudFront. Cache HTML (SSG, ISR), images, JS, CSS. Impact typique : −60% latence LCP sur un site dynamique. À combiner avec image optimization (WebP, AVIF) et font subsetting.",
      en: "Cloudflare, Fastly, Vercel, AWS CloudFront. Caches HTML (SSG, ISR), images, JS, CSS. Typical impact: −60% LCP latency on a dynamic site. Combine with image optimization (WebP, AVIF) and font subsetting.",
      ja: "Cloudflare、Fastly、Vercel、AWS CloudFrontなどがあります。HTML（SSG、ISR）、画像、JS、CSSをキャッシュします。動的サイトで典型的にはLCPレイテンシが60%削減されます。画像最適化（WebP、AVIF）とフォントサブセットと組み合わせるのが効果的です。",
    },
    category: "Infrastructure",
    relatedTerms: ["edge"],
  },

  // === Engineering ===
  {
    slug: "slo",
    term: {
      fr: "SLO (Service Level Objective)",
      en: "SLO (Service Level Objective)",
      ja: "SLO（Service Level Objective）",
    },
    short: {
      fr: "Objectif chiffré de qualité de service (latence, disponibilité, erreurs).",
      en: "Quantified service quality target (latency, availability, errors).",
      ja: "レイテンシ、可用性、エラー率などのサービス品質に関する数値目標です。",
    },
    definition: {
      fr: "Exemples : 99,9% availability, latence p95 < 200ms, erreur rate < 0.1%. Error budget = 100% − SLO. Framework Google SRE. Permet de trancher 'on ship ou on stabilise' sur un critère objectif.",
      en: "Examples: 99.9% availability, p95 latency < 200ms, error rate < 0.1%. Error budget = 100% − SLO. Google SRE framework. Lets you decide 'ship or stabilize' on an objective criterion.",
      ja: "例として可用性99.9%、p95レイテンシ200ms未満、エラー率0.1%未満などがあります。エラーバジェットは100%−SLOで算出します。Google SREのフレームワークです。「リリースするか安定化に回すか」を客観的基準で判断できます。",
    },
    category: "Engineering",
    relatedTerms: ["sli", "slam", "observability"],
  },
  {
    slug: "sli",
    term: {
      fr: "SLI (Service Level Indicator)",
      en: "SLI (Service Level Indicator)",
      ja: "SLI（Service Level Indicator）",
    },
    short: {
      fr: "Métrique brute qui alimente un SLO (latence, uptime, succès requête).",
      en: "Raw metric feeding an SLO (latency, uptime, request success).",
      ja: "SLOを算出する元となる生メトリクス（レイテンシ、稼働率、リクエスト成功率など）です。",
    },
    definition: {
      fr: "Exemples : % requêtes sous 200ms, % minutes où /api est up. À collecter depuis la prod (traces, logs, probes). Outils : Prometheus, Datadog, New Relic, OpenTelemetry.",
      en: "Examples: % of requests under 200ms, % of minutes /api is up. Collect from production (traces, logs, probes). Tools: Prometheus, Datadog, New Relic, OpenTelemetry.",
      ja: "例として200ms以下のリクエスト比率、/apiが稼働している分の比率などがあります。本番環境から収集します（トレース、ログ、プローブ）。ツールはPrometheus、Datadog、New Relic、OpenTelemetryなどです。",
    },
    category: "Engineering",
    relatedTerms: ["slo", "observability"],
  },
  {
    slug: "slam",
    term: {
      fr: "SLA (Service Level Agreement)",
      en: "SLA (Service Level Agreement)",
      ja: "SLA（Service Level Agreement）",
    },
    short: {
      fr: "Engagement contractuel lié à un SLO, avec pénalités si non tenu.",
      en: "Contractual commitment tied to an SLO, with penalties if missed.",
      ja: "SLOに紐づく契約上のコミットメントで、未達時はペナルティが発生します。",
    },
    definition: {
      fr: "Forme publique et contractuelle d'un SLO. Exemple : 99,9% uptime → 30 min downtime/mois max. Si dépassé : crédit, remboursement. Rare en B2C, fréquent en B2B SaaS et cloud.",
      en: "The public, contractual form of an SLO. Example: 99.9% uptime → max 30 min downtime/month. If breached: credits or refunds. Rare in B2C, common in B2B SaaS and cloud.",
      ja: "SLOを公開・契約化したものです。例えば稼働率99.9%なら、月間ダウンタイムは最大30分です。違反時はクレジットや返金が発生します。B2Cでは稀で、B2B SaaSやクラウドでは一般的です。",
    },
    category: "Engineering",
    relatedTerms: ["slo", "sli"],
  },
  {
    slug: "observability",
    term: {
      fr: "Observabilité",
      en: "Observability",
      ja: "オブザーバビリティ（Observability）",
    },
    short: {
      fr: "Capacité à comprendre ce qui se passe en prod sans déployer du code.",
      en: "Ability to understand what's happening in production without shipping code.",
      ja: "コードをデプロイせずに本番で起きていることを把握する能力です。",
    },
    definition: {
      fr: "Trois piliers : metrics (temporelles, Prometheus), logs (Elasticsearch, Grafana Loki), traces (OpenTelemetry, Tempo, Jaeger). À compléter par profiling (Pyroscope) et synthetic monitoring.",
      en: "Three pillars: metrics (time series, Prometheus), logs (Elasticsearch, Grafana Loki), traces (OpenTelemetry, Tempo, Jaeger). Round it out with profiling (Pyroscope) and synthetic monitoring.",
      ja: "3本柱はメトリクス（時系列、Prometheus）、ログ（Elasticsearch、Grafana Loki）、トレース（OpenTelemetry、Tempo、Jaeger）です。プロファイリング（Pyroscope）や合成モニタリングで補完します。",
    },
    category: "Engineering",
    relatedTerms: ["slo", "sli", "opentelemetry"],
  },
  {
    slug: "opentelemetry",
    term: {
      fr: "OpenTelemetry (OTel)",
      en: "OpenTelemetry (OTel)",
      ja: "OpenTelemetry（OTel）",
    },
    short: {
      fr: "Standard CNCF unifié pour traces, metrics et logs.",
      en: "Unified CNCF standard for traces, metrics, and logs.",
      ja: "トレース、メトリクス、ログを統合するCNCFの標準規格です。",
    },
    definition: {
      fr: "SDKs dans tous les langages. Remplace progressivement les agents propriétaires (Datadog, New Relic). Collector central → backend de ton choix. Chez Abbeal : standard pour tous les nouveaux services.",
      en: "SDKs across all major languages. Gradually replacing proprietary agents (Datadog, New Relic). Central collector → backend of your choice. At Abbeal: the default for every new service.",
      ja: "主要言語すべてでSDKが提供されています。Datadog、New Relicなどの独自エージェントを段階的に置き換えています。中央コレクター経由で任意のバックエンドに送信できます。Abbealでは新規サービスすべてで標準採用しています。",
    },
    category: "Engineering",
    relatedTerms: ["observability"],
  },
  {
    slug: "canary",
    term: {
      fr: "Canary deployment",
      en: "Canary deployment",
      ja: "カナリアデプロイ（Canary deployment）",
    },
    short: {
      fr: "Rollout progressif d'une nouvelle version à un petit % de trafic.",
      en: "Progressive rollout of a new version to a small percentage of traffic.",
      ja: "新バージョンをトラフィックの一部に段階的にロールアウトする手法です。",
    },
    definition: {
      fr: "Détecte les régressions avant qu'elles touchent 100% des users. 1% → 10% → 50% → 100% sur 1h-1j. Couplé à métriques (erreur rate, latence, custom KPI). Outils : Argo Rollouts, Flagger, Istio, Vercel Rolling Releases.",
      en: "Catches regressions before they hit 100% of users. 1% → 10% → 50% → 100% over 1h to 1 day. Paired with metrics (error rate, latency, custom KPIs). Tools: Argo Rollouts, Flagger, Istio, Vercel Rolling Releases.",
      ja: "全ユーザーに影響する前にリグレッションを検出します。1%→10%→50%→100%と1時間〜1日かけて拡大します。エラー率、レイテンシ、カスタムKPIなどのメトリクスと組み合わせて使います。ツールはArgo Rollouts、Flagger、Istio、Vercel Rolling Releasesなどです。",
    },
    category: "Engineering",
    relatedTerms: ["ci-cd", "feature-flag"],
  },
  {
    slug: "feature-flag",
    term: {
      fr: "Feature flag",
      en: "Feature flag",
      ja: "フィーチャーフラグ（Feature flag）",
    },
    short: {
      fr: "Activer/désactiver une feature dynamiquement sans redéployer.",
      en: "Enable or disable a feature dynamically without redeploying.",
      ja: "再デプロイせずに機能を動的に有効化・無効化する仕組みです。",
    },
    definition: {
      fr: "LaunchDarkly, Flagsmith, Unleash, GrowthBook, Vercel Edge Config. Cas d'usage : A/B test, rollout progressif, kill switch, customisation par segment. Attention à la dette : supprimer les flags après stabilisation.",
      en: "LaunchDarkly, Flagsmith, Unleash, GrowthBook, Vercel Edge Config. Use cases: A/B testing, progressive rollout, kill switch, segment-based customization. Watch the debt: remove flags once stabilized.",
      ja: "LaunchDarkly、Flagsmith、Unleash、GrowthBook、Vercel Edge Configなどがあります。ユースケースはA/Bテスト、段階的ロールアウト、キルスイッチ、セグメント別カスタマイズです。負債になるため、安定後はフラグを削除してください。",
    },
    category: "Engineering",
    relatedTerms: ["canary"],
  },
  {
    slug: "ci-cd",
    term: {
      fr: "CI/CD",
      en: "CI/CD",
      ja: "CI/CD",
    },
    short: {
      fr: "Continuous Integration / Continuous Delivery ou Deployment.",
      en: "Continuous Integration / Continuous Delivery or Deployment.",
      ja: "Continuous Integration / Continuous DeliveryまたはDeploymentの略です。",
    },
    definition: {
      fr: "Pipeline automatisé : commit → tests → build → staging → prod. Outils : GitHub Actions, GitLab CI, CircleCI, Buildkite. Bonnes pratiques : tests rapides (< 10 min), rollback en 1-clic, déploiement plusieurs fois par jour.",
      en: "Automated pipeline: commit → tests → build → staging → prod. Tools: GitHub Actions, GitLab CI, CircleCI, Buildkite. Best practices: fast tests (< 10 min), one-click rollback, multiple deploys per day.",
      ja: "コミット→テスト→ビルド→ステージング→本番の自動化パイプラインです。ツールはGitHub Actions、GitLab CI、CircleCI、Buildkiteなどです。ベストプラクティスは10分以内の高速テスト、ワンクリックロールバック、1日複数回デプロイです。",
    },
    category: "Engineering",
    relatedTerms: ["canary", "dora"],
  },
  {
    slug: "dora",
    term: {
      fr: "DORA metrics",
      en: "DORA metrics",
      ja: "DORAメトリクス（DORA metrics）",
    },
    short: {
      fr: "4 métriques de performance d'une équipe d'ingénierie (Google SRE).",
      en: "Four engineering team performance metrics (Google SRE).",
      ja: "エンジニアリングチームのパフォーマンスを測る4つのメトリクス（Google SRE発）です。",
    },
    definition: {
      fr: "Deployment frequency, Lead time for changes, Change failure rate, Mean time to restore. Classes : Low / Medium / High / Elite. Source : DORA annual report (Accelerate). Indicateur bien plus pertinent que lines of code ou story points.",
      en: "Deployment frequency, Lead time for changes, Change failure rate, Mean time to restore. Tiers: Low / Medium / High / Elite. Source: DORA annual report (Accelerate). Far more meaningful than lines of code or story points.",
      ja: "デプロイ頻度、変更のリードタイム、変更失敗率、平均復旧時間の4つです。ランクはLow／Medium／High／Eliteです。出典はDORA年次レポート（書籍『Accelerate』）です。コード行数やストーリーポイントよりはるかに有意義な指標です。",
    },
    category: "Engineering",
    relatedTerms: ["ci-cd"],
  },
  {
    slug: "runbook",
    term: {
      fr: "Runbook",
      en: "Runbook",
      ja: "ランブック（Runbook）",
    },
    short: {
      fr: "Documentation opérationnelle pour gérer un incident prod ou une tâche récurrente.",
      en: "Operational documentation for handling a production incident or recurring task.",
      ja: "本番インシデント対応や定期タスクのための運用ドキュメントです。",
    },
    definition: {
      fr: "Step-by-step, commandes exactes, check-lists. Objectif : n'importe qui d'astreinte peut l'exécuter. Formats : Markdown en Git, Notion, Confluence. Liée aux SLOs et à l'observability.",
      en: "Step-by-step, exact commands, checklists. Goal: anyone on call can execute it. Formats: Markdown in Git, Notion, Confluence. Tied to SLOs and observability.",
      ja: "手順、厳密なコマンド、チェックリストで構成します。目標はオンコール担当なら誰でも実行できることです。フォーマットはGit上のMarkdown、Notion、Confluenceなどです。SLOやオブザーバビリティと連動させます。",
    },
    category: "Engineering",
    relatedTerms: ["observability", "slo"],
  },
  {
    slug: "rust",
    term: {
      fr: "Rust",
      en: "Rust",
      ja: "Rust（ラスト）",
    },
    short: {
      fr: "Langage systèmes avec garanties mémoire sans garbage collector.",
      en: "Systems language with memory guarantees and no garbage collector.",
      ja: "ガベージコレクタなしでメモリ安全性を保証するシステムプログラミング言語です。",
    },
    definition: {
      fr: "Ownership model, zero-cost abstractions, Cargo ecosystem mature. Use cases : systèmes critiques, performance-sensitive, robotique, blockchain. Courbe d'apprentissage 6-12 mois pour un senior. Chez Abbeal : Adopt.",
      en: "Ownership model, zero-cost abstractions, mature Cargo ecosystem. Use cases: critical systems, performance-sensitive workloads, robotics, blockchain. Learning curve: 6-12 months for a senior. At Abbeal: Adopt.",
      ja: "所有権モデル、ゼロコスト抽象化、成熟したCargoエコシステムが特徴です。ユースケースは重要システム、性能重視ワークロード、ロボティクス、ブロックチェーンなどです。シニアエンジニアで習得に6〜12ヶ月かかります。AbbealのTech Radarでは「Adopt」です。",
    },
    category: "Engineering",
    relatedTerms: ["ros2"],
  },

  // === Data ===
  {
    slug: "lakehouse",
    term: {
      fr: "Lakehouse",
      en: "Lakehouse",
      ja: "レイクハウス（Lakehouse）",
    },
    short: {
      fr: "Architecture data mixant data lake (flexibilité) et data warehouse (performance).",
      en: "Data architecture blending data lake (flexibility) and data warehouse (performance).",
      ja: "データレイク（柔軟性）とデータウェアハウス（性能）を融合したデータアーキテクチャです。",
    },
    definition: {
      fr: "Delta Lake, Iceberg, Hudi comme format table. Databricks, Snowflake, Microsoft Fabric. Avantages : single source of truth, ACID sur fichiers, versioning, governance unifiée.",
      en: "Delta Lake, Iceberg, Hudi as table formats. Databricks, Snowflake, Microsoft Fabric. Upsides: single source of truth, ACID on files, versioning, unified governance.",
      ja: "テーブルフォーマットとしてDelta Lake、Iceberg、Hudiがあります。Databricks、Snowflake、Microsoft Fabricなどのプラットフォームで利用されます。メリットはシングルソースオブトゥルース、ファイルへのACID、バージョニング、統一されたガバナンスです。",
    },
    category: "Data",
    relatedTerms: ["dbt", "unity-catalog"],
  },
  {
    slug: "dbt",
    term: {
      fr: "dbt (data build tool)",
      en: "dbt (data build tool)",
      ja: "dbt（data build tool）",
    },
    short: {
      fr: "Orchestrateur de transformations SQL dans un data warehouse.",
      en: "Orchestrator for SQL transformations inside a data warehouse.",
      ja: "データウェアハウス内のSQL変換をオーケストレーションするツールです。",
    },
    definition: {
      fr: "Écrit en SQL + Jinja, versioned Git, tests unitaires, documentation auto. Remplace ETL traditionnel (Informatica, Talend) pour transformations post-ingestion. dbt Core open-source, dbt Cloud payant.",
      en: "Written in SQL + Jinja, Git-versioned, unit tests, auto-generated documentation. Replaces traditional ETL (Informatica, Talend) for post-ingestion transformations. dbt Core is open-source, dbt Cloud is paid.",
      ja: "SQL＋Jinjaで記述し、Gitでバージョン管理、ユニットテスト、ドキュメント自動生成に対応します。インジェスト後の変換でInformaticaやTalendなど従来のETLを置き換えます。dbt Coreはオープンソース、dbt Cloudは有償です。",
    },
    category: "Data",
    relatedTerms: ["lakehouse"],
  },
  {
    slug: "unity-catalog",
    term: {
      fr: "Unity Catalog",
      en: "Unity Catalog",
      ja: "Unity Catalog",
    },
    short: {
      fr: "Gouvernance centralisée de données chez Databricks (et équivalents).",
      en: "Centralized data governance from Databricks (and equivalents).",
      ja: "Databricks（および同等製品）の集中型データガバナンス基盤です。",
    },
    definition: {
      fr: "Gère les permissions, lineage, metadata sur tables, files, ML models. Open-sourced en 2024. Alternative : Apache Polaris (Snowflake), AWS Lake Formation.",
      en: "Handles permissions, lineage, and metadata for tables, files, and ML models. Open-sourced in 2024. Alternatives: Apache Polaris (Snowflake), AWS Lake Formation.",
      ja: "テーブル、ファイル、MLモデルの権限、リネージ、メタデータを管理します。2024年にオープンソース化されました。代替はApache Polaris（Snowflake）、AWS Lake Formationなどです。",
    },
    category: "Data",
    relatedTerms: ["lakehouse"],
  },
  {
    slug: "mach",
    term: {
      fr: "MACH architecture",
      en: "MACH architecture",
      ja: "MACHアーキテクチャ（MACH architecture）",
    },
    short: {
      fr: "Microservices, API-first, Cloud-native, Headless — composable commerce.",
      en: "Microservices, API-first, Cloud-native, Headless — composable commerce.",
      ja: "Microservices、API-first、Cloud-native、Headless──コンポーザブルコマースの設計思想です。",
    },
    definition: {
      fr: "Pattern pour e-commerce et CMS modernes. commercetools, Contentful, Algolia, Stripe, Klaviyo. Avantages : time-to-market court, flexibilité, best-of-breed. Piège : complexité d'intégration.",
      en: "Pattern for modern e-commerce and CMS. commercetools, Contentful, Algolia, Stripe, Klaviyo. Upsides: short time-to-market, flexibility, best-of-breed stack. Gotcha: integration complexity.",
      ja: "モダンなeコマースとCMSの設計パターンです。commercetools、Contentful、Algolia、Stripe、Klaviyoなどが該当します。メリットは短いタイム・トゥ・マーケット、柔軟性、ベスト・オブ・ブリードです。落とし穴は統合の複雑さです。",
    },
    category: "Data",
    relatedTerms: ["microservices"],
  },

  // === Robotique ===
  {
    slug: "ros2",
    term: {
      fr: "ROS 2 (Robot Operating System)",
      en: "ROS 2 (Robot Operating System)",
      ja: "ROS 2（Robot Operating System）",
    },
    short: {
      fr: "Framework open-source standard pour robotique moderne.",
      en: "Standard open-source framework for modern robotics.",
      ja: "モダンロボティクスの標準オープンソースフレームワークです。",
    },
    definition: {
      fr: "Évolution de ROS 1. DDS (Data Distribution Service) comme transport, real-time, multi-robot native. Packages clés : Nav2 (navigation), MoveIt (manipulation), rclcpp, rclpy. Standard de fait industriel depuis 2022.",
      en: "Successor to ROS 1. DDS (Data Distribution Service) as transport, real-time, native multi-robot. Key packages: Nav2 (navigation), MoveIt (manipulation), rclcpp, rclpy. De facto industry standard since 2022.",
      ja: "ROS 1の後継です。トランスポートにDDS（Data Distribution Service）を採用し、リアルタイム対応、マルチロボットをネイティブサポートします。主要パッケージはNav2（ナビゲーション）、MoveIt（マニピュレーション）、rclcpp、rclpyです。2022年以降、事実上の業界標準となっています。",
    },
    category: "Robotique",
    relatedTerms: ["nav2", "isaac-sim", "rust"],
  },
  {
    slug: "nav2",
    term: {
      fr: "Nav2 (Navigation2)",
      en: "Nav2 (Navigation2)",
      ja: "Nav2（Navigation2）",
    },
    short: {
      fr: "Stack de navigation autonome pour ROS 2 : planification + contrôle.",
      en: "Autonomous navigation stack for ROS 2: planning + control.",
      ja: "ROS 2向け自律ナビゲーションスタックで、計画と制御を担います。",
    },
    definition: {
      fr: "Behavior Trees, planners (NavFn, Smac), controllers (DWB, MPPI), perception (LiDAR fusion, depth). Production-ready pour AMR et robots mobiles. Alternative : NVIDIA Isaac ROS.",
      en: "Behavior Trees, planners (NavFn, Smac), controllers (DWB, MPPI), perception (LiDAR fusion, depth). Production-ready for AMRs and mobile robots. Alternative: NVIDIA Isaac ROS.",
      ja: "ビヘイビアツリー、プランナー（NavFn、Smac）、コントローラ（DWB、MPPI）、パーセプション（LiDARフュージョン、デプス）で構成されます。AMRやモバイルロボットで本番運用できる品質です。代替はNVIDIA Isaac ROSです。",
    },
    category: "Robotique",
    relatedTerms: ["ros2"],
  },
  {
    slug: "isaac-sim",
    term: {
      fr: "Isaac Sim (NVIDIA)",
      en: "Isaac Sim (NVIDIA)",
      ja: "Isaac Sim（NVIDIA）",
    },
    short: {
      fr: "Simulateur photoréaliste pour robotique basé sur Omniverse.",
      en: "Photorealistic robotics simulator built on Omniverse.",
      ja: "Omniverseベースのフォトリアリスティックなロボティクスシミュレータです。",
    },
    definition: {
      fr: "Physique (PhysX), rendering RTX, domain randomization. Use cases : training RL, synthetic data, digital twin, validation sans hardware. Alternative open : Gazebo, Webots.",
      en: "Physics (PhysX), RTX rendering, domain randomization. Use cases: RL training, synthetic data, digital twin, hardware-free validation. Open-source alternatives: Gazebo, Webots.",
      ja: "物理エンジンはPhysX、レンダリングはRTX、ドメインランダマイゼーションに対応します。ユースケースは強化学習の学習、合成データ生成、デジタルツイン、ハードウェアなしの検証です。オープンソースの代替はGazebo、Webotsです。",
    },
    category: "Robotique",
    relatedTerms: ["ros2", "nav2"],
  },

  // === Méthodes ===
  {
    slug: "follow-the-sun",
    term: {
      fr: "Follow-the-Sun delivery",
      en: "Follow-the-Sun delivery",
      ja: "Follow-the-Sunデリバリー",
    },
    short: {
      fr: "Modèle d'équipes réparties dans 3+ fuseaux pour un delivery 24/7.",
      en: "Team model spread across 3+ time zones for 24/7 delivery.",
      ja: "3つ以上のタイムゾーンにチームを配置し、24時間体制でデリバリーするモデルです。",
    },
    definition: {
      fr: "3 hubs synchrones (ex : Paris, Montréal, Tokyo), handoff chaque 8h avec standup async (Slack, Loom). Avantages : lead time divisé par 2-3, astreintes partagées. Pièges : qualité de handoff, décision centralisée.",
      en: "Three synchronous hubs (e.g. Paris, Montréal, Tokyo), 8-hour handoffs with async standup (Slack, Loom). Upsides: lead time cut 2-3x, shared on-call. Gotchas: handoff quality, centralized decision-making.",
      ja: "3つの同期拠点（例：パリ、モントリオール、東京）で、8時間ごとに引き継ぎを行い、非同期スタンドアップ（Slack、Loom）で繋ぎます。メリットはリードタイムが2〜3分の1に短縮され、オンコールを分担できることです。落とし穴は引き継ぎの品質と意思決定の集中です。",
    },
    category: "Méthodes",
    relatedTerms: ["staff-augmentation"],
  },
  {
    slug: "staff-augmentation",
    term: {
      fr: "Staff augmentation",
      en: "Staff augmentation",
      ja: "スタッフオーグメンテーション（Staff augmentation）",
    },
    short: {
      fr: "Modèle où des ingés externes rejoignent une équipe cliente avec ownership.",
      en: "Model where external engineers join a client team with real ownership.",
      ja: "外部エンジニアがオーナーシップを持ってクライアントチームに参画するモデルです。",
    },
    definition: {
      fr: "Différent d'un cabinet de conseil (livrables) ou d'un ESN pur (facturation jours). Les ingés prennent en main un périmètre complet (feature, service, plateforme). Chez Abbeal : exit checklist formalisée.",
      en: "Different from a consulting firm (deliverables) or a pure ESN (time & materials). Engineers own a full scope (feature, service, platform). At Abbeal: formalized exit checklist.",
      ja: "コンサルティングファーム（成果物契約）や純粋なESN（人月課金）とは異なります。エンジニアが機能、サービス、プラットフォームなど、完全なスコープを担当します。Abbealでは正式なexitチェックリストを用意しています。",
    },
    category: "Méthodes",
    relatedTerms: ["follow-the-sun"],
  },
  {
    slug: "bounded-context",
    term: {
      fr: "Bounded context",
      en: "Bounded context",
      ja: "バウンデッドコンテキスト（Bounded context）",
    },
    short: {
      fr: "Zone d'un système avec un modèle de données et un langage ubiquitaire.",
      en: "System zone with its own data model and ubiquitous language.",
      ja: "独自のデータモデルとユビキタス言語を持つシステム内の領域です。",
    },
    definition: {
      fr: "Concept clé de Domain-Driven Design (Evans 2003). Utilisé pour découper des monolithes en microservices, ou pour migrer du legacy (COBOL → Java) service par service. Alternative simple à 'big-bang rewrite' (qui échoue à 80%).",
      en: "Core concept of Domain-Driven Design (Evans, 2003). Used to split monoliths into microservices, or to migrate legacy (COBOL → Java) service by service. A saner alternative to a 'big-bang rewrite' (which fails 80% of the time).",
      ja: "Domain-Driven Design（Evans 2003）の中核概念です。モノリスをマイクロサービスに分割する際や、レガシー（COBOL→Java）をサービス単位で移行する際に使われます。「ビッグバンリライト」（80%が失敗）に代わる現実的な選択肢です。",
    },
    category: "Méthodes",
    relatedTerms: ["microservices"],
  },
  {
    slug: "microservices",
    term: {
      fr: "Microservices",
      en: "Microservices",
      ja: "マイクロサービス（Microservices）",
    },
    short: {
      fr: "Architecture découpant une application en services indépendants.",
      en: "Architecture splitting an application into independent services.",
      ja: "アプリケーションを独立したサービスに分割するアーキテクチャです。",
    },
    definition: {
      fr: "Chaque service a sa DB, son équipe, son cycle de deploy. Avantages : scale indépendant, poly-tech, résilience. Coût : complexité opérationnelle (observability, data consistency, network). Reco : commencer en monolithe modulaire, découper seulement si l'équipe dépasse 30 devs.",
      en: "Every service has its own DB, team, and deploy cycle. Upsides: independent scaling, polyglot tech, resilience. Cost: operational complexity (observability, data consistency, network). Recommendation: start with a modular monolith, split only once the team exceeds 30 devs.",
      ja: "各サービスが独自のDB、チーム、デプロイサイクルを持ちます。メリットは独立したスケーリング、多言語対応、レジリエンスです。コストは運用の複雑さ（可観測性、データ整合性、ネットワーク）です。推奨は、まずモジュラーモノリスで始め、チームが30名を超えてから分割することです。",
    },
    category: "Méthodes",
    relatedTerms: ["bounded-context", "kubernetes"],
  },

  // === Sécurité ===
  {
    slug: "iso-27001",
    term: {
      fr: "ISO 27001",
      en: "ISO 27001",
      ja: "ISO 27001",
    },
    short: {
      fr: "Norme internationale de management de la sécurité de l'information.",
      en: "International standard for information security management.",
      ja: "情報セキュリティマネジメントの国際規格です。",
    },
    definition: {
      fr: "Certification par audit externe, tous les 3 ans. 114 contrôles (Annex A) : politique sécurité, cryptographie, incident management, continuity, supplier relationship. Obligatoire pour vendre à de nombreuses entreprises, à la DGA, etc. Abbeal : certifié un client fintech en 9 mois.",
      en: "Certified via external audit every 3 years. 114 controls (Annex A): security policy, cryptography, incident management, continuity, supplier relationship. Mandatory to sell to many enterprises, to the French DGA, etc. Abbeal: certified a fintech client in 9 months.",
      ja: "3年ごとに外部監査で認証される仕組みです。附属書Aには114の管理策があり、セキュリティポリシー、暗号、インシデント管理、事業継続、サプライヤー関係などを網羅します。多くの企業やフランスDGAへの販売では必須です。Abbealはフィンテッククライアント1社を9ヶ月で認証取得させた実績があります。",
    },
    category: "Sécurité",
    relatedTerms: ["devsecops", "soc2"],
  },
  {
    slug: "soc2",
    term: {
      fr: "SOC 2",
      en: "SOC 2",
      ja: "SOC 2",
    },
    short: {
      fr: "Rapport d'audit américain sur les contrôles de sécurité d'un SaaS.",
      en: "US audit report on a SaaS provider's security controls.",
      ja: "米国発のSaaS事業者向けセキュリティ統制に関する監査レポートです。",
    },
    definition: {
      fr: "Type I (design) ou Type II (opérationnel sur 6-12 mois). 5 critères : Security (obligatoire), Availability, Processing Integrity, Confidentiality, Privacy. Indispensable pour vendre aux entreprises US.",
      en: "Type I (design) or Type II (operational over 6-12 months). Five criteria: Security (mandatory), Availability, Processing Integrity, Confidentiality, Privacy. Essential to sell to US enterprises.",
      ja: "Type I（設計）またはType II（6〜12ヶ月の運用状況）の2種類があります。5つの基準はSecurity（必須）、Availability、Processing Integrity、Confidentiality、Privacyです。米国企業への販売では必須です。",
    },
    category: "Sécurité",
    relatedTerms: ["iso-27001", "devsecops"],
  },
  {
    slug: "devsecops",
    term: {
      fr: "DevSecOps",
      en: "DevSecOps",
      ja: "DevSecOps",
    },
    short: {
      fr: "Intégration de la sécurité dans chaque étape CI/CD (shift-left).",
      en: "Security embedded in every CI/CD step (shift-left).",
      ja: "CI/CDの各段階にセキュリティを組み込む考え方（シフトレフト）です。",
    },
    definition: {
      fr: "SAST (Snyk, Semgrep), DAST, dependency scanning, IaC scanning (Checkov), secrets scanning (Gitleaks), container scanning (Trivy). Objectif : détecter en PR, pas en pentest final.",
      en: "SAST (Snyk, Semgrep), DAST, dependency scanning, IaC scanning (Checkov), secrets scanning (Gitleaks), container scanning (Trivy). Goal: catch issues in the PR, not in a final pentest.",
      ja: "SAST（Snyk、Semgrep）、DAST、依存関係スキャン、IaCスキャン（Checkov）、シークレットスキャン（Gitleaks）、コンテナスキャン（Trivy）などを組み合わせます。目標は最終ペンテストではなくPR段階で検知することです。",
    },
    category: "Sécurité",
    relatedTerms: ["iso-27001", "ci-cd"],
  },
  {
    slug: "secnumcloud",
    term: {
      fr: "SecNumCloud",
      en: "SecNumCloud",
      ja: "SecNumCloud",
    },
    short: {
      fr: "Référentiel de qualification ANSSI pour cloud souverain français.",
      en: "ANSSI qualification framework for sovereign French cloud.",
      ja: "ANSSI（フランス国家情報システムセキュリティ庁）によるソブリンクラウド認定フレームワークです。",
    },
    definition: {
      fr: "Obligatoire pour certaines données publiques (santé, défense, collectivités). Providers qualifiés : OVH, Outscale, Cloud Temple. Stricter que ISO 27001 sur souveraineté juridique (RGPD + Cloud Act).",
      en: "Mandatory for certain public data (health, defense, local government). Qualified providers: OVH, Outscale, Cloud Temple. Stricter than ISO 27001 on legal sovereignty (GDPR + Cloud Act).",
      ja: "医療、国防、自治体など一部の公共データでは必須です。認定プロバイダはOVH、Outscale、Cloud Templeです。法的主権（GDPR＋Cloud Act）の観点ではISO 27001より厳格です。",
    },
    category: "Sécurité",
    relatedTerms: ["appi"],
  },
  {
    slug: "appi",
    term: {
      fr: "APPI",
      en: "APPI",
      ja: "APPI（個人情報保護法）",
    },
    short: {
      fr: "Act on the Protection of Personal Information — loi Japonaise de protection des données.",
      en: "Act on the Protection of Personal Information — Japan's data protection law.",
      ja: "個人情報の保護に関する法律（Act on the Protection of Personal Information）、日本のデータ保護法です。",
    },
    definition: {
      fr: "Équivalent japonais du RGPD. Révisée 2022, stricter sur transferts internationaux. Obligations : PPC notification, DPO, data mapping. Impact pour les SaaS opérant au Japon ou traitant des données japonaises.",
      en: "Japanese equivalent of GDPR. Revised in 2022, stricter on international data transfers. Obligations: PPC notification, DPO, data mapping. Impacts SaaS operating in Japan or handling Japanese data.",
      ja: "日本版のGDPRに相当します。2022年に改正され、国外移転の規制が厳格化されました。義務事項は個人情報保護委員会（PPC）への通知、DPOの設置、データマッピングなどです。日本で事業を行うSaaSや日本のデータを扱うSaaSに影響します。",
    },
    category: "Sécurité",
    relatedTerms: ["secnumcloud", "rgpd"],
  },
  {
    slug: "rgpd",
    term: {
      fr: "RGPD / GDPR",
      en: "GDPR",
      ja: "GDPR（EU一般データ保護規則）",
    },
    short: {
      fr: "Règlement général européen sur la protection des données personnelles.",
      en: "EU General Data Protection Regulation.",
      ja: "EUの個人データ保護に関する一般規則です。",
    },
    definition: {
      fr: "En vigueur depuis 2018. Principes : consentement explicite, droits utilisateurs (accès, effacement, portabilité), DPO, data breach < 72h, DPIA. Amendes : jusqu'à 4% CA ou 20M€. Base de nombreuses réglementations dérivées.",
      en: "In force since 2018. Core principles: explicit consent, user rights (access, erasure, portability), DPO, data breach notification within 72h, DPIA. Fines: up to 4% of revenue or €20M. Blueprint for many derivative regulations.",
      ja: "2018年から施行されています。原則は明示的な同意、ユーザー権利（アクセス、削除、ポータビリティ）、DPO設置、72時間以内のデータ侵害通知、DPIAです。制裁金は売上の最大4%または2,000万ユーロです。多くの派生規制のベースとなっています。",
    },
    category: "Sécurité",
    relatedTerms: ["appi", "secnumcloud"],
  },

  // === Business ===
  {
    slug: "time-and-material",
    term: {
      fr: "Time & Material (T&M)",
      en: "Time & Material (T&M)",
      ja: "Time & Material（T&M）",
    },
    short: {
      fr: "Modèle de facturation au temps passé d'un ingénieur (jour-homme).",
      en: "Billing model based on engineer time spent (man-days).",
      ja: "エンジニアの稼働時間（人日）に基づく課金モデルです。",
    },
    definition: {
      fr: "Modèle dominant des ESN françaises. Avantage : flexibilité. Inconvénient : aligne les incentives sur le volume d'heures, pas sur le résultat. Abbeal refuse T&M par principe : on s'engage sur un output chiffré.",
      en: "Dominant model in French ESNs. Upside: flexibility. Downside: aligns incentives with hours billed, not outcomes. Abbeal refuses T&M as a matter of principle — we commit to a quantified output.",
      ja: "フランスのESN（SIer）で主流のモデルです。メリットは柔軟性です。デメリットは課金時間に対してインセンティブが働き、成果にはひも付かない点です。Abbealは原則としてT&Mを拒否し、数値化されたアウトプットにコミットします。",
    },
    category: "Business",
    relatedTerms: ["output-engagement"],
  },
  {
    slug: "output-engagement",
    term: {
      fr: "Engagement output / forfait outcome",
      en: "Output-based engagement / outcome fixed price",
      ja: "アウトプットコミット／アウトカム型固定価格契約",
    },
    short: {
      fr: "Modèle où on facture le résultat, pas les heures.",
      en: "Model where you bill the outcome, not the hours.",
      ja: "時間ではなく成果に対して課金するモデルです。",
    },
    definition: {
      fr: "Scope défini + acceptance criteria + budget fixe. Si on se trompe sur l'estimation, on assume. Aligne prestataire et client sur le livrable. Nécessite un cadrage rigoureux en amont.",
      en: "Defined scope + acceptance criteria + fixed budget. If we get the estimate wrong, we eat the cost. Aligns vendor and client on the deliverable. Requires rigorous upfront scoping.",
      ja: "明確なスコープ、受入基準、固定予算で構成します。見積もりを誤った場合はベンダー側が負担します。受託者とクライアントの関心を成果物に揃えるモデルです。事前の厳密なスコーピングが不可欠です。",
    },
    category: "Business",
    relatedTerms: ["time-and-material"],
  },
  {
    slug: "mobbeal",
    term: {
      fr: "Mobbeal",
      en: "Mobbeal",
      ja: "Mobbeal（モビール）",
    },
    short: {
      fr: "Programme Abbeal de mobilité internationale pour ingénieurs tech.",
      en: "Abbeal's international mobility program for tech engineers.",
      ja: "テックエンジニア向けのAbbealの国際モビリティプログラムです。",
    },
    definition: {
      fr: "Relocation complète Paris, Montréal ou Tokyo : visa, logement, famille, école, démarches admin. 50+ talents expatriés en 5 ans. Partenaires : JETRO (Japon), Montréal International, Business France, La French Tech.",
      en: "End-to-end relocation to Paris, Montréal, or Tokyo: visa, housing, family, schooling, admin. 50+ talents relocated over 5 years. Partners: JETRO (Japan), Montréal International, Business France, La French Tech.",
      ja: "パリ、モントリオール、東京へのフルリロケーションを提供します。ビザ、住居、家族、学校、行政手続きを一気通貫でサポートします。5年間で50名以上の人材を海外派遣しました。パートナーはJETRO（日本）、Montréal International、Business France、La French Techなどです。",
    },
    category: "Business",
    relatedTerms: ["staff-augmentation"],
  },
];

export function getGlossaryEntry(slug: string): GlossaryEntry | undefined {
  return glossary.find((g) => g.slug === slug);
}

export function getGlossaryByCategory(): Record<string, GlossaryEntry[]> {
  return glossary.reduce(
    (acc, entry) => {
      acc[entry.category] = acc[entry.category] ?? [];
      acc[entry.category].push(entry);
      return acc;
    },
    {} as Record<string, GlossaryEntry[]>,
  );
}

export function getRelatedGlossaryEntries(slug: string): GlossaryEntry[] {
  const entry = getGlossaryEntry(slug);
  if (!entry?.relatedTerms) return [];
  return entry.relatedTerms
    .map((s) => getGlossaryEntry(s))
    .filter((e): e is GlossaryEntry => !!e);
}

/**
 * Helpers i18n — utilisation dans les pages :
 *   const { term, short, definition } = localizeGlossaryEntry(entry, locale);
 *   const categoryLabel = CATEGORY_I18N[entry.category][locale];
 */
/**
 * Map any site Locale (including "fr-ca") to a glossary-supported one.
 * The glossary content is not yet francized OQLF — fr-ca falls back to fr.
 */
export function toGlossaryLocale(locale: string): Locale {
  if (locale === "fr-ca") return "fr";
  if (locale === "fr" || locale === "en" || locale === "ja") return locale;
  return "fr";
}

export function localizeGlossaryEntry(
  entry: GlossaryEntry,
  locale: string,
): { term: string; short: string; definition: string } {
  const l = toGlossaryLocale(locale);
  return {
    term: entry.term[l],
    short: entry.short[l],
    definition: entry.definition[l],
  };
}
