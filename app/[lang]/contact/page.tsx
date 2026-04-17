import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";

type Dict = {
  contact: {
    tape: string;
    h1: string;
    subtitle: string;
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

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/contact">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  return { title: `${dict.contact.h1} · Abbeal`, description: dict.contact.subtitle };
}

export default async function ContactPage({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang as Locale)) as Dict;
  const d = dict.contact;
  const f = d.form;

  return (
    <section className="mx-auto max-w-[1100px] px-6 md:px-10 py-20 md:py-28">
      <span className="tape-label">{d.tape}</span>
      <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
        {d.h1}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-[var(--color-ink-soft)] leading-relaxed">
        {d.subtitle}
      </p>

      <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <form
          action={`mailto:${dict.footer.contact.general}`}
          method="post"
          encType="text/plain"
          className="lg:col-span-7 space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label={f.name} name="name" required />
            <Field label={f.email} name="email" type="email" required />
            <Field label={f.company} name="company" />
            <Field label={f.role} name="role" />
          </div>
          <div>
            <label htmlFor="message" className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2">
              {f.message}
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              placeholder={f.messagePlaceholder}
              className="w-full border border-[var(--color-border)] bg-[var(--color-bg-paper)] px-4 py-3 text-[15px] focus:outline-none focus:border-[var(--color-brand-teal)] resize-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 h-12 px-6 text-base bg-[var(--color-ink)] text-[var(--color-bg-light)] hover:bg-[var(--color-brand-teal)] hover:text-[var(--color-ink)] transition-colors"
          >
            {f.submit}
            <span aria-hidden>→</span>
          </button>
        </form>

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

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] mb-2">
        {label} {required && <span className="text-[var(--color-brand-teal)]">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full h-11 border border-[var(--color-border)] bg-[var(--color-bg-paper)] px-4 text-[15px] focus:outline-none focus:border-[var(--color-brand-teal)]"
      />
    </div>
  );
}
