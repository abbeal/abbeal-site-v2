/**
 * SEO helper — generates correct `alternates` per page.
 *
 * Why this exists:
 * The root layout (`app/[lang]/layout.tsx`) cannot know the current pathname
 * via Next.js App Router metadata API. So if we set `alternates.canonical`
 * in the layout, every page inherits the SAME canonical (= the home of that
 * locale), and Google treats every internal page as a duplicate of the home.
 *
 * Solution: each page's `generateMetadata` calls `pageAlternates(locale, path)`
 * to produce its own self-canonical + correct hreflang languages.
 *
 * Example usage in a page's generateMetadata:
 *   import { pageAlternates } from "@/lib/seo";
 *   export async function generateMetadata({ params }) {
 *     const { lang } = await params;
 *     return {
 *       title: "About",
 *       alternates: pageAlternates(lang, "/about"),
 *     };
 *   }
 */

import type { Metadata } from "next";
import type { Locale } from "./i18n";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";

/**
 * Build the `alternates` field for a page metadata.
 *
 * @param locale current page locale (e.g. "fr", "en", "ja")
 * @param path  pathname WITHOUT the locale prefix and starting with "/"
 *              e.g. "/about", "/cases/banque-rag-cout-divise-10", or ""  for home
 * @returns Metadata.alternates with canonical pointing to the current page
 *          and languages mapping each locale to its equivalent URL.
 */
export function pageAlternates(
  locale: Locale | string,
  path: string,
): NonNullable<Metadata["alternates"]> {
  // Normalize: ensure path starts with "/" (or is empty for home)
  const cleanPath = path === "" || path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;

  // Hreflang strategy:
  // - Each page has a self-canonical (canonical: this page)
  // - languages map uses BCP-47 tags ("fr-CA"), URL slug is "/fr-ca"
  // - No x-default: Google detects via hreflang + geo signals.
  //   This avoids the "Page is duplicate, Google chose a different canonical"
  //   issue that x-default=/fr was triggering on /en, /ja, /fr-ca pages.
  return {
    canonical: `${SITE}/${locale}${cleanPath}`,
    languages: {
      fr: `${SITE}/fr${cleanPath}`,
      en: `${SITE}/en${cleanPath}`,
      ja: `${SITE}/ja${cleanPath}`,
      "fr-CA": `${SITE}/fr-ca${cleanPath}`,
    },
  };
}
