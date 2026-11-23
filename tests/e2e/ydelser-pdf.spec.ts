import { writeFileSync } from "node:fs";
import { test, expect } from "./fixtures";

/**
 * /ydelser som leave-behind (SPA-1291): print-stilarket skal give højst 2
 * A4-sider med kontaktlinje, uden header, footer og knapper.
 * Sæt YDELSER_PDF=<sti> for at gemme PDF'en (og YDELSER_PNG=<sti> for et
 * skærmbillede af print-visningen) til manuel gennemsyn.
 */
test.describe("/ydelser som PDF", () => {
  // page.pdf kører kun i Chromium; desktop-projektet er nok.
  test.beforeEach(({ browserName }, testInfo) => {
    test.skip(browserName !== "chromium" || testInfo.project.name !== "desktop");
  });

  test("PDF i A4 er højst 2 sider", async ({ page }, testInfo) => {
    await page.goto("/ydelser");
    await page.evaluate(() => document.fonts.ready);
    const pdf = await page.pdf({ format: "A4", preferCSSPageSize: true });
    const sider = (pdf.toString("latin1").match(/\/Type\s*\/Page(?![s\w])/g) ?? []).length;
    writeFileSync(testInfo.outputPath("spaike-ydelser.pdf"), pdf);
    if (process.env.YDELSER_PDF) writeFileSync(process.env.YDELSER_PDF, pdf);
    expect(sider, "antal A4-sider").toBeGreaterThan(0);
    expect(sider, "antal A4-sider").toBeLessThanOrEqual(2);
  });

  test("print skjuler header, footer og knapper og viser kontaktlinjen", async ({ page }) => {
    await page.goto("/ydelser");
    await page.emulateMedia({ media: "print" });
    await expect(page.locator(".katalog > header")).toBeHidden();
    await expect(page.locator(".katalog > footer")).toBeHidden();
    // Skjulte elementer er ude af tilgængeligheds-træet, så der vælges på attributter.
    const pdfKnapper = page.locator('[data-track-event="ydelser_pdf_click"]');
    await expect(pdfKnapper).toHaveCount(2);
    for (const knap of await pdfKnapper.all()) await expect(knap).toBeHidden();
    for (const cta of await page.locator(".katalog main a[data-track-event]").all()) {
      await expect(cta).toBeHidden();
    }
    const kontakt = page.locator(".katalog-kontakt");
    await expect(kontakt).toBeVisible();
    await expect(kontakt).toContainText("michael@spaike.dk");
    await expect(kontakt).toContainText("+45 51 92 58 18");
    await expect(kontakt).toContainText("spaike.dk");
    if (process.env.YDELSER_PNG) {
      await page.setViewportSize({ width: 794, height: 1123 });
      await page.screenshot({ path: process.env.YDELSER_PNG, fullPage: false });
    }
  });

  test("knappen åbner print-dialogen og bærer Umami-eventet", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __printet: number }).__printet = 0;
      window.print = () => {
        (window as unknown as { __printet: number }).__printet += 1;
      };
    });
    await page.goto("/ydelser");
    const knap = page.getByRole("button", { name: "Download som PDF" }).first();
    await expect(knap).toHaveAttribute("data-track-event", "ydelser_pdf_click");
    await knap.click();
    expect(await page.evaluate(() => (window as unknown as { __printet: number }).__printet)).toBe(1);
    // Titlen sættes kun mens dialogen er åben.
    await expect(page).toHaveTitle(/Ydelser: SpAIke-metoden/);
  });

  test("kontaktlinjen er skjult på skærmen", async ({ page }) => {
    await page.goto("/ydelser");
    await expect(page.locator(".katalog-kontakt")).toBeHidden();
  });
});
