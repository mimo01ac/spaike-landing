import { test, expect } from "./fixtures";
import { PUBLIC_PAGES } from "./helpers";

/**
 * Ingen amerikanske tankestreger (— eller –) i den synlige tekst på de
 * offentlige sider (Michael 23/11). Kode-kommentarer tæller ikke; kun det,
 * en besøgende kan se. Intervaller skrives med almindelig bindestreg.
 */
for (const path of PUBLIC_PAGES) {
  test(`ingen tankestreger på ${path}`, async ({ page }) => {
    await page.goto(path);
    const tekst = await page.locator("body").innerText();
    const fund = tekst
      .split("\n")
      .filter((l) => /[—–]/.test(l))
      .map((l) => l.trim().slice(0, 120));
    expect(fund, `tankestreger på ${path}:\n${fund.join("\n")}`).toEqual([]);
  });
}
