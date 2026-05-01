"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { locales, localeShort, type Locale } from "@/lib/i18n";

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function rememberLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.cookie = `NEXT_LOCALE=${locale}; max-age=${LOCALE_COOKIE_MAX_AGE}; path=/; samesite=lax`;
}

/**
 * Footer-variant language switcher — flat horizontal pills, always visible
 * (vs the header's dropdown). The same pathname-stripping logic as the
 * dropdown variant so deep-links survive locale switches.
 */
export function FooterLangSwitch({ current }: { current: Locale }) {
  const pathname = usePathname();

  const localeAlt = [...locales]
    .sort((a, b) => b.length - a.length)
    .join("|");
  const rest =
    pathname.replace(new RegExp(`^/(${localeAlt})(?=/|$)`), "") || "/";

  return (
    <ul className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
      {locales.map((l) => (
        <li key={l}>
          <Link
            href={`/${l}${rest}`}
            onClick={() => rememberLocale(l)}
            className={cn(
              "inline-flex items-center px-2 py-1 border tracking-wide transition-colors",
              l === current
                ? "border-[var(--color-brand-teal)] text-[var(--color-brand-teal)]"
                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]",
            )}
            aria-current={l === current ? "true" : undefined}
          >
            {localeShort[l]}
          </Link>
        </li>
      ))}
    </ul>
  );
}
