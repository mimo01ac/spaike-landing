import { defineConfig, devices } from "@playwright/test";

/**
 * E2E-tests mod en LOKAL PRODUKTIONS-build (next build + next start), så det
 * der testes, er det samme som det der deployes. Kør: `npm run test:e2e`.
 * Ingen tests rammer betalte API'er: chat/research/lead mockes pr. test.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3031",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    {
      name: "mobil",
      use: { ...devices["Pixel 7"] },
      // Mobil er et smoke-lag: sider + navigation, ikke discovery-flowet igen.
      testIgnore: /discovery/,
    },
  ],
  webServer: {
    command: "npm run build && DISABLE_RATE_LIMIT=1 npm run start -- --port 3031",
    url: "http://localhost:3031",
    timeout: 240_000,
    reuseExistingServer: !process.env.CI,
  },
});
