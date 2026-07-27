import Link from "next/link";
import type { Locale } from "@/lib/i18n";

/**
 * Hubs section — 6 cellules ville × service (audit Cowork W30+ Section C).
 *
 * Pourquoi ce composant :
 *  Les pages fortes (home pos 2-7, about pos 3.4, careers pos 5.6, contact
 *  pos 2.7) concentrent l'autorite Google. Il faut router vers les 6 pages
 *  ville qui rankent mal (Montreal presta pos 27.5, Paris presta pos 61,
 *  recrutement Paris/Montreal 404 avant PR #96). Un bloc dedie avec ancres
 *  exactes = transfert d'autorite maximal.
 *
 * Server component pur (SEO-friendly, zero JS hydratation).
 * Utilise sur : home /{locale}, /services, /careers, /about.
 *
 * Design : 2 rangees x 3 colonnes desktop (1 col mobile). Chaque card
 * porte une ancre exacte matchant les intents de la landing cible.
 */

type Labels = {
  tape: string;
  title: string;
  subtitle: string;
  // Card labels
  parisPrestaTitle: string;
  parisPrestaDesc: string;
  parisRecrutTitle: string;
  parisRecrutDesc: string;
  montrealPrestaTitle: string;
  montrealPrestaDesc: string;
  montrealRecrutTitle: string;
  montrealRecrutDesc: string;
  tokyoPrestaTitle: string;
  tokyoPrestaDesc: string;
  tokyoRecrutTitle: string;
  tokyoRecrutDesc: string;
  ctaVerb: string;
};

