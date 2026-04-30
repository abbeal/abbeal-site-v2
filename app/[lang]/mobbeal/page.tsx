import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { MobbealHero } from "@/components/sections/mobbeal/MobbealHero";
import { Piliers } from "@/components/sections/mobbeal/Piliers";
import { Destinations } from "@/components/sections/mobbeal/Destinations";
import { MobbealTrust } from "@/components/sections/mobbeal/MobbealTrust";
import { Testimonials } from "@/components/sections/mobbeal/Testimonials";
import { MobbealFAQ } from "@/components/sections/mobbeal/MobbealFAQ";
import { MobbealCTA } from "@/components/sections/mobbeal/MobbealCTA";
import { breadcrumbs } from "@/lib/breadcrumbs";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/mobbeal">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as {
    mobbeal: { meta: { title: string; description: string } };
  };
  return {
    title: dict.mobbeal.meta.title,
    description: dict.mobbeal.meta.description,
    openGraph: {
      title: dict.mobbeal.meta.title,
      description: dict.mobbeal.meta.description,
      locale: lang,
    },
    alternates: pageAlternates(lang as Locale, "/mobbeal"),
  };
}

export default async function MobbealPage({
  params,
}: PageProps<"/[lang]/mobbeal">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = (await getDictionary(locale)) as Record<string, unknown> & {
    mobbeal: {
      meta: { title: string; description: string };
      nav: string;
      faq: { items: { q: string; a: string }[] };
    };
  };

  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";

  // FAQ JSON-LD schema for rich snippets + LLM extraction
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dict.mobbeal.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  // Service schema — Mobbeal mobility programme
  // Migrated from @type:Product to @type:Service — no e-commerce fields required
  // Resolves GSC alerts: hasMerchantReturnPolicy, shippingDetails, review, aggregateRating, audience type
  const offerDescription =
    locale === "fr" || locale === "fr-ca"
      ? "Zéro avance de frais. Frais de gestion déduits de la facturation client."
      : locale === "ja"
        ? "前払い手数料ゼロ。管理費はクライアント請求から差し引かれます。"
        : "Zero upfront fees. Management fees deducted from client billing.";

  const audienceName =
    locale === "fr" || locale === "fr-ca"
      ? "Ingénieurs logiciels seniors"
      : locale === "ja"
        ? "シニアソフトウェアエンジニア"
        : "Senior software engineers";

  const serviceType =
    locale === "fr" || locale === "fr-ca"
      ? "Programme de mobilité internationale pour ingénieurs"
      : locale === "ja"
        ? "エンジニア向け国際モビリティプログラム"
        : "International mobility programme for engineers";

  const alternateName =
    locale === "fr" || locale === "fr-ca"
      ? "Programme de mobilité Abbeal"
      : locale === "ja"
        ? "Abbealモビリティプログラム"
        : "Abbeal Mobility Programme";

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/${locale}/mobbeal#service`,
    name: "Mobbeal",
    alternateName,
    serviceType,
    description: dict.mobbeal.meta.description,
    category: "International tech mobility",
    image: `${SITE}/og-mobbeal.png`,
    url: `${SITE}/${locale}/mobbeal`,
    inLanguage: locale,
    audience: {
      "@type": "BusinessAudience",
      name: audienceName,
      audienceType: "Senior software engineers",
    },
    provider: {
      "@type": "ProfessionalService",
      "@id": `${SITE}#organization`,
      name: "Abbeal",
      url: SITE,
      logo: `${SITE}/brand/wordmark-teal.png`,
    },
    areaServed: [
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Japan" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE}/${locale}/mobbeal`,
      availableLanguage: ["French", "English", "Japanese"],
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: "0",
        priceCurrency: "EUR",
        description: offerDescription,
      },
      url: `${SITE}/${locale}/mobbeal`,
      category: "Service B2B",
    },
  };

  // Breadcrumb
  const crumbs = breadcrumbs(locale, [[dict.mobbeal.nav, "/mobbeal"]]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <MobbealHero locale={lang as Locale} dict={dict} />
      <Piliers dict={dict} />
      <Destinations dict={dict} />
      <MobbealTrust locale={lang as Locale} dict={dict} />
      <Testimonials dict={dict} />
      <MobbealFAQ dict={dict} />
      <MobbealCTA dict={dict} />
    </>
  );
}
