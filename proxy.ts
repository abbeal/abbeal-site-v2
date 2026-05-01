import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, hasLocale, locales, type Locale } from "@/lib/i18n";

const LOCALE_COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * ISO 3166-1 alpha-2 country codes → site locale.
 * Only countries with an unambiguous FR or JA preference.
 * Canada is handled separately (Québec / New Brunswick → fr-ca, rest → en).
 * Everything else falls through to "en" (international default).
 */
const COUNTRY_TO_LOCALE: Record<string, Locale> = {
  // Francophone countries (Europe)
  FR: "fr",
  BE: "fr",
  CH: "fr",
  LU: "fr",
  MC: "fr",
  // Japanese
  JP: "ja",
};

/**
 * Canadian provinces where French is the majority language or has
 * significant minority status (NB is officially bilingual).
 * Visitors from these provinces with no Accept-Language signal land on
 * /fr-ca (OQLF-localized version: infonuagique, courriel, "ta job"…).
 *
 * Other CA provinces (BC, AB, SK, ON, MB, NS, PE, YT, NT, NU) → /en.
 * Franco-Ontarians and other minority francophones with Accept-Language: fr-CA
 * are still matched on /fr-ca via the Accept-Language step (priority 2).
 */
const CA_FRANCOPHONE_REGIONS = new Set(["QC", "NB"]);

/**
 * Resolve the user's preferred locale.
 *
 * Priority (strongest signal first):
 *  1. NEXT_LOCALE cookie       — explicit user choice (sticky 1y)
 *  2. Accept-Language header   — true user preference (OS + browser)
 *  3. Geo IP (Vercel header)   — geographic guess, fallback only
 *  4. "en"                     — international default (not "fr")
 *
 * Why "en" as final default and not "fr":
 *  - FR is already covered by steps 2 and 3 (Accept-Lang + 5 FR-native countries)
 *  - JA is covered by steps 2 and 3 (Accept-Lang + JP)
 *  - Everyone else (Korean, German, Brazilian, bots…) gets EN, not surprise-FR
 */
function resolveLocale(request: NextRequest): Locale {
  // 1. Cookie — explicit sticky choice
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && hasLocale(cookieLocale)) {
    return cookieLocale;
  }

  // 2. Accept-Language — only if it truly matches one of our locales
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const headers: Record<string, string> = {
      "accept-language": acceptLanguage,
    };
    const languages = new Negotiator({ headers }).languages([
      ...locales,
      "*",
    ]);
    try {
      const matched = match(
        languages,
        locales as unknown as string[],
        defaultLocale,
      );
      const topPref = languages[0]?.toLowerCase() ?? "";
      // Trust the match unless it's a silent fallback to defaultLocale ("fr")
      // for a user whose top preference isn't actually French.
      const isSilentFallback =
        matched === defaultLocale &&
        !topPref.startsWith("fr") &&
        topPref !== "*" &&
        topPref !== "";
      if (hasLocale(matched) && !isSilentFallback) {
        // Geo override for ambiguous "fr" preference:
        // A user with Accept-Language: fr-FR (or generic "fr") visiting
        // from anywhere in Canada should land on /fr-ca, not /fr Europe.
        // The user picked French as a language; the IP confirms North America.
        // Province check is too strict because many VPNs exit through
        // Toronto / Vancouver even when the user is targeting QC content.
        // Trade-off: a French-from-France traveler in Toronto temporarily
        // sees /fr-ca, but they can switch via LangSwitch (and 50% of
        // Abbeal revenue is QC-based, so this default is the right call).
        if (matched === "fr" && !topPref.startsWith("fr-ca")) {
          const country = request.headers
            .get("x-vercel-ip-country")
            ?.toUpperCase();
          if (country === "CA") {
            return "fr-ca";
          }
        }
        return matched;
      }
    } catch {
      // ignore, fall through
    }
  }

  // 3. Geo IP — Vercel injects these headers at the edge
  const country = request.headers.get("x-vercel-ip-country")?.toUpperCase();

  // Canada: francophone provinces (QC, NB) → fr-ca, rest → en.
  // Abbeal's Pôle Amériques is in Montréal, ~50% of revenue is QC-based,
  // so Canadian francophones get the OQLF-localized variant by default.
  if (country === "CA") {
    const region = request.headers
      .get("x-vercel-ip-country-region")
      ?.toUpperCase();
    return region && CA_FRANCOPHONE_REGIONS.has(region) ? "fr-ca" : "en";
  }

  if (country && COUNTRY_TO_LOCALE[country]) {
    return COUNTRY_TO_LOCALE[country];
  }

  // 4. International default → English (not French)
  return "en";
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const urlHasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  // Already on a localized URL → just refresh the cookie if it doesn't match.
  if (urlHasLocale) {
    const currentLocale = pathname.split("/")[1];
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    if (hasLocale(currentLocale) && cookieLocale !== currentLocale) {
      const response = NextResponse.next();
      response.cookies.set(LOCALE_COOKIE, currentLocale, {
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
        path: "/",
      });
      return response;
    }
    return;
  }

  // Otherwise resolve + redirect, and set the sticky cookie.
  const locale = resolveLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(request.nextUrl);
  response.cookies.set(LOCALE_COOKIE, locale, {
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    path: "/",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|.*\\..*).*)"],
};
