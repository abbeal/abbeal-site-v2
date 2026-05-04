"use client";

import { useEffect, useState } from "react";
import {
  ALL_GRANTED_PREFS,
  DEFAULT_PREFS,
  applyToGtag,
  clearConsent,
  logConsent,
  readConsent,
  writeConsent,
  type ConsentPrefs,
} from "@/lib/consent";
import type { Locale } from "@/lib/i18n";

type CategoryLabels = {
  title: string;
  body: string;
};

type Labels = {
  intro: string;
  categories: {
    necessary: CategoryLabels;
    analytics: CategoryLabels;
    ad: CategoryLabels;
    functional: CategoryLabels;
  };
  saveCustom: string;
  acceptAll: string;
  rejectAll: string;
  withdraw: string;
  alwaysOn: string;
  savedToast: string;
  withdrawnToast: string;
};

/**
 * CookiePreferencesForm — page-level form, four categories, four actions
 * (save current selection / accept all / reject all / withdraw).
 *
 * Withdraw clears the cookie entirely so the banner shows again on next
 * page load — user is back to the initial "no consent given" state.
 */
export function CookiePreferencesForm({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Labels;
}) {
  const [mounted, setMounted] = useState(false);
  const [prefs, setPrefs] = useState<ConsentPrefs>(DEFAULT_PREFS);
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    const existing = readConsent();
    if (existing) setPrefs(existing.prefs);
    setMounted(true);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 3500);
  }

  function commit(
    action: "save_custom" | "accept_all" | "reject_all",
    next: ConsentPrefs,
  ) {
    setPrefs(next);
    writeConsent(next);
    applyToGtag(next);
    logConsent(action, next, locale);
    showToast(labels.savedToast);
  }

  function withdraw() {
    clearConsent();
    setPrefs(DEFAULT_PREFS);
    applyToGtag(DEFAULT_PREFS);
    logConsent("withdraw", DEFAULT_PREFS, locale);
    showToast(labels.withdrawnToast);
  }

  function setCategory(key: keyof ConsentPrefs, value: boolean) {
    if (key === "necessary") return; // always on
    setPrefs((p) => ({ ...p, [key]: value }));
  }

  if (!mounted) {
    return (
      <div className="mt-10 h-64 animate-pulse bg-[var(--color-bg-cream)]" />
    );
  }

  return (
    <div className="mt-8">
      <p className="text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
        {labels.intro}
      </p>

      <ul className="mt-10 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        <Category
          title={labels.categories.necessary.title}
          body={labels.categories.necessary.body}
          alwaysOn
          alwaysOnLabel={labels.alwaysOn}
        />
        <Category
          title={labels.categories.analytics.title}
          body={labels.categories.analytics.body}
          checked={prefs.analytics}
          onChange={(v) => setCategory("analytics", v)}
        />
        <Category
          title={labels.categories.ad.title}
          body={labels.categories.ad.body}
          checked={prefs.ad}
          onChange={(v) => setCategory("ad", v)}
        />
        <Category
          title={labels.categories.functional.title}
          body={labels.categories.functional.body}
          checked={prefs.functional}
          onChange={(v) => setCategory("functional", v)}
        />
      </ul>

      <div className="mt-10 flex flex-col sm:flex-row flex-wrap gap-3">
        <button
          type="button"
          onClick={() => commit("save_custom", prefs)}
          className="h-11 px-5 text-sm font-medium bg-[var(--color-ink)] text-[var(--color-bg-light)] hover:bg-[var(--color-brand-teal)] transition-colors"
        >
          {labels.saveCustom}
        </button>
        <button
          type="button"
          onClick={() => commit("accept_all", ALL_GRANTED_PREFS)}
          className="h-11 px-5 text-sm font-medium border border-[var(--color-ink)] text-[var(--color-ink)] hover:bg-[var(--color-bg-cream)] transition-colors"
        >
          {labels.acceptAll}
        </button>
        <button
          type="button"
          onClick={() => commit("reject_all", DEFAULT_PREFS)}
          className="h-11 px-5 text-sm font-medium border border-[var(--color-border)] text-[var(--color-ink-soft)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors"
        >
          {labels.rejectAll}
        </button>
        <button
          type="button"
          onClick={withdraw}
          className="h-11 px-5 text-sm font-mono text-[var(--color-muted)] hover:text-red-600 underline underline-offset-4 decoration-dashed transition-colors"
        >
          {labels.withdraw}
        </button>
      </div>

      <p
        aria-live="polite"
        className={`mt-6 font-mono text-xs ${toast ? "text-[var(--color-brand-teal)]" : "text-[var(--color-muted)] opacity-0"}`}
      >
        {toast || "—"}
      </p>
    </div>
  );
}

function Category({
  title,
  body,
  checked,
  onChange,
  alwaysOn,
  alwaysOnLabel,
}: {
  title: string;
  body: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  alwaysOn?: boolean;
  alwaysOnLabel?: string;
}) {
  return (
    <li className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-6">
      <div className="md:col-span-9">
        <h3 className="text-base font-semibold tracking-tight text-[var(--color-ink)]">
          {title}
        </h3>
        <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
          {body}
        </p>
      </div>
      <div className="md:col-span-3 md:flex md:items-center md:justify-end">
        {alwaysOn ? (
          <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-brand-teal)]">
            <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-brand-teal)]" />
            {alwaysOnLabel}
          </span>
        ) : (
          <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={title}
            onClick={() => onChange?.(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              checked
                ? "bg-[var(--color-brand-teal)]"
                : "bg-[var(--color-border)]"
            }`}
          >
            <span
              aria-hidden
              className={`inline-block h-4 w-4 transform rounded-full bg-[var(--color-bg-paper)] transition-transform ${
                checked ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        )}
      </div>
    </li>
  );
}
