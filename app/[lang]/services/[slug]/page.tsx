import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { services, getService } from "@/lib/services";
import { pick } from "@/lib/articles";
import { getCase } from "@/lib/cases";
import { pageAlternates } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";

export async function generateStaticParams() {
  return locales.flatMap((lang) =>
    services.map((s) => ({ lang, slug: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const s = getService(slug);
  if (!s) return { title: "Service introuvable · Abbeal" };
  const locale = lang as Locale;
  return {
    title: `${pick(s.title, locale)} · Abbeal`,
    description: pick(s.hookline, locale),
    alternates: pageAlternates(locale, `/services/${slug}`),
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const s = getService(slug);
  if (!s) notFound();

  const title = pick(s.title, locale);
  const subtitle = pick(s.subtitle, locale);
  const hookline = pick(s.hookline, locale);
  const audience = pick(s.audience, locale);
  const concretes = pick(s.concretes, locale);
  const method = pick(s.method, locale);
  const deliverables = pick(s.deliverables, locale);
  const kpis = pick(s.kpis, locale);
  const faq = pick(s.faq, locale);

  const relatedCases = s.relatedCaseSlugs
    .map((cs) => getCase(cs))
    .filter((c): c is NonNullable<typeof c> => !!c);

  // schema.org Service + FAQPage for rich results + LLM parse
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE}/${locale}/services/${s.slug}`,
    name: title,
    description: hookline,
    serviceType: subtitle,
    category: "Software Engineering",
    provider: {
      "@type": "ProfessionalService",
      name: "Abbeal",
      url: SITE,
      logo: `${SITE}/brand/wordmark-teal.png`,
      slogan: "La Tech qu'on aurait aimé trouver. On l'a fondée.",
    },
    areaServed: [
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Japan" },
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE}/${locale}/contact`,
      servicePhone: { "@type": "ContactPoint", contactType: "sales" },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${title} — deliverables`,
      itemListElement: pick(s.deliverables, locale).map((d, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: { "@type": "Service", name: d },
      })),
    },
    mainEntityOfPage: `${SITE}/${locale}/services/${s.slug}`,
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // Breadcrumb: Home → Services (home anchor) → Service title
  const servicesLabel =
    locale === "fr" ? "Services" : locale === "ja" ? "サービス" : "Services";
  const crumbs = breadcrumbs(locale, [
    [servicesLabel, "#services"],
    [title, `/services/${s.slug}`],
  ]);

  const t = {
    fr: {
      back: "← Services",
      audience: "Pour qui",
      concretes: "Ce qu'on fait concrètement",
      method: "Méthode",
      deliverables: "Livrables",
      kpis: "KPIs attendus",
      techStack: "Domaines / stack",
      faq: "FAQ",
      related: "Cas clients liés",
      ctaTitle: "Un périmètre comme ça ?",
      ctaBtn: "Parler à un architecte",
      duration: "Durée",
    },
    en: {
      back: "← Services",
      audience: "Who it's for",
      concretes: "What we actually do",
      method: "Method",
      deliverables: "Deliverables",
      kpis: "Expected KPIs",
      techStack: "Scope / stack",
      faq: "FAQ",
      related: "Related case studies",
      ctaTitle: "A scope like this?",
      ctaBtn: "Talk to an architect",
      duration: "Duration",
    },
    ja: {
      back: "← サービス",
      audience: "対象",
      concretes: "具体的にやること",
      method: "手法",
      deliverables: "成果物",
      kpis: "期待KPI",
      techStack: "範囲・スタック",
      faq: "FAQ",
      related: "関連ケース",
      ctaTitle: "似たようなスコープがある？",
      ctaBtn: "アーキテクトと話す",
      duration: "期間",
    },
    "fr-ca": {
      back: "← Services",
      audience: "Pour qui",
      concretes: "Ce qu'on fait concrètement",
      method: "Méthode",
      deliverables: "Livrables",
      kpis: "Indicateurs attendus",
      techStack: "Domaines / pile",
      faq: "FAQ",
      related: "Cas clients liés",
      ctaTitle: "Un périmètre comme ça ?",
      ctaBtn: "Parler à un architecte",
      duration: "Durée",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      {/* Hero */}
      <header className="bg-[var(--color-ink)] text-[var(--color-bg-light)] border-b border-[var(--color-bg-light)]/10">
        <div className="mx-auto max-w-[1200px] px-6 md:px-10 pt-16 md:pt-24 pb-16 md:pb-20">
          <div className="flex items-center gap-3 mb-8">
            <Link
              href={`/${locale}#services`}
              className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-bg-light)]/60 hover:text-[var(--color-brand-teal)]"
            >
              {t.back}
            </Link>
          </div>

          <div className="flex items-baseline justify-between gap-6">
            <span className="font-mono text-xs tracking-widest text-[var(--color-bg-light)]/50">
              // {s.number}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
              {subtitle}
            </span>
          </div>

          <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] max-w-3xl">
            {title}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-[var(--color-bg-light)]/75 leading-relaxed max-w-2xl">
            {hookline}
          </p>

          {/* KPI strip */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-[var(--color-bg-light)]/15 pt-10">
            {kpis.map((k, i) => (
              <div key={i}>
                <p className="font-semibold tracking-[-0.02em] text-3xl md:text-4xl">
                  {k.value}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[var(--color-brand-teal)]">
                  {k.label}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 font-mono text-[11px] uppercase tracking-wider text-[var(--color-bg-light)]/50">
            {t.duration} · {s.duration}
          </p>
        </div>
      </header>

      {/* Audience + Concretes */}
      <section className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
            {t.audience}
          </p>
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight">
            {t.audience}
          </h2>
          <ul className="mt-6 space-y-3">
            {audience.map((a, i) => (
              <li key={i} className="flex gap-3 items-start text-[17px] leading-[1.55] text-[var(--color-ink)]">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[var(--color-brand-teal)] shrink-0" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
            {t.concretes}
          </p>
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight">
            {t.concretes}
          </h2>
          <ul className="mt-6 space-y-3">
            {concretes.map((c, i) => (
              <li key={i} className="flex gap-3 items-start text-[17px] leading-[1.55] text-[var(--color-ink)]">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[var(--color-brand-teal)] shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Method */}
      <section className="bg-[var(--color-bg-cream)]/40 border-y border-[var(--color-border)]">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
            {t.method}
          </p>
          <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-[-0.02em] leading-tight">
            {t.method}
          </h2>
          <ol className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {method.map((step, i) => (
              <li
                key={i}
                className="relative border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-6"
              >
                <span className="font-mono text-xs tracking-widest text-[var(--color-muted)]">
                  // {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  {step.step}
                </h3>
                <p className="mt-3 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Deliverables + Tech */}
      <section className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
            {t.deliverables}
          </p>
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight">
            {t.deliverables}
          </h2>
          <ul className="mt-6 space-y-3">
            {deliverables.map((d, i) => (
              <li key={i} className="flex gap-3 items-start text-[17px] leading-[1.55] text-[var(--color-ink)]">
                <span aria-hidden className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[var(--color-brand-teal)] shrink-0" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
            {t.techStack}
          </p>
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-[-0.02em] leading-tight">
            {t.techStack}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {s.techStack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[12px] uppercase tracking-wider px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-ink-soft)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Related cases */}
      {relatedCases.length > 0 && (
        <section className="bg-[var(--color-bg-cream)]/40 border-y border-[var(--color-border)]">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-24">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
              {t.related}
            </p>
            <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-[-0.02em] leading-tight">
              {t.related}
            </h2>
            <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedCases.map((rc) => (
                <li key={rc.slug}>
                  <Link
                    href={`/${locale}/cases/${rc.slug}`}
                    className="group block h-full border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-6 hover:border-[var(--color-brand-teal)] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
                        {pick(rc.sector, locale)}
                      </p>
                      <p className="font-semibold tracking-[-0.02em] text-2xl text-[var(--color-ink)] leading-none">
                        {rc.kpi.value}
                      </p>
                    </div>
                    <h3 className="mt-3 text-base font-semibold tracking-tight leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors">
                      {pick(rc.title, locale)}
                    </h3>
                    <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                      {rc.geo} · {rc.duration}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mx-auto max-w-[900px] px-6 md:px-10 py-20 md:py-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
          {t.faq}
        </p>
        <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-[-0.02em] leading-tight">
          {t.faq}
        </h2>
        <dl className="mt-10 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {faq.map((f, i) => (
            <div key={i} className="py-6">
              <dt className="text-lg md:text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                {f.q}
              </dt>
              <dd className="mt-3 text-[16px] text-[var(--color-ink-soft)] leading-relaxed">
                {f.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA */}
      <section className="bg-[var(--color-ink)] text-[var(--color-bg-light)]">
        <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-16 md:py-20 text-center">
          <h2 className="font-semibold tracking-[-0.02em] text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight max-w-2xl mx-auto">
            {t.ctaTitle}
          </h2>
          <Link
            href={`/${locale}/contact`}
            className="mt-8 inline-flex items-center gap-2 h-12 px-6 text-base gradient-brand-soft-bg text-[var(--color-brand-teal-fg)] hover:brightness-110 transition-all font-medium"
          >
            {t.ctaBtn}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </article>
  );
}
