import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { articles, getArticle, getAllArticles, pick } from "@/lib/articles";
import { ArticleBlocks } from "@/components/sections/ArticleBlocks";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { pageAlternates } from "@/lib/seo";

export async function generateStaticParams() {
  return locales.flatMap((lang) =>
    articles.map((a) => ({ lang, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/insights/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const article = getArticle(slug);
  if (!article) return { title: "Article introuvable · Abbeal" };
  return {
    title: `${pick(article.title, lang as Locale)} · Abbeal Insights`,
    description: pick(article.excerpt, lang as Locale),
    alternates: pageAlternates(lang as Locale, `/insights/${slug}`),
  };
}

export default async function InsightArticlePage({
  params,
}: PageProps<"/[lang]/insights/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const article = getArticle(slug);
  if (!article) notFound();

  const title = pick(article.title, locale);
  const excerpt = pick(article.excerpt, locale);
  const body = pick(article.body, locale);

  // Related articles (same tag, max 3)
  const related = getAllArticles()
    .filter((a) => a.slug !== article.slug && a.tag === article.tag)
    .slice(0, 3);
  const fallback = getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 3);
  const relatedFinal = related.length >= 2 ? related : fallback;

  const t = {
    fr: {
      back: "← Insights",
      related: "// À lire ensuite",
      ctaTitle: "Vous avez un projet qui ressemble à ça ?",
      ctaBtn: "Parler à un architecte",
    },
    en: {
      back: "← Insights",
      related: "// Read next",
      ctaTitle: "Working on something similar?",
      ctaBtn: "Talk to an architect",
    },
    ja: {
      back: "← インサイト",
      related: "// 次に読む",
      ctaTitle: "似たような案件がありますか？",
      ctaBtn: "アーキテクトと話す",
    },
    "fr-ca": {
      back: "← Articles",
      related: "// À lire ensuite",
      ctaTitle: "Tu as un projet qui ressemble à ça ?",
      ctaBtn: "Parler à un architecte",
    },
  }[locale];

  // schema.org BlogPosting — rich result + LLM-parseable
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    inLanguage: locale,
    author: { "@type": "Organization", name: "Abbeal", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Abbeal",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/brand/wordmark-teal.png`,
      },
    },
    mainEntityOfPage: `${SITE}/${locale}/insights/${article.slug}`,
    keywords: article.tag,
    image: `${SITE}/${locale}/insights/${article.slug}/opengraph-image`,
  };

  const crumbs = breadcrumbs(locale, [
    ["Insights", "/insights"],
    [title, `/insights/${article.slug}`],
  ]);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      {/* Header */}
      <header className="mx-auto max-w-[760px] px-6 md:px-10 pt-20 md:pt-28 pb-10">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href={`/${locale}/insights`}
            className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] hover:text-[var(--color-brand-teal)]"
          >
            {t.back}
          </Link>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
          {article.tag}
        </p>

        <h1 className="mt-4 font-semibold tracking-[-0.025em] text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.1]">
          {title}
        </h1>

        <p className="mt-6 text-lg md:text-xl text-[var(--color-ink-soft)] leading-relaxed">
          {excerpt}
        </p>

        <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center gap-4 font-mono text-xs text-[var(--color-muted)]">
          <time dateTime={article.publishedAt}>
            {new Date(article.publishedAt).toLocaleDateString(
              locale === "fr" ? "fr-FR" : locale === "ja" ? "ja-JP" : "en-GB",
              { year: "numeric", month: "long", day: "numeric" },
            )}
          </time>
          <span aria-hidden>·</span>
          <span>{article.readTime}</span>
        </div>
      </header>

      {/* Body */}
      <section className="mx-auto max-w-[760px] px-6 md:px-10 pb-20">
        <ArticleBlocks blocks={body} />
      </section>

      {/* Related */}
      {relatedFinal.length > 0 && (
        <section className="bg-[var(--color-bg-cream)]/40 border-y border-[var(--color-border)]">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-8">
              {t.related}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedFinal.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/${locale}/insights/${a.slug}`}
                    className="group block border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-6 hover:border-[var(--color-brand-teal)] transition-colors h-full"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
                      {a.tag}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors">
                      {pick(a.title, locale)}
                    </h3>
                    <p className="mt-3 text-[14px] text-[var(--color-ink-soft)] leading-relaxed">
                      {pick(a.excerpt, locale)}
                    </p>
                    <p className="mt-4 font-mono text-xs text-[var(--color-muted)]">
                      {a.readTime}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[var(--color-ink)] text-[var(--color-bg-light)]">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-16 md:py-20 text-center">
          <h2 className="font-semibold tracking-[-0.02em] text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight max-w-2xl mx-auto">
            {t.ctaTitle}
          </h2>
          <Link
            href={`/${locale}/contact`}
            className="mt-8 inline-flex items-center gap-2 h-12 px-6 text-base gradient-brand-soft-bg text-[var(--color-brand-teal-fg)] hover:brightness-110 transition-all font-medium"
          >
            {t.ctaBtn}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
