/**
 * POST /api/admin/poc-w26-translate — POC du fix W26 hook translate cascade.
 *
 * Workflow d'usage (depuis Bash) :
 *   1) action="create" -> cree un article test avec 4 locales x 25 blocks,
 *      retourne l'id et les counts initiaux
 *   2) (Bash sleep 60s) -> simule l'intervalle ou le hook auto-translate
 *      pourrait nullifier le body si bug present
 *   3) action="check" + id -> relit les 4 locales, retourne les counts
 *      apres l'intervalle. Si counts = 25 partout = fix marche.
 *   4) action="delete" + id -> cleanup
 *
 * Auth via REVALIDATE_SECRET.
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TEST_SLUG = "poc-w26-translate-fix";

function makeBlocks(suffix: string): Array<Record<string, unknown>> {
  // 25 blocks : 1 byline + 6 h2 + 18 p (mix de types pour realisme)
  const blocks: Array<Record<string, unknown>> = [];
  for (let i = 1; i <= 6; i++) {
    blocks.push({ blockType: "h2", content: `Section ${i} (${suffix})` });
    for (let j = 1; j <= 3; j++) {
      blocks.push({
        blockType: "p",
        content: `Paragraphe ${i}.${j} en ${suffix}. Test content pour POC W26 verification que le body ne se vide pas apres write multi-locales.`,
      });
    }
  }
  blocks.push({ blockType: "p", content: `Conclusion test ${suffix}.` });
  return blocks;
}

const LOCALE_CONTENT = {
  fr: {
    title: "POC W26 : test fix translate cascade (FR)",
    excerpt: "Article temporaire pour valider que le body persiste sur 4 locales apres write multi-locales.",
    body: makeBlocks("FR"),
  },
  en: {
    title: "POC W26: translate cascade fix test (EN)",
    excerpt: "Temporary article to validate that body persists across 4 locales after multi-locale write.",
    body: makeBlocks("EN"),
  },
  ja: {
    title: "POC W26: 翻訳カスケード修正テスト (JA)",
    excerpt: "マルチロケール書き込み後に4ロケールでボディが保持されることを検証する一時的な記事。",
    body: makeBlocks("JA"),
  },
  "fr-ca": {
    title: "POC W26 : test fix translate cascade (FR-CA)",
    excerpt: "Article temporaire pour valider que le body persiste sur 4 locales apres write multi-locales (FR-CA).",
    body: makeBlocks("FR-CA"),
  },
};

export async function POST(req: Request) {
  let body: { secret?: string; action?: string; id?: number };
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

  // CREATE : POST fr (avec body) puis PATCH en/ja/fr-ca (chacun avec body)
  if (body.action === "create") {
    // Cleanup si deja existe
    const existing = await payload.find({
      collection: "articles",
      where: { slug: { equals: TEST_SLUG } },
      limit: 1,
      overrideAccess: true,
    });
    if (existing.docs.length > 0) {
      await payload.delete({
        collection: "articles",
        id: existing.docs[0]!.id as number,
        overrideAccess: true,
      });
    }

    // Get admin user pour author
    const users = await payload.find({
      collection: "users",
      where: { role: { equals: "admin" } },
      limit: 1,
      overrideAccess: true,
    });
    const authorId = users.docs[0]?.id;
    if (!authorId) {
      return NextResponse.json(
        { error: "No admin user" },
        { status: 500 },
      );
    }

    // Step 1 : CREATE en FR (= simule POST ?locale=fr du workflow utilisateur)
    const created = await payload.create({
      collection: "articles",
      locale: "fr",
      overrideAccess: true,
      data: {
        slug: TEST_SLUG,
        status: "draft",
        author: authorId,
        featured: false,
        tag: "Test",
        readTime: "1 min",
        publishedAt: "2026-06-23",
        title: LOCALE_CONTENT.fr.title,
        excerpt: LOCALE_CONTENT.fr.excerpt,
        body: LOCALE_CONTENT.fr.body as never,
      },
    });

    // Step 2 : PATCH chaque locale != fr (= simule PATCH ?locale=xx)
    // Note : on FAIT ces updates SANS context.autoTranslate
    // pour reproduire exactement le workflow utilisateur.
    for (const loc of ["en", "ja", "fr-ca"] as const) {
      await payload.update({
        collection: "articles",
        id: created.id as number,
        locale: loc,
        overrideAccess: true,
        data: {
          title: LOCALE_CONTENT[loc].title,
          excerpt: LOCALE_CONTENT[loc].excerpt,
          body: LOCALE_CONTENT[loc].body as never,
        },
      });
    }

    // Step 3 : Read immediate counts
    const counts: Record<string, number> = {};
    for (const loc of ["fr", "en", "ja", "fr-ca"] as const) {
      const d = (await payload.findByID({
        collection: "articles",
        id: created.id as number,
        locale: loc,
        overrideAccess: true,
      })) as { body?: unknown[] };
      counts[loc] = Array.isArray(d.body) ? d.body.length : 0;
    }

    return NextResponse.json({
      ok: true,
      step: "created + 4 locales written",
      id: created.id,
      slug: TEST_SLUG,
      initialCounts: counts,
      note: "Wait 60s minimum then call action=check with this id to verify body persists.",
    });
  }

  // CHECK : reads counts pour verifier que le body n'a pas ete nullifie
  if (body.action === "check") {
    if (!body.id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const counts: Record<string, number> = {};
    const titles: Record<string, string> = {};
    for (const loc of ["fr", "en", "ja", "fr-ca"] as const) {
      const d = (await payload.findByID({
        collection: "articles",
        id: body.id,
        locale: loc,
        overrideAccess: true,
      })) as { body?: unknown[]; title?: string };
      counts[loc] = Array.isArray(d.body) ? d.body.length : 0;
      titles[loc] = (d.title ?? "NULL").slice(0, 60);
    }
    const allOK = Object.values(counts).every((c) => c === 25);
    return NextResponse.json({
      ok: true,
      step: "check",
      id: body.id,
      counts,
      titles,
      verdict: allOK
        ? "PASS : body persiste sur les 4 locales (fix W26 OK)"
        : "FAIL : au moins une locale a un body < 25 blocks (fix W26 NOK)",
    });
  }

  // DELETE : cleanup
  if (body.action === "delete") {
    if (!body.id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    await payload.delete({
      collection: "articles",
      id: body.id,
      overrideAccess: true,
    });
    return NextResponse.json({ ok: true, deleted: body.id });
  }

  return NextResponse.json(
    { error: "Unknown action. Use create | check | delete." },
    { status: 400 },
  );
}
