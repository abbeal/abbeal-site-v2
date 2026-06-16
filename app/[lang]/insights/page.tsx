import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates, pageOpenGraph } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { getAllArticles, pick } from "@/lib/articles";
import { getCMSArticles } from "@/lib/articles-cms";

// Revalidate 5 min. Hook Payload afterChange (a ajouter sur Articles)
// invalidera /insights instantanement quand un article est save/publish.
export const revalidate = 300;

type Dict = {
  nav: { insights: string };
  insightsIndex: {
    tape: string;
    h1: string;
    subtitle: string;
    /** Titre SEO dédié — découplé du h1. Le <title> doit porter les
     *  mots-clés (IA, Software, Data, Robotique, géos) ; le h1 garde
     *  la voix de marque ("Sans bullshit."). Fallback sur h1 si absent.
     *  (Même pattern que careers.seoTitle, ajout audit W24-t5.) */
    seoTitle?: string;
    /** UI tag filter — labels localisés (audit W24-t5). */
    allTagsLabel?: string;
    tagFilterLabel?: string;
    noResultsLabel?: string;
    filteredByPrefix?: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/insights">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  const title = `${dict.insightsIndex.seoTitle ?? dict.insightsIndex.h1} · Abbeal`;
  const description = dict.insightsIndex.subtitle;
  // Note : pageAlternates n'inclut PAS les query params -> canonical reste
  // /{locale}/insights meme quand l'utilisateur navigue ?tag=IA. Volontaire :
  // les pages filtrees ne sont pas des canonicals separes (sinon Google y
  // verrait du duplicate content avec sous-ensembles d'articles).
  return {
    title,
    description,
    alternates: pageAlternates(lang as Locale, "/insights"),
    ...pageOpenGraph(lang as Locale, { title, description, path: "/insights" }),
  };
}

export default async function InsightsIndexPage({
  params,
  searchParams,
}: PageProps<"/[lang]/insights">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = (await getDictionary(locale)) as Dict;

  // searchParams est une Promise en Next 16 (App Router). On extrait
  // ?tag=... pour le filtre server-side (zero JS).
  const sp = (await searchParams) ?? {};
  const rawTag = sp.tag;
  const tagParam = Array.isArray(rawTag) ? rawTag[0] : rawTag;

  // CUMUL CMS + STATIQUES (W24 followup pivot insights).
  //   - CMS published avec body non-vide d'abord (frais, edites)
  //   - Statique en fallback (les 28 anciens articles de lib/articles.ts)
  //   - CMS body vide = ignore (sinon on perd le contenu statique)
  //
  // Article CMS pour cette locale (fetch HTTP API REST, pas getPayload SDK
  // cf bug W24 sur Vercel runtime SSR documente dans lib/job-offers.ts).
  const cmsArticles = await getCMSArticles(locale);
  // W25 fix : filter CMS avec body vide (migration a peut-etre wipe le body
  // de certains articles, on ne veut pas qu'ils prennent le pas sur le
  // statique qui a le vrai contenu).
  const cmsWithBody = cmsArticles.filter((a) => a.body && a.body.length > 0);
  const cmsFlat = cmsWithBody.map((a) => ({
    slug: a.slug,
    tag: a.tag,
    readTime: a.readTime,
    publishedAt: a.publishedAt,
    title: a.title,
    excerpt: a.excerpt,
  }));
  const cmsSlugs = new Set(cmsFlat.map((a) => a.slug));
  const staticArticles = getAllArticles()
    .filter((a) => !cmsSlugs.has(a.slug))
    .map((a) => ({
      slug: a.slug,
      tag: a.tag,
      readTime: a.readTime,
      publishedAt: a.publishedAt,
      title: pick(a.title, locale),
      excerpt: pick(a.excerpt, locale),
    }));
  // CMS d'abord (par sort=-publishedAt deja applique cote API), statiques apres
  const allArticles = [...cmsFlat, ...staticArticles];

  const tagCounts = allArticles.reduce<Record<string, number>>((acc, a) => {
    acc[a.tag] = (acc[a.tag] ?? 0) + 1;
    return acc;
  }, {});
  const allTags = Object.entries(tagCounts)
    .sort(([, ca], [, cb]) => cb - ca)
    .map(([tag]) => tag);

  // Tag valide ? Sinon on ignore et on affiche tout (= comportement bypass
  // silencieux des ?tag=foo invalides pour eviter de spammer Google avec
  // des 404 soft sur des query params libres).
  const activeTag = tagParam && allTags.includes(tagParam) ? tagParam : null;
  const articles = activeTag
    ? allArticles.filter((a) => a.tag === activeTag)
    : allArticles;

  // Fix W25 : fr-ca tombait sur "en-GB" -> dates en anglais sur /fr-ca/insights.
  // Map explicite par locale pour respecter le formatage local quebecois.
  const dateLocale =
    locale === "ja"
      ? "ja-JP"
      : locale === "en"
        ? "en-GB"
        : locale === "fr-ca"
          ? "fr-CA"
          : "fr-FR";

  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const pageH1 = dict.insightsIndex.h1;
  const pageSubtitle = dict.insightsIndex.subtitle;

  // Schema.org Blog (NEW W24-t5) — eligibilite "blog" rich result + boost
  // autorite topique sur les requetes "blog abbeal" / "insights abbeal".
  // Reference les 5 derniers articles (sort publishedAt DESC dans
  // getAllArticles deja). Reste hors-filter pour Schema (Google indexe la
  // collection complete, pas la sous-vue filtree).
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: pageH1,
    description: pageSubtitle,
    url: `${SITE}/${locale}/insights`,
    inLanguage: locale,
    publisher: {
      "@type": "Organization",
      name: "Abbeal",
      url: SITE,
      logo: `${SITE}/brand/wordmark-teal.png`,
    },
    blogPost: allArticles.slice(0, 5).map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: `${SITE}/${locale}/insights/${a.slug}`,
      datePublished: a.publishedAt,
    })),
  };

  // Schema.org ItemList — toujours la liste filtree (cohérent avec ce que
  // l'utilisateur voit a l'ecran).
  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageH1,
    description: pageSubtitle,
    numberOfItems: articles.length,
    itemListElement: articles.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/${locale}/insights/${a.slug}`,
      name: a.title,
    })),
  };

  const crumbs = breadcrumbs(locale, [[dict.nav.insights, "/insights"]]);

  const allTagsLabel = dict.insightsIndex.allTagsLabel ?? "All";
  const filterAriaLabel =
    dict.insightsIndex.tagFilterLabel ?? "Filter by topic";
  const noResultsLabel =
    dict.insightsIndex.noResultsLabel ?? "No article for this topic.";
  const filteredByPrefix = dict.insightsIndex.filteredByPrefix ?? "Filtered by";

  const basePath = `/${locale}/insights`;

  return (
    <section className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <div className="max-w-3xl">
        <span className="tape-label">{dict.insightsIndex.tape}</span>
        <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
          {pageH1}
        </h1>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {pageSubtitle}
        </p>
      </div>

      {/* Tag filter (NEW W24-t5) — server-side, zero JS, SEO-friendly
          (canonical reste /insights donc pas de duplicate content sur
          ?tag=X). Rendu en <a> simples + active state via :focus + bg
          conditionnel. Accessible : <nav> + aria-label. */}
      <nav
        aria-label={filterAriaLabel}
        className="mt-10 flex flex-wrap items-center gap-2"
      >
        <Link
          href={basePath}
          aria-current={activeTag === null ? "page" : undefined}
          className={`inline-flex h-9 items-center px-4 font-mono text-[11px] uppercase tracking-[0.2em] border transition-colors ${
            activeTag === null
              ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bg-light)]"
              : "border-[var(--color-border)] hover:border-[var(--color-ink)]"
          }`}
        >
          {allTagsLabel}
        </Link>
        {allTags.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <Link
              key={tag}
              href={`${basePath}?tag=${encodeURIComponent(tag)}`}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex h-9 items-center px-4 font-mono text-[11px] uppercase tracking-[0.2em] border transition-colors ${
                isActive
                  ? "border-[var(--color-brand-teal)] bg-[var(--color-brand-teal)] text-[var(--color-bg-light)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-brand-teal)] hover:text-[var(--color-brand-teal)]"
              }`}
            >
              {tag}
              <span className="ml-2 text-[var(--color-muted)] normal-case tracking-normal text-[10px]">
                {tagCounts[tag]}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Filter status (NEW W24-t5) — affiche le tag actif + lien "clear",
          discrets, ne polluent pas l'UI quand pas filtré. */}
      {activeTag && (
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
          {filteredByPrefix}{" "}
          <span className="text-[var(--color-brand-teal)]">{activeTag}</span>{" "}
          ·{" "}
          <Link
            href={basePath}
            className="underline underline-offset-2 hover:text-[var(--color-ink)] transition-colors"
          >
            {allTagsLabel.toLowerCase()}
          </Link>
        </p>
      )}

      {articles.length === 0 ? (
        <p className="mt-16 py-20 text-center text-[var(--color-muted)] border-y border-[var(--color-border)]">
          {noResultsLabel}
        </p>
      ) : (
        <ul className="mt-12 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
          {articles.map((article, i) => (
            <li key={article.slug}>
              <Link
                href={`/${locale}/insights/${article.slug}`}
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
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--color-muted)]">
                    <time dateTime={article.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString(
                        dateLocale,
                        { year: "numeric", month: "short", day: "numeric" },
                      )}
                    </time>
                  </p>
                </div>
                <div className="md:col-span-2 flex md:justify-end items-start">
                  <p className="font-mono text-xs text-[var(--color-muted)]">
                    {article.readTime}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
