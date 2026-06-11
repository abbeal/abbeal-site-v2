/**
 * lib/articles-cms.ts — helper fetch CMS Payload articles.
 *
 * Meme pattern que lib/job-offers.ts : fetch HTTP vers /api/articles
 * (pas getPayload SDK direct) pour eviter le bug d'init Payload SSR
 * sur Vercel runtime que j'ai observe en W24 sur les job-offers.
 *
 * Les articles existants en lib/articles.ts (28 statiques) restent
 * en place. Les pages /insights et /insights/[slug] font un cumul :
 *   - CMS published d'abord (frais, edites)
 *   - Statique en fallback (compat retro)
 *   - Dedupe par slug si conflit (CMS gagne)
 */

import type { ArticleBlock, Article } from "./articles";
import type { Locale } from "./i18n";

/** Shape minimale d'un article CMS retourne par /api/articles. */
type CMSArticleRaw = {
  id: number;
  slug: string;
  status: string;
  featured?: boolean;
  featuredOnHome?: boolean;
  tag?: string;
  readTime?: string;
  publishedAt?: string;
  updatedAt?: string;
  title?: string;
  excerpt?: string;
  metaDescription?: string;
  keywords?: string;
  faq?: Array<{ q: string; a: string }>;
  relatedCaseSlug?: string;
  relatedServiceSlug?: string;
  body?: Array<Record<string, unknown> & { blockType?: string; type?: string }>;
};

/** Article CMS normalise au format compatible avec lib/articles Article.
 *  Utile pour fusionner avec les statiques dans un meme array. */
export type CMSArticle = {
  slug: string;
  source: "cms";
  featured: boolean;
  featuredOnHome?: boolean;
  tag: string;
  readTime: string;
  publishedAt: string;
  updatedAt?: string;
  title: string;
  excerpt: string;
  metaDescription?: string;
  keywords?: string;
  faq?: Array<{ q: string; a: string }>;
  relatedCaseSlug?: string;
  relatedServiceSlug?: string;
  body: ArticleBlock[];
};

/** Convertit les blocks Payload (blockType: h2/p/list/...) vers le format
 *  ArticleBlock (type: h2/p/list/...). Same logic que payloadBlocksToArticleBlocks
 *  dans lib/job-offers.ts. */
function payloadBlocksToArticleBlocks(
  blocks: Array<Record<string, unknown>>,
): ArticleBlock[] {
  const out: ArticleBlock[] = [];
  for (const b of blocks) {
    const t = (b.blockType as string) ?? (b.type as string);
    if (!t) continue;
    if (t === "h2" || t === "h3") {
      out.push({ type: t, content: (b.content as string) ?? "" });
    } else if (t === "p") {
      out.push({ type: "p", content: (b.content as string) ?? "" });
    } else if (t === "list") {
      const items = (b.items as Array<{ text: string }> | undefined) ?? [];
      out.push({
        type: "list",
        items: items.map((i) => i.text).filter(Boolean),
        ordered: Boolean(b.ordered),
      });
    } else if (t === "quote") {
      out.push({
        type: "quote",
        content: (b.content as string) ?? "",
        ...(b.author ? { author: b.author as string } : {}),
      });
    } else if (t === "code") {
      out.push({
        type: "code",
        content: (b.content as string) ?? "",
        ...(b.lang ? { lang: b.lang as string } : {}),
      });
    } else if (t === "callout") {
      out.push({
        type: "callout",
        content: (b.content as string) ?? "",
        ...(b.tone ? { tone: b.tone as "default" | "teal" | "ink" } : {}),
      });
    } else if (t === "byline") {
      out.push({
        type: "byline",
        name: (b.name as string) ?? "",
        role: (b.role as string) ?? "",
        ...(b.linkedinUrl ? { linkedinUrl: b.linkedinUrl as string } : {}),
        ...(b.photo ? { photo: b.photo as string } : {}),
      });
    } else if (t === "link") {
      out.push({
        type: "link",
        label: (b.label as string) ?? "",
        href: (b.href as string) ?? "",
        ...(b.external !== undefined ? { external: b.external as boolean } : {}),
      });
    } else if (t === "platformHeader") {
      out.push({
        type: "platformHeader",
        name: (b.name as string) ?? "",
        logoSrc: (b.logoSrc as string) ?? "",
        href: (b.href as string) ?? "",
        ...(b.tagline ? { tagline: b.tagline as string } : {}),
      });
    } else if (t === "image") {
      out.push({
        type: "image",
        src: (b.src as string) ?? "",
        alt: (b.alt as string) ?? "",
        ...(b.caption ? { caption: b.caption as string } : {}),
      });
    }
  }
  return out;
}

