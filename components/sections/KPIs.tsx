"use client";

import { motion } from "motion/react";
import { CountUp } from "@/components/ui/CountUp";

type KpiDict = {
  kpis: {
    tape: string;
    items: { value: string; label: string }[];
    clientsLabel: string;
  };
};

/* Client logos — mixed by geo for visual diversity (FR/CA/JP/global).
   Only brands with explicit authorization are listed.
   Split into two rows for a depth effect (forward + reverse marquee). */
const LOGOS_ROW_1 = [
  { slug: "bnp", name: "BNP Paribas" },
  { slug: "smbc", name: "SMBC" },
  { slug: "kering", name: "Kering" },
  { slug: "axa", name: "AXA" },
  { slug: "societe-generale", name: "Société Générale" },
  { slug: "paypay", name: "PayPay" },
  { slug: "money-forward", name: "Money Forward" },
  { slug: "carrefour", name: "Carrefour" },
  { slug: "enedis", name: "Enedis" },
  { slug: "qonto", name: "Qonto" },
] as const;

const LOGOS_ROW_2 = [
  { slug: "bnc", name: "Banque Nationale du Canada" },
  { slug: "desjardins", name: "Desjardins" },
  { slug: "hydro-quebec", name: "Hydro-Québec" },
  { slug: "edf", name: "EDF" },
  { slug: "cartier", name: "Cartier" },
  { slug: "ticketmaster", name: "Ticketmaster" },
  { slug: "pwc", name: "PwC" },
  { slug: "le-monde", name: "Le Monde" },
  { slug: "decathlon", name: "Decathlon" },
] as const;

export function KPIs({ dict }: { dict: Record<string, unknown> }) {
  const d = dict as unknown as KpiDict;

  return (
    <section className="relative border-y border-[var(--color-border)] bg-[var(--color-bg-paper)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-14 md:py-16">
        <span className="tape-label mb-8 inline-flex">{d.kpis.tape}</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {d.kpis.items.map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              className="group"
            >
              <p className="font-sans font-semibold tracking-[-0.02em] text-4xl md:text-5xl lg:text-6xl text-[var(--color-ink)]">
                <CountUp value={kpi.value} />
              </p>
              <div className="mt-3 flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-2 inline-block h-px w-6 bg-[var(--color-brand-teal)]"
                />
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-muted)] leading-relaxed">
                  {kpi.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Clients marquee — two rows, opposite directions for depth */}
        <div className="mt-16 md:mt-20 pt-10 border-t border-dashed border-[var(--color-border)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-muted)] mb-6">
            {d.kpis.clientsLabel}
          </p>
          <div className="marquee-pause space-y-4">
            <div className="marquee-mask overflow-hidden">
              <div className="marquee-track items-center py-2">
                {[...LOGOS_ROW_1, ...LOGOS_ROW_1].map((logo, i) => (
                  <div
                    key={`r1-${logo.slug}-${i}`}
                    className="shrink-0 flex items-center justify-center h-10 md:h-12 min-w-[120px]"
                    aria-label={logo.name}
                  >
                    <img
                      src={`/logos/${logo.slug}.svg`}
                      alt={logo.name}
                      className="logo-mono h-full w-auto max-w-[140px] object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="marquee-mask overflow-hidden">
              <div className="marquee-track-reverse items-center py-2">
                {[...LOGOS_ROW_2, ...LOGOS_ROW_2].map((logo, i) => (
                  <div
                    key={`r2-${logo.slug}-${i}`}
                    className="shrink-0 flex items-center justify-center h-10 md:h-12 min-w-[120px]"
                    aria-label={logo.name}
                  >
                    <img
                      src={`/logos/${logo.slug}.svg`}
                      alt={logo.name}
                      className="logo-mono h-full w-auto max-w-[140px] object-contain"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
