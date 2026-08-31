import { test, expect } from "./fixtures";

/**
 * AI-tjekket ("indtast din URL"). Scan-API'et mockes: den rigtige motor
 * henter eksterne sites og er dækket af CLI-harnessen + manuel verifikation.
 */

test("landing: knappen er inaktiv uden input og aktiv med", async ({ page }) => {
  await page.goto("/ai-tjek");
  const knap = page.getByRole("button", { name: /Tjek mit site/ });
  await expect(knap).toBeDisabled();
  await page.getByPlaceholder("jeres-domæne.dk").fill("eksempel.dk");
  await expect(knap).toBeEnabled();
});

test("fejl fra scan-API vises pænt", async ({ page }) => {
  await page.route("**/api/ai-tjek/scan", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ error: "Det ligner ikke en gyldig adresse." }),
    }),
  );
  await page.goto("/ai-tjek");
  await page.getByPlaceholder("jeres-domæne.dk").fill("ugyldigt");
  await page.getByRole("button", { name: /Tjek mit site/ }).click();
  await expect(page.getByText(/ligner ikke en gyldig adresse/)).toBeVisible();
});

test("succesfuldt scan navigerer til rapport-siden", async ({ page }) => {
  await page.route("**/api/ai-tjek/scan", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ id: "teststubid123", score: 72 }),
    }),
  );
  await page.route("**/ai-tjek/rapport/teststubid123", (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html; charset=utf-8",
      body: "<html><body><h1>RAPPORT-STUB</h1></body></html>",
    }),
  );
  await page.goto("/ai-tjek");
  await page.getByPlaceholder("jeres-domæne.dk").fill("eksempel.dk");
  await page.getByRole("button", { name: /Tjek mit site/ }).click();
  await expect(page.getByText("RAPPORT-STUB")).toBeVisible();
});
