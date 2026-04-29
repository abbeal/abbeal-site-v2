"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Locale } from "@/lib/i18n";

type StoriesDict = {
  stories: {
    tape: string;
    title: string;
    subtitle: string;
    items: {
      kpi: string;
      kpiLabel: string;
      sector: string;
      geo: string;
      body: string;
    }[];
  };
};

export type StoryCard = {
  slug: string;
  kpi: { value: string; label: string };
  sector: string;
  geo: string;
  excerpt: string;
};

export function Stories({
  locale,
  dict,
  items,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
  items?: StoryCard[];
}) {
  const d = dict as unknown as StoriesDict;

  // Priority: typed cases from manifest → legacy dict items
  const cards: StoryCard[] =
    items && items.length > 0
      ? items
      : d.stories.items.map((s) => ({
          slug: "",
          kpi: { value: s.kpi, label: s.kpiLabel },
          sector: s.sector,
          geo: s.geo,
          excerpt: s.body,
        }));

  return (
    <section
      id="stories"
      className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-3xl">
          <span className="tape-label">{d.stories.tape}</span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
            {d.stories.title}
          </h2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            {d.stories.subtitle}
          </p>
        </div>
        <Link
          href={`/${locale}/cases`}
          className="inline-flex items-center gap-2 font-mono text-sm text-[var(--color-ink)] hover:gap-3 hover:text-[var(--color-brand-teal)] transition-all"
        >
          {
            {
              fr: "Toutes les études",
              en: "All case studies",
              ja: "すべてのケース",
              "fr-ca": "Tous les cas clients",
            }[locale]
          }
          <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((s, i) => {
          const content = (
            <div className="group flex flex-col md:flex-row gap-6 border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-8 hover:border-[var(--color-brand-teal)] transition-colors h-full">
              <div className="shrink-0 md:w-40">
                <p className="font-semibold tracking-[-0.02em] text-4xl md:text-5xl text-[var(--color-ink)] leading-none">
                  {s.kpi.value}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-brand-teal)]">
                  {s.kpi.label}
                </p>
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h3 className="text-lg font-semibold tracking-tight group-hover:text-[var(--color-brand-teal)] transition-colors">
                    {s.sector}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                    {s.geo}
                  </span>
                </div>
                <p className="mt-3 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
                  {s.excerpt}
                </p>
              </div>
            </div>
          );

          return (
            <motion.article
              key={s.slug || i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
            >
              {s.slug ? (
                <Link href={`/${locale}/cases/${s.slug}`}>{content}</Link>
              ) : (
                content
              )}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
