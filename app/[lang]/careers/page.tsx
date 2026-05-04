import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";

type Dict = {
  nav: { careers: string };
  careers: {
    tape: string;
    h1: string;
    subtitle: string;
    applyTo: string;
    applyEmail: string;
    roles: {
      slug: string;
      title: string;
      stack: string;
      location: string;
      subject: string;
      body: string;
    }[];
    processTape: string;
    processTitle: string;
    processIntro: string;
    processStats: { value: string; label: string }[];
    processSteps: {
      number: string;
      title: string;
      duration: string;
      body: string;
    }[];
    processFootnote: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/careers">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  return {
    title: `${dict.careers.h1} · Abbeal`,
    description: dict.careers.subtitle,
    alternates: pageAlternates(lang as Locale, "/careers"),
  };
}

export default async function CareersPage({ params }: PageProps<"/[lang]/careers">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = (await getDictionary(locale)) as Dict;
  const d = dict.careers;
  const crumbs = breadcrumbs(locale, [[dict.nav.careers, "/careers"]]);

  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <div className="max-w-3xl">
        <span className="tape-label">{d.tape}</span>
        <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
          {d.h1}
        </h1>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {d.subtitle}
        </p>
      </div>

      {/* Process recrutement — encart "1 candidat sur ~50" qui étaye
          la promesse "top 1%" en exposant le funnel */}
      <section
        id="process"
        className="mt-20 pt-16 border-t border-[var(--color-border)]"
      >
        <div className="max-w-3xl">
          <span className="tape-label">{d.processTape}</span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1]">
            {d.processTitle}
          </h2>
          <p className="mt-5 text-[15px] md:text-base text-[var(--color-ink-soft)] leading-relaxed">
            {d.processIntro}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {d.processStats.map((s, i) => (
            <div key={i}>
              <p className="font-sans font-semibold tracking-[-0.02em] text-2xl md:text-3xl text-[var(--color-ink)]">
                {s.value}
              </p>
              <div className="mt-3 flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-2 inline-block h-px w-6 bg-[var(--color-brand-teal)]"
                />
                <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)] leading-relaxed">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ol className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {d.processSteps.map((step) => (
            <li
              key={step.number}
              className="border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-5"
            >
              <p className="font-mono text-xs tracking-widest text-[var(--color-brand-teal)]">
                // {step.number}
              </p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--color-ink)]">
                {step.title}
              </h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                {step.duration}
              </p>
              <p className="mt-3 text-[14px] text-[var(--color-ink-soft)] leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]/70">
          {d.processFootnote}
        </p>
      </section>

      <ul
        id="roles"
        className="mt-20 pt-16 border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]"
      >
        {d.roles.map((role, i) => (
          <li id={role.slug} key={role.slug} className="group scroll-mt-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-10 md:py-12">
              <div className="md:col-span-1">
                <span className="font-mono text-xs tracking-widest text-[var(--color-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="md:col-span-7">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight group-hover:text-[var(--color-brand-teal)] transition-colors">
                  {role.title}
                </h2>
                <p className="mt-2 font-mono text-sm text-[var(--color-brand-teal)]">
                  {role.stack}
                </p>
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[var(--color-muted)]">
                  {role.location}
                </p>
                <p className="mt-5 text-[15px] text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
                  {role.body}
                </p>
              </div>
              <div className="md:col-span-4 flex md:justify-end items-start">
                <a
                  href={`mailto:${d.applyEmail}?subject=${encodeURIComponent(role.subject)}`}
                  className="inline-flex items-center gap-2 h-11 px-5 text-sm border border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bg-light)] transition-colors"
                >
                  {d.applyTo}
                  <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
