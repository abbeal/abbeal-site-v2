import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "./dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { Hero } from "@/components/sections/Hero";
import { KPIs } from "@/components/sections/KPIs";
import { ADN } from "@/components/sections/ADN";
import { Services } from "@/components/sections/Services";
import { Expertises } from "@/components/sections/Expertises";
import { TechRadar } from "@/components/sections/TechRadar";
import { getCurrentEdition } from "@/lib/tech-radar";
import { Stories } from "@/components/sections/Stories";
import { Moments } from "@/components/sections/Moments";
import { Insights } from "@/components/sections/Insights";
import { CareersTeaser } from "@/components/sections/CareersTeaser";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { getHomeFeaturedArticles, pick } from "@/lib/articles";
import { getHomeFeaturedCases } from "@/lib/cases";
import { breadcrumbs } from "@/lib/breadcrumbs";

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

  const featuredInsights = getHomeFeaturedArticles().map((a) => ({
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
        teaser={dict.careersHome}
        roles={dict.careers.roles}
      />
      <CTAFinal locale={locale} dict={dict} />
    </>
  );
}
