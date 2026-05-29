/**
 * Migration : set status="published" sur tous les articles existants.
 *
 * Apres l'ajout du champ status (workflow draft/pending_review/published),
 * les articles deja migres n'ont pas de status defini. Or par default la
 * read access ne renvoie que les articles "published" pour les non-auth.
 *
 * Sans ce script, les 27 articles existants seraient invisibles (filtrees
 * out par le read access) pour le rendu public quand on bascule.
 *
 * Idempotent : ne touche que les articles SANS status.
 *
 * Lancement :
 *   PAYLOAD_SECRET=xxx pnpm tsx scripts/payload-migrate-articles-status.ts
 */

import { getPayload } from "payload";
import config from "../payload.config.js";

async function main() {
  const payload = await getPayload({ config });

  console.log("🚀 Migration status=published sur articles existants sans status");

  const orphanArticles = await payload.find({
    collection: "articles",
    where: { status: { exists: false } },
    limit: 1000,
    overrideAccess: true,
  });

  console.log(`   ${orphanArticles.totalDocs} articles sans status detectes`);

  let updated = 0;
  for (const article of orphanArticles.docs) {
    await payload.update({
      collection: "articles",
      id: article.id,
      overrideAccess: true,
      data: { status: "published" },
    });
    updated++;
  }

  console.log(`\n✅ ${updated} articles passes en status=published`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration failed :", err);
  process.exit(1);
});
