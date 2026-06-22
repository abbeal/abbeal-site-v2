/**
 * POST /api/admin/generate-article-body — genere le body d'un article CMS
 * Payload qui a des metas (title, excerpt, keywords, faq) mais body vide.
 *
 * Cas d'usage : Sebastien cree un draft dans /admin avec les metas mais
 * oublie/n'a pas le temps d'ecrire le body. Cet endpoint genere un body
 * draft coherent via Claude API a partir des metas existants.
 *
 * Apres update, le hook afterChange Payload propage auto-translate vers
 * EN/JA/FR-CA si les autres locales sont vides.
 *
 * Body genere = format Payload Block (blockType: ...).
 *
 * Auth via REVALIDATE_SECRET. Idempotent : par defaut skip si body deja
 * rempli (sauf force=true).
 *
 * Usage :
 *   curl -X POST https://abbeal.com/api/admin/generate-article-body \
 *     -H "Content-Type: application/json" \
 *     -d '{"id":33,"secret":"REVALIDATE_SECRET","force":false}'
 */

import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "../../../../payload.config";

const ANTHROPIC_MODEL = "claude-sonnet-4-5";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min pour Claude generation longue

type FAQ = { q: string; a: string };

function buildPrompt(meta: {
  title: string;
  excerpt: string;
  metaDescription?: string;
  keywords?: string;
  tag?: string;
  readTime?: string;
  faq?: FAQ[];
}): string {
  const targetMinutes = parseInt(meta.readTime?.match(/\d+/)?.[0] ?? "8");
  const targetWords = targetMinutes * 180; // ~180 mots/min FR
  const faqStr =
    meta.faq && meta.faq.length > 0
      ? `\n\nFAQ existante (a integrer naturellement ou completer dans le body, sans la dupliquer mot a mot) :\n${meta.faq.map((q) => `- Q: ${q.q}\n  A: ${q.a}`).join("\n")}`
      : "";

  return `Tu rediges un article de blog technique pour Abbeal, ESN senior specialisee en ingenierie logicielle. Audience : CTOs, tech leads, lead devs. Tone : direct, concret, anti-bullshit, retours terrain plutot que theorie. Pas de marketing-speak.

Article a rediger :

**Titre** : ${meta.title}
**Sous-titre / accroche** : ${meta.excerpt}
${meta.metaDescription ? `**Meta description** : ${meta.metaDescription}` : ""}
${meta.keywords ? `**Mots-cles SEO** : ${meta.keywords}` : ""}
${meta.tag ? `**Categorie** : ${meta.tag}` : ""}
**Read time cible** : ${meta.readTime ?? "8 min"} (~${targetWords} mots)${faqStr}

Format de sortie : JSON array de blocks Payload, dans l'ordre du body. Types autorises :
- { "blockType": "h2", "content": "..." }
- { "blockType": "h3", "content": "..." }
- { "blockType": "p", "content": "..." }       — markdown inline OK : **bold**, *italic*, [label](url), backticks pour code
- { "blockType": "list", "items": [{ "text": "..." }, ...] }
- { "blockType": "list", "ordered": true, "items": [{ "text": "..." }, ...] }
- { "blockType": "callout", "tone": "default" | "teal" | "ink", "content": "..." }
- { "blockType": "code", "lang": "ts|py|bash|...", "content": "..." }
- { "blockType": "quote", "content": "...", "author": "..." }

Structure attendue :
1. Intro (2-3 p) qui hook le lecteur et pose le probleme
2. Sections h2 + body (4-7 h2 sections, certaines avec h3 sub-sections)
3. Au moins 1-2 list (pour les conseils/criteres/etapes)
4. Eventuellement 1 callout pour les warnings/highlights importants
5. Conclusion (1-2 p) avec next steps concrets ou CTA implicite Abbeal
6. (PAS de byline, PAS de footer Sources, c'est gere ailleurs)

Reponds UNIQUEMENT avec le JSON array, sans markdown wrapper, sans commentaire, sans rien avant ou apres.`;
}

export async function POST(req: Request) {
  let body: { id?: number; secret?: string; force?: boolean };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || !body.secret || body.secret !== expected) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 },
    );
  }

  const payload = await getPayload({ config });
  const doc = (await payload
    .findByID({
      collection: "articles",
      id: body.id,
      locale: "fr",
      overrideAccess: true,
    })
    .catch(() => null)) as Record<string, unknown> | null;
  if (!doc) {
    return NextResponse.json(
      { error: `Article id=${body.id} not found` },
      { status: 404 },
    );
  }

  const existingBody = Array.isArray(doc.body) ? doc.body : [];
  if (existingBody.length > 0 && !body.force) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: `body already has ${existingBody.length} blocks. Use force=true to regenerate.`,
      id: body.id,
    });
  }

  const meta = {
    title: String(doc.title ?? ""),
    excerpt: String(doc.excerpt ?? ""),
    metaDescription:
      typeof doc.metaDescription === "string"
        ? doc.metaDescription
        : undefined,
    keywords: typeof doc.keywords === "string" ? doc.keywords : undefined,
    tag: typeof doc.tag === "string" ? doc.tag : undefined,
    readTime: typeof doc.readTime === "string" ? doc.readTime : undefined,
    faq: Array.isArray(doc.faq) ? (doc.faq as FAQ[]) : undefined,
  };

  const prompt = buildPrompt(meta);

  let rawJson: string;
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 8000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        {
          error: `Claude API ${res.status}`,
          message: errorText.slice(0, 500),
        },
        { status: 500 },
      );
    }
    const data = (await res.json()) as {
      content?: Array<{ text?: string }>;
    };
    const text = data?.content?.[0]?.text;
    if (!text) {
      return NextResponse.json(
        { error: "Empty Claude response" },
        { status: 500 },
      );
    }
    rawJson = text.trim();
    // Strip markdown wrapper si Claude en a mis un malgre l'instruction
    const wrapped = rawJson.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
    if (wrapped) rawJson = wrapped[1]!.trim();
  } catch (err) {
    return NextResponse.json(
      {
        error: "Claude API call failed",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }

  let blocks: Array<Record<string, unknown>>;
  try {
    blocks = JSON.parse(rawJson) as Array<Record<string, unknown>>;
    if (!Array.isArray(blocks)) throw new Error("not an array");
  } catch (err) {
    return NextResponse.json(
      {
        error: "Claude returned invalid JSON",
        message: err instanceof Error ? err.message : String(err),
        preview: rawJson.slice(0, 500),
      },
      { status: 500 },
    );
  }

  // Update le doc CMS avec le body genere (locale fr explicite).
  // Le hook afterChange propage auto-translate vers EN/JA/FR-CA.
  try {
    await payload.update({
      collection: "articles",
      id: body.id,
      locale: "fr",
      data: { body: blocks as never },
      overrideAccess: true,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Payload update failed",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    generated: true,
    id: body.id,
    slug: doc.slug,
    blocksGenerated: blocks.length,
    h2Count: blocks.filter((b) => b.blockType === "h2").length,
    wordCount: blocks
      .filter((b) => b.blockType === "p" || b.blockType === "callout")
      .reduce((acc, b) => acc + String(b.content ?? "").split(/\s+/).length, 0),
    note: "Hook afterChange Payload declenche auto-translate vers EN/JA/FR-CA en arriere-plan.",
  });
}
