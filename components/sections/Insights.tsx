"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/* Editorial visuals — content-specific, no generic shapes (anti-AI-slop) */
/* ------------------------------------------------------------------ */

function InsightVisual({
  index,
  tag,
  number,
}: {
  index: number;
  tag: string;
  number: string;
}) {
  return (
    <div className="aspect-[4/3] w-full relative overflow-hidden border border-[var(--color-border)]">
      {index === 0 && <AgentTerminalVisual />}
      {index === 1 && <GreenOpsBarsVisual />}
      {index === 2 && <TechRadarVisual />}

      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] px-2 py-1 bg-[var(--color-ink)] text-[var(--color-bg-light)]">
          {tag}
        </span>
        <span className="font-mono text-[10px] tracking-widest text-[var(--color-bg-light)]/80 px-1.5 py-1">
          // {number}
        </span>
      </div>
    </div>
  );
}

/* Visual 1 — Terminal/code preview for "Agents IA en production" */
function AgentTerminalVisual() {
  return (
    <div className="absolute inset-0 bg-[var(--color-ink)] text-[var(--color-bg-light)] p-5 pt-14 font-mono text-[11px] leading-tight overflow-hidden">
      <div className="flex items-center gap-1.5 absolute top-3 right-4">
        <span className="h-2 w-2 rounded-full bg-[var(--color-bg-light)]/30" />
        <span className="h-2 w-2 rounded-full bg-[var(--color-bg-light)]/30" />
        <span className="h-2 w-2 rounded-full bg-[var(--color-brand-teal)]" />
      </div>
      <p className="text-[var(--color-bg-light)]/40">$ agent.run(plan)</p>
      <p className="mt-1.5">
        <span className="text-[var(--color-brand-teal)]">→</span> step 1 · retrieve
      </p>
      <p>
        <span className="text-[var(--color-brand-teal)]">→</span> step 2 · evaluate
      </p>
      <p>
        <span className="text-[var(--color-brand-teal)]">→</span> step 3 · execute
      </p>
      <p className="mt-2 text-[var(--color-bg-light)]/40">
        latency 280ms · cost $0.012
      </p>
      <p className="mt-1 text-[var(--color-brand-teal)]">
        ✓ shipped to production
        <span className="ml-1 inline-block h-3 w-1.5 bg-[var(--color-brand-teal)] animate-pulse" />
      </p>
    </div>
  );
}

/* Visual 2 — Cost bars for "GreenOps 7 leviers" */
function GreenOpsBarsVisual() {
  const before = [85, 92, 78, 88, 95, 90];
  const after = [60, 64, 55, 62, 65, 63];
  return (
    <div className="absolute inset-0 bg-[var(--color-bg-cream)] p-5 pt-14 flex flex-col justify-end">
      <div className="absolute top-12 right-4 text-right">
        <p className="font-sans text-3xl font-semibold tracking-tight text-[var(--color-ink)]">
          −30%
        </p>
        <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">
          cloud bill
        </p>
      </div>
      <div className="flex items-end gap-2 h-28">
        {before.map((b, i) => (
          <div key={i} className="flex-1 flex flex-col gap-px items-stretch">
            <div
              className="w-full bg-[var(--color-ink)]/15"
              style={{ height: `${b}%` }}
            />
            <div
              className="w-full bg-[var(--color-brand-teal)]"
              style={{ height: `${after[i]}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">
        <span>Q1</span>
        <span>Q2</span>
        <span>Q3</span>
        <span>Q4</span>
        <span>Q1</span>
        <span>Q2</span>
      </div>
    </div>
  );
}

/* Visual 3 — Mini tech radar for "Tech radar 2026" */
function TechRadarVisual() {
  const dots = [
    { x: 35, y: 30, label: "Rust", ring: "adopt" },
    { x: 60, y: 28, label: "RAG", ring: "adopt" },
    { x: 25, y: 55, label: "ROS2", ring: "adopt" },
    { x: 55, y: 60, label: "Cache", ring: "trial" },
    { x: 70, y: 45, label: "WASM", ring: "assess" },
  ];
  return (
    <div className="absolute inset-0 bg-[var(--color-bg-paper)] p-5 pt-14">
      <div className="absolute top-12 right-4 text-right">
        <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-brand-teal)]">
          Q1 · 2026
        </p>
      </div>
      <svg viewBox="0 0 100 100" className="absolute inset-x-5 bottom-5 top-14">
        <g
          stroke="var(--color-ink)"
          fill="none"
          strokeWidth="0.4"
          strokeOpacity="0.4"
        >
          <circle cx="40" cy="55" r="40" />
          <circle cx="40" cy="55" r="28" />
          <circle cx="40" cy="55" r="16" />
          <circle cx="40" cy="55" r="6" />
          <line x1="40" y1="15" x2="40" y2="95" />
          <line x1="0" y1="55" x2="80" y2="55" />
        </g>
        {dots.map((d, i) => (
          <g key={i}>
            <circle
              cx={d.x}
              cy={d.y}
              r="2.4"
              fill={
                d.ring === "adopt"
                  ? "var(--color-brand-teal)"
                  : d.ring === "trial"
                    ? "var(--color-ink)"
                    : "var(--color-muted)"
              }
            />
            <text
              x={d.x + 4}
              y={d.y + 1.5}
              fontFamily="var(--font-mono)"
              fontSize="3.6"
              fill="var(--color-ink)"
            >
              {d.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

type InsightsDict = {
  insights: {
    tape: string;
    title: string;
    subtitle: string;
    ctaAll: string;
    items: {
      tag: string;
      title: string;
      excerpt: string;
      readTime: string;
      slug: string;
    }[];
  };
};

export function Insights({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
}) {
  const d = dict as unknown as InsightsDict;
  const p = `/${locale}`;

  return (
    <section id="insights" className="bg-[var(--color-bg-cream)]/40 border-y border-[var(--color-border)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-3xl">
            <span className="tape-label">{d.insights.tape}</span>
            <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
              {d.insights.title}
            </h2>
            <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
              {d.insights.subtitle}
            </p>
          </div>
          <Link
            href={`${p}/insights`}
            className="inline-flex items-center gap-2 font-mono text-sm text-[var(--color-ink)] hover:gap-3 hover:text-[var(--color-brand-teal)] transition-all"
          >
            {d.insights.ctaAll}
            <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {d.insights.items.map((item, i) => (
            <motion.article
              key={item.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.55, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <Link
                href={`${p}/insights/${item.slug}`}
                className="group block"
              >
                <InsightVisual index={i} tag={item.tag} number={String(i + 1).padStart(2, "0")} />
                <div className="mt-5">
                  <h3 className="text-xl font-semibold tracking-tight leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[14px] text-[var(--color-ink-soft)] leading-relaxed">
                    {item.excerpt}
                  </p>
                  <p className="mt-4 font-mono text-xs text-[var(--color-muted)]">
                    {item.readTime}
                  </p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
