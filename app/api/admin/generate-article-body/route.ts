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
  slug: string;
  title?: string | null;
  excerpt?: string | null;
  metaDescription?: string | null;
  keywords?: string | null;
  tag?: string;
  readTime?: string;
  faq?: FAQ[];
}): { prompt: string; needsTitleExcerpt: boolean } {
  const targetMinutes = parseInt(meta.readTime?.match(/\d+/)?.[0] ?? "8");
  const targetWords = targetMinutes * 180; // ~180 mots/min FR
  const faqStr =
    meta.faq && meta.faq.length > 0
      ? `\n\nFAQ existante (a integrer naturellement ou completer dans le body, sans la dupliquer mot a mot) :\n${meta.faq.map((q) => `- Q: ${q.q}\n  A: ${q.a}`).join("\n")}`
      : "";

  const needsTitleExcerpt = !meta.title || !meta.excerpt;

  // Si pas de title/excerpt, on demande a Claude de les generer en plus du
  // body. Sortie attendue : {title, excerpt, body[]}. Sinon : juste body[].
  if (needsTitleExcerpt) {
    return {
      needsTitleExcerpt: true,
      prompt: `Tu rediges un article de blog technique pour Abbeal, ESN senior specialisee en ingenierie logicielle. Audience : CTOs, tech leads, lead devs. Tone : direct, concret, anti-bullshit, retours terrain plutot que theorie. Pas de marketing-speak.

L'article a un slug et une FAQ deja remplis, mais le title et l'excerpt manquent. Genere-les en plus du body.

**Slug** : ${meta.slug}
${meta.tag ? `**Categorie** : ${meta.tag}` : ""}
**Read time cible** : ${meta.readTime ?? "8 min"} (~${targetWords} mots)${faqStr}

Format de sortie : JSON object avec 3 cles :
- "title": string, max ~80 chars, ton direct ("X: ce qu'il faut savoir" / "Pourquoi Y", pas de "Le guide complet de Z")
- "excerpt": string, 140-180 chars, accroche concrete qui pose le probleme et promet la valeur
- "body": array de blocks Payload (cf format ci-dessous)

Types de blocks autorises :
- { "blockType": "h2", "content": "..." }
- { "blockType": "h3", "content": "..." }
- { "blockType": "p", "content": "..." }       — markdown inline OK : **bold**, *italic*, [label](url), backticks pour code
- { "blockType": "list", "items": [{ "text": "..." }, ...] }
- { "blockType": "list", "ordered": true, "items": [{ "text": "..." }, ...] }
- { "blockType": "callout", "tone": "default" | "teal" | "ink", "content": "..." }
- { "blockType": "code", "lang": "ts|py|bash|...", "content": "..." }
- { "blockType": "quote", "content": "...", "author": "..." }

Structure body attendue :
1. Intro (2-3 p) qui hook le lecteur et pose le probleme
2. Sections h2 + body (4-7 h2 sections, certaines avec h3 sub-sections)
3. Au moins 1-2 list (pour les conseils/criteres/etapes)
4. Eventuellement 1 callout pour les warnings/highlights importants
5. Conclusion (1-2 p) avec next steps concrets ou CTA implicite Abbeal
6. (PAS de byline, PAS de footer Sources, c'est gere ailleurs)

Reponds UNIQUEMENT avec le JSON object, sans markdown wrapper, sans commentaire.`,
    };
  }

  return {
    needsTitleExcerpt: false,
    prompt: `Tu rediges un article de blog technique pour Abbeal, ESN senior specialisee en ingenierie logicielle. Audience : CTOs, tech leads, lead devs. Tone : direct, concret, anti-bullshit, retours terrain plutot que theorie. Pas de marketing-speak.

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

Reponds UNIQUEMENT avec le JSON array, sans markdown wrapper, sans commentaire, sans rien avant ou apres.`,
  };
}

