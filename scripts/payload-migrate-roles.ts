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

  // ─── 1. S'assure que Sebastien existe en role "admin" ─────────────────────
  console.log(`\n[1/2] S'assure que ${ADMIN_EMAIL} existe en role "admin"`);
  const found = await payload.find({
    collection: "users",
    where: { email: { equals: ADMIN_EMAIL } },
    limit: 1,
  });

  let sebUser: { id: number | string };
  if (found.docs.length === 0) {
    // User n'existe pas (typiquement le cas sur Turso prod fraichement
    // initialise). On le cree via overrideAccess avec role=admin. Le hook
    // beforeValidate genere un password random, le hook afterChange envoie
    // automatiquement l'email d'invitation -> Sebastien recoit le lien
    // "definis ton mot de passe" par mail.
    console.log(`  → User absent, creation via SDK (declenchera l'email d'invitation)`);
    const created = await payload.create({
      collection: "users",
      overrideAccess: true,
      data: {
        email: ADMIN_EMAIL,
        role: "admin",
        firstName: "Sebastien",
        lastName: "Lonjon",
      },
    });
    sebUser = { id: created.id };
    console.log(`  ✓ ${ADMIN_EMAIL} cree en admin (id=${sebUser.id})`);
    console.log(`  → email d'invitation envoye via Resend, check ta boite`);
  } else {
    sebUser = found.docs[0]!;
    if ((sebUser as unknown as { role?: string }).role === "admin") {
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
