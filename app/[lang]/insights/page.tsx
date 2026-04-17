import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";

type Dict = {
  insightsIndex: { tape: string; h1: string; subtitle: string };
  insights: {
    items: { tag: string; title: string; excerpt: string; readTime: string; slug: string }[];
  };
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/insights">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  return { title: `${dict.insightsIndex.h1} · Abbeal Insights`, description: dict.insightsIndex.subtitle };
}

export default async function InsightsIndexPage({ params }: PageProps<"/[lang]/insights">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang as Locale)) as Dict;

  return (
    <section className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-28">
      <div className="max-w-3xl">
        <span className="tape-label">{dict.insightsIndex.tape}</span>
        <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
          {dict.insightsIndex.h1}
        </h1>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {dict.insightsIndex.subtitle}
        </p>
      </div>

      <ul className="mt-16 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
        {dict.insights.items.map((article, i) => (
          <li key={article.slug}>
            <Link
              href={`/${lang}/insights/${article.slug}`}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 py-10 group hover:bg-[var(--color-bg-cream)]/40 -mx-2 px-2 transition-colors"
            >
              <div className="md:col-span-2">
                <span className="font-mono text-xs tracking-widest text-[var(--color-muted)]">
                  // {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
                  {article.tag}
                </p>
              </div>
              <div className="md:col-span-8">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-snug group-hover:text-[var(--color-brand-teal)] transition-colors">
                  {article.title}
                </h2>
                <p className="mt-3 text-[15px] text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
                  {article.excerpt}
                </p>
              </div>
              <div className="md:col-span-2 flex md:justify-end items-start">
                <p className="font-mono text-xs text-[var(--color-muted)]">{article.readTime}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
