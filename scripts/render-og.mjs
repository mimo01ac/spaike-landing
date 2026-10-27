// One-off: render an OG card HTML to a 1200x630 PNG with Playwright (Chromium).
// Usage: node scripts/render-og.mjs scripts/og-copilot-training.html public/og/hands-on-copilot-training.png
import { chromium } from "@playwright/test";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [, , htmlArg, outArg] = process.argv;
if (!htmlArg || !outArg) {
  console.error("usage: node scripts/render-og.mjs <html> <out.png>");
  process.exit(1);
}

const url = pathToFileURL(resolve(htmlArg)).href;
const out = resolve(outArg);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 2,
});
await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log("wrote", out);
