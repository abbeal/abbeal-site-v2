import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";

type Dict = {
  team: {
    tape: string;
    h1: string;
    subtitle: string;
    hubs: { city: string; leader: string; team: string }[];
  };
};

const PORTRAITS = [
  "2024-05-17 - Abbeal portraits-1.jpg",
  "2024-05-17 - Abbeal portraits-2.jpg",
  "2024-05-17 - Abbeal portraits-3.jpg",
  "2024-05-17 - Abbeal portraits-4.jpg",
  "2024-05-17 - Abbeal portraits-5.jpg",
  "2024-05-17 - Abbeal portraits-6.jpg",
  "2024-05-17 - Abbeal portraits-7.jpg",
  "2024-05-17 - Abbeal portraits-8.jpg",
  "2024-05-17 - Abbeal portraits-9.jpg",
  "2024-05-17 - Abbeal portraits-10.jpg",
  "2024-05-17 - Abbeal portraits-11.jpg",
  "2024-05-17 - Abbeal portraits-12.jpg",
  "2024-05-17 - Abbeal portraits-13.jpg",
  "2024-05-17 - Abbeal portraits-14.jpg",
  "2024-05-17 - Abbeal portraits-15.jpg",
  "2024-05-17 - Abbeal portraits-16.jpg",
  "2024-05-17 - Abbeal portraits-19.jpg",
  "2024-05-17 - Abbeal portraits-23.jpg",
  "2024-05-17 - Abbeal portraits-25.jpg",
];

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/equipe">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as Dict;
  return { title: `${dict.team.h1} · Abbeal`, description: dict.team.subtitle };
}

export default async function TeamPage({ params }: PageProps<"/[lang]/equipe">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang as Locale)) as Dict;
  const d = dict.team;

  return (
    <>
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-20 md:py-28">
        <div className="max-w-3xl">
          <span className="tape-label">{d.tape}</span>
          <h1 className="mt-6 font-semibold tracking-[-0.025em] text-[clamp(2.25rem,5vw,4rem)] leading-[1.05]">
            {d.h1}
          </h1>
          <p className="mt-5 text-lg text-[var(--color-ink-soft)] leading-relaxed">
            {d.subtitle}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {PORTRAITS.map((src, i) => (
            <div key={src} className="aspect-[4/5] relative overflow-hidden bg-[var(--color-bg-cream)]">
              <Image
                src={`/team/${src}`}
                alt={`Membre équipe Abbeal ${i + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover hover:scale-[1.03] transition-transform duration-500 grayscale hover:grayscale-0"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-bg-cream)]/40 border-y border-[var(--color-border)]">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--color-border)] border border-[var(--color-border)]">
            {d.hubs.map((hub) => (
              <article key={hub.city} className="bg-[var(--color-bg-paper)] p-8 md:p-10">
                <h3 className="text-2xl font-semibold tracking-tight">{hub.city}</h3>
                <p className="mt-3 font-mono text-sm text-[var(--color-brand-teal)]">
                  {hub.leader}
                </p>
                <p className="mt-3 text-[15px] text-[var(--color-ink-soft)] leading-relaxed">
                  {hub.team}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
