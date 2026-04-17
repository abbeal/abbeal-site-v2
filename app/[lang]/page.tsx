import { notFound } from "next/navigation";
import { getDictionary } from "./dictionaries";
import { hasLocale, type Locale } from "@/lib/i18n";
import { Hero } from "@/components/sections/Hero";
import { KPIs } from "@/components/sections/KPIs";
import { ADN } from "@/components/sections/ADN";
import { Services } from "@/components/sections/Services";
import { Expertises } from "@/components/sections/Expertises";
import { TechRadar } from "@/components/sections/TechRadar";
import { Stories } from "@/components/sections/Stories";
import { Insights } from "@/components/sections/Insights";
import { CTAFinal } from "@/components/sections/CTAFinal";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang as Locale)) as Record<string, unknown>;

  return (
    <>
      <Hero locale={lang as Locale} dict={dict} />
      <KPIs dict={dict} />
      <ADN dict={dict} />
      <Services locale={lang as Locale} dict={dict} />
      <Expertises dict={dict} />
      <TechRadar dict={dict} />
      <Stories dict={dict} />
      <Insights locale={lang as Locale} dict={dict} />
      <CTAFinal locale={lang as Locale} dict={dict} />
    </>
  );
}
