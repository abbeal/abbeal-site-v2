import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { LangSwitch } from "./LangSwitch";
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

  const items = [
    { label: d.nav.services, href: `${prefix}#services` },
    { label: d.nav.expertises, href: `${prefix}#expertises` },
    { label: d.nav.stories, href: `${prefix}#stories` },
    { label: d.nav.mobbeal, href: `${prefix}/mobbeal` },
    { label: d.nav.insights, href: `${prefix}/insights` },
    { label: d.nav.careers, href: `${prefix}/careers` },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)]/60 bg-[var(--color-bg-light)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6 px-6 md:px-10">
        <Link href={prefix} className="block" aria-label="Abbeal">
          <Image
            src="/brand/wordmark-teal.png"
            alt="Abbeal"
            width={1511}
            height={333}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-7">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
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
