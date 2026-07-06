"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/* Editorial visuals — content-specific, no generic shapes (anti-AI-slop) */
/*                                                                      */
/* Mapping slug -> visuel React component. Ajouter un nouveau visuel :   */
/*   1. Ecrire la fonction {Name}Visual() ci-dessous                     */
/*   2. Ajouter { "slug-de-article": VisualName } dans VISUAL_MAP        */
/*   3. Sinon fallback sur GenericEditorialVisual (tag + numero + grid)  */
/*                                                                      */
/* Guidelines DA :                                                      */
/*   - Palette : --color-ink, --color-bg-cream, --color-bg-paper,        */
/*     --color-brand-teal (accent), --color-muted, --color-ink-soft      */
/*   - Font : Geist Sans (var --font-sans) + Geist Mono (var --font-mono)*/
/*   - Style : Bauhaus, editorial, punch, minimaliste, anti-AI-slop.     */
/*     Prefer geometric primitives (rects, lines, circles) sur des       */
/*     photos / illustrations. Cohesion avec Hero + KPIs de la home.     */
/*   - Aspect : 4:3 obligatoire (aspect-[4/3])                           */
/* ------------------------------------------------------------------ */

const VISUAL_MAP: Record<string, React.FC> = {
  // 3 anciens articles (garde le rendu original si jamais featured a nouveau)
  "agents-ia-production": AgentTerminalVisual,
  "greenops-7-leviers": GreenOpsBarsVisual,
  "tech-radar-2026": TechRadarVisual,
  // 3 nouveaux articles a la une (juillet 2026)
  "patron-et-de-gauche": PatronGaucheVisual,
  "ingenieur-france-quebec-japon-2026": TriPaysVisual,
  "conseil-vs-ia-accenture-karpathy": ConseilVsIaVisual,
};

