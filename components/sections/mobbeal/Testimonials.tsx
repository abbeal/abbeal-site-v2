"use client";

import { motion } from "motion/react";

type Dict = {
  mobbeal: {
    testimonials: {
      tape: string;
      title: string;
      items: {
        name: string;
        role: string;
        location: string;
        quote: string;
      }[];
    };
  };
};

export function Testimonials({ dict }: { dict: Record<string, unknown> }) {
  const d = (dict as unknown as Dict).mobbeal.testimonials;

  return (
    <section id="testimonials" className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-3xl">
        <span className="tape-label">{d.tape}</span>
        <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
          {d.title}
        </h2>
      </div>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
        {d.items.map((t, i) => (
          <motion.figure
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative flex flex-col p-8 border border-[var(--color-border)] bg-[var(--color-bg-paper)] hover:border-[var(--color-brand-teal)] transition-colors"
          >
            <svg
              aria-hidden
              className="h-6 w-6 text-[var(--color-brand-teal)] mb-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 10h4v4H6v2c0 2 1 3 3 3v2c-3 0-5-1.5-5-5v-6h2zm10 0h4v4h-4v2c0 2 1 3 3 3v2c-3 0-5-1.5-5-5v-6h2z" />
            </svg>
            <blockquote className="flex-1 text-lg leading-relaxed text-[var(--color-ink)]">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 pt-5 border-t border-dashed border-[var(--color-border)]">
              <p className="font-semibold text-[var(--color-ink)]">{t.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)] mt-1">
                {t.role} · {t.location}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
