import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { articles, getArticle, getAllArticles, pick } from "@/lib/articles";
import { getCase } from "@/lib/cases";
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
  const locale = lang as Locale;
  const title = pick(article.title, locale);
  // Privilégie metaDescription étendue (140-160 chars cible SEO Google)
  // si défini, sinon fallback excerpt (qui sert la card listing).
  const description = article.metaDescription
    ? pick(article.metaDescription, locale)
    : pick(article.excerpt, locale);
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const url = `${SITE}/${locale}/insights/${slug}`;
  // OG image alt custom par article (vs "Abbeal Insights" générique).
  // Format : "<title> — Abbeal Insights". Audit W21.
  const ogAlt = `${title} — Abbeal Insights`;
  return {
    title: `${title} · Abbeal Insights`,
    description,
    alternates: pageAlternates(locale, `/insights/${slug}`),
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Abbeal",
      locale,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? article.publishedAt,
      images: [
        {
          url: `${SITE}/${locale}/insights/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: `${SITE}/${locale}/insights/${slug}/opengraph-image`,
          alt: ogAlt,
        },
      ],
    },
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

  // Related articles enrichi : 5 max (vs 3 avant). Brief W21 quick win
  // internal linking. Priorise même tag, complète avec fallback featured.
  const related = getAllArticles()
    .filter((a) => a.slug !== article.slug && a.tag === article.tag)
    .slice(0, 5);
  const fallback = getAllArticles()
    .filter((a) => a.slug !== article.slug)
    .slice(0, 5);
  const relatedFinal = related.length >= 2 ? related : fallback;

  // Internal linking enrichi (audit W21 — chaque page /insights doit
  // avoir ≥5 liens internes : 3-5 articles related (déjà OK) + 1 case
  // study + 1 service). Lookup explicite via Article.relatedCaseSlug /
  // .relatedServiceSlug ; fallback null si non défini.
  const relatedCase = article.relatedCaseSlug
    ? getCase(article.relatedCaseSlug)
    : undefined;

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
  // Brief W21 : author Person (Sébastien) avec sameAs LinkedIn pour
  // Knowledge Graph Google + citations LLM. Avant : author Organization
  // générique. dateModified honore updatedAt si présent (signal de
  // fraîcheur SEO + indicateur clair pour les crawlers).
  const dateMod = article.updatedAt ?? article.publishedAt;
  const articleKeywords = article.keywords
    ? pick(article.keywords, locale)
    : article.tag;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: pick(article.metaDescription ?? article.excerpt, locale),
    datePublished: article.publishedAt,
    dateModified: dateMod,
    inLanguage: locale,
    author: {
      "@type": "Person",
      name: "Sébastien Lonjon",
      jobTitle: "CEO et co-fondateur",
      url: `${SITE}/${locale}/about`,
      sameAs: [
        "https://www.linkedin.com/in/sebastienlonjon/",
        "https://medium.com/@abbeal",
      ],
      worksFor: { "@type": "Organization", name: "Abbeal" },
    },
    publisher: {
      "@type": "Organization",
      name: "Abbeal",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/brand/wordmark-teal.png`,
      },
    },
    mainEntityOfPage: `${SITE}/${locale}/insights/${article.slug}`,
    keywords: articleKeywords,
    image: `${SITE}/${locale}/insights/${article.slug}/opengraph-image`,
  };

  // schema.org FAQPage — éligibilité Featured Snippets Google +
  // extraction LLM (ChatGPT, Perplexity, Claude). Rendu seulement si
  // article.faq est défini pour la locale. Brief W21 quick win #6.
  const faqItems = article.faq ? pick(article.faq, locale) : null;
  const faqLd =
    faqItems && faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

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
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
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

        <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-[var(--color-muted)]">
          <time dateTime={article.publishedAt}>
            {locale === "fr" || locale === "fr-ca" ? "Publié le " : locale === "ja" ? "公開：" : "Published "}
            {new Date(article.publishedAt).toLocaleDateString(
              locale === "fr" ? "fr-FR"
                : locale === "ja" ? "ja-JP"
                : locale === "fr-ca" ? "fr-CA"
                : "en-GB",
              { year: "numeric", month: "long", day: "numeric" },
            )}
          </time>
          {article.updatedAt && article.updatedAt !== article.publishedAt && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={article.updatedAt} className="text-[var(--color-brand-teal)]">
                {locale === "fr" || locale === "fr-ca" ? "Mis à jour le " : locale === "ja" ? "更新：" : "Updated "}
                {new Date(article.updatedAt).toLocaleDateString(
                  locale === "fr" ? "fr-FR"
                    : locale === "ja" ? "ja-JP"
                    : locale === "fr-ca" ? "fr-CA"
                    : "en-GB",
                  { year: "numeric", month: "long", day: "numeric" },
                )}
              </time>
            </>
          )}
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
            <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {relatedFinal.map((a) => (
                <li key={a.slug}>
                  <Link
                    href={`/${locale}/insights/${a.slug}`}
                    className="group block border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-5 hover:border-[var(--color-brand-teal)] transition-colors h-full"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
                      {a.tag}
                    </p>
                    <h3 className="mt-3 text-base font-semibold tracking-tight leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors">
                      {pick(a.title, locale)}
                    </h3>
                    <p className="mt-3 text-[13px] text-[var(--color-ink-soft)] leading-relaxed line-clamp-3">
                      {pick(a.excerpt, locale)}
                    </p>
                    <p className="mt-4 font-mono text-xs text-[var(--color-muted)]">
                      {a.readTime}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Internal linking enrichi : 1 case + 1 service (audit W21).
                Affichés seulement si Article.relatedCaseSlug /
                .relatedServiceSlug définis sur l'article concerné. */}
            {(relatedCase || article.relatedServiceSlug) && (
              <div className="mt-8 pt-8 border-t border-dashed border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedCase && (
                  <Link
                    href={`/${locale}/cases/${relatedCase.slug}`}
                    className="group flex items-start gap-3 p-4 border border-[var(--color-border)] bg-[var(--color-bg-paper)] hover:border-[var(--color-brand-teal)] transition-colors"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-brand-teal)] shrink-0 mt-0.5">
                      {locale === "ja" ? "ケース →" : "Case →"}
                    </span>
                    <span className="text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] transition-colors leading-snug">
                      {pick(relatedCase.title, locale)}
                    </span>
                  </Link>
                )}
                {article.relatedServiceSlug && (
                  <Link
                    href={`/${locale}/services/${article.relatedServiceSlug}`}
                    className="group flex items-start gap-3 p-4 border border-[var(--color-border)] bg-[var(--color-bg-paper)] hover:border-[var(--color-brand-teal)] transition-colors"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-brand-teal)] shrink-0 mt-0.5">
                      {locale === "ja" ? "サービス →" : "Service →"}
                    </span>
                    <span className="text-sm font-medium text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] transition-colors leading-snug capitalize">
                      {article.relatedServiceSlug.replace(/-/g, " ")}
                    </span>
                  </Link>
                )}
              </div>
            )}
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
