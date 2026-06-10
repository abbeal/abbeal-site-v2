/**
 * lib/job-offers.ts — helper Payload-read pour la page publique /careers.
 *
 * Lit la collection job-offers depuis Payload (Turso prod ou SQLite local)
 * en SSR direct via getPayload(). Pas d'appel reseau /api/job-offers : on
 * shortcut l'overhead HTTP en lisant directement le SDK serveur.
 *
 * Filtre :
 *   - status === "published"
 *   - closedAt absent OU closedAt > today
 *
 * Tri :
 *   - featured DESC
 *   - publishedAt DESC
 *
 * Usage (server component uniquement) :
 *   import { getPublishedJobOffers } from "@/lib/job-offers";
 *   const offers = await getPublishedJobOffers("fr");
 */

import type { Locale } from "./i18n";

// ---------------------------------------------------------------------------
// Types — miroir du schema payload.config.ts JobOffers collection
// ---------------------------------------------------------------------------

export type JobOfferStatus = "draft" | "pending_review" | "published";
export type JobOfferLocation =
  | "paris"
  | "tokyo"
  | "montreal"
  | "tri-geo"
  | "remote-eu"
  | "remote-ww";
export type JobOfferContractType =
  | "cdi"
  | "freelance"
  | "stage"
  | "vie"
  | "pvt"
  | "alternance";
export type JobOfferExperienceLevel =
  | "junior"
  | "confirme"
  | "senior"
  | "lead-plus";

/** Block du body "description" (meme 11 types qu'Articles via
 *  STANDARD_CONTENT_BLOCKS) — minimum requis pour le rendu listing. */
export type JobOfferBlock = Record<string, unknown> & { blockType: string };

export type JobOffer = {
  id: number;
  slug: string;
  status: JobOfferStatus;
  featured: boolean;
  title: string;
  excerpt: string;
  metaDescription: string | null;
  location: JobOfferLocation;
  contractType: JobOfferContractType;
  experienceLevel: JobOfferExperienceLevel;
  techStack: string[];
  salaryRange: string | null;
  applyUrl: string;
  publishedAt: string; // ISO date
  closedAt: string | null;
  relatedCaseSlugs: string[];
  description: JobOfferBlock[];
};

// ---------------------------------------------------------------------------
// Maps de labels localises (location / contract / experience)
// ---------------------------------------------------------------------------

/** Affichage canonique de la location.
 *  Les labels Paris/Tokyo/Montréal matchent volontairement les keys du
 *  CITY_TO_ADDRESS map dans lib/jobPosting.ts pour preserver le Schema.org
 *  JobPosting (parseLocations split sur "/"). */
const LOCATION_LABELS: Record<Locale, Record<JobOfferLocation, string>> = {
  fr: {
    paris: "Paris",
    tokyo: "Tokyo",
    montreal: "Montréal",
    "tri-geo": "Paris / Montréal / Tokyo",
    "remote-eu": "Remote (EU)",
    "remote-ww": "Remote (worldwide)",
  },
  en: {
    paris: "Paris",
    tokyo: "Tokyo",
    montreal: "Montréal",
    "tri-geo": "Paris / Montréal / Tokyo",
    "remote-eu": "Remote (EU)",
    "remote-ww": "Remote (worldwide)",
  },
  ja: {
    paris: "パリ",
    tokyo: "東京",
    montreal: "モントリオール",
    "tri-geo": "パリ / モントリオール / 東京",
    "remote-eu": "リモート（EU）",
    "remote-ww": "リモート（世界）",
  },
  "fr-ca": {
    paris: "Paris",
    tokyo: "Tokyo",
    montreal: "Montréal",
    "tri-geo": "Paris / Montréal / Tokyo",
    "remote-eu": "Télétravail (UE)",
    "remote-ww": "Télétravail (mondial)",
  },
};

const CONTRACT_LABELS: Record<Locale, Record<JobOfferContractType, string>> = {
  fr: {
    cdi: "CDI",
    freelance: "Freelance",
    stage: "Stage",
    vie: "VIE",
    pvt: "PVT",
    alternance: "Alternance",
  },
  en: {
    cdi: "Full-time",
    freelance: "Contractor",
    stage: "Internship",
    vie: "VIE",
    pvt: "Working Holiday",
    alternance: "Apprenticeship",
  },
  ja: {
    cdi: "正社員",
    freelance: "業務委託",
    stage: "インターン",
    vie: "VIE",
    pvt: "ワーキングホリデー",
    alternance: "アプレンティスシップ",
  },
  "fr-ca": {
    cdi: "Permanent",
    freelance: "Pigiste",
    stage: "Stage",
    vie: "VIE",
    pvt: "PVT",
    alternance: "Alternance",
  },
};

