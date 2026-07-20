import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { services } from "@/lib/services";
import { pick } from "@/lib/articles";
import { pageAlternates, pageOpenGraph } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { getDictionary } from "../dictionaries";
import { Hubs } from "@/components/sections/Hubs";

/**
 * Services listing hub — /{locale}/services
 *
 * Ajoute W29 : /services etait 404 (le lien Header pointait sur ancre
 * home #services). Cette page :
 *  - Fixe le 404 sur une URL demandee (visitors qui coupent
 *    /services/detail-slug remontent au hub)
 *  - Sert de landing SEO sur "services tech Abbeal" et queries hub
 *  - OfferCatalog JSON-LD explicite pour LLMs (Perplexity/ChatGPT
 *    surfacent les entreprises avec Offer/Service schema).
 *
 * Multi-locale FR/EN/JA/FR-CA (aligne avec les detail pages).
 */

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const T = {
  fr: {
    title: "Services d'ingénierie tech",
    subtitle:
      "Trois façons de collaborer avec Abbeal, calibrées selon le niveau d'ownership que vous voulez garder — du staff augmentation senior au delivery clé en main output-based.",
    cta: "Découvrir",
    intro:
      "On intervient là où le risque technique est élevé et où la vitesse compte. Software, IA, Data, Robotique. Depuis Paris, Montréal et Tokyo, en synchronie ou en Adaptive Follow-the-Sun quand vous voulez du 24/7.",
    contactCtaTitle: "Vous ne savez pas lequel choisir ?",
    contactCtaText:
      "Cadrage gratuit 30 min avec un Tech Lead senior Abbeal (pas un commercial). On identifie ensemble le bon format pour votre projet.",
    contactCtaBtn: "Parler à un Tech Lead",
    metaTitle:
      "Services Abbeal — Squads seniors, recrutement tech, delivery clé en main",
    metaDescription:
      "3 façons de collaborer avec Abbeal : staff augmentation seniors, recrutement tech top 1 %, delivery clé en main output-based. Paris · Montréal · Tokyo.",
  },
  en: {
    title: "Tech engineering services",
    subtitle:
      "Three ways to collaborate with Abbeal, calibrated to the level of ownership you want to keep — from senior staff augmentation to output-based turnkey delivery.",
    cta: "Discover",
    intro:
      "We step in where technical risk is high and speed matters. Software, AI, Data, Robotics. From Paris, Montréal and Tokyo, in sync or via Adaptive Follow-the-Sun when you want 24/7.",
    contactCtaTitle: "Not sure which one fits?",
    contactCtaText:
      "Free 30-min scoping call with a senior Abbeal Tech Lead (not a sales rep). We'll identify together the right format for your project.",
    contactCtaBtn: "Talk to a Tech Lead",
    metaTitle:
      "Abbeal services — Senior squads, tech recruitment, turnkey delivery",
    metaDescription:
      "3 ways to collaborate with Abbeal: senior staff augmentation, top 1% tech recruitment, output-based turnkey delivery. Paris · Montréal · Tokyo.",
  },
  ja: {
    title: "テックエンジニアリングサービス",
    subtitle:
      "Abbealとの協業方法は3つ、お客様が保持したいオーナーシップのレベルに応じて選択いただけます — シニアスタッフ拡張から成果ベースのターンキー納品まで。",
    cta: "詳細を見る",
    intro:
      "技術的リスクが高く、スピードが重要な領域に参画します。ソフトウェア、AI、データ、ロボティクス。パリ、モントリオール、東京から、同期モードまたは24/7が必要な場合はAdaptive Follow-the-Sunで対応します。",
    contactCtaTitle: "どれを選ぶべきか迷っている？",
    contactCtaText:
      "Abbealのシニアテックリード（営業担当ではありません）による無料30分スコーピングコール。プロジェクトに最適なフォーマットを一緒に特定します。",
    contactCtaBtn: "テックリードに相談",
    metaTitle:
      "Abbealサービス — シニアスクワッド、テック採用、ターンキー納品",
    metaDescription:
      "Abbealとの3つの協業方法：シニアスタッフ拡張、トップ1%テック採用、成果ベースのターンキー納品。パリ・モントリオール・東京。",
  },
  "fr-ca": {
    title: "Services d'ingénierie techno",
    subtitle:
      "Trois façons de collaborer avec Abbeal, calibrées selon le niveau de propriété que vous voulez garder — du renforcement d'équipe sénior à la livraison clé en main basée sur les résultats.",
    cta: "Découvrir",
    intro:
      "On intervient là où le risque techno est élevé et où la vitesse compte. Logiciel, IA, Données, Robotique. Depuis Paris, Montréal pis Tokyo, en synchronie ou en Adaptive Follow-the-Sun quand vous voulez du 24/7.",
    contactCtaTitle: "Vous ne savez pas lequel choisir ?",
    contactCtaText:
      "Cadrage gratuit 30 min avec un Tech Lead sénior Abbeal (pas un représentant). On identifie ensemble le bon format pour votre projet.",
    contactCtaBtn: "Parler à un Tech Lead",
    metaTitle:
      "Services Abbeal — Squads séniors, recrutement techno, livraison clé en main",
    metaDescription:
      "3 façons de collaborer avec Abbeal : renforcement d'équipe séniors, recrutement techno top 1 %, livraison clé en main basée résultats. Paris · Montréal · Tokyo.",
  },
} as const;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const locale = lang as Locale;
  const t = T[locale];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: pageAlternates(locale, "/services"),
    ...pageOpenGraph(locale, {
      title: t.metaTitle,
      description: t.metaDescription,
      path: "/services",
    }),
  };
}

