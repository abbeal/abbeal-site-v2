import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { getDictionary } from "./dictionaries";
import { hasLocale, locales, type Locale } from "@/lib/i18n";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = (await getDictionary(lang as Locale)) as {
    meta: {
      title: string;
      description: string;
      ogTitle: string;
      ogDescription: string;
    };
  };
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const ogImage = `${SITE}/brand/og-image.png`;
  return {
    metadataBase: new URL(SITE),
    title: dict.meta.title,
    description: dict.meta.description,
    openGraph: {
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
      locale: lang,
      type: "website",
      siteName: "Abbeal",
      url: `${SITE}/${lang}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Abbeal" }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.ogTitle,
      description: dict.meta.ogDescription,
      images: [ogImage],
    },
    alternates: {
      canonical: `${SITE}/${lang}`,
      languages: {
        fr: `${SITE}/fr`,
        en: `${SITE}/en`,
        ja: `${SITE}/ja`,
        "x-default": `${SITE}/fr`,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = (await getDictionary(lang as Locale)) as Record<string, unknown>;

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Abbeal",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com"}/brand/wordmark-teal.png`,
    sameAs: [
      "https://www.linkedin.com/company/abbeal",
      "https://www.youtube.com/@abbeal8017",
    ],
    foundingDate: "2015",
    numberOfEmployees: { "@type": "QuantitativeValue", value: "50+" },
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "54 rue Greneta",
        postalCode: "75002",
        addressLocality: "Paris",
        addressCountry: "FR",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "4388 Rue Saint-Denis",
        postalCode: "H2J 2L1",
        addressLocality: "Montréal",
        addressRegion: "QC",
        addressCountry: "CA",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "1-23-5 Higashiazabu, Minato-ku",
        postalCode: "106-0044",
        addressLocality: "Tokyo",
        addressCountry: "JP",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "contact@abbeal.com",
        contactType: "general",
      },
      {
        "@type": "ContactPoint",
        email: "recrutement@abbeal.com",
        contactType: "recruitment",
      },
    ],
  };

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col grain bg-[var(--color-bg-light)] text-[var(--color-ink)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <Header locale={lang as Locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={lang as Locale} dict={dict} />
      </body>
    </html>
  );
}
