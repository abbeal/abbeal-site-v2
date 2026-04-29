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

      <ul className="mt-16 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {d.roles.map((role, i) => (
          <li key={role.slug} className="group">
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
