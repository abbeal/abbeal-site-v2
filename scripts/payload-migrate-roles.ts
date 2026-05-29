/**
 * Migration roles + ownership articles (W22 CMS).
 *
 * Apres l'ajout du systeme de roles + champ `author` sur Articles :
 *   1. Promote sebastien.lonjon@abbeal.com en role "admin"
 *      (sinon il devient "editor" par defaut et perd l'acces aux autres
 *      collections).
 *   2. Back-fill author=Sebastien sur les 27 articles existants migres
 *      depuis lib/articles.ts (ils n'avaient pas d'author avant).
 *
 * Idempotent : peut etre relance sans casse.
 *
 * Lancement :
 *   # Local
 *   PAYLOAD_SECRET=dev-only pnpm tsx scripts/payload-migrate-roles.ts
 *
 *   # Turso preview/prod (avec env vars TURSO_* + PAYLOAD_SECRET prod)
 *   set -a; source .env.vercel.preview; set +a
 *   export PAYLOAD_SECRET="<le secret prod>"
 *   pnpm tsx scripts/payload-migrate-roles.ts
 */

import { getPayload } from "payload";
import config from "../payload.config.js";

const ADMIN_EMAIL = "sebastien.lonjon@abbeal.com";

async function main() {
  const payload = await getPayload({ config });

  // ─── 1. Promote Sebastien en admin ────────────────────────────────────────
  console.log(`\n[1/2] Promote ${ADMIN_EMAIL} en role "admin"`);
  const found = await payload.find({
    collection: "users",
    where: { email: { equals: ADMIN_EMAIL } },
    limit: 1,
  });

  if (found.docs.length === 0) {
    console.error(`  ❌ User ${ADMIN_EMAIL} introuvable. Cree-le d'abord via /admin.`);
    process.exit(1);
  }

  const sebUser = found.docs[0]!;
  if ((sebUser as Record<string, unknown>).role === "admin") {
    console.log(`  ✓ ${ADMIN_EMAIL} est deja admin (id=${sebUser.id})`);
  } else {
    await payload.update({
      collection: "users",
      id: sebUser.id,
      overrideAccess: true,
      data: { role: "admin" },
    });
    console.log(`  ✓ ${ADMIN_EMAIL} promu admin (id=${sebUser.id})`);
  }

  // ─── 2. Back-fill author sur les articles existants ───────────────────────
  console.log(`\n[2/2] Back-fill author=${ADMIN_EMAIL} sur articles sans author`);
  const orphanArticles = await payload.find({
    collection: "articles",
    where: { author: { exists: false } },
    limit: 1000,
    overrideAccess: true,
  });

  console.log(`  ${orphanArticles.totalDocs} articles sans author detectes`);
  let updated = 0;
  for (const article of orphanArticles.docs) {
    await payload.update({
      collection: "articles",
      id: article.id,
      overrideAccess: true,
      data: { author: sebUser.id },
    });
    updated++;
  }
  console.log(`  ✓ ${updated} articles back-fillees avec author=${ADMIN_EMAIL}`);

  console.log("\n✅ Migration terminee.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Migration failed :", err);
  process.exit(1);
});
