import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "../dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { MobbealHero } from "@/components/sections/mobbeal/MobbealHero";
import { Piliers } from "@/components/sections/mobbeal/Piliers";
import { Destinations } from "@/components/sections/mobbeal/Destinations";
import { Testimonials } from "@/components/sections/mobbeal/Testimonials";
import { MobbealFAQ } from "@/components/sections/mobbeal/MobbealFAQ";
import { MobbealCTA } from "@/components/sections/mobbeal/MobbealCTA";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/mobbeal">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as {
    mobbeal: { meta: { title: string; description: string } };
  };
  return {
    title: dict.mobbeal.meta.title,
    description: dict.mobbeal.meta.description,
    openGraph: {
      title: dict.mobbeal.meta.title,
      description: dict.mobbeal.meta.description,
      locale: lang,
    },
  };
}

export default async function MobbealPage({
  params,
}: PageProps<"/[lang]/mobbeal">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang as Locale)) as Record<string, unknown>;

  return (
    <>
      <MobbealHero locale={lang as Locale} dict={dict} />
      <Piliers dict={dict} />
      <Destinations dict={dict} />
      <Testimonials dict={dict} />
      <MobbealFAQ dict={dict} />
      <MobbealCTA dict={dict} />
    </>
  );
}
