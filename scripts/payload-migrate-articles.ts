/**
 * Migration script — pousse les 26 articles statiques (lib/articles.ts +
 * lib/article-bodies.json) dans la collection Payload `articles`, en 4 langues.
 *
 * Idempotent : pour chaque article, on `find by slug` puis on `update` si trouve,
 * sinon `create`. On peut donc relancer le script sans dupliquer.
 *
 * Le rendu public (/insights/[slug]) continue de lire lib/articles.ts pendant
 * le PoC — ce script ne modifie aucun rendu. C'est juste un peuplement de la
 * DB Payload pour valider :
 *  - le mapping ArticleBlock (lib/articles.ts) -> Blocks Payload (payload.config.ts)
 *  - la creation programmatique via payload.create() / payload.update()
 *  - le multi-locale (fr/en/ja/fr-ca avec fallback fr)
 *
 * Lancement local :
 *   PAYLOAD_SECRET=dev-only pnpm tsx scripts/payload-migrate-articles.ts
 *
 * Output attendu :
 *   [1/26] agents-ia-production           CREATED fr + en + ja
 *   [2/26] greenops-7-leviers             CREATED fr + en
 *   ...
 *   ----------
 *   Total : 26 articles, X creations, Y updates, Z locales
 */

import { getPayload } from "payload";
import config from "../payload.config.js";
import { articles, type ArticleBlock } from "../lib/articles.js";
import type { Locale } from "../lib/i18n.js";

const LOCALES: readonly Locale[] = ["fr", "en", "ja", "fr-ca"] as const;

/**
 * Convertit un ArticleBlock (forme JS du site public) en data Payload Blocks.
 * Mapping 1:1 sauf :
 *  - `type` -> `blockType` (convention Payload)
 *  - `list.items: string[]` -> `list.items: [{ text: string }]` (notre
 *    sous-champ s'appelle "text" cf payload.config.ts)
 */
function toPayloadBlock(block: ArticleBlock): Record<string, unknown> {
  if (block.type === "list") {
    return {
      blockType: "list",
      items: block.items.map((text) => ({ text })),
      ordered: block.ordered ?? false,
    };
  }
  // Tous les autres blocks : { type, ...rest } -> { blockType, ...rest }
  const { type, ...rest } = block;
  return { blockType: type, ...rest };
}

async function main() {
  console.log("🚀 Migration articles statiques -> Payload");
  console.log(`   ${articles.length} articles a traiter, ${LOCALES.length} locales\n`);

  const payload = await getPayload({ config });

  let created = 0;
  let updated = 0;
  let localesWritten = 0;
  let i = 0;

  for (const article of articles) {
    i++;
    const prefix = `[${String(i).padStart(2, " ")}/${articles.length}] ${article.slug.padEnd(55, " ")}`;

    // Lookup par slug (champ unique, non-localise)
    const existing = await payload.find({
      collection: "articles",
      where: { slug: { equals: article.slug } },
      limit: 1,
    });

    // Champs non-localises (memes valeurs quelle que soit la locale)
    const baseData = {
      slug: article.slug,
      featured: article.featured,
      featuredOnHome: article.featuredOnHome ?? false,
      tag: article.tag,
      readTime: article.readTime,
      publishedAt: article.publishedAt,
      // updatedAt est aussi un champ Payload auto-genere ; on ne le force
      // que s'il est explicitement defini dans l'article statique.
      ...(article.updatedAt ? { updatedAt: article.updatedAt } : {}),
      ...(article.relatedCaseSlug ? { relatedCaseSlug: article.relatedCaseSlug } : {}),
      ...(article.relatedServiceSlug ? { relatedServiceSlug: article.relatedServiceSlug } : {}),
    };

    // Builder les champs localises pour une locale donnee
    const buildLocaleData = (locale: Locale) => {
      const title = article.title[locale];
      if (!title) return null; // Pas de traduction pour cette locale -> skip
      const body = article.body[locale] ?? [];
      return {
        title,
        excerpt: article.excerpt[locale]!,
        ...(article.metaDescription?.[locale]
          ? { metaDescription: article.metaDescription[locale] }
          : {}),
        ...(article.keywords?.[locale] ? { keywords: article.keywords[locale] } : {}),
        ...(article.faq?.[locale] ? { faq: article.faq[locale] } : {}),
        body: body.map(toPayloadBlock),
      };
    };

    let docId: string | number;
    let action: "CREATED" | "UPDATED";

    if (existing.docs.length === 0) {
      // Creation : on cree avec la locale FR (toujours definie, c'est defaultLocale)
      const frData = buildLocaleData("fr");
      if (!frData) {
        console.log(`${prefix} ⚠️  SKIPPED — pas de title fr`);
        continue;
      }
      const result = await payload.create({
        collection: "articles",
        locale: "fr",
        data: { ...baseData, ...frData },
      });
      docId = result.id;
      action = "CREATED";
      created++;
      localesWritten++;
    } else {
      // Update : on update la locale FR (champs base + traduction fr)
      docId = existing.docs[0]!.id;
      const frData = buildLocaleData("fr");
      if (!frData) {
        console.log(`${prefix} ⚠️  SKIPPED — pas de title fr`);
        continue;
      }
      await payload.update({
        collection: "articles",
        id: docId,
        locale: "fr",
        data: { ...baseData, ...frData },
      });
      action = "UPDATED";
      updated++;
      localesWritten++;
    }

    // Locales additionnelles (en, ja, fr-ca) — seulement si traduction presente
    const otherLocales: Exclude<Locale, "fr">[] = ["en", "ja", "fr-ca"];
    const writtenLocales: string[] = ["fr"];
    for (const locale of otherLocales) {
      const localeData = buildLocaleData(locale);
      if (!localeData) continue;
      await payload.update({
        collection: "articles",
        id: docId,
        locale,
        data: localeData,
      });
      writtenLocales.push(locale);
      localesWritten++;
    }

    console.log(`${prefix} ${action} ${writtenLocales.join(" + ")}`);
  }

  console.log("\n----------");
  console.log(`✅ Termine : ${created} crees, ${updated} updates, ${localesWritten} locales ecrites`);
  console.log("\n🌐 Verifier dans l'admin :");
  console.log("   http://127.0.0.1:3000/admin/collections/articles\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration failed :", err);
  process.exit(1);
});
