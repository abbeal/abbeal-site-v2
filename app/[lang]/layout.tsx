import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";
import { getDictionary } from "./dictionaries";
import { hasLocale, htmlLang, locales, type Locale } from "@/lib/i18n";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieBanner } from "@/components/cookies/CookieBanner";

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
    // NOTE: no `alternates` here on purpose. The layout has no access to the
    // current pathname, so a layout-level canonical would point every page to
    // the locale home (= duplicate signal to Google). Each page must declare
    // its own `alternates` via lib/seo.ts > pageAlternates(locale, path).
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      other: {
        ...(process.env.BING_SITE_VERIFICATION
          ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION }
          : {}),
        ...(process.env.YANDEX_SITE_VERIFICATION
          ? { "yandex-verification": process.env.YANDEX_SITE_VERIFICATION }
          : {}),
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

  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://abbeal.com";
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE}#organization`,
    name: "Abbeal",
    legalName: "ABBEAL SAS",
    url: SITE,
    logo: `${SITE}/brand/wordmark-teal.png`,
    image: `${SITE}/brand/og-image.png`,
    description:
      "Pôle d'ingénierie tri-geo (Paris · Montréal · Tokyo) fondé en 2015. Software, IA, Data, Robotique. Squads d'ingénieurs intégrés, recrutement technique, mobilité internationale.",
    slogan: "La Tech qu'on aurait aimé trouver. On l'a fondée.",
    sameAs: [
      "https://www.linkedin.com/company/abbeal",
      "https://www.youtube.com/@abbeal8017",
      "https://www.pappers.fr/entreprise/abbeal-790172928",
      "https://www.societe.com/societe/abbeal-790172928.html",
    ],
    foundingDate: "2015",
    founders: [
      { "@type": "Person", name: "Sébastien Lonjon" },
      { "@type": "Person", name: "Vianney Blanquart" },
    ],
    numberOfEmployees: { "@type": "QuantitativeValue", value: "50+" },
    areaServed: [
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Canada" },
      { "@type": "Country", name: "Japan" },
    ],
    knowsAbout: [
      "Software Engineering",
      "Artificial Intelligence",
      "Data Engineering",
      "Robotics",
      "Cloud Infrastructure",
      "Kubernetes",
      "RAG",
      "ROS 2",
      "Follow-the-Sun delivery",
      "Technical Recruitment",
      "International Tech Mobility",
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Squads embarqués",
          url: `${SITE}/fr/services/squads-embarques`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Recrutement technique",
          url: `${SITE}/fr/services/recrutement-technique`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Delivery clé en main",
          url: `${SITE}/fr/services/delivery-cle-en-main`,
        },
      },
    ],
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
        streetAddress: "1-23-5 Higashi-Azabu, Minato-ku",
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
        areaServed: ["FR", "CA", "JP"],
        availableLanguage: ["French", "English", "Japanese"],
      },
      {
        "@type": "ContactPoint",
        email: "recrutement@abbeal.com",
        contactType: "recruitment",
        areaServed: ["FR", "CA", "JP"],
      },
    ],
  };

  // Anti-flash dark-mode bootstrap. Runs before body paints, reads the
  // `theme` cookie (or falls back to prefers-color-scheme) and adds the
  // `dark` class to <html> so first paint matches the user's preference.
  // Wrapped in IIFE + try/catch so a corrupt cookie can never break the page.
  const themeBootstrap = `
(function(){try{
var m=document.cookie.match(/(?:^|;\\s*)theme=(dark|light)/);
var t=m?m[1]:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
if(t==='dark')document.documentElement.classList.add('dark');
}catch(e){}})();`;

  // Cookie banner labels, plucked from the cookieBanner dict so the
  // banner can render purely client-side without re-fetching the dict.
  const banner = (dict as unknown as {
    cookieBanner: {
      title: string;
      body: string;
      acceptAll: string;
      rejectAll: string;
      customize: string;
      preferencesHref: string;
    };
  }).cookieBanner;

  return (
    <html
      lang={htmlLang[lang as Locale]}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-full flex flex-col grain bg-[var(--color-bg-light)] text-[var(--color-ink)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <Header locale={lang as Locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={lang as Locale} dict={dict} />
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID ?? ""} />
        <CookieBanner locale={lang as Locale} labels={banner} />
      </body>
    </html>
  );
}
