import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";

type Dict = {
  legal: {
    privacy: {
      h1: string;
      intro: string;
      collection: string;
      collectionBody: string;
      rights: string;
      rightsBody: string;
      updated: string;
    };
  };
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/confidentialite">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  return { title: `${dict.legal.privacy.h1} · Abbeal`, robots: { index: false } };
}

export default async function PrivacyPage({ params }: PageProps<"/[lang]/confidentialite">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang as Locale)) as Dict;
  const p = dict.legal.privacy;

  return (
    <article className="mx-auto max-w-[760px] px-6 md:px-10 py-20 md:py-28">
      <h1 className="font-semibold tracking-[-0.025em] text-4xl md:text-5xl leading-tight">
        {p.h1}
      </h1>
      <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[var(--color-muted)]">
        {p.updated}
      </p>

      <p className="mt-8 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">{p.intro}</p>

      <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {p.collection}
        </h2>
        <p className="mt-4 text-[15px] text-[var(--color-ink)] leading-relaxed">
          {p.collectionBody}
        </p>
      </section>

      <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {p.rights}
        </h2>
        <p className="mt-4 text-[15px] text-[var(--color-ink)] leading-relaxed">{p.rightsBody}</p>
      </section>
    </article>
  );
}
