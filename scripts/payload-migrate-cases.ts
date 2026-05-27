/**
 * Migration script — pousse les 25 case studies statiques (lib/cases.ts +
 * lib/case-bodies.json) dans la collection Payload `cases`, en 4 locales.
 *
 * Mapping :
 *  - Champs non-localises : slug, featured, featuredOnHome, template,
 *    clientLogo*, geo, duration, teamSize, techStack (string[] -> [{name}]),
 *    publishedAt
 *  - Champs localises : sector, title, excerpt, body (blocks)
 *  - Group kpi : value (non-localized), label (localized)
 *  - body : meme mapping qu'Articles (ArticleBlock -> Payload Block)
 *
 * Idempotent : find by slug -> update si trouve, sinon create.
 *
 * Lancement :
 *   PAYLOAD_SECRET=dev-only pnpm migrate:cases
 */

import { getPayload } from "payload";
import config from "../payload.config.js";
import { cases } from "../lib/cases.js";
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
  console.log("🚀 Migration cases statiques -> Payload");
  console.log(`   ${cases.length} cases a traiter, ${LOCALES.length} locales\n`);

  const payload = await getPayload({ config });

  let created = 0;
  let updated = 0;
  let localesWritten = 0;
  let i = 0;

  for (const c of cases) {
    i++;
    const prefix = `[${String(i).padStart(2, " ")}/${cases.length}] ${c.slug.padEnd(50, " ")}`;

    const existing = await payload.find({
      collection: "cases",
      where: { slug: { equals: c.slug } },
      limit: 1,
    });

    const baseData: Record<string, unknown> = {
      slug: c.slug,
      featured: c.featured,
      featuredOnHome: c.featuredOnHome ?? false,
      ...(c.template ? { template: c.template } : {}),
      ...(c.clientLogo ? { clientLogo: c.clientLogo } : {}),
      clientLogoExt: c.clientLogoExt ?? "svg",
      ...(c.clientLogoSecondary ? { clientLogoSecondary: c.clientLogoSecondary } : {}),
      clientLogoSecondaryExt: c.clientLogoSecondaryExt ?? "svg",
      geo: c.geo,
      duration: c.duration,
      teamSize: c.teamSize,
      techStack: c.techStack.map((name) => ({ name })),
      publishedAt: c.publishedAt,
      // KPI : value est commun a toutes les locales, label est localized
      kpi: { value: c.kpi.value, label: c.kpi.label.fr },
    };

    const buildLocaleData = (locale: Locale) => {
      const title = c.title[locale];
      if (!title) return null;
      const body = c.body[locale] ?? [];
      const sector = c.sector[locale] ?? c.sector.fr;
      const kpiLabel = c.kpi.label[locale] ?? c.kpi.label.fr;
      return {
        title,
        excerpt: c.excerpt[locale]!,
        sector,
        kpi: { value: c.kpi.value, label: kpiLabel },
        body: body.map(toPayloadBlock),
      };
    };

    let docId: string | number;
    let action: "CREATED" | "UPDATED";

    if (existing.docs.length === 0) {
      const frData = buildLocaleData("fr");
      if (!frData) {
        console.log(`${prefix} ⚠️  SKIPPED — pas de title fr`);
        continue;
      }
      const result = await payload.create({
        collection: "cases",
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
        console.log(`${prefix} ⚠️  SKIPPED — pas de title fr`);
        continue;
      }
      await payload.update({
        collection: "cases",
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
        collection: "cases",
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
  console.log("\n🌐 http://127.0.0.1:3000/admin/collections/cases\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration cases failed :", err);
  process.exit(1);
});
