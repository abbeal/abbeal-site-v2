import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { getDictionary } from "../../dictionaries";
import { cases, getCase, getAllCases } from "@/lib/cases";
import { pick } from "@/lib/articles";
import { ArticleBlocks } from "@/components/sections/ArticleBlocks";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { pageAlternates } from "@/lib/seo";

export async function generateStaticParams() {
  return locales.flatMap((lang) =>
    cases.map((c) => ({ lang, slug: c.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/cases/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const c = getCase(slug);
  if (!c) return { title: "Case study introuvable · Abbeal" };
  const locale = lang as Locale;
  const title = pick(c.title, locale);
  const description = pick(c.excerpt, locale);
  // Override OG/Twitter pour que le partage social affiche le titre
  // specifique du case (et non le titre generique du root layout).
  // L'image og dynamique est servie automatiquement via la route
  // ./opengraph-image.tsx (1200x630 PNG avec logo client si nomme).
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const url = `${SITE}/${locale}/cases/${slug}`;
  return {
    title: `${title} · Abbeal Cases`,
    description,
    alternates: pageAlternates(locale, `/cases/${slug}`),
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Abbeal",
      locale,
      // images: heritera de la route ./opengraph-image.tsx (Next 16
      // injecte automatiquement l'OG image generee dynamiquement).
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[lang]/cases/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const c = getCase(slug);
  if (!c) notFound();
  const dict = (await getDictionary(locale)) as {
    casesCommon?: { templateBadge: string; templateNote: string };
  };

  const title = pick(c.title, locale);
  const excerpt = pick(c.excerpt, locale);
  const body = pick(c.body, locale);

  // Related cases: same sector (compare by FR canonical key) → fallback to most recent
  const related = getAllCases()
    .filter((x) => x.slug !== c.slug && x.sector.fr === c.sector.fr)
    .slice(0, 3);
  const fallback = getAllCases()
    .filter((x) => x.slug !== c.slug)
    .slice(0, 3);
  const relatedFinal = related.length >= 2 ? related : fallback;

  // Lien interne contextuel vers la landing SEO la plus pertinente selon
  // la geo du case (W22 Ticket 2 — maillage cases -> landings).
  // Texte d'ancre = phrase naturelle avec mot-cle, pas "cliquez ici".
  // Logique de routing :
  //   - Tokyo / JP-related        -> /tech-consulting-tokyo
  //   - Tri-geo / Montreal        -> /follow-the-sun-delivery
  //   - Paris / autre             -> /services/squads-embarques (generique)
  const geoLower = c.geo.toLowerCase();
  const slugLower = c.slug.toLowerCase();
  const isTokyo =
    geoLower.includes("tokyo") ||
    geoLower.includes("japon") ||
    slugLower.includes("japon") ||
    slugLower.includes("jp-");
  const isTriGeoOrMontreal =
    geoLower.includes("tri-geo") || geoLower.includes("montréal") || geoLower.includes("montreal");
  const similarLink = isTokyo
    ? {
        href: "/tech-consulting-tokyo",
        label: {
          fr: "notre offre tech consulting à Tokyo",
          en: "our tech consulting offer in Tokyo",
          ja: "東京テックコンサルティングのオファー",
          "fr-ca": "notre offre tech consulting à Tokyo",
        },
      }
    : isTriGeoOrMontreal
      ? {
          href: "/follow-the-sun-delivery",
          label: {
            fr: "notre delivery Follow-the-Sun tri-géo",
            en: "our tri-geo Follow-the-Sun delivery",
            ja: "三拠点 Follow-the-Sun デリバリー",
            "fr-ca": "notre delivery Follow-the-Sun tri-géo",
          },
        }
      : {
          href: "/services/squads-embarques",
          label: {
            fr: "notre offre squads embarqués",
            en: "our embedded squads offer",
            ja: "組み込みスクワッドのオファー",
            "fr-ca": "notre offre escouades embarquées",
          },
        };

  const t = {
    fr: {
      back: "← Cases",
      kpi: "KPI",
      duration: "Durée",
      team: "Équipe",
      teamUnit: "ingés",
      hub: "Hub(s)",
      related: "// À lire ensuite",
      ctaTitle: "Un cas similaire chez vous ?",
      ctaBtn: "Parler à un architecte",
      similarLabel: "// Discuter d'un projet similaire",
      similarPrefix: "Cette mission ressemble à votre besoin ? Découvrez",
    },
    en: {
      back: "← Cases",
      kpi: "KPI",
      duration: "Duration",
      team: "Team",
      teamUnit: "engineers",
      hub: "Hub(s)",
      related: "// Read next",
      ctaTitle: "A similar case at your place?",
      ctaBtn: "Talk to an architect",
      similarLabel: "// Discuss a similar project",
      similarPrefix: "This engagement looks like your need? Discover",
    },
    ja: {
      back: "← ケース",
      kpi: "KPI",
      duration: "期間",
      team: "チーム",
      teamUnit: "人",
      hub: "ハブ",
      related: "// 次に読む",
      ctaTitle: "貴社でも似たケースがある？",
      ctaBtn: "アーキテクトと話す",
      similarLabel: "// 類似プロジェクトを相談",
      similarPrefix: "このミッションがニーズに似ていますか？",
    },
    "fr-ca": {
      back: "← Cas clients",
      kpi: "Indicateur",
      duration: "Durée",
      team: "Équipe",
      teamUnit: "ingés",
      hub: "Pôle(s)",
      related: "// À lire ensuite",
      ctaTitle: "Un cas similaire chez vous ?",
      ctaBtn: "Parler à un architecte",
      similarLabel: "// Discuter d'un mandat similaire",
      similarPrefix: "Ce mandat ressemble à votre besoin ? Découvrez",
    },
  }[locale];

  // schema.org Article + rich metadata for cases
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const caseLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    datePublished: c.publishedAt,
    dateModified: c.publishedAt,
    inLanguage: locale,
    about: pick(c.sector, locale),
    keywords: [pick(c.sector, locale), c.geo, ...c.techStack].join(", "),
    author: { "@type": "Organization", name: "Abbeal", url: SITE },
    publisher: {
      "@type": "Organization",
      name: "Abbeal",
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/brand/wordmark-teal.png`,
      },
    },
    mainEntityOfPage: `${SITE}/${locale}/cases/${c.slug}`,
    image: `${SITE}/${locale}/cases/${c.slug}/opengraph-image`,
  };

  const crumbs = breadcrumbs(locale, [
    ["Cases", "/cases"],
    [title, `/cases/${c.slug}`],
  ]);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      {/* Header */}
      <header className="mx-auto max-w-[960px] px-6 md:px-10 pt-20 md:pt-28 pb-10">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href={`/${locale}/cases`}
            className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)] hover:text-[var(--color-brand-teal)]"
          >
            {t.back}
          </Link>
        </div>

        {c.clientLogo && (
          <div className="mb-6 flex items-center gap-5 h-14 md:h-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/logos/${c.clientLogo}.${c.clientLogoExt ?? "svg"}`}
              alt={`${c.clientLogo} logo`}
              // Pas de .logo-mono ici : on garde la couleur originale du
              // logo client pour signaler le prestige / l'identité visuelle.
              // Le marquee home reste en mono pour la cohérence des 19 logos.
              className="h-full w-auto max-w-[240px] object-contain"
              loading="eager"
            />
            {c.clientLogoSecondary && (
              <>
                <span
                  aria-hidden
                  className="text-2xl md:text-3xl text-[var(--color-muted)] font-light leading-none select-none"
                >
                  ×
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/logos/${c.clientLogoSecondary}.${c.clientLogoSecondaryExt ?? "svg"}`}
                  alt={`${c.clientLogoSecondary} logo`}
                  className="h-full w-auto max-w-[200px] object-contain"
                  loading="eager"
                />
              </>
            )}
          </div>
        )}

        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
          {pick(c.sector, locale)} · {c.geo}
        </p>

        <h1 className="mt-4 font-semibold tracking-[-0.025em] text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.1]">
          {title}
        </h1>

        {c.template && dict.casesCommon && (
          <div className="mt-6 max-w-[720px] border border-[var(--color-muted)]/40 bg-[var(--color-bg-cream)]/40 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
              ⚠ {dict.casesCommon.templateBadge}
            </p>
            <p className="mt-2 text-sm text-[var(--color-ink-soft)] leading-relaxed">
              {dict.casesCommon.templateNote}
            </p>
          </div>
        )}

        <p className="mt-6 text-lg md:text-xl text-[var(--color-ink-soft)] leading-relaxed max-w-[720px]">
          {excerpt}
        </p>

        {/* Fiche */}
        <div className="mt-10 pt-8 border-t border-[var(--color-border)] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {t.kpi}
            </p>
            <p className="mt-2 font-semibold tracking-[-0.02em] text-2xl md:text-3xl text-[var(--color-ink)]">
              {c.kpi.value}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-brand-teal)] mt-1">
              {pick(c.kpi.label, locale)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {t.duration}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              {c.duration}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {t.team}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              {c.teamSize} {t.teamUnit}
            </p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {t.hub}
            </p>
            <p className="mt-2 text-lg font-semibold tracking-tight">
              {c.geo}
            </p>
          </div>
        </div>

        {/* Tech stack */}
        <div className="mt-8 flex flex-wrap gap-2">
          {c.techStack.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 border border-[var(--color-border)] text-[var(--color-ink-soft)]"
            >
              {t}
            </span>
          ))}
        </div>
      </header>

      {/* Body */}
      <section className="mx-auto max-w-[760px] px-6 md:px-10 pb-20">
        <ArticleBlocks blocks={body} />
      </section>

      {/* Related */}
      {relatedFinal.length > 0 && (
        <section className="bg-[var(--color-bg-cream)]/40 border-y border-[var(--color-border)]">
          <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-8">
              {t.related}
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedFinal.map((rc) => (
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
                    <div className="mt-4 flex items-baseline gap-3">
                      <p className="font-semibold tracking-[-0.02em] text-2xl text-[var(--color-ink)]">
                        {rc.kpi.value}
                      </p>
                      <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-brand-teal)]">
                        {pick(rc.kpi.label, locale)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* "Discuter d'un projet similaire" — internal link enrichi vers la
          landing SEO la plus pertinente selon la geo du case (W22 Ticket 2,
          maillage cases -> landings pour booster CTR pages SEO Tokyo).
          Texte d'ancre = phrase naturelle avec mots-cles (pas "cliquez ici"). */}
      <section className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-[760px] px-6 md:px-10 py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3">
            {t.similarLabel}
          </p>
          <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed">
            {t.similarPrefix}{" "}
            <Link
              href={`/${locale}${similarLink.href}`}
              className="text-[var(--color-brand-teal)] underline decoration-[var(--color-brand-teal)]/40 underline-offset-4 hover:decoration-[var(--color-brand-teal)]"
            >
              {similarLink.label[locale]}
            </Link>
            .
          </p>
        </div>
      </section>

      {/* CTA — Calendly partagé pour booker direct (vs /contact qui ajoute
          une étape de saisie de formulaire). Lien externe = nouvel onglet. */}
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
