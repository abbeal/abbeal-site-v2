/**
 * POST /api/admin/w37-apply-kansai-redirect — one-shot :
 *   1) PATCH offer id=18 -> slug=senior-data-scientist-microsoft-365-kyoto-osaka
 *                            location=kansai
 *   2) POST /redirects  -> /careers/ancien -> /careers/nouveau (permanent 301)
 *
 * Auth via REVALIDATE_SECRET.
 * Idempotent (safe re-runs) :
 *   - PATCH skip si slug + location deja a jour
 *   - POST redirect skip si fromPath existe deja
 *
 * A retirer apres usage.
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const OFFER_ID = 18;
const NEW_SLUG = "senior-data-scientist-microsoft-365-kyoto-osaka";
const OLD_FROM_PATH = "/careers/senior-data-scientist-microsoft-365-tokyo";
const NEW_TO_PATH = `/careers/${NEW_SLUG}`;
const NEW_LOCATION = "kansai" as const;

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

  // ---- STEP 1 : PATCH offer 18 ----
  const before = await payload.findByID({
    collection: "job-offers",
    id: OFFER_ID,
  });
  let step1: Record<string, unknown>;
  if (before.slug === NEW_SLUG && before.location === NEW_LOCATION) {
    step1 = {
      ok: true,
      skipped: "already up-to-date",
      slug: before.slug,
      location: before.location,
    };
  } else {
    const updated = await payload.update({
      collection: "job-offers",
      id: OFFER_ID,
      data: { slug: NEW_SLUG, location: NEW_LOCATION },
      overrideAccess: true,
      context: { autoTranslate: true }, // pour eviter les hooks de retraduction
    });
    step1 = {
      ok: true,
      before: { slug: before.slug, location: before.location },
      after: { slug: updated.slug, location: updated.location },
    };
  }

  // ---- STEP 2 : POST redirect entry ----
  const existing = await payload.find({
    collection: "redirects",
    where: { fromPath: { equals: OLD_FROM_PATH } },
    limit: 1,
  });
  let step2: Record<string, unknown>;
  if (existing.docs.length > 0) {
    const doc = existing.docs[0]!;
    step2 = {
      ok: true,
      skipped: "already exists",
      id: doc.id,
      fromPath: doc.fromPath,
      toPath: doc.toPath,
      permanent: doc.permanent,
    };
  } else {
    const created = await payload.create({
      collection: "redirects",
      data: {
        fromPath: OLD_FROM_PATH,
        toPath: NEW_TO_PATH,
        permanent: true,
        note: "W37 renommage tokyo -> kyoto-osaka apres reception fiche client 2026-09-01. ~60 candidats notifies sur l ancien lien. Chaine 307 proxy locale puis 301.",
      },
      overrideAccess: true,
    });
    step2 = {
      ok: true,
      id: created.id,
      fromPath: created.fromPath,
      toPath: created.toPath,
      permanent: created.permanent,
    };
  }

  // ---- STEP 3 : force revalidate offer detail + careers listing ----
  try {
    const { revalidatePath, revalidateTag } = await import("next/cache");
    revalidatePath("/fr/careers");
    revalidatePath("/en/careers");
    revalidatePath("/ja/careers");
    revalidatePath("/fr-ca/careers");
    revalidatePath(`/fr/careers/${NEW_SLUG}`);
    revalidatePath(`/en/careers/${NEW_SLUG}`);
    revalidatePath(`/ja/careers/${NEW_SLUG}`);
    revalidatePath(`/fr-ca/careers/${NEW_SLUG}`);
    revalidatePath("/sitemap.xml");
    revalidateTag("job-offers", "default");
    revalidateTag("redirects", "default");
  } catch {
    // best effort
  }

  return NextResponse.json({ ok: true, step1_patch: step1, step2_redirect: step2 });
}
