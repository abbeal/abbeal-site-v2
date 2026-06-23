/**
 * POST /api/admin/finalize-tokyo-backend — one-shot pour finaliser le job-offer
 * id=1 senior-backend-engineer-tokyo-2026 :
 *   1) PATCH locale=fr-ca title -> "Senior Backend Engineer — Tokyo" (uniformise
 *      avec FR/EN/JA, conserve l'anglais standard tech)
 *   2) PATCH status -> "published"
 *
 * Auth via REVALIDATE_SECRET. Idempotent.
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const JOB_OFFER_ID = 1;
const SLUG = "senior-backend-engineer-tokyo-2026";
const STANDARDIZED_TITLE = "Senior Backend Engineer — Tokyo";

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

  const payload = await getPayload({ config });

  // Step 1 : uniformise le title FR-CA (overrideAccess + context.autoTranslate
  // = true pour eviter le hook de retraduction qui re-ecrirait notre title).
  await payload.update({
    collection: "job-offers",
    id: JOB_OFFER_ID,
    locale: "fr-ca",
    data: { title: STANDARDIZED_TITLE },
    overrideAccess: true,
    context: { autoTranslate: true },
  });

  // Step 2 : status published (non-localized). Meme context.autoTranslate=true
  // pour ne pas declencher le hook.
  const updated = await payload.update({
    collection: "job-offers",
    id: JOB_OFFER_ID,
    data: { status: "published" },
    overrideAccess: true,
    context: { autoTranslate: true },
  });

  return NextResponse.json({
    ok: true,
    id: JOB_OFFER_ID,
    slug: SLUG,
    actions: [
      `title FR-CA -> "${STANDARDIZED_TITLE}"`,
      `status -> "${(updated as { status?: string }).status}"`,
    ],
  });
}
