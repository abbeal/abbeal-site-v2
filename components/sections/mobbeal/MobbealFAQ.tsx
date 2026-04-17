"use client";

import { motion } from "motion/react";
import { useState } from "react";

type Dict = {
  mobbeal: {
    faq: {
      tape: string;
      title: string;
      items: { q: string; a: string }[];
    };
  };
};

export function MobbealFAQ({ dict }: { dict: Record<string, unknown> }) {
  const d = (dict as unknown as Dict).mobbeal.faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[var(--color-bg-cream)]/40 border-y border-[var(--color-border)]">
      <div className="mx-auto max-w-[960px] px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-2xl">
          <span className="tape-label">{d.tape}</span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
            {d.title}
          </h2>
        </div>

        <ul className="mt-14 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {d.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={i}>
                <motion.button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left hover:text-[var(--color-brand-teal)] transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-start gap-4 flex-1">
                    <span className="font-mono text-xs text-[var(--color-muted)] mt-1 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg font-semibold text-[var(--color-ink)]">
                      {item.q}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className={`shrink-0 h-8 w-8 grid place-items-center border border-[var(--color-border)] transition-transform ${isOpen ? "rotate-45 bg-[var(--color-brand-teal)] text-[var(--color-ink)] border-[var(--color-brand-teal)]" : ""}`}
                  >
                    +
                  </span>
                </motion.button>
                <div
                  className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <p className="pb-6 pl-12 pr-14 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
