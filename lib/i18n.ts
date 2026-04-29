export const locales = ["fr", "en", "ja", "fr-ca"] as const;
export const defaultLocale = "fr" as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  ja: "日本語",
  "fr-ca": "Français (Canada)",
};

export const localeShort: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ja: "JP",
  "fr-ca": "FR-CA",
};

/**
 * BCP-47 / ISO tag for HTML <html lang="...">.
 * Our URL slug "fr-ca" is lowercase by Next.js convention; the canonical
 * HTML lang attribute uses the case-correct form "fr-CA".
 */
export const htmlLang: Record<Locale, string> = {
  fr: "fr",
  en: "en",
  ja: "ja",
  "fr-ca": "fr-CA",
};

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