function InsightVisual({
  slug,
  tag,
  number,
}: {
  slug: string;
  tag: string;
  number: string;
}) {
  const Visual = VISUAL_MAP[slug] ?? GenericEditorialVisual;
  return (
    <div className="aspect-[4/3] w-full relative overflow-hidden border border-[var(--color-border)]">
      <Visual />

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

/* Visual 4 — Matrice politique 2x2 pour "Patron et de gauche".
 * Axe X : gauche <-> droite. Axe Y : business <-> politique.
 * Un unique point Abbeal dans le quadrant haut-gauche (business + gauche).
 * Style Bauhaus, cash, editorial. */
function PatronGaucheVisual() {
  return (
    <div className="absolute inset-0 bg-[var(--color-bg-cream)] p-5 pt-14">
      <svg viewBox="0 0 100 80" className="absolute inset-x-5 top-14 bottom-5 w-[calc(100%-2.5rem)] h-[calc(100%-4.5rem)]" preserveAspectRatio="xMidYMid meet">
        {/* Axes */}
        <g stroke="var(--color-ink)" strokeWidth="0.4" strokeOpacity="0.35">
          <line x1="10" y1="40" x2="90" y2="40" />
          <line x1="50" y1="8" x2="50" y2="72" />
          {/* Cadre discret */}
          <line x1="10" y1="8" x2="90" y2="8" strokeDasharray="1.5 1.5" strokeOpacity="0.18" />
          <line x1="10" y1="72" x2="90" y2="72" strokeDasharray="1.5 1.5" strokeOpacity="0.18" />
          <line x1="10" y1="8" x2="10" y2="72" strokeDasharray="1.5 1.5" strokeOpacity="0.18" />
          <line x1="90" y1="8" x2="90" y2="72" strokeDasharray="1.5 1.5" strokeOpacity="0.18" />
        </g>
        {/* Labels axes */}
        <g fontFamily="var(--font-mono)" fill="var(--color-muted)" fontSize="3">
          <text x="12" y="6" textAnchor="start">POLITIQUE</text>
          <text x="12" y="78" textAnchor="start">BUSINESS</text>
          <text x="10" y="43" textAnchor="start">GAUCHE</text>
          <text x="90" y="43" textAnchor="end">DROITE</text>
        </g>
        {/* Point Abbeal : quadrant haut-gauche */}
        <g>
          <circle cx="28" cy="22" r="3.5" fill="var(--color-brand-teal)" />
          <circle cx="28" cy="22" r="6.5" fill="none" stroke="var(--color-brand-teal)" strokeWidth="0.5" strokeOpacity="0.5" />
          <text
            x="34"
            y="24"
            fontFamily="var(--font-sans)"
            fontSize="4.2"
            fontWeight="600"
            fill="var(--color-ink)"
          >
            Abbeal
          </text>
        </g>
        {/* Autres points de reperage (silhouette business classique) */}
        <g fill="var(--color-ink)" fillOpacity="0.35">
          <circle cx="72" cy="26" r="1.8" />
          <circle cx="68" cy="30" r="1.8" />
          <circle cx="76" cy="52" r="1.8" />
          <circle cx="65" cy="58" r="1.8" />
        </g>
      </svg>
    </div>
  );
}

/* Visual 5 — Comparatif 3 pays pour "Ingenieur France/Quebec/Japon 2026".
 * 3 colonnes verticales avec KPI chiffre + code pays. Style comparatif
 * secteur mobilite Abbeal (Mobbeal). */
function TriPaysVisual() {
  const cols = [
    { code: "FR", label: "France", value: "-15%", detail: "offres 2026", accent: false },
    { code: "QC", label: "Québec", value: "+22%", detail: "salaires seniors", accent: true },
    { code: "JP", label: "Japon", value: "×3.4", detail: "visa <8 sem", accent: true },
  ];
  return (
    <div className="absolute inset-0 bg-[var(--color-bg-paper)] p-5 pt-14">
      <div className="absolute top-12 right-4 text-right">
        <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-brand-teal)]">
          2026 · comparatif
        </p>
      </div>
      <div className="absolute inset-x-5 bottom-5 top-16 flex items-end gap-3">
        {cols.map((c) => (
          <div key={c.code} className="flex-1 flex flex-col justify-end h-full">
            {/* Rectangle "drapeau" abstrait en haut */}
            <div className="flex-1 flex items-start">
              <div
                className="w-full h-1.5"
                style={{
                  backgroundColor: c.accent
                    ? "var(--color-brand-teal)"
                    : "var(--color-ink)",
                }}
              />
            </div>
            {/* Chiffre grand */}
            <p
              className="mt-2 font-sans font-semibold tracking-tight leading-none text-[var(--color-ink)]"
              style={{ fontSize: "clamp(1.4rem,3.5vw,2rem)" }}
            >
              {c.value}
            </p>
            {/* Detail */}
            <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)]">
              {c.detail}
            </p>
            {/* Bandeau code pays en pied */}
            <div className="mt-3 flex items-center gap-2 border-t border-[var(--color-ink)]/15 pt-2">
              <span className="font-mono text-[10px] font-semibold text-[var(--color-ink)]">
                {c.code}
              </span>
              <span className="font-mono text-[9px] text-[var(--color-muted)]">
                {c.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Visual 6 — Courbes croisees pour "Conseil vs IA (Accenture / Karpathy)".
 * Ligne pleine descendante = conseil, ligne pointillee montante = IA/FDE.
 * Point d'intersection annote. Style editorial minimaliste. */
function ConseilVsIaVisual() {
  return (
    <div className="absolute inset-0 bg-[var(--color-ink)] text-[var(--color-bg-light)] p-5 pt-14">
      <div className="absolute top-12 right-4 text-right">
        <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-brand-teal)]">
          2022 · 2027
        </p>
      </div>
      <svg viewBox="0 0 100 60" className="absolute inset-x-5 top-14 bottom-5 w-[calc(100%-2.5rem)] h-[calc(100%-4.5rem)]" preserveAspectRatio="none">
        {/* Axes discrets */}
        <g stroke="var(--color-bg-light)" strokeOpacity="0.2" strokeWidth="0.3">
          <line x1="5" y1="55" x2="95" y2="55" />
          <line x1="5" y1="5" x2="5" y2="55" />
        </g>
        {/* Grille horizontale legere */}
        <g stroke="var(--color-bg-light)" strokeOpacity="0.08" strokeWidth="0.2">
          <line x1="5" y1="20" x2="95" y2="20" />
          <line x1="5" y1="35" x2="95" y2="35" />
        </g>
        {/* Courbe CONSEIL : descendante */}
        <path
          d="M 8 10 Q 30 15 45 30 Q 60 42 92 52"
          fill="none"
          stroke="var(--color-bg-light)"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
        {/* Courbe IA/FDE : montante */}
        <path
          d="M 8 50 Q 30 45 45 30 Q 60 18 92 8"
          fill="none"
          stroke="var(--color-brand-teal)"
          strokeWidth="1.4"
          strokeDasharray="2 1.5"
        />
        {/* Intersection */}
        <circle cx="45" cy="30" r="2.2" fill="var(--color-brand-teal)" />
        <circle cx="45" cy="30" r="4.5" fill="none" stroke="var(--color-brand-teal)" strokeWidth="0.4" strokeOpacity="0.5" />
        {/* Labels courbes */}
        <text
          x="14"
          y="12"
          fontFamily="var(--font-mono)"
          fontSize="3.2"
          fill="var(--color-bg-light)"
          fillOpacity="0.7"
        >
          CONSEIL
        </text>
        <text
          x="86"
          y="12"
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize="3.2"
          fill="var(--color-brand-teal)"
        >
          IA / FDE
        </text>
      </svg>
    </div>
  );
}

/* Fallback generique — pour tout article featured sans visuel dedie.
 * Grid Bauhaus + tape avec le tag article (deja rendu par InsightVisual).
 * Neutre mais coherent avec la DA. */
function GenericEditorialVisual() {
  return (
    <div className="absolute inset-0 bg-[var(--color-bg-cream)] p-5 pt-14 overflow-hidden">
      <svg
        viewBox="0 0 100 75"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Grille dashed subtile */}
        <g stroke="var(--color-ink)" strokeOpacity="0.1" strokeWidth="0.3" strokeDasharray="2 2">
          <line x1="20" y1="0" x2="20" y2="75" />
          <line x1="50" y1="0" x2="50" y2="75" />
          <line x1="80" y1="0" x2="80" y2="75" />
          <line x1="0" y1="20" x2="100" y2="20" />
          <line x1="0" y1="50" x2="100" y2="50" />
        </g>
        {/* Triangle Bauhaus (echo Hero) */}
        <polygon
          points="35,50 55,50 45,32"
          fill="none"
          stroke="var(--color-brand-teal)"
          strokeOpacity="0.6"
          strokeWidth="0.6"
        />
        {/* Cercle discret */}
        <circle
          cx="72"
          cy="26"
          r="8"
          fill="var(--color-brand-teal)"
          fillOpacity="0.12"
        />
        {/* Barre accent teal en bas */}
        <rect x="10" y="66" width="20" height="2" fill="var(--color-brand-teal)" />
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
  };
};

export type InsightItem = {
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  slug: string;
};

export function Insights({
  locale,
  dict,
  items,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
  items: InsightItem[];
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
          {items.map((item, i) => (
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
                <InsightVisual slug={item.slug} tag={item.tag} number={String(i + 1).padStart(2, "0")} />
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
