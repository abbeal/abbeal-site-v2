import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type Role = {
  slug: string;
  title: string;
  stack: string;
  location: string;
};

type Teaser = {
  tape: string;
  title: string;
  updated: string; // "Mis à jour le X"
  cta: string; // "Voir toutes les offres"
};

/**
 * CareersTeaser — homepage block surfacing the open roles so /careers
 * isn't relegated to the bottom of the navigation. Driven by the existing
 * dict.careers.roles + a small dict.careersHome label set.
 *
 * Layout: 2x2 grid on desktop, single column on mobile. Each role is a
 * link to /careers (we don't link to a dedicated role page yet — the
 * careers page lists all roles with their full description).
 */
export function CareersTeaser({
  locale,
  teaser,
  roles,
}: {
  locale: Locale;
  teaser: Teaser;
  roles: Role[];
}) {
  const limit = 4;
  const list = roles.slice(0, limit);
  return (
    <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-3xl">
          <span className="tape-label">{teaser.tape}</span>
          <h2 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05]">
            {teaser.title}
          </h2>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {teaser.updated}
          </p>
        </div>
        <Link
          href={`/${locale}/careers`}
          className="hidden md:inline-flex items-center gap-2 font-mono text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-brand-teal)] underline underline-offset-4 decoration-dashed transition-colors"
        >
          {teaser.cta}
          <span aria-hidden>→</span>
        </Link>
      </div>

      <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {list.map((role) => (
          <li key={role.slug}>
            <Link
              href={`/${locale}/careers#${role.slug}`}
              className="group block h-full border border-[var(--color-border)] bg-[var(--color-bg-paper)] p-6 hover:border-[var(--color-brand-teal)] transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-semibold tracking-tight text-[var(--color-ink)] group-hover:text-[var(--color-brand-teal)] transition-colors">
                  {role.title}
                </h3>
                <span
                  aria-hidden
                  className="font-mono text-xs text-[var(--color-muted)] group-hover:text-[var(--color-brand-teal)] transition-colors shrink-0"
                >
                  →
                </span>
              </div>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-[var(--color-brand-teal)]">
                {role.stack}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)]">
                {role.location}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={`/${locale}/careers`}
        className="mt-8 inline-flex md:hidden items-center gap-2 font-mono text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-brand-teal)] underline underline-offset-4 decoration-dashed transition-colors"
      >
        {teaser.cta}
        <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
