/**
 * Cross-links entre glossaire ↔ services ↔ cases.
 * Objectif SEO : chaque entrée de glossaire pointe vers les services et cases
 * où ce concept est concrètement appliqué — internal linking massif.
 *
 * Clé = slug glossaire. Valeurs = slugs des services / cases pertinents.
 * Séparé de glossary.ts pour éviter conflict avec agent de traduction.
 */

export type GlossaryCrosslink = {
  serviceSlugs?: string[];
  caseSlugs?: string[];
  articleSlugs?: string[];
};

export const glossaryCrosslinks: Record<string, GlossaryCrosslink> = {
  // === IA ===
  rag: {
    serviceSlugs: ["delivery-cle-en-main", "squads-embarques"],
    caseSlugs: ["banque-rag-cout-divise-10"],
    articleSlugs: ["agents-ia-production", "rag-production-10k-a-900"],
  },
  llm: {
    caseSlugs: ["banque-rag-cout-divise-10", "assurance-claims-ia-document"],
    articleSlugs: ["agents-ia-production", "rag-production-10k-a-900"],
  },
  "agent-multi-tools": {
    serviceSlugs: ["delivery-cle-en-main"],
    caseSlugs: ["legacy-cobol-japon-modernisation"],
    articleSlugs: ["agents-ia-production", "legacy-modernization-multi-agents"],
  },
  embedding: {
    caseSlugs: ["banque-rag-cout-divise-10"],
    articleSlugs: ["rag-production-10k-a-900"],
  },
  "vector-db": {
    caseSlugs: ["banque-rag-cout-divise-10"],
    articleSlugs: ["rag-production-10k-a-900"],
  },
  "fine-tuning": {
    articleSlugs: ["agents-ia-production"],
  },
  eval: {
    serviceSlugs: ["delivery-cle-en-main"],
    articleSlugs: ["agents-ia-production"],
  },
  inference: {
    caseSlugs: ["banque-rag-cout-divise-10", "energie-iot-edge-temps-reel"],
    articleSlugs: ["rag-production-10k-a-900"],
  },
  token: {
    caseSlugs: ["banque-rag-cout-divise-10"],
  },
  hallucination: {
    articleSlugs: ["agents-ia-production"],
  },

  // === Infrastructure ===
  kubernetes: {
    serviceSlugs: ["squads-embarques", "delivery-cle-en-main"],
    caseSlugs: ["scale-up-mobilite-30-cloud", "fintech-iso27001-devsecops"],
    articleSlugs: ["greenops-7-leviers"],
  },
  karpenter: {
    caseSlugs: ["scale-up-mobilite-30-cloud"],
    articleSlugs: ["greenops-7-leviers"],
  },
  greenops: {
    serviceSlugs: ["delivery-cle-en-main"],
    caseSlugs: ["scale-up-mobilite-30-cloud"],
    articleSlugs: ["greenops-7-leviers"],
  },
  opentofu: {
    caseSlugs: ["fintech-iso27001-devsecops"],
  },
  terraform: {
    caseSlugs: ["fintech-iso27001-devsecops"],
  },
  iac: {
    serviceSlugs: ["delivery-cle-en-main"],
    caseSlugs: ["fintech-iso27001-devsecops"],
  },
  container: {
    caseSlugs: ["scale-up-mobilite-30-cloud"],
  },
  edge: {
    caseSlugs: ["leader-sport-pwa-conversion", "energie-iot-edge-temps-reel"],
  },
  serverless: {
    caseSlugs: ["leader-sport-pwa-conversion"],
  },
  cdn: {
    caseSlugs: ["leader-sport-pwa-conversion"],
  },

  // === Engineering ===
  slo: {
    serviceSlugs: ["squads-embarques", "delivery-cle-en-main"],
    caseSlugs: ["scale-up-mobilite-30-cloud"],
  },
  sli: {
    serviceSlugs: ["squads-embarques"],
  },
  slam: {
    serviceSlugs: ["delivery-cle-en-main"],
  },
  observability: {
    serviceSlugs: ["squads-embarques"],
    caseSlugs: ["scale-up-mobilite-30-cloud"],
  },
  opentelemetry: {
    caseSlugs: ["scale-up-mobilite-30-cloud"],
  },
  canary: {
    serviceSlugs: ["delivery-cle-en-main"],
    caseSlugs: ["leader-sport-pwa-conversion"],
  },
  "feature-flag": {
    serviceSlugs: ["squads-embarques"],
  },
  "ci-cd": {
    serviceSlugs: ["squads-embarques", "delivery-cle-en-main"],
    caseSlugs: ["fintech-iso27001-devsecops"],
  },
  dora: {
    caseSlugs: ["fintech-iso27001-devsecops"],
    articleSlugs: ["follow-the-sun-sans-bruler-equipes"],
  },
  runbook: {
    serviceSlugs: ["squads-embarques", "delivery-cle-en-main"],
  },
  rust: {
    serviceSlugs: ["squads-embarques", "recrutement-technique"],
    caseSlugs: ["robotique-jp-ros2-flotte"],
    articleSlugs: ["tech-radar-2026"],
  },

  // === Data ===
  lakehouse: {
    serviceSlugs: ["delivery-cle-en-main"],
    caseSlugs: ["mobilite-canada-data-platform"],
  },
  dbt: {
    caseSlugs: ["mobilite-canada-data-platform"],
  },
  "unity-catalog": {
    caseSlugs: ["mobilite-canada-data-platform"],
  },
  mach: {
    caseSlugs: ["retail-omnichannel-tri-geo"],
  },

  // === Robotique ===
  ros2: {
    serviceSlugs: ["recrutement-technique"],
    caseSlugs: ["robotique-jp-ros2-flotte"],
    articleSlugs: ["tech-radar-2026"],
  },
  nav2: {
    caseSlugs: ["robotique-jp-ros2-flotte"],
  },
  "isaac-sim": {
    caseSlugs: ["robotique-jp-ros2-flotte"],
  },

  // === Méthodes ===
  "follow-the-sun": {
    serviceSlugs: ["squads-embarques", "delivery-cle-en-main"],
    caseSlugs: ["retail-omnichannel-tri-geo"],
    articleSlugs: ["follow-the-sun-sans-bruler-equipes"],
  },
  "staff-augmentation": {
    serviceSlugs: ["squads-embarques"],
    caseSlugs: ["scale-up-mobilite-30-cloud", "fintech-iso27001-devsecops"],
  },
  "bounded-context": {
    serviceSlugs: ["delivery-cle-en-main"],
    caseSlugs: ["legacy-cobol-japon-modernisation"],
    articleSlugs: ["legacy-modernization-multi-agents"],
  },
  microservices: {
    serviceSlugs: ["delivery-cle-en-main"],
    caseSlugs: ["scale-up-mobilite-30-cloud"],
  },

  // === Sécurité ===
  "iso-27001": {
    serviceSlugs: ["delivery-cle-en-main"],
    caseSlugs: ["fintech-iso27001-devsecops"],
  },
  soc2: {
    serviceSlugs: ["delivery-cle-en-main"],
    caseSlugs: ["fintech-iso27001-devsecops"],
  },
  devsecops: {
    serviceSlugs: ["squads-embarques", "delivery-cle-en-main"],
    caseSlugs: ["fintech-iso27001-devsecops"],
  },
  secnumcloud: {
    articleSlugs: ["souverainete-secnumcloud-vs-appi"],
  },
  appi: {
    articleSlugs: ["souverainete-secnumcloud-vs-appi"],
  },
  rgpd: {
    articleSlugs: ["souverainete-secnumcloud-vs-appi"],
  },

  // === Business ===
  "time-and-material": {
    serviceSlugs: ["squads-embarques", "delivery-cle-en-main"],
  },
  "output-engagement": {
    serviceSlugs: ["delivery-cle-en-main", "squads-embarques"],
  },
  mobbeal: {
    articleSlugs: ["mobbeal-playbook-garde-ton-job"],
  },
};

export function getGlossaryCrosslinks(slug: string): GlossaryCrosslink {
  return glossaryCrosslinks[slug] ?? {};
}
