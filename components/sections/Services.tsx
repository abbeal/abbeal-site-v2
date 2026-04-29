"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type ServicesDict = {
  services: {
    tape: string;
    title: string;
    subtitle: string;
    items: {
      number: string;
      title: string;
      subtitle: string;
      body: string;
      cta: string;
    }[];
  };
};

const SERVICE_SLUG_BY_NUMBER: Record<string, string> = {
  "01": "squads-embarques",
  "02": "recrutement-technique",
  "03": "delivery-cle-en-main",
};

const LEARN_MORE: Record<Locale, string> = {
  fr: "Voir le détail",
  en: "See details",
  ja: "詳細を見る",
  "fr-ca": "Voir le détail",
};

export function Services({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
}) {
  const d = dict as unknown as ServicesDict;
  const p = `/${locale}`;

  return (
    <section
      id="services"
      className="bg-[var(--color-ink)] text-[var(--color-bg-light)]"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-brand-teal)]">
            <span
              aria-hidden
              className="h-px w-6 bg-[var(--color-brand-teal)]"
            />
            {d.services.tape}
          </span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
            {d.services.title}
          </h2>
          <p className="mt-5 text-lg text-[var(--color-bg-light)]/70 leading-relaxed">
            {d.services.subtitle}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {d.services.items.map((item, i) => {
            const slug = SERVICE_SLUG_BY_NUMBER[item.number];
            return (
              <motion.article
                key={item.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1] as const,
                }}
              >
                <Link
                  href={slug ? `${p}/services/${slug}` : `${p}/contact`}
                  className="group relative block h-full border border-[var(--color-bg-light)]/12 p-8 hover:border-[var(--color-brand-teal)]/60 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs tracking-widest text-[var(--color-bg-light)]/50">
                      // {item.number}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
                      {item.subtitle}
                    </span>
                  </div>
                  <h3 className="mt-8 text-2xl md:text-3xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[15px] text-[var(--color-bg-light)]/70 leading-relaxed">
                    {item.body}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-sm text-[var(--color-brand-teal)] group-hover:gap-3 transition-all">
                    {LEARN_MORE[locale]}
                    <span aria-hidden>→</span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
