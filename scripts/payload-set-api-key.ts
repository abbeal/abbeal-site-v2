/**
 * Force-set d'une API Key sur un user, en bypassant les access rules UI.
 *
 * Usage :
 *   PAYLOAD_SECRET=dev-only pnpm tsx scripts/payload-set-api-key.ts sebastien.lonjon@abbeal.com
 *
 * Sortie : la cle generee (UUID) — a copier dans PAYLOAD_API_KEY pour
 * tester l'API write avec ./scripts/test-payload-api-write.sh.
 *
 * Pourquoi : l'UI admin a parfois des comportements opaques (session
 * expiration, CSRF, access rules sur le champ apiKey) qui rendent
 * l'activation depuis le formulaire fragile. Ce script appelle
 * directement payload.update() avec overrideAccess=true, comme le
 * ferait un job server-side.
 */

import { randomUUID } from "node:crypto";
import { getPayload } from "payload";
import config from "../payload.config.js";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx scripts/payload-set-api-key.ts <email>");
    process.exit(1);
  }

  const payload = await getPayload({ config });

  // Trouve le user par email
  const found = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });

  if (found.docs.length === 0) {
    console.error(`❌ User introuvable : ${email}`);
    process.exit(1);
  }

  const user = found.docs[0]!;
  const apiKey = randomUUID();

  await payload.update({
    collection: "users",
    id: user.id,
    overrideAccess: true,
    data: {
      enableAPIKey: true,
      apiKey,
    },
  });

  console.log("✅ API Key set");
  console.log(`   user  : ${email} (id=${user.id})`);
  console.log(`   key   : ${apiKey}`);
  console.log("");
  console.log("Test :");
  console.log(`   export PAYLOAD_API_KEY="${apiKey}"`);
  console.log("   ./scripts/test-payload-api-write.sh");

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Failed :", err);
  process.exit(1);
});
