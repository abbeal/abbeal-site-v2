import type { CollectionConfig } from "payload";

/**
 * Articles — collection PoC.
 *
 * Modele le type `Article` de lib/articles.ts en Payload :
 * - champs scalaires non-localises (slug, tag, dates, flags)
 * - champs editoriaux localises (title, excerpt, meta...) en 4 langues
 *   (fr / en / ja / fr-ca), defaultLocale fr
 * - body en Blocks localise, avec les 11 types de blocks du site qui
 *   correspondent 1:1 a l'union ArticleBlock de lib/articles.ts
 *
 * Le PoC ne touche PAS le rendu : les pages publiques continuent de lire
 * lib/articles.ts. Cette collection est juste un miroir Payload populé
 * par script de migration.
 */
export const Articles: CollectionConfig = {
  slug: "articles",
  admin: {
    useAsTitle: "slug",
    defaultColumns: ["slug", "tag", "publishedAt", "featured"],
    description:
      "Articles d'insights publies sur /insights. Localise en 4 langues. Champ body = blocks (h2/p/list/...).",
  },
  fields: [
    // --- Identifiants & meta non-localisees ---
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL slug (kebab-case). Ex: kwik-reading-jim-kwik" },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Remonte en haut de /insights" },
    },
    {
      name: "featuredOnHome",
      type: "checkbox",
      admin: {
        description:
          "Inclus dans le bloc Insights de la home (3 slots). Si vide, fallback sur 'featured'.",
      },
    },
    {
      name: "tag",
      type: "text",
      required: true,
      admin: { description: "Ex: Engineering, Talent, IA, Mobbeal, Business" },
    },
    {
      name: "readTime",
      type: "text",
      required: true,
      admin: { description: 'Ex: "5 min"' },
    },
    {
      name: "publishedAt",
      type: "date",
      required: true,
    },
    {
      name: "updatedAt",
      type: "date",
      admin: { description: "Si different de publishedAt, affiche 'mis a jour le'" },
    },
    {
      name: "relatedCaseSlug",
      type: "text",
      admin: { description: "Slug d'un case study a lier en bas d'article" },
    },
    {
      name: "relatedServiceSlug",
      type: "text",
      admin: { description: "Slug d'un service a lier en bas d'article" },
    },

    // --- Champs editoriaux localises ---
    { name: "title", type: "text", required: true, localized: true },
    { name: "excerpt", type: "textarea", required: true, localized: true },
    { name: "metaDescription", type: "textarea", localized: true },
    { name: "keywords", type: "textarea", localized: true },

    // --- FAQ localisee (FAQPage schema.org) ---
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

    // --- Body : champ Blocks localise (11 types matchant ArticleBlock) ---
    {
      name: "body",
      type: "blocks",
      required: true,
      localized: true,
      labels: { singular: "bloc", plural: "blocs" },
      blocks: [
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
      ],
    },
  ],
};
