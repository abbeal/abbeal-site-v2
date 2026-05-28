import { ButtonLink } from "@/components/ui/Button";
import { TriClock, type ClockCity } from "./TriClock";
import type { Locale } from "@/lib/i18n";

/**
 * Hero home — server component pur (W22 CWV fix).
 *
 * Pourquoi pas "use client" :
 *  - Le H1 est le LCP candidate sur mobile. Avant : Hero etait client +
 *    motion v12 -> bundle JS lourd + hydratation bloque le paint -> LCP 5.6s
 *    mobile. Apres : zero JS pour le shell Hero, HTML pur SSR, anim CSS pure.
 *  - Cible Lighthouse mobile : score >= 90, LCP <= 2.5s.
 *
 * Animations : 100% CSS keyframes (anim-fade-up / anim-h1-line / anim-rule
 * cf globals.css). GPU-accelerated, partent au paint, support reduced-motion
 * automatique via media query globale.
 *
 * TriClock (horloges live Paris/Tokyo/Montreal) reste client car necessite
 * useEffect/setInterval mais sans framer-motion (CSS anim aussi).
 */

type HeroDict = {
  hero: {
    tape: string;
    h1Top: string;
    h1Bottom: string;
    subtitle: string;
    proof: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaTertiary: string;
    ctaCasesLink: string;
    clocksLabel: string;
    mastheadTitle: string;
    live: string;
    cities: ClockCity[];
  };
};

export function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
}) {
  const d = dict as unknown as HeroDict;
  const p = `/${locale}`;

  return (
    <section className="relative overflow-hidden">
      {/* Bauhaus background accents — purement decoratifs, server-rendered. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-[380px] w-[380px] rounded-full bg-[var(--color-brand-teal)]/10 blur-3xl" />
        <svg
          className="absolute top-20 right-[6%] h-44 w-44 text-[var(--color-ink)]/[0.05]"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <circle cx="100" cy="100" r="100" />
        </svg>
        <svg
          className="absolute bottom-12 left-[45%] h-32 w-32 text-[var(--color-brand-teal)]/25"
          viewBox="0 0 100 100"
          fill="none"
        >
          <polygon
            points="50,5 95,90 5,90"
            stroke="currentColor"
            strokeWidth="1"
          />
        </svg>
        <svg
          className="absolute top-[35%] left-[-4%] h-6 w-[480px] text-[var(--color-ink)]/10"
          viewBox="0 0 480 24"
        >
          <line
            x1="0"
            y1="12"
            x2="480"
            y2="12"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="3 6"
          />
        </svg>
      </div>

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 gap-14 px-6 pt-16 pb-24 md:px-10 md:pt-24 md:pb-36 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7 xl:col-span-8">
          <div
            className="anim-fade-up"
            style={{ animationDelay: "0ms" }}
          >
            <span className="tape-label">{d.hero.tape}</span>
          </div>

          {/* H1 = LCP candidate. Server-rendered en HTML pur, animation CSS
              uniquement sur translateY (opacity reste a 1 pour ne pas
              retarder le LCP measurement). */}
          <h1 className="mt-8 font-sans font-semibold tracking-[-0.03em] text-[clamp(2.75rem,6.5vw,6rem)] leading-[1.02]">
            <span
              className="anim-h1-line block text-[var(--color-ink)]"
              style={{ animationDelay: "100ms" }}
            >
              {d.hero.h1Top}
            </span>
            {/* Espace insecable visuel + parsable bot/copy : sans ce noeud
                texte, les 2 spans block se collent dans le DOM serialise
                ("trouver.On l'a fondee.") — audit W20 quick win #4. */}
            {" "}
            <span
              className="anim-h1-line block italic gradient-brand-text pb-[0.05em]"
              style={{ animationDelay: "220ms" }}
            >
              {d.hero.h1Bottom}
            </span>
          </h1>

          <span
            aria-hidden
            className="anim-rule mt-8 block h-[2px] w-28 gradient-brand-bg"
            style={{ animationDelay: "350ms" }}
          />

          <p
            className="anim-fade-up mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-ink-soft)] md:text-xl text-balance"
            style={{ animationDelay: "450ms" }}
          >
            {d.hero.subtitle}
          </p>

          <p
            className="anim-fade-up mt-6 max-w-2xl font-mono text-sm tracking-tight text-[var(--color-ink-soft)] whitespace-pre-line text-balance"
            style={{ animationDelay: "600ms" }}
          >
            {d.hero.proof}
          </p>

          <div
            className="anim-fade-up mt-10 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "750ms" }}
          >
            <ButtonLink href={`${p}/contact`} size="lg">
              {d.hero.ctaPrimary}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </ButtonLink>
            <ButtonLink href={`${p}/mobbeal`} variant="secondary" size="lg">
              {d.hero.ctaSecondary}
            </ButtonLink>
            <ButtonLink href={`${p}/careers`} variant="ghost" size="lg">
              {d.hero.ctaTertiary}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </ButtonLink>
          </div>

          {/* Discreet link to cases — boosts internal nav for /cases without
              competing with the 3 main CTAs above. Arrow slides on hover. */}
          <div
            className="anim-fade-up mt-6"
            style={{ animationDelay: "900ms" }}
          >
            <a
              href={`${p}/cases`}
              className="group inline-flex items-center gap-1.5 font-mono text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-brand-teal)] transition-colors"
            >
              <span className="border-b border-dashed border-[var(--color-ink-soft)]/40 group-hover:border-[var(--color-brand-teal)]/60 transition-colors pb-0.5">
                {d.hero.ctaCasesLink}
              </span>
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </a>
          </div>
        </div>

        <div className="flex items-center lg:col-span-5 xl:col-span-4">
          <div className="w-full">
            <TriClock
              locale={locale}
              cities={d.hero.cities}
              mastheadTitle={d.hero.mastheadTitle}
              liveLabel={d.hero.live}
              ariaLabel={d.hero.clocksLabel}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
