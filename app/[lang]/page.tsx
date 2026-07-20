import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "./dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { KPIs } from "@/components/sections/KPIs";
import { ADN } from "@/components/sections/ADN";
import { Services } from "@/components/sections/Services";
import { Hubs } from "@/components/sections/Hubs";
import { Expertises } from "@/components/sections/Expertises";
import { TechRadar } from "@/components/sections/TechRadar";
import { getCurrentEdition } from "@/lib/tech-radar";
import { Stories } from "@/components/sections/Stories";
import { Moments } from "@/components/sections/Moments";
import { Insights } from "@/components/sections/Insights";
import { CareersTeaser } from "@/components/sections/CareersTeaser";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { getHomeFeaturedArticles, pick } from "@/lib/articles";
import { getCMSArticles, cmsArticleAsArticle } from "@/lib/articles-cms";
import { getHomeFeaturedCases } from "@/lib/cases";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { getPublishedJobOffers, locationLabel } from "@/lib/job-offers";

// W29 v3 TTFB fix : revalidate 1h (au lieu de 5 min). Le hook Payload
// afterChange (cf app/api/revalidate/route.ts + payload.config.ts) invalide
// deja /{locale} instantanement quand un admin publie une offre ou un
// article. Le revalidate est un fallback : passer de 300s a 3600s reduit
// drastiquement le taux de cache MISS (donc TTFB) sans impact sur la
// fraicheur (le hook garantit la fraicheur reelle).
// Field CrUX W29 : TTFB 1.6s -> cible <0.8s (seuil "good" CWV).
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { alternates: pageAlternates(lang as Locale, "") };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = (await getDictionary(locale)) as Record<string, unknown> & {
    homeFaq: { items: { q: string; a: string }[] };
    careersHome: { tape: string; title: string; updated: string; cta: string };
    careers: {
      roles: {
        slug: string;
        title: string;
        stack: string;
        location: string;
      }[];
    };
    techRadarHome?: { deepLinkLabel: string };
  };

  const currentRadarEdition = getCurrentEdition();
  const radarDeepLinkLabel =
    dict.techRadarHome?.deepLinkLabel ?? "See full edition";

  // W29 v3 TTFB fix : les 2 requetes Turso independantes (getCMSArticles
  // pour Insights section + getPublishedJobOffers pour CareersTeaser)
  // sont parallelisees via Promise.all. Sequentiel = ~800ms (2x400ms),
  // parallele = ~400ms (max). Direct gain sur TTFB SSR.
  //
  // Home featured articles : pivot CMS-first (comme /insights PR #32).
  //   1. Fetch CMS articles publies avec featuredOnHome=true (source de
  //      verite editoriale, editable depuis /admin sans deploy)
  //   2. Fallback statique : articles static.featuredOnHome ?? .featured
  //      pour couvrir le cas oule CMS ne repond pas OU pour les articles
  //      pre-CMS pas encore migres
  //   3. Dedup par slug (le CMS gagne sur le static si meme slug)
  //   4. Limit 3 (slot scarce Insights section home)
  const [cmsArticles, cmsOffers] = await Promise.all([
    getCMSArticles(locale),
    getPublishedJobOffers(locale),
  ]);
  // CMS side : ONLY featuredOnHome=true remonte a la home. Sinon les
  // articles avec featured=true (importants pour /insights listing mais
  // pas home) apparaissaient a tort ici. Ex : output-based-vs-time-material
  // featured=true, featuredOnHome=false -> doit rester en tete du listing
  // /insights mais PAS sur la home.
  const cmsFeatured = cmsArticles
    .filter((c) => c.featuredOnHome === true)
    .map(cmsArticleAsArticle);
  const staticFeatured = getHomeFeaturedArticles();
  // Merge : CMS first (souvent plus recent), dedup par slug, limit 3
  const seenSlugs = new Set<string>();
  const featuredInsights = [...cmsFeatured, ...staticFeatured]
    .filter((a) => {
      if (seenSlugs.has(a.slug)) return false;
      seenSlugs.add(a.slug);
      return true;
    })
    .slice(0, 3)
    .map((a) => ({
      slug: a.slug,
      tag: a.tag,
      readTime: a.readTime,
      title: pick(a.title, locale),
      excerpt: pick(a.excerpt, locale),
    }));

  // Marquee Stories sur la home : on prend les cases avec featuredOnHome
  // (4 anonymisés à fort KPI chiffré). Les 5 nommés (Cartier, BNP, Money
  // Forward, Pichet, Le Monde) restent featured pour /cases listing mais
  // n'apparaissent pas sur la home (decision Sebastien W19+1).
  const featuredCases = getHomeFeaturedCases().map((c) => ({
    slug: c.slug,
    kpi: { value: c.kpi.value, label: pick(c.kpi.label, locale) },
    sector: pick(c.sector, locale),
    geo: c.geo,
    excerpt: pick(c.excerpt, locale),
  }));

  // CareersTeaser : cumul des offres CMS published + dict.roles, comme sur
  // /careers. CMS en TOP avec href vers page detail, dict en bas avec
  // anchor #slug vers le listing (pas de body markdown pour detail).
  // Limite 4 cards (layout 2x2 desktop).
  // W29 v3 : cmsOffers deja fetche via Promise.all ci-dessus.
  const cmsTeaserRoles = cmsOffers.map((o) => ({
    slug: o.slug,
    title: o.title,
    stack: o.techStack.join(" · "),
    location: locationLabel(o.location, locale),
    href: `/${locale}/careers/${o.slug}`,
  }));
  const cmsSlugs = new Set(cmsTeaserRoles.map((r) => r.slug));
  const dictTeaserRoles = dict.careers.roles
    .filter((r) => !cmsSlugs.has(r.slug))
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      stack: r.stack,
      location: r.location,
      // W24 followup : les templates dict ont desormais une page detail
      // (fallback dans /careers/[slug]). Plus d'anchor sur le listing.
      href: `/${locale}/careers/${r.slug}`,
    }));
  const teaserRoles = [...cmsTeaserRoles, ...dictTeaserRoles];

  // Date "mis a jour le X" dynamique : si on a des offres CMS published,
  // on prend le max de leur publishedAt (chaque save trigger publishedAt =
  // bonne approximation de "derniere update du portfolio carrieres"). Sinon
  // fallback sur la date hardcoded du dict (legacy).
  const lastOfferDate = cmsOffers.length
    ? cmsOffers
        .map((o) => o.publishedAt)
        .filter(Boolean)
        .sort()
        .at(-1)
    : null;
  const dateLocale =
    locale === "fr" ? "fr-FR"
    : locale === "ja" ? "ja-JP"
    : locale === "fr-ca" ? "fr-CA"
    : "en-GB";
  const dynamicUpdatedLabel = lastOfferDate
    ? (locale === "ja"
        ? `求人募集中 · ${new Date(lastOfferDate).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })}更新`
        : locale === "en"
          ? `Open roles · updated ${new Date(lastOfferDate).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })}`
          : `Postes actifs · mis à jour le ${new Date(lastOfferDate).toLocaleDateString(dateLocale, { year: "numeric", month: "long", day: "numeric" })}`)
    : dict.careersHome.updated;

  // FAQPage JSON-LD — rich snippets + LLM extraction
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.homeFaq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  // BreadcrumbList JSON-LD — single-item "Abbeal" sur la home pour
  // signal navigation explicite (audit SEO W19 - manque sur /[lang]).
  const crumbs = breadcrumbs(locale, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <Hero locale={locale} dict={dict} />
      <KPIs dict={dict} />
      <ADN dict={dict} />
      <Services locale={locale} dict={dict} />
      <Hubs locale={locale} />
      <Expertises dict={dict} />
      <TechRadar
        dict={dict}
        deepLink={{
          href: `/${locale}/insights/tech-radar/${currentRadarEdition.slug}`,
          label: `${radarDeepLinkLabel} · ${currentRadarEdition.title}`,
        }}
      />
      <Stories locale={locale} dict={dict} items={featuredCases} />
      <Moments dict={dict} />
      <Insights locale={locale} dict={dict} items={featuredInsights} />
      <CareersTeaser
        locale={locale}
        teaser={{ ...dict.careersHome, updated: dynamicUpdatedLabel }}
        roles={teaserRoles}
      />
      <CTAFinal locale={locale} dict={dict} />
    </>
  );
}
