import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates, pageOpenGraph } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { generateJobPostings } from "@/lib/jobPosting";
import { Hubs } from "@/components/sections/Hubs";
import {
  getPublishedJobOffers,
  locationLabel,
  contractLabel,
  levelLabel,
  type JobOffer,
} from "@/lib/job-offers";

type Dict = {
  nav: { careers: string };
  careers: {
    tape: string;
    /** Titre SEO dédié — découplé du H1 de marque. Le <title> doit porter
     *  des mots-clés (emploi tech, senior, géos) ; le H1 garde la voix de
     *  marque. Fallback sur h1 si absent. */
    seoTitle?: string;
    h1: string;
    subtitle: string;
    applyTo: string;
    applyEmail: string;
    roles: {
      slug: string;
      title: string;
      stack: string;
      location: string;
      subject: string;
      body: string;
    }[];
    processTape: string;
    processTitle: string;
    processIntro: string;
    processStats: { value: string; label: string }[];
    processSteps: {
      number: string;
      title: string;
      duration: string;
      body: string;
    }[];
    processFootnote: string;
  };
};

// Re-render toutes les 5 min : balance entre fraicheur (nouvelle offre
// publiee visible en <5 min) et SSR cost (cold start Payload + Turso).
export const revalidate = 300;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/careers">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const locale = lang as Locale;
  const dict = (await getDictionary(locale)) as Dict;
  const title = `${dict.careers.seoTitle ?? dict.careers.h1} · Abbeal`;

  // W36 fix (audit Sebastien 2026-08-31) : la meta description hardcodee
  // "Quatre roles ouverts" contredit les 56 offres publiees en CMS,
  // ecrase le CTR sur la page la plus vue du site (/en/careers 3992 imp /
  // 90j). Substitution dynamique : compte reel = CMS published + dict
  // fallback roles, injecte dans le template locale.
  const cmsOffers = await getPublishedJobOffers(locale);
  const cmsSlugs = new Set(cmsOffers.map((o) => o.slug));
  const dictOnlySlugs = dict.careers.roles
    .map((r) => r.slug)
    .filter((s) => !cmsSlugs.has(s));
  const openCount = cmsOffers.length + dictOnlySlugs.length;
  const description = renderCareersSubtitle(locale, openCount, dict.careers.subtitle);
  return {
    title,
    description,
    alternates: pageAlternates(locale, "/careers"),
    ...pageOpenGraph(locale, { title, description, path: "/careers" }),
  };
}

/** Substitue le compteur dynamique dans la meta description /careers.
 *  Historique : subtitle contenait "Four roles open" / "Quatre rôles ouverts"
 *  hardcode (audit W36 : 56 offres reelles vs 4 annonces). On reformule
 *  par locale avec le count reel + fallback si le subtitle a change. */
function renderCareersSubtitle(
  locale: Locale,
  n: number,
  fallback: string,
): string {
  const templates: Record<Locale, string> = {
    fr: `${n} rôles ouverts. Senior-only. Client stable, delivery propre, mobilité internationale possible via Mobbeal.`,
    en: `${n} roles open. Senior-only. Stable clients, clean delivery, international mobility available via Mobbeal.`,
    ja: `${n}件のポジション募集中。シニアのみ。安定したクライアント、クリーンなデリバリー、Mobbealによる海外赴任可能。`,
    "fr-ca": `${n} postes ouverts. Postes chevronnés seulement. Client stable, livraison propre, mobilité internationale possible via Mobbeal.`,
  };
  return templates[locale] ?? fallback;
}

/** Convertit une JobOffer CMS en Role (shape attendue par le rendu et par
 *  generateJobPostings JSON-LD). Pivot pour reutiliser le UI existant +
 *  helper Schema.org sans tout reecrire pour cette iteration. */
