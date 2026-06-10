/**
 * Payload CMS 3 config — PoC.
 *
 * 8 collections :
 *   - Users         (auth, API Keys pour Cowork)
 *   - Articles      (27 articles d'insights, body blocks 11 types)
 *   - Cases         (25 case studies, meme body blocks)
 *   - LandingPages  (6 landings SEO non-branded, meme body blocks)
 *   - Glossary      (54 termes techniques + Schema.org DefinedTerm)
 *   - TechRadar     (11 items × 4 locales, ring/category non-localises)
 *   - Team          (vide, a remplir manuellement via /admin)
 *   - JobOffers     (offres d'emploi /careers, cree par admins ou Cowork via API)
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

import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig, type Block, type CollectionConfig, type Where } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { resendAdapter } from "@payloadcms/email-resend";

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

// ---------------------------------------------------------------------------
// Helpers d'access control par role.
//
// 2 roles dans la collection Users : "admin" et "editor".
//   - admin   : full access partout. Reserve a Sebastien + Vianney.
//   - editor  : peut creer/editer SES PROPRES articles uniquement.
//               Read public sur tout, mais zero write sur les autres
//               collections (Cases, Landings, Glossary, TechRadar, Team, Users).
//
// Pattern : la plupart des collections sont "read public, write admin-only".
// Articles a un access custom (ownership) defini directement dans la collection.
// ---------------------------------------------------------------------------

/** User shape minimal pour les access rules. Eviter d'importer le type Payload
 *  complet qui n'existe pas encore au moment de la definition du config. */
type AccessUser = { id: number | string; role?: "admin" | "editor" } | null | undefined;

/** True si le user est authentifie ET admin. */
const isAdmin = (user: AccessUser): boolean => user?.role === "admin";

/** Access standard pour collections "admin-only writes" : Cases, Landings,
 *  Glossary, TechRadar, Team. Read public (le contenu est destine au site
 *  public abbeal.com), writes reservees aux admins. */
const PUBLIC_READ_ADMIN_WRITE = {
  read: () => true,
  create: ({ req: { user } }: { req: { user: AccessUser } }) => isAdmin(user),
  update: ({ req: { user } }: { req: { user: AccessUser } }) => isAdmin(user),
  delete: ({ req: { user } }: { req: { user: AccessUser } }) => isAdmin(user),
};

/** Cache une collection du sidebar /admin pour tout user qui n'est pas admin.
 *  L'API REST publique reste accessible (read public) — c'est juste l'UI qui
 *  masque. Use case : editors voient SEULEMENT Articles + leur profil Users,
 *  pas les autres collections qu'ils ne peuvent pas editer de toute facon. */
const HIDDEN_FROM_EDITORS = ({ user }: { user?: unknown }) => !isAdmin(user as AccessUser);

// ═══════════════════════════════════════════════════════════════════════════
//                             COLLECTIONS
// ═══════════════════════════════════════════════════════════════════════════

