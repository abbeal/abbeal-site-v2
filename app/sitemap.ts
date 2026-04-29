import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { articles } from "@/lib/articles";
import { cases } from "@/lib/cases";
import { services } from "@/lib/services";
import { glossary } from "@/lib/glossary";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";

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
  "/mentions-legales",
  "/confidentialite",
  "/cgu",
] as const;

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
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [l, `${SITE_URL}/${l}${route}`]),
            ),
            "x-default": `${SITE_URL}/fr${route}`,
          },
        },
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
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [
                l,
                `${SITE_URL}/${l}/insights/${article.slug}`,
              ]),
            ),
            "x-default": `${SITE_URL}/fr/insights/${article.slug}`,
          },
        },
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
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [l, `${SITE_URL}/${l}/cases/${c.slug}`]),
            ),
            "x-default": `${SITE_URL}/fr/cases/${c.slug}`,
          },
        },
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
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [l, `${SITE_URL}/${l}/services/${s.slug}`]),
            ),
            "x-default": `${SITE_URL}/fr/services/${s.slug}`,
          },
        },
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
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [l, `${SITE_URL}/${l}/glossaire/${g.slug}`]),
            ),
            "x-default": `${SITE_URL}/fr/glossaire/${g.slug}`,
          },
        },
      });
    }
  }

  return entries;
}
