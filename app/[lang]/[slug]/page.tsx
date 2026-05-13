import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { getLandingPage, landingPageSlugs } from "@/lib/landing-pages";
import { getArticle, pick } from "@/lib/articles";
import { getCase } from "@/lib/cases";
import { ArticleBlocks } from "@/components/sections/ArticleBlocks";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { pageAlternates } from "@/lib/seo";

/**
 * Routes catch-all racine pour les landing pages SEO non-branded.
 * Whitelist stricte sur lib/landing-pages.ts → notFound() sinon.
 *
 * Routes statiques existantes (about, cases, insights, services, careers,
 * contact, mobbeal, partners, glossaire, cgu, confidentialite,
 * mentions-legales, preferences-cookies, carrieres) ont précédence sur
 * ce [slug] dynamique (Next.js routing priority : statique > dynamique).
 *
 * Pages générées : 4 landings × 4 langues = 16 routes statiques.
 */

export async function generateStaticParams() {
  return locales.flatMap((lang) =>
    landingPageSlugs.map((slug) => ({ lang, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const page = getLandingPage(slug);
  if (!page) return {};
  const locale = lang as Locale;
  const title = pick(page.h1, locale);
  const description = pick(page.metaDescription, locale);
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const url = `${SITE}/${locale}/${slug}`;
  return {
    title: `${title} · Abbeal`,
    description,
    alternates: pageAlternates(locale, `/${slug}`),
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Abbeal",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LandingPage({
  params,
}: PageProps<"/[lang]/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const page = getLandingPage(slug);
  if (!page) notFound();
  const locale = lang as Locale;

  const tape = pick(page.tape, locale);
  const h1 = pick(page.h1, locale);
  const subtitle = pick(page.subtitle, locale);
  const body = pick(page.body, locale);
  const faqItems = pick(page.faq, locale);

  // Schema.org FAQPage : éligibilité Rich Results FAQ + AI Overviews.
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const faqLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

  // Schema.org Service : positionne la page comme une offre Abbeal.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: h1,
    description: subtitle,
    provider: {
      "@type": "Organization",
      name: "Abbeal",
      url: SITE,
    },
    areaServed: [
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Japan" },
    ],
    url: `${SITE}/${locale}/${slug}`,
    inLanguage: locale,
  };

  const crumbs = breadcrumbs(locale, [[h1, `/${slug}`]]);

  // Schema.org additionnels opt-in (LocalBusiness, EmploymentAgency).
  // Activés si lib/landing-pages.ts > LandingPage.extraSchema est défini.
  const extra = page.extraSchema;
  const localBusinessLd = extra?.localBusiness
    ? {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${SITE}/${locale}/${slug}#localbusiness`,
        name: extra.localBusiness.name,
        url: `${SITE}/${locale}/${slug}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: extra.localBusiness.streetAddress,
          addressLocality: extra.localBusiness.addressLocality,
          postalCode: extra.localBusiness.postalCode,
          addressCountry: extra.localBusiness.addressCountry,
        },
        ...(extra.localBusiness.geo && {
          geo: {
            "@type": "GeoCoordinates",
            latitude: extra.localBusiness.geo.latitude,
            longitude: extra.localBusiness.geo.longitude,
          },
        }),
        ...(extra.localBusiness.telephone && {
          telephone: extra.localBusiness.telephone,
        }),
        parentOrganization: {
          "@type": "Organization",
          "@id": `${SITE}#organization`,
          name: "Abbeal",
          url: SITE,
        },
      }
    : null;
  const employmentAgencyLd = extra?.employmentAgency
    ? {
        "@context": "https://schema.org",
        "@type": "EmploymentAgency",
        "@id": `${SITE}/${locale}/${slug}#employmentagency`,
        name: extra.employmentAgency.name,
        url: `${SITE}/${locale}/${slug}`,
        ...(extra.employmentAgency.description && {
          description: extra.employmentAgency.description,
        }),
        areaServed: extra.employmentAgency.areaServed.map((iso) => ({
          "@type": "Country",
          name: iso,
        })),
        parentOrganization: {
          "@type": "Organization",
          "@id": `${SITE}#organization`,
          name: "Abbeal",
          url: SITE,
        },
      }
    : null;

  // Related cases (cases nommés/anonymisés liés à la thématique).
  const relatedCases = page.relatedCaseSlugs
    .map((s) => getCase(s))
    .filter((c): c is NonNullable<typeof c> => c !== undefined)
    .slice(0, 3);

  // Related article Insights (1 article si défini).
  const relatedArticle = page.relatedArticleSlug
    ? getArticle(page.relatedArticleSlug)
    : undefined;

  const t = {
    fr: {
      faqHeading: "Questions fréquentes",
      relatedCasesHeading: "// Cas clients liés",
      relatedArticleHeading: "// À lire ensuite",
      ctaTitle: "Une question, un projet, une mission ?",
      ctaBtn: "Réserver un créneau (Calendly)",
    },
    en: {
      faqHeading: "Frequently asked questions",
      relatedCasesHeading: "// Related case studies",
      relatedArticleHeading: "// Read next",
      ctaTitle: "Got a question, a project, an engagement?",
      ctaBtn: "Book a slot (Calendly)",
    },
    ja: {
      faqHeading: "よくある質問",
      relatedCasesHeading: "// 関連ケース",
      relatedArticleHeading: "// 次に読む",
      ctaTitle: "ご質問、プロジェクト、ミッションは？",
      ctaBtn: "枠を予約 (Calendly)",
    },
    "fr-ca": {
      faqHeading: "Questions fréquentes",
      relatedCasesHeading: "// Cas clients liés",
      relatedArticleHeading: "// À lire ensuite",
      ctaTitle: "Une question, un projet, un mandat ?",
      ctaBtn: "Réserver un créneau (Calendly)",
    },
  }[locale];

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      {localBusinessLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
      )}
      {employmentAgencyLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(employmentAgencyLd) }}
        />
      )}

      {/* Hero */}
      <header className="mx-auto max-w-[960px] px-6 md:px-10 pt-20 md:pt-28 pb-10">
        <span className="tape-label">{tape}</span>
        <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
          {h1}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-[var(--color-ink-soft)] leading-relaxed max-w-[720px]">
          {subtitle}
        </p>
      </header>

      {/* Body */}
      <section className="mx-auto max-w-[760px] px-6 md:px-10 pb-12">
        <ArticleBlocks blocks={body} />
      </section>

      {/* FAQ */}
      {faqItems.length > 0 && (
        <section className="bg-[var(--color-bg-cream)]/40 border-y border-[var(--color-border)]">
          <div className="mx-auto max-w-[960px] px-6 md:px-10 py-16 md:py-20">
            <h2 className="font-semibold tracking-[-0.02em] text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight mb-10">
              {t.faqHeading}
            </h2>
            <ul className="space-y-8">
              {faqItems.map((item, i) => (
                <li key={i}>
                  <h3 className="text-lg md:text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                    {item.q}
                  </h3>
                  <p className="mt-3 text-[15px] md:text-base text-[var(--color-ink-soft)] leading-relaxed">
                    {item.a}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Related cases */}
      {relatedCases.length > 0 && (
        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-8">
              {t.relatedCasesHeading}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedCases.map((rc) => (
                <li key={rc.slug}>
                  <Link
                    href={`/${locale}/cases/${rc.slug}`}
                    className="group block border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-6 hover:border-[var(--color-brand-teal)] transition-colors h-full"
                  >
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
                      {pick(rc.sector, locale)} · {rc.geo}
                    </p>
                    <h3 className="mt-3 text-lg font-semibold tracking-tight leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors">
                      {pick(rc.title, locale)}
                    </h3>
                    <p className="mt-3 text-[14px] text-[var(--color-ink-soft)] leading-relaxed">
                      {pick(rc.excerpt, locale)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Related article */}
      {relatedArticle && (
        <section className="border-b border-[var(--color-border)]">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-6">
              {t.relatedArticleHeading}
            </p>
            <Link
              href={`/${locale}/insights/${relatedArticle.slug}`}
              className="group block max-w-2xl"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
                {relatedArticle.tag} · {relatedArticle.readTime}
              </p>
              <h3 className="mt-3 text-2xl md:text-3xl font-semibold tracking-tight leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors">
                {pick(relatedArticle.title, locale)}
              </h3>
              <p className="mt-3 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
                {pick(relatedArticle.excerpt, locale)}
              </p>
            </Link>
          </div>
        </section>
      )}

      {/* CTA Calendly */}
      <section className="bg-[var(--color-ink)] text-[var(--color-bg-light)]">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-16 md:py-20 text-center">
          <h2 className="font-semibold tracking-[-0.02em] text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight max-w-2xl mx-auto">
            {t.ctaTitle}
          </h2>
          <a
            href="https://calendly.com/d/csr7-3vm-vhw/meeting-abbeal"
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex items-center gap-2 h-12 px-6 text-base gradient-brand-soft-bg text-[var(--color-brand-teal-fg)] hover:brightness-110 transition-all font-medium"
          >
            {t.ctaBtn}
            <span aria-hidden>→</span>
          </a>
        </div>
      </section>
    </article>
  );
}
