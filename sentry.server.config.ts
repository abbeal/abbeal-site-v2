import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Sample rate (server)
  tracesSampleRate: 0.1,

  // Tag environment
  environment: process.env.VERCEL_ENV ?? "development",

  // Don't send errors during local dev
  enabled: process.env.NODE_ENV === "production",

  debug: false,
});
