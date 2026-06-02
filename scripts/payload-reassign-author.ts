/**
 * Reassigne l'author d'articles selon un mapping slug-pattern -> email.
 *
 * Use case W22 : les 27 articles migres depuis lib/articles.ts ont tous
 * author=Sebastien (id=1) par defaut. Quand on cree un user editor pour
 * un redacteur deja existant (ex: Alex), ses articles doivent etre
 * reassignes a lui pour qu'il puisse les editer (l'access ownership
 * filter par author == user.id).
 *
 * Mapping definit dans le script (cf REASSIGN_RULES ci-dessous). Adapter
 * selon les besoins.
 *
 * Idempotent : verifie l'author avant de reassigner.
 *
 * Usage :
 *   PAYLOAD_SECRET=xxx pnpm tsx scripts/payload-reassign-author.ts
 *   (avec env vars TURSO_* pulled si on tape la prod DB)
 */

import { getPayload } from "payload";
import config from "../payload.config.js";

// Mapping : pour chaque pattern de slug, l'email de l'user a affecter
// comme author. Si l'user n'existe pas en DB, on skip (le user devra
// etre cree d'abord via /admin/collections/users/create).
const REASSIGN_RULES: { slugContains: string; authorEmail: string }[] = [
  { slugContains: "alex-lim", authorEmail: "alexandre.lim@abbeal.com" },
  { slugContains: "alex-senior-engineer", authorEmail: "alexandre.lim@abbeal.com" },
  // Ajoute ici d'autres patterns au fur et a mesure :
  // { slugContains: "stephane-robin", authorEmail: "stephane.robin@abbeal.com" },
  // { slugContains: "vianney", authorEmail: "vianney.blanquart@abbeal.com" },
];

async function main() {
  const payload = await getPayload({ config });

  console.log("🚀 Reassign author par pattern slug\n");

  for (const rule of REASSIGN_RULES) {
    // Trouve le user cible
    const userFound = await payload.find({
      collection: "users",
      where: { email: { equals: rule.authorEmail } },
      limit: 1,
      overrideAccess: true,
    });
    if (userFound.docs.length === 0) {
      console.log(
        `⚠️  Skip "${rule.slugContains}" : user ${rule.authorEmail} n'existe pas en DB`,
      );
      continue;
    }
    const targetUserId = userFound.docs[0]!.id;

    // Trouve les articles matchant le pattern
    const articles = await payload.find({
      collection: "articles",
      where: { slug: { like: rule.slugContains } },
      limit: 100,
      overrideAccess: true,
    });
    console.log(
      `📝 "${rule.slugContains}" → ${rule.authorEmail} (id=${targetUserId}) : ${articles.totalDocs} articles trouves`,
    );

    for (const article of articles.docs) {
      const currentAuthor = (article as Record<string, unknown>).author;
      const currentAuthorId =
        typeof currentAuthor === "object" && currentAuthor !== null
          ? (currentAuthor as { id?: number | string }).id
          : currentAuthor;

      if (currentAuthorId === targetUserId) {
        console.log(`   ✓ ${article.slug} : deja assigne (skip)`);
        continue;
      }

      await payload.update({
        collection: "articles",
        id: article.id,
        overrideAccess: true,
        data: { author: targetUserId },
      });
      console.log(`   ✅ ${article.slug} : ${currentAuthorId} → ${targetUserId}`);
    }
  }

  console.log("\n✅ Termine.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Failed :", err);
  process.exit(1);
});
