"use client";

import { motion } from "motion/react";

type Dict = {
  mobbeal: {
    destinations: {
      tape: string;
      title: string;
      subtitle: string;
      items: {
        flag: string;
        city: string;
        punch: string;
        body: string;
        stats: { label: string; value: string }[];
      }[];
    };
  };
};

export function Destinations({ dict }: { dict: Record<string, unknown> }) {
  const d = (dict as unknown as Dict).mobbeal.destinations;

  return (
    <section className="bg-[var(--color-bg-cream)]/40 border-y border-[var(--color-border)]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-24 md:py-32">
        <div className="max-w-3xl">
          <span className="tape-label">{d.tape}</span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
            {d.title}
          </h2>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            {d.subtitle}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {d.items.map((dest, i) => (
            <motion.article
              key={dest.city}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              className="group relative bg-[var(--color-bg-paper)] border border-[var(--color-border)] overflow-hidden hover:border-[var(--color-brand-teal)] transition-colors"
            >
              <div className="aspect-[4/3] relative bg-[var(--color-ink)] overflow-hidden">
                {/* Bauhaus visual per city */}
                {dest.city === "Tokyo" || dest.city === "東京" ? (
                  <TokyoVisual />
                ) : dest.city === "Montréal" || dest.city === "モントリオール" ? (
                  <MontrealVisual />
                ) : (
                  <ParisVisual />
                )}
                <span className="absolute top-4 left-4 text-3xl">{dest.flag}</span>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-semibold tracking-tight text-[var(--color-ink)]">
                  {dest.city}
                </h3>
                <p className="mt-2 text-lg italic text-[var(--color-brand-teal)] leading-snug">
                  {dest.punch}
                </p>
                <p className="mt-4 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
                  {dest.body}
                </p>
                <div className="mt-6 pt-5 border-t border-[var(--color-border)] grid grid-cols-2 gap-3">
                  {dest.stats.map((s, j) => (
                    <div key={j}>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                        {s.label}
                      </p>
                      <p className="mt-1 font-mono text-sm font-medium text-[var(--color-ink)]">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Bauhaus-style SVG visuals (torii / northern lights / Eiffel abstract) */
function TokyoVisual() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="var(--color-ink)" />
      <circle cx="300" cy="90" r="55" fill="var(--color-brand-teal)" opacity="0.9" />
      {/* Torii abstract */}
      <rect x="90" y="120" width="170" height="14" fill="#FAFAF8" />
      <rect x="105" y="135" width="140" height="8" fill="#FAFAF8" opacity="0.6" />
      <rect x="115" y="145" width="12" height="135" fill="#FAFAF8" />
      <rect x="223" y="145" width="12" height="135" fill="#FAFAF8" />
      <line x1="0" y1="280" x2="400" y2="280" stroke="#FAFAF8" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 6" />
    </svg>
  );
}

function MontrealVisual() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="var(--color-ink)" />
      {/* Northern-lights vertical bands */}
      <rect x="50" y="30" width="6" height="240" fill="var(--color-brand-teal)" opacity="0.8" />
      <rect x="90" y="60" width="4" height="210" fill="var(--color-brand-teal)" opacity="0.6" />
      <rect x="130" y="20" width="8" height="250" fill="var(--color-brand-teal)" opacity="0.9" />
      <rect x="180" y="80" width="3" height="190" fill="#FAFAF8" opacity="0.7" />
      <rect x="220" y="40" width="5" height="230" fill="var(--color-brand-teal)" opacity="0.7" />
      {/* Mountain triangle */}
      <polygon points="280,230 340,120 400,230" fill="#FAFAF8" opacity="0.15" />
    </svg>
  );
}

function ParisVisual() {
  return (
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="var(--color-ink)" />
      {/* Circle */}
      <circle cx="120" cy="130" r="55" stroke="var(--color-brand-teal)" strokeWidth="2" fill="none" />
      {/* Abstract Eiffel structure */}
      <polygon points="260,50 285,250 235,250" fill="#FAFAF8" opacity="0.7" />
      <line x1="230" y1="150" x2="290" y2="150" stroke="var(--color-brand-teal)" strokeWidth="2" />
      <line x1="240" y1="100" x2="280" y2="100" stroke="var(--color-brand-teal)" strokeWidth="1.5" />
      {/* Horizon line */}
      <line x1="0" y1="250" x2="400" y2="250" stroke="#FAFAF8" strokeOpacity="0.2" strokeWidth="1" />
    </svg>
  );
}
