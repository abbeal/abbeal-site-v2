/**
 * POST /api/admin/create-fable-article — pousse l'article guest "Fable" de
 * Stephane Robin dans le CMS Payload (collection articles), depuis le static
 * lib/articles.ts + lib/article-bodies.json.
 *
 * Conversion ArticleBlock (type: ...) -> Payload Block (blockType: ...) :
 *   - list.items est un string[] cote static, doit etre array de {text} cote Payload
 *   - autres champs identiques modulo le renaming type -> blockType
 *
 * Apres create, le hook afterChange de la collection articles declenche
 * auto-translate vers EN/JA/FR-CA via Claude API.
 *
 * Auth via REVALIDATE_SECRET. Idempotent : si l'article existe deja,
 * skip (sauf force=true qui delete + recreate).
 *
 * Usage :
 *   curl -X POST https://abbeal.com/api/admin/create-fable-article \
 *     -H "Content-Type: application/json" \
 *     -d '{"secret":"REVALIDATE_SECRET","force":false}'
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";
import { articles } from "../../../../lib/articles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const SLUG = "fable-ia-equipe-remediation-stephane-robin";

/** Convertit un ArticleBlock (static lib/articles.ts) en Block Payload
 *  (collection articles body field). Renomme `type` en `blockType`. Pour
 *  les listes, convertit items: string[] -> items: [{text: string}]. */
function articleBlockToPayloadBlock(
  block: Record<string, unknown>,
): Record<string, unknown> {
  const { type, items, ...rest } = block;
  const out: Record<string, unknown> = { ...rest, blockType: type };
  if (type === "list" && Array.isArray(items)) {
    out.items = (items as string[]).map((text) => ({ text }));
  }
  return out;
}

export async function POST(req: Request) {
  let body: { secret?: string; force?: boolean };
  try {
    body = (await req.json()) as { secret?: string; force?: boolean };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !body.secret || body.secret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Recupere l'entree static
  const article = articles.find((a) => a.slug === SLUG);
  if (!article) {
    return NextResponse.json(
      { error: `Article ${SLUG} not found in static lib/articles.ts` },
      { status: 500 },
    );
  }

  const payload = await getPayload({ config });

  // Trouve le premier user admin pour l'attribuer comme author (le hook
  // beforeChange auto-rempli depuis req.user, mais ici overrideAccess sans
  // user). Fallback : premier user trouve.
  const usersRes = await payload.find({
    collection: "users",
    where: { role: { equals: "admin" } },
    limit: 1,
    overrideAccess: true,
  });
  const authorId = usersRes.docs[0]?.id;
  if (!authorId) {
    return NextResponse.json(
      { error: "No admin user found in DB" },
      { status: 500 },
    );
  }

  // Idempotency : check si deja en DB
  const existing = await payload.find({
    collection: "articles",
    where: { slug: { equals: SLUG } },
    limit: 1,
    overrideAccess: true,
  });
  if (existing.docs.length > 0) {
    if (!body.force) {
      return NextResponse.json({
        ok: true,
        existed: true,
        id: existing.docs[0]!.id,
        slug: SLUG,
      });
    }
    // Force : delete first puis recreate
    await payload.delete({
      collection: "articles",
      id: existing.docs[0]!.id as number,
      overrideAccess: true,
    });
  }

  // Conversion body FR -> blocks Payload
  const bodyFR = article.body.fr ?? [];
  const payloadBody = bodyFR.map((b) =>
    articleBlockToPayloadBlock(b as unknown as Record<string, unknown>),
  );

  // Conversion FAQ : array de {q, a} OK tel quel (matche le schema Payload)
  const faqFR = article.faq?.fr ?? [];

  try {
    const created = await payload.create({
      collection: "articles",
      overrideAccess: true,
      data: {
        slug: article.slug,
        status: "published",
        author: authorId,
        featured: article.featured,
        tag: article.tag,
        readTime: article.readTime,
        publishedAt: article.publishedAt,
        relatedCaseSlug: article.relatedCaseSlug,
        relatedServiceSlug: article.relatedServiceSlug,
        // Locale FR par defaut a la creation. Auto-translate hook prendra
        // le relais pour EN/JA/FR-CA.
        title: article.title.fr,
        excerpt: article.excerpt.fr,
        metaDescription: article.metaDescription?.fr,
        keywords: article.keywords?.fr,
        faq: faqFR,
        // Cast intentionnel : Payload genere un union type strict pour body
        // (un type par blockType), incompatible avec notre Record<string, unknown>[]
        // de conversion. La validation reste assuree par les `required` du
        // schema collection.
        body: payloadBody as never,
      },
    });

    return NextResponse.json({
      ok: true,
      created: true,
      id: created.id,
      slug: SLUG,
      bodyBlocks: payloadBody.length,
      faqItems: faqFR.length,
      authorId,
      note: "Auto-translate hook declenche en arriere-plan (fire-and-forget) pour EN/JA/FR-CA.",
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Create failed",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
