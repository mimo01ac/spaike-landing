import { test, expect } from "./fixtures";

/**
 * Navigation og klik-flows. Byg selv-kortene testes med RIGTIGE klik som
 * regression for analytics-hændelsen 2026-08-05, hvor Umamis link-interception
 * gjorde alle samme-fane-links døde. Navigation må aldrig afhænge af analytics.
 */

test.describe("forsiden", () => {
  test("header-nav springer til sektionerne", async ({ page, isMobile }) => {
    test.skip(isMobile, "Nav-links er bevidst skjult på mobil (kun logo + Book møde-CTA)");
    await page.goto("/");
    for (const [label, id] of [
      ["Hvad vi bygger", "hvad-vi-bygger"],
      ["Discovery", "discovery"],
      ["Byg selv", "byg-selv"],
      ["Manifest", "manifest"],
      ["Kontakt", "kontakt"],
    ] as const) {
      await page.getByRole("navigation").getByRole("link", { name: label }).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`[id="${id}"]`)).toBeInViewport();
    }
  });

  const cards = [
    { name: /Vælg det rigtige værktøj/, url: "/field-notes/vibe-coding-guide" },
    { name: /Find ud af hvad I skal bygge/, url: "/ai-innovationsdag/ideer" },
    { name: /Byg det sammen på én dag/, url: "/ai-innovationsdag" },
  ];
  for (const card of cards) {
    test(`Byg selv-kort "${card.url}" navigerer ved klik`, async ({ page }) => {
      await page.goto("/#byg-selv");
      await page.getByRole("link", { name: card.name }).click();
      await expect(page).toHaveURL(new RegExp(`${card.url.replace(/\//g, "\\/")}$`));
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  test("mobil: nav er skjult men Book møde-CTA og alle sektioner er der", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "kun relevant på mobil-viewport");
    await page.goto("/");
    await expect(page.locator("header nav")).toBeHidden();
    await expect(page.getByRole("banner").getByRole("link", { name: /Book møde/ })).toBeVisible();
    for (const id of ["hvad-vi-bygger", "discovery", "byg-selv", "manifest", "kontakt"]) {
      await expect(page.locator(`[id="${id}"]`)).toBeAttached();
    }
  });

  test("Discovery-sektionen og hero-CTA'en peger på assessment-appen i ny fane", async ({
    page,
  }) => {
    await page.goto("/");
    const heroCta = page
      .locator('#top a[href="https://assessment.spaike.dk"]')
      .first();
    await expect(heroCta).toHaveAttribute("target", "_blank");
    const sektionCta = page
      .locator('#discovery a[href="https://assessment.spaike.dk"]')
      .first();
    await expect(sektionCta).toHaveAttribute("target", "_blank");
    await expect(sektionCta).toHaveAttribute("rel", /noopener/);
    await expect(sektionCta).toContainText(/Kør Discovery/);
  });

  test("Book møde-CTA peger på Calendly i ny fane", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("banner").getByRole("link", { name: /Book møde/ });
    await expect(cta).toHaveAttribute("href", /calendly\.com/);
    await expect(cta).toHaveAttribute("target", "_blank");
  });
});

test.describe("ai-innovationsdag-universet", () => {
  test("landing -> idékatalog -> tilbage via topbar-logo", async ({ page }) => {
    await page.goto("/ai-innovationsdag");
    await page.getByRole("link", { name: /Se idékataloget/i }).first().click();
    await expect(page).toHaveURL(/\/ai-innovationsdag\/ideer$/);
    await page.getByRole("link", { name: "SpAIke" }).first().click();
    await expect(page).toHaveURL(/\/ai-innovationsdag$/);
  });

  test("landing linker til guiden, og guiden loader", async ({ page }) => {
    await page.goto("/ai-innovationsdag");
    await page.locator('a[href="/ai-innovationsdag/guide"]').first().click();
    await expect(page).toHaveURL(/\/ai-innovationsdag\/guide$/);
    await expect(page.locator("h1")).toBeVisible();
  });

  test("kontakt-sektionen har Calendly + mailto", async ({ page }) => {
    await page.goto("/ai-innovationsdag#kontakt");
    const kontakt = page.locator("#kontakt");
    await expect(kontakt.locator('a[href*="calendly.com"]').first()).toBeVisible();
    await expect(kontakt.locator('a[href^="mailto:"]').first()).toBeVisible();
  });
});

test.describe("field notes", () => {
  test("vibe coding-guiden krydslinker til innovationsdag-universet", async ({ page }) => {
    await page.goto("/field-notes/vibe-coding-guide");
    await page.locator('a[href="/ai-innovationsdag/ideer"]').first().click();
    await expect(page).toHaveURL(/\/ai-innovationsdag\/ideer$/);
  });
});
