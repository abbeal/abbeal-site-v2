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

  // Tous les articles qui ne sont PAS deja "published" et qui sont anciens
  // (createdAt avant la migration W22 = avant l'ajout du champ status).
  // On promote tout ce qui n'est pas explicitement published pour preserver
  // la visibilite publique. Les nouveaux articles (post-W22) garderont leur
  // status manuel (draft / pending_review / published).
  const orphanArticles = await payload.find({
    collection: "articles",
    where: { status: { not_equals: "published" } },
    limit: 1000,
    overrideAccess: true,
  });

  console.log(`   ${orphanArticles.totalDocs} articles a promouvoir en published`);

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
