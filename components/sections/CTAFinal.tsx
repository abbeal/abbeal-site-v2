"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type CTADict = {
  ctaFinal: {
    tape: string;
    title: string;
    client: { title: string; body: string; cta: string };
    engineer: { title: string; body: string; cta: string };
  };
};

export function CTAFinal({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
}) {
  const d = dict as unknown as CTADict;
  const p = `/${locale}`;

  return (
    <section className="bg-[var(--color-ink)] text-[var(--color-bg-light)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-brand-teal)]">
            <span aria-hidden className="h-px w-6 bg-[var(--color-brand-teal)]" />
            {d.ctaFinal.tape}
          </span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
            {d.ctaFinal.title}
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--color-bg-light)]/10 border border-[var(--color-bg-light)]/10">
          {[
            { ...d.ctaFinal.client, key: "client", href: `${p}/contact` },
            { ...d.ctaFinal.engineer, key: "engineer", href: `${p}/carrieres` },
          ].map((b, i) => (
            <motion.div
              key={b.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
              className="group relative bg-[var(--color-ink)] p-10 md:p-14 hover:bg-[var(--color-ink-soft)]/40 transition-colors"
            >
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight max-w-md">
                {b.title}
              </h3>
              <p className="mt-4 text-[15px] text-[var(--color-bg-light)]/70 leading-relaxed max-w-md">
                {b.body}
              </p>
              <Link
                href={b.href}
                className="mt-10 inline-flex items-center gap-2 text-base text-[var(--color-brand-teal)] font-medium hover:gap-3 transition-all"
              >
                {b.cta}
                <span aria-hidden>→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
