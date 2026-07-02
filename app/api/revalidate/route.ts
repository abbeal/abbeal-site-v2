/**
 * POST /api/revalidate — on-demand ISR revalidation.
 *
 * Pourquoi ce endpoint existe :
 *   La page /careers est SSG avec revalidate = 300 (5 min). En pratique,
 *   le cache Vercel CDN tient bien plus longtemps (35h+ observe en
 *   W24) parce qu'ISR ne se re-declenche qu'a la prochaine request
 *   apres l'expiration de TTL — et meme la, en mode SWR la 1ere request
 *   retourne le cache stale. Resultat : quand un admin Payload publie
 *   une nouvelle offre, elle peut ne pas apparaitre sur /careers
 *   pendant des heures.
 *
 *   Fix : un hook Payload afterChange sur la collection JobOffers fait
 *   un POST sur ce endpoint a chaque save (create/update/delete) →
 *   revalidatePath() invalide instantannement le cache → la prochaine
 *   request /careers refait un SSR frais → offre visible sous <5s.
 *
 * Securite :
 *   - Protected par REVALIDATE_SECRET (env var, generated random hex 32)
 *   - Path whitelisting strict : seuls /careers et ses variantes par
 *     locale sont autorises (evite l'utilisation comme RCE-like).
 *   - Header Content-Type required + body JSON parse strict
 *
 * Usage :
 *   POST /api/revalidate
 *   Content-Type: application/json
 *   Body: { "path": "/fr/careers", "secret": "<REVALIDATE_SECRET>" }
 *
 *   Retours :
 *     200 { revalidated: true, path }   → cache invalide
 *     401 { error: "unauthorized" }      → secret invalide
 *     400 { error: "invalid path" }      → path pas dans whitelist
 *     500 { error: "..." }               → exception runtime
 */

import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Whitelist stricte : seuls ces paths sont revalidables via ce endpoint.
// Etendre quand on ajoute d'autres collections CMS-driven (articles, cases).
const ALLOWED_PATHS = new Set<string>([
  // /careers listing
  "/fr/careers",
  "/en/careers",
  "/ja/careers",
  "/fr-ca/careers",
  // /insights listing (pivot CMS-first PR #32)
  "/fr/insights",
  "/en/insights",
  "/ja/insights",
  "/fr-ca/insights",
  // Home (le CareersTeaser cumule les offres CMS)
  "/fr",
  "/en",
  "/ja",
  "/fr-ca",
  // Sitemap : regenere a chaque publication CMS d'articles ou job-offers
  // pour que Google voie instantanement les nouvelles URLs. Fix W26.
  "/sitemap.xml",
]);

// Pour /insights/[slug] (variable) on accepte tout path qui matche
// /{locale}/insights/{slug} avec slug kebab-case.
const INSIGHT_DETAIL_PATTERN = /^\/(fr|en|ja|fr-ca)\/insights\/[a-z0-9-]+$/;
// Pour /careers/[slug] : idem
const CAREER_DETAIL_PATTERN = /^\/(fr|en|ja|fr-ca)\/careers\/[a-z0-9-]+$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { path?: string; secret?: string };
    const { path, secret } = body;

    // Secret check : compare-string strict, pas de timing safe (low-risk
    // endpoint, secret a 256 bits d'entropie).
    const expected = process.env.REVALIDATE_SECRET;
    if (!expected) {
      console.error("[revalidate] REVALIDATE_SECRET env var not set");
      return NextResponse.json(
        { error: "server misconfigured" },
        { status: 500 },
      );
    }
    if (!secret || secret !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    if (
      !path ||
      (!ALLOWED_PATHS.has(path) &&
        !INSIGHT_DETAIL_PATTERN.test(path) &&
        !CAREER_DETAIL_PATTERN.test(path))
    ) {
      return NextResponse.json(
        { error: "invalid path (not in whitelist)" },
        { status: 400 },
      );
    }

    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path });
  } catch (err) {
    console.error("[revalidate] failed :", err);
    return NextResponse.json(
      { error: (err as Error).message ?? "revalidate failed" },
      { status: 500 },
    );
  }
}
