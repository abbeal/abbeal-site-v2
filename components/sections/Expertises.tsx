"use client";

import { motion } from "motion/react";

type ExpertisesDict = {
  expertises: {
    tape: string;
    title: string;
    subtitle: string;
    items: {
      tag: string;
      title: string;
      body: string;
      stack: string[];
    }[];
  };
};

export function Expertises({ dict }: { dict: Record<string, unknown> }) {
  const d = dict as unknown as ExpertisesDict;

  return (
    <section id="expertises" className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-3xl">
        <span className="tape-label">{d.expertises.tape}</span>
        <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
          {d.expertises.title}
        </h2>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {d.expertises.subtitle}
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {d.expertises.items.map((item, i) => (
          <motion.article
            key={item.tag}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
            className="group relative border-t border-[var(--color-ink)] pt-8"
          >
            <div className="flex items-center gap-3">
              <span
                aria-hidden
                className="h-2 w-2 rounded-full bg-[var(--color-brand-teal)]"
              />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                {item.tag}
              </span>
            </div>
            <h3 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight leading-[1.15]">
              {item.title}
            </h3>
            <p className="mt-4 text-[15px] text-[var(--color-ink-soft)] leading-relaxed max-w-lg">
              {item.body}
            </p>
            <ul className="mt-6 flex flex-wrap gap-1.5">
              {item.stack.map((tech) => (
                <li
                  key={tech}
                  className="font-mono text-[11px] tracking-tight px-2 py-1 border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:border-[var(--color-brand-teal)] hover:text-[var(--color-ink)] transition-colors"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
