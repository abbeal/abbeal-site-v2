import type { Locale } from "./i18n";

/**
 * Builds a schema.org BreadcrumbList JSON-LD payload.
 * Example: breadcrumbs("fr", [["Insights", "/insights"], ["Article slug", "/insights/my-slug"]])
 */
export function breadcrumbs(
  locale: Locale,
  items: [string, string][],
) {
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const home = {
    "@type": "ListItem",
    position: 1,
    name: "Abbeal",
    item: `${SITE}/${locale}`,
  };
  const rest = items.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 2,
    name,
    item: `${SITE}/${locale}${path}`,
  }));
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [home, ...rest],
  };
}
