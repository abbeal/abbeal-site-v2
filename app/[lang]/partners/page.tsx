import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";

type Partner = { name: string; role: string; url: string };
type Group = { title: string; subtitle: string; partners: Partner[] };

type Dict = {
  nav: { partners: string };
  partners: {
    meta: { title: string; description: string };
    tape: string;
    h1: string;
    subtitle: string;
    groups: Group[];
    cta: { title: string; btn: string };
  };
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/partners">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  return {
    title: dict.partners.meta.title,
    description: dict.partners.meta.description,
    alternates: pageAlternates(lang as Locale, "/partners"),
  };
}

export default async function PartnersPage({
  params,
}: PageProps<"/[lang]/partners">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang as Locale)) as Dict;
  const p = dict.partners;
  const locale = lang as Locale;
  const crumbs = breadcrumbs(locale, [[dict.nav.partners, "/partners"]]);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      {/* Hero */}
      <header className="mx-auto max-w-[1100px] px-6 md:px-10 pt-20 md:pt-28 pb-12">
        <span className="tape-label">{p.tape}</span>
        <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
          {p.h1}
        </h1>
        <p className="mt-5 text-lg md:text-xl text-[var(--color-ink-soft)] leading-relaxed max-w-3xl">
          {p.subtitle}
        </p>
      </header>

      {/* Groups */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-10 pb-20 md:pb-28 space-y-16">
        {p.groups.map((g, gi) => (
          <div key={gi}>
            <div className="flex items-baseline justify-between flex-wrap gap-4 border-b border-[var(--color-border)] pb-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
                  // {String(gi + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight">
                  {g.title}
                </h2>
              </div>
              <p className="max-w-md text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
                {g.subtitle}
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {g.partners.map((pt) => (
                <li key={pt.name}>
                  <a
                    href={pt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-5 hover:border-[var(--color-brand-teal)] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold tracking-tight text-base text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] transition-colors">
                          {pt.name}
                        </p>
                        <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                          {pt.role}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="font-mono text-xs text-[var(--color-muted)] group-hover:text-[var(--color-brand-teal)] transition-colors"
                      >
                        ↗
                      </span>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-ink)] text-[var(--color-bg-light)]">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-16 md:py-20 text-center">
          <h2 className="font-semibold tracking-[-0.02em] text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight max-w-2xl mx-auto">
            {p.cta.title}
          </h2>
          <a
            href={`/${locale}/contact`}
            className="mt-8 inline-flex items-center gap-2 h-12 px-6 text-base gradient-brand-soft-bg text-[var(--color-brand-teal-fg)] hover:brightness-110 transition-all font-medium"
          >
            {p.cta.btn}
            <span aria-hidden>→</span>
          </a>
        </div>
      </section>
    </article>
  );
}
