"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import type { Locale } from "@/lib/i18n";

type Story = {
  slug: string;
  name: string;
  badge: string;
  meta: string;
  pitch: string;
  photo: string;
};

type Dict = {
  mobbeal: {
    stories: {
      tape: string;
      title: string;
      subtitle: string;
      cta: string;
      items: Story[];
    };
  };
};

export function MobbealStories({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
}) {
  const d = (dict as unknown as Dict).mobbeal.stories;

  return (
    <section
      id="stories"
      className="bg-[var(--color-bg-cream)]/40 border-y border-[var(--color-border)]"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-3xl">
          <span className="tape-label">{d.tape}</span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
            {d.title}
          </h2>
          <p className="mt-6 text-base md:text-lg text-[var(--color-ink-soft)] leading-relaxed">
            {d.subtitle}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {d.items.map((s, i) => (
            <motion.article
              key={s.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              className="group relative flex flex-col bg-[var(--color-bg-paper)] border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-brand-teal)] transition-colors"
            >
              <Link
                href={`/${locale}/insights/${s.slug}`}
                className="absolute inset-0 z-10"
                aria-label={`${s.name} — ${s.pitch}`}
              />
              <div className="aspect-[4/5] relative bg-[var(--color-ink)] overflow-hidden">
                <Image
                  src={`/article-assets/team/${s.photo}`}
                  alt={s.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-500"
                />
                <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-1 bg-[var(--color-bg-paper)]/95 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-brand-teal)] border border-[var(--color-brand-teal)]/30">
                  {s.badge}
                </span>
              </div>
              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                  {s.name}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                  {s.meta}
                </p>
                <p className="mt-4 text-[15px] text-[var(--color-ink-soft)] leading-relaxed flex-1">
                  {s.pitch}
                </p>
                <p className="mt-5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-brand-teal)] group-hover:gap-2.5 transition-all">
                  {d.cta} <span aria-hidden>→</span>
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
