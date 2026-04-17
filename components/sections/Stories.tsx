"use client";

import { motion } from "motion/react";

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

export function Stories({ dict }: { dict: Record<string, unknown> }) {
  const d = dict as unknown as StoriesDict;

  return (
    <section id="stories" className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-3xl">
        <span className="tape-label">{d.stories.tape}</span>
        <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
          {d.stories.title}
        </h2>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {d.stories.subtitle}
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6">
        {d.stories.items.map((s, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
            className="group flex flex-col md:flex-row gap-6 border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-8 hover:border-[var(--color-brand-teal)] transition-colors"
          >
            <div className="shrink-0 md:w-40">
              <p className="font-semibold tracking-[-0.02em] text-4xl md:text-5xl text-[var(--color-ink)] leading-none">
                {s.kpi}
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-brand-teal)]">
                {s.kpiLabel}
              </p>
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <h3 className="text-lg font-semibold tracking-tight">
                  {s.sector}
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                  {s.geo}
                </span>
              </div>
              <p className="mt-3 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
                {s.body}
              </p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
