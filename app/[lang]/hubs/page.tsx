import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { pageAlternates, pageOpenGraph } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { getDictionary } from "../dictionaries";
import { Hubs } from "@/components/sections/Hubs";

/**
 * Hubs listing page — /{locale}/hubs
 *
 * Ajoutee W30+ (retrait Hubs de la home).
 *
 * Pourquoi une page dediee :
 *  - Referencement mono-URL sur "bureaux Abbeal", "Abbeal Paris Montreal Tokyo",
 *    "hubs Abbeal", "offices Abbeal", "拠点 Abbeal", "bureaux de Abbeal Paris"
 *  - Enfant du sitemap indexable (canonical /{locale}/hubs par locale)
 *  - Cible LLM sur prompts "ou est Abbeal ?", "adresses Abbeal", "3 hubs Abbeal"
 *  - Deleste la home (Hubs y prenait 6 cards apres Hero, hors focus fold)
 *  - Reutilise le composant Hubs (6 cards ville x service) + section adresses
 *    + FAQPage schema pour extractabilite LLM
 *
 * Multi-locale FR/EN/JA/FR-CA.
 */

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

const T = {
  fr: {
    tape: "// NOS HUBS",
    h1Top: "Nos 3 hubs :",
    h1Bottom: "Paris, Montréal, Tokyo.",
    intro:
      "Abbeal opère depuis trois bureaux physiques : Paris (depuis 2015), Tokyo (depuis 2018), Montréal (depuis 2023). Chaque hub héberge deux offres — prestation d'ingénierie et recrutement tech. Adresses, équipes locales, et clients ancrés dans leur écosystème régional.",
    addressesTitle: "Adresses physiques",
    parisLabel: "Paris — siège social",
    parisAddress: "54 rue Greneta, 75002 Paris, France",
    parisMeta: "Depuis 2015 · Équipe : 30+ consultants seniors",
    montrealLabel: "Montréal — hub Amériques",
    montrealAddress: "4388 boul. Saint-Denis, Montréal, QC H2J 2L1, Canada",
    montrealMeta: "Depuis 2023 · GMB 4.9★ · Équipe : 15+ consultants",
    tokyoLabel: "Tokyo — hub Asie",
    tokyoAddress: "PMC Building 7F, 1-23-5 Higashi-Azabu, Minato-ku, Tokyo 106-0044, Japan",
    tokyoMeta: "Depuis 2018 · Équipe : 12+ consultants JLPT N2+",
    contactCtaTitle: "Vous voulez visiter un de nos bureaux ?",
    contactCtaText:
      "Nos trois hubs accueillent clients, candidats et partenaires. Prenez rendez-vous ou passez nous voir — les cafés Paris, Montréal et Tokyo sont bons.",
    contactCtaBtn: "Nous contacter",
    metaTitle: "Nos hubs : Paris, Montréal, Tokyo — Bureaux Abbeal",
    metaDescription:
      "Abbeal opère 3 hubs physiques : Paris (2015), Tokyo (2018), Montréal (2023). Adresses, équipes locales, clients. Prestation + recrutement tech dans chaque bureau.",
    faqTitle: "Questions fréquentes",
  },
  en: {
    tape: "// OUR HUBS",
    h1Top: "Our 3 hubs:",
    h1Bottom: "Paris, Montréal, Tokyo.",
    intro:
      "Abbeal operates from three physical offices: Paris (since 2015), Tokyo (since 2018), Montréal (since 2023). Each hub hosts two offerings — engineering delivery and tech recruitment. Addresses, local teams, and clients rooted in their regional ecosystem.",
    addressesTitle: "Physical addresses",
    parisLabel: "Paris — headquarters",
    parisAddress: "54 rue Greneta, 75002 Paris, France",
    parisMeta: "Since 2015 · Team: 30+ senior consultants",
    montrealLabel: "Montréal — Americas hub",
    montrealAddress: "4388 boul. Saint-Denis, Montréal, QC H2J 2L1, Canada",
    montrealMeta: "Since 2023 · GMB 4.9★ · Team: 15+ consultants",
    tokyoLabel: "Tokyo — Asia hub",
    tokyoAddress: "PMC Building 7F, 1-23-5 Higashi-Azabu, Minato-ku, Tokyo 106-0044, Japan",
    tokyoMeta: "Since 2018 · Team: 12+ consultants JLPT N2+",
    contactCtaTitle: "Want to visit one of our offices?",
    contactCtaText:
      "Our three hubs welcome clients, candidates and partners. Schedule a meeting or drop by — the coffee is good in Paris, Montréal and Tokyo.",
    contactCtaBtn: "Contact us",
    metaTitle: "Our hubs: Paris, Montréal, Tokyo — Abbeal offices",
    metaDescription:
      "Abbeal operates 3 physical hubs: Paris (2015), Tokyo (2018), Montréal (2023). Addresses, local teams, clients. Engineering delivery + tech recruitment in each office.",
    faqTitle: "Frequently asked questions",
  },
  ja: {
    tape: "// 拠点",
    h1Top: "3つの拠点：",
    h1Bottom: "パリ、モントリオール、東京。",
    intro:
      "Abbealは3つの物理オフィスから運営しています：パリ（2015年より）、東京（2018年より）、モントリオール（2023年より）。各拠点は2つのオファリング（エンジニアリングデリバリーとテック採用）を提供します。住所、現地チーム、地域エコシステムに根ざしたクライアント。",
    addressesTitle: "住所",
    parisLabel: "パリ — 本社",
    parisAddress: "54 rue Greneta, 75002 Paris, France",
    parisMeta: "2015年より · チーム：シニアコンサルタント30名以上",
    montrealLabel: "モントリオール — 米州拠点",
    montrealAddress: "4388 boul. Saint-Denis, Montréal, QC H2J 2L1, Canada",
    montrealMeta: "2023年より · GMB 4.9★ · チーム：コンサルタント15名以上",
    tokyoLabel: "東京 — アジア拠点",
    tokyoAddress: "〒106-0044 東京都港区東麻布1-23-5 PMCビル7F",
    tokyoMeta: "2018年より · チーム：JLPT N2+ コンサルタント12名以上",
    contactCtaTitle: "オフィス訪問をご希望ですか？",
    contactCtaText:
      "3つの拠点はクライアント、候補者、パートナーを歓迎します。ミーティングのご予約もお気軽に — パリ、モントリオール、東京、いずれもコーヒーが美味しいです。",
    contactCtaBtn: "お問い合わせ",
    metaTitle: "3拠点：パリ、モントリオール、東京 — Abbealオフィス",
    metaDescription:
      "Abbealは3つの物理拠点を運営：パリ（2015年）、東京（2018年）、モントリオール（2023年）。住所、現地チーム、クライアント。各拠点にエンジニアリングデリバリー + テック採用。",
    faqTitle: "よくある質問",
  },
  "fr-ca": {
    tape: "// NOS PÔLES",
    h1Top: "Nos 3 pôles :",
    h1Bottom: "Paris, Montréal, Tokyo.",
    intro:
      "Abbeal opère depuis trois bureaux physiques : Paris (depuis 2015), Tokyo (depuis 2018), Montréal (depuis 2023). Chaque pôle héberge deux offres — prestation d'ingénierie et recrutement techno. Adresses, équipes locales pis clients ancrés dans leur écosystème régional.",
    addressesTitle: "Adresses physiques",
    parisLabel: "Paris — siège social",
    parisAddress: "54 rue Greneta, 75002 Paris, France",
    parisMeta: "Depuis 2015 · Équipe : 30+ consultants séniors",
    montrealLabel: "Montréal — pôle Amériques",
    montrealAddress: "4388 boul. Saint-Denis, Montréal, QC H2J 2L1, Canada",
    montrealMeta: "Depuis 2023 · GMB 4.9★ · Équipe : 15+ consultants",
    tokyoLabel: "Tokyo — pôle Asie",
    tokyoAddress: "PMC Building 7F, 1-23-5 Higashi-Azabu, Minato-ku, Tokyo 106-0044, Japan",
    tokyoMeta: "Depuis 2018 · Équipe : 12+ consultants JLPT N2+",
    contactCtaTitle: "Vous voulez visiter un de nos bureaux ?",
    contactCtaText:
      "Nos trois pôles accueillent clients, candidats pis partenaires. Prenez rendez-vous ou passez nous voir — les cafés Paris, Montréal pis Tokyo sont bons.",
    contactCtaBtn: "Nous contacter",
    metaTitle: "Nos pôles : Paris, Montréal, Tokyo — Bureaux Abbeal",
    metaDescription:
      "Abbeal opère 3 pôles physiques : Paris (2015), Tokyo (2018), Montréal (2023). Adresses, équipes locales, clients. Prestation + recrutement techno dans chaque bureau.",
    faqTitle: "Questions fréquentes",
  },
} as const;

