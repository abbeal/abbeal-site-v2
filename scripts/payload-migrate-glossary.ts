/**
 * Migration script — pousse les 54 entrees glossary statiques (lib/glossary.ts)
 * dans la collection Payload `glossary`, en 3 langues (fr/en/ja + fallback fr-ca=fr).
 *
 * Source utilise I18nString {fr,en,ja} — pas de fr-ca. Payload aura fallback
 * automatique fr-ca -> fr (defaultLocale).
 *
 * Lancement :
 *   PAYLOAD_SECRET=dev-only pnpm migrate:glossary
 */

import { getPayload } from "payload";
import config from "../payload.config.js";
import { glossary } from "../lib/glossary.js";

async function main() {
  console.log("🚀 Migration glossary statique -> Payload");
  console.log(`   ${glossary.length} entrees a traiter, 3 langues (fr/en/ja)\n`);

  const payload = await getPayload({ config });

  let created = 0;
  let updated = 0;
  let localesWritten = 0;
  let i = 0;

  for (const entry of glossary) {
    i++;
    const prefix = `[${String(i).padStart(2, " ")}/${glossary.length}] ${entry.slug.padEnd(35, " ")}`;

    const existing = await payload.find({
      collection: "glossary",
      where: { slug: { equals: entry.slug } },
      limit: 1,
    });

    const baseData: Record<string, unknown> = {
      slug: entry.slug,
      category: entry.category,
      ...(entry.relatedTerms?.length
        ? { relatedTerms: entry.relatedTerms.map((slug) => ({ slug })) }
        : {}),
    };

    const buildLocaleData = (lang: "fr" | "en" | "ja") => ({
      term: entry.term[lang],
      short: entry.short[lang],
      definition: entry.definition[lang],
    });

    let docId: string | number;
    let action: "CREATED" | "UPDATED";

    if (existing.docs.length === 0) {
      const result = await payload.create({
        collection: "glossary",
        locale: "fr",
        data: { ...baseData, ...buildLocaleData("fr") },
      });
      docId = result.id;
      action = "CREATED";
      created++;
      localesWritten++;
    } else {
      docId = existing.docs[0]!.id;
      await payload.update({
        collection: "glossary",
        id: docId,
        locale: "fr",
        data: { ...baseData, ...buildLocaleData("fr") },
      });
      action = "UPDATED";
      updated++;
      localesWritten++;
    }

    // EN + JA
    for (const lang of ["en", "ja"] as const) {
      await payload.update({
        collection: "glossary",
        id: docId,
        locale: lang,
        data: buildLocaleData(lang),
      });
      localesWritten++;
    }

    console.log(`${prefix} ${action} fr + en + ja`);
  }

  console.log("\n----------");
  console.log(`✅ Termine : ${created} crees, ${updated} updates, ${localesWritten} locales ecrites`);
  console.log("\n🌐 http://127.0.0.1:3000/admin/collections/glossary\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration glossary failed :", err);
  process.exit(1);
});
