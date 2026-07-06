/**
 * POST /api/admin/set-home-featured — one-shot pour appliquer la selection
 * editoriale des 3 articles a la une sur la home page.
 *
 * TO_FEATURE : les 3 articles a mettre en featuredOnHome=true (+ featured=true
 * pour aussi les remonter en tete du listing /insights).
 *
 * TO_UNFEATURE : les articles a retirer de la home mais qui restent featured
 * dans le listing /insights (garder leur importance sans polluer la home).
 *
 * Auth via REVALIDATE_SECRET. Idempotent.
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Les 3 articles a mettre a la une (validation Sebastien juillet 2026)
const TO_FEATURE = [
  "ia-avenir-du-travail-ce-que-disent-les-chiffres",
  "ingenieur-france-quebec-japon-2026",
  "conseil-vs-ia-accenture-karpathy",
] as const;

// Anciens articles a retirer de featuredOnHome (mais keep featured=true
// pour qu'ils restent en tete du listing /insights)
const TO_UNFEATURE_HOME_ONLY = [
  "agents-ia-production",
  "output-based-vs-time-material",
] as const;

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
  const applied: Array<{ slug: string; action: string; ok: boolean }> = [];

  // Step 1 : set featured=true + featuredOnHome=true sur les 3 cibles
  for (const slug of TO_FEATURE) {
    const found = await payload.find({
      collection: "articles",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (found.docs.length === 0) {
      applied.push({ slug, action: "feature", ok: false });
      continue;
    }
    const doc = found.docs[0]!;
    await payload.update({
      collection: "articles",
      id: doc.id as number,
      data: { featured: true, featuredOnHome: true },
      overrideAccess: true,
      // Skip auto-translate hook (no content change)
      context: { autoTranslate: true },
    });
    applied.push({ slug, action: "feature+featuredOnHome", ok: true });
  }

  // Step 2 : unset featuredOnHome sur les anciens (garde featured=true
  // pour /insights listing)
  for (const slug of TO_UNFEATURE_HOME_ONLY) {
    const found = await payload.find({
      collection: "articles",
      where: { slug: { equals: slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (found.docs.length === 0) {
      applied.push({ slug, action: "unfeature-home", ok: false });
      continue;
    }
    const doc = found.docs[0]!;
    await payload.update({
      collection: "articles",
      id: doc.id as number,
      data: { featuredOnHome: false },
      overrideAccess: true,
      context: { autoTranslate: true },
    });
    applied.push({ slug, action: "featuredOnHome=false", ok: true });
  }

  // Step 3 : revalidate home + insights + sitemap
  const revalPaths = [
    "/fr",
    "/en",
    "/ja",
    "/fr-ca",
    "/fr/insights",
    "/en/insights",
    "/ja/insights",
    "/fr-ca/insights",
    "/sitemap.xml",
  ];
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://abbeal.com");
  for (const path of revalPaths) {
    fetch(`${base}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, secret: expected }),
    }).catch(() => {});
  }

  return NextResponse.json({
    ok: true,
    applied,
    revalidated: revalPaths.length,
    note: "Home /fr /en /ja /fr-ca now show the 3 featured articles.",
  });
}
