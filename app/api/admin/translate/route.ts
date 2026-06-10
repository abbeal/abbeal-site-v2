/**
 * POST /api/admin/translate — endpoint admin pour traduire un article
 * existant FR -> EN/JA/FR-CA via Claude API.
 *
 * Auth via REVALIDATE_SECRET (deja set en prod, reuse pour eviter
 * d'ajouter un Nieme secret).
 *
 * Usage (curl) :
 *   curl -X POST https://abbeal.com/api/admin/translate \
 *     -H "Content-Type: application/json" \
 *     -d '{"slug":"agents-ia-production","secret":"..."}'
 *
 * Response :
 *   { ok: true, slug, translated: ['en','ja','fr-ca'], skipped: [] }
 *   { error: "...", status }
 *
 * Behavior :
 *   - Fetch article CMS par slug (admin overrideAccess pour bypasser draft)
 *   - Pour chaque locale cible :
 *     - Skip si traduction deja faite (title diff du FR)
 *     - Sinon : Claude translate + payload.update
 *   - Sequential (pas parallel) pour eviter rate limit Anthropic
 *   - Tres tolerant : un fail par locale ne casse pas les autres
 *
 * Mode batch : pour traduire les 27 articles existants, boucle cote
 * client sur la liste des slugs (recupere via /api/articles).
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";
import { translateArticle } from "../../../../lib/translate-article";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min : 3 locales × ~30s Claude = ~90s, marge x3

type ReqBody = {
  slug?: string;
  secret?: string;
  force?: boolean; // si true, re-traduit meme si la locale est deja remplie
};

export async function POST(req: Request) {
  let body: ReqBody;
  try {
    body = (await req.json()) as ReqBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { error: "REVALIDATE_SECRET not configured" },
      { status: 500 },
    );
  }
  if (!body.secret || body.secret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!body.slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured on Vercel" },
      { status: 500 },
    );
  }

  try {
    const payload = await getPayload({ config });

    // Fetch article FR (overrideAccess pour bypass draft access)
    const found = await payload.find({
      collection: "articles",
      where: { slug: { equals: body.slug } },
      locale: "fr",
      limit: 1,
      overrideAccess: true,
    });
    if (found.docs.length === 0) {
      return NextResponse.json(
        { error: `Article slug "${body.slug}" not found` },
        { status: 404 },
      );
    }
    const article = found.docs[0]!;
    const ar = article as unknown as Record<string, unknown>;
    const frTitle = typeof ar.title === "string" ? ar.title : null;
    if (!frTitle) {
      return NextResponse.json(
        { error: `Article ${body.slug} has no FR title` },
        { status: 400 },
      );
    }

    const source = {
      title: frTitle,
      excerpt: typeof ar.excerpt === "string" ? ar.excerpt : "",
      metaDescription:
        typeof ar.metaDescription === "string" ? ar.metaDescription : undefined,
      body: Array.isArray(ar.body)
        ? (ar.body as Array<Record<string, unknown> & { type: string }>)
        : [],
    };

    const targets = ["en", "ja", "fr-ca"] as const;
    const translated: string[] = [];
    const skipped: string[] = [];
    const failed: Array<{ locale: string; reason: string }> = [];

    for (const locale of targets) {
      try {
        const existing = await payload.findByID({
          collection: "articles",
          id: article.id as number,
          locale,
          overrideAccess: true,
        });
        const existingTitle = (existing as { title?: string }).title;
        // Si force=true on retraduit. Sinon skip si deja traduit.
        if (
          !body.force &&
          existingTitle &&
          existingTitle !== frTitle
        ) {
          skipped.push(locale);
          continue;
        }

        const result = await translateArticle(source, locale);
        if (!result) {
          failed.push({ locale, reason: "claude returned null" });
          continue;
        }

        await payload.update({
          collection: "articles",
          id: article.id as number,
          locale,
          data: result as Record<string, unknown>,
          overrideAccess: true,
          context: { autoTranslate: true },
        });

        translated.push(locale);
      } catch (err) {
        failed.push({
          locale,
          reason: (err as Error).message ?? String(err),
        });
      }
    }

    return NextResponse.json({
      ok: true,
      slug: body.slug,
      id: article.id,
      translated,
      skipped,
      failed,
    });
  } catch (err) {
    console.error("[admin/translate] failed :", err);
    return NextResponse.json(
      { error: (err as Error).message ?? "unexpected error" },
      { status: 500 },
    );
  }
}
