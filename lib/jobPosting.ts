/**
 * Helper Schema.org JobPosting — eligibilite Google Jobs box.
 *
 * Genere un array de blocs JSON-LD a injecter dans les pages /careers et
 * /carrieres pour eligibilite Google Jobs. Boost CTR sur le longtail
 * non-branded ("AI Engineer Tokyo", "Embedded Robotics Paris", etc.).
 *
 * Spec : https://developers.google.com/search/docs/appearance/structured-data/job-posting
 */

import type { Locale } from "./i18n";

type Role = {
  slug: string;
  title: string;
  stack: string;
  location: string;
  subject: string;
  body: string;
};

/** Map d'une ville (string libre dans dico) vers un code pays ISO 3166-1 alpha-2 */
const CITY_TO_COUNTRY: Record<string, string> = {
  Paris: "FR",
  Montréal: "CA",
  Montreal: "CA",
  Tokyo: "JP",
};

/** Parse "Paris / Montréal / Tokyo" → [{city, country}, ...] */
function parseLocations(loc: string): { city: string; country: string }[] {
  return loc
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((city) => ({
      city,
      country: CITY_TO_COUNTRY[city] ?? "FR",
    }));
}

/**
 * Genere les blocs JSON-LD JobPosting pour chaque role.
 *
 * @param roles  Liste des roles depuis dictionnaires/{locale}.json (careers.roles)
 * @param locale Locale courante (utilisee pour url et inLanguage)
 * @param siteUrl Base URL prod (ex: https://abbeal.com)
 * @param applyEmail Email recrutement (depuis dico careers.applyEmail)
 * @returns Array d'objets JSON-LD prets a stringifier dans <script>
 */
export function generateJobPostings(
  roles: Role[],
  locale: Locale,
  siteUrl: string,
  applyEmail: string,
): Record<string, unknown>[] {
  const today = new Date().toISOString().slice(0, 10);
  // 90 jours de validite — re-publication automatique ou rafraichissement
  // a chaque deploy (datePosted = build time)
  const validThrough = new Date(Date.now() + 90 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);

  return roles.map((role) => {
    const locations = parseLocations(role.location);
    return {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      title: role.title,
      description: `${role.body}\n\nStack : ${role.stack}\nLocations : ${role.location}`,
      identifier: {
        "@type": "PropertyValue",
        name: "Abbeal",
        value: role.slug,
      },
      datePosted: today,
      validThrough: validThrough,
      employmentType: "FULL_TIME",
      hiringOrganization: {
        "@type": "Organization",
        name: "Abbeal",
        sameAs: siteUrl,
        logo: `${siteUrl}/brand/wordmark-teal.png`,
      },
      jobLocation: locations.map(({ city, country }) => ({
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: city,
          addressCountry: country,
        },
      })),
      applicantLocationRequirements: locations.map(({ country }) => ({
        "@type": "Country",
        name: country,
      })),
      jobLocationType: "TELECOMMUTE",
      url: `${siteUrl}/${locale}/careers#${role.slug}`,
      applicationContact: {
        "@type": "ContactPoint",
        email: applyEmail,
      },
      directApply: false,
      inLanguage: locale,
    };
  });
}