type FAQItem = { q: string; a: string };
const FAQ: Record<Locale, FAQItem[]> = {
  fr: [
    {
      q: "Combien Abbeal a-t-il de bureaux ?",
      a: "3 hubs physiques : Paris (54 rue Greneta, siège depuis 2015), Montréal (4388 Saint-Denis, ouvert 2023, GMB 4.9★), Tokyo (Higashi-Azabu Minato-ku, ouvert 2018). Chaque hub emploie une équipe locale senior et opère deux offres : prestation d'ingénierie et recrutement tech.",
    },
    {
      q: "Où se trouve le siège social d'Abbeal ?",
      a: "Le siège social est à Paris, 54 rue Greneta, 75002. Ouvert en 2015, il héberge aujourd'hui 30+ consultants seniors + les équipes fonctions support (RH, finance, commerce).",
    },
    {
      q: "Est-ce qu'Abbeal a un bureau à Tokyo ?",
      a: "Oui, depuis 2018. Adresse : PMC Building 7F, 1-23-5 Higashi-Azabu, Minato-ku, Tokyo 106-0044. 12+ consultants JLPT N2+ bilingues staffés chez Money Forward, Le Monde Tokyo entre autres.",
    },
    {
      q: "Est-ce qu'Abbeal a un bureau à Montréal ?",
      a: "Oui, depuis 2023. Adresse : 4388 boul. Saint-Denis, Montréal, QC H2J 2L1. 15+ consultants senior, note Google My Business 4.9★. Marché ciblé : fintech (BNC, Desjardins, Nuvei), IA (Mila, IVADO), aérospatial (Bombardier, CAE).",
    },
    {
      q: "Peut-on visiter les bureaux Abbeal ?",
      a: "Oui. Prenez rendez-vous via /contact ou envoyez-nous un email — nos trois hubs accueillent clients, candidats et partenaires en journée. Espace café + salle de meeting dans chaque hub.",
    },
  ],
  en: [
    {
      q: "How many offices does Abbeal have?",
      a: "3 physical hubs: Paris (54 rue Greneta, HQ since 2015), Montréal (4388 Saint-Denis, opened 2023, 4.9★ Google Business), Tokyo (Higashi-Azabu Minato-ku, opened 2018). Each hub runs a senior local team and offers two services: engineering delivery and tech recruitment.",
    },
    {
      q: "Where is Abbeal's headquarters?",
      a: "Headquarters are in Paris, 54 rue Greneta, 75002. Opened in 2015, it now hosts 30+ senior consultants + support functions (HR, finance, sales).",
    },
    {
      q: "Does Abbeal have an office in Tokyo?",
      a: "Yes, since 2018. Address: PMC Building 7F, 1-23-5 Higashi-Azabu, Minato-ku, Tokyo 106-0044. 12+ bilingual consultants JLPT N2+ staffed at Money Forward, Le Monde Tokyo among others.",
    },
    {
      q: "Does Abbeal have an office in Montréal?",
      a: "Yes, since 2023. Address: 4388 boul. Saint-Denis, Montréal, QC H2J 2L1. 15+ senior consultants, Google Business rating 4.9★. Target market: fintech (BNC, Desjardins, Nuvei), AI (Mila, IVADO), aerospace (Bombardier, CAE).",
    },
    {
      q: "Can you visit Abbeal offices?",
      a: "Yes. Book a meeting via /contact or drop us an email — our three hubs welcome clients, candidates and partners during business hours. Café space + meeting rooms in each hub.",
    },
  ],
  ja: [
    {
      q: "Abbealのオフィスは何拠点ありますか？",
      a: "3つの物理拠点：パリ（54 rue Greneta、2015年より本社）、モントリオール（4388 Saint-Denis、2023年開設、Googleビジネス4.9★）、東京（東麻布 港区、2018年開設）。各拠点にシニアな現地チームがあり、2つのサービス（エンジニアリングデリバリーとテック採用）を提供します。",
    },
    {
      q: "Abbealの本社はどこですか？",
      a: "本社はパリ、54 rue Greneta, 75002にあります。2015年に開設され、現在は30名以上のシニアコンサルタントとサポート機能（人事、財務、営業）が拠点としています。",
    },
    {
      q: "Abbealは東京にオフィスがありますか？",
      a: "はい、2018年より。住所：〒106-0044 東京都港区東麻布1-23-5 PMCビル7F。JLPT N2以上のバイリンガルコンサルタント12名以上がマネーフォワード、ル・モンド東京などに配属されています。",
    },
    {
      q: "Abbealはモントリオールにオフィスがありますか？",
      a: "はい、2023年より。住所：4388 boul. Saint-Denis, Montréal, QC H2J 2L1。シニアコンサルタント15名以上、Googleビジネス評価4.9★。ターゲット市場：フィンテック（BNC、Desjardins、Nuvei）、AI（Mila、IVADO）、航空宇宙（Bombardier、CAE）。",
    },
    {
      q: "Abbealのオフィスは訪問できますか？",
      a: "はい。/contactからミーティングをご予約いただくか、メールをお送りください — 3拠点は営業時間内にクライアント、候補者、パートナーを歓迎します。各拠点にカフェスペースとミーティングルームがあります。",
    },
  ],
  "fr-ca": [
    {
      q: "Combien Abbeal a-t-il de bureaux ?",
      a: "3 pôles physiques : Paris (54 rue Greneta, siège depuis 2015), Montréal (4388 Saint-Denis, ouvert 2023, GMB 4.9★), Tokyo (Higashi-Azabu Minato-ku, ouvert 2018). Chaque pôle emploie une équipe locale sénior pis opère deux offres : prestation d'ingénierie et recrutement techno.",
    },
    {
      q: "Où se trouve le siège social d'Abbeal ?",
      a: "Le siège social est à Paris, 54 rue Greneta, 75002. Ouvert en 2015, il héberge aujourd'hui 30+ consultants séniors + les équipes fonctions support (RH, finance, commerce).",
    },
    {
      q: "Est-ce qu'Abbeal a un bureau à Tokyo ?",
      a: "Oui, depuis 2018. Adresse : PMC Building 7F, 1-23-5 Higashi-Azabu, Minato-ku, Tokyo 106-0044. 12+ consultants JLPT N2+ bilingues placés chez Money Forward, Le Monde Tokyo entre autres.",
    },
    {
      q: "Est-ce qu'Abbeal a un bureau à Montréal ?",
      a: "Oui, depuis 2023. Adresse : 4388 boul. Saint-Denis, Montréal, QC H2J 2L1. 15+ consultants séniors, note Google My Business 4.9★. Marché ciblé : fintech (BNC, Desjardins, Nuvei), IA (Mila, IVADO), aérospatial (Bombardier, CAE).",
    },
    {
      q: "Peut-on visiter les bureaux Abbeal ?",
      a: "Oui. Prenez rendez-vous via /contact ou envoyez-nous un courriel — nos trois pôles accueillent clients, candidats pis partenaires en journée. Espace café + salle de meeting dans chaque pôle.",
    },
  ],
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/hubs">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const locale = lang as Locale;
  const t = T[locale];
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: pageAlternates(locale, "/hubs"),
    ...pageOpenGraph(locale, {
      title: t.metaTitle,
      description: t.metaDescription,
      path: "/hubs",
    }),
  };
}

