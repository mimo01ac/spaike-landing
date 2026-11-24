import { test, expect } from "./fixtures";

/**
 * SpAIke Snapshot (/tjek): hele flowet med test-header. Lead-kaldet rammer den
 * rigtige /api/kontakt (action "snapshot"); headeren x-snapshot-test: 1 betyder
 * test=true og ingen mail. Uden PocketBase-env svarer routen stadig ok (gemt=false).
 */

test("snapshot: 9 spørgsmål, resultat uden mail, detaljer efter mail-gate", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-snapshot-test": "1" });
  await page.goto("/tjek");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Hvor går jeres tid/);
  await page.getByRole("button", { name: "Start →" }).click();

  // 1-3: ét valg går videre af sig selv
  await page.getByRole("button", { name: "Klinik og sundhed" }).click();
  await page.getByRole("button", { name: "6-20" }).click();
  await page.getByRole("button", { name: "Ejer eller direktør" }).click();

  // 4: op til tre opgaver
  await expect(page.getByText("Spørgsmål 4 af 9")).toBeVisible();
  await page.getByRole("button", { name: "Besvare indgående mails og henvendelser" }).click();
  await page.getByRole("button", { name: "Følge op på leads og kunder" }).click();
  await page.getByRole("button", { name: "Lave rapporter og opgørelser" }).click();
  await expect(page.getByRole("button", { name: "Flytte data mellem systemer" })).toBeDisabled();
  await page.getByRole("button", { name: "Videre →" }).click();

  // 5-7: timer pr. opgave
  await page.getByRole("button", { name: "11-20 timer" }).click();
  await page.getByRole("button", { name: "6-10 timer" }).click();
  await page.getByRole("button", { name: "3-5 timer" }).click();

  // Tilbage-knappen virker og bevarer svaret
  await expect(page.getByText("Spørgsmål 8 af 9")).toBeVisible();
  await page.getByRole("button", { name: "← Tilbage" }).click();
  await expect(page.getByText("Spørgsmål 7 af 9")).toBeVisible();
  await expect(page.getByRole("button", { name: "3-5 timer" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Videre →" }).click();

  // 8-9
  await page.getByRole("button", { name: "200-300 kr." }).click();
  await expect(page.getByText("Spørgsmål 9 af 9")).toBeVisible();
  await page.getByRole("button", { name: /Nogle bruger ChatGPT/ }).click();

  // Resultat med det samme, uden mail
  const kort = page.getByTestId("snapshot-resultat");
  await expect(kort).toContainText("Besvare indgående mails og henvendelser");
  await expect(kort).toContainText("ca. 45-90 timer");
  await expect(kort).toContainText("ca. 170.000-330.000 kr.");
  await expect(kort).toContainText("jeres eget skøn");
  await expect(page.getByTestId("snapshot-modenhed")).toContainText("Niveau 1: Spredt brug");
  await expect(page.getByRole("link", { name: /Se modulet under ydelser/ })).toHaveAttribute("href", "/ydelser#henvendelser");

  // Timelønnen kan rettes og regner om
  await page.getByLabel("Timeløn:").fill("400");
  await expect(kort).toContainText("ca. 280.000-520.000 kr.");

  // Mail-gate -> rigtig route med test-header
  await page.getByLabel("Navn").fill("E2E Test");
  await page.getByLabel("Arbejdsmail").fill("e2e@spaike.dk");
  await page.getByLabel("Firma").fill("E2E Testfirma ApS");
  const svar = page.waitForResponse((r) => r.url().endsWith("/api/kontakt"));
  await page.getByRole("button", { name: "Vis detaljerne →" }).click();
  const r = await svar;
  expect(r.status()).toBe(200);
  const data = await r.json();
  expect(data.ok).toBe(true);
  expect(data.test).toBe(true);
  expect(r.request().headers()["x-snapshot-test"]).toBe("1");
  expect(r.request().postDataJSON().timeloenKr).toBe(400);

  const detaljer = page.getByTestId("snapshot-detaljer");
  await expect(detaljer).toContainText("I alt");
  await expect(detaljer).toContainText("11-20 timer om ugen × 52 uger × 400 kr. × 1,25");
  await expect(detaljer.locator("ol li")).toHaveCount(3);
});

test("snapshot: ugyldige kontaktdata afvises pænt af serveren", async ({ request }) => {
  const r = await request.post("/api/kontakt", {
    headers: { "x-snapshot-test": "1" },
    data: { action: "snapshot", svar: { branche: "Findes ikke" }, navn: "x", email: "x@y.dk", firma: "x" },
  });
  expect(r.status()).toBe(400);
  expect((await r.json()).error).toMatch(/branche/i);
});
