import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "../../../dictionaries";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { TECH_RADAR_EDITIONS, getEdition } from "@/lib/tech-radar";
import { TechRadar } from "@/components/sections/TechRadar";

/**
 * Tech Radar edition page — stable permalink per quarterly edition.
 *
 * SEO posture:
 * - Self-canonical via pageAlternates
 * - Hreflang on all 4 locales (the radar content is shared across locales,
 *   but the framing strings differ)
 * - Schema.org TechArticle with datePublished + dateModified for the
 *   quarterly cadence to be visible to crawlers
 * - Stable URL `/insights/tech-radar/2026-q2` so backlinks survive
 *
 * The radar visualisation reuses the existing client component (the same
 * one rendered as a section on the homepage) to avoid maintaining two
 * separate UIs. When we ship multiple editions and want per-edition
 * snapshots, we'll branch the items source on `params.edition`.
 */

export async function generateStaticParams() {
  return locales.flatMap((lang) =>
    TECH_RADAR_EDITIONS.map((e) => ({ lang, edition: e.slug })),
  );
}

const T = {
  fr: {
    back: "← Toutes les éditions",
    publishedOn: "Publié le",
    summary: (count: number) =>
      `${count} technos passées au filtre — Adopt, Trial, Assess, Hold.`,
  },
  en: {
    back: "← All editions",
    publishedOn: "Published on",
    summary: (count: number) =>
      `${count} technologies under review — Adopt, Trial, Assess, Hold.`,
  },
  ja: {
    back: "← 全エディション",
    publishedOn: "公開日",
    summary: (count: number) =>
      `${count}技術をレビュー — Adopt、Trial、Assess、Hold。`,
  },
  "fr-ca": {
    back: "← Toutes les éditions",
    publishedOn: "Publié le",
    summary: (count: number) =>
      `${count} technos passées au filtre — Adopt, Trial, Assess, Hold.`,
  },
} as const;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/insights/tech-radar/[edition]">): Promise<Metadata> {
  const { lang, edition } = await params;
  if (!hasLocale(lang)) return {};
  const e = getEdition(edition);
  if (!e) return { title: "Tech Radar — Édition introuvable · Abbeal" };
  const locale = lang as Locale;
  const t = T[locale];
  return {
    title: `${e.title} · Abbeal Insights`,
    description: t.summary(11),
    alternates: pageAlternates(locale, `/insights/tech-radar/${e.slug}`),
  };
}

export default async function TechRadarEditionPage({
  params,
}: PageProps<"/[lang]/insights/tech-radar/[edition]">) {
  const { lang, edition } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const e = getEdition(edition);
  if (!e) notFound();

  const dict = (await getDictionary(locale)) as Record<string, unknown> & {
    techRadar: { items: unknown[] };
  };

  const t = T[locale];
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";

  // Schema.org TechArticle — gives Google a structured signal that this is
  // an editorial tech-watch piece with a quarterly cadence (datePublished
  // + dateModified). Helps with the "Articles" search appearance and the
  // "Top stories" carousel for tech queries.
  const techArticleLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${SITE}/${locale}/insights/tech-radar/${e.slug}`,
    headline: e.title,
    name: e.title,
    description: t.summary(dict.techRadar.items.length),
    datePublished: e.publishedAt,
    dateModified: e.publishedAt,
    inLanguage: locale,
    keywords: [
      "Tech radar",
      "Adopt",
      "Trial",
      "Assess",
      "Hold",
      "Rust",
      "ROS 2",
      "RAG",
      "OpenTofu",
      "WASM",
      "Cache Components",
    ].join(", "),
    about: ["AI", "Robotics", "Languages", "Infra", "Frontend"],
    author: { "@type": "Organization", name: "Abbeal", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Abbeal",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/brand/wordmark-teal.png`,
      },
    },
    mainEntityOfPage: `${SITE}/${locale}/insights/tech-radar/${e.slug}`,
    url: `${SITE}/${locale}/insights/tech-radar/${e.slug}`,
  };

  const crumbs = breadcrumbs(locale, [
    ["Insights", "/insights"],
    [e.title, `/insights/tech-radar/${e.slug}`],
  ]);

  return (
    <article className="pb-20 md:pb-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      <header className="mx-auto max-w-[1200px] px-6 md:px-10 pt-20 md:pt-28">
        <Link
          href={`/${locale}/insights/tech-radar`}
          className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] hover:text-[var(--color-brand-teal)]"
        >
          {t.back}
        </Link>

        <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.1]">
          {e.title}
        </h1>

        <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[var(--color-muted)]">
          {t.publishedOn}{" "}
          <time dateTime={e.publishedAt}>
            {new Date(e.publishedAt).toLocaleDateString(locale, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </p>

        <p className="mt-6 max-w-2xl text-lg md:text-xl text-[var(--color-ink-soft)] leading-relaxed">
          {t.summary(dict.techRadar.items.length)}
        </p>
      </header>

      {/* Reuse the existing TechRadar section component — same UI as the
          homepage, but here it's the main content of the page. */}
      <TechRadar dict={dict} />
    </article>
  );
}
