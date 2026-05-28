"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";

/**
 * Tri-horloges live Paris / Montreal / Tokyo dans le Hero home.
 *
 * Client component obligatoire (useEffect + setInterval pour le tick chaque
 * seconde). Mais sans framer-motion : animations CSS pures (anim-fade-up
 * dans globals.css) qui ne bloquent pas le main thread ni l'hydratation.
 *
 * SSR : "--:--:--" + "---" pour les valeurs date/heure jusqu'au mount.
 * suppressHydrationWarning sur les noeuds time pour eviter le mismatch warning.
 */

export type ClockCity = {
  key: "paris" | "montreal" | "tokyo";
  name: string;
  label: string;
};

const TZ: Record<ClockCity["key"], string> = {
  paris: "Europe/Paris",
  montreal: "America/Montreal",
  tokyo: "Asia/Tokyo",
};

const INTL_LOCALE: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-GB",
  ja: "ja-JP",
  "fr-ca": "fr-CA",
};

function formatTime(tz: string, now: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
}

function formatDate(tz: string, locale: string, now: Date) {
  return new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    weekday: "short",
    day: "2-digit",
    month: "short",
  })
    .format(now)
    .toUpperCase();
}

function formatOffset(tz: string, now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  }).formatToParts(now);
  const tzName = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  return tzName.replace("GMT", "UTC") || "UTC";
}

function isWorking(tz: string, now: Date) {
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      hour12: false,
    }).format(now),
  );
  return hour >= 8 && hour < 20;
}

export function TriClock({
  locale,
  cities,
  mastheadTitle,
  liveLabel,
  ariaLabel,
}: {
  locale: Locale;
  cities: ClockCity[];
  mastheadTitle: string;
  liveLabel: string;
  ariaLabel: string;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const intlLocale = INTL_LOCALE[locale];

  return (
    <aside
      className="anim-fade-up relative"
      style={{ animationDelay: "300ms" }}
      aria-label={ariaLabel}
    >
      <div className="relative border border-[var(--color-border)] bg-[var(--color-bg-paper)]/80 backdrop-blur-sm shadow-[0_1px_0_0_rgba(12,52,61,0.04),0_20px_40px_-24px_rgba(12,52,61,0.18)]">
        {/* Masthead bar */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-brand-teal)] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-brand-teal)]" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink)]">
              {liveLabel}
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-soft)]">
            {mastheadTitle}
          </span>
        </div>

        <ul className="divide-y divide-[var(--color-border)]">
          {cities.map((city, i) => {
            const tz = TZ[city.key];
            const time = now ? formatTime(tz, now) : "--:--:--";
            const date = now ? formatDate(tz, intlLocale, now) : "---";
            const offset = now ? formatOffset(tz, now) : "UTC";
            const working = now ? isWorking(tz, now) : false;

            return (
              <li
                key={city.key}
                className="anim-fade-up px-5 py-4"
                style={{ animationDelay: `${450 + i * 80}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-base font-semibold tracking-tight text-[var(--color-ink)]">
                      {city.name}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-soft)]">
                      {city.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className="font-mono text-2xl font-medium tabular-nums leading-none text-[var(--color-ink)]"
                      suppressHydrationWarning
                    >
                      {time}
                    </p>
                    <p className="mt-1.5 flex items-center justify-end gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-ink-soft)]">
                      <span className="rounded-sm border border-[var(--color-border)] bg-[var(--color-bg-cream)] px-1.5 py-[1px] text-[9px] tabular-nums">
                        {offset}
                      </span>
                      <span suppressHydrationWarning>{date}</span>
                      <span
                        aria-hidden
                        className={
                          working
                            ? "inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-brand-teal)]"
                            : "inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]/40"
                        }
                        title={working ? "Active" : "Off hours"}
                      />
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bauhaus accent: diagonal line + circle */}
      <svg
        aria-hidden
        className="pointer-events-none absolute -right-6 -bottom-6 h-16 w-16 text-[var(--color-brand-teal)]/30"
        viewBox="0 0 64 64"
        fill="none"
      >
        <line
          x1="0"
          y1="64"
          x2="64"
          y2="0"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="48" cy="48" r="10" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </aside>
  );
}
