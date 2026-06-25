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
  // - x-default → /en (lingua franca for international visitors when no
  //   locale matches their browser preferences). This consolidates the
  //   ranking signal between locale variants and avoids Google treating
  //   each locale as a standalone duplicate. The previous removal of
  //   x-default (in Vague 1) was a misdiagnosis — without x-default,
  //   Google picks a locale at random as canonical and marks the rest
  //   as duplicates, which is what "Page is duplicate" was actually
  //   reporting on /en, /ja, /fr-ca.
  return {
    canonical: `${SITE}/${locale}${cleanPath}`,
    languages: {
      fr: `${SITE}/fr${cleanPath}`,
      en: `${SITE}/en${cleanPath}`,
      ja: `${SITE}/ja${cleanPath}`,
      "fr-CA": `${SITE}/fr-ca${cleanPath}`,
      "x-default": `${SITE}/en${cleanPath}`,
    },
  };
}

const OG_IMAGE = `${SITE}/brand/og-image.png`;

/**
 * SEO helper — génère `openGraph` + `twitter` avec un titre spécifique
 * à la page.
 *
 * Pourquoi ce helper existe :
 * Next.js REMPLACE le bloc `openGraph` entier quand une page le redéclare
 * (pas de merge profond avec le layout). Une page qui veut seulement
 * corriger son `og:title` ne peut donc pas faire `openGraph: { title }` —
 * elle perdrait l'image OG, le siteName, etc. hérités du layout.
 *
 * Sans ce helper, les pages internes qui overrident `title` mais pas
 * `openGraph` héritaient du `og:title` du layout (= tagline de la home),
 * d'où un `og:title` faux sur careers, services, about… (audit SEO W21).
 *
 * Chaque page passe son `title`/`description` (les mêmes que les champs
 * `title`/`description` de sa metadata) + son `path` (sans préfixe de
 * locale, identique à celui passé à `pageAlternates`).
 *
 * Usage dans un `generateMetadata` de page :
 *   return {
 *     title,
 *     description,
 *     alternates: pageAlternates(locale, "/careers"),
 *     ...pageOpenGraph(locale, { title, description, path: "/careers" }),
 *   };
 */
export function pageOpenGraph(
  locale: Locale | string,
  opts: {
    title: string;
    description: string;
    path: string;
    /** Si true, OMET le champ `images` du openGraph + twitter -> Next.js
     *  detecte automatiquement le opengraph-image.tsx adjacent a la page
     *  et l'utilise. A utiliser pour les routes dynamiques qui ont leur
     *  propre OG image generee (careers/[slug], glossaire/[slug], etc.).
     *  Sans ce flag, l'OG par defaut /brand/og-image.png override le dynamic. */
    withDynamicImage?: boolean;
  },
): Pick<Metadata, "openGraph" | "twitter"> {
  const cleanPath =
    opts.path === "" || opts.path === "/"
      ? ""
      : opts.path.startsWith("/")
        ? opts.path
        : `/${opts.path}`;
  const dyn = opts.withDynamicImage === true;
  return {
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: `${SITE}/${locale}${cleanPath}`,
      type: "website",
      siteName: "Abbeal",
      locale,
      ...(dyn
        ? {}
        : { images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Abbeal" }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      ...(dyn ? {} : { images: [OG_IMAGE] }),
    },
  };
}
