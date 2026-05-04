import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { CookiePreferencesForm } from "@/components/cookies/CookiePreferencesForm";

type Dict = {
  cookiePrefs: {
    h1: string;
    updated: string;
    intro: string;
    categories: {
      necessary: { title: string; body: string };
      analytics: { title: string; body: string };
      ad: { title: string; body: string };
      functional: { title: string; body: string };
    };
    saveCustom: string;
    acceptAll: string;
    rejectAll: string;
    withdraw: string;
    alwaysOn: string;
    savedToast: string;
    withdrawnToast: string;
  };
};

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/preferences-cookies">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  return {
    title: `${dict.cookiePrefs.h1} · Abbeal`,
    robots: { index: false, follow: true },
    alternates: pageAlternates(lang as Locale, "/preferences-cookies"),
  };
}

export default async function CookiePreferencesPage({
  params,
}: PageProps<"/[lang]/preferences-cookies">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = (await getDictionary(locale)) as Dict;
  const c = dict.cookiePrefs;
  const crumbs = breadcrumbs(locale, [[c.h1, "/preferences-cookies"]]);

  return (
    <article className="mx-auto max-w-[760px] px-6 md:px-10 py-20 md:py-28">
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

      <CookiePreferencesForm
        locale={locale}
        labels={{
          intro: c.intro,
          categories: c.categories,
          saveCustom: c.saveCustom,
          acceptAll: c.acceptAll,
          rejectAll: c.rejectAll,
          withdraw: c.withdraw,
          alwaysOn: c.alwaysOn,
          savedToast: c.savedToast,
          withdrawnToast: c.withdrawnToast,
        }}
      />
    </article>
  );
}
