import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";

const ROUTES = ["", "/about", "/mobbeal", "/insights", "/careers", "/contact"] as const;

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

  return entries;
}
