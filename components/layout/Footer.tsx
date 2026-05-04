import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { NewsletterForm } from "./NewsletterForm";
import { FooterLangSwitch } from "./FooterLangSwitch";
import { StatusIndicator } from "./StatusIndicator";

type FooterDict = {
  footer: {
    tagline: string;
    addresses: {
      title: string;
      items: { city: string; address: string; tag: string }[];
    };
    contact: { title: string; general: string; recruitment: string };
    follow: { title: string; linkedin: string; youtube: string };
    navTitle: string;
    legalTitle: string;
    legal: { mentions: string; privacy: string; cgu?: string; cookies?: string };
    copyright: string;
    newsletter: {
      title: string;
      subtitle: string;
      placeholder: string;
      cta: string;
      ok: string;
      errorGeneric: string;
    };
    status: string;
  };
  nav: {
    services: string;
    expertises: string;
    stories: string;
    mobbeal: string;
    insights: string;
    careers: string;
    contact: string;
  };
};

export function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
}) {
  const d = dict as unknown as FooterDict;
  const p = `/${locale}`;

  return (
    <footer className="mt-32 border-t border-[var(--color-border)] bg-[var(--color-bg-cream)]/50">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
        {/* Newsletter banner — top of footer, full width */}
        <div className="mb-12 pb-12 border-b border-[var(--color-border)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-brand-teal)]">
                {d.footer.newsletter.title}
              </p>
              <p className="mt-3 text-base md:text-lg text-[var(--color-ink-soft)] leading-relaxed max-w-xl">
                {d.footer.newsletter.subtitle}
              </p>
            </div>
            <div className="lg:col-span-6">
              <NewsletterForm
                labels={{
                  placeholder: d.footer.newsletter.placeholder,
                  cta: d.footer.newsletter.cta,
                  ok: d.footer.newsletter.ok,
                  errorGeneric: d.footer.newsletter.errorGeneric,
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Link href={p} className="block" aria-label="Abbeal">
              <Image
                src="/brand/wordmark-teal.png"
                alt="Abbeal"
                width={1511}
                height={333}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-[var(--color-ink-soft)] leading-relaxed">
              {d.footer.tagline}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-muted)]">
              {d.footer.addresses.title}
            </p>
            <ul className="mt-4 space-y-4 text-sm">
              {d.footer.addresses.items.map((a) => (
                <li key={a.city}>
                  <p className="flex items-baseline gap-2">
                    <span className="font-semibold">{a.city}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                      {a.tag}
                    </span>
                  </p>
                  <p className="text-[var(--color-ink-soft)] mt-0.5">
                    {a.address}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-muted)]">
              {d.footer.navTitle}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href={`${p}#services`}
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {d.nav.services}
                </Link>
              </li>
              <li>
                <Link
                  href={`${p}/about`}
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {(d.nav as unknown as Record<string, string>).about}
                </Link>
              </li>
              <li>
                <Link
                  href={`${p}/mobbeal`}
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {d.nav.mobbeal}
                </Link>
              </li>
              <li>
                <Link
                  href={`${p}/cases`}
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {d.nav.stories}
                </Link>
              </li>
              <li>
                <Link
                  href={`${p}/insights`}
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {d.nav.insights}
                </Link>
              </li>
              <li>
                <Link
                  href={`${p}/glossaire`}
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {(d.nav as unknown as Record<string, string>).glossary ?? "Glossaire"}
                </Link>
              </li>
              <li>
                <Link
                  href={`${p}/partners`}
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {(d.nav as unknown as Record<string, string>).partners ?? "Partenaires"}
                </Link>
              </li>
              <li>
                <Link
                  href={`${p}/careers`}
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {d.nav.careers}
                </Link>
              </li>
              <li>
                <Link
                  href={`${p}/contact`}
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {d.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-muted)]">
              {d.footer.contact.title}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${d.footer.contact.general}`}
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {d.footer.contact.general}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${d.footer.contact.recruitment}`}
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {d.footer.contact.recruitment}
                </a>
              </li>
            </ul>

            <p className="font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-muted)] mt-6">
              {d.footer.follow.title}
            </p>
            <ul className="mt-3 flex gap-3 text-sm">
              <li>
                <a
                  href="https://linkedin.com/company/abbeal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {d.footer.follow.linkedin}
                </a>
              </li>
              <li aria-hidden className="text-[var(--color-muted)]">·</li>
              <li>
                <a
                  href="https://youtube.com/@abbeal8017"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--color-brand-teal)]"
                >
                  {d.footer.follow.youtube}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--color-border)] flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <p className="font-mono text-xs text-[var(--color-muted)]">
              {d.footer.copyright}
            </p>
            <StatusIndicator label={d.footer.status} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <ul className="flex gap-5 text-xs text-[var(--color-muted)]">
              <li>
                <Link
                  href={`${p}/mentions-legales`}
                  className="hover:text-[var(--color-ink)]"
                >
                  {d.footer.legal.mentions}
                </Link>
              </li>
              <li>
                <Link
                  href={`${p}/confidentialite`}
                  className="hover:text-[var(--color-ink)]"
                >
                  {d.footer.legal.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`${p}/cgu`}
                  className="hover:text-[var(--color-ink)]"
                >
                  {d.footer.legal.cgu ?? "CGU"}
                </Link>
              </li>
              <li>
                <Link
                  href={`${p}/preferences-cookies`}
                  className="hover:text-[var(--color-ink)]"
                >
                  {d.footer.legal.cookies ?? "Cookies"}
                </Link>
              </li>
            </ul>
            <FooterLangSwitch current={locale} />
          </div>
        </div>
      </div>
    </footer>
  );
}
