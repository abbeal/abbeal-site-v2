import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "../../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates, pageOpenGraph } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { ArticleBlocks } from "@/components/sections/ArticleBlocks";
import { ApplyForm } from "@/components/sections/ApplyForm";
import {
  getJobOffer,
  locationLabel,
  contractLabel,
  levelLabel,
  payloadBlocksToArticleBlocks,
} from "@/lib/job-offers";

type Dict = {
  nav: { careers: string };
  careers: {
    applyTo: string;
    applyEmail: string;
  };
};

// Page detail : revalidate 5 min, comme le listing.
// On-demand invalidation via le hook Payload couvre les saves CMS.
export const revalidate = 300;

// dynamicParams = true (default) : permet de servir une offre nouvellement
// creee meme si elle n'etait pas dans la liste au build. getJobOffer() retourne
// null si pas trouvee -> notFound() -> 404 propre.

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/careers/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const locale = lang as Locale;
  const offer = await getJobOffer(slug, locale);
  if (!offer) return {};
  const description = offer.metaDescription ?? offer.excerpt;
  return {
    title: `${offer.title} · Abbeal`,
    description,
    alternates: pageAlternates(locale, `/careers/${slug}`),
    ...pageOpenGraph(locale, {
      title: offer.title,
      description,
      path: `/careers/${slug}`,
    }),
  };
}

export default async function JobOfferDetailPage({
  params,
}: PageProps<"/[lang]/careers/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const offer = await getJobOffer(slug, locale);
  if (!offer) notFound();

  const dict = (await getDictionary(locale)) as Dict;
  const d = dict.careers;
  const crumbs = breadcrumbs(locale, [
    [dict.nav.careers, "/careers"],
    [offer.title, `/careers/${slug}`],
  ]);

  // Convertit les blocks Payload en ArticleBlock pour reutiliser le renderer.
  const articleBlocks = payloadBlocksToArticleBlocks(offer.description);

  // Schema.org JobPosting pour Google Jobs.
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const today = new Date().toISOString().slice(0, 10);
  const validThrough =
    offer.closedAt ??
    new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const employmentTypeMap: Record<string, string> = {
    cdi: "FULL_TIME",
    freelance: "CONTRACTOR",
    stage: "INTERN",
    vie: "TEMPORARY",
    pvt: "TEMPORARY",
    alternance: "PART_TIME",
  };
  const jobPostingLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: offer.title,
    description: offer.excerpt,
    identifier: {
      "@type": "PropertyValue",
      name: "Abbeal",
      value: offer.slug,
    },
    datePosted: offer.publishedAt || today,
    validThrough,
    employmentType: employmentTypeMap[offer.contractType] ?? "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: "Abbeal",
      sameAs: SITE,
      logo: `${SITE}/brand/wordmark-teal.png`,
    },
    experienceRequirements: levelLabel(offer.experienceLevel, locale),
    inLanguage: locale,
    url: `${SITE}/${locale}/careers/${slug}`,
    ...(offer.salaryRange
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            // On garde la string brute car les formats varient (TJM, salaire,
            // M JPY, etc.). Google accepte la forme description.
            currency: "EUR",
            value: { "@type": "QuantitativeValue", unitText: offer.salaryRange },
          },
        }
      : {}),
  };

  const isExternalApply = offer.applyUrl.startsWith("http");

  return (
    <section className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingLd) }}
      />

      {/* Breadcrumb back to listing */}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-6">
        <Link
          href={`/${locale}/careers`}
          className="hover:text-[var(--color-brand-teal)] transition-colors"
        >
          ← {dict.nav.careers}
        </Link>
      </p>

      {/* Header */}
      <div className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)] mb-4">
          {locationLabel(offer.location, locale)} ·{" "}
          {contractLabel(offer.contractType, locale)} ·{" "}
          {levelLabel(offer.experienceLevel, locale)}
        </p>
        <h1 className="font-semibold tracking-[-0.025em] text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05]">
          {offer.title}
        </h1>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {offer.excerpt}
        </p>

        {/* Tech stack badges */}
        {offer.techStack.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {offer.techStack.map((t) => (
              <li
                key={t}
                className="font-mono text-xs px-2.5 py-1 border border-[var(--color-border)] bg-[var(--color-bg-paper)] text-[var(--color-ink-soft)]"
              >
                {t}
              </li>
            ))}
          </ul>
        ) : null}

        {/* Apply CTA (above-the-fold for mobile) */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={offer.applyUrl}
            {...(isExternalApply
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-flex items-center gap-2 h-12 px-6 text-sm border border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg-light)] hover:bg-[var(--color-brand-teal)] hover:border-[var(--color-brand-teal)] transition-colors"
          >
            {d.applyTo}
            <span aria-hidden>→</span>
          </a>
          {offer.salaryRange ? (
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-muted)]">
              {offer.salaryRange}
            </span>
          ) : null}
        </div>
      </div>

      {/* Body description (blocks) */}
      {articleBlocks.length > 0 ? (
        <div className="mt-16 max-w-3xl">
          <ArticleBlocks blocks={articleBlocks} />
        </div>
      ) : null}

      {/* Apply section (form Resend) — remplace l'ancien CTA repeat.
          Form structure : LinkedIn, Calendly, message ; envoie un email via
          Resend a recrutement@abbeal.com. Le mailto direct reste accessible
          via le bouton du header (above-the-fold) pour ceux qui preferent. */}
      <div
        id="apply"
        className="mt-16 pt-12 border-t border-[var(--color-border)] max-w-3xl"
      >
        <h2 className="text-2xl font-semibold tracking-tight">
          {(locale === "ja" && "応募する") ||
            (locale === "en" && "Apply") ||
            "Postuler"}
        </h2>
        <p className="mt-3 text-[15px] text-[var(--color-ink-soft)]">
          {offer.title}
        </p>
        <ApplyForm
          locale={locale}
          offerSlug={offer.slug}
          offerTitle={offer.title}
        />
      </div>
    </section>
  );
}
