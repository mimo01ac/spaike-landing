import { test, expect } from "@playwright/test";
import { PUBLIC_PAGES, toInternalPath } from "./helpers";

/**
 * Link-integritet på tværs af alle offentlige sider:
 *  1. Alle interne links svarer < 400.
 *  2. Alle interne #ankre peger på et element der findes på målsiden.
 *  3. Alle eksterne links åbner i ny fane med rel="noopener".
 *  4. Ingen tomme eller "#"-placeholder-links.
 */

interface LinkInfo {
  href: string;
  target: string | null;
  rel: string | null;
  page: string;
}

async function collectAllLinks(
  page: import("@playwright/test").Page,
  baseURL: string,
): Promise<LinkInfo[]> {
  const all: LinkInfo[] = [];
  for (const path of PUBLIC_PAGES) {
    await page.goto(path);
    const links = await page.$$eval("a[href]", (els) =>
      els.map((el) => ({
        href: el.getAttribute("href") ?? "",
        target: el.getAttribute("target"),
        rel: el.getAttribute("rel"),
      })),
    );
    all.push(...links.map((l) => ({ ...l, page: path })));
  }
  return all;
}

test("alle links på alle offentlige sider er sunde", async ({ page, request, baseURL }) => {
  test.setTimeout(120_000);
  const links = await collectAllLinks(page, baseURL!);
  expect(links.length).toBeGreaterThan(20);

  const problems: string[] = [];

  // 4: tomme/placeholder-links.
  for (const l of links) {
    if (l.href === "" || l.href === "#") problems.push(`${l.page}: tomt link/href="#"`);
  }

  // 1: interne links svarer.
  const internal = new Map<string, string[]>(); // sti (uden hash) -> [kilder]
  const anchors = new Map<string, Set<string>>(); // sti -> ankre der peges på
  for (const l of links) {
    const p = toInternalPath(l.href, baseURL!, l.page);
    if (!p) continue;
    const [pathOnly, hash] = p.split("#");
    const target = pathOnly || l.page.split("#")[0];
    if (!internal.has(target)) internal.set(target, []);
    internal.get(target)!.push(l.page);
    if (hash) {
      if (!anchors.has(target)) anchors.set(target, new Set());
      anchors.get(target)!.add(hash);
    }
  }
  for (const [path, sources] of internal) {
    const resp = await request.get(path, { maxRedirects: 5 });
    if (resp.status() >= 400) {
      problems.push(`${path} -> ${resp.status()} (linket fra: ${[...new Set(sources)].join(", ")})`);
    }
  }

  // 2: ankre findes på målsiden.
  for (const [path, ids] of anchors) {
    await page.goto(path);
    for (const id of ids) {
      const count = await page.locator(`[id="${id}"]`).count();
      if (count === 0) problems.push(`${path}: anker #${id} findes ikke`);
    }
  }

  // 3: eksterne links er _blank + noopener.
  for (const l of links) {
    if (toInternalPath(l.href, baseURL!, l.page) !== null) continue;
    if (!/^https?:\/\//.test(l.href)) continue; // mailto/tel er OK uden target
    if (l.target !== "_blank") problems.push(`${l.page}: eksternt link uden _blank: ${l.href}`);
    else if (!l.rel?.includes("noopener"))
      problems.push(`${l.page}: eksternt link uden rel=noopener: ${l.href}`);
  }

  expect(problems, problems.join("\n")).toEqual([]);
});
