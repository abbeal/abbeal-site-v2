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

/** Map d'une ville (string libre dans dico) vers son adresse complète Abbeal.
 *  Données canoniques context-abbeal v8 — adresses physiques des 3 hubs. */
export type CityAddress = {
  country: string; // ISO 3166-1 alpha-2
  region?: string; // addressRegion (subdivision admin)
  postalCode: string;
  streetAddress?: string; // Optional : villes hors hubs Abbeal (Kyoto/Osaka)
  //                        n'ont pas d'adresse rue — le poste est chez client.
};
export const CITY_TO_ADDRESS: Record<string, CityAddress> = {
  Paris: {
    country: "FR",
    region: "Île-de-France",
    postalCode: "75002",
    streetAddress: "54 rue Greneta",
  },
  Montréal: {
    country: "CA",
    region: "QC",
    postalCode: "H2J 2L1",
    streetAddress: "4388 Rue Saint-Denis",
  },
  Montreal: {
    country: "CA",
    region: "QC",
    postalCode: "H2J 2L1",
    streetAddress: "4388 Rue Saint-Denis",
  },
  Tokyo: {
    country: "JP",
    region: "Minato-ku",
    postalCode: "106-0044",
    streetAddress: "PMC Building, 1-23-5 Higashi-Azabu",
  },
  // W37 : Kansai — pas de bureau Abbeal, adresse rue absente. Google
  // JobPosting accepte addressLocality + region + postalCode sans street
  // (cas frequent pour les postes chez client sans site fixe).
  Kyoto: {
    country: "JP",
    region: "Kyoto Prefecture",
    postalCode: "604-8005", // Nakagyo-ku (centre-ville, generique)
  },
  Osaka: {
    country: "JP",
    region: "Osaka Prefecture",
    postalCode: "530-0001", // Kita-ku (quartier affaires, generique)
  },
};

/** Map JobOfferLocation (enum CMS) -> tableau de Place Schema.org pour
 *  le champ jobLocation. Les locations remote retournent un tableau vide
 *  (le caller doit alors set jobLocationType=TELECOMMUTE +
 *  applicantLocationRequirements). */
export function jobOfferLocationToPlaces(
  loc: string,
): Array<Record<string, unknown>> {
  const map: Record<string, string[]> = {
    paris: ["Paris"],
    tokyo: ["Tokyo"],
    kyoto: ["Kyoto"],
    osaka: ["Osaka"],
    montreal: ["Montreal"],
    "tri-geo": ["Paris", "Montreal", "Tokyo"],
    "remote-eu": [], // remote -> pas de jobLocation, applicantLocReq + telecom
    "remote-ww": [],
  };
  const cities = map[loc] ?? [];
  return cities
    .map((city) => CITY_TO_ADDRESS[city])
    .filter((addr): addr is CityAddress => Boolean(addr))
    .map((addr, i) => ({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        ...(addr.streetAddress
          ? { streetAddress: addr.streetAddress }
          : {}),
        addressLocality: cities[i],
        ...(addr.region ? { addressRegion: addr.region } : {}),
        postalCode: addr.postalCode,
        addressCountry: addr.country,
      },
    }));
}

/** Map JobOfferExperienceLevel -> monthsOfExperience pour
 *  OccupationalExperienceRequirements Schema.org. Valeurs alignees avec
 *  les conventions du secteur tech FR. */
export function jobOfferExperienceToMonths(level: string): number {
  const map: Record<string, number> = {
    junior: 0, // entry-level / 0-2 ans
    confirme: 24, // 2+ ans
    senior: 60, // 5+ ans
    "lead-plus": 96, // 8+ ans
  };
  return map[level] ?? 24;
}

/** Parse "Paris / Montréal / Tokyo" → array d'adresses complètes */
function parseLocations(loc: string): { city: string; addr: CityAddress }[] {
  return loc
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((city) => ({
      city,
      addr: CITY_TO_ADDRESS[city] ?? CITY_TO_ADDRESS.Paris,
    }));
}

/** Boilerplate Abbeal ajouté en fin de description pour atteindre les
 *  ~150 mots minimum requis par Google JobPosting Rich Results.
 *  Combine : pitch entreprise + 3 piliers + 4 expertises + mode de
 *  travail + 3 hubs + processus de recrutement + Mobbeal. */
