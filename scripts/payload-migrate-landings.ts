/**
 * Migration script — pousse les 6 landing pages statiques (lib/landing-pages.ts
 * + lib/landing-page-bodies.json) dans la collection Payload `landing-pages`.
 *
 * Mapping :
 *  - Champs non-localises : slug, keywords (string[] -> [{term}]),
 *    relatedCaseSlugs (string[] -> [{slug}]), relatedArticleSlug,
 *    extraSchema (JSON brut)
 *  - Champs localises : tape, h1, subtitle, metaDescription, body, faq
 *
 * Idempotent : find by slug -> update si trouve, sinon create.
 *
 * Lancement :
 *   PAYLOAD_SECRET=dev-only pnpm migrate:landings
 */

import { getPayload } from "payload";
import config from "../payload.config.js";
import { landingPages } from "../lib/landing-pages.js";
import type { ArticleBlock } from "../lib/articles.js";
import type { Locale } from "../lib/i18n.js";

const LOCALES: readonly Locale[] = ["fr", "en", "ja", "fr-ca"] as const;

function toPayloadBlock(block: ArticleBlock): Record<string, unknown> {
  if (block.type === "list") {
    return {
      blockType: "list",
      items: block.items.map((text) => ({ text })),
      ordered: block.ordered ?? false,
    };
  }
  const { type, ...rest } = block;
  return { blockType: type, ...rest };
}

async function main() {
  console.log("🚀 Migration landing-pages statiques -> Payload");
  console.log(`   ${landingPages.length} landings a traiter, ${LOCALES.length} locales\n`);

  const payload = await getPayload({ config });

  let created = 0;
  let updated = 0;
  let localesWritten = 0;
  let i = 0;

  for (const lp of landingPages) {
    i++;
    const prefix = `[${String(i).padStart(2, " ")}/${landingPages.length}] ${lp.slug.padEnd(50, " ")}`;

    const existing = await payload.find({
      collection: "landing-pages",
      where: { slug: { equals: lp.slug } },
      limit: 1,
    });

    const baseData: Record<string, unknown> = {
      slug: lp.slug,
      keywords: lp.keywords.map((term) => ({ term })),
      relatedCaseSlugs: lp.relatedCaseSlugs.map((slug) => ({ slug })),
      ...(lp.relatedArticleSlug ? { relatedArticleSlug: lp.relatedArticleSlug } : {}),
      ...(lp.extraSchema ? { extraSchema: lp.extraSchema } : {}),
    };

    const buildLocaleData = (locale: Locale) => {
      const h1 = lp.h1[locale];
      if (!h1) return null;
      const body = lp.body[locale] ?? [];
      const faq = lp.faq[locale] ?? [];
      return {
        tape: lp.tape[locale] ?? lp.tape.fr,
        h1,
        subtitle: lp.subtitle[locale]!,
        metaDescription: lp.metaDescription[locale]!,
        body: body.map(toPayloadBlock),
        faq,
      };
    };

    let docId: string | number;
    let action: "CREATED" | "UPDATED";

    if (existing.docs.length === 0) {
      const frData = buildLocaleData("fr");
      if (!frData) {
        console.log(`${prefix} ⚠️  SKIPPED — pas de h1 fr`);
        continue;
      }
      const result = await payload.create({
        collection: "landing-pages",
        locale: "fr",
        data: { ...baseData, ...frData },
      });
      docId = result.id;
      action = "CREATED";
      created++;
      localesWritten++;
    } else {
      docId = existing.docs[0]!.id;
      const frData = buildLocaleData("fr");
      if (!frData) {
        console.log(`${prefix} ⚠️  SKIPPED — pas de h1 fr`);
        continue;
      }
      await payload.update({
        collection: "landing-pages",
        id: docId,
        locale: "fr",
        data: { ...baseData, ...frData },
      });
      action = "UPDATED";
      updated++;
      localesWritten++;
    }

    const writtenLocales: string[] = ["fr"];
    for (const locale of ["en", "ja", "fr-ca"] as const) {
      const localeData = buildLocaleData(locale);
      if (!localeData) continue;
      await payload.update({
        collection: "landing-pages",
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
  console.log("\n🌐 http://127.0.0.1:3000/admin/collections/landing-pages\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration landings failed :", err);
  process.exit(1);
});
