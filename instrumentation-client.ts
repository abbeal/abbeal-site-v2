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
    // Browser extensions injectent des scripts malformés via document.body.
    // appendChild → SyntaxError. Pas notre code, observed Sentry W19+W20.
    "Failed to execute 'appendChild' on 'Node'",
    // Idem : SyntaxError "Unexpected EOF" sans stack frame de notre code,
    // typique d'un eval(extension JS) qui échoue.
    "Unexpected EOF",
    // Volontairement déclenchées par les anciennes pages exemple Sentry
    // (supprimées commit 26→). Garde la règle au cas où.
    "Sentry test",
  ],

  // Filtre stack-aware : drop les events qui n'ont AUCUNE frame venant
  // de notre app (host abbeal.com, _next chunks). Tout le reste est
  // probablement du bruit extension navigateur (app:///, chrome-extension://,
  // moz-extension://, [native code]).
  beforeSend(event) {
    const frames = event.exception?.values?.[0]?.stacktrace?.frames ?? [];
    if (frames.length === 0) return event;
    const ourFrame = frames.find((f) => {
      const file = f.filename ?? "";
      return (
        file.includes("abbeal.com") ||
        file.includes("/_next/") ||
        file.includes("webpack-internal:") ||
        // Dev local
        file.includes("localhost")
      );
    });
    // Aucune frame app → drop. Préserve le ratio signal/bruit du dashboard.
    return ourFrame ? event : null;
  },

  // Tag environment for filtering in Sentry UI
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "production",

  // Debug off in prod
  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