function offerToRole(offer: JobOffer, locale: Locale, defaultEmail: string) {
  const subject =
    locale === "ja"
      ? `応募 — ${offer.title}`
      : locale === "en"
        ? `Application — ${offer.title}`
        : `Candidature — ${offer.title}`;
  return {
    slug: offer.slug,
    title: offer.title,
    stack: offer.techStack.join(" · "),
    location: locationLabel(offer.location, locale),
    subject,
    body: offer.excerpt,
    // Champs additionnels CMS-only (pas dans le shape Role legacy)
    _applyUrl: offer.applyUrl || `mailto:${defaultEmail}?subject=${encodeURIComponent(subject)}`,
    _contract: contractLabel(offer.contractType, locale),
    _level: levelLabel(offer.experienceLevel, locale),
    _salaryRange: offer.salaryRange,
    // Lien vers la page detail /careers/[slug] (CMS only — les dict
    // templates n'ont pas de body markdown pour justifier une page detail).
    _detailHref: `/${locale}/careers/${offer.slug}`,
  };
}

type RenderedRole = ReturnType<typeof offerToRole> | (Dict["careers"]["roles"][number] & {
  _applyUrl?: string;
  _contract?: string;
  _level?: string;
  _salaryRange?: string | null;
  _detailHref?: string;
});