const LEVEL_LABELS: Record<Locale, Record<JobOfferExperienceLevel, string>> = {
  fr: {
    junior: "Junior (0-2 ans)",
    confirme: "Confirmé (3-5 ans)",
    senior: "Senior (6-9 ans)",
    "lead-plus": "Lead / Staff+ (10+ ans)",
  },
  en: {
    junior: "Junior (0-2 yrs)",
    confirme: "Mid (3-5 yrs)",
    senior: "Senior (6-9 yrs)",
    "lead-plus": "Lead / Staff+ (10+ yrs)",
  },
  ja: {
    junior: "ジュニア（0-2年）",
    confirme: "ミドル（3-5年）",
    senior: "シニア（6-9年）",
    "lead-plus": "リード / スタッフ+（10年以上）",
  },
  "fr-ca": {
    junior: "Junior (0-2 ans)",
    confirme: "Intermédiaire (3-5 ans)",
    senior: "Senior (6-9 ans)",
    "lead-plus": "Lead / Staff+ (10+ ans)",
  },
};

export function locationLabel(loc: JobOfferLocation, locale: Locale): string {
  return LOCATION_LABELS[locale]?.[loc] ?? LOCATION_LABELS.fr[loc] ?? loc;
}

export function contractLabel(
  c: JobOfferContractType,
  locale: Locale,
): string {
  return CONTRACT_LABELS[locale]?.[c] ?? CONTRACT_LABELS.fr[c] ?? c;
}

