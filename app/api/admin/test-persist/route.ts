/**
 * POST /api/admin/test-persist — debug endpoint pour diagnostiquer le bug
 * "l'offre LLM Paris disparait au bout de N minutes" rapporte par Seb.
 *
 * Crée une offre test avec slug unique, puis fait 3 check de persistance
 * (immediat, +60s, +120s). Return un rapport avec les timestamps + status.
 *
 * Si l'offre disparait entre 2 checks -> on voit l'instant exact + on peut
 * cross-referencer avec les logs Vercel pour identifier le coupable.
 *
 * Auth via REVALIDATE_SECRET.
 *
 * Usage :
 *   curl -X POST https://abbeal.com/api/admin/test-persist \
 *     -H "Content-Type: application/json" \
 *     -d '{"secret":"..."}'
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  let body: { secret?: string };
  try {
    body = (await req.json()) as { secret?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !body.secret || body.secret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const ts = Date.now();
  const testSlug = `__test-persistence-${ts}`;
  const trace: Array<{ step: string; t: number; result: unknown }> = [];

  const payload = await getPayload({ config });

  // Step 1 : Create offer
  trace.push({ step: "create:start", t: Date.now() - ts, result: null });
  let createdId: number | null = null;
  try {
    const created = await payload.create({
      collection: "job-offers",
      overrideAccess: true,
      data: {
        slug: testSlug,
        status: "published",
        featured: false,
        title: "TEST PERSISTENCE — A SUPPRIMER",
        excerpt: "Offre test pour debug persistance.",
        location: "paris",
        contractType: "cdi",
        experienceLevel: "senior",
        techStack: [{ name: "Debug" }],
        applyUrl: "mailto:test@abbeal.com",
        publishedAt: new Date().toISOString().slice(0, 10),
        description: [
          { blockType: "p", content: "Test row pour diagnostic. Sera supprimee apres test." },
        ],
      },
    });
    createdId = created.id as number;
    trace.push({
      step: "create:done",
      t: Date.now() - ts,
      result: { id: createdId, slug: testSlug },
    });
  } catch (err) {
    trace.push({
      step: "create:FAILED",
      t: Date.now() - ts,
      result: (err as Error).message,
    });
    return NextResponse.json({ ts, testSlug, trace }, { status: 500 });
  }

  // Step 2 : Verify exists immediately
  try {
    const r = await payload.find({
      collection: "job-offers",
      where: { slug: { equals: testSlug } },
      limit: 1,
      overrideAccess: true,
    });
    trace.push({
      step: "verify:t0",
      t: Date.now() - ts,
      result: { found: r.docs.length, id: r.docs[0]?.id },
    });
  } catch (err) {
    trace.push({
      step: "verify:t0:FAILED",
      t: Date.now() - ts,
      result: (err as Error).message,
    });
  }

  // Step 3 : Wait 60s, verify again
  await sleep(60000);
  try {
    const r = await payload.find({
      collection: "job-offers",
      where: { slug: { equals: testSlug } },
      limit: 1,
      overrideAccess: true,
    });
    trace.push({
      step: "verify:t60",
      t: Date.now() - ts,
      result: { found: r.docs.length, id: r.docs[0]?.id },
    });
  } catch (err) {
    trace.push({
      step: "verify:t60:FAILED",
      t: Date.now() - ts,
      result: (err as Error).message,
    });
  }

  // Step 4 : Wait another 60s, verify again
  await sleep(60000);
  try {
    const r = await payload.find({
      collection: "job-offers",
      where: { slug: { equals: testSlug } },
      limit: 1,
      overrideAccess: true,
    });
    trace.push({
      step: "verify:t120",
      t: Date.now() - ts,
      result: { found: r.docs.length, id: r.docs[0]?.id },
    });
  } catch (err) {
    trace.push({
      step: "verify:t120:FAILED",
      t: Date.now() - ts,
      result: (err as Error).message,
    });
  }

  // Step 5 : Cleanup (delete the test offer no matter what)
  if (createdId) {
    try {
      await payload.delete({
        collection: "job-offers",
        id: createdId,
        overrideAccess: true,
      });
      trace.push({
        step: "cleanup:done",
        t: Date.now() - ts,
        result: { deleted: createdId },
      });
    } catch (err) {
      trace.push({
        step: "cleanup:FAILED",
        t: Date.now() - ts,
        result: (err as Error).message,
      });
    }
  }

  return NextResponse.json({
    ts,
    testSlug,
    duration_ms: Date.now() - ts,
    trace,
  });
}
