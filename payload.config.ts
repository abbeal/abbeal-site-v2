/**
 * Payload CMS 3 config — PoC.
 *
 * Scope PoC :
 * - 1 seule collection : Articles (mirror du modele `Article` de lib/articles.ts)
 * - SQLite local (fichier ./payload.db) — Postgres viendra a la bascule prod
 * - 4 locales (fr/en/ja/fr-ca), defaultLocale fr, fallback active
 * - Le rendu public ne lit PAS encore Payload : c'est juste un admin
 *   adressable a /admin + une API write a /api/articles
 *
 * Lancement local :
 *   PAYLOAD_SECRET=dev-secret pnpm dev
 *   → admin sur http://localhost:3000/admin
 *
 * Migration :
 *   pnpm tsx scripts/payload-migrate-articles.ts (a venir)
 */

import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { Articles } from "./payload/collections/Articles";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL ?? "http://localhost:3000",
  admin: {
    user: "users", // collection auth par defaut Payload (auto-creee si absente)
    meta: {
      titleSuffix: "— Abbeal CMS",
    },
  },
  collections: [Articles],
  editor: lexicalEditor(),
  // i18n SITE : meme 4 locales que le front Next. defaultLocale=fr est la
  // langue canonique pour les articles Abbeal-natifs ; les articles guest
  // peuvent etre canonique-EN via le meme champ "locales" (l'auteur ecrit
  // dans la locale qu'il veut et fallback s'enchaine).
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
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI ?? "file:./payload.db",
    },
  }),
});
