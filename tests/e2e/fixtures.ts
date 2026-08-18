import { test as base, expect } from "@playwright/test";

/**
 * Delt test-basis: mock ALLE kald til analytics.spaike.dk. Serveren er
 * scale-to-zero på Fly og kan tage 30+ sek. at vågne; uden mock hænger
 * sidens load-event på script.js og gør suiten flaky. Tracking sender
 * alligevel intet fra localhost (hostname-guard i trackEvent).
 */
export const test = base.extend({
  context: async ({ context }, use) => {
    await context.route("**://analytics.spaike.dk/**", (route) => {
      if (route.request().url().includes("script.js")) {
        return route.fulfill({
          status: 200,
          contentType: "application/javascript",
          body: "/* Umami mocket i E2E */",
        });
      }
      return route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
    });
    await use(context);
  },
});

export { expect };
