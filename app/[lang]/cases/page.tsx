import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { getAllCases } from "@/lib/cases";
import { pick } from "@/lib/articles";

type Dict = {
  nav: { stories: string };
  casesIndex: { tape: string; h1: string; subtitle: string };
  casesCommon: { templateBadge: string; templateNote: string };
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/cases">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  return {
    title: `${dict.casesIndex.h1} · Abbeal Cases`,
    description: dict.casesIndex.subtitle,
    alternates: pageAlternates(lang as Locale, "/cases"),
  };
}

export default async function CasesIndexPage({
  params,
}: PageProps<"/[lang]/cases">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = (await getDictionary(locale)) as Dict;

  const items = getAllCases().map((c) => ({
    slug: c.slug,
    sector: pick(c.sector, locale),
    geo: c.geo,
    duration: c.duration,
    teamSize: c.teamSize,
    kpi: { value: c.kpi.value, label: pick(c.kpi.label, locale) },
    techStack: c.techStack,
    title: pick(c.title, locale),
    excerpt: pick(c.excerpt, locale),
    template: c.template ?? false,
  }));

  const teamUnit = {
    fr: "ingés",
    en: "engineers",
    ja: "人",
    "fr-ca": "ingés",
  }[locale];

  // schema.org ItemList for the cases index
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: dict.casesIndex.h1,
    description: dict.casesIndex.subtitle,
    numberOfItems: items.length,
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/${locale}/cases/${c.slug}`,
      name: c.title,
    })),
  };

  const crumbs = breadcrumbs(locale, [[dict.nav.stories, "/cases"]]);

  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <div className="max-w-3xl">
        <span className="tape-label">{dict.casesIndex.tape}</span>
        <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
          {dict.casesIndex.h1}
        </h1>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {dict.casesIndex.subtitle}
        </p>
      </div>

      <ul className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((c, i) => (
          <li key={c.slug}>
            <Link
              href={`/${locale}/cases/${c.slug}`}
              className="group block h-full border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-8 hover:border-[var(--color-brand-teal)] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
                    {c.sector} · {c.geo}
                  </p>
                  <span className="mt-2 inline-block font-mono text-xs tracking-widest text-[var(--color-muted)]">
                    // {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold tracking-[-0.02em] text-3xl md:text-4xl text-[var(--color-ink)] leading-none">
                    {c.kpi.value}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                    {c.kpi.label}
                  </p>
                </div>
              </div>

              <h2 className="mt-6 text-xl md:text-2xl font-semibold tracking-tight leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors">
                {c.title}
              </h2>
              {c.template && (
                <span
                  className="mt-3 inline-block font-mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 border border-[var(--color-muted)]/40 text-[var(--color-muted)]"
                  title={dict.casesCommon.templateNote}
                >
                  ⚠ {dict.casesCommon.templateBadge}
                </span>
              )}
              <p className="mt-3 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
                {c.excerpt}
              </p>

              <div className="mt-6 pt-5 border-t border-[var(--color-border)] flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                <span>
                  {c.duration} · {c.teamSize} {teamUnit}
                </span>
                <span className="truncate">
                  {c.techStack.slice(0, 3).join(" · ")}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
