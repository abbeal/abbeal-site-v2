import type { MetadataRoute } from "next";
import { htmlLang, locales } from "@/lib/i18n";
import { articles } from "@/lib/articles";
import { cases } from "@/lib/cases";
import { services } from "@/lib/services";
import { glossary } from "@/lib/glossary";

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
 * No x-default: each URL is its own canonical via lib/seo.ts; we let Google
 * pick the right variant via hreflang + geo signals (Stripe / Linear / Vercel pattern).
 */
function altLanguages(path: string): Record<string, string> {
  return Object.fromEntries(
    locales.map((l) => [htmlLang[l], `${SITE_URL}/${l}${path}`]),
  );
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
        priority: route === "" ? 1.0 : route === "/mobbeal" ? 0.9 : 0.7,
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

  return entries;
}
