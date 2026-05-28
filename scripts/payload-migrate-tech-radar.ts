/**
 * Migration script — pousse les items du Tech Radar (depuis les dictionaries
 * Next dict[lang].techRadar.items) dans la collection Payload `tech-radar`.
 *
 * Structure source : dictionaries[lang].techRadar.items = [{ name, ring,
 * category, rationale }]. Memes positions d'index entre les 4 dicts (les
 * traductions sont en parallele).
 *
 * Slug genere a partir du name EN slugifie (le name EN est le terme
 * technique canonique, stable entre versions).
 *
 * Lancement :
 *   PAYLOAD_SECRET=dev-only pnpm migrate:tech-radar
 */

import { getPayload } from "payload";
import config from "../payload.config.js";

import frDict from "../app/[lang]/dictionaries/fr.json" with { type: "json" };
import enDict from "../app/[lang]/dictionaries/en.json" with { type: "json" };
import jaDict from "../app/[lang]/dictionaries/ja.json" with { type: "json" };
import frCaDict from "../app/[lang]/dictionaries/fr-ca.json" with { type: "json" };

type TechRadarItem = {
  name: string;
  ring: "adopt" | "trial" | "assess" | "hold";
  category: string;
  rationale: string;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const items: Record<"fr" | "en" | "ja" | "fr-ca", TechRadarItem[]> = {
    fr: (frDict as { techRadar: { items: TechRadarItem[] } }).techRadar.items,
    en: (enDict as { techRadar: { items: TechRadarItem[] } }).techRadar.items,
    ja: (jaDict as { techRadar: { items: TechRadarItem[] } }).techRadar.items,
    "fr-ca": (frCaDict as { techRadar: { items: TechRadarItem[] } }).techRadar.items,
  };

  const count = items.en.length;
  console.log("🚀 Migration tech-radar -> Payload");
  console.log(`   ${count} items, 4 locales\n`);

  if (
    items.fr.length !== count ||
    items.ja.length !== count ||
    items["fr-ca"].length !== count
  ) {
    console.error("❌ Mismatch : les dictionaries n'ont pas le meme nombre d'items");
    console.error(`   fr=${items.fr.length} en=${items.en.length} ja=${items.ja.length} fr-ca=${items["fr-ca"].length}`);
    process.exit(1);
  }

  const payload = await getPayload({ config });

  let created = 0;
  let updated = 0;
  let localesWritten = 0;

  for (let idx = 0; idx < count; idx++) {
    const enItem = items.en[idx]!;
    const slug = slugify(enItem.name);
    const prefix = `[${String(idx + 1).padStart(2, " ")}/${count}] ${slug.padEnd(35, " ")}`;

    const existing = await payload.find({
      collection: "tech-radar",
      where: { slug: { equals: slug } },
      limit: 1,
    });

    const baseData = {
      slug,
      ring: enItem.ring,
      category: enItem.category,
      edition: "2026-q2",
      position: idx,
    };

    let docId: string | number;
    let action: "CREATED" | "UPDATED";

    if (existing.docs.length === 0) {
      const result = await payload.create({
        collection: "tech-radar",
        locale: "fr",
        data: {
          ...baseData,
          name: items.fr[idx]!.name,
          rationale: items.fr[idx]!.rationale,
        },
      });
      docId = result.id;
      action = "CREATED";
      created++;
      localesWritten++;
    } else {
      docId = existing.docs[0]!.id;
      await payload.update({
        collection: "tech-radar",
        id: docId,
        locale: "fr",
        data: {
          ...baseData,
          name: items.fr[idx]!.name,
          rationale: items.fr[idx]!.rationale,
        },
      });
      action = "UPDATED";
      updated++;
      localesWritten++;
    }

    for (const locale of ["en", "ja", "fr-ca"] as const) {
      await payload.update({
        collection: "tech-radar",
        id: docId,
        locale,
        data: {
          name: items[locale][idx]!.name,
          rationale: items[locale][idx]!.rationale,
        },
      });
      localesWritten++;
    }

    console.log(`${prefix} ${action} fr + en + ja + fr-ca`);
  }

  console.log("\n----------");
  console.log(`✅ Termine : ${created} crees, ${updated} updates, ${localesWritten} locales ecrites`);
  console.log("\n🌐 http://127.0.0.1:3000/admin/collections/tech-radar\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration tech-radar failed :", err);
  process.exit(1);
});
