"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

type Ring = "adopt" | "trial" | "assess" | "hold";
type Category = "ai" | "robotics" | "languages" | "infra" | "frontend";
type Filter = "all" | Category;

type Item = {
  name: string;
  ring: Ring;
  category: Category;
  rationale?: string;
};

type RadarDict = {
  techRadar: {
    tape: string;
    title: string;
    subtitle: string;
    rings: Record<Ring, string>;
    categories: Record<Filter, string>;
    items: Item[];
  };
};

const RING_ORDER: Ring[] = ["adopt", "trial", "assess", "hold"];

const RING_STYLES: Record<
  Ring,
  { badge: string; accent: string; ringNumber: string }
> = {
  adopt: {
    badge:
      "bg-[var(--color-brand-teal)] text-[var(--color-brand-teal-fg)] border-[var(--color-brand-teal)]",
    accent: "text-[var(--color-brand-teal)]",
    ringNumber: "01",
  },
  trial: {
    badge:
      "bg-[var(--color-ink)] text-[var(--color-bg-light)] border-[var(--color-ink)]",
    accent: "text-[var(--color-ink)]",
    ringNumber: "02",
  },
  assess: {
    badge:
      "bg-[var(--color-bg-paper)] text-[var(--color-ink)] border-[var(--color-border)]",
    accent: "text-[var(--color-ink-soft)]",
    ringNumber: "03",
  },
  hold: {
    badge:
      "bg-transparent text-[var(--color-muted)] border-[var(--color-muted)]/40",
    accent: "text-[var(--color-muted)]",
    ringNumber: "04",
  },
};

const CATEGORY_ORDER: Filter[] = [
  "all",
  "ai",
  "robotics",
  "languages",
  "infra",
  "frontend",
];

const ease = [0.16, 1, 0.3, 1] as const;

export function TechRadar({ dict }: { dict: Record<string, unknown> }) {
  const d = dict as unknown as RadarDict;
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  const filteredItems = useMemo(() => {
    if (activeFilter === "all") return d.techRadar.items;
    return d.techRadar.items.filter((i) => i.category === activeFilter);
  }, [activeFilter, d.techRadar.items]);

  // Count per category (for chip badges)
  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: d.techRadar.items.length,
      ai: 0,
      robotics: 0,
      languages: 0,
      infra: 0,
      frontend: 0,
    };
    for (const it of d.techRadar.items) {
      c[it.category] = (c[it.category] ?? 0) + 1;
    }
    return c;
  }, [d.techRadar.items]);

  return (
    <section
      id="tech-radar"
      className="relative bg-[var(--color-bg-cream)]/50 border-y border-[var(--color-border)]"
    >
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

        {/* Category filter chips */}
        <div className="mt-10 flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((cat) => {
            const active = cat === activeFilter;
            const count = counts[cat];
            if (count === 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`inline-flex items-center gap-2 h-9 px-3.5 font-mono text-xs uppercase tracking-wider border transition-colors ${
                  active
                    ? "bg-[var(--color-ink)] text-[var(--color-bg-light)] border-[var(--color-ink)]"
                    : "bg-transparent text-[var(--color-ink-soft)] border-[var(--color-border)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]"
                }`}
                aria-pressed={active}
              >
                <span>{d.techRadar.categories[cat]}</span>
                <span
                  className={`font-mono text-[10px] ${
                    active
                      ? "text-[var(--color-brand-teal)]"
                      : "text-[var(--color-muted)]"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Rings grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {RING_ORDER.map((ring, ringIdx) => {
            const itemsInRing = filteredItems.filter((i) => i.ring === ring);
            const style = RING_STYLES[ring];
            return (
              <motion.div
                key={ring}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, delay: ringIdx * 0.06, ease }}
                className="border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-6 flex flex-col"
              >
                <div className="flex items-baseline justify-between">
                  <p className={`font-mono text-xs tracking-widest ${style.accent}`}>
                    // {style.ringNumber}
                  </p>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                    {itemsInRing.length}
                  </span>
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  {d.techRadar.rings[ring]}
                </h3>

                <ul className="mt-5 space-y-3 flex-1">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {itemsInRing.map((item) => (
                      <RadarItem key={item.name} item={item} ring={ring} />
                    ))}
                  </AnimatePresence>
                  {itemsInRing.length === 0 && (
                    <li className="font-mono text-[11px] text-[var(--color-muted)] italic">
                      —
                    </li>
                  )}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RadarItem({ item, ring }: { item: Item; ring: Ring }) {
  const [open, setOpen] = useState(false);
  const style = RING_STYLES[ring];
  const hasRationale = !!item.rationale;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25, ease }}
    >
      <button
        type="button"
        onClick={() => hasRationale && setOpen((o) => !o)}
        disabled={!hasRationale}
        className={`w-full text-left group ${hasRationale ? "cursor-pointer" : "cursor-default"}`}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-block px-2.5 py-1 font-mono text-[11px] border ${style.badge}`}
          >
            {item.name}
          </span>
          {hasRationale && (
            <span
              aria-hidden
              className={`font-mono text-[10px] text-[var(--color-muted)] transition-transform ${
                open ? "rotate-90" : ""
              }`}
            >
              ›
            </span>
          )}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && hasRationale && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease }}
            className="overflow-hidden mt-2 pl-1 text-[13px] text-[var(--color-ink-soft)] leading-relaxed"
          >
            {item.rationale}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
