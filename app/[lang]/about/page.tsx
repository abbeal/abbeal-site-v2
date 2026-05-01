import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { CountUp } from "@/components/ui/CountUp";

type Dict = {
  nav: { about: string };
  about: {
    meta: { title: string; description: string };
    tape: string;
    h1Top: string;
    h1Bottom: string;
    intro: string;
    timelineTape: string;
    timelineTitle: string;
    timeline: { year: string; city: string; event: string }[];
    leadersTape: string;
    leadersTitle: string;
    leaders: {
      name: string;
      role: string;
      hub: string;
      photo: string;
      bio: string;
    }[];
    statsTape: string;
    statsTitle: string;
    stats: { value: string; label: string }[];
    ctaTitle: string;
    ctaSub: string;
    ctaLabel: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  return {
    title: dict.about.meta.title,
    description: dict.about.meta.description,
    alternates: pageAlternates(lang as Locale, "/about"),
  };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = (await getDictionary(locale)) as Dict;
  const d = dict.about;

  // schema.org Person — rich Knowledge Panel for Seb + Vianney
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const sameAsByName: Record<string, string[]> = {
    "Sébastien Lonjon": [
      "https://www.linkedin.com/in/sebastienlonjon/",
    ],
    "Vianney Blanquart": [
      "https://www.linkedin.com/in/vianneyblanquart/",
    ],
  };
  const personsLd = d.leaders.map((l) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: l.name,
    jobTitle: l.role,
    worksFor: { "@type": "Organization", name: "Abbeal", url: SITE },
    workLocation: l.hub,
    description: l.bio,
    image: `${SITE}/team/${l.photo}`,
    url: `${SITE}/${locale}/about`,
    sameAs: sameAsByName[l.name] ?? [],
  }));

  const crumbs = breadcrumbs(locale, [[dict.nav.about, "/about"]]);

  return (
    <>
      {personsLd.map((p, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(p) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
        <span className="tape-label">{d.tape}</span>
        <h1 className="mt-6 font-semibold tracking-[-0.03em] text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95]">
          <span className="block text-[var(--color-ink)]">{d.h1Top}</span>
          <span className="block italic gradient-brand-text">{d.h1Bottom}</span>
        </h1>
        <p className="mt-8 max-w-2xl text-lg md:text-xl text-[var(--color-ink-soft)] leading-relaxed">
          {d.intro}
        </p>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-20">
        <div className="max-w-3xl">
          <span className="tape-label">{d.timelineTape}</span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
            {d.timelineTitle}
          </h2>
        </div>
        <ol className="mt-14 border-y border-[var(--color-border)] divide-y divide-[var(--color-border)]">
          {d.timeline.map((item, i) => (
            <li key={i} className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 md:py-10">
              <div className="md:col-span-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  // {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-2 font-semibold text-3xl md:text-4xl tabular-nums text-[var(--color-ink)]">
                  {item.year}
                </p>
              </div>
              <div className="md:col-span-3">
                <p className="font-mono text-sm text-[var(--color-brand-teal)]">
                  {item.city}
                </p>
              </div>
              <div className="md:col-span-7">
                <p className="text-[15px] md:text-base text-[var(--color-ink)] leading-relaxed">
                  {item.event}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Leaders */}
      <section className="bg-[var(--color-bg-cream)]/40 border-y border-[var(--color-border)]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
          <div className="max-w-3xl">
            <span className="tape-label">{d.leadersTape}</span>
            <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
              {d.leadersTitle}
            </h2>
          </div>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
            {d.leaders.map((l) => (
              <article
                key={l.name}
                className="group relative bg-[var(--color-bg-paper)] border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-brand-teal)] transition-colors"
              >
                <div className="aspect-[4/5] relative bg-[var(--color-ink)] overflow-hidden">
                  <Image
                    src={`/team/${l.photo}`}
                    alt={l.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {l.name}
                  </h3>
                  <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-brand-teal)]">
                    {l.role}
                  </p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                    {l.hub}
                  </p>
                  <p className="mt-4 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
                    {l.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-20">
        <div className="max-w-3xl">
          <span className="tape-label">{d.statsTape}</span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
            {d.statsTitle}
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {d.stats.map((s, i) => (
            <div key={i}>
              <p className="font-sans font-semibold tracking-[-0.02em] text-4xl md:text-5xl lg:text-6xl text-[var(--color-ink)]">
                <CountUp value={s.value} />
              </p>
              <div className="mt-3 flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-2 inline-block h-px w-6 bg-[var(--color-brand-teal)]"
                />
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-muted)] leading-relaxed">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-[var(--color-ink)] text-[var(--color-bg-light)]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
          <div className="max-w-3xl">
            <h2 className="font-semibold tracking-[-0.025em] text-[clamp(2rem,4.5vw,4rem)] leading-[1.05]">
              {d.ctaTitle}
            </h2>
            <p className="mt-6 text-lg md:text-xl text-[var(--color-bg-light)]/70 leading-relaxed">
              {d.ctaSub}
            </p>
            <Link
              href={`/${lang}/contact`}
              className="mt-10 inline-flex items-center gap-2 h-14 px-8 text-lg gradient-brand-soft-bg text-[var(--color-brand-teal-fg)] hover:brightness-110 transition-all font-medium"
            >
              {d.ctaLabel}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
