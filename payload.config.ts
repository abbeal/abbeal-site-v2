/**
 * Payload CMS 3 config — PoC.
 *
 * 7 collections :
 *   - Users         (auth, API Keys pour Cowork)
 *   - Articles      (27 articles d'insights, body blocks 11 types)
 *   - Cases         (25 case studies, meme body blocks)
 *   - LandingPages  (6 landings SEO non-branded, meme body blocks)
 *   - Glossary      (54 termes techniques + Schema.org DefinedTerm)
 *   - TechRadar     (11 items × 4 locales, ring/category non-localises)
 *   - Team          (vide, a remplir manuellement via /admin)
 *
 * SQLite local (./payload.db) — Postgres viendra a la bascule prod.
 * 4 locales fr/en/ja/fr-ca, defaultLocale fr, fallback active.
 *
 * Le rendu public ne lit PAS encore Payload : c'est juste un admin
 * adressable a /admin + une API write a /api/{collection}.
 *
 * Lancement local :
 *   PAYLOAD_SECRET=dev-secret pnpm dev
 *   → admin sur http://localhost:3000/admin
 *
 * Migration :
 *   pnpm migrate:articles  pnpm migrate:cases  pnpm migrate:landings
 *   pnpm migrate:glossary  pnpm migrate:tech-radar
 *
 * NB : tout est inline dans CE fichier — pas de cross-file imports vers
 * payload/collections/* parce que tsx + tsconfig "bundler" est fragile.
 * On reextraira quand on aura plus de 7 collections (probable jamais).
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig, type Block, type CollectionConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// ---------------------------------------------------------------------------
// STANDARD_CONTENT_BLOCKS — les 11 blocks editoriaux reutilisables.
// Matche 1:1 l'union ArticleBlock de lib/articles.ts. Reutilises par
// Articles, Cases, LandingPages — toute collection avec un champ `body`.
// ---------------------------------------------------------------------------
const STANDARD_CONTENT_BLOCKS: Block[] = [
  {
    slug: "h2",
    labels: { singular: "Titre H2", plural: "Titres H2" },
    fields: [{ name: "content", type: "text", required: true }],
  },
  {
    slug: "h3",
    labels: { singular: "Sous-titre H3", plural: "Sous-titres H3" },
    fields: [{ name: "content", type: "text", required: true }],
  },
  {
    slug: "p",
    labels: { singular: "Paragraphe", plural: "Paragraphes" },
    fields: [
      {
        name: "content",
        type: "textarea",
        required: true,
        admin: {
          description:
            "Markdown inline supporte : [label](url) genere un lien (target=_blank si http).",
        },
      },
    ],
  },
  {
    slug: "byline",
    labels: { singular: "Byline auteur", plural: "Bylines auteur" },
    fields: [
      { name: "name", type: "text", required: true },
      { name: "role", type: "text", required: true },
      { name: "linkedinUrl", type: "text" },
      {
        name: "photo",
        type: "text",
        admin: { description: "Chemin /public, ex: /insights/.../alex.jpg" },
      },
    ],
  },
  {
    slug: "list",
    labels: { singular: "Liste", plural: "Listes" },
    fields: [
      {
        name: "items",
        type: "array",
        required: true,
        minRows: 1,
        fields: [{ name: "text", type: "text", required: true }],
      },
      {
        name: "ordered",
        type: "checkbox",
        admin: { description: "Numerotee (1,2,3) si coche, a puces sinon" },
      },
    ],
  },
  {
    slug: "quote",
    labels: { singular: "Citation", plural: "Citations" },
    fields: [
      { name: "content", type: "textarea", required: true },
      { name: "author", type: "text" },
    ],
  },
  {
    slug: "code",
    labels: { singular: "Code", plural: "Codes" },
    fields: [
      { name: "lang", type: "text", admin: { description: "Ex: ts, py, bash" } },
      { name: "content", type: "textarea", required: true },
    ],
  },
  {
    slug: "callout",
    labels: { singular: "Encart", plural: "Encarts" },
    fields: [
      {
        name: "tone",
        type: "select",
        options: [
          { label: "Default", value: "default" },
          { label: "Teal", value: "teal" },
          { label: "Ink (noir)", value: "ink" },
        ],
        defaultValue: "default",
      },
      { name: "content", type: "textarea", required: true },
    ],
  },
  {
    slug: "link",
    labels: { singular: "Lien CTA", plural: "Liens CTA" },
    fields: [
      { name: "label", type: "text", required: true },
      { name: "href", type: "text", required: true },
      {
        name: "external",
        type: "checkbox",
        defaultValue: true,
        admin: {
          description:
            "Si coche : target=_blank rel=noopener. Decoche pour les liens internes.",
        },
      },
    ],
  },
  {
    slug: "platformHeader",
    labels: { singular: "Header plateforme", plural: "Headers plateforme" },
    fields: [
      { name: "name", type: "text", required: true },
      {
        name: "logoSrc",
        type: "text",
        required: true,
        admin: {
          description: "Chemin /public, ex: /article-assets/anki.svg",
        },
      },
      { name: "href", type: "text", required: true },
      { name: "tagline", type: "text" },
    ],
  },
  {
    slug: "image",
    labels: { singular: "Image", plural: "Images" },
    fields: [
      { name: "src", type: "text", required: true },
      { name: "alt", type: "text", required: true },
      { name: "caption", type: "text" },
    ],
  },
];

// Pattern d'access control reutilise par toutes les collections de contenu :
// read public, write auth-requise. Pas applique aux Users (auth defaut Payload).
const PUBLIC_READ_AUTH_WRITE = {
  read: () => true,
  create: ({ req: { user } }: { req: { user: unknown } }) => Boolean(user),
  update: ({ req: { user } }: { req: { user: unknown } }) => Boolean(user),
  delete: ({ req: { user } }: { req: { user: unknown } }) => Boolean(user),
};

// ═══════════════════════════════════════════════════════════════════════════
//                             COLLECTIONS
// ═══════════════════════════════════════════════════════════════════════════

// ---------------------------------------------------------------------------
// Users — auth + API Keys (pour Cowork)
// ---------------------------------------------------------------------------
const Users: CollectionConfig = {
  slug: "users",
  auth: {
    useAPIKey: true, // Header: Authorization: users API-Key <key>
  },
  admin: {
    useAsTitle: "email",
    description: "Comptes admin du CMS Abbeal (auth Payload + API Keys pour Cowork)",
  },
  fields: [
    { name: "firstName", type: "text" },
    { name: "lastName", type: "text" },
  ],
};

// ---------------------------------------------------------------------------
// Articles — 27 articles d'insights /insights (mirror lib/articles.ts)
// ---------------------------------------------------------------------------
const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "tag", "publishedAt", "featured"],
    description: "Articles d'insights /insights. 4 langues. Body = blocks.",
  },
  access: PUBLIC_READ_AUTH_WRITE,
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "featuredOnHome", type: "checkbox" },
    { name: "tag", type: "text", required: true, admin: { description: "Ex: IA, Engineering, Talent, Mobbeal, Business" } },
    { name: "readTime", type: "text", required: true, admin: { description: 'Ex: "5 min"' } },
    { name: "publishedAt", type: "date", required: true },
    { name: "updatedAt", type: "date" },
    { name: "relatedCaseSlug", type: "text" },
    { name: "relatedServiceSlug", type: "text" },

    // Localises
    { name: "title", type: "text", required: true, localized: true },
    { name: "excerpt", type: "textarea", required: true, localized: true },
    { name: "metaDescription", type: "textarea", localized: true },
    { name: "keywords", type: "textarea", localized: true },
    {
      name: "faq",
      type: "array",
      localized: true,
      labels: { singular: "FAQ Q/R", plural: "FAQ Q/R" },
      fields: [
        { name: "q", type: "text", required: true },
        { name: "a", type: "textarea", required: true },
      ],
    },
    {
      name: "body",
      type: "blocks",
      required: true,
      localized: true,
      labels: { singular: "bloc", plural: "blocs" },
      blocks: STANDARD_CONTENT_BLOCKS,
    },
  ],
};

// ---------------------------------------------------------------------------
// Cases — 25 case studies /cases (mirror lib/cases.ts)
// Pattern similaire a Articles + champs metier (sector/geo/duration/teamSize/
// techStack/kpi/clientLogo).
// ---------------------------------------------------------------------------
const Cases: CollectionConfig = {
  slug: "cases",
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "sector", "geo", "publishedAt", "featured"],
    description: "Case studies /cases. 4 langues. Body = blocks.",
  },
  access: PUBLIC_READ_AUTH_WRITE,
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "featuredOnHome", type: "checkbox" },
    {
      name: "template",
      type: "checkbox",
      admin: { description: "True = exemple sectoriel methodologique, pas un client identifie" },
    },
    {
      name: "clientLogo",
      type: "text",
      admin: { description: 'Slug du fichier dans /public/logos/{slug}.{ext}' },
    },
    {
      name: "clientLogoExt",
      type: "select",
      options: [
        { label: "SVG", value: "svg" },
        { label: "PNG", value: "png" },
      ],
      defaultValue: "svg",
    },
    {
      name: "clientLogoSecondary",
      type: "text",
      admin: { description: "Logo client secondaire (cas multi-clients ex Neobrain × PwC)" },
    },
    {
      name: "clientLogoSecondaryExt",
      type: "select",
      options: [
        { label: "SVG", value: "svg" },
        { label: "PNG", value: "png" },
      ],
      defaultValue: "svg",
    },
    {
      name: "geo",
      type: "text",
      required: true,
      admin: { description: "Ex: Paris, Tokyo, Tri-geo, Montreal" },
    },
    {
      name: "duration",
      type: "text",
      required: true,
      admin: { description: 'Ex: "9 mois", "14 mois", "Recrutement permanent 2026"' },
    },
    { name: "teamSize", type: "number", required: true },
    {
      name: "techStack",
      type: "array",
      required: true,
      labels: { singular: "Tech", plural: "Tech Stack" },
      fields: [{ name: "name", type: "text", required: true }],
    },
    { name: "publishedAt", type: "date", required: true },

    // KPI principal (group, partiellement localise — value reste un nombre/string commun)
    {
      name: "kpi",
      type: "group",
      label: "KPI principal (affiche sur la card)",
      fields: [
        { name: "value", type: "text", required: true, admin: { description: 'Ex: "-30%", "+18%", "9 mois"' } },
        { name: "label", type: "text", required: true, localized: true, admin: { description: "Ex: cloud cost, conversion, time-to-ISO27001" } },
      ],
    },

    // Localises
    { name: "sector", type: "text", required: true, localized: true, admin: { description: 'Ex: "FinTech", "Mobilite", "Robotique"' } },
    { name: "title", type: "text", required: true, localized: true },
    { name: "excerpt", type: "textarea", required: true, localized: true },
    {
      name: "body",
      type: "blocks",
      required: true,
      localized: true,
      labels: { singular: "bloc", plural: "blocs" },
      blocks: STANDARD_CONTENT_BLOCKS,
    },
  ],
};

// ---------------------------------------------------------------------------
// LandingPages — 6 landings SEO non-branded (mirror lib/landing-pages.ts)
// ---------------------------------------------------------------------------
const LandingPages: CollectionConfig = {
  slug: "landing-pages",
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "h1"],
    description: "Landing pages SEO non-branded. 4 langues. Body = blocks + FAQ.",
  },
  access: PUBLIC_READ_AUTH_WRITE,
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true },
    {
      name: "keywords",
      type: "array",
      labels: { singular: "Mot-cle SEO", plural: "Mots-cles SEO" },
      fields: [{ name: "term", type: "text", required: true }],
      admin: { description: "Mots-cles cibles SEO non-branded (info editoriale, pas affiches)" },
    },
    {
      name: "relatedCaseSlugs",
      type: "array",
      labels: { singular: "Case lie", plural: "Cases lies" },
      fields: [{ name: "slug", type: "text", required: true }],
    },
    { name: "relatedArticleSlug", type: "text" },

    // Hero + meta localises
    { name: "tape", type: "text", required: true, localized: true, admin: { description: "Label scotch hero (small caps mono)" } },
    { name: "h1", type: "text", required: true, localized: true },
    { name: "subtitle", type: "textarea", required: true, localized: true },
    { name: "metaDescription", type: "textarea", required: true, localized: true, admin: { description: "155 chars max recommande (SEO)" } },

    // Body + FAQ localises
    {
      name: "body",
      type: "blocks",
      required: true,
      localized: true,
      labels: { singular: "bloc", plural: "blocs" },
      blocks: STANDARD_CONTENT_BLOCKS,
    },
    {
      name: "faq",
      type: "array",
      required: true,
      localized: true,
      labels: { singular: "FAQ Q/R", plural: "FAQ Q/R" },
      fields: [
        { name: "q", type: "text", required: true },
        { name: "a", type: "textarea", required: true },
      ],
    },

    // Schemas optionnels (JSON brut pour simplifier — peu de gens editent ca)
    {
      name: "extraSchema",
      type: "json",
      admin: { description: "Schema.org optionnel (localBusiness, employmentAgency). JSON brut." },
    },
  ],
};

// ---------------------------------------------------------------------------
// Glossary — 54 termes techniques (mirror lib/glossary.ts).
// Source = I18nString {fr,en,ja} (pas fr-ca). On adapte en localized
// standard, fr-ca tombera en fallback fr automatiquement.
// ---------------------------------------------------------------------------
const Glossary: CollectionConfig = {
  slug: "glossary",
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "category"],
    description: "Glossaire technique. 54 termes, 4 langues, schema DefinedTerm.",
  },
  access: PUBLIC_READ_AUTH_WRITE,
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "IA", value: "IA" },
        { label: "Infrastructure", value: "Infrastructure" },
        { label: "Engineering", value: "Engineering" },
        { label: "Data", value: "Data" },
        { label: "Robotique", value: "Robotique" },
        { label: "Methodes", value: "Méthodes" },
        { label: "Securite", value: "Sécurité" },
        { label: "Business", value: "Business" },
      ],
    },
    {
      name: "relatedTerms",
      type: "array",
      labels: { singular: "Terme lie", plural: "Termes lies" },
      fields: [{ name: "slug", type: "text", required: true }],
      admin: { description: "Slugs d'autres entrees glossaire" },
    },

    // Localises
    { name: "term", type: "text", required: true, localized: true, admin: { description: "Le terme tel qu'affiche (ex: RAG, K8s)" } },
    { name: "short", type: "textarea", required: true, localized: true, admin: { description: "1 phrase resume (affichee en liste)" } },
    { name: "definition", type: "textarea", required: true, localized: true, admin: { description: "2-4 phrases definition complete" } },
  ],
};

// ---------------------------------------------------------------------------
// TechRadar — 11 items (mirror dictionaries[lang].techRadar.items).
// Chaque item = 1 doc avec ring/category non-localises + name/rationale localises.
// ---------------------------------------------------------------------------
const TechRadar: CollectionConfig = {
  slug: "tech-radar",
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "ring", "category"],
    description: "Tech Radar — items 1 par doc, name/rationale localises.",
  },
  access: PUBLIC_READ_AUTH_WRITE,
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true, admin: { description: "Identifiant stable (ex: rust-for-systems)" } },
    {
      name: "ring",
      type: "select",
      required: true,
      options: [
        { label: "Adopt", value: "adopt" },
        { label: "Trial", value: "trial" },
        { label: "Assess", value: "assess" },
        { label: "Hold", value: "hold" },
      ],
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        // Categories actuellement utilisees dans dictionaries[lang].techRadar.items
        { label: "AI", value: "ai" },
        { label: "Languages", value: "languages" },
        { label: "Robotics", value: "robotics" },
        { label: "Infra", value: "infra" },
        { label: "Frontend", value: "frontend" },
        // Categories supplementaires pour future-proof
        { label: "Data", value: "data" },
        { label: "Security", value: "security" },
        { label: "Methods", value: "methods" },
        { label: "Tools", value: "tools" },
      ],
    },
    { name: "edition", type: "text", required: true, defaultValue: "2026-q2", admin: { description: "Slug de l'edition (ex: 2026-q2)" } },
    { name: "position", type: "number", admin: { description: "Ordre d'affichage dans la liste (0-indexed)" } },

    // Localises
    { name: "name", type: "text", required: true, localized: true },
    { name: "rationale", type: "textarea", required: true, localized: true },
  ],
};

// ---------------------------------------------------------------------------
// Team — vide pour l'instant (a remplir manuellement via /admin).
// Photos disponibles dans /public/team/team-{1..6}.jpg.
// ---------------------------------------------------------------------------
const Team: CollectionConfig = {
  slug: "team",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "geo", "active"],
    description: "Equipe Abbeal — fiches membres pour /about, /careers, etc.",
  },
  access: PUBLIC_READ_AUTH_WRITE,
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true, admin: { description: "URL slug (kebab-case). Ex: sebastien-lonjon" } },
    { name: "name", type: "text", required: true, admin: { description: "Prenom + Nom (ou prenom seul si anonymise)" } },
    { name: "active", type: "checkbox", defaultValue: true, admin: { description: "Decoche si la personne a quitte Abbeal (garde pour l'historique)" } },
    {
      name: "geo",
      type: "select",
      options: [
        { label: "Paris", value: "paris" },
        { label: "Tokyo", value: "tokyo" },
        { label: "Montreal", value: "montreal" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "photo", type: "text", admin: { description: "Chemin /public, ex: /team/team-1.jpg" } },
    { name: "linkedinUrl", type: "text" },
    { name: "githubUrl", type: "text" },
    { name: "joinedAt", type: "date" },

    // Localises
    { name: "role", type: "text", required: true, localized: true, admin: { description: 'Ex: "CEO", "Senior Engineer", "VP Growth"' } },
    { name: "bio", type: "textarea", localized: true, admin: { description: "2-4 phrases parcours + interets" } },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
//                             BUILD CONFIG
// ═══════════════════════════════════════════════════════════════════════════

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "http://localhost:3000",
  admin: {
    user: Users.slug,
    meta: { titleSuffix: "— Abbeal CMS" },
  },
  collections: [Users, Articles, Cases, LandingPages, Glossary, TechRadar, Team],
  editor: lexicalEditor(),
  localization: {
    locales: [
      { label: "Francais", code: "fr" },
      { label: "English", code: "en" },
      { label: "日本語", code: "ja" },
      { label: "Francais (Canada)", code: "fr-ca" },
    ],
    defaultLocale: "fr",
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET ?? "DEV_ONLY_change_me_in_prod",
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  // DB : SQLite local en dev, Turso (libsql hosted) en preview/prod Vercel.
  // Meme adapter @payloadcms/db-sqlite, juste l'URL change.
  //
  // Priorite d'env vars :
  //   1. TURSO_DATABASE_URL  + TURSO_AUTH_TOKEN  (injectes auto par Vercel
  //      Marketplace integration Turso — pas besoin de les ajouter a la main)
  //   2. DATABASE_URI        + DATABASE_AUTH_TOKEN (override manuel possible)
  //   3. file:./payload.db   (dev local, pas d'auth)
  db: sqliteAdapter({
    client: {
      url:
        process.env.TURSO_DATABASE_URL ??
        process.env.DATABASE_URI ??
        "file:./payload.db",
      ...(process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN
        ? {
            authToken:
              process.env.TURSO_AUTH_TOKEN ?? process.env.DATABASE_AUTH_TOKEN,
          }
        : {}),
    },
  }),
});