const T: Record<Locale, Labels> = {
  fr: {
    tape: "// NOS HUBS · PARIS · MONTRÉAL · TOKYO",
    title: "3 hubs physiques, 6 façons de collaborer.",
    subtitle:
      "Chaque bureau opère 2 services : prestation (squads embarqués, delivery) et recrutement (CDI, freelance). Cliquez sur votre ville et votre besoin pour aller directement à la bonne page.",
    parisPrestaTitle: "Entreprise de développement informatique à Paris",
    parisPrestaDesc: "ESN & squads seniors pour banques, assureurs, retail, souveraineté (SecNumCloud/HDS/DORA). 54 rue Greneta, depuis 2015.",
    parisRecrutTitle: "Recrutement tech à Paris",
    parisRecrutDesc: "Cabinet spécialisé profils seniors. Sourcing ingénieur-led, closing 48h, garantie 6 mois. Couverture France entière.",
    montrealPrestaTitle: "Entreprise de développement informatique à Montréal",
    montrealPrestaDesc: "Consultation TI, cabinet conseil, delivery clé en main. 4388 Saint-Denis, depuis 2023. GMB 4.9★.",
    montrealRecrutTitle: "Recrutement tech à Montréal",
    montrealRecrutDesc: "Cabinet recrutement senior québécois. 3-5 semaines vs 10-16 en canaux classiques. Loi 25 native.",
    tokyoPrestaTitle: "Tech consulting Tokyo & IT staffing Japan",
    tokyoPrestaDesc: "ESN française à Tokyo. Consultants JLPT N2+ bilingues. Money Forward, Le Monde. Higashi-Azabu depuis 2018.",
    tokyoRecrutTitle: "Engineering jobs & tech recruitment Tokyo",
    tokyoRecrutDesc: "Recrutement tech Japon + programme Mobbeal (visa, logement, famille). 50+ engineers déjà installés.",
    ctaVerb: "Découvrir",
  },
  en: {
    tape: "// OUR HUBS · PARIS · MONTRÉAL · TOKYO",
    title: "3 physical hubs, 6 ways to collaborate.",
    subtitle:
      "Each office operates 2 services: consulting (embedded squads, delivery) and recruitment (permanent, freelance). Click your city and your need to go directly to the right page.",
    parisPrestaTitle: "Software development company in Paris",
    parisPrestaDesc: "Senior firm & squads for banking, insurance, retail, sovereignty (SecNumCloud/HDS/DORA). 54 rue Greneta, since 2015.",
    parisRecrutTitle: "Tech recruitment in Paris",
    parisRecrutDesc: "Specialised senior recruitment firm. Engineer-led sourcing, 48h closing, 6-month guarantee. France-wide coverage.",
    montrealPrestaTitle: "Software development company in Montréal",
    montrealPrestaDesc: "IT consulting, advisory firm, turnkey delivery. 4388 Saint-Denis, since 2023. GMB 4.9★.",
    montrealRecrutTitle: "Tech recruitment in Montréal",
    montrealRecrutDesc: "Senior Québec recruitment firm. 3-5 weeks vs 10-16 through standard channels. Loi 25 native.",
    tokyoPrestaTitle: "Tech consulting Tokyo & IT staffing Japan",
    tokyoPrestaDesc: "French firm in Tokyo. JLPT N2+ bilingual consultants. Money Forward, Le Monde. Higashi-Azabu since 2018.",
    tokyoRecrutTitle: "Engineering jobs & tech recruitment Tokyo",
    tokyoRecrutDesc: "Tech recruitment in Japan + Mobbeal relocation programme (visa, housing, family). 50+ engineers already relocated.",
    ctaVerb: "Discover",
  },
  ja: {
    tape: "// 3つの拠点 · パリ · モントリオール · 東京",
    title: "3つの物理拠点、6つの協業方法。",
    subtitle:
      "各オフィスは2つのサービスを運営：コンサルティング（組み込みスクワッド、デリバリー）と採用（正社員、フリーランス）。都市とニーズを選択して該当ページに直接アクセス。",
    parisPrestaTitle: "パリのソフトウェア開発会社",
    parisPrestaDesc: "銀行、保険、小売、主権クラウド（SecNumCloud/HDS/DORA）向けシニアファーム。54 rue Greneta、2015年から。",
    parisRecrutTitle: "パリのテック採用",
    parisRecrutDesc: "シニア専門採用ファーム。エンジニアによるソーシング、48時間クロージング、6ヶ月保証。フランス全域対応。",
    montrealPrestaTitle: "モントリオールのソフトウェア開発会社",
    montrealPrestaDesc: "ITコンサルティング、コンサルティングファーム、ターンキー納品。4388 Saint-Denis、2023年から。GMB 4.9★。",
    montrealRecrutTitle: "モントリオールのテック採用",
    montrealRecrutDesc: "シニアケベック採用ファーム。従来チャネルの10-16週間に対し3-5週間。Loi 25対応。",
    tokyoPrestaTitle: "東京のテックコンサルティング & 日本のIT人材確保",
    tokyoPrestaDesc: "東京のフランス系ファーム。JLPT N2+バイリンガルコンサルタント。マネーフォワード、ル・モンド。麻布十番、2018年から。",
    tokyoRecrutTitle: "東京のエンジニアリング職 & テック採用",
    tokyoRecrutDesc: "日本のテック採用 + Mobbealリロケーションプログラム（ビザ、住居、家族）。50名以上のエンジニアが既に移住。",
    ctaVerb: "詳細を見る",
  },
  "fr-ca": {
    tape: "// NOS PÔLES · PARIS · MONTRÉAL · TOKYO",
    title: "3 pôles physiques, 6 façons de collaborer.",
    subtitle:
      "Chaque bureau opère 2 services : prestation (squads embarqués, livraison) pis recrutement (permanent, pigiste). Cliquez sur votre ville pis votre besoin pour aller directement à la bonne page.",
    parisPrestaTitle: "Entreprise de développement informatique à Paris",
    parisPrestaDesc: "Firme & squads séniors pour banques, assureurs, détail, souveraineté (SecNumCloud/HDS/DORA). 54 rue Greneta, depuis 2015.",
    parisRecrutTitle: "Recrutement techno à Paris",
    parisRecrutDesc: "Firme spécialisée profils séniors. Recherche ingénieur-led, conclusion 48h, garantie 6 mois. Couverture France entière.",
    montrealPrestaTitle: "Entreprise de développement informatique à Montréal",
    montrealPrestaDesc: "Consultation TI, firme conseil, livraison clé en main. 4388 Saint-Denis, depuis 2023. GMB 4.9★.",
    montrealRecrutTitle: "Recrutement techno à Montréal",
    montrealRecrutDesc: "Firme recrutement sénior québécois. 3-5 semaines vs 10-16 en canaux classiques. Loi 25 native.",
    tokyoPrestaTitle: "Tech consulting Tokyo & IT staffing Japan",
    tokyoPrestaDesc: "Firme française à Tokyo. Consultants JLPT N2+ bilingues. Money Forward, Le Monde. Higashi-Azabu depuis 2018.",
    tokyoRecrutTitle: "Engineering jobs & tech recruitment Tokyo",
    tokyoRecrutDesc: "Recrutement techno Japon + programme Mobbeal (visa, logement, famille). 50+ ingénieurs déjà installés.",
    ctaVerb: "Découvrir",
  },
};

