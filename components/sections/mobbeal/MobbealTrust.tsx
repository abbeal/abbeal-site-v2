"use client";

import { motion } from "motion/react";
import type { Locale } from "@/lib/i18n";

type Dict = {
  mobbeal: {
    trust: {
      tape: string;
      title: string;
      subtitle: string;
      badges: { name: string; role: string; url: string }[];
    };
  };
};

export function MobbealTrust({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
}) {
  const d = (dict as unknown as Dict).mobbeal.trust;

  return (
    <section className="bg-[var(--color-bg-paper)] border-y border-[var(--color-border)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-20">
        <div className="max-w-3xl">
          <span className="tape-label">{d.tape}</span>
          <h2 className="mt-5 font-semibold tracking-[-0.025em] text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1]">
            {d.title}
          </h2>
          <p className="mt-4 text-base md:text-lg text-[var(--color-ink-soft)] leading-relaxed">
            {d.subtitle}
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {d.badges.map((b, i) => (
            <motion.li
              key={b.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
            >
              <a
                href={b.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full border border-[var(--color-border)] p-5 hover:border-[var(--color-brand-teal)] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold tracking-tight text-base text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] transition-colors">
                      {b.name}
                    </p>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                      {b.role}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="font-mono text-xs text-[var(--color-muted)] group-hover:text-[var(--color-brand-teal)] transition-colors"
                  >
                    ↗
                  </span>
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