export default async function CareersPage({ params }: PageProps<"/[lang]/careers">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = (await getDictionary(locale)) as Dict;
  const d = dict.careers;
  const crumbs = breadcrumbs(locale, [[dict.nav.careers, "/careers"]]);

  // Mode CUMUL (W24 follow-up) : on affiche TOUJOURS les 4 templates
  // statiques du dict ("Postes toujours ouverts") PLUS les offres CMS
  // ponctuelles published. Logique business :
  //   - Les 4 du dict (senior-fullstack, ai-engineer, cloud-devops,
  //     embedded-robotics) sont des positions toujours ouvertes
  //     ("talent magnets") qui restent visibles meme sans offre concrete.
  //   - Les offres CMS sont des positions specifiques avec deadline,
  //     stack pointue, parfois geo. Elles passent EN HAUT (plus fraiches
  //     + plus urgentes) et basculent les talent magnets dessous.
  //
  // Dedupe par slug : si une offre CMS a le meme slug qu'un template
  // dict (ex. cms repond avec slug "ai-engineer"), le CMS gagne et
  // remplace le template (source de verite plus recente).
  const cmsOffers = await getPublishedJobOffers(locale);
  const cmsRoles = cmsOffers.map((o) => offerToRole(o, locale, d.applyEmail));
  const cmsSlugs = new Set(cmsRoles.map((r) => r.slug));
  // W24 followup : on rend AUSSI les dict roles cliquables vers leur page
  // detail (qui fait fallback dict si offre CMS pas trouvee). Tous les cards
  // -> page detail desormais, plus d'anchor #slug.
  const dictRolesEnriched = d.roles
    .filter((r) => !cmsSlugs.has(r.slug))
    .map((r) => ({
      ...r,
      _detailHref: `/${locale}/careers/${r.slug}`,
    }));
  const roles: RenderedRole[] = [...cmsRoles, ...dictRolesEnriched];

  // Schema.org JobPosting par role : eligibilite Google Jobs box.
  // Boost CTR sur le longtail non-branded ("AI Engineer Tokyo", etc.)
  // identifie par l'audit SEO W19.
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const jobPostings = generateJobPostings(
    roles.map((r) => ({
      slug: r.slug,
      title: r.title,
      stack: r.stack,
      location: r.location,
      subject: r.subject,
      body: r.body,
    })),
    locale,
    SITE,
    d.applyEmail,
  );

  return (
    <>
    <section className="mx-auto max-w-[1200px] px-6 md:px-10 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      {jobPostings.map((jp, i) => (
        <script
          // eslint-disable-next-line react/no-array-index-key
          key={`jp-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jp) }}
        />
      ))}
      <div className="max-w-3xl">
        <span className="tape-label">{d.tape}</span>
        <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
          {d.h1}
        </h1>
        <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
          {d.subtitle}
        </p>
      </div>

      {/* Process recrutement — encart "1 candidat sur ~50" qui étaye
          la promesse "top 1%" en exposant le funnel */}
      <section
        id="process"
        className="mt-20 pt-16 border-t border-[var(--color-border)]"
      >
        <div className="max-w-3xl">
          <span className="tape-label">{d.processTape}</span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(1.75rem,3.5vw,2.75rem)] leading-[1.1]">
            {d.processTitle}
          </h2>
          <p className="mt-5 text-[15px] md:text-base text-[var(--color-ink-soft)] leading-relaxed">
            {d.processIntro}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {d.processStats.map((s, i) => (
            <div key={i}>
              <p className="font-sans font-semibold tracking-[-0.02em] text-2xl md:text-3xl text-[var(--color-ink)]">
                {s.value}
              </p>
              <div className="mt-3 flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-2 inline-block h-px w-6 bg-[var(--color-brand-teal)]"
                />
                <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)] leading-relaxed">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ol className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {d.processSteps.map((step) => (
            <li
              key={step.number}
              className="border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-5"
            >
              <p className="font-mono text-xs tracking-widest text-[var(--color-brand-teal)]">
                // {step.number}
              </p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-[var(--color-ink)]">
                {step.title}
              </h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                {step.duration}
              </p>
              <p className="mt-3 text-[14px] text-[var(--color-ink-soft)] leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]/70">
          {d.processFootnote}
        </p>
      </section>

      <ul
        id="roles"
        className="mt-20 pt-16 border-t border-[var(--color-border)] divide-y divide-[var(--color-border)]"
      >
        {roles.map((role, i) => {
          // W24 followup : le bouton "Postuler" du listing pointe maintenant
          // vers la page detail #apply (anchor du form Resend). Tous les
          // cards ont _detailHref (CMS + dict templates desormais).
          const applyHref = `${role._detailHref}#apply`;
          // Petite ligne meta : contrat · niveau · salaire (CMS only)
          const metaBits = [role._contract, role._level, role._salaryRange]
            .filter(Boolean)
            .join(" · ");

          return (
            <li id={role.slug} key={role.slug} className="group scroll-mt-24">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-10 md:py-12">
                <div className="md:col-span-1">
                  <span className="font-mono text-xs tracking-widest text-[var(--color-muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="md:col-span-7">
                  {role._detailHref ? (
                    <Link
                      href={role._detailHref}
                      className="inline-block"
                    >
                      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight group-hover:text-[var(--color-brand-teal)] transition-colors">
                        {role.title}{" "}
                        <span
                          aria-hidden
                          className="inline-block text-[var(--color-brand-teal)] opacity-0 group-hover:opacity-100 transition-opacity translate-x-0 group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </h2>
                    </Link>
                  ) : (
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                      {role.title}
                    </h2>
                  )}
                  {role.stack ? (
                    <p className="mt-2 font-mono text-sm text-[var(--color-brand-teal)]">
                      {role.stack}
                    </p>
                  ) : null}
                  <p className="mt-1 font-mono text-xs uppercase tracking-wider text-[var(--color-muted)]">
                    {role.location}
                  </p>
                  {metaBits ? (
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]/80">
                      {metaBits}
                    </p>
                  ) : null}
                  <p className="mt-5 text-[15px] text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
                    {role.body}
                  </p>
                  {role._detailHref ? (
                    <Link
                      href={role._detailHref}
                      className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-brand-teal)] hover:underline underline-offset-4"
                    >
                      {locale === "ja" ? "詳細を見る" : locale === "en" ? "Read the full role" : "Voir le détail"} →
                    </Link>
                  ) : null}
                </div>
                <div className="md:col-span-4 flex md:justify-end items-start">
                  <Link
                    href={applyHref}
                    className="inline-flex items-center gap-2 h-11 px-5 text-sm border border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-bg-light)] transition-colors"
                  >
                    {d.applyTo}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
    {/* W30+ Section C : maillage vers 6 pages ville x service */}
    <Hubs locale={locale} />
    </>
  );
}
