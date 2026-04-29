/**
 * Services détaillés — 3 façons de bosser avec Abbeal.
 * Pages enrichies : audience, méthode, livrables, KPIs, tech, FAQ, cases liés.
 */

import type { Locale } from "./i18n";

type Translatable<T> = { fr: T } & Partial<Record<Exclude<Locale, "fr">, T>>;

type FAQ = { q: string; a: string };

export type Service = {
  slug: string;
  number: string; // "01", "02", "03"
  duration: string; // "3 semaines à 12 mois"
  // Card label in the home Services section (English-ish)
  subtitle: Translatable<string>;
  title: Translatable<string>;
  hookline: Translatable<string>; // 1 sentence under title
  // Detail page content
  audience: Translatable<string[]>; // "Pour qui"
  concretes: Translatable<string[]>; // "Ce qu'on fait concrètement"
  method: Translatable<{ step: string; detail: string }[]>; // "Méthode"
  deliverables: Translatable<string[]>; // "Livrables"
  kpis: Translatable<{ value: string; label: string }[]>; // 3-4 promesses chiffrées
  techStack: string[]; // shared across locales
  relatedCaseSlugs: string[]; // 2-3 cases slugs
  faq: Translatable<FAQ[]>; // 4-5 Q&A
};

export const services: Service[] = [
  // 01 — Squads embarqués
  {
    slug: "squads-embarques",
    number: "01",
    duration: "3 mois à 2 ans",
    subtitle: {
      fr: "Staff Augmentation",
      en: "Staff Augmentation",
      ja: "スタッフ拡張",
    },
    title: {
      fr: "Squads embarqués",
      en: "Embedded squads",
      ja: "組み込みスクワッド",
    },
    hookline: {
      fr: "On rejoint vos équipes avec ownership de périmètre. Senior, intégré, responsable du résultat.",
      en: "We join your teams with scope ownership. Senior, integrated, accountable for outcome.",
      ja: "担当範囲のオーナーシップを持ってチームに参画。シニア、統合型、成果に責任を持つ。",
    },
    audience: {
      fr: [
        "CTO/VP Engineering qui ont besoin d'aller vite sans perdre la main",
        "Product teams qui manquent de senior sur un périmètre critique",
        "Équipes internes qui veulent monter en compétence en bossant à côté",
        "Scale-ups en hyper-croissance, grandes boîtes sur projet prioritaire",
      ],
      en: [
        "CTO/VP Engineering who need speed without losing control",
        "Product teams short on seniors for a critical scope",
        "Internal teams that want to level up by working side-by-side",
        "Hyper-growth scale-ups, large companies on priority projects",
      ],
      ja: [
        "コントロールを失わずに速さが必要なCTO/VPエンジニアリング",
        "重要領域でシニアが不足するプロダクトチーム",
        "並行して働きながらレベルアップしたい社内チーム",
        "急成長スケールアップ、優先プロジェクトの大企業",
      ],
    },
    concretes: {
      fr: [
        "Ownership d'un périmètre (feature, service, plateforme) — pas de billable hours absentes",
        "Revue de code, pairing, standups dans vos outils, votre process",
        "Architecture, implémentation, observabilité, runbook — de bout en bout",
        "Transfert de compétences formalisé : docs, sessions, mentoring",
        "Exit propre : tout est documenté, vos équipes gardent la main",
      ],
      en: [
        "Scope ownership (feature, service, platform) — no absent billable hours",
        "Code review, pairing, standups in your tools, your process",
        "Architecture, implementation, observability, runbook — end-to-end",
        "Formalized skill transfer: docs, sessions, mentoring",
        "Clean exit: everything documented, your teams stay in control",
      ],
      ja: [
        "担当範囲のオーナーシップ（機能、サービス、プラットフォーム）",
        "コードレビュー、ペアリング、スタンドアップを貴社のツールとプロセスで",
        "アーキテクチャ、実装、可観測性、runbook — エンドツーエンド",
        "形式化されたスキル移転：ドキュメント、セッション、メンタリング",
        "クリーンな退出：すべて文書化、チームが主導権を保持",
      ],
    },
    method: {
      fr: [
        {
          step: "Cadrage",
          detail:
            "Une semaine d'immersion. On comprend votre stack, vos SLOs, vos tensions. Sortie : périmètre, acceptance criteria, risques.",
        },
        {
          step: "Sizing",
          detail:
            "1 à 5 ingés par squad. On matche sur la stack et le domaine, pas sur le CV puzzle.",
        },
        {
          step: "Ramp-up",
          detail:
            "Premier PR mergé en semaine 2. Si on ne tient pas, on assume et on ajuste.",
        },
        {
          step: "Cadence",
          detail:
            "Review hebdo outcome, pas activité. KPIs visibles. Ajustement trimestriel.",
        },
        {
          step: "Transfert",
          detail:
            "Dès le jour 1. Pas de dépendance cachée. Exit checklist en fin d'engagement.",
        },
      ],
      en: [
        {
          step: "Scoping",
          detail:
            "One-week immersion. We understand your stack, your SLOs, your frictions. Output: scope, acceptance criteria, risks.",
        },
        {
          step: "Sizing",
          detail:
            "1 to 5 engineers per squad. Matched on stack and domain, not CV puzzle.",
        },
        {
          step: "Ramp-up",
          detail:
            "First PR merged in week 2. If we miss, we own it and adjust.",
        },
        {
          step: "Cadence",
          detail:
            "Weekly outcome review, not activity. Visible KPIs. Quarterly adjustment.",
        },
        {
          step: "Transfer",
          detail:
            "Day 1 priority. No hidden dependency. Exit checklist at end of engagement.",
        },
      ],
      ja: [
        {
          step: "スコーピング",
          detail:
            "1週間の没入。貴社のスタック、SLO、摩擦を理解する。成果物：スコープ、受入基準、リスク。",
        },
        {
          step: "サイジング",
          detail:
            "スクワッドあたり1-5人のエンジニア。CVパズルではなくスタックとドメインでマッチング。",
        },
        {
          step: "ランプアップ",
          detail:
            "第2週にファーストPRをマージ。遅れたら正直に言い、調整する。",
        },
        {
          step: "ケイデンス",
          detail:
            "週次成果レビュー（活動ではなく）。可視化KPI。四半期ごとに調整。",
        },
        {
          step: "移転",
          detail:
            "初日から優先。隠れた依存なし。終了時にExitチェックリスト。",
        },
      ],
    },
    deliverables: {
      fr: [
        "Feature ou service livré en production, observable, documenté",
        "Runbook, alerting, SLOs mesurés",
        "Tests (unit, integration, e2e) + CI/CD intégré à votre pipeline",
        "Documentation architecture + ADRs (Architecture Decision Records)",
        "Passation formalisée : sessions, captures écran, checklist",
      ],
      en: [
        "Feature or service shipped to production, observable, documented",
        "Runbook, alerting, measured SLOs",
        "Tests (unit, integration, e2e) + CI/CD integrated into your pipeline",
        "Architecture documentation + ADRs",
        "Formalized handover: sessions, screen captures, checklist",
      ],
      ja: [
        "本番リリース済みの機能またはサービス、可観測、文書化",
        "Runbook、アラート、計測済みSLO",
        "テスト（unit, integration, e2e）＋貴社パイプライン統合のCI/CD",
        "アーキテクチャ文書＋ADR（アーキテクチャ決定記録）",
        "形式化された引き継ぎ：セッション、画面キャプチャ、チェックリスト",
      ],
    },
    kpis: {
      fr: [
        { value: "2 sem.", label: "first PR merged" },
        { value: "99,9%", label: "SLO service livré" },
        { value: "100%", label: "ownership assumé" },
        { value: "Exit", label: "checklist signée" },
      ],
      en: [
        { value: "2 wks", label: "first PR merged" },
        { value: "99.9%", label: "SLO on shipped service" },
        { value: "100%", label: "ownership taken" },
        { value: "Exit", label: "checklist signed" },
      ],
      ja: [
        { value: "2週", label: "ファーストPRマージ" },
        { value: "99.9%", label: "納品サービスのSLO" },
        { value: "100%", label: "オーナーシップ完遂" },
        { value: "Exit", label: "チェックリスト署名" },
      ],
    },
    techStack: [
      "TypeScript",
      "Go",
      "Rust",
      "Python",
      "Java/Kotlin",
      "Kubernetes",
      "AWS / GCP / Azure",
      "Terraform",
      "GitHub Actions",
      "Prometheus + OpenTelemetry",
    ],
    relatedCaseSlugs: [
      "scale-up-mobilite-30-cloud",
      "leader-sport-pwa-conversion",
      "fintech-iso27001-devsecops",
    ],
    faq: {
      fr: [
        {
          q: "Quelle est la différence avec une ESN classique ?",
          a: "On ne facture pas des jours. On livre un périmètre. Si on n'avance pas, on assume — pas de billable absent. Et on est senior uniquement : pas de junior caché derrière une équipe.",
        },
        {
          q: "Comment vous intégrez-vous à notre process ?",
          a: "On s'adapte. Vos outils, votre workflow, vos rituels. On contribue, on n'impose pas. Si vous utilisez Scrum, Shape Up ou rien du tout, on suit.",
        },
        {
          q: "Et le transfert de compétences ?",
          a: "Priorité dès le jour 1. Sessions dédiées, pair programming, documentation d'architecture. L'exit doit être propre — c'est un KPI interne chez nous.",
        },
        {
          q: "Vous bossez à distance ou sur site ?",
          a: "Les deux. Paris, Montréal, Tokyo en présentiel si besoin. Remote friendly sinon. Certains clients nous veulent 2-3 jours/semaine on-site, d'autres 100 % remote.",
        },
        {
          q: "Quelle est la durée typique ?",
          a: "De 3 mois (feature ciblée) à 2 ans (plateforme critique). On préfère des engagements long-termes, plus impactants. Mais on prend aussi du court-terme si le périmètre est clair.",
        },
      ],
      en: [
        {
          q: "What's the difference with a classic IT services firm?",
          a: "We don't bill days. We deliver scope. If we don't progress, we own it — no absent billable. And we're senior-only: no junior hidden behind a team.",
        },
        {
          q: "How do you integrate into our process?",
          a: "We adapt. Your tools, your workflow, your rituals. We contribute, we don't impose. Scrum, Shape Up, or nothing at all — we follow.",
        },
        {
          q: "And skill transfer?",
          a: "Priority from day 1. Dedicated sessions, pair programming, architecture docs. Exit must be clean — it's an internal KPI for us.",
        },
        {
          q: "Remote or on-site?",
          a: "Both. Paris, Montréal, Tokyo in person if needed. Remote-friendly otherwise. Some clients want us 2-3 days/week on-site, others fully remote.",
        },
        {
          q: "Typical duration?",
          a: "From 3 months (targeted feature) to 2 years (critical platform). We prefer long-term engagements, more impactful. But we take short-term too if scope is clear.",
        },
      ],
      ja: [
        {
          q: "従来のSIerとの違いは？",
          a: "日数で請求しない。スコープで納品する。進まなければ責任を取る — 請求の空白なし。そしてシニアのみ：チームの陰に隠れたジュニアはいない。",
        },
        {
          q: "貴社プロセスへの統合は？",
          a: "適応します。貴社のツール、ワークフロー、儀式。貢献し、押し付けない。Scrum、Shape Up、何もなし — 従います。",
        },
        {
          q: "スキル移転は？",
          a: "初日から優先。専用セッション、ペアプログラミング、アーキテクチャ文書。Exitはクリーンでなければならない — 社内KPI。",
        },
        {
          q: "リモートか常駐か？",
          a: "両方。必要に応じてパリ、モントリオール、東京で対面。それ以外はリモートフレンドリー。週2-3日オンサイト希望のクライアントも、完全リモートのクライアントもいる。",
        },
        {
          q: "典型的な期間は？",
          a: "3ヶ月（対象機能）から2年（クリティカルプラットフォーム）。長期的な方がインパクトが大きいので好む。スコープが明確なら短期もOK。",
        },
      ],
    },
  },

  // 02 — Recrutement technique
  {
    slug: "recrutement-technique",
    number: "02",
    duration: "2 à 8 semaines",
    subtitle: {
      fr: "Talent Acquisition",
      en: "Talent Acquisition",
      ja: "タレント獲得",
    },
    title: {
      fr: "Recrutement technique",
      en: "Technical hiring",
      ja: "技術採用",
    },
    hookline: {
      fr: "Top 1 % sourcé par des ingénieurs, validé en process technique court. Pas de CV-puzzle.",
      en: "Top 1% sourced by engineers, validated via short technical process. No CV-puzzle.",
      ja: "エンジニアによるTop 1%のソーシング、短い技術検証。CVパズルなし。",
    },
    audience: {
      fr: [
        "CTO qui ont besoin d'un Lead, Staff ou Principal sur un délai court",
        "Scale-ups qui cherchent un profil rare (Rust, ROS 2, ML infra, GreenOps…)",
        "Boîtes qui ont brûlé 3 cabinets et n'arrivent pas à filter le bullshit",
        "VP Engineering qui veulent du top 1 % évalué par des pairs",
      ],
      en: [
        "CTOs who need a Lead, Staff or Principal on a short timeline",
        "Scale-ups hunting rare profiles (Rust, ROS 2, ML infra, GreenOps…)",
        "Companies burned by 3 firms, unable to filter bullshit",
        "VPs of Engineering who want top 1% evaluated by peers",
      ],
      ja: [
        "短期間でLead、Staff、Principalが必要なCTO",
        "希少プロファイル（Rust、ROS 2、MLインフラ、GreenOps…）を探すスケールアップ",
        "3つのエージェンシーを経験し、偽物をフィルタできない企業",
        "ピアによって評価されたtop 1%を求めるVPエンジニアリング",
      ],
    },
    concretes: {
      fr: [
        "Sourcing : nos ingés lisent les CV, les repos, les talks. Pas d'agent commercial.",
        "Filtrage technique : 30 min en visio avec un senior Abbeal sur le domaine",
        "Briefing candidat : honnête sur le poste, les galères, la culture",
        "Accompagnement jusqu'à la signature : debrief, négo, closing 48 h",
        "Garantie : si le candidat part dans les 6 mois, on re-source gratuitement",
      ],
      en: [
        "Sourcing: our engineers read CVs, repos, talks. No sales rep.",
        "Technical filter: 30-min video with a domain-senior Abbeal",
        "Candidate briefing: honest about the role, the pain, the culture",
        "Support until signing: debrief, negotiation, 48-h closing",
        "Guarantee: if they leave within 6 months, we re-source at no cost",
      ],
      ja: [
        "ソーシング：エンジニアがCV、リポジトリ、トークを読む。営業代理なし。",
        "技術フィルタ：Abbealシニア（ドメイン専門）とビデオ30分",
        "候補者ブリーフィング：役割、困難、カルチャーを正直に",
        "署名までのサポート：デブリーフ、交渉、48時間クロージング",
        "保証：6ヶ月以内に辞めたら無料で再ソーシング",
      ],
    },
    method: {
      fr: [
        {
          step: "Brief",
          detail:
            "30 min avec votre hiring manager. Stack réel, tech debt, équipe, ambition.",
        },
        {
          step: "Sourcing",
          detail:
            "Nos ingés scannent le marché : GitHub, talks, réseau. Pas de LinkedIn spam.",
        },
        {
          step: "Filtre technique",
          detail:
            "Entretien 45 min avec un senior Abbeal qui fait le même métier.",
        },
        {
          step: "Short list",
          detail:
            "3 à 5 candidats, avec un vrai avis (pas un score Likert générique).",
        },
        {
          step: "Closing",
          detail:
            "On accompagne la négo. Premier retour candidat en 48 h après votre dernier entretien.",
        },
      ],
      en: [
        {
          step: "Brief",
          detail:
            "30 min with your hiring manager. Real stack, tech debt, team, ambition.",
        },
        {
          step: "Sourcing",
          detail:
            "Our engineers scan the market: GitHub, talks, network. No LinkedIn spam.",
        },
        {
          step: "Technical filter",
          detail:
            "45-min interview with an Abbeal senior who does the same job.",
        },
        {
          step: "Short list",
          detail:
            "3 to 5 candidates, with a real opinion (not a generic Likert score).",
        },
        {
          step: "Closing",
          detail:
            "We support negotiation. First candidate feedback 48h after your last interview.",
        },
      ],
      ja: [
        {
          step: "ブリーフ",
          detail:
            "貴社採用マネージャーと30分。実際のスタック、技術的負債、チーム、野心。",
        },
        {
          step: "ソーシング",
          detail:
            "エンジニアが市場をスキャン：GitHub、トーク、ネットワーク。LinkedInスパムなし。",
        },
        {
          step: "技術フィルタ",
          detail: "同じ仕事をしているAbbealシニアとの45分面接。",
        },
        {
          step: "ショートリスト",
          detail:
            "3〜5人の候補者、本当の意見付き（一般的なリッカート尺度ではない）。",
        },
        {
          step: "クロージング",
          detail:
            "交渉をサポート。最終面接後48時間以内に最初の候補者フィードバック。",
        },
      ],
    },
    deliverables: {
      fr: [
        "Short list de 3 à 5 candidats filtrés techniquement",
        "Debrief écrit par candidat (forces, réserves, fit culturel)",
        "Accompagnement jusqu'à la signature + onboarding",
        "Garantie de 6 mois sur chaque placement",
        "Rapport anonymisé du marché (salaires, dispo, tendances)",
      ],
      en: [
        "Short list of 3 to 5 technically filtered candidates",
        "Written debrief per candidate (strengths, concerns, cultural fit)",
        "Support until signing + onboarding",
        "6-month guarantee on every placement",
        "Anonymized market report (salaries, availability, trends)",
      ],
      ja: [
        "技術的にフィルタされた3〜5人のショートリスト",
        "候補者ごとの書面デブリーフ（強み、懸念、カルチャーフィット）",
        "署名＋オンボーディングまでのサポート",
        "各配置で6ヶ月保証",
        "匿名化された市場レポート（給与、可用性、トレンド）",
      ],
    },
    kpis: {
      fr: [
        { value: "48 h", label: "first candidate feedback" },
        { value: "6 mois", label: "garantie" },
        { value: "Top 1%", label: "candidats filtrés" },
        { value: "3-5", label: "short list livrée" },
      ],
      en: [
        { value: "48h", label: "first candidate feedback" },
        { value: "6 months", label: "guarantee" },
        { value: "Top 1%", label: "filtered candidates" },
        { value: "3-5", label: "short list delivered" },
      ],
      ja: [
        { value: "48時間", label: "最初の候補者フィードバック" },
        { value: "6ヶ月", label: "保証" },
        { value: "Top 1%", label: "フィルタ済み候補者" },
        { value: "3-5人", label: "ショートリスト納品" },
      ],
    },
    techStack: [
      "CTO / VP Engineering",
      "Staff / Principal Engineer",
      "Tech Lead",
      "SRE / Platform",
      "ML / Data engineers",
      "Rust / Go / Kotlin seniors",
      "Robotique (ROS 2)",
      "Sécurité / DevSecOps",
    ],
    relatedCaseSlugs: [
      "fintech-iso27001-devsecops",
      "mobilite-canada-data-platform",
      "robotique-jp-ros2-flotte",
    ],
    faq: {
      fr: [
        {
          q: "Pourquoi les ingés font le sourcing et pas les recruteurs ?",
          a: "Parce que lire un repo ou un talk, ça ne se délègue pas à quelqu'un qui ne code pas. Nos ingés comprennent la différence entre un senior qui a vécu un incident et un qui a lu un article.",
        },
        {
          q: "Quelle est la garantie si le candidat part ?",
          a: "Dans les 6 mois suivant l'embauche, on re-source gratuitement. Honnête, sans clause bidon. On considère qu'un mismatch, c'est 50 % notre responsabilité.",
        },
        {
          q: "Vous prenez une commission sur quoi ?",
          a: "Sur la rémunération annuelle brute à la signature. Pas de retainer caché, pas de double facturation. On signe une garantie 6 mois.",
        },
        {
          q: "Combien de temps pour un recrutement ?",
          a: "2 à 8 semaines. Lead/Staff : 3-4 semaines. Principal rare (Rust Core, ROS 2 Nav Lead) : 6-8 semaines. On vous dit oui ou non en brief.",
        },
        {
          q: "Vous travaillez sur quels pays ?",
          a: "France, Canada, Japon — nos hubs. On peut faire de l'international (US, UK, Allemagne) mais on prévient : notre base de sourcing est plus profonde sur nos 3 géos.",
        },
      ],
      en: [
        {
          q: "Why do engineers source, not recruiters?",
          a: "Because reading a repo or a talk can't be delegated to someone who doesn't code. Our engineers understand the difference between a senior who lived through an incident and one who read an article.",
        },
        {
          q: "What's the guarantee if the candidate leaves?",
          a: "Within 6 months of hire, we re-source at no cost. Honest, no fake clause. We consider a mismatch is 50% our responsibility.",
        },
        {
          q: "What do you charge on?",
          a: "Annual gross compensation at signing. No hidden retainer, no double billing. We sign a 6-month guarantee.",
        },
        {
          q: "How long for a hire?",
          a: "2 to 8 weeks. Lead/Staff: 3-4 weeks. Rare Principal (Rust Core, ROS 2 Nav Lead): 6-8 weeks. We say yes or no in brief.",
        },
        {
          q: "What countries?",
          a: "France, Canada, Japan — our hubs. We can do international (US, UK, Germany) but we warn you: sourcing base is deeper in our 3 geos.",
        },
      ],
      ja: [
        {
          q: "なぜ採用担当者ではなくエンジニアがソーシングするのか？",
          a: "リポジトリやトークを読むのは、コードを書かない人には委譲できないから。私たちのエンジニアは、インシデントを経験したシニアと記事を読んだだけのシニアの違いを理解する。",
        },
        {
          q: "候補者が辞めた場合の保証は？",
          a: "採用から6ヶ月以内、無料で再ソーシング。正直に、偽の条項なし。ミスマッチは50%私たちの責任と考える。",
        },
        {
          q: "何に対して請求するのか？",
          a: "署名時の年間総報酬。隠れたリテイナーなし、二重請求なし。6ヶ月保証に署名する。",
        },
        {
          q: "採用までの期間は？",
          a: "2〜8週間。Lead/Staff：3-4週間。希少Principal（Rust Core、ROS 2 Nav Lead）：6-8週間。ブリーフでYesかNoを即答。",
        },
        {
          q: "対象国は？",
          a: "フランス、カナダ、日本 — 私たちのハブ。国際対応も可能（US、UK、ドイツ）だが警告：3つのジオのソーシング基盤が最も深い。",
        },
      ],
    },
  },

  // 03 — Delivery clé en main
  {
    slug: "delivery-cle-en-main",
    number: "03",
    duration: "3 à 18 mois",
    subtitle: {
      fr: "Digital Solutions",
      en: "Digital Solutions",
      ja: "デジタルソリューション",
    },
    title: {
      fr: "Delivery clé en main",
      en: "Turnkey delivery",
      ja: "ターンキー納品",
    },
    hookline: {
      fr: "De la conception au run. Engagement output, pas time & material. SLOs, observabilité, run maîtrisé.",
      en: "From design to run. Outcome-based engagement, not time & material. SLOs, observability, operated run.",
      ja: "設計から運用まで。成果ベースのエンゲージメント、T&Mではない。SLO、可観測性、運用管理。",
    },
    audience: {
      fr: [
        "Boîtes qui ont un problème clair mais pas l'équipe pour le livrer",
        "CTO qui veulent externaliser un périmètre sans perdre la main",
        "Scale-ups qui ont besoin d'un projet greenfield livré vite et propre",
        "Grandes entreprises sur modernisation legacy avec budget maîtrisé",
      ],
      en: [
        "Companies with a clear problem but no team to deliver",
        "CTOs who want to outsource a scope without losing control",
        "Scale-ups needing a greenfield project delivered fast and clean",
        "Enterprises on legacy modernization with a managed budget",
      ],
      ja: [
        "明確な課題があるが納品チームがない企業",
        "コントロールを失わずにスコープを外部化したいCTO",
        "高速で清潔に納品されるグリーンフィールドプロジェクトが必要なスケールアップ",
        "予算管理された基幹モダナイゼーションの大企業",
      ],
    },
    concretes: {
      fr: [
        "Engagement output : on livre un périmètre défini, pas des billables",
        "Architecture + implémentation + observabilité + runbook + formation",
        "SLOs convenus au cadrage, monitorés, audités trimestriellement",
        "Transfert de propriété : code, infra, docs — tout vous appartient",
        "Run mutualisé si demandé, avec conditions de sortie explicites",
      ],
      en: [
        "Outcome engagement: we deliver a defined scope, not billables",
        "Architecture + implementation + observability + runbook + training",
        "SLOs agreed at scoping, monitored, quarterly audited",
        "Ownership transfer: code, infra, docs — everything is yours",
        "Shared run if requested, with explicit exit conditions",
      ],
      ja: [
        "成果コミットメント：請求ではなく定義されたスコープを納品",
        "アーキテクチャ＋実装＋可観測性＋runbook＋トレーニング",
        "スコーピング時に合意されたSLO、監視、四半期監査",
        "所有権移転：コード、インフラ、文書 — すべて貴社に帰属",
        "要求時は共有運用、明示的なExit条件付き",
      ],
    },
    method: {
      fr: [
        {
          step: "Cadrage",
          detail:
            "2-4 semaines. Ateliers, architecture, SLOs, RFC. Sortie : devis fixe, planning, risques.",
        },
        {
          step: "Build",
          detail:
            "Squad dédié (3-8 ingés). Vos outils ou les nôtres, au choix. Démo toutes les 2 semaines.",
        },
        {
          step: "Recette",
          detail:
            "Tests en conditions réelles, charge, chaos. Critères d'acceptance écrits dès le cadrage.",
        },
        {
          step: "Mise en prod",
          detail:
            "Canary, feature flags, rollback ready. Runbook testé avec vos équipes.",
        },
        {
          step: "Run / Transfer",
          detail:
            "On peut opérer 3-6 mois pendant que vos équipes prennent la main. Ou on transfère direct.",
        },
      ],
      en: [
        {
          step: "Scoping",
          detail:
            "2-4 weeks. Workshops, architecture, SLOs, RFCs. Output: fixed quote, plan, risks.",
        },
        {
          step: "Build",
          detail:
            "Dedicated squad (3-8 engineers). Your tools or ours, your choice. Demo every 2 weeks.",
        },
        {
          step: "Acceptance",
          detail:
            "Real-condition tests, load, chaos. Acceptance criteria written at scoping.",
        },
        {
          step: "Go-live",
          detail:
            "Canary, feature flags, rollback ready. Runbook tested with your teams.",
        },
        {
          step: "Run / Transfer",
          detail:
            "We can operate 3-6 months while your teams take over. Or direct handover.",
        },
      ],
      ja: [
        {
          step: "スコーピング",
          detail:
            "2-4週間。ワークショップ、アーキテクチャ、SLO、RFC。成果物：固定見積、計画、リスク。",
        },
        {
          step: "ビルド",
          detail:
            "専用スクワッド（3-8人のエンジニア）。貴社または私たちのツール、選択可。2週間ごとにデモ。",
        },
        {
          step: "受入",
          detail:
            "実条件テスト、負荷、カオス。受入基準はスコーピング時に書面化。",
        },
        {
          step: "本番化",
          detail:
            "Canary、フィーチャーフラグ、ロールバック準備。貴社チームとrunbookテスト。",
        },
        {
          step: "運用/移転",
          detail:
            "3-6ヶ月運用可能、その間貴社チームが主導権を引き継ぐ。または直接移転。",
        },
      ],
    },
    deliverables: {
      fr: [
        "Architecture complète, ADRs, diagrammes à jour",
        "Code source, IaC Terraform, CI/CD",
        "Tests unit/integration/e2e + charge + chaos",
        "Observabilité : métriques, logs, traces, alerting",
        "Runbook ops + playbooks incidents + sessions de formation",
      ],
      en: [
        "Complete architecture, ADRs, up-to-date diagrams",
        "Source code, Terraform IaC, CI/CD",
        "Unit/integration/e2e tests + load + chaos",
        "Observability: metrics, logs, traces, alerting",
        "Ops runbook + incident playbooks + training sessions",
      ],
      ja: [
        "完全なアーキテクチャ、ADR、最新の図",
        "ソースコード、Terraform IaC、CI/CD",
        "Unit/integration/e2eテスト＋負荷＋カオス",
        "可観測性：メトリクス、ログ、トレース、アラート",
        "運用runbook＋インシデントplaybook＋トレーニングセッション",
      ],
    },
    kpis: {
      fr: [
        { value: "Fixe", label: "devis ferme au cadrage" },
        { value: "99,9%", label: "SLO en production" },
        { value: "100%", label: "IP transférée" },
        { value: "Canary", label: "mise en prod sécurisée" },
      ],
      en: [
        { value: "Fixed", label: "firm quote at scoping" },
        { value: "99.9%", label: "SLO in production" },
        { value: "100%", label: "IP transferred" },
        { value: "Canary", label: "safe go-live" },
      ],
      ja: [
        { value: "固定", label: "スコーピング時の確定見積" },
        { value: "99.9%", label: "本番SLO" },
        { value: "100%", label: "IP移転" },
        { value: "Canary", label: "安全な本番化" },
      ],
    },
    techStack: [
      "Next.js / React",
      "Node / Go / Python / Rust",
      "Kubernetes + Karpenter",
      "Terraform + Crossplane",
      "PostgreSQL / Snowflake / Databricks",
      "Kafka / Temporal / Airflow",
      "AWS / GCP / Azure / On-prem",
      "OpenTelemetry + Grafana + Tempo",
    ],
    relatedCaseSlugs: [
      "legacy-cobol-japon-modernisation",
      "energie-iot-edge-temps-reel",
      "retail-omnichannel-tri-geo",
      "assurance-claims-ia-document",
    ],
    faq: {
      fr: [
        {
          q: "C'est vraiment à prix fixe ?",
          a: "Oui, après cadrage. Le cadrage est time & material court (2-4 semaines) pour dé-risquer. Ensuite, devis ferme avec acceptance criteria écrits. Si on se trompe, on assume.",
        },
        {
          q: "Et si le scope change en cours de route ?",
          a: "Change request formalisé, évalué en 48 h. On dit oui/non avec un nouveau devis ou un trade-off sur l'existant. Pas de gonflage silencieux.",
        },
        {
          q: "Vous opérez en prod après livraison ?",
          a: "On peut. 3 à 6 mois de run mutualisé pendant que vos équipes prennent la main. Après, transfert complet. Pas de dépendance piège.",
        },
        {
          q: "Quelle est la typologie de projet ?",
          a: "Greenfield (nouveau produit, nouveau service), modernisation legacy (COBOL, monolithe Java, PHP), plateforme data, pipeline IA. On évite les missions floues sans outcome mesurable.",
        },
        {
          q: "Combien de personnes sur un projet typique ?",
          a: "3 à 8 ingés selon le scope. Un Tech Lead senior, 2-4 ingés seniors, 1-2 ingés medior, parfois un PM. Pas de pyramide avec des juniors cachés.",
        },
      ],
      en: [
        {
          q: "Is it really fixed-price?",
          a: "Yes, after scoping. Scoping is short time & material (2-4 weeks) to de-risk. Then a firm quote with written acceptance criteria. If we're wrong, we own it.",
        },
        {
          q: "And if scope changes mid-way?",
          a: "Formalized change request, evaluated in 48h. We say yes/no with a new quote or a trade-off on existing. No silent scope creep.",
        },
        {
          q: "Do you operate in production after delivery?",
          a: "We can. 3-6 months of shared run while your teams take over. Then full handover. No trap dependency.",
        },
        {
          q: "What project types?",
          a: "Greenfield (new product, new service), legacy modernization (COBOL, Java monolith, PHP), data platform, AI pipeline. We avoid fuzzy missions with no measurable outcome.",
        },
        {
          q: "How many people on a typical project?",
          a: "3 to 8 engineers depending on scope. A senior Tech Lead, 2-4 senior engineers, 1-2 mid engineers, sometimes a PM. No pyramid with hidden juniors.",
        },
      ],
      ja: [
        {
          q: "本当に固定価格？",
          a: "スコーピング後はそう。スコーピングは短いT&M（2-4週間）でリスクを低減。その後、書面受入基準付きの確定見積。間違えたら責任を取る。",
        },
        {
          q: "途中でスコープが変わったら？",
          a: "正式な変更リクエスト、48時間で評価。新しい見積または既存のトレードオフでYes/No。静かなスコープクリープなし。",
        },
        {
          q: "納品後の本番運用は？",
          a: "可能。3-6ヶ月の共有運用、その間貴社チームが引き継ぐ。その後、完全移管。罠依存なし。",
        },
        {
          q: "プロジェクトタイプは？",
          a: "グリーンフィールド（新製品、新サービス）、レガシーモダナイゼーション（COBOL、Java monolith、PHP）、データプラットフォーム、AIパイプライン。測定可能な成果のない曖昧なミッションは避ける。",
        },
        {
          q: "典型的なプロジェクトの人数は？",
          a: "スコープにより3〜8人のエンジニア。シニアTech Lead、2-4人のシニアエンジニア、1-2人のミッドエンジニア、場合によってはPM。ジュニアが隠れたピラミッドなし。",
        },
      ],
    },
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getAllServices(): Service[] {
  return services;
}
