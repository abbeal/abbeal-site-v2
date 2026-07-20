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
 * Sitemap = ISR avec revalidation de 5 min (safety net) + trigger explicite
 * revalidatePath('/sitemap.xml') dans le hook Payload afterChange sur
 * articles + job-offers -> le sitemap se regenere sous 5s a chaque
 * publication (create/update/delete). Voir payload.config.ts + api/revalidate.
 *
 * Fix W26 : avant, le sitemap ne contenait que le static articles (~28) et
 * ZERO job-offer -> les nouveaux articles CMS + toutes les offres CMS
 * n'etaient jamais indexes par Google. Maintenant fetch CMS live.
 */
export const revalidate = 300;

/** Fetch tous les documents publies d'une collection CMS. Utilise pour
 *  hydrater le sitemap avec le contenu CMS live (articles + job-offers)
 *  qui n'est pas dans le static lib/. Tolerant aux echecs : si le CMS
 *  ne repond pas, on renvoie [] (le sitemap conserve le fallback static). */
async function fetchCmsSlugs(
  collection: "articles" | "job-offers",
): Promise<Array<{ slug: string; updatedAt?: string; publishedAt?: string }>> {
  try {
    // Query en locale=fr (source) avec fallback-locale=null pour ne pas
    // avoir les entrees sans FR source. status=published seul (les drafts
    // ne doivent pas etre dans le sitemap).
    const url = `${SITE_URL}/api/${collection}?where[status][equals]=published&limit=500&depth=0&locale=fr&fallback-locale=null`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      docs?: Array<{
        slug?: string;
        updatedAt?: string;
        publishedAt?: string;
        status?: string;
      }>;
    };
    return (data.docs ?? [])
      .filter((d) => d.slug && d.status === "published")
      .map((d) => ({
        slug: d.slug!,
        updatedAt: d.updatedAt,
        publishedAt: d.publishedAt,
      }));
  } catch {
    return [];
  }
}

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
  // W30 audit fix : le hub /services listing (cree PR #88) n'etait pas
  // dans le sitemap. Seuls les enfants /services/{squads-embarques,
  // recrutement-technique, delivery-cle-en-main} etaient listes via la
  // boucle services au-dessous. Ajoute ici pour que Google indexe le
  // hub OfferCatalog + le canonical /{locale}/services par locale.
  "/services",
  // W30+ : page /hubs dediee (retrait Hubs de la home). Landing SEO
  // "bureaux Abbeal", "Abbeal Paris Montreal Tokyo", "拠点 Abbeal".
  "/hubs",
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Fetch CMS live : articles + job-offers publies. Les 2 collections
  // sont hydratees ici pour couvrir 100% du contenu publie sans
  // rebuild manuel a chaque publication.
  const [cmsArticles, cmsJobs] = await Promise.all([
    fetchCmsSlugs("articles"),
    fetchCmsSlugs("job-offers"),
  ]);

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

  // Article pages — merge static (lib/articles.ts) + CMS. Dedup par slug
  // (le CMS peut mirror le static). CMS gagne sur les meta (updatedAt).
  const articleSlugs = new Map<string, { publishedAt?: string; updatedAt?: string }>();
  for (const a of articles) {
    articleSlugs.set(a.slug, { publishedAt: a.publishedAt });
  }
  for (const a of cmsArticles) {
    articleSlugs.set(a.slug, { publishedAt: a.publishedAt, updatedAt: a.updatedAt });
  }
  for (const [slug, meta] of articleSlugs) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/insights/${slug}`,
        lastModified: meta.updatedAt
          ? new Date(meta.updatedAt)
          : meta.publishedAt
            ? new Date(meta.publishedAt)
            : now,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages: altLanguages(`/insights/${slug}`) },
      });
    }
  }

  // Job offer pages (/careers/{slug}) — CMS uniquement (les templates
  // static dans dictionaries n'ont pas d'URL detail dediee, elles
  // pointent vers la home /careers avec anchor). Fix W26 : jusqu'a
  // aujourd'hui, ZERO /careers/{slug} etait indexe -> Google ne
  // voyait aucune offre individuellement.
  for (const j of cmsJobs) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}/careers/${j.slug}`,
        lastModified: j.updatedAt
          ? new Date(j.updatedAt)
          : j.publishedAt
            ? new Date(j.publishedAt)
            : now,
        // Weekly : les offres sont renouvelees frequemment
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: { languages: altLanguages(`/careers/${j.slug}`) },
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

  // Landing pages SEO non-branded.
  // Issu de l'audit W19 : pages thematiques pour ranker non-branded
  // sur "follow-the-sun delivery", "tech consulting Tokyo", etc.
  // Priority haute (0.9) car contenu evergreen + niche unique +
  // entree principale pour les requetes SEO non-brandees prioritaires.
  //
  // W24-t3 : certaines landings sont fr-only (ex. consultant-informatique-
  // paris cible audience FR pure). On filtre les locales pour ne lister
  // que celles ou la landing a du contenu — sinon Google indexerait des
  // pages au contenu fallback FR derriere des URL /en/... → duplicate.
  for (const lp of landingPages) {
    for (const locale of locales) {
      const bodyForLocale = lp.body[locale];
      if (!bodyForLocale || bodyForLocale.length === 0) continue;
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