function normalizeCMSArticle(raw: CMSArticleRaw): CMSArticle {
  return {
    slug: raw.slug,
    source: "cms",
    featured: Boolean(raw.featured),
    ...(raw.featuredOnHome !== undefined
      ? { featuredOnHome: Boolean(raw.featuredOnHome) }
      : {}),
    tag: raw.tag ?? "Insights",
    readTime: raw.readTime ?? "5 min",
    publishedAt:
      raw.publishedAt ?? new Date().toISOString().slice(0, 10),
    ...(raw.updatedAt ? { updatedAt: raw.updatedAt } : {}),
    title: raw.title ?? "",
    excerpt: raw.excerpt ?? "",
    ...(raw.metaDescription ? { metaDescription: raw.metaDescription } : {}),
    ...(raw.keywords ? { keywords: raw.keywords } : {}),
    ...(raw.faq ? { faq: raw.faq } : {}),
    ...(raw.relatedCaseSlug ? { relatedCaseSlug: raw.relatedCaseSlug } : {}),
    ...(raw.relatedServiceSlug
      ? { relatedServiceSlug: raw.relatedServiceSlug }
      : {}),
    body: Array.isArray(raw.body)
      ? payloadBlocksToArticleBlocks(raw.body)
      : [],
  };
}

/** Toutes les articles CMS published, triees publishedAt DESC.
 *  Resilient : retourne [] si API down (les statiques font fallback). */
export async function getCMSArticles(locale: Locale): Promise<CMSArticle[]> {
  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const url = `${base}/api/articles?where[status][equals]=published&locale=${locale}&depth=0&limit=200&sort=-publishedAt`;

    const res = await fetch(url, {
      next: { revalidate: 60, tags: ["articles"] },
    });
    if (!res.ok) {
      console.error(`[articles-cms] /api/articles returned ${res.status}`);
      return [];
    }
    const data = (await res.json()) as {
      docs?: Array<CMSArticleRaw & Record<string, unknown>>;
    };
    return (data.docs ?? []).map(normalizeCMSArticle);
  } catch (err) {
    console.error("[articles-cms] getCMSArticles failed :", err);
    return [];
  }
}

/** Un article CMS par slug (published uniquement). */
export async function getCMSArticle(
  slug: string,
  locale: Locale,
): Promise<CMSArticle | null> {
  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const url = `${base}/api/articles?where[and][0][slug][equals]=${encodeURIComponent(slug)}&where[and][1][status][equals]=published&locale=${locale}&depth=0&limit=1`;

    const res = await fetch(url, {
      next: { revalidate: 60, tags: ["articles"] },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      docs?: Array<CMSArticleRaw & Record<string, unknown>>;
    };
    if (!data.docs?.length) return null;
    return normalizeCMSArticle(data.docs[0]!);
  } catch (err) {
    console.error(`[articles-cms] getCMSArticle(${slug}) failed :`, err);
    return null;
  }
}

/** Adapter : convertit un CMSArticle en shape Article (lib/articles.ts)
 *  pour reutiliser les helpers pick() + components qui attendent ce format. */
export function cmsArticleAsArticle(c: CMSArticle): Article {
  // pick(translatable, locale) attend { fr: ... } shape. On wrap les
  // champs en pseudo-translatable avec uniquement la locale courante.
  // Le caller doit etre conscient que c'est mono-locale.
  const wrap = <T>(v: T) => ({ fr: v }) as { fr: T };
  return {
    slug: c.slug,
    featured: c.featured,
    ...(c.featuredOnHome !== undefined
      ? { featuredOnHome: c.featuredOnHome }
      : {}),
    tag: c.tag,
    readTime: c.readTime,
    publishedAt: c.publishedAt,
    ...(c.updatedAt ? { updatedAt: c.updatedAt } : {}),
    title: wrap(c.title),
    excerpt: wrap(c.excerpt),
    ...(c.metaDescription
      ? { metaDescription: wrap(c.metaDescription) }
      : {}),
    ...(c.keywords ? { keywords: wrap(c.keywords) } : {}),
    ...(c.faq ? { faq: wrap(c.faq) } : {}),
    ...(c.relatedCaseSlug ? { relatedCaseSlug: c.relatedCaseSlug } : {}),
    ...(c.relatedServiceSlug
      ? { relatedServiceSlug: c.relatedServiceSlug }
      : {}),
    body: wrap(c.body),
  } as Article;
}
