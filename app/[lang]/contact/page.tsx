import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { pageAlternates } from "@/lib/seo";
import { breadcrumbs } from "@/lib/breadcrumbs";
import { ContactForm } from "@/components/sections/ContactForm";

type Dict = {
  nav: { contact: string };
  contact: {
    tape: string;
    h1: string;
    subtitle: string;
    calendlyTitle: string;
    calendlySub: string;
    altTitle: string;
    form: {
      name: string;
      email: string;
      company: string;
      role: string;
      message: string;
      messagePlaceholder: string;
      submit: string;
    };
    offices: string;
    emailsTitle: string;
  };
  footer: {
    addresses: { items: { city: string; address: string; tag: string }[] };
    contact: { general: string; recruitment: string };
  };
};

const CALENDLY_URL = "https://calendly.com/d/csr7-3vm-vhw/meeting-abbeal";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  return {
    title: `${dict.contact.h1} · Abbeal`,
    description: dict.contact.subtitle,
    alternates: pageAlternates(lang as Locale, "/contact"),
  };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = (await getDictionary(locale)) as Dict;
  const d = dict.contact;
  const f = d.form;
  const crumbs = breadcrumbs(locale, [[dict.nav.contact, "/contact"]]);

  return (
    <section className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />
      <span className="tape-label">{d.tape}</span>
      <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
        {d.h1}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-[var(--color-ink-soft)] leading-relaxed">
        {d.subtitle}
      </p>

      {/* Calendly inline embed — primary conversion path */}
      <div className="mt-14 border border-[var(--color-border)] bg-[var(--color-bg-paper)] overflow-hidden">
        <div className="px-6 md:px-8 pt-6 pb-2 border-b border-[var(--color-border)]">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-brand-teal)]">
            {d.calendlyTitle}
          </p>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            {d.calendlySub}
          </p>
        </div>
        <iframe
          src={`${CALENDLY_URL}?hide_gdpr_banner=1&primary_color=42b296&text_color=0c343d&background_color=ffffff`}
          title="Calendly"
          className="w-full"
          style={{ minHeight: "680px", border: "none" }}
          loading="lazy"
        />
      </div>

      {/* Alternative: form + offices + emails */}
      <div className="mt-16 pt-14 border-t border-dashed border-[var(--color-border)]">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] mb-8">
          // {d.altTitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7">
          <ContactForm
            locale={lang as Locale}
            form={f}
            fallbackEmail={dict.footer.contact.general}
          />
        </div>

        <aside className="lg:col-span-5 space-y-10">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {d.offices}
            </p>
            <ul className="mt-4 space-y-4">
              {dict.footer.addresses.items.map((a) => (
                <li key={a.city}>
                  <p className="flex items-baseline gap-2">
                    <span className="font-semibold">{a.city}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted)]">
                      {a.tag}
                    </span>
                  </p>
                  <p className="text-sm text-[var(--color-ink-soft)] mt-0.5">{a.address}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              {d.emailsTitle}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={`mailto:${dict.footer.contact.general}`} className="hover:text-[var(--color-brand-teal)]">
                  {dict.footer.contact.general}
                </a>
              </li>
              <li>
                <a href={`mailto:${dict.footer.contact.recruitment}`} className="hover:text-[var(--color-brand-teal)]">
                  {dict.footer.contact.recruitment}
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}

