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
import { Stories } from "@/components/sections/Stories";
import { Moments } from "@/components/sections/Moments";
import { Insights } from "@/components/sections/Insights";
import { CTAFinal } from "@/components/sections/CTAFinal";
import { getFeaturedArticles, pick } from "@/lib/articles";
import { getFeaturedCases } from "@/lib/cases";

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
  };

  const featuredInsights = getFeaturedArticles().map((a) => ({
    slug: a.slug,
    tag: a.tag,
    readTime: a.readTime,
    title: pick(a.title, locale),
    excerpt: pick(a.excerpt, locale),
  }));

  const featuredCases = getFeaturedCases().map((c) => ({
    slug: c.slug,
    kpi: c.kpi,
    sector: c.sector,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <Hero locale={locale} dict={dict} />
      <KPIs dict={dict} />
      <ADN dict={dict} />
      <Services locale={locale} dict={dict} />
      <Expertises dict={dict} />
      <TechRadar dict={dict} />
      <Stories locale={locale} dict={dict} items={featuredCases} />
      <Moments dict={dict} />
      <Insights locale={locale} dict={dict} items={featuredInsights} />
      <CTAFinal locale={locale} dict={dict} />
    </>
  );
}
