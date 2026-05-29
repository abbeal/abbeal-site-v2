/**
 * Reset password d'un user via SDK (overrideAccess, bypass UI).
 *
 * Usage :
 *   PAYLOAD_SECRET=xxx pnpm tsx scripts/payload-reset-password.ts <email> <new-password>
 *
 * Exemple :
 *   PAYLOAD_SECRET=xxx pnpm tsx scripts/payload-reset-password.ts \
 *     sebastien.lonjon@abbeal.com "MotDePasseTemporaire123!"
 *
 * Apres ca, login sur /admin avec le nouveau password.
 * Tu pourras le changer ensuite via ton profil /admin/account.
 *
 * Pratique quand le forgotPassword email foire ou que tu es locked out.
 */

import { getPayload } from "payload";
import config from "../payload.config.js";

async function main() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error("Usage: tsx scripts/payload-reset-password.ts <email> <new-password>");
    process.exit(1);
  }

  if (newPassword.length < 8) {
    console.error("❌ Password trop court (8 chars minimum)");
    process.exit(1);
  }

  const payload = await getPayload({ config });

  const found = await payload.find({
    collection: "users",
    where: { email: { equals: email } },
    limit: 1,
  });

  if (found.docs.length === 0) {
    console.error(`❌ User ${email} introuvable`);
    process.exit(1);
  }

  const user = found.docs[0]!;

  // Unlock d'abord (Payload locke apres 5 echecs de login pour 10 min,
  // typique apres plusieurs forgot+retry). Sans ca, le nouveau password
  // marche pas tant que lock_until n'est pas passe.
  try {
    await payload.unlock({
      collection: "users",
      data: { email },
      overrideAccess: true,
    });
    console.log(`   ✓ Account unlocked`);
  } catch {
    // Pas locked = pas grave, on continue
  }

  await payload.update({
    collection: "users",
    id: user.id,
    overrideAccess: true,
    data: { password: newPassword },
  });

  console.log(`✅ Password reset pour ${email} (id=${user.id})`);
  console.log(`   Login : https://abbeal.com/admin/login`);
  console.log(`   Pense a le changer apres login depuis ton profil /admin/account`);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Failed :", err);
  process.exit(1);
});
