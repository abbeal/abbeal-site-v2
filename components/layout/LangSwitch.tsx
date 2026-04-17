"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { locales, localeShort, type Locale } from "@/lib/i18n";

export function LangSwitch({ current }: { current: Locale }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const rest = pathname.replace(new RegExp(`^/(${locales.join("|")})`), "") || "/";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wide text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span aria-hidden>◎</span>
        {localeShort[current]}
        <span className={cn("transition-transform", open && "rotate-180")} aria-hidden>
          ↓
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-2 min-w-[8rem] border border-[var(--color-border)] bg-[var(--color-bg-paper)] shadow-[0_8px_24px_-12px_rgba(12,52,61,0.2)] py-1 z-50"
        >
          {locales.map((l) => (
            <li key={l}>
              <Link
                href={`/${l}${rest}`}
                className={cn(
                  "flex items-center justify-between px-3 py-1.5 font-mono text-xs hover:bg-[var(--color-bg-cream)]",
                  l === current && "text-[var(--color-brand-teal)]",
                )}
              >
                <span>{localeShort[l]}</span>
                <span className="text-[var(--color-muted)]">
                  {l === "fr" ? "FR" : l === "en" ? "EN" : "日本"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
