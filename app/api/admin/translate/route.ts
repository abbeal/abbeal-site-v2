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
  collection?: "articles" | "job-offers"; // default: articles
  /** Si defini, ne traduit QUE cette locale (au lieu des 3 par defaut).
   *  Utile pour eviter le Vercel function timeout sur les gros bodies :
   *  faire 3 calls separes plutot qu'un seul call qui boucle. */
  locale?: "en" | "ja" | "fr-ca";
};

// Map collection slug -> sa shape (body field name + types compatibility)
const SUPPORTED_COLLECTIONS = {
  articles: { bodyField: "body" },
  "job-offers": { bodyField: "description" },
} as const;
type SupportedCollection = keyof typeof SUPPORTED_COLLECTIONS;

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

  const collection: SupportedCollection = body.collection ?? "articles";
  if (!(collection in SUPPORTED_COLLECTIONS)) {
    return NextResponse.json(
      { error: `Unsupported collection: ${collection}` },
      { status: 400 },
    );
  }
  const bodyField = SUPPORTED_COLLECTIONS[collection].bodyField;

  try {
    const payload = await getPayload({ config });

    // Fetch doc FR (overrideAccess pour bypass draft access)
    const found = await payload.find({
      collection,
      where: { slug: { equals: body.slug } },
      locale: "fr",
      limit: 1,
      overrideAccess: true,
    });
    if (found.docs.length === 0) {
      return NextResponse.json(
        { error: `${collection} slug "${body.slug}" not found` },
        { status: 404 },
      );
    }
    const doc = found.docs[0]!;
    const dr = doc as unknown as Record<string, unknown>;
    const frTitle = typeof dr.title === "string" ? dr.title : null;
    if (!frTitle) {
      return NextResponse.json(
        { error: `${collection} ${body.slug} has no FR title` },
        { status: 400 },
      );
    }

    const source = {
      title: frTitle,
      excerpt: typeof dr.excerpt === "string" ? dr.excerpt : "",
      metaDescription:
        typeof dr.metaDescription === "string" ? dr.metaDescription : undefined,
      body: Array.isArray(dr[bodyField])
        ? (dr[bodyField] as Array<Record<string, unknown> & { type: string }>)
        : [],
    };

    // Si body.locale specifie, on ne traduit QUE cette locale (evite
    // timeout Vercel sur les gros bodies en faisant 3 calls separes).
    const targets = body.locale
      ? ([body.locale] as const)
      : (["en", "ja", "fr-ca"] as const);
    const translated: string[] = [];
    const skipped: string[] = [];
    const failed: Array<{ locale: string; reason: string }> = [];

    for (const locale of targets) {
      try {
        const existing = await payload.findByID({
          collection,
          id: doc.id as number,
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

        // Remap : translateArticle retourne { body } mais job-offers attend
        // { description }. On mappe le champ correctement.
        //
        // Strip `id` des blocks ET des nested `items` (block list).
        // Payload genere de nouveaux UUIDs par locale. Si on laisse les IDs,
        // Drizzle insert tente de re-use UUID FR pour EN -> primary key conflict.
        // Bug observe sur job_offers_blocks_list_items quand strip incomplet.
        const stripIdsDeep = (blocks: Array<Record<string, unknown>>) =>
          blocks.map(({ id: _id, ...rest }) => {
            const out = { ...rest };
            // Strip nested items (block list)
            if (Array.isArray(out.items)) {
              out.items = (out.items as Array<Record<string, unknown>>).map(
                ({ id: _itemId, ...itemRest }) => itemRest,
              );
            }
            return out;
          });

        const translatedBody = Array.isArray(result.body)
          ? stripIdsDeep(result.body as Array<Record<string, unknown>>)
          : [];

        // SAFETY : si Claude a renvoye un body vide (parse partial, truncate,
        // erreur silencieuse), NE PAS overwrite le body existant — on
        // preserve ce qui est deja en CMS. Sinon on nullifie le content.
        const shouldUpdateBody = translatedBody.length > 0;

        // SalaryRange translate (job-offers only — Articles n'a pas ce field)
        let translatedSalary: string | undefined;
        if (collection === "job-offers" && typeof dr.salaryRange === "string") {
          const sourceSalary = dr.salaryRange as string;
          const trWrap = await translateArticle(
            {
              title: sourceSalary,
              excerpt: "",
              body: [],
            },
            locale,
          );
          if (trWrap?.title) translatedSalary = trWrap.title;
        }

        const updateData: Record<string, unknown> = {
          title: result.title,
          excerpt: result.excerpt,
          ...(result.metaDescription
            ? { metaDescription: result.metaDescription }
            : {}),
          ...(translatedSalary ? { salaryRange: translatedSalary } : {}),
          ...(shouldUpdateBody ? { [bodyField]: translatedBody } : {}),
        };

        await payload.update({
          collection,
          id: doc.id as number,
          locale,
          data: updateData,
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
      collection,
      slug: body.slug,
      id: doc.id,
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
