import Script from "next/script";

/**
 * GoogleAnalytics — GA4 with Consent Mode v2 default-denied.
 *
 * Why default-denied:
 * - GA4 fires cookies that fall under GDPR (FR/EU) and Loi 25 (QC, in
 *   force since Sept 2023) consent requirements. Without an explicit
 *   user consent we must NOT set tracking cookies.
 * - "Consent Mode v2" tells gtag to load (so it's wired) but to skip
 *   storage/measurement until consent is granted via gtag('consent',
 *   'update', { ... }).
 * - Consent flow: the cookie banner (CookieBanner / CookiePreferencesForm)
 *   writes the `abbeal-consent` cookie and calls applyToGtag() on click.
 *   For a RETURNING visitor whose cookie already exists, the banner never
 *   reopens — so this init script re-reads the cookie below and replays
 *   the stored consent itself. Without that, every page load reset the
 *   visitor to 'denied' regardless of their earlier choice (audit W21).
 *
 * Loading strategy:
 * - `afterInteractive` (Next.js default for Script) keeps gtag.js out of
 *   the critical path: no impact on LCP/INP for the homepage.
 * - The init script runs inline (no network) before gtag.js arrives so
 *   the consent default is set as early as possible.
 *
 * To disable GA4 entirely (e.g. in preview deployments), unset
 * NEXT_PUBLIC_GA_ID — the component renders nothing.
 */
export function GoogleAnalytics({ gaId }: { gaId: string }) {
  // .trim() défensif : la var d'env NEXT_PUBLIC_GA_ID a été polluée par un
  // saut de ligne final ("G-XXXX\n"), ce qui produisait un measurement ID
  // invalide → GA4 ne collectait rien ("collecte non active"). Le trim rend
  // l'init résiliente à tout espace parasite dans l'env var. Audit W21 T0.
  const id = gaId.trim();
  if (!id) return null;

  return (
    <>
      <Script
        id="ga-consent-default"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  functionality_storage: 'denied',
  personalization_storage: 'denied',
  security_storage: 'granted',
  wait_for_update: 500
});
// Re-applique le consentement deja stocke (cookie abbeal-consent) des
// l'init. Sans ca, un visiteur qui a accepte lors d'une visite precedente
// repart en 'denied' a chaque chargement : la banniere n'appelle
// applyToGtag que sur clic, jamais pour un cookie deja present. On lit le
// cookie ici, dans le meme script, juste apres le consent default ->
// ordre garanti, pas de course avec la banniere (audit W21 T0).
try {
  var __ck = document.cookie.split('; ').find(function(c){return c.indexOf('abbeal-consent=')===0;});
  if (__ck) {
    var __p = JSON.parse(decodeURIComponent(__ck.slice('abbeal-consent='.length))).prefs;
    if (__p) gtag('consent', 'update', {
      analytics_storage: __p.analytics ? 'granted' : 'denied',
      ad_storage: __p.ad ? 'granted' : 'denied',
      ad_user_data: __p.ad ? 'granted' : 'denied',
      ad_personalization: __p.ad ? 'granted' : 'denied',
      functionality_storage: __p.functional ? 'granted' : 'denied',
      personalization_storage: __p.functional ? 'granted' : 'denied'
    });
  }
} catch (e) {}
gtag('js', new Date());
gtag('config', '${id}', {
  anonymize_ip: true,
  send_page_view: true
});
          `.trim(),
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
        async
      />
    </>
  );
}
