import type { Page, Route } from "@playwright/test";

/** Alle offentlige sider der skal svare 200 og have indhold. */
export const PUBLIC_PAGES = [
  "/",
  "/ai-innovationsdag",
  "/ai-innovationsdag/guide",
  "/ai-innovationsdag/ideer",
  "/field-notes/anthropic-sales-playbook",
  "/field-notes/vibe-coding-guide",
  "/field-notes/ai-paa-tegnestuen",
  "/field-notes/ai-i-transport",
  "/field-notes/ai-i-fertilitet",
  "/field-notes/ai-i-landmaaling",
] as const;

/** Stier der BEVIDST skal give 404 (upubliceret/ikke-eksisterende). */
export const EXPECTED_404 = [
  "/field-notes/fra-prototype-til-drift",
  "/field-notes",
  "/denne-side-findes-ikke",
] as const;

/** Domæner der regnes som "vores egne" når links normaliseres. */
export const OWN_HOSTS = new Set(["www.spaike.dk", "spaike.dk"]);

/**
 * Normalisér et href fra en side til en intern sti, eller null hvis linket er
 * eksternt/ikke-HTTP (mailto, tel osv.). Relative links (herunder "#anker")
 * opløses mod den side de blev fundet på, ikke mod roden.
 */
export function toInternalPath(
  href: string,
  baseURL: string,
  currentPath = "/",
): string | null {
  if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return null;
  try {
    const u = new URL(href, new URL(currentPath, baseURL));
    const base = new URL(baseURL);
    if (u.host === base.host || OWN_HOSTS.has(u.host)) {
      return u.pathname + (u.hash || "");
    }
    return null;
  } catch {
    return null;
  }
}

/** NDJSON-svar som chat-routen ville streame det. */
export function ndjson(events: object[]): string {
  return events.map((e) => JSON.stringify(e)) .join("\n") + "\n";
}

export interface ChatMockOptions {
  /** Registrerer alle request-bodies POSTet til chat-routen. */
  onBody?: (body: Record<string, unknown>) => void;
  /** Events der returneres pr. kald (kald 1 = index 0 ...; sidste genbruges). */
  responses: object[][];
}

/**
 * Mock chat-routen (Claude). Ingen tests må ramme det rigtige API: det koster
 * tokens og gør tests flakey.
 */
export async function mockChat(page: Page, opts: ChatMockOptions) {
  let call = 0;
  await page.route("**/api/innovationsdag/chat", async (route: Route) => {
    const body = route.request().postDataJSON() as Record<string, unknown>;
    opts.onBody?.(body);
    const events = opts.responses[Math.min(call, opts.responses.length - 1)];
    call += 1;
    await route.fulfill({
      status: 200,
      contentType: "application/x-ndjson; charset=utf-8",
      body: ndjson([...events, { type: "done" }]),
    });
  });
}

/** Mock research-routen (Anthropic web_fetch). */
export async function mockResearch(page: Page, context = "") {
  await page.route("**/api/innovationsdag/research", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ context }),
    }),
  );
}

/** Mock lead-routen (PocketBase + Brevo). */
export async function mockLead(page: Page, onBody?: (b: Record<string, unknown>) => void) {
  await page.route("**/api/innovationsdag/lead", (route) => {
    onBody?.(route.request().postDataJSON() as Record<string, unknown>);
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });
}

export const TEST_BRIEF = {
  virksomhed: "Testfirma, laver testprodukter",
  cases: [
    {
      titel: "Tilbud samles i hånden",
      problem: "Sælgerne bruger timer på at samle tilbud manuelt.",
      hvorfor_godt_fit: "Konkret, afgrænset og rører flere.",
      mulig_loesning: "En lille tilbudsbygger.",
    },
    {
      titel: "Rapporter tager en dag",
      problem: "Ugerapporten samles manuelt fra tre regneark.",
      hvorfor_godt_fit: "Gentaget manuelt arbejde.",
      mulig_loesning: "Automatisk rapport-generator.",
    },
  ],
  samlet_anbefaling: "Start med tilbudsbyggeren.",
};
