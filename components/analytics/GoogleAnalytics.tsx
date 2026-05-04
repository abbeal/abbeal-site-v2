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
 *   'update', { ... }). Today no consent banner is wired, so no data
 *   flows through — that's the trade-off we're explicitly accepting
 *   to stay legally clean.
 * - When a consent banner is added, just call gtag('consent', 'update',
 *   { analytics_storage: 'granted', ad_storage: 'granted' }) on accept
 *   and data starts flowing without any other change required.
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
  if (!gaId) return null;

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
gtag('js', new Date());
gtag('config', '${gaId}', {
  anonymize_ip: true,
  send_page_view: true
});
          `.trim(),
        }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
        async
      />
    </>
  );
}
