"use client";

import { motion } from "motion/react";

type Dict = {
  mobbeal: {
    ctaFinal: { tape: string; title: string; body: string; cta: string };
  };
};

export function MobbealCTA({ dict }: { dict: Record<string, unknown> }) {
  const d = (dict as unknown as Dict).mobbeal.ctaFinal;

  return (
    <section className="bg-[var(--color-ink)] text-[var(--color-bg-light)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-brand-teal)]">
            <span aria-hidden className="h-px w-6 bg-[var(--color-brand-teal)]" />
            {d.tape}
          </span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4.5vw,4rem)] leading-[1.05]">
            {d.title}
          </h2>
          <p className="mt-6 text-lg md:text-xl text-[var(--color-bg-light)]/70 leading-relaxed max-w-2xl">
            {d.body}
          </p>
          <a
            href="https://calendly.com/d/csr7-3vm-vhw/meeting-abbeal"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 h-14 px-8 text-lg gradient-brand-soft-bg text-[var(--color-brand-teal-fg)] hover:brightness-110 transition-all font-medium"
          >
            {d.cta}
            <span aria-hidden>→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
