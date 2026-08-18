import { test, expect } from "./fixtures";
import { mockChat, mockResearch, mockLead, TEST_BRIEF } from "./helpers";

/**
 * Discovery-toolet ("Find din case") med ALLE betalte API'er mocket
 * (chat/research/lead). Kun /api/innovationsdag/start rammer den rigtige
 * route (den er gratis og lokal: udsteder blot et session-token).
 */

test.beforeEach(async ({ page }) => {
  // Frisk session: localStorage-persistensen må ikke bløde mellem tests.
  await page.goto("/ai-innovationsdag");
  await page.evaluate(() => window.localStorage.removeItem("spaike_innovationsdag_v1"));
});

test("website-indtastning giver companyName på tur 1 og navngiven åbning", async ({ page }) => {
  const bodies: Record<string, unknown>[] = [];
  await mockResearch(page, "Testfirma laver testprodukter til testbranchen.");
  await mockChat(page, {
    onBody: (b) => bodies.push(b),
    responses: [
      [
        {
          type: "text",
          text: "Hej! Målet her er at hjælpe jer hos Testfirma med at finde en konkret case. Har I noget i tankerne?",
        },
      ],
    ],
  });

  await page.goto("/ai-innovationsdag#vaerktoej");
  await page.getByPlaceholder("jeres-website.dk").fill("https://www.testfirma.dk");
  await page.getByRole("button", { name: /^Start/ }).click();

  // Åbningen skal nævne virksomheden (renderet fra mock-svaret).
  await expect(page.getByText(/hos Testfirma/)).toBeVisible();
  // Og navnet skal være sendt til chat-routen allerede på FØRSTE tur.
  expect(bodies.length).toBeGreaterThan(0);
  expect(bodies[0].companyName).toBe("Testfirma");
});

test("spring over: chat starter uden virksomhedsnavn", async ({ page }) => {
  const bodies: Record<string, unknown>[] = [];
  await mockChat(page, {
    onBody: (b) => bodies.push(b),
    responses: [[{ type: "text", text: "Hej! Lad os finde jeres case. Har I noget i tankerne?" }]],
  });

  await page.goto("/ai-innovationsdag#vaerktoej");
  await page.getByRole("button", { name: /Spring over og start/i }).click();

  await expect(page.getByText(/Lad os finde jeres case/)).toBeVisible();
  expect(bodies[0].companyName ?? "").toBe("");
});

test("assistant-markdown renderes som fed og punktliste, ikke rå tegn", async ({ page }) => {
  await mockChat(page, {
    responses: [
      [
        {
          type: "text",
          text: "To hurtige idéer:\n\n- **Tilbudsbygger**: tilbud samles i hånden i dag\n- **Rapport-robot**: ugerapporten tager en dag\n\nHvilken lyder mest som jer?",
        },
      ],
    ],
  });

  await page.goto("/ai-innovationsdag#vaerktoej");
  await page.getByRole("button", { name: /Spring over og start/i }).click();

  const chat = page.locator('[aria-live="polite"]');
  await expect(chat.locator("ul li")).toHaveCount(2);
  await expect(chat.locator("strong").first()).toHaveText("Tilbudsbygger");
  await expect(chat).not.toContainText("**");
  await expect(chat).not.toContainText("- Tilbudsbygger");
});

test("fuldt flow: chat -> brief -> lead-formular -> kvittering", async ({ page }) => {
  const leadBodies: Record<string, unknown>[] = [];
  await mockChat(page, {
    responses: [
      [{ type: "text", text: "Hej! Har I en problemstilling i tankerne?" }],
      [
        { type: "text", text: "Godt, jeg samler en brief nu." },
        { type: "brief", brief: TEST_BRIEF },
      ],
    ],
  });
  await mockLead(page, (b) => leadBodies.push(b));

  await page.goto("/ai-innovationsdag#vaerktoej");
  await page.getByRole("button", { name: /Spring over og start/i }).click();
  await expect(page.getByText(/problemstilling i tankerne/)).toBeVisible();

  await page.getByPlaceholder("Skriv dit svar …").fill("Vores tilbud samles i hånden.");
  await page.getByRole("button", { name: "Send", exact: true }).click();

  // Brief-event -> slut-steppet med lead-formularen.
  await expect(page.getByText(/case-brief er klar/i)).toBeVisible();
  await page.getByPlaceholder("Navn").fill("Test Testesen");
  await page.getByPlaceholder("E-mail").fill("test@testfirma.dk");
  await page.getByText(/Jeg accepterer/).click();
  await page.getByRole("button", { name: /Send mig brief \+ guide/ }).click();

  await expect(page.getByText(/din brief er på vej/i)).toBeVisible();
  expect(leadBodies[0].email).toBe("test@testfirma.dk");
  expect(leadBodies[0].consent).toBe(true);
  expect((leadBodies[0].case_brief as { cases: unknown[] }).cases).toHaveLength(2);
});

test("samtalen overlever reload (localStorage-persistens)", async ({ page }) => {
  let chatCalls = 0;
  await mockChat(page, {
    onBody: () => {
      chatCalls += 1;
    },
    responses: [[{ type: "text", text: "Hej! Har I en problemstilling i tankerne?" }]],
  });

  await page.goto("/ai-innovationsdag#vaerktoej");
  await page.getByRole("button", { name: /Spring over og start/i }).click();
  await expect(page.getByText(/problemstilling i tankerne/)).toBeVisible();
  expect(chatCalls).toBe(1);

  await page.reload();
  // Chatten er genskabt fra localStorage UDEN et nyt API-kald.
  await expect(page.getByText(/problemstilling i tankerne/)).toBeVisible();
  expect(chatCalls).toBe(1);
});