const ABBEAL_BOILERPLATE: Record<Locale, string> = {
  fr: "À propos d'Abbeal : pôle d'ingénierie tri-géo (Paris · Montréal · Tokyo) fondé en 2015. 100+ entreprises accompagnées, 50+ talents internationaux via le programme Mobbeal. Trois piliers : Adaptive Follow-the-Sun (delivery 24/7 sur 3 fuseaux), IA-first, GreenOps & Performance. Quatre domaines d'expertise : Web & Mobile, Data & IA, Cloud & Fiabilité, Embarqué & Robotique. On ne facture pas du temps, on livre un périmètre. Mode de travail : sprints courts, ownership produit, code review IA-assistée (Codex), pair programming sur les sujets sensibles, transfert de propriété systématique en fin de mission. Processus de recrutement : sourcing par des ingénieurs (pas par RH), validation technique courte mais exigeante, closing en 48h, garantie 6 mois. Programme Mobbeal pour ceux qui veulent partir vivre à Tokyo, Montréal ou Paris : on prend en charge visa, logement, famille et école. Postuler : recrutement@abbeal.com.",
  en: "About Abbeal: tri-geo engineering studio (Paris · Montréal · Tokyo) founded in 2015. 100+ clients served, 50+ international talents via the Mobbeal mobility programme. Three pillars: Adaptive Follow-the-Sun (24/7 delivery across 3 time zones), AI-first, GreenOps & Performance. Four areas of expertise: Web & Mobile, Data & AI, Cloud & Reliability, Embedded & Robotics. We don't bill time, we ship scope. Working mode: short sprints, product ownership, AI-assisted code reviews (Codex), pair programming on sensitive topics, systematic ownership transfer at the end of each engagement. Recruitment process: sourcing by engineers (not by HR), short but rigorous technical validation, closing within 48 hours, 6-month guarantee. Mobbeal mobility programme for those who want to relocate to Tokyo, Montréal or Paris: we handle visa, housing, family and schools. Apply: recrutement@abbeal.com.",
  ja: "Abbealについて：2015年設立のトライジオ・エンジニアリングスタジオ（パリ・モントリオール・東京）。100社以上の支援実績、Mobbealモビリティプログラム経由で50名以上の国際人材。3つの柱：Adaptive Follow-the-Sun（3タイムゾーンでの24/7デリバリー）、AI-first、GreenOps & Performance。4つの専門領域：Web & Mobile、Data & AI、Cloud & 信頼性、組込み & ロボティクス。時間ではなくスコープで納品します。働き方：短いスプリント、プロダクトオーナーシップ、AI支援コードレビュー（Codex）、重要トピックでのペアプログラミング、各エンゲージメント終了時の体系的なオーナーシップ移転。採用プロセス：エンジニアによるソーシング（人事ではなく）、短いが厳格な技術検証、48時間以内のクロージング、6ヶ月保証。東京、モントリオール、パリへの移住希望者向けMobbealモビリティプログラム：ビザ、住居、家族、学校を弊社が対応します。応募：recrutement@abbeal.com。",
  "fr-ca":
    "À propos d'Abbeal : pôle d'ingénierie tri-géo (Paris · Montréal · Tokyo) fondé en 2015. 100+ entreprises accompagnées, 50+ talents internationaux via le programme Mobbeal. Trois piliers : Adaptive Follow-the-Sun (livraison 24/7 sur 3 fuseaux), IA-first, GreenOps & Performance. Quatre domaines d'expertise : Web & Mobile, Data & IA, Infonuagique & Fiabilité, Embarqué & Robotique. On ne facture pas du temps, on livre une portée. Mode de travail : sprints courts, ownership produit, revues de code assistées par IA (Codex), pair programming sur les sujets sensibles, transfert de propriété systématique en fin de mandat. Processus de recrutement : recherche par des ingénieurs (pas par RH), validation technique courte mais exigeante, conclusion en 48h, garantie 6 mois. Programme Mobbeal pour ceux qui veulent s'établir à Tokyo, Montréal ou Paris : on prend en charge visa, logement, famille et école. Postuler : recrutement@abbeal.com.",
};

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
    // Description enrichie : body original + stack + locations + boilerplate
    // Abbeal pour atteindre les ~150 mots minimum requis par Google
    // JobPosting Rich Results.
    const description = [
      role.body,
      "",
      `Stack technique : ${role.stack}.`,
      `Localisations : ${role.location}. Mode hybride / remote possible selon profil.`,
      "",
      ABBEAL_BOILERPLATE[locale],
    ].join("\n");

    return {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      title: role.title,
      description,
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
      jobLocation: locations.map(({ city, addr }) => ({
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          ...(addr.streetAddress
            ? { streetAddress: addr.streetAddress }
            : {}),
          addressLocality: city,
          ...(addr.region ? { addressRegion: addr.region } : {}),
          postalCode: addr.postalCode,
          addressCountry: addr.country,
        },
      })),
      applicantLocationRequirements: locations.map(({ addr }) => ({
        "@type": "Country",
        name: addr.country,
      })),
      jobLocationType: "TELECOMMUTE",
      url: `${siteUrl}/${locale}/careers#${role.slug}`,
      applicationContact: {
        "@type": "ContactPoint",
        email: applyEmail,
        contactType: "HR",
      },
      directApply: false,
      inLanguage: locale,
    };
  });
}
