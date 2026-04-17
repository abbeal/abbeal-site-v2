"use client";

import { motion } from "motion/react";

type Dict = {
  mobbeal: {
    piliers: {
      tape: string;
      title: string;
      subtitle: string;
      items: { number: string; title: string; body: string }[];
    };
  };
};

export function Piliers({ dict }: { dict: Record<string, unknown> }) {
  const d = (dict as unknown as Dict).mobbeal.piliers;

  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-3xl">
        <span className="tape-label">{d.tape}</span>
        <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
          {d.title}
        </h2>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {d.subtitle}
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        {d.items.map((item, i) => (
          <motion.article
            key={item.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
            className="group relative border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-8 md:p-10 hover:border-[var(--color-brand-teal)] hover:-translate-y-1 transition-all duration-300"
          >
            <span className="font-mono text-xs tracking-widest text-[var(--color-muted)]">
              // {item.number}
            </span>
            <h3 className="mt-6 text-2xl md:text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
              {item.title}
            </h3>
            <p className="mt-4 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
              {item.body}
            </p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
