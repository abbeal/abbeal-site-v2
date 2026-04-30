import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Anciennes URLs Heroku/WordPress → routes Next 16 i18n
      // permanent: true → 308 (préserve méthode HTTP, équivalent SEO d'un 301)
      { source: "/hire", destination: "/fr/careers", permanent: true },
      { source: "/jobs", destination: "/fr/careers", permanent: true },
      { source: "/valley", destination: "/fr/about", permanent: true },
      { source: "/valley/:slug*", destination: "/fr/about", permanent: true },
      { source: "/projets", destination: "/fr/cases", permanent: true },
      { source: "/projets/:slug*", destination: "/fr/cases", permanent: true },
      { source: "/equipe", destination: "/fr/about", permanent: true },
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

export default withSentryConfig(nextConfig, {
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
});
