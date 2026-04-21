"use client";

import { motion, useReducedMotion } from "motion/react";
import { ButtonLink } from "@/components/ui/Button";
import { TriClock, type ClockCity } from "./TriClock";
import type { Locale } from "@/lib/i18n";

type HeroDict = {
  hero: {
    tape: string;
    h1Top: string;
    h1Bottom: string;
    subtitle: string;
    proof: string;
    ctaPrimary: string;
    ctaSecondary: string;
    clocksLabel: string;
    mastheadTitle: string;
    live: string;
    cities: ClockCity[];
  };
};

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
}) {
  const d = dict as unknown as HeroDict;
  const p = `/${locale}`;
  const reduce = useReducedMotion();

  const fade = (delay: number, y = 16) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease },
        };

  const h1Line = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, delay, ease },
        };

  const ruleAnim = reduce
    ? {}
    : {
        initial: { scaleX: 0, opacity: 0 },
        animate: { scaleX: 1, opacity: 1 },
        transition: { duration: 0.7, delay: 0.35, ease },
      };

  return (
    <section className="relative overflow-hidden">
      {/* Bauhaus background accents */}
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
          <motion.div {...fade(0, 10)}>
            <span className="tape-label">{d.hero.tape}</span>
          </motion.div>

          <h1 className="mt-8 font-sans font-semibold tracking-[-0.03em] text-[clamp(2.75rem,6.5vw,6rem)] leading-[1.02]">
            <motion.span
              {...h1Line(0.1)}
              className="block text-[var(--color-ink)]"
            >
              {d.hero.h1Top}
            </motion.span>
            <motion.span
              {...h1Line(0.22)}
              className="block italic gradient-brand-text pb-[0.05em]"
            >
              {d.hero.h1Bottom}
            </motion.span>
          </h1>

          <motion.span
            {...ruleAnim}
            aria-hidden
            className="mt-8 block h-[2px] w-28 origin-left gradient-brand-bg"
          />

          <motion.p
            {...fade(0.45, 16)}
            className="mt-6 max-w-3xl text-lg leading-relaxed text-[var(--color-ink-soft)] md:text-xl text-balance"
          >
            {d.hero.subtitle}
          </motion.p>

          <motion.p
            {...fade(0.6, 8)}
            className="mt-6 max-w-2xl font-mono text-sm tracking-tight text-[var(--color-ink-soft)] whitespace-pre-line text-balance"
          >
            {d.hero.proof}
          </motion.p>

          <motion.div
            {...fade(0.75, 12)}
            className="mt-10 flex flex-wrap items-center gap-4"
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
          </motion.div>
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
