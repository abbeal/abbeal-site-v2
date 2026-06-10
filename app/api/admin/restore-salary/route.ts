/**
 * POST /api/admin/restore-salary — restore les salaryRange perdus apres
 * le schema push qui a DROP la column non-localized (W24).
 *
 * Body : { secret, restore: [{ slug, salaryRange }, ...] }
 *
 * Update chaque doc pour set salaryRange FR. Le hook auto-translate
 * kickera pour propager vers EN/JA/FR-CA.
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  let body: { secret?: string; restore?: Array<{ slug: string; salaryRange: string | null }> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !body.secret || body.secret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!Array.isArray(body.restore) || body.restore.length === 0) {
    return NextResponse.json({ error: "restore array required" }, { status: 400 });
  }

  const payload = await getPayload({ config });
  const updated: Array<{ slug: string; id: number | string; salary: string | null }> = [];
  const failed: Array<{ slug: string; reason: string }> = [];

  for (const item of body.restore) {
    if (!item.slug || !item.salaryRange) continue;
    try {
      const found = await payload.find({
        collection: "job-offers",
        where: { slug: { equals: item.slug } },
        limit: 1,
        overrideAccess: true,
      });
      if (found.docs.length === 0) {
        failed.push({ slug: item.slug, reason: "not found" });
        continue;
      }
      const offerId = found.docs[0]!.id as number;
      await payload.update({
        collection: "job-offers",
        id: offerId,
        locale: "fr",
        data: { salaryRange: item.salaryRange } as unknown as Record<string, unknown>,
        overrideAccess: true,
        // Skip auto-translate ici : on restore juste FR, le translate viendra apres
        context: { autoTranslate: true },
      });
      updated.push({ slug: item.slug, id: offerId, salary: item.salaryRange });
    } catch (err) {
      failed.push({ slug: item.slug, reason: (err as Error).message ?? String(err) });
    }
  }

  return NextResponse.json({ ok: true, updated, failed });
}
