import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import {
  glossary,
  getGlossaryEntry,
  getRelatedGlossaryEntries,
  localizeGlossaryEntry,
  toGlossaryLocale,
  CATEGORY_I18N,
} from "@/lib/glossary";
import { getGlossaryCrosslinks } from "@/lib/glossary-crosslinks";
import { getService } from "@/lib/services";
import { getCase } from "@/lib/cases";
import { getArticle } from "@/lib/articles";
import { pick } from "@/lib/articles";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { pageAlternates } from "@/lib/seo";

export async function generateStaticParams() {
  return locales.flatMap((lang) =>
    glossary.map((g) => ({ lang, slug: g.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/glossaire/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const e = getGlossaryEntry(slug);
  if (!e) return { title: "Terme introuvable · Abbeal Glossaire" };
  const locale = lang as Locale;
  const loc = localizeGlossaryEntry(e, locale);
  return {
    title: `${loc.term} · Glossaire Abbeal`,
    description: loc.short,
    alternates: pageAlternates(locale, `/glossaire/${slug}`),
  };
}

const T = {
  fr: {
    back: "← Glossaire",
    category: "Catégorie",
    related: "Voir aussi",
    ctaTitle: "Tu veux qu'on applique ça chez toi ?",
    ctaBtn: "Parler à un architecte",
    inAction: "// En action chez nos clients",
    services: "Services pertinents",
    cases: "Cas clients",
    articles: "Articles liés",
  },
  en: {
    back: "← Glossary",
    category: "Category",
    related: "See also",
    ctaTitle: "Want us to apply this for you?",
    ctaBtn: "Talk to an architect",
    inAction: "// In action with our clients",
    services: "Relevant services",
    cases: "Client cases",
    articles: "Related articles",
  },
  ja: {
    back: "← 用語集",
    category: "カテゴリ",
    related: "関連",
    ctaTitle: "貴社で実装したい？",
    ctaBtn: "アーキテクトと話す",
    inAction: "// クライアント事例",
    services: "関連サービス",
    cases: "クライアントケース",
    articles: "関連記事",
  },
  "fr-ca": {
    back: "← Glossaire",
    category: "Catégorie",
    related: "Voir aussi",
    ctaTitle: "Tu veux qu'on applique ça chez toi ?",
    ctaBtn: "Parler à un architecte",
    inAction: "// En action chez nos clients",
    services: "Services pertinents",
    cases: "Cas clients",
    articles: "Articles liés",
  },
} as const;

export default async function GlossaryEntryPage({
  params,
}: PageProps<"/[lang]/glossaire/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const entry = getGlossaryEntry(slug);
  if (!entry) notFound();
  const t = T[locale];
  const related = getRelatedGlossaryEntries(slug);
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";

  // Cross-links: glossary → services / cases / articles
  const crosslinks = getGlossaryCrosslinks(slug);
  const linkedServices = (crosslinks.serviceSlugs ?? [])
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => !!s);
  const linkedCases = (crosslinks.caseSlugs ?? [])
    .map((c) => getCase(c))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const linkedArticles = (crosslinks.articleSlugs ?? [])
    .map((a) => getArticle(a))
    .filter((a): a is NonNullable<typeof a> => !!a);
  const hasCrosslinks =
    linkedServices.length > 0 ||
    linkedCases.length > 0 ||
    linkedArticles.length > 0;

  // Localized strings
  const locEntry = localizeGlossaryEntry(entry, locale);
  const categoryLabel = CATEGORY_I18N[entry.category][toGlossaryLocale(locale)];

  // DefinedTerm + Article schema combined — max LLM discoverability
  const definedTermLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${SITE}/${locale}/glossaire/${entry.slug}`,
    name: locEntry.term,
    description: locEntry.definition,
    url: `${SITE}/${locale}/glossaire/${entry.slug}`,
    inDefinedTermSet: `${SITE}/${locale}/glossaire`,
    inLanguage: locale,
    termCode: entry.slug,
  };

  const crumbs = breadcrumbs(locale, [
    ["Glossaire", "/glossaire"],
    [locEntry.term, `/glossaire/${entry.slug}`],
  ]);

  return (
    <article className="mx-auto max-w-[760px] px-6 md:px-10 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/${locale}/glossaire`}
          className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] hover:text-[var(--color-brand-teal)]"
        >
          {t.back}
        </Link>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
        {t.category} · {categoryLabel}
      </p>

      <h1 className="mt-4 font-semibold tracking-[-0.025em] text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1]">
        {locEntry.term}
      </h1>

      <p className="mt-6 text-xl text-[var(--color-ink-soft)] leading-relaxed italic">
        {locEntry.short}
      </p>

      <div className="mt-10 pt-10 border-t border-[var(--color-border)] prose-article">
        <p className="text-[17px] leading-[1.7] text-[var(--color-ink)]">
          {locEntry.definition}
        </p>
      </div>

      {hasCrosslinks && (
        <section className="mt-16 pt-10 border-t border-[var(--color-border)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)] mb-6">
            {t.inAction}
          </p>
          <div className="space-y-6">
            {linkedServices.length > 0 && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-muted)] mb-3">
                  {t.services}
                </p>
                <ul className="flex flex-wrap gap-2">
                  {linkedServices.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/${locale}/services/${s.slug}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-[var(--color-border)] hover:border-[var(--color-brand-teal)] hover:text-[var(--color-brand-teal)] transition-colors"
                      >
                        {pick(s.title, locale)}
                        <span aria-hidden>→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {linkedCases.length > 0 && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-muted)] mb-3">
                  {t.cases}
                </p>
                <ul className="space-y-2">
                  {linkedCases.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${locale}/cases/${c.slug}`}
                        className="group flex items-baseline gap-3 text-sm hover:text-[var(--color-brand-teal)] transition-colors"
                      >
                        <span className="font-mono text-[var(--color-brand-teal)] shrink-0">
                          {c.kpi.value}
                        </span>
                        <span className="group-hover:underline">
                          {pick(c.title, locale)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {linkedArticles.length > 0 && (
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-muted)] mb-3">
                  {t.articles}
                </p>
                <ul className="space-y-2">
                  {linkedArticles.map((a) => (
                    <li key={a.slug}>
                      <Link
                        href={`/${locale}/insights/${a.slug}`}
                        className="group flex items-baseline gap-3 text-sm hover:text-[var(--color-brand-teal)] transition-colors"
                      >
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)] shrink-0">
                          {a.tag}
                        </span>
                        <span className="group-hover:underline">
                          {pick(a.title, locale)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-12 pt-10 border-t border-[var(--color-border)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-6">
            // {t.related}
          </p>
          <ul className="space-y-4">
            {related.map((r) => {
              const rloc = localizeGlossaryEntry(r, locale);
              return (
                <li key={r.slug}>
                  <Link
                    href={`/${locale}/glossaire/${r.slug}`}
                    className="group block border-l-2 border-[var(--color-border)] pl-4 hover:border-[var(--color-brand-teal)] transition-colors"
                  >
                    <p className="text-base font-semibold tracking-tight group-hover:text-[var(--color-brand-teal)] transition-colors">
                      {rloc.term}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                      {rloc.short}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-20 pt-10 border-t border-[var(--color-border)] text-center">
        <h2 className="font-semibold tracking-[-0.02em] text-2xl md:text-3xl leading-tight">
          {t.ctaTitle}
        </h2>
        <Link
          href={`/${locale}/contact`}
          className="mt-6 inline-flex items-center gap-2 h-12 px-6 text-base gradient-brand-soft-bg text-[var(--color-brand-teal-fg)] hover:brightness-110 transition-all font-medium"
        >
          {t.ctaBtn}
          <span aria-hidden>→</span>
        </Link>
      </section>
    </article>
  );
}
