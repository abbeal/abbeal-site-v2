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

type DictRole = {
  slug: string;
  title: string;
  stack: string;
  location: string;
  subject: string;
  body: string;
};

type Dict = {
  nav: { careers: string };
  careers: {
    applyTo: string;
    applyEmail: string;
    roles: DictRole[];
  };
};

// Page detail : revalidate 5 min, comme le listing.
// On-demand invalidation via le hook Payload couvre les saves CMS.
export const revalidate = 300;

// dynamicParams = true (default) : permet de servir une offre nouvellement
// creee meme si elle n'etait pas dans la liste au build. Fallback dict si
// CMS pas trouve permet d'afficher les 4 templates statiques en page detail
// aussi (demande W24 follow-up Seb).

async function loadForSlug(slug: string, locale: Locale, dict: Dict) {
  // 1. Essaye CMS d'abord (offre published)
  const offer = await getJobOffer(slug, locale);
  if (offer) return { kind: "cms" as const, offer };
  // 2. Fallback : check dict.careers.roles (4 templates statiques)
  const dictRole = dict.careers.roles.find((r) => r.slug === slug);
  if (dictRole) return { kind: "dict" as const, role: dictRole };
  return null;
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/careers/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const locale = lang as Locale;
  const dict = (await getDictionary(locale)) as Dict;
  const loaded = await loadForSlug(slug, locale, dict);
  if (!loaded) return {};

  const title = loaded.kind === "cms" ? loaded.offer.title : loaded.role.title;
  const description =
    loaded.kind === "cms"
      ? loaded.offer.metaDescription ?? loaded.offer.excerpt
      : loaded.role.body;
  return {
    title: `${title} · Abbeal`,
    description,
    alternates: pageAlternates(locale, `/careers/${slug}`),
    ...pageOpenGraph(locale, {
      title,
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
  const dict = (await getDictionary(locale)) as Dict;
  const loaded = await loadForSlug(slug, locale, dict);
  if (!loaded) notFound();

  const title = loaded.kind === "cms" ? loaded.offer.title : loaded.role.title;
  const crumbs = breadcrumbs(locale, [
    [dict.nav.careers, "/careers"],
    [title, `/careers/${slug}`],
  ]);

  // i18n minimal pour les labels (apply, postuler, etc.)
  const t = {
    apply:
      (locale === "ja" && "応募する") ||
      (locale === "en" && "Apply") ||
      "Postuler",
    detailIntro:
      (locale === "ja" && "詳細") ||
      (locale === "en" && "About the role") ||
      "À propos du poste",
  };

  return (
    <section className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      {loaded.kind === "cms" ? <CmsSchemaLd offer={loaded.offer} locale={locale} slug={slug} /> : null}

      {/* Breadcrumb back to listing */}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-6">
        <Link
          href={`/${locale}/careers`}
          className="hover:text-[var(--color-brand-teal)] transition-colors"
        >
          ← {dict.nav.careers}
        </Link>
      </p>

      {/* Header — meme structure pour les 2 variants, contenu adapte */}
      <div className="max-w-3xl">
        {loaded.kind === "cms" ? (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)] mb-4">
            {locationLabel(loaded.offer.location, locale)} ·{" "}
            {contractLabel(loaded.offer.contractType, locale)} ·{" "}
            {levelLabel(loaded.offer.experienceLevel, locale)}
          </p>
        ) : (
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)] mb-4">
            {loaded.role.location}
          </p>
        )}
        <h1 className="font-semibold tracking-[-0.025em] text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05]">
          {title}
        </h1>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {loaded.kind === "cms" ? loaded.offer.excerpt : loaded.role.body}
        </p>

        {/* Tech stack badges (CMS only — dict templates ont juste un string) */}
        {loaded.kind === "cms" && loaded.offer.techStack.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-2">
            {loaded.offer.techStack.map((tech) => (
              <li
                key={tech}
                className="font-mono text-xs px-2.5 py-1 border border-[var(--color-border)] bg-[var(--color-bg-paper)] text-[var(--color-ink-soft)]"
              >
                {tech}
              </li>
            ))}
          </ul>
        ) : loaded.kind === "dict" ? (
          <p className="mt-6 font-mono text-sm text-[var(--color-brand-teal)]">
            {loaded.role.stack}
          </p>
        ) : null}

        {/* Apply CTA above-the-fold : scroll vers le form #apply
            (au lieu d'un mailto direct comme avant). Seul path candidature. */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#apply"
            className="inline-flex items-center gap-2 h-12 px-6 text-sm border border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg-light)] hover:bg-[var(--color-brand-teal)] hover:border-[var(--color-brand-teal)] transition-colors"
          >
            {t.apply}
            <span aria-hidden>↓</span>
          </a>
          {loaded.kind === "cms" && loaded.offer.salaryRange ? (
            <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-muted)]">
              {loaded.offer.salaryRange}
            </span>
          ) : null}
        </div>
      </div>

      {/* Body description : CMS = blocks markdown, dict = juste body excerpt
          (deja affiche en subtitle, donc on skip cette section pour dict) */}
      {loaded.kind === "cms" ? (
        <CmsBody offer={loaded.offer} />
      ) : null}

      {/* Apply section — form Resend, meme pour CMS et dict */}
      <div
        id="apply"
        className="mt-16 pt-12 border-t border-[var(--color-border)] max-w-3xl scroll-mt-24"
      >
        <h2 className="text-2xl font-semibold tracking-tight">{t.apply}</h2>
        <p className="mt-3 text-[15px] text-[var(--color-ink-soft)]">
          {title}
        </p>
        <ApplyForm
          locale={locale}
          offerSlug={slug}
          offerTitle={title}
        />
      </div>
    </section>
  );
}

// ============================================================================
// Sub-components — extraits pour clarte du rendu principal.
// ============================================================================

/** Schema.org JobPosting (uniquement pour offres CMS — les dict templates
 *  n'ont pas assez de champs structures pour eligibilite Google Jobs box). */
function CmsSchemaLd({
  offer,
  locale,
  slug,
}: {
  offer: NonNullable<Awaited<ReturnType<typeof getJobOffer>>>;
  locale: Locale;
  slug: string;
}) {
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
            currency: "EUR",
            value: { "@type": "QuantitativeValue", unitText: offer.salaryRange },
          },
        }
      : {}),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingLd) }}
    />
  );
}

function CmsBody({
  offer,
}: {
  offer: NonNullable<Awaited<ReturnType<typeof getJobOffer>>>;
}) {
  const articleBlocks = payloadBlocksToArticleBlocks(offer.description);
  if (articleBlocks.length === 0) return null;
  return (
    <div className="mt-16 max-w-3xl">
      <ArticleBlocks blocks={articleBlocks} />
    </div>
  );
}
