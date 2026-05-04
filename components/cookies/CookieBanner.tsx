"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ALL_GRANTED_PREFS,
  DEFAULT_PREFS,
  applyToGtag,
  logConsent,
  readConsent,
  writeConsent,
} from "@/lib/consent";
import type { Locale } from "@/lib/i18n";

type Labels = {
  title: string;
  body: string;
  acceptAll: string;
  rejectAll: string;
  customize: string;
  preferencesHref: string;
};

/**
 * CookieBanner — sticky bottom-right card, shown only when no consent
 * cookie exists. Three actions: accept all, reject all, customize (links
 * to the preferences page).
 *
 * Hidden until mount to avoid SSR mismatch (server has no idea whether
 * the user already consented).
 *
 * On any of the three actions:
 * - Cookie persisted via writeConsent (6 months)
 * - gtag consent updated to reflect the new state
 * - Audit log POST fired
 * - Banner dismissed
 */
export function CookieBanner({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Labels;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) setOpen(true);
  }, []);

  if (!open) return null;

  function handle(action: "accept_all" | "reject_all") {
    const prefs = action === "accept_all" ? ALL_GRANTED_PREFS : DEFAULT_PREFS;
    writeConsent(prefs);
    applyToGtag(prefs);
    logConsent(action, prefs, locale);
    setOpen(false);
  }

  return (
    <div
      role="dialog"
      aria-label={labels.title}
      aria-modal="false"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 bg-[var(--color-bg-paper)] border border-[var(--color-border)] shadow-[0_12px_40px_-16px_rgba(12,52,61,0.35)] p-5 md:p-6"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-brand-teal)]">
        {labels.title}
      </p>
      <p className="mt-3 text-sm text-[var(--color-ink)] leading-relaxed">
        {labels.body}
      </p>
      <div className="mt-5 flex flex-col sm:flex-row gap-2">
        <button
          type="button"
          onClick={() => handle("accept_all")}
          className="flex-1 h-10 px-4 text-sm font-medium bg-[var(--color-ink)] text-[var(--color-bg-light)] hover:bg-[var(--color-brand-teal)] transition-colors"
        >
          {labels.acceptAll}
        </button>
        <button
          type="button"
          onClick={() => handle("reject_all")}
          className="flex-1 h-10 px-4 text-sm font-medium border border-[var(--color-border)] text-[var(--color-ink)] hover:border-[var(--color-ink)] transition-colors"
        >
          {labels.rejectAll}
        </button>
      </div>
      <Link
        href={`/${locale}${labels.preferencesHref}`}
        className="mt-4 inline-block font-mono text-xs text-[var(--color-ink-soft)] hover:text-[var(--color-brand-teal)] underline underline-offset-4 decoration-dashed"
      >
        {labels.customize}
      </Link>
    </div>
  );
}
