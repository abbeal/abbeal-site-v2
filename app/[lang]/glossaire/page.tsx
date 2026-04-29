import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";
import {
  glossary,
  getGlossaryByCategory,
  localizeGlossaryEntry,
  toGlossaryLocale,
  CATEGORY_I18N,
} from "@/lib/glossary";

const META = {
  fr: {
    title: "Glossaire tech · Abbeal",
    description:
      "Définitions claires des termes techniques utilisés par les CTOs : RAG, Kubernetes, DORA, SLO, MACH, DevSecOps, ROS 2, et 40+ autres. Sans bullshit.",
    tape: "// Glossaire",
    h1: "Le glossaire qu'on aurait voulu avoir.",
    subtitle:
      "Définitions précises des termes techniques. Pas de verbiage marketing. Chaque entrée tient en une page.",
  },
  en: {
    title: "Tech glossary · Abbeal",
    description:
      "Clear definitions of the technical terms CTOs actually use: RAG, Kubernetes, DORA, SLO, MACH, DevSecOps, ROS 2, and 40+ more. No bullshit.",
    tape: "// Glossary",
    h1: "The glossary we wish we had.",
    subtitle:
      "Precise definitions of technical terms. No marketing fluff. One page per entry.",
  },
  ja: {
    title: "技術用語集 · Abbeal",
    description:
      "CTOが実際に使う技術用語の明確な定義：RAG、Kubernetes、DORA、SLO、MACH、DevSecOps、ROS 2、他40+。誤魔化しなし。",
    tape: "// 用語集",
    h1: "欲しかった用語集。",
    subtitle:
      "技術用語の正確な定義。マーケティング用語なし。1エントリーにつき1ページ。",
  },
  "fr-ca": {
    title: "Glossaire techno · Abbeal",
    description:
      "Définitions claires des termes techniques utilisés par les directeurs des TI : RAG, Kubernetes, DORA, SLO, MACH, DevSecOps, ROS 2 et plus de 40 autres. Sans verbiage.",
    tape: "// Glossaire",
    h1: "Le glossaire qu'on aurait voulu avoir.",
    subtitle:
      "Définitions précises des termes techniques. Pas de verbiage marketing. Chaque entrée tient en une page.",
  },
} as const;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/glossaire">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const m = META[lang as Locale];
  return {
    title: m.title,
    description: m.description,
    alternates: pageAlternates(lang as Locale, "/glossaire"),
  };
}

export default async function GlossaryIndexPage({
  params,
}: PageProps<"/[lang]/glossaire">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const m = META[locale];
  const grouped = getGlossaryByCategory();
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";

  // DefinedTermSet schema — le JSON-LD que les LLMs adorent
  const termSetLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "Glossaire tech Abbeal",
    description: m.description,
    inLanguage: locale,
    hasDefinedTerm: glossary.map((g) => {
      const loc = localizeGlossaryEntry(g, locale);
      return {
        "@type": "DefinedTerm",
        "@id": `${SITE}/${locale}/glossaire/${g.slug}`,
        name: loc.term,
        description: loc.short,
        url: `${SITE}/${locale}/glossaire/${g.slug}`,
        inDefinedTermSet: `${SITE}/${locale}/glossaire`,
      };
    }),
  };

  const breadcrumbLabel =
    locale === "fr" ? "Glossaire" : locale === "ja" ? "用語集" : "Glossary";
  const crumbs = breadcrumbs(locale, [[breadcrumbLabel, "/glossaire"]]);

  return (
    <section className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(termSetLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      <div className="max-w-3xl">
        <span className="tape-label">{m.tape}</span>
        <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
          {m.h1}
        </h1>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {m.subtitle}
        </p>
      </div>

      <div className="mt-16 space-y-14">
        {Object.entries(grouped).map(([category, entries]) => {
          const categoryLabel =
            CATEGORY_I18N[category as keyof typeof CATEGORY_I18N][toGlossaryLocale(locale)];
          return (
            <section key={category}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)] border-b border-[var(--color-border)] pb-3">
                {categoryLabel} · {entries.length}
              </p>
              <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {entries.map((e) => {
                  const loc = localizeGlossaryEntry(e, locale);
                  return (
                    <li key={e.slug}>
                      <Link
                        href={`/${locale}/glossaire/${e.slug}`}
                        className="group block border-b border-[var(--color-border)]/50 py-3 hover:border-[var(--color-brand-teal)] transition-colors"
                      >
                        <p className="text-lg font-semibold tracking-tight group-hover:text-[var(--color-brand-teal)] transition-colors">
                          {loc.term}
                        </p>
                        <p className="mt-1 text-sm text-[var(--color-ink-soft)] leading-relaxed">
                          {loc.short}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}
