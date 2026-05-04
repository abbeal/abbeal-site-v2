import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { TECH_RADAR_EDITIONS, getCurrentEdition } from "@/lib/tech-radar";

/**
 * Tech Radar archive landing page.
 *
 * Behaviour:
 * - When only one edition is published (today), redirect straight to it
 *   so the bare URL doesn't waste a hop and the canonical signal is clean.
 * - When multiple editions exist, render an archive list with the current
 *   one highlighted. Each item is a permalink to /tech-radar/[edition].
 *
 * Why this split: each quarterly edition gets a stable URL forever, so
 * external backlinks to the bare archive route keep working, and the
 * archive itself is indexable as a hub for the editorial calendar.
 */

const T = {
  fr: {
    h1: "Tech Radar — toutes les éditions",
    intro: "Notre veille trimestrielle. Ce qu'on adopte, ce qu'on évalue, ce qu'on met de côté.",
    current: "Édition courante",
    archive: "Archive",
  },
  en: {
    h1: "Tech Radar — all editions",
    intro: "Our quarterly tech watch. What we adopt, assess, and put on hold.",
    current: "Current edition",
    archive: "Archive",
  },
  ja: {
    h1: "Tech Radar — 全エディション",
    intro: "四半期ごとの技術ウォッチ。Adopt、Trial、Assess、Hold。",
    current: "現行エディション",
    archive: "アーカイブ",
  },
  "fr-ca": {
    h1: "Tech Radar — toutes les éditions",
    intro: "Notre veille trimestrielle. Ce qu'on adopte, ce qu'on évalue, ce qu'on met de côté.",
    current: "Édition courante",
    archive: "Archive",
  },
} as const;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/insights/tech-radar">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = T[lang as Locale];
  return {
    title: `${t.h1} · Abbeal`,
    description: t.intro,
    alternates: pageAlternates(lang as Locale, "/insights/tech-radar"),
  };
}

export default async function TechRadarArchivePage({
  params,
}: PageProps<"/[lang]/insights/tech-radar">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;

  // When only one edition exists, this archive page is just a hop —
  // redirect to keep the canonical signal clean and reduce link dilution.
  if (TECH_RADAR_EDITIONS.length === 1) {
    redirect(`/${locale}/insights/tech-radar/${TECH_RADAR_EDITIONS[0].slug}`);
  }

  const t = T[locale];
  const current = getCurrentEdition();
  const archive = TECH_RADAR_EDITIONS.filter((e) => !e.current);
  const crumbs = breadcrumbs(locale, [
    ["Insights", "/insights"],
    [t.h1, "/insights/tech-radar"],
  ]);

  return (
    <article className="mx-auto max-w-[960px] px-6 md:px-10 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <h1 className="font-semibold tracking-[-0.025em] text-4xl md:text-5xl leading-tight">
        {t.h1}
      </h1>
      <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
        {t.intro}
      </p>

      <section className="mt-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-brand-teal)]">
          {t.current}
        </p>
        <Link
          href={`/${locale}/insights/tech-radar/${current.slug}`}
          className="mt-4 block border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-6 hover:border-[var(--color-brand-teal)] transition-colors group"
        >
          <h2 className="text-2xl font-semibold tracking-tight group-hover:text-[var(--color-brand-teal)] transition-colors">
            {current.title}
          </h2>
          <p className="mt-1 font-mono text-xs text-[var(--color-muted)]">
            Publié le {new Date(current.publishedAt).toLocaleDateString(locale)}
          </p>
        </Link>
      </section>

      {archive.length > 0 && (
        <section className="mt-12 pt-10 border-t border-[var(--color-border)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)]">
            {t.archive}
          </p>
          <ul className="mt-4 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {archive.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/${locale}/insights/tech-radar/${e.slug}`}
                  className="flex items-center justify-between py-4 hover:text-[var(--color-brand-teal)] transition-colors"
                >
                  <span>{e.title}</span>
                  <span className="font-mono text-xs text-[var(--color-muted)]">
                    {new Date(e.publishedAt).toLocaleDateString(locale)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
