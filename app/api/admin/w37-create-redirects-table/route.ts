/**
 * POST /api/admin/w37-create-redirects-table — one-shot :
 *   Cree la table `redirects` en prod Turso (le push automatique de Payload
 *   ne s'execute pas en serverless Vercel, meme avec PAYLOAD_ALLOW_PUSH=1).
 *
 * Auth via REVALIDATE_SECRET (deja en env prod).
 * Idempotent : CREATE TABLE IF NOT EXISTS.
 *
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

  // Structure alignee sur ce que drizzle-kit push aurait genere pour
  // la collection Redirects (payload.config.ts). Colonnes :
  //   id           INTEGER PRIMARY KEY AUTOINCREMENT
  //   from_path    TEXT NOT NULL UNIQUE
  //   to_path      TEXT NOT NULL
  //   permanent    INTEGER DEFAULT 1  (bool)
  //   note         TEXT (nullable)
  //   updated_at   TEXT DEFAULT (CURRENT_TIMESTAMP)
  //   created_at   TEXT DEFAULT (CURRENT_TIMESTAMP)
  const steps: Array<{ sql: string; ok: boolean; err?: string }> = [];
  const ddl: Array<string> = [
    `CREATE TABLE IF NOT EXISTS redirects (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       from_path TEXT NOT NULL,
       to_path TEXT NOT NULL,
       permanent INTEGER DEFAULT 1,
       note TEXT,
       updated_at TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
       created_at TEXT DEFAULT (CURRENT_TIMESTAMP) NOT NULL
     )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS redirects_from_path_idx ON redirects(from_path)`,
    `CREATE INDEX IF NOT EXISTS redirects_updated_at_idx ON redirects(updated_at)`,
    `CREATE INDEX IF NOT EXISTS redirects_created_at_idx ON redirects(created_at)`,
  ];
  for (const sql of ddl) {
    try {
      await db.run(sql);
      steps.push({ sql: sql.replace(/\s+/g, " ").slice(0, 80), ok: true });
    } catch (err) {
      steps.push({
        sql: sql.replace(/\s+/g, " ").slice(0, 80),
        ok: false,
        err: (err as Error).message,
      });
    }
  }

  // Verif finale : count sur la nouvelle table
  let verify: { ok: boolean; count?: number; err?: string };
  try {
    const rows = (await db.run("SELECT COUNT(*) AS c FROM redirects")) as {
      rows?: Array<{ c?: number }>;
    };
    verify = { ok: true, count: rows.rows?.[0]?.c ?? 0 };
  } catch (err) {
    verify = { ok: false, err: (err as Error).message };
  }

  return NextResponse.json({ ok: verify.ok, steps, verify });
}
