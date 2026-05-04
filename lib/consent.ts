/**
 * Consent state schema + cookie helpers.
 *
 * Storage: cookie `abbeal-consent` (JSON, 6-month expiry, samesite lax).
 * Schema versioning lets us migrate / invalidate old consent if the
 * regulation changes (e.g. new mandatory category).
 */

export const CONSENT_COOKIE = "abbeal-consent";
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180; // 6 months in seconds

export type ConsentCategory = "necessary" | "analytics" | "ad" | "functional";

export type ConsentPrefs = {
  necessary: true;
  analytics: boolean;
  ad: boolean;
  functional: boolean;
};

export type ConsentState = {
  v: number;
  ts: string; // ISO timestamp of last update
  prefs: ConsentPrefs;
};

export const DEFAULT_PREFS: ConsentPrefs = {
  necessary: true,
  analytics: false,
  ad: false,
  functional: false,
};

export const ALL_GRANTED_PREFS: ConsentPrefs = {
  necessary: true,
  analytics: true,
  ad: true,
  functional: true,
};

export function readConsent(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|;\\s*)" + CONSENT_COOKIE + "=([^;]+)"),
  );
  if (!match) return null;
  try {
    const raw = decodeURIComponent(match[1]);
    const parsed = JSON.parse(raw) as ConsentState;
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      typeof parsed.v === "number" &&
      typeof parsed.ts === "string" &&
      typeof parsed.prefs === "object"
    ) {
      // Hard-pin necessary to true regardless of stored value
      parsed.prefs.necessary = true;
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function writeConsent(prefs: ConsentPrefs): ConsentState {
  const state: ConsentState = {
    v: CONSENT_VERSION,
    ts: new Date().toISOString(),
    prefs: { ...prefs, necessary: true },
  };
  if (typeof document !== "undefined") {
    const value = encodeURIComponent(JSON.stringify(state));
    document.cookie = `${CONSENT_COOKIE}=${value}; max-age=${CONSENT_MAX_AGE}; path=/; samesite=lax`;
  }
  return state;
}

export function clearConsent() {
  if (typeof document !== "undefined") {
    document.cookie = `${CONSENT_COOKIE}=; max-age=0; path=/; samesite=lax`;
  }
}

/**
 * Translate our internal prefs to gtag consent state and push to gtag
 * if it's available on window. No-ops gracefully if gtag isn't loaded
 * (e.g. NEXT_PUBLIC_GA_ID not set, or in a future preview without GA).
 */
export function applyToGtag(prefs: ConsentPrefs) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (
      cmd: "consent",
      action: "update",
      args: Record<string, "granted" | "denied">,
    ) => void;
    dataLayer?: unknown[];
  };
  if (typeof w.gtag !== "function") return;
  w.gtag("consent", "update", {
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: prefs.ad ? "granted" : "denied",
    ad_user_data: prefs.ad ? "granted" : "denied",
    ad_personalization: prefs.ad ? "granted" : "denied",
    functionality_storage: prefs.functional ? "granted" : "denied",
    personalization_storage: prefs.functional ? "granted" : "denied",
  });
}

export type ConsentAction =
  | "accept_all"
  | "reject_all"
  | "save_custom"
  | "withdraw";

/**
 * Fire-and-forget POST to the audit log endpoint. Errors are swallowed
 * because consent UX must never block on logging.
 */
export function logConsent(
  action: ConsentAction,
  prefs: ConsentPrefs,
  locale?: string,
) {
  if (typeof window === "undefined") return;
  try {
    void fetch("/api/consent-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true, // survives navigation
      body: JSON.stringify({
        v: CONSENT_VERSION,
        ts: new Date().toISOString(),
        action,
        prefs,
        source: window.location.pathname,
        locale,
      }),
    }).catch(() => undefined);
  } catch {
    // ignore
  }
}
