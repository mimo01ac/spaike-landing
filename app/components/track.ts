/**
 * Fire-and-forget event-tracking til Umami via sendBeacon. Deles af
 * Analytics.tsx (delegerede data-track-attributter + scroll depth) og
 * komponenter der tracker programmatisk (fx discovery-funnel'en).
 *
 * Kun anonyme tællere, ALDRIG persondata i events. Beaconen sendes som ren
 * streng (text/plain, ingen CORS-preflight) og kan aldrig blokere navigation
 * eller UI, jf. analytics-hændelsen 2026-08-05.
 */

const WEBSITE_ID = "0b7517b0-d5a4-4785-aaff-009e05e85ba7";
const SEND_URL = "https://analytics.spaike.dk/api/send";

export function trackEvent(name: string, data?: Record<string, string | number>) {
  try {
    // Track kun produktionsdomænet: localhost/preview/E2E-tests må ikke
    // forurene statistikken (spejler data-domains på Umami-script-tagget).
    if (!/(^|\.)spaike\.dk$/.test(location.hostname)) return;
    const payload = {
      type: "event",
      payload: {
        website: WEBSITE_ID,
        hostname: location.hostname,
        screen: `${screen.width}x${screen.height}`,
        language: navigator.language,
        title: document.title,
        url: location.pathname + location.search,
        referrer: document.referrer,
        name,
        ...(data && Object.keys(data).length ? { data } : {}),
      },
    };
    navigator.sendBeacon(SEND_URL, JSON.stringify(payload));
  } catch {
    // Analytics må aldrig kunne vælte siden.
  }
}
