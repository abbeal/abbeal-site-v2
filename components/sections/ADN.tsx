"use client";

import { motion } from "motion/react";

type ADNDict = {
  adn: {
    tape: string;
    title: string;
    subtitle: string;
    pillars: {
      number: string;
      title: string;
      gloss?: string;
      punch: string;
      body: string;
      stat: string;
    }[];
  };
};

export function ADN({ dict }: { dict: Record<string, unknown> }) {
  const d = dict as unknown as ADNDict;

  return (
    <section id="adn" className="relative mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-3xl">
        <span className="tape-label">{d.adn.tape}</span>
        <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
          {d.adn.title}
        </h2>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {d.adn.subtitle}
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
        {d.adn.pillars.map((pillar, i) => (
          <motion.article
            key={pillar.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="group relative bg-[var(--color-bg-paper)] p-8 md:p-10 hover:bg-[var(--color-bg-cream)]/40 transition-colors"
          >
            <span className="font-mono text-xs tracking-widest text-[var(--color-muted)]">
              // {pillar.number}
            </span>
            <h3 className="mt-6 text-2xl md:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
              {pillar.title}
            </h3>
            {pillar.gloss && (
              <p className="mt-1 font-mono text-xs italic text-[var(--color-muted)]">
                <span aria-hidden className="mr-1.5">↳</span>
                {pillar.gloss}
              </p>
            )}
            <p className="mt-3 text-lg italic text-[var(--color-brand-teal)] leading-snug">
              {pillar.punch}
            </p>
            <p className="mt-5 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
              {pillar.body}
            </p>
            <div className="mt-8 pt-5 border-t border-dashed border-[var(--color-border)]">
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-ink)]">
                <span aria-hidden className="mr-2 text-[var(--color-brand-teal)]">●</span>
                {pillar.stat}
              </p>
            </div>

            {/* Bauhaus accent per card */}
            {i === 0 && (
              <svg aria-hidden className="absolute top-6 right-6 h-10 w-10 text-[var(--color-brand-teal)]/40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1" />
                <circle cx="20" cy="20" r="2" fill="currentColor" />
              </svg>
            )}
            {i === 1 && (
              <svg aria-hidden className="absolute top-6 right-6 h-10 w-10 text-[var(--color-brand-teal)]/40" viewBox="0 0 40 40" fill="none">
                <polygon points="20,4 36,34 4,34" stroke="currentColor" strokeWidth="1" />
              </svg>
            )}
            {i === 2 && (
              <svg aria-hidden className="absolute top-6 right-6 h-10 w-10 text-[var(--color-brand-teal)]/40" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="6" width="28" height="28" stroke="currentColor" strokeWidth="1" transform="rotate(45 20 20)" />
              </svg>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  );
}
