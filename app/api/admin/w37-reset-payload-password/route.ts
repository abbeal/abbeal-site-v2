/**
 * POST /api/admin/w37-reset-payload-password — one-shot :
 *   Reset password d'un utilisateur Payload (email trouve dans la collection).
 *   Utilise payload.update(users, id, { password }) qui re-hash cote Payload.
 *
 * Auth via REVALIDATE_SECRET.
 * Usage :
 *   POST { secret, email, newPassword }
 *
 * A retirer apres usage (une fois le user reconnecte + password change).
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
  let body: { secret?: string; email?: string; newPassword?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !body.secret || body.secret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!body.email || !body.newPassword || body.newPassword.length < 8) {
    return NextResponse.json(
      { error: "email and newPassword (>=8 chars) required" },
      { status: 400 },
    );
  }

  const payload = await getPayload({ config });

  // Trouve le user par email
  const found = await payload.find({
    collection: "users",
    where: { email: { equals: body.email.toLowerCase().trim() } },
    limit: 1,
  });
  const user = found.docs[0];
  if (!user) {
    return NextResponse.json({ error: "user not found" }, { status: 404 });
  }

  // Update password (Payload re-hash automatiquement via hook)
  await payload.update({
    collection: "users",
    id: user.id,
    data: { password: body.newPassword },
    overrideAccess: true,
  });

  return NextResponse.json({
    ok: true,
    userId: user.id,
    email: user.email,
    role: user.role,
    message:
      "Password mis a jour. Login sur https://abbeal.com/admin puis change immediatement via /admin/account.",
  });
}
