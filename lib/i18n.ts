export const locales = ["fr", "en", "ja"] as const;
export const defaultLocale = "fr" as const;

export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  ja: "日本語",
};

export const localeShort: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ja: "JP",
};

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
