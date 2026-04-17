"use client";

import { motion } from "motion/react";

type RadarDict = {
  techRadar: {
    tape: string;
    title: string;
    subtitle: string;
    rings: { adopt: string; trial: string; assess: string; hold: string };
    items: { name: string; ring: "adopt" | "trial" | "assess" | "hold"; category: string }[];
  };
};

const ringOrder: Array<"adopt" | "trial" | "assess" | "hold"> = ["adopt", "trial", "assess", "hold"];

const ringColors: Record<string, string> = {
  adopt: "bg-[var(--color-brand-teal)] text-[var(--color-brand-teal-fg)]",
  trial: "bg-[var(--color-ink)] text-[var(--color-bg-light)]",
  assess: "bg-[var(--color-bg-cream)] text-[var(--color-ink)] border border-[var(--color-border)]",
  hold: "bg-transparent text-[var(--color-muted)] border border-[var(--color-muted)]/40 line-through decoration-[1px]",
};

export function TechRadar({ dict }: { dict: Record<string, unknown> }) {
  const d = dict as unknown as RadarDict;

  return (
    <section id="tech-radar" className="relative bg-[var(--color-bg-cream)]/50 border-y border-[var(--color-border)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-3xl">
          <span className="tape-label">{d.techRadar.tape}</span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
            {d.techRadar.title}
          </h2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            {d.techRadar.subtitle}
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
          {ringOrder.map((ring, ringIdx) => {
            const items = d.techRadar.items.filter((x) => x.ring === ring);
            return (
              <motion.div
                key={ring}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, delay: ringIdx * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
                className="bg-[var(--color-bg-paper)] p-6"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  // {String(ringIdx + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 text-lg font-semibold tracking-tight">
                  {d.techRadar.rings[ring]}
                </h3>
                <ul className="mt-5 space-y-2">
                  {items.map((item) => (
                    <li key={item.name}>
                      <span
                        className={`inline-block px-2.5 py-1 font-mono text-[11px] ${ringColors[ring]}`}
                      >
                        {item.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
