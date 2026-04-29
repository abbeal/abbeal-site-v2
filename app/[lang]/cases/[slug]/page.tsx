import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { cases, getCase, getAllCases } from "@/lib/cases";
import { pick } from "@/lib/articles";
import { ArticleBlocks } from "@/components/sections/ArticleBlocks";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { pageAlternates } from "@/lib/seo";

export async function generateStaticParams() {
  return locales.flatMap((lang) =>
    cases.map((c) => ({ lang, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/cases/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const c = getCase(slug);
  if (!c) return { title: "Case study introuvable · Abbeal" };
  return {
    title: `${pick(c.title, lang as Locale)} · Abbeal Cases`,
    description: pick(c.excerpt, lang as Locale),
    alternates: pageAlternates(lang as Locale, `/cases/${slug}`),
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[lang]/cases/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const c = getCase(slug);
  if (!c) notFound();

  const title = pick(c.title, locale);
  const excerpt = pick(c.excerpt, locale);
  const body = pick(c.body, locale);

  // Related cases: same sector → fallback to most recent
  const related = getAllCases()
    .filter((x) => x.slug !== c.slug && x.sector === c.sector)
    .slice(0, 3);
  const fallback = getAllCases()
    .filter((x) => x.slug !== c.slug)
    .slice(0, 3);
  const relatedFinal = related.length >= 2 ? related : fallback;

  const t = {
    fr: {
      back: "← Cases",
      kpi: "KPI",
      duration: "Durée",
      team: "Équipe",
      teamUnit: "ingés",
      hub: "Hub(s)",
      related: "// À lire ensuite",
      ctaTitle: "Un cas similaire chez vous ?",
      ctaBtn: "Parler à un architecte",
    },
    en: {
      back: "← Cases",
      kpi: "KPI",
      duration: "Duration",
      team: "Team",
      teamUnit: "engineers",
      hub: "Hub(s)",
      related: "// Read next",
      ctaTitle: "A similar case at your place?",
      ctaBtn: "Talk to an architect",
    },
    ja: {
      back: "← ケース",
      kpi: "KPI",
      duration: "期間",
      team: "チーム",
      teamUnit: "人",
      hub: "ハブ",
      related: "// 次に読む",
      ctaTitle: "貴社でも似たケースがある？",
      ctaBtn: "アーキテクトと話す",
    },
    "fr-ca": {
      back: "← Cas clients",
      kpi: "Indicateur",
      duration: "Durée",
      team: "Équipe",
      teamUnit: "ingés",
      hub: "Pôle(s)",
      related: "// À lire ensuite",
      ctaTitle: "Un cas similaire chez vous ?",
      ctaBtn: "Parler à un architecte",
    },
  }[locale];

  // schema.org Article + rich metadata for cases
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const caseLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    datePublished: c.publishedAt,
    dateModified: c.publishedAt,
    inLanguage: locale,
    about: c.sector,
    keywords: [c.sector, c.geo, ...c.techStack].join(", "),
    author: { "@type": "Organization", name: "Abbeal", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Abbeal",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/brand/wordmark-teal.png`,
      },
    },
    mainEntityOfPage: `${SITE}/${locale}/cases/${c.slug}`,
    image: `${SITE}/${locale}/cases/${c.slug}/opengraph-image`,
  };

  const crumbs = breadcrumbs(locale, [
    ["Cases", "/cases"],
    [title, `/cases/${c.slug}`],
  ]);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      {/* Header */}
      <header className="mx-auto max-w-[960px] px-6 md:px-10 pt-20 md:pt-28 pb-10">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href={`/${locale}/cases`}
            className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] hover:text-[var(--color-brand-teal)]"
          >
            {t.back}
          </Link>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
          {c.sector} · {c.geo}
        </p>

        <h1 className="mt-4 font-semibold tracking-[-0.025em] text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.1]">
          {title}
        </h1>

        <p className="mt-6 text-lg md:text-xl text-[var(--color-ink-soft)] leading-relaxed max-w-[720px]">
          {excerpt}
        </p>

        {/* Fiche */}
        <div className="mt-10 pt-8 border-t border-[var(--color-border)] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {t.kpi}
            </p>
            <p className="mt-2 font-semibold tracking-[-0.02em] text-2xl md:text-3xl text-[var(--color-ink)]">
              {c.kpi.value}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-brand-teal)] mt-1">
              {c.kpi.label}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {t.duration}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              {c.duration}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {t.team}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              {c.teamSize} {t.teamUnit}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {t.hub}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              {c.geo}
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-8 flex flex-wrap gap-2">
          {c.techStack.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border border-[var(--color-border)] text-[var(--color-ink-soft)]"
            >
              {t}
            </span>
          ))}
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
              {relatedFinal.map((rc) => (
                <li key={rc.slug}>
                  <Link
                    href={`/${locale}/cases/${rc.slug}`}
                    className="group block border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-6 hover:border-[var(--color-brand-teal)] transition-colors h-full"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
                      {rc.sector} · {rc.geo}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors">
                      {pick(rc.title, locale)}
                    </h3>
                    <p className="mt-3 text-[14px] text-[var(--color-ink-soft)] leading-relaxed">
                      {pick(rc.excerpt, locale)}
                    </p>
                    <div className="mt-4 flex items-baseline gap-3">
                      <p className="font-semibold tracking-[-0.02em] text-2xl text-[var(--color-ink)]">
                        {rc.kpi.value}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-brand-teal)]">
                        {rc.kpi.label}
                      </p>
                    </div>
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