type HubCard = {
  city: "paris" | "montreal" | "tokyo";
  kind: "presta" | "recrut";
  href: string;
  title: string;
  desc: string;
};

function buildCards(locale: Locale, t: Labels): HubCard[] {
  const p = `/${locale}`;
  return [
    // Paris
    {
      city: "paris",
      kind: "presta",
      href: `${p}/entreprise-developpement-informatique-paris`,
      title: t.parisPrestaTitle,
      desc: t.parisPrestaDesc,
    },
    {
      city: "paris",
      kind: "recrut",
      href: `${p}/recrutement-tech-paris`,
      title: t.parisRecrutTitle,
      desc: t.parisRecrutDesc,
    },
    // Montreal (FR-CA seulement pour recrutement montreal — cette page
    // ne rend pas EN/JA, la carte reste en FR meme sur locales EN/JA
    // sur home car le contenu est intrinsequement local FR-CA).
    {
      city: "montreal",
      kind: "presta",
      href: `${p}/entreprise-developpement-informatique-montreal`,
      title: t.montrealPrestaTitle,
      desc: t.montrealPrestaDesc,
    },
    {
      city: "montreal",
      kind: "recrut",
      href: `${p}/recrutement-tech-montreal`,
      title: t.montrealRecrutTitle,
      desc: t.montrealRecrutDesc,
    },
    // Tokyo
    {
      city: "tokyo",
      kind: "presta",
      href: `${p}/tech-consulting-tokyo`,
      title: t.tokyoPrestaTitle,
      desc: t.tokyoPrestaDesc,
    },
    {
      city: "tokyo",
      kind: "recrut",
      href: `${p}/engineering-jobs-tokyo`,
      title: t.tokyoRecrutTitle,
      desc: t.tokyoRecrutDesc,
    },
  ];
}

const CITY_LABEL: Record<HubCard["city"], string> = {
  paris: "PARIS",
  montreal: "MONTRÉAL",
  tokyo: "TOKYO",
};

const KIND_TAG: Record<Locale, Record<HubCard["kind"], string>> = {
  fr: { presta: "Prestation", recrut: "Recrutement" },
  en: { presta: "Consulting", recrut: "Recruitment" },
  ja: { presta: "コンサルティング", recrut: "採用" },
  "fr-ca": { presta: "Prestation", recrut: "Recrutement" },
};

export function Hubs({ locale }: { locale: Locale }) {
  const t = T[locale];
  const cards = buildCards(locale, t);
  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
        {t.tape}
      </p>
      <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1] max-w-3xl">
        {t.title}
      </h2>
      <p className="mt-8 text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-3xl">
        {t.subtitle}
      </p>

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex flex-col justify-between rounded-md border border-[var(--color-border)] p-6 md:p-7 hover:border-[var(--color-brand-teal)] transition-colors bg-[var(--color-bg-paper)]"
          >
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
                  {CITY_LABEL[c.city]}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                  · {KIND_TAG[locale][c.kind]}
                </span>
              </div>
              <h3 className="mt-4 font-semibold text-lg md:text-xl tracking-[-0.015em] leading-tight group-hover:text-[var(--color-brand-teal)] transition-colors">
                {c.title}
              </h3>
              <p className="mt-3 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                {c.desc}
              </p>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 font-mono text-xs text-[var(--color-brand-teal)]">
              {t.ctaVerb}
              <span
                aria-hidden
                className="inline-block transition-transform duration-300 group-hover:translate-x-1.5"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
