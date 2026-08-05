import { test, expect } from "@playwright/test";
import { PUBLIC_PAGES, EXPECTED_404 } from "./helpers";

/**
 * Basis-sundhed for alle offentlige sider: svarer 200, har titel, meta
 * description, præcis én H1 med indhold, og kaster ingen JS-fejl ved load.
 */
for (const path of PUBLIC_PAGES) {
  test(`side ${path} loader sundt`, async ({ page }) => {
    const jsErrors: string[] = [];
    page.on("pageerror", (e) => jsErrors.push(e.message));

    const resp = await page.goto(path);
    expect(resp, `intet svar for ${path}`).toBeTruthy();
    expect(resp!.status(), `status for ${path}`).toBe(200);

    await expect(page).toHaveTitle(/.{10,}/);
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /.{20,}/);

    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).not.toBeEmpty();

    // Vent til siden er faldet til ro, så sene JS-fejl også fanges.
    await page.waitForLoadState("networkidle");
    expect(jsErrors, `JS-fejl på ${path}: ${jsErrors.join(" | ")}`).toEqual([]);
  });
}

test("/hackathon redirecter til /ai-innovationsdag", async ({ page }) => {
  await page.goto("/hackathon");
  await expect(page).toHaveURL(/\/ai-innovationsdag$/);
});

for (const path of EXPECTED_404) {
  test(`${path} giver 404 (bevidst)`, async ({ request }) => {
    const resp = await request.get(path);
    expect(resp.status()).toBe(404);
  });
}

test("robots.txt findes og tillader crawl", async ({ request }) => {
  const resp = await request.get("/robots.txt");
  expect(resp.status()).toBe(200);
  const body = await resp.text();
  expect(body).toContain("User-Agent");
  expect(body).toContain("Sitemap:");
});

test("sitemap.xml findes og indeholder de offentlige hovedsider", async ({ request }) => {
  const resp = await request.get("/sitemap.xml");
  expect(resp.status()).toBe(200);
  const body = await resp.text();
  expect(body).toContain("<urlset");
  expect(body).toContain("https://www.spaike.dk/ai-innovationsdag");
  // Bevidst skjulte sider (kun direkte link) må IKKE stå i sitemap.
  expect(body).not.toContain("ai-i-fertilitet");
  expect(body).not.toContain("fra-prototype-til-drift");
});

test("favicon og OG-metadata er sat på forsiden", async ({ page, request }) => {
  await page.goto("/");
  const ogTitle = page.locator('meta[property="og:title"]');
  await expect(ogTitle).toHaveAttribute("content", /SpAIke/);
  const iconHref = await page
    .locator('link[rel="icon"], link[rel="shortcut icon"]')
    .first()
    .getAttribute("href");
  expect(iconHref).toBeTruthy();
  const iconResp = await request.get(iconHref!);
  expect(iconResp.status()).toBe(200);
});