export default async function ServicesListingPage({
  params,
}: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const t = T[locale];
  const dict = (await getDictionary(locale)) as { nav: { services: string } };

  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const crumbs = breadcrumbs(locale, [[dict.nav.services, "/services"]]);

  // OfferCatalog JSON-LD — signal LLM que les 3 services sont
  // les prestations de reference. Chaque Offer contient itemOffered=Service
  // avec URL vers la detail page pour maillage machine-readable.
  const offerCatalogLd = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "@id": `${SITE}/${locale}/services`,
    name: t.metaTitle,
    description: t.metaDescription,
    itemListElement: services.map((s, i) => ({
      "@type": "Offer",
      position: i + 1,
      itemOffered: {
        "@type": "Service",
        "@id": `${SITE}/${locale}/services/${s.slug}`,
        name: pick(s.title, locale),
        description: pick(s.hookline, locale),
        url: `${SITE}/${locale}/services/${s.slug}`,
        provider: { "@type": "Organization", "@id": `${SITE}#organization` },
      },
    })),
  };

  return (
    <section className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      {/* Hero */}
      <div className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
          // {dict.nav.services}
        </p>
        <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
          {t.title}
        </h1>
        <p className="mt-8 text-xl text-[var(--color-ink-soft)] leading-relaxed">
          {t.subtitle}
        </p>
        <p className="mt-6 text-base text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
          {t.intro}
        </p>
      </div>

      {/* Grid 3 services */}
      <div className="mt-20 grid gap-6 md:grid-cols-3">
        {services.map((s) => {
          const title = pick(s.title, locale);
          const subtitle = pick(s.subtitle, locale);
          const hookline = pick(s.hookline, locale);
          return (
            <Link
              key={s.slug}
              href={`/${locale}/services/${s.slug}`}
              className="group flex flex-col justify-between rounded-md border border-[var(--color-border)] p-8 hover:border-[var(--color-brand-teal)] transition-colors bg-[var(--color-bg-paper)]"
            >
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
                  {s.number} · {subtitle}
                </p>
                <h2 className="mt-4 font-semibold text-2xl tracking-[-0.02em] group-hover:text-[var(--color-brand-teal)] transition-colors">
                  {title}
                </h2>
                <p className="mt-4 text-base text-[var(--color-ink-soft)] leading-relaxed">
                  {hookline}
                </p>
                <p className="mt-6 font-mono text-xs text-[var(--color-muted)]">
                  {s.duration}
                </p>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-[var(--color-brand-teal)]">
                {t.cta}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
                >
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* W30+ Section C : maillage vers 6 pages ville x service */}
      <Hubs locale={locale} />

      {/* CTA final */}
      <section className="mt-24 pt-16 border-t border-[var(--color-border)] text-center">
        <h2 className="font-semibold tracking-[-0.02em] text-3xl md:text-4xl leading-tight max-w-2xl mx-auto">
          {t.contactCtaTitle}
        </h2>
        <p className="mt-6 text-lg text-[var(--color-ink-soft)] max-w-2xl mx-auto">
          {t.contactCtaText}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="mt-10 inline-flex items-center gap-2 h-12 px-8 text-base gradient-brand-soft-bg text-[var(--color-brand-teal-fg)] hover:brightness-110 transition-all font-medium"
        >
          {t.contactCtaBtn}
          <span aria-hidden>→</span>
        </Link>
      </section>
    </section>
  );
}
