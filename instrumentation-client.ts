import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Sample rate (client)
  tracesSampleRate: 0.1, // 10% of transactions get traced

  // Session replay — disabled by default (privacy + bundle size)
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  // Filter out noisy errors
  ignoreErrors: [
    // Safari extension / browser quirks
    "Non-Error promise rejection captured",
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
    // Network hiccups (user's ISP / wifi drops)
    "NetworkError",
    "Failed to fetch",
    "Load failed",
    // Third-party script noise
    "Script error.",
  ],

  // Tag environment for filtering in Sentry UI
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "production",

  // Debug off in prod
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
