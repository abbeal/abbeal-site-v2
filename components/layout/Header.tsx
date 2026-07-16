import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { LangSwitch } from "./LangSwitch";
import { ThemeToggle } from "./ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";

type Dict = {
  nav: {
    services: string;
    expertises: string;
    stories: string;
    mobbeal: string;
    team: string;
    insights: string;
    careers: string;
    contact: string;
    ctaPrimary: string;
  };
};

export function Header({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Record<string, unknown>;
}) {
  const d = dict as unknown as Dict;
  const prefix = `/${locale}`;

  // Hint shown as native tooltip on hover (and read by screen readers).
  // Mobbeal especially needs it — the brand alone doesn't explain the offer.
  const navHint = (dict as unknown as { nav: { mobbealHint?: string } }).nav
    .mobbealHint;
  const items = [
    // W29 : /services listing existe desormais (fix 404 + SEO hub OfferCatalog).
    // Ancien lien vers ancre home #services conserve semantiquement via
    // la section Services de la home qui reste en place.
    { label: d.nav.services, href: `${prefix}/services`, title: undefined },
    { label: d.nav.expertises, href: `${prefix}#expertises`, title: undefined },
    { label: d.nav.stories, href: `${prefix}/cases`, title: undefined },
    { label: d.nav.mobbeal, href: `${prefix}/mobbeal`, title: navHint },
    { label: d.nav.insights, href: `${prefix}/insights`, title: undefined },
    { label: d.nav.careers, href: `${prefix}/careers`, title: undefined },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)]/60 bg-[var(--color-bg-light)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-6 md:px-10">
        <Link href={prefix} className="block" aria-label="Abbeal">
          {/* Wordmark = NOT le LCP (rendu 127x28 max, ecrase visuellement
              par le H1 clamp 44-96px qui occupe tout le viewport mobile).
              W29 : retire priority + fetchPriority=high qui volaient la
              bande passante mobile aux fonts Geist preloaded (H1 = vrai
              LCP text-based). sizes="140px" limite le srcset a 640w au
              lieu de 3840w par defaut. Audit W29 LCP 5.6s -> cible <2.5s. */}
          <Image
            src="/brand/wordmark-teal.png"
            alt="Abbeal"
            width={1511}
            height={333}
            sizes="140px"
            className="h-7 w-auto"
          />
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.title}
              className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-4">
          <ThemeToggle />
          <LangSwitch current={locale} />
          <ButtonLink
            href={`${prefix}/contact`}
            size="md"
            className="hidden sm:inline-flex"
          >
            {d.nav.ctaPrimary}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
