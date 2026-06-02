/**
 * Diagnostic read-only : liste tous les users en DB.
 * Avec push:false hardcode quand TURSO_DATABASE_URL est present, donc safe
 * contre n'importe quelle DB.
 *
 * Usage : PAYLOAD_SECRET=xxx pnpm tsx scripts/payload-list-users.ts
 */

import { getPayload } from "payload";
import config from "../payload.config.js";

async function main() {
  const payload = await getPayload({ config });

  const users = await payload.find({
    collection: "users",
    limit: 100,
    overrideAccess: true,
  });

  console.log(`\n📊 ${users.totalDocs} users en DB :\n`);
  for (const u of users.docs) {
    const role = (u as Record<string, unknown>).role ?? "?";
    const created = (u as Record<string, unknown>).createdAt ?? "?";
    console.log(`  id=${u.id} | ${u.email} | role=${role} | created=${created}`);
  }
  console.log("");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Failed :", err);
  process.exit(1);
});