export async function POST(req: Request) {
  let body: {
    id?: number;
    secret?: string;
    force?: boolean;
    collection?: "articles" | "job-offers";
  };
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

  const collection = body.collection ?? "articles";
  if (collection !== "articles" && collection !== "job-offers") {
    return NextResponse.json(
      { error: `Unsupported collection: ${collection}` },
      { status: 400 },
    );
  }
  // Body field name differs : articles.body vs job-offers.description
  const bodyField = collection === "job-offers" ? "description" : "body";

  const payload = await getPayload({ config });
  const doc = (await payload
    .findByID({
      collection,
      id: body.id,
      locale: "fr",
      overrideAccess: true,
    })
    .catch(() => null)) as Record<string, unknown> | null;
  if (!doc) {
    return NextResponse.json(
      { error: `${collection} id=${body.id} not found` },
      { status: 404 },
    );
  }

  const existingBody = Array.isArray(doc[bodyField])
    ? (doc[bodyField] as unknown[])
    : [];
  if (existingBody.length > 0 && !body.force) {
    return NextResponse.json({
      ok: true,
      skipped: true,
      reason: `${bodyField} already has ${existingBody.length} blocks. Use force=true to regenerate.`,
      id: body.id,
    });
  }

  // Build meta from doc (works for both articles and job-offers since job-offers
  // also have title/excerpt/metaDescription/keywords). For job-offers, we
  // additionally pass location/contractType/experienceLevel/techStack as hints
  // via the prompt builder (handled below).
  const techStackArr = Array.isArray(doc.techStack)
    ? (doc.techStack as Array<{ name?: string }>)
        .map((t) => t.name)
        .filter(Boolean)
        .join(", ")
    : undefined;
  const jobHint =
    collection === "job-offers"
      ? `\n**Type d'offre** : ${doc.location ?? "?"}, ${doc.contractType ?? "?"}, ${doc.experienceLevel ?? "?"}${techStackArr ? `\n**TechStack** : ${techStackArr}` : ""}`
      : "";

  const meta = {
    slug: String(doc.slug ?? `${collection}-${body.id}`),
    title: typeof doc.title === "string" ? doc.title : null,
    excerpt: typeof doc.excerpt === "string" ? doc.excerpt : null,
    metaDescription:
      typeof doc.metaDescription === "string"
        ? doc.metaDescription
        : undefined,
    keywords: typeof doc.keywords === "string" ? doc.keywords : undefined,
    tag: typeof doc.tag === "string" ? doc.tag : jobHint || undefined,
    readTime: typeof doc.readTime === "string" ? doc.readTime : undefined,
    faq: Array.isArray(doc.faq) ? (doc.faq as FAQ[]) : undefined,
  };

  const { prompt, needsTitleExcerpt } = buildPrompt(meta);

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
  let generatedTitle: string | undefined;
  let generatedExcerpt: string | undefined;
  try {
    const parsed = JSON.parse(rawJson) as unknown;
    if (needsTitleExcerpt) {
      // Mode title+excerpt+body : Claude renvoie un objet
      const obj = parsed as {
        title?: string;
        excerpt?: string;
        body?: Array<Record<string, unknown>>;
      };
      if (!obj.title || !obj.excerpt || !Array.isArray(obj.body)) {
        throw new Error(
          "expected object {title, excerpt, body[]} from Claude",
        );
      }
      generatedTitle = obj.title;
      generatedExcerpt = obj.excerpt;
      blocks = obj.body;
    } else {
      // Mode body seulement : Claude renvoie un array direct
      if (!Array.isArray(parsed)) throw new Error("not an array");
      blocks = parsed as Array<Record<string, unknown>>;
    }
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
  // Si needsTitleExcerpt = true, on update aussi title + excerpt en meme
  // temps (Claude les a generes dans le meme JSON).
  // Le hook afterChange propage auto-translate vers EN/JA/FR-CA.
  // bodyField = "body" pour articles, "description" pour job-offers.
  const updateData: Record<string, unknown> = { [bodyField]: blocks as never };
  if (generatedTitle) updateData.title = generatedTitle;
  if (generatedExcerpt) updateData.excerpt = generatedExcerpt;
  try {
    await payload.update({
      collection,
      id: body.id,
      locale: "fr",
      data: updateData,
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
    collection,
    id: body.id,
    slug: doc.slug,
    blocksGenerated: blocks.length,
    h2Count: blocks.filter((b) => b.blockType === "h2").length,
    wordCount: blocks
      .filter((b) => b.blockType === "p" || b.blockType === "callout")
      .reduce((acc, b) => acc + String(b.content ?? "").split(/\s+/).length, 0),
    ...(generatedTitle ? { generatedTitle } : {}),
    ...(generatedExcerpt ? { generatedExcerpt } : {}),
    note: "Hook afterChange Payload declenche auto-translate vers EN/JA/FR-CA en arriere-plan.",
  });
}
