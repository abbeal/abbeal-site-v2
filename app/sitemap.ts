import type { MetadataRoute } from "next";
import { htmlLang, locales } from "@/lib/i18n";
import { articles } from "@/lib/articles";
import { cases } from "@/lib/cases";
import { services } from "@/lib/services";
import { glossary } from "@/lib/glossary";
import { TECH_RADAR_EDITIONS } from "@/lib/tech-radar";
import { landingPages } from "@/lib/landing-pages";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";

/**
 * Indexable routes only — pages with `robots: { index: false }` are excluded
 * (mentions-legales, confidentialite). Listing them in the sitemap while
 * they're noindex'd triggers GSC "Excluded by noindex" warnings.
 * /cgu remains because robots: { index: true }.
 */
const ROUTES = [
  "",
  "/about",
  "/mobbeal",
  "/insights",
  "/cases",
  "/partners",
  "/glossaire",
  "/careers",
  "/contact",
  "/cgu",
] as const;

/**
 * Build the hreflang languages map for the sitemap.
 * Output keys use BCP-47 form (e.g. fr-CA), not the URL slug (fr-ca).
 * x-default → /en (lingua franca for unmatched browsers / international visitors).
 * Without x-default, Google picks one locale at random as canonical and marks
 * the others as duplicates (which is what triggered "Page in double" on /en).
 */
function altLanguages(path: string): Record<string, string> {
  const langs = Object.fromEntries(
    locales.map((l) => [htmlLang[l], `${SITE_URL}/${l}${path}`]),
  );
  langs["x-default"] = `${SITE_URL}/en${path}`;
  return langs;
}

/**
 * Per-route priority weight (W22 audit fix).
 *
 * Historique : avant W22, on boostait fr-ca et ja en sitemap parce que
 * QC 50% / JP 35% du revenue. Resultat : la home /fr-ca etait priority 1.0
 * et la home /fr a 0.8 — incoherent vu de l'exterieur (la home FR est
 * historiquement la brand canonique) et flagge par l'audit SEO W22 comme
 * "etrange". Google ignore largement priority de toute facon : c'est
 * hreflang qui gere la geo-targeting.
 *
 * Nouvelle approche : priority basee sur l'importance de la ROUTE
 * (pas la locale). Toutes les locales d'une meme page partagent la meme
 * priority. Plus conventionnel, plus lisible, et hreflang fait le boulot
 * de localisation cote Google.
 */
function priorityFor(route: string): number {
  if (route === "") return 1.0; // home
  if (route === "/mobbeal") return 0.8;
  if (route === "/cases" || route === "/insights") return 0.8;
  if (route === "/about" || route === "/careers" || route === "/contact") return 0.7;
  if (route === "/partners") return 0.6;
  if (route === "/glossaire") return 0.6;
  return 0.5; // /cgu et tout reste
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of ROUTES) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: now,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: priorityFor(route),
        alternates: { languages: altLanguages(route) },
      });
    }
  }

  // Article pages — one per locale per slug
  for (const article of articles) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/insights/${article.slug}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: altLanguages(`/insights/${article.slug}`) },
      });
    }
  }

  // Case study pages
  for (const c of cases) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/cases/${c.slug}`,
        lastModified: new Date(c.publishedAt),
        changeFrequency: "yearly",
        priority: 0.7,
        alternates: { languages: altLanguages(`/cases/${c.slug}`) },
      });
    }
  }

  // Landing pages SEO non-branded (6 landings × 4 langues = 24 pages).
  // Issu de l'audit W19 : pages thematiques pour ranker non-branded
  // sur "follow-the-sun delivery", "tech consulting Tokyo", etc.
  // Priority haute (0.9) car contenu evergreen + niche unique +
  // entree principale pour les requetes SEO non-brandees prioritaires.
  for (const lp of landingPages) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/${lp.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.9,
        alternates: { languages: altLanguages(`/${lp.slug}`) },
      });
    }
  }

  // Service detail pages
  for (const s of services) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/services/${s.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
        alternates: { languages: altLanguages(`/services/${s.slug}`) },
      });
    }
  }

  // Glossary entry pages
  for (const g of glossary) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/glossaire/${g.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
        alternates: { languages: altLanguages(`/glossaire/${g.slug}`) },
      });
    }
  }

  // Tech Radar — archive landing + each edition (high-value SEO asset:
  // strong opinions, niche keywords like "Adopt RAG production",
  // "Hold low-code", etc.)
  for (const locale of locales) {
    entries.push({
      url: `${SITE_URL}/${locale}/insights/tech-radar`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: altLanguages("/insights/tech-radar") },
    });
  }
  for (const edition of TECH_RADAR_EDITIONS) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/insights/tech-radar/${edition.slug}`,
        lastModified: new Date(edition.publishedAt),
        changeFrequency: "yearly",
        priority: 0.7,
        alternates: {
          languages: altLanguages(`/insights/tech-radar/${edition.slug}`),
        },
      });
    }
  }

  return entries;
}