// ---------------------------------------------------------------------------
// Users — auth + API Keys (Cowork) + roles (admin/editor).
//
// Access :
//   - read    : un user voit son propre profil + les profils visibles par
//               son role (admin voit tout, editor ne voit que lui).
//   - create  : seul un admin peut creer un nouveau user (= inviter).
//   - update  : un user peut s'editer lui-meme. Un admin peut editer tous.
//               LE CHAMP `role` ne peut etre modifie QUE par un admin
//               (cf. field-level access ci-dessous) — sinon un editor
//               s'auto-promouvrait admin.
//   - delete  : seul un admin peut supprimer un user.
// ---------------------------------------------------------------------------
const Users: CollectionConfig = {
  slug: "users",
  // ⚠️ versions: désactivé (revert urgence Sebastien 2026-06-10). Causait
  // rollback des saves car les tables _v n'existent pas sur Turso prod.
  // Re-activer SEULEMENT après PAYLOAD_ALLOW_PUSH=1 sur Turso prod
  // (commande dans /tmp/SCHEMA-PUSH-REQUIRED.md). Voir incident W24.
  auth: {
    useAPIKey: true, // Header: Authorization: users API-Key <key>
    // Brute-force protection desactive : equipe interne tres petite
    // (Seb + Vianney + 3-4 redacteurs), pas exposee au public, et le
    // pattern "lock apres 5 echecs pour 10 min" cree des deadlocks
    // quand on debug ou que Chrome auto-fill un ancien password. On
    // accepte le trade-off securite vs UX pour cette taille d'equipe.
    // Reactiver maxLoginAttempts: 5, lockTime: 600000 si jamais l'equipe
    // edito grossit ou si on ouvre l'admin a un perimetre plus large.
    maxLoginAttempts: 0,
    // Customise les emails forgotPassword. Sert aussi pour le flow
    // d'invitation : quand un admin cree un user via /admin, le hook
    // afterChange (ci-dessous) declenche un forgotPassword auto qui
    // utilise ces templates. On detecte "invite vs vrai reset" via la
    // recence de createdAt (< 5 min apres create = invitation initiale).
    forgotPassword: {
      generateEmailSubject: (args) => {
        const u = ((args?.user ?? {}) as { createdAt?: string });
        const isInvite =
          !!u.createdAt &&
          Date.now() - new Date(u.createdAt).getTime() < 5 * 60 * 1000;
        return isInvite
          ? "Bienvenue dans le CMS Abbeal — definis ton mot de passe"
          : "Reinitialiser ton mot de passe Abbeal CMS";
      },
      generateEmailHTML: (args) => {
        const token = args?.token;
        const u = ((args?.user ?? {}) as {
          email?: string;
          firstName?: string;
          createdAt?: string;
        });
        const isInvite =
          !!u.createdAt &&
          Date.now() - new Date(u.createdAt).getTime() < 5 * 60 * 1000;
        const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
        const link = `${SITE}/admin/reset/${token}`;
        const firstName = u.firstName ? `, ${u.firstName}` : "";
        const intro = isInvite
          ? `Bonjour${firstName}, ton compte sur le CMS Abbeal vient d'etre cree. Pour activer ton acces, definis ton mot de passe en cliquant sur le lien ci-dessous (valide 1h).`
          : `Bonjour${firstName}, tu as demande la reinitialisation de ton mot de passe sur le CMS Abbeal. Clique sur le lien ci-dessous pour le redefinir (valide 1h).`;
        const cta = isInvite ? "Definir mon mot de passe" : "Reinitialiser mon mot de passe";
        return `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0c343d;max-width:560px;margin:0 auto;padding:32px 24px;line-height:1.6;">
  <h2 style="font-weight:600;letter-spacing:-0.02em;font-size:24px;margin-bottom:24px;">Abbeal CMS</h2>
  <p>${intro}</p>
  <p style="margin:32px 0;">
    <a href="${link}" style="display:inline-block;background:#0c343d;color:#fff;text-decoration:none;padding:14px 28px;font-weight:500;">${cta} →</a>
  </p>
  <p style="font-size:13px;color:#6b7280;">Si tu n'as pas demande cet email, ignore-le. Le lien expire automatiquement.</p>
  <hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
  <p style="font-size:12px;color:#9ca3af;">Abbeal — Pole d'ingenierie tri-geo Paris · Montreal · Tokyo</p>
</body></html>`;
      },
    },
  },
  admin: {
    useAsTitle: "email",
    description: "Comptes admin (auth Payload + API Keys pour Cowork). 2 roles : admin (Seb + Vianney) / editor (redacteurs articles).",
    defaultColumns: ["email", "role", "firstName", "lastName"],
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      const u = user as AccessUser;
      if (isAdmin(u)) return true;
      // Editor : voit que son propre profil
      return { id: { equals: u!.id } };
    },
    create: ({ req: { user } }) => isAdmin(user as AccessUser),
    update: ({ req: { user } }) => {
      if (!user) return false;
      const u = user as AccessUser;
      if (isAdmin(u)) return true;
      // Editor : peut editer son propre profil
      return { id: { equals: u!.id } };
    },
    delete: ({ req: { user } }) => isAdmin(user as AccessUser),
  },
  hooks: {
    beforeValidate: [
      ({ operation, data }) => {
        // INVITATION FLOW : si l'admin cree un user sans taper de password,
        // on en genere un random costaud que personne ne saura. Le user le
        // remplacera via le lien forgotPassword qu'il recevra par mail
        // (cf. afterChange ci-dessous).
        if (
          data &&
          operation === "create" &&
          (!data.password || data.password === "")
        ) {
          data.password = randomBytes(24).toString("hex");
        }
        return data;
      },
    ],
    beforeChange: [
      ({ operation, data, originalDoc }) => {
        // FIX BUG W24 : Payload UI reset apiKey/enableAPIKey a chaque save.
        //
        // Symptome (rapporte par Seb) : "les cle API ne sont pas remanente
        // et il faut reactiver l'option et recreer la cle a chaque fois".
        //
        // Cause : sur un save normal depuis /admin (ex. update firstName),
        // le PATCH payload envoie undefined pour apiKey/enableAPIKey si le
        // form ne les a pas explicitement modifies. Payload ecrit undefined
        // en DB -> la cle est wipee.
        //
        // Fix defensif : si on est en update ET que les champs apiKey ou
        // enableAPIKey ne sont pas explicitement fournis dans data MAIS
        // qu'ils existent dans originalDoc (DB row actuel), on les preserve.
        //
        // Trade-off : si Seb VEUT vraiment desactiver une cle via UI, il
        // devra utiliser le script payload-set-api-key.ts (overrideAccess
        // bypass) ou un curl direct API. Mais c'est rare ; la priorite
        // est que les cles persistent dans le flow normal.
        if (operation === "update" && originalDoc) {
          if (
            typeof data.enableAPIKey === "undefined" &&
            typeof originalDoc.enableAPIKey !== "undefined"
          ) {
            data.enableAPIKey = originalDoc.enableAPIKey;
          }
          if (
            (typeof data.apiKey === "undefined" || data.apiKey === null) &&
            originalDoc.apiKey
          ) {
            data.apiKey = originalDoc.apiKey;
          }
        }
        return data;
      },
    ],
    afterChange: [
      async ({ operation, doc, req }) => {
        // INVITATION FLOW : nouveau user cree -> on declenche forgotPassword
        // pour qu'il recoive un email "bienvenue, definis ton mot de passe".
        // Customisation : le template generateEmailSubject/HTML ci-dessus
        // detecte que createdAt est recent et adapte le wording.
        if (operation !== "create") return doc;
        if (!doc.email) return doc;
        try {
          await req.payload.forgotPassword({
            collection: "users",
            data: { email: doc.email as string },
          });
          req.payload.logger.info(
            `Invitation email sent to ${doc.email} (id=${doc.id})`,
          );
        } catch (err) {
          req.payload.logger.error(
            { err, email: doc.email },
            "Failed to send invitation email — verifier RESEND_API_KEY et CMS_EMAIL_FROM",
          );
          // Ne PAS throw : le user est cree avec un password random,
          // l'admin peut re-trigger l'invitation manuellement si l'email
          // a foire (ou utiliser la fonction "Forgot password" de l'UI).
        }
        return doc;
      },
    ],
  },
  fields: [
    { name: "firstName", type: "text" },
    { name: "lastName", type: "text" },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      // CRITICAL : sans saveToJWT=true, le role n'est PAS inclus dans le
      // token JWT renvoye au login. Resultat : req.user.role === undefined
      // cote serveur sur les requests authentifiees, et toutes les access
      // rules basees sur isAdmin(user) retournent false meme pour les
      // vrais admins. Bug detecte W22 : Sebastien (admin en DB) ne pouvait
      // pas creer de user via /admin -> "You are not allowed".
      saveToJWT: true,
      options: [
        { label: "Admin (full access)", value: "admin" },
        { label: "Editor (ses propres articles uniquement)", value: "editor" },
      ],
      admin: {
        description:
          "Admin = Seb + Vianney, full access partout. Editor = redacteur, peut creer/editer SES articles uniquement.",
      },
      access: {
        // Field-level : seul un admin peut modifier le role d'un user.
        // Sinon un editor s'auto-promouvrait admin via PATCH /api/users/{id}.
        update: ({ req: { user } }) => isAdmin(user as AccessUser),
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Articles — 27 articles d'insights /insights (mirror lib/articles.ts).
//
// Access ownership :
//   - read    : public (le contenu est sur abbeal.com)
//   - create  : tout user authentifie (admin OR editor)
//   - update  : admin sur tout. Editor uniquement sur ses propres articles
//               (filter where author == user.id).
//   - delete  : idem update.
//
// Le champ `author` est rempli automatiquement au create par le hook
// beforeChange ci-dessous (= user courant qui POST). Apres ca, immuable
// pour les editors (un editor ne peut pas transferer son article a un
// autre editor pour bypasser l'access rule).
// ---------------------------------------------------------------------------
const Articles: CollectionConfig = {
  slug: "articles",
  // ⚠️ versions désactivé (revert urgence). Re-activer après schema push.
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "tag", "status", "author", "publishedAt", "featured"],
    description: "Articles d'insights /insights. Workflow: Editor cree en Draft -> soumet en Pending review -> Admin valide en Published.",
  },
  // Read access avec workflow status (W22 publish workflow) :
  //   - public (non logge)  : voit uniquement les articles "published"
  //   - editor              : voit "published" de tout le monde + tous SES drafts/pending
  //   - admin               : voit tout
  // Write access :
  //   - create  : tout user authentifie (en draft par defaut)
  //   - update  : admin sur tout. Editor uniquement sur ses propres articles
  //               (filter where author == user.id) MAIS ne peut pas passer
  //               status en "published" (cf field-level access sur status).
  //   - delete  : idem update.
  access: {
    read: ({ req: { user } }) => {
      const u = user as AccessUser;
      if (isAdmin(u)) return true;
      if (u) {
        // Editor : published de tout le monde + ses propres drafts/pending
        const w: Where = {
          or: [
            { status: { equals: "published" } },
            { author: { equals: u.id } },
          ],
        };
        return w;
      }
      // Public non-logge : uniquement les articles published
      const w: Where = { status: { equals: "published" } };
      return w;
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => {
      if (!user) return false;
      const u = user as AccessUser;
      if (isAdmin(u)) return true;
      // Editor : seulement ses propres articles
      return { author: { equals: u!.id } };
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      const u = user as AccessUser;
      if (isAdmin(u)) return true;
      return { author: { equals: u!.id } };
    },
  },
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        // Au create : auto-remplit author avec le user courant (req.user).
        if (operation === "create" && req.user && !data.author) {
          data.author = req.user.id;
        }
        // Sur create, si status n'est pas defini, force "draft".
        if (operation === "create" && !data.status) {
          data.status = "draft";
        }
        // CRITICAL : un editor ne peut PAS publier directement. Si un editor
        // essaie de set status=published, on downgrade en pending_review
        // (= sa soumission pour validation admin). Belt + suspenders avec
        // le field-level access qui check aussi.
        if (
          data.status === "published" &&
          req.user &&
          !isAdmin(req.user as AccessUser)
        ) {
          data.status = "pending_review";
        }
        return data;
      },
    ],
    // AUTO-TRANSLATION : a chaque save d'un article FR, on traduit
    // automatiquement vers EN/JA/FR-CA via Claude API si les autres
    // locales sont vides. Cf lib/translate-article.ts.
    //
    // Skip si :
    //   - context.autoTranslate = true (= recursion suite a notre propre update)
    //   - ANTHROPIC_API_KEY absent (graceful, log warning)
    //   - locale cible deja remplie avec un title different du FR
    //
    // L'admin peut toujours editer manuellement les traductions apres
    // dans /admin (selecteur de locale en haut a droite).
    afterChange: [
      async ({ req, doc, operation, context }) => {
        if ((context as { autoTranslate?: boolean })?.autoTranslate) return doc;
        if (operation !== "create" && operation !== "update") return doc;

        const d = doc as Record<string, unknown>;
        const frTitle = typeof d.title === "string" ? d.title : null;
        if (!frTitle) return doc;

        // Lazy import to avoid loading on collections that don't translate
        const { translateArticle } = await import("./lib/translate-article");

        const source = {
          title: frTitle,
          excerpt: typeof d.excerpt === "string" ? d.excerpt : "",
          metaDescription:
            typeof d.metaDescription === "string"
              ? d.metaDescription
              : undefined,
          body: Array.isArray(d.body)
            ? (d.body as Array<Record<string, unknown> & { type: string }>)
            : [],
        };

        // Fire-and-forget en parallel pour les 3 locales. On n'attend pas la
        // fin (jusqu'a 30s par locale via Claude) pour ne pas bloquer la
        // reponse /admin. Erreurs logged via req.payload.logger.
        const targets = ["en", "ja", "fr-ca"] as const;
        for (const locale of targets) {
          (async () => {
            try {
              const existing = await req.payload.findByID({
                collection: "articles",
                id: doc.id as number,
                locale,
              });
              const existingTitle = (existing as { title?: string }).title;
              // Skip si traduction deja faite manuellement (= title diff du FR)
              if (existingTitle && existingTitle !== frTitle) return;

              const translated = await translateArticle(source, locale);
              if (!translated) return;

              await req.payload.update({
                collection: "articles",
                id: doc.id as number,
                locale,
                data: translated as Record<string, unknown>,
                overrideAccess: true,
                context: { autoTranslate: true },
              });

              req.payload.logger.info(
                `[auto-translate] article ${doc.id} -> ${locale} OK`,
              );
            } catch (err) {
              req.payload.logger.error(
                { err, id: doc.id, locale },
                "[auto-translate] failed",
              );
            }
          })();
        }
        return doc;
      },
    ],
  },
  fields: [
    { name: "slug", type: "text", required: true, unique: true, index: true },
    {
      name: "status",
      type: "select",
      // required: false au schema-level pour permettre l'ajout sur table peuplee
      // sans drop. Le hook beforeChange force "draft" au create si pas defini.
      required: false,
      defaultValue: "draft",
      options: [
        { label: "Draft (brouillon)", value: "draft" },
        { label: "Pending review (soumis a validation)", value: "pending_review" },
        { label: "Published (en ligne)", value: "published" },
      ],
      admin: {
        description:
          "Workflow : Draft (brouillon, invisible publiquement) → Pending review (= je soumets à Seb/Vianney pour validation) → Published (seul admin peut basculer, l'article apparaît sur abbeal.com). Si un editor sélectionne 'Published' et sauvegarde, le système redescend automatiquement en 'Pending review' (= équivalent à soumettre).",
        position: "sidebar",
      },
      access: {
        // Field-level : seul un admin peut set le status a "published".
        // L'update est autorise pour tous, mais le hook beforeChange ci-dessous
        // empeche un editor de set "published" (rejette ou downgrade en
        // "pending_review"). Cette field-level access est un filet de plus.
        update: ({ req: { user }, data }) => {
          // Si on essaie de passer en "published", seul un admin l'autorise.
          if ((data as Record<string, unknown>)?.status === "published") {
            return isAdmin(user as AccessUser);
          }
          return true;
        },
      },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      // required: false volontairement au schema-level pour pouvoir ajouter
      // ce champ sur une table avec lignes existantes sans drop (sinon SQLite
      // refuse NOT NULL sans default sur une table peuplee). Le hook
      // beforeChange ci-dessus force quand meme l'author au create, donc
      // c'est require functionnellement pour les NOUVEAUX articles.
      // Les articles pre-existants sont back-filles via scripts/payload-migrate-roles.ts.
      required: false,
      admin: {
        description: "Auteur de l'article (auto-rempli au create). Modifiable seulement par un admin.",
        position: "sidebar",
      },
      access: {
        // Field-level : seul un admin peut REASSIGNER l'auteur d'un article.
        // Sinon un editor pourrait transferer ses articles a un autre user
        // pour bypasser l'access rule update/delete.
        update: ({ req: { user } }) => isAdmin(user as AccessUser),
      },
    },
    { name: "featured", type: "checkbox", defaultValue: false },
    { name: "featuredOnHome", type: "checkbox" },
    { name: "tag", type: "text", required: true, admin: { description: "Ex: IA, Engineering, Talent, Mobbeal, Business" } },
    { name: "readTime", type: "text", required: true, admin: { description: 'Ex: "5 min"' } },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      admin: {
        // Format europeen JJ/MM/AAAA (au lieu de MM/JJ/AAAA US par defaut)
        date: { displayFormat: "dd/MM/yyyy", pickerAppearance: "dayOnly" },
      },
    },
    {
      name: "updatedAt",
      type: "date",
      admin: {
        date: { displayFormat: "dd/MM/yyyy", pickerAppearance: "dayOnly" },
      },
    },
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
      admin: {
        description:
          "FAQ optionnelle (4-6 Q/R recommandé). Rendu en bas de l'article + injecté en Schema.org FAQPage JSON-LD → éligible aux Rich Results Google (encart FAQ déroulable dans la SERP) et lu par les LLM (ChatGPT, Perplexity, Claude) pour répondre aux requêtes utilisateurs. Format Q/A en français/anglais/etc. par locale. Booste très visiblement la SERP. Laisse vide si l'article n'a pas naturellement de questions.",
      },
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
  // ⚠️ versions désactivé (revert urgence). Re-activer après schema push.
  slug: "cases",
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "sector", "geo", "publishedAt", "featured"],
    description: "Case studies /cases. 4 langues. Body = blocks.",
    hidden: HIDDEN_FROM_EDITORS, // cache du sidebar admin pour editors (API publique reste accessible)
  },
  access: PUBLIC_READ_ADMIN_WRITE,
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
    {
      name: "publishedAt",
      type: "date",
      required: true,
      admin: {
        // Format europeen JJ/MM/AAAA (au lieu de MM/JJ/AAAA US par defaut)
        date: { displayFormat: "dd/MM/yyyy", pickerAppearance: "dayOnly" },
      },
    },

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
  // ⚠️ versions désactivé (revert urgence). Re-activer après schema push.
  slug: "landing-pages",
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "h1"],
    description: "Landing pages SEO non-branded. 4 langues. Body = blocks + FAQ.",
    hidden: HIDDEN_FROM_EDITORS,
  },
  access: PUBLIC_READ_ADMIN_WRITE,
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
  // ⚠️ versions désactivé (revert urgence). Re-activer après schema push.
  slug: "glossary",
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "category"],
    description: "Glossaire technique. 54 termes, 4 langues, schema DefinedTerm.",
    hidden: HIDDEN_FROM_EDITORS,
  },
  access: PUBLIC_READ_ADMIN_WRITE,
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
  // ⚠️ versions désactivé (revert urgence). Re-activer après schema push.
  slug: "tech-radar",
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "ring", "category"],
    description: "Tech Radar — items 1 par doc, name/rationale localises.",
    hidden: HIDDEN_FROM_EDITORS,
  },
  access: PUBLIC_READ_ADMIN_WRITE,
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
  // ⚠️ versions désactivé (revert urgence). Re-activer après schema push.
  slug: "team",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "geo", "active"],
    description: "Equipe Abbeal — fiches membres pour /about, /careers, etc.",
    hidden: HIDDEN_FROM_EDITORS,
  },
  access: PUBLIC_READ_ADMIN_WRITE,
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
    {
      name: "joinedAt",
      type: "date",
      admin: {
        date: { displayFormat: "dd/MM/yyyy", pickerAppearance: "dayOnly" },
      },
    },

    // Localises
    { name: "role", type: "text", required: true, localized: true, admin: { description: 'Ex: "CEO", "Senior Engineer", "VP Growth"' } },
    { name: "bio", type: "textarea", localized: true, admin: { description: "2-4 phrases parcours + interets" } },
  ],
};

