import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // /{locale}/carrieres → /{locale}/careers : ancien alias FR de la page
      // carrières. Contenu identique, canonical pointait déjà vers /careers —
      // on remplace la page dupliquée servie en 200 par une 301 propre, ce qui
      // ferme 4 URLs orphelines (1 par locale). Audit SEO W21 QW2.
      {
        source: "/:lang(fr|en|ja|fr-ca)/carrieres",
        destination: "/:lang/careers",
        permanent: true,
      },
      // Anciennes URLs Heroku/WordPress → routes Next 16 i18n
      // permanent: true → 308 (préserve méthode HTTP, équivalent SEO d'un 301)
      { source: "/hire", destination: "/fr/careers", permanent: true },
      { source: "/jobs", destination: "/fr/careers", permanent: true },
      { source: "/valley", destination: "/fr/about", permanent: true },
      { source: "/valley/:slug*", destination: "/fr/about", permanent: true },
      // Projets — cases nommes AVANT la regle generique catch-all
      // (preserve le SEO des URLs legacy /projets/* qui drainent du trafic GSC).
      { source: "/projets/le-monde", destination: "/fr/cases/le-monde", permanent: true },
      { source: "/projets/bnp", destination: "/fr/cases/bnp", permanent: true },
      { source: "/projets/pichet", destination: "/fr/cases/pichet", permanent: true },
      { source: "/projets/the-fork", destination: "/fr/cases/the-fork", permanent: true },
      { source: "/projets/groupe-reussite", destination: "/fr/cases/groupe-reussite", permanent: true },
      { source: "/projets/cartier", destination: "/fr/cases/cartier", permanent: true },
      { source: "/projets/paraito", destination: "/fr/cases/paraito", permanent: true },
      { source: "/projets/mobilitas", destination: "/fr/cases/mobilitas", permanent: true },
      { source: "/projets/bopizy", destination: "/fr/cases/bopizy", permanent: true },
      // Catch-all : tout autre /projets/* tombe sur l'index /fr/cases
      { source: "/projets", destination: "/fr/cases", permanent: true },
      { source: "/projets/:slug*", destination: "/fr/cases", permanent: true },
      { source: "/equipe", destination: "/fr/about", permanent: true },
      { source: "/team", destination: "/en/about", permanent: true },
      { source: "/cookies", destination: "/fr/confidentialite", permanent: true },
      // Anciens permaliens WordPress ?p=NNNN — catch-all → home FR
      {
        source: "/",
        has: [{ type: "query", key: "p" }],
        destination: "/fr",
        permanent: true,
      },
    ];
  },
};

export default withPayload(withSentryConfig(nextConfig, {
  // Upload source maps to Sentry (only runs when SENTRY_AUTH_TOKEN is set)
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Don't upload sourcemaps to Sentry for dev builds
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },

  // Enables automatic instrumentation of Vercel Cron Monitors
  automaticVercelMonitors: false,
}));
