import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";

type Dict = {
  legal: {
    mentions: {
      h1: string;
      publisher: string;
      publisherName: string;
      publisherAddress: string;
      publisherSiren: string;
      publisherRcs: string;
      publisherCapital: string;
      publisherTva: string;
      publisherForm: string;
      publisherDirector: string;
      publisherContact: string;
      hosting: string;
      hostingName: string;
      hostingAddress: string;
      ip: string;
      ipBody: string;
      updated: string;
    };
  };
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/mentions-legales">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  return { title: `${dict.legal.mentions.h1} · Abbeal`, robots: { index: false } };
}

export default async function MentionsPage({ params }: PageProps<"/[lang]/mentions-legales">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang as Locale)) as Dict;
  const m = dict.legal.mentions;

  return (
    <article className="mx-auto max-w-[760px] px-6 md:px-10 py-20 md:py-28 prose prose-neutral">
      <h1 className="font-semibold tracking-[-0.025em] text-4xl md:text-5xl leading-tight">
        {m.h1}
      </h1>
      <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[var(--color-muted)]">
        {m.updated}
      </p>

      <Block title={m.publisher}>
        <p className="font-semibold">{m.publisherName}</p>
        <p>{m.publisherForm}</p>
        <p>{m.publisherAddress}</p>
        <p>{m.publisherSiren}</p>
        <p>{m.publisherRcs}</p>
        <p>{m.publisherCapital}</p>
        <p>{m.publisherTva}</p>
        <p>{m.publisherDirector}</p>
        <p>
          <a href={`mailto:${m.publisherContact}`} className="text-[var(--color-brand-teal)] hover:underline">
            {m.publisherContact}
          </a>
        </p>
      </Block>

      <Block title={m.hosting}>
        <p className="font-semibold">{m.hostingName}</p>
        <p>{m.hostingAddress}</p>
      </Block>

      <Block title={m.ip}>
        <p>{m.ipBody}</p>
      </Block>
    </article>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
        {title}
      </h2>
      <div className="mt-4 space-y-2 text-[15px] text-[var(--color-ink)] leading-relaxed">
        {children}
      </div>
    </section>
  );
}