// ---------------------------------------------------------------------------
// JobOffers — offres d'emploi publiees sur /careers.
//
// Use case principal : Cowork detecte un nouveau besoin commercial, POST
// automatiquement une offre via /api/job-offers (auth API Key). Le workflow
// draft -> pending_review -> published assure qu'un humain valide avant
// publication.
//
// Access : seuls les admins (Seb + Vianney) peuvent creer/editer/supprimer.
// Read public (les offres apparaissent sur abbeal.com/careers).
// Editors ne voient PAS cette collection dans /admin sidebar.
//
// Workflow status : meme logique qu'Articles. Editor cree -> Pending review
// -> Admin valide en Published. Mais comme l'access write est admin-only,
// en pratique seuls admins peuvent meme creer une draft → le workflow est
// "Admin cree direct en Published" OU "Cowork cree en Draft -> Admin valide
// en Published".
// ---------------------------------------------------------------------------
const JobOffers: CollectionConfig = {
  slug: "job-offers",
  // ⚠️ versions DESACTIVE (revert urgence 2026-06-10).
  //
  // Cause : avec versions activee + tables _job_offers_v absentes en Turso
  // prod (schema push pas effectue), les save offers du /admin etaient en
  // transaction rollback : l'offre apparait brievement (cache CDN frontend)
  // puis disparait (Payload rollback la row principale + revision). Resultat :
  // Sebastien voit l'offre 5 secondes puis 404.
  //
  // Pour reactiver : run PAYLOAD_ALLOW_PUSH=1 contre Turso prod APRES le
  // deploy de cette PR (= schema sans versions = pas d'erreur attendue).
  // Puis re-add `versions: { maxPerDoc: 20 }` dans une PR separee.
  //
  // Migration : enabling versions sur une collection existante AJOUTE des
  // tables (_job_offers_v, _job_offers_v_locales, etc.). Operation non-
  // destructive cote schema. Run PAYLOAD_ALLOW_PUSH=1 contre Turso prod
  // apres le merge pour creer les tables. Les rows existantes ne sont pas
  // recuperees (le passe est perdu), mais a partir du push toutes les
  // edits sont versionnees.
  // Ligne suivante DESACTIVEE temporairement (cf commentaire en haut) :
  // versions: { maxPerDoc: 20 },
  admin: {
    useAsTitle: "slug",
    defaultColumns: [
      "slug",
      "status",
      "location",
      "contractType",
      "experienceLevel",
      "publishedAt",
    ],
    description:
      "Offres d'emploi publiees sur /careers. Workflow draft -> pending_review -> published. Cowork peut creer via POST /api/job-offers (auth API Key admin).",
    hidden: HIDDEN_FROM_EDITORS, // editors ne voient pas dans le sidebar
  },
  access: PUBLIC_READ_ADMIN_WRITE, // read public, write admin-only
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        // Auto-fill author au create avec le user courant.
        if (operation === "create" && req.user && !data.author) {
          data.author = req.user.id;
        }
        if (operation === "create" && !data.status) {
          data.status = "draft";
        }
        return data;
      },
    ],
    // On-demand ISR revalidation : fix le bug "offre Published n'apparait
    // pas sur /careers pendant des heures" (cache CDN Vercel >35h observe
    // en W24 malgre revalidate=300). A chaque save/update/delete, on POST
    // /api/revalidate pour les 4 locales -> /careers refait un SSR frais
    // a la prochaine request, offre visible sous <5s.
    //
    // Fire-and-forget : on n'attend pas la reponse pour ne pas bloquer le
    // save dans /admin. Si revalidate fail (network, secret missing), on
    // log mais on continue.
    afterChange: [
      async ({ req }) => {
        const secret = process.env.REVALIDATE_SECRET;
        if (!secret) {
          req.payload?.logger?.warn?.(
            "[JobOffers] REVALIDATE_SECRET not set -> /careers cache won't auto-refresh",
          );
          return;
        }
        const base =
          process.env.PAYLOAD_PUBLIC_SERVER_URL ??
          (process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "https://abbeal.com");
        const paths = [
          // Listing /careers
          "/fr/careers",
          "/en/careers",
          "/ja/careers",
          "/fr-ca/careers",
          // Home (CareersTeaser cumule les offres CMS)
          "/fr",
          "/en",
          "/ja",
          "/fr-ca",
        ];
        // Fire-and-forget : pas de await pour ne pas bloquer le save admin.
        // Les erreurs sont logged mais n'interrompent pas le flux Payload.
        for (const path of paths) {
          fetch(`${base}/api/revalidate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path, secret }),
          }).catch((err) => {
            req.payload?.logger?.error?.(
              `[JobOffers] revalidate ${path} failed : ${err?.message ?? err}`,
            );
          });
        }
      },
      // AUTO-TRANSLATION : meme pattern que Articles (cf hook PR #21). Save
      // une offre FR -> Claude traduit auto vers EN/JA/FR-CA si vides.
      // Permet a Cowork de POST en FR seulement et avoir les 4 locales sous
      // ~90s automatiquement.
      async ({ req, doc, operation, context }) => {
        if ((context as { autoTranslate?: boolean })?.autoTranslate) return doc;
        if (operation !== "create" && operation !== "update") return doc;

        const d = doc as Record<string, unknown>;
        const frTitle = typeof d.title === "string" ? d.title : null;
        if (!frTitle) return doc;

        const { translateArticle } = await import("./lib/translate-article");

        const source = {
          title: frTitle,
          excerpt: typeof d.excerpt === "string" ? d.excerpt : "",
          metaDescription:
            typeof d.metaDescription === "string"
              ? d.metaDescription
              : undefined,
          body: Array.isArray(d.description)
            ? (d.description as Array<Record<string, unknown> & { type: string }>)
            : [],
        };

        const targets = ["en", "ja", "fr-ca"] as const;
        for (const locale of targets) {
          (async () => {
            try {
              const existing = await req.payload.findByID({
                collection: "job-offers",
                id: doc.id as number,
                locale,
              });
              const existingTitle = (existing as { title?: string }).title;
              if (existingTitle && existingTitle !== frTitle) return;

              const translated = await translateArticle(source, locale);
              if (!translated) return;

              // Strip block IDs (cf fix admin/translate route.ts)
              const stripIds = (blocks: Array<Record<string, unknown>>) =>
                blocks.map(({ id: _id, ...rest }) => rest);
              const translatedBody = Array.isArray(translated.body)
                ? stripIds(
                    translated.body as Array<Record<string, unknown>>,
                  )
                : [];

              await req.payload.update({
                collection: "job-offers",
                id: doc.id as number,
                locale,
                data: {
                  title: translated.title,
                  excerpt: translated.excerpt,
                  ...(translated.metaDescription
                    ? { metaDescription: translated.metaDescription }
                    : {}),
                  description: translatedBody,
                } as unknown as Record<string, unknown>,
                overrideAccess: true,
                context: { autoTranslate: true },
              });

              req.payload.logger.info(
                `[JobOffers auto-translate] ${doc.id} -> ${locale} OK`,
              );
            } catch (err) {
              req.payload.logger.error(
                { err, id: doc.id, locale },
                "[JobOffers auto-translate] failed",
              );
            }
          })();
        }
        return doc;
      },
    ],
  },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL slug kebab-case. Ex: senior-backend-engineer-tokyo" },
    },
    {
      name: "status",
      type: "select",
      required: false,
      defaultValue: "draft",
      options: [
        { label: "Draft (brouillon)", value: "draft" },
        { label: "Pending review (soumis a validation)", value: "pending_review" },
        { label: "Published (en ligne sur /careers)", value: "published" },
      ],
      admin: {
        description:
          "Workflow : Draft → Pending review → Published. Seuls les Published apparaissent sur /careers.",
        position: "sidebar",
      },
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      required: false,
      admin: {
        description: "Auteur de l'offre (auto-rempli au create). Pour Cowork = user admin dont la cle API a ete utilisee.",
        position: "sidebar",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Remonte en haut de /careers" },
    },

    // Localises
    { name: "title", type: "text", required: true, localized: true, admin: { description: 'Ex: "Senior Backend Engineer — Tokyo"' } },
    { name: "excerpt", type: "textarea", required: true, localized: true, admin: { description: "1-2 phrases pour la card listing /careers" } },
    { name: "metaDescription", type: "textarea", localized: true, admin: { description: "Meta SEO 140-160 chars (fallback excerpt)" } },

    // Champs metier non-localises
    {
      name: "location",
      type: "select",
      required: true,
      options: [
        { label: "Paris", value: "paris" },
        { label: "Tokyo", value: "tokyo" },
        { label: "Montréal", value: "montreal" },
        { label: "Tri-géo (Paris · Montréal · Tokyo)", value: "tri-geo" },
        { label: "Remote (EU)", value: "remote-eu" },
        { label: "Remote (worldwide)", value: "remote-ww" },
      ],
    },
    {
      name: "contractType",
      type: "select",
      required: true,
      options: [
        { label: "CDI", value: "cdi" },
        { label: "Freelance / Contractor", value: "freelance" },
        { label: "Stage", value: "stage" },
        { label: "VIE", value: "vie" },
        { label: "PVT (Working Holiday)", value: "pvt" },
        { label: "Alternance", value: "alternance" },
      ],
    },
    {
      name: "experienceLevel",
      type: "select",
      required: true,
      options: [
        { label: "Junior (0-2 ans)", value: "junior" },
        { label: "Confirmé (3-5 ans)", value: "confirme" },
        { label: "Senior (6-9 ans)", value: "senior" },
        { label: "Lead / Staff+ (10+ ans)", value: "lead-plus" },
      ],
    },
    {
      name: "techStack",
      type: "array",
      labels: { singular: "Tech", plural: "Tech stack" },
      fields: [{ name: "name", type: "text", required: true }],
      admin: { description: "Ex: Go, Kubernetes, PostgreSQL, Pinecone" },
    },
    {
      name: "salaryRange",
      type: "text",
      admin: { description: 'Optionnel. Ex: "60-80k€", "selon experience", "8M-12M JPY"' },
    },
    {
      name: "applyUrl",
      type: "text",
      required: true,
      admin: {
        description:
          'URL Welcome to the Jungle / Typeform / mailto. Ex: "https://www.welcometothejungle.com/..." ou "mailto:recrutement@abbeal.com?subject=Senior+Backend+Tokyo"',
      },
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
      admin: {
        date: { displayFormat: "dd/MM/yyyy", pickerAppearance: "dayOnly" },
      },
    },
    {
      name: "closedAt",
      type: "date",
      admin: {
        description: "Date de fermeture du poste (optionnelle). Apres cette date l'offre n'est plus visible sur /careers.",
        date: { displayFormat: "dd/MM/yyyy", pickerAppearance: "dayOnly" },
      },
    },
    {
      name: "relatedCaseSlugs",
      type: "array",
      labels: { singular: "Case lie", plural: "Cases lies" },
      fields: [{ name: "slug", type: "text", required: true }],
      admin: { description: "Slugs de cases qui montrent du travail similaire — affiches en bas de l'offre." },
    },

    // Body : description longue en blocks (meme 11 types qu'Articles/Cases)
    {
      name: "description",
      type: "blocks",
      required: true,
      localized: true,
      labels: { singular: "bloc", plural: "blocs" },
      blocks: STANDARD_CONTENT_BLOCKS,
      admin: { description: "Description complete : missions, profil recherche, equipe, methodes. Utilise h2/p/list/callout/code." },
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
//                             BUILD CONFIG
// ═══════════════════════════════════════════════════════════════════════════

// CSRF / serverURL config (W22 — fix critical "user=null" sur POST /api/users
// en prod).
// Payload protege les writes via une comparaison entre la request Origin et
// serverURL/csrf list. Sans serverURL = bon hostname en prod, Payload reject
// silencieusement le cookie d'auth → user=null cote serveur → "You are not
// allowed" sur toute action POST/PATCH/DELETE.
//
// Priorite serverURL :
//   1. PAYLOAD_PUBLIC_SERVER_URL (override manuel)
//   2. https://${VERCEL_URL}     (auto-set par Vercel sur preview deploys)
//   3. https://abbeal.com        (prod custom domain par defaut)
//   4. http://localhost:3000     (dev local)
const PROD_URL = "https://abbeal.com";
const VERCEL_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null;
const RESOLVED_SERVER_URL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL ??
  VERCEL_URL ??
  (process.env.NODE_ENV === "production" ? PROD_URL : "http://localhost:3000");

export default buildConfig({
  serverURL: RESOLVED_SERVER_URL,
  // Liste explicite des origins autorises pour les writes (CSRF protection).
  // Toujours inclure le custom domain prod + le current VERCEL_URL (preview).
  csrf: [PROD_URL, `https://www.abbeal.com`, VERCEL_URL].filter(
    (url): url is string => Boolean(url),
  ),
  admin: {
    user: Users.slug,
    meta: { titleSuffix: "— Abbeal CMS" },
  },
  collections: [Users, Articles, Cases, LandingPages, Glossary, TechRadar, Team, JobOffers],
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
  // Email adapter Resend (Phase 2/3 W22 CMS).
  // Utilise pour :
  //   - forgotPassword (envoi du lien de reset password)
  //   - invitation new user (declenche le forgotPassword en hook
  //     afterChange — Phase 3 a venir)
  //
  // Env vars :
  //   RESEND_API_KEY     : deja present (reutilise par /api/contact)
  //   CMS_EMAIL_FROM     : optionnel, ex "Abbeal CMS <cms@abbeal.com>"
  //                        Fallback : "Abbeal CMS <contact@abbeal.com>"
  //                        (contact@abbeal.com est un sender Resend deja verifie)
  //   CMS_EMAIL_NAME     : optionnel, fallback "Abbeal CMS"
  //
  // En dev local sans RESEND_API_KEY, Payload log les emails en console
  // (cf. ConsoleAdapter fallback ci-dessous).
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress:
          process.env.CMS_EMAIL_FROM ?? "contact@abbeal.com",
        defaultFromName: process.env.CMS_EMAIL_NAME ?? "Abbeal CMS",
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  // DB : SQLite local en dev, Turso (libsql hosted) en preview/prod Vercel.
  // Meme adapter @payloadcms/db-sqlite, juste l'URL change.
  //
  // Priorite d'env vars :
  //   1. TURSO_DATABASE_URL  + TURSO_AUTH_TOKEN  (injectes auto par Vercel
  //      Marketplace integration Turso — pas besoin de les ajouter a la main)
  //   2. DATABASE_URI        + DATABASE_AUTH_TOKEN (override manuel possible)
  //   3. file:./payload.db   (dev local, pas d'auth)
  //
  // CRITICAL — push: false en PROD pour eviter data loss (W22 incident) :
  //   Par defaut Payload + db-sqlite push automatiquement le schema au boot
  //   (drizzle-kit push). En prod serverless, ce push tourne SILENCIEUSEMENT
  //   sans le prompt interactif "DATA LOSS WARNING — accept?". Resultat
  //   observe : on a perdu 2 users quand un changement de schema (drop de
  //   login_attempts apres maxLoginAttempts:0) a ete deploye en prod.
  //
  //   Fix : push activatif SEULEMENT en dev local. En preview + prod (Vercel
  //   NODE_ENV=production), aucun push auto. Les migrations de schema en
  //   prod passent par les scripts explicites (pnpm tsx scripts/...) qu'on
  //   run a la main APRES verification + backup mental de l'etat.
  db: sqliteAdapter({
    client: {
      // PRIORITE :
      //   1. TURSO_PRIMARY_URL — override manuel pour pointer vers la primary
      //      branch (pas la dpl-XXX ephemere creee par Vercel-Turso integration
      //      a chaque deploy). Critique pour persistance des writes admin.
      //      Cause investigation W24 2026-06-10 : la Vercel-Turso integration
      //      Marketplace cree une branche dpl-XXX par deploy. TURSO_DATABASE_URL
      //      qu elle inject pointe vers cette branche ephemere, donc tous les
      //      writes admin (offres, API keys, etc.) sont perdus au deploy suivant.
      //   2. TURSO_DATABASE_URL — fallback (peut-etre dpl-XXX si integration active)
      //   3. DATABASE_URI — legacy
      //   4. file:./payload.db — dev local
      url:
        process.env.TURSO_PRIMARY_URL ??
        process.env.TURSO_DATABASE_URL ??
        process.env.DATABASE_URI ??
        "file:./payload.db",
      ...(process.env.TURSO_PRIMARY_AUTH_TOKEN ||
      process.env.TURSO_AUTH_TOKEN ||
      process.env.DATABASE_AUTH_TOKEN
        ? {
            authToken:
              process.env.TURSO_PRIMARY_AUTH_TOKEN ??
              process.env.TURSO_AUTH_TOKEN ??
              process.env.DATABASE_AUTH_TOKEN,
          }
        : {}),
    },
    // Disable auto schema push :
    //   - en runtime PROD/PREVIEW (NODE_ENV=production sur Vercel serverless)
    //   - DES QU'ON PARLE A TURSO (= scripts locaux avec env vars TURSO_*
    //     pullees pour migrer/reassign), pour eviter qu'un drift de schema
    //     local cause un drop de columns + rows perdues sur Turso
    // Push:true autorise SEULEMENT en dev local pur (SQLite local, pas de Turso).
    //
    // ESCAPE HATCH : PAYLOAD_ALLOW_PUSH=1 force push:true meme contre Turso.
    // Usage exceptionnel : ajouter une nouvelle table (CREATE TABLE = non-destructif),
    // run drizzle-kit avec prompt Y/N visible. JAMAIS en CI/CD, JAMAIS en deploy.
    // Toujours faire 'list-users' avant + apres pour verifier l'integrite.
    push:
      process.env.PAYLOAD_ALLOW_PUSH === "1"
        ? true
        : process.env.NODE_ENV !== "production" && !process.env.TURSO_DATABASE_URL,
  }),
});
