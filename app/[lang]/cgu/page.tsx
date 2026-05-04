import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";

type Dict = {
  legal: {
    cgu: {
      h1: string;
      metaDescription: string;
      updated: string;
      intro: string;
      sections: { title: string; body: string | string[] }[];
      contact: string;
      contactBody: string;
      contactEmail: string;
    };
  };
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/cgu">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  return {
    title: `${dict.legal.cgu.h1} · Abbeal`,
    description: dict.legal.cgu.metaDescription,
    robots: { index: true },
    alternates: pageAlternates(lang as Locale, "/cgu"),
  };
}

export default async function CGUPage({
  params,
}: PageProps<"/[lang]/cgu">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = (await getDictionary(locale)) as Dict;
  const c = dict.legal.cgu;
  const crumbs = breadcrumbs(locale, [[c.h1, "/cgu"]]);

  return (
    <article className="mx-auto max-w-[760px] px-6 md:px-10 py-20 md:py-28 prose prose-neutral">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <h1 className="font-semibold tracking-[-0.025em] text-4xl md:text-5xl leading-tight">
        {c.h1}
      </h1>
      <p className="mt-3 font-mono text-xs uppercase tracking-wider text-[var(--color-muted)]">
        {c.updated}
      </p>

      <p className="mt-8 text-[17px] leading-relaxed text-[var(--color-ink)]">
        {c.intro}
      </p>

      {c.sections.map((s, i) => (
        <section
          key={i}
          className="mt-12 pt-8 border-t border-[var(--color-border)]"
        >
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            {String(i + 1).padStart(2, "0")} · {s.title}
          </h2>
          <div className="mt-4 space-y-3 text-[15px] text-[var(--color-ink)] leading-relaxed">
            {Array.isArray(s.body) ? (
              s.body.map((p, j) => <p key={j}>{p}</p>)
            ) : (
              <p>{s.body}</p>
            )}
          </div>
        </section>
      ))}

      <section className="mt-12 pt-8 border-t border-[var(--color-border)]">
        <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          {c.contact}
        </h2>
        <div className="mt-4 space-y-2 text-[15px] text-[var(--color-ink)] leading-relaxed">
          <p>{c.contactBody}</p>
          <p>
            <a
              href={`mailto:${c.contactEmail}`}
              className="text-[var(--color-brand-teal)] hover:underline"
            >
              {c.contactEmail}
            </a>
          </p>
        </div>
      </section>
    </article>
  );
}
