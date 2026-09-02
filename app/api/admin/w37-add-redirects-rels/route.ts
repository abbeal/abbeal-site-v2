/**
 * POST /api/admin/w37-add-redirects-rels — one-shot :
 *   Ajoute la colonne `redirects_id` sur les tables Payload de relations
 *   cross-collection (payload_locked_documents_rels, payload_preferences_rels),
 *   qui referencent normalement TOUTES les collections. Sans ces colonnes,
 *   payload.update() sur job-offers fail car son cleanup lock cherche
 *   redirects_id dans le WHERE (deleteMany).
 *
 * Auth via REVALIDATE_SECRET. Idempotent (ADD COLUMN IF NOT EXISTS).
 * A retirer apres usage.
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type PayloadWithDb = Awaited<ReturnType<typeof getPayload>> & {
  db: { drizzle: { run: (sql: string) => Promise<unknown> } };
};

export async function POST(req: Request) {
  let body: { secret?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !body.secret || body.secret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = (await getPayload({ config })) as PayloadWithDb;
  const db = payload.db.drizzle;

  // SQLite : pas de IF NOT EXISTS pour ADD COLUMN. On try/catch.
  const alters: Array<{ sql: string; ok: boolean; err?: string }> = [];
  const cmds: string[] = [
    "ALTER TABLE payload_locked_documents_rels ADD COLUMN redirects_id INTEGER REFERENCES redirects(id) ON DELETE CASCADE",
    "CREATE INDEX IF NOT EXISTS payload_locked_documents_rels_redirects_id_idx ON payload_locked_documents_rels(redirects_id)",
    "ALTER TABLE payload_preferences_rels ADD COLUMN redirects_id INTEGER REFERENCES redirects(id) ON DELETE CASCADE",
    "CREATE INDEX IF NOT EXISTS payload_preferences_rels_redirects_id_idx ON payload_preferences_rels(redirects_id)",
  ];
  for (const sql of cmds) {
    try {
      await db.run(sql);
      alters.push({ sql: sql.slice(0, 100), ok: true });
    } catch (err) {
      const msg = (err as Error).message;
      // "duplicate column" = idempotent OK
      const isDupe =
        msg.includes("duplicate column") || msg.includes("already exists");
      alters.push({
        sql: sql.slice(0, 100),
        ok: isDupe,
        err: isDupe ? undefined : msg,
      });
    }
  }

  // Verify : select le count des rels tables (doit passer meme table vide)
  let verify: { ok: boolean; details?: unknown; err?: string };
  try {
    const q = (await db.run(
      "SELECT COUNT(*) AS c FROM payload_locked_documents_rels WHERE redirects_id IS NOT NULL",
    )) as { rows?: Array<{ c?: number }> };
    verify = { ok: true, details: { locked_rels_with_redirects: q.rows?.[0]?.c ?? 0 } };
  } catch (err) {
    verify = { ok: false, err: (err as Error).message };
  }

  const allOk = alters.every((a) => a.ok) && verify.ok;
  return NextResponse.json({ ok: allOk, alters, verify });
}
