import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Sample rate (edge)
  tracesSampleRate: 0.1,

  environment: process.env.VERCEL_ENV ?? "development",
  enabled: process.env.NODE_ENV === "production",
  debug: false,
});
