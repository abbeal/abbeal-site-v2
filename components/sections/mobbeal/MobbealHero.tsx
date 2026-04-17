"use client";

import { motion } from "motion/react";
import type { Locale } from "@/lib/i18n";
import { ButtonLink } from "@/components/ui/Button";

type Dict = {
  mobbeal: {
    hero: {
      tape: string;
      h1Top: string;
      h1Bottom: string;
      subtitle: string;
      ctaPrimary: string;
      ctaSecondary: string;
      kpis: { value: string; label: string }[];
    };
  };
};

const ease = [0.16, 1, 0.3, 1] as const;

export function MobbealHero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
}) {
  const d = (dict as unknown as Dict).mobbeal.hero;

  return (
    <section className="relative overflow-hidden bg-[var(--color-ink)] text-[var(--color-bg-light)]">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-[var(--color-brand-teal)]/15 blur-3xl" />
        <svg
          className="absolute bottom-10 left-[8%] h-40 w-40 text-[var(--color-brand-teal)]/30"
          viewBox="0 0 160 160"
          fill="none"
        >
          <circle cx="80" cy="80" r="60" stroke="currentColor" strokeWidth="1" />
          <circle cx="80" cy="80" r="30" stroke="currentColor" strokeWidth="1" />
        </svg>
        <svg
          className="absolute top-[20%] left-[42%] h-32 w-32 text-[var(--color-bg-light)]/8"
          viewBox="0 0 100 100"
          fill="none"
        >
          <polygon points="50,10 90,85 10,85" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 md:px-10 pt-24 pb-20 md:pt-32 md:pb-28">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-brand-teal)]"
        >
          <span aria-hidden className="h-px w-6 bg-[var(--color-brand-teal)]" />
          {d.tape}
        </motion.span>

        <h1 className="mt-8 font-sans font-semibold tracking-[-0.03em] text-[clamp(2.75rem,7vw,6.5rem)] leading-[0.95] max-w-4xl">
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease }}
            className="block"
          >
            {d.h1Top}
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
            className="block text-[var(--color-brand-teal)] italic"
          >
            {d.h1Bottom}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease }}
          className="mt-8 max-w-2xl text-lg md:text-xl text-[var(--color-bg-light)]/75 leading-relaxed"
        >
          {d.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <ButtonLink
            href="https://calendly.com/sebastien-lonjon/une-nouvelle-vie-a-l-etranger"
            size="lg"
            className="bg-[var(--color-brand-teal)] text-[var(--color-ink)] hover:bg-[var(--color-bg-light)]"
          >
            {d.ctaPrimary}
            <span aria-hidden className="ml-1">→</span>
          </ButtonLink>
          <a
            href="#testimonials"
            className="inline-flex items-center gap-2 h-12 px-6 text-base border border-[var(--color-bg-light)]/30 hover:border-[var(--color-brand-teal)] hover:text-[var(--color-brand-teal)] transition-colors"
          >
            {d.ctaSecondary}
          </a>
        </motion.div>

        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-[var(--color-bg-light)]/15 pt-10">
          {d.kpis.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.7 + i * 0.08, ease }}
            >
              <p className="font-sans font-semibold tracking-tight text-4xl md:text-5xl">
                {kpi.value}
              </p>
              <div className="mt-3 flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-2 inline-block h-px w-6 bg-[var(--color-brand-teal)]"
                />
                <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-bg-light)]/60 leading-relaxed">
                  {kpi.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