export function levelLabel(
  l: JobOfferExperienceLevel,
  locale: Locale,
): string {
  return LEVEL_LABELS[locale]?.[l] ?? LEVEL_LABELS.fr[l] ?? l;
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

/** Mappe une row Payload vers le type JobOffer normalise (techStack array
 *  d'objets {name} -> string[], relatedCaseSlugs idem, defaults sains). */
function normalizeOffer(raw: Record<string, unknown>): JobOffer {
  const techStackRaw = (raw.techStack ?? []) as Array<{ name: string }>;
  const relatedCasesRaw = (raw.relatedCaseSlugs ?? []) as Array<{
    slug: string;
  }>;

  return {
    id: raw.id as number,
    slug: raw.slug as string,
    status: raw.status as JobOfferStatus,
    featured: Boolean(raw.featured),
    title: (raw.title as string) ?? "",
    excerpt: (raw.excerpt as string) ?? "",
    metaDescription: (raw.metaDescription as string | null) ?? null,
    location: raw.location as JobOfferLocation,
    contractType: raw.contractType as JobOfferContractType,
    experienceLevel: raw.experienceLevel as JobOfferExperienceLevel,
    techStack: techStackRaw.map((t) => t.name).filter(Boolean),
    salaryRange: (raw.salaryRange as string | null) ?? null,
    applyUrl: (raw.applyUrl as string) ?? "",
    publishedAt: (raw.publishedAt as string) ?? "",
    closedAt: (raw.closedAt as string | null) ?? null,
    relatedCaseSlugs: relatedCasesRaw.map((r) => r.slug).filter(Boolean),
    description: (raw.description as JobOfferBlock[]) ?? [],
  };
}

/** Toutes les offres publiees, non-fermees, triees featured + publishedAt DESC.
 *  Vide si erreur (resilient — la page /careers fallback sur le dict).
 *
 *  W24 fix v2 : on passe par fetch HTTP vers /api/job-offers (REST Payload)
 *  au lieu de getPayload({ config }) SDK direct. Raison :
 *    - getPayload SSR sur Vercel runtime ne retournait PAS les memes offres
 *      que l'API REST publique (probleme d'init Payload SSR / cache). L'offre
 *      LLM Paris publiee par Seb apparaissait sur /api/job-offers mais pas
 *      sur /fr/careers ni /fr/careers/[slug].
 *    - L'API REST a une init Payload partagee, gere par @payloadcms/next.
 *      Plus stable. Overhead HTTP ~50-200ms mais cache Next intelligent
 *      (next: { revalidate: 60 }) le rend negligeable.
 */
export async function getPublishedJobOffers(
  locale: Locale,
): Promise<JobOffer[]> {
  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const url = `${base}/api/job-offers?where[status][equals]=published&locale=${locale}&depth=0&limit=100&sort=-featured,-publishedAt`;

    const res = await fetch(url, {
      // Cache HTTP cote Next, invalide via revalidatePath() du hook Payload
      // afterChange (cf payload.config.ts JobOffers).
      next: { revalidate: 60, tags: ["job-offers"] },
    });
    if (!res.ok) {
      console.error(`[job-offers] /api/job-offers returned ${res.status}`);
      return [];
    }
    const data = (await res.json()) as { docs?: Array<Record<string, unknown>> };
    const today = new Date();
    return (data.docs ?? [])
      .map((d) => normalizeOffer(d))
      .filter((o) => {
        if (!o.closedAt) return true;
        const closed = new Date(o.closedAt);
        if (Number.isNaN(closed.getTime())) return true;
        return closed.getTime() > today.getTime();
      });
  } catch (err) {
    console.error("[job-offers] getPublishedJobOffers failed :", err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Block conversion : Payload JobOffer.description -> ArticleBlock[]
// pour reutiliser le renderer existant components/sections/ArticleBlocks.tsx
// sans dupliquer la logique de rendu (h2, p, list, callout, etc.).
// ---------------------------------------------------------------------------

import type { ArticleBlock } from "./articles";

/** Convertit les blocks Payload (avec blockType) en ArticleBlock (avec type)
 *  pour passer au renderer existant components/sections/ArticleBlocks. */
export function payloadBlocksToArticleBlocks(
  blocks: JobOfferBlock[],
): ArticleBlock[] {
  const out: ArticleBlock[] = [];
  for (const b of blocks) {
    const t = b.blockType;
    if (t === "h2" || t === "h3") {
      out.push({ type: t, content: (b.content as string) ?? "" });
    } else if (t === "p") {
      out.push({ type: "p", content: (b.content as string) ?? "" });
    } else if (t === "list") {
      const items = (b.items as Array<{ text: string }> | undefined) ?? [];
      out.push({
        type: "list",
        items: items.map((i) => i.text).filter(Boolean),
        ordered: Boolean(b.ordered),
      });
    } else if (t === "quote") {
      out.push({
        type: "quote",
        content: (b.content as string) ?? "",
        ...(b.author ? { author: b.author as string } : {}),
      });
    } else if (t === "code") {
      out.push({
        type: "code",
        content: (b.content as string) ?? "",
        ...(b.lang ? { lang: b.lang as string } : {}),
      });
    } else if (t === "callout") {
      out.push({
        type: "callout",
        content: (b.content as string) ?? "",
        ...(b.tone ? { tone: b.tone as "default" | "teal" | "ink" } : {}),
      });
    } else if (t === "byline") {
      out.push({
        type: "byline",
        name: (b.name as string) ?? "",
        role: (b.role as string) ?? "",
        ...(b.linkedinUrl ? { linkedinUrl: b.linkedinUrl as string } : {}),
        ...(b.photo ? { photo: b.photo as string } : {}),
      });
    }
    // Skip silently les types non reconnus (platformHeader, image, link)
    // — pas utilises sur les offres pour l'instant. A etendre si besoin.
  }
  return out;
}

/** Une offre par slug (status published uniquement). Pass par fetch HTTP
 *  vers /api/job-offers, meme raison que getPublishedJobOffers (cf
 *  commentaire au-dessus). */
export async function getJobOffer(
  slug: string,
  locale: Locale,
): Promise<JobOffer | null> {
  try {
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");
    const url = `${base}/api/job-offers?where[and][0][slug][equals]=${encodeURIComponent(slug)}&where[and][1][status][equals]=published&locale=${locale}&depth=0&limit=1`;

    const res = await fetch(url, {
      next: { revalidate: 60, tags: ["job-offers"] },
    });
    if (!res.ok) {
      console.error(`[job-offers] /api/job-offers returned ${res.status}`);
      return null;
    }
    const data = (await res.json()) as { docs?: Array<Record<string, unknown>> };
    if (!data.docs?.length) return null;
    return normalizeOffer(data.docs[0]!);
  } catch (err) {
    console.error(`[job-offers] getJobOffer(${slug}) failed :`, err);
    return null;
  }
}