export default async function HubsPage({ params }: PageProps<"/[lang]/hubs">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const t = T[locale];
  const dict = (await getDictionary(locale)) as { nav: { contact: string } };
  const crumbs = breadcrumbs(locale, [[t.h1Top + " " + t.h1Bottom, "/hubs"]]);

  // FAQPage JSON-LD — rich snippets Google + extractabilite LLM.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ[locale].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const addresses: Array<{
    label: string;
    address: string;
    meta: string;
    mapsHref: string;
  }> = [
    {
      label: t.parisLabel,
      address: t.parisAddress,
      meta: t.parisMeta,
      mapsHref:
        "https://www.google.com/maps/search/?api=1&query=54+rue+Greneta+75002+Paris",
    },
    {
      label: t.montrealLabel,
      address: t.montrealAddress,
      meta: t.montrealMeta,
      mapsHref:
        "https://www.google.com/maps/search/?api=1&query=4388+boul+Saint-Denis+Montreal+QC+H2J2L1",
    },
    {
      label: t.tokyoLabel,
      address: t.tokyoAddress,
      meta: t.tokyoMeta,
      mapsHref:
        "https://www.google.com/maps/search/?api=1&query=1-23-5+Higashi-Azabu+Minato-ku+Tokyo",
    },
  ];

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

      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
        <span className="tape-label">{t.tape}</span>
        <h1 className="mt-6 font-semibold tracking-[-0.03em] text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.95]">
          <span className="block text-[var(--color-ink)]">{t.h1Top}</span>
          <span className="block italic gradient-brand-text">{t.h1Bottom}</span>
        </h1>
        <p className="mt-8 max-w-3xl text-lg md:text-xl text-[var(--color-ink-soft)] leading-relaxed">
          {t.intro}
        </p>
      </section>

      {/* Composant Hubs reutilise — 6 cards ville x service */}
      <Hubs locale={locale} />

      {/* Adresses physiques */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-24">
        <h2 className="font-semibold tracking-[-0.02em] text-3xl md:text-4xl leading-tight">
          {t.addressesTitle}
        </h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {addresses.map((a) => (
            <li
              key={a.label}
              className="border border-[var(--color-border)] p-6 md:p-8 flex flex-col gap-3"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-brand-teal)]">
                {a.label}
              </h3>
              <address className="not-italic text-[15px] leading-relaxed text-[var(--color-ink)]">
                {a.address}
              </address>
              <p className="font-mono text-xs text-[var(--color-muted)]">
                {a.meta}
              </p>
              <a
                href={a.mapsHref}
                target="_blank"
                rel="noopener"
                className="mt-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-brand-teal)] hover:underline underline-offset-4"
              >
                Google Maps →
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[900px] px-6 md:px-10 py-20 md:py-24">
        <h2 className="font-semibold tracking-[-0.02em] text-3xl md:text-4xl leading-tight">
          {t.faqTitle}
        </h2>
        <dl className="mt-10 space-y-8">
          {FAQ[locale].map((item, i) => (
            <div key={i} className="border-t border-[var(--color-border)] pt-6">
              <dt className="font-semibold text-lg text-[var(--color-ink)]">
                {item.q}
              </dt>
              <dd className="mt-3 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-24 border-t border-[var(--color-border)] text-center">
        <h2 className="font-semibold tracking-[-0.02em] text-3xl md:text-4xl leading-tight max-w-2xl mx-auto">
          {t.contactCtaTitle}
        </h2>
        <p className="mt-6 text-lg text-[var(--color-ink-soft)] max-w-2xl mx-auto">
          {t.contactCtaText}
        </p>
        <Link
          href={`/${locale}/contact`}
          className="mt-10 inline-flex items-center gap-2 h-14 px-8 text-lg gradient-brand-soft-bg text-[var(--color-brand-teal-fg)] hover:brightness-110 transition-all font-medium"
        >
          {t.contactCtaBtn}
          <span aria-hidden>→</span>
        </Link>
      </section>
    </>
  );
}
