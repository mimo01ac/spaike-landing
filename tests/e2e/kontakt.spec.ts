import { test, expect } from "./fixtures";

/** Kontaktformularen på forsiden. API'et mockes (rigtig rute gemmer i PB + Brevo). */

test("kontaktformular: samtykke kræves, succes viser kvittering", async ({ page }) => {
  const bodies: Record<string, unknown>[] = [];
  await page.route("**/api/kontakt", (route) => {
    bodies.push(route.request().postDataJSON() as Record<string, unknown>);
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });

  await page.goto("/#kontakt");
  const send = page.getByRole("button", { name: /Send besked/ });
  await expect(send).toBeDisabled();

  await page.getByPlaceholder("Navn").fill("Test Testesen");
  await page.getByPlaceholder("E-mail").fill("test@firma.dk");
  await page.getByPlaceholder(/interesseret i at høre mere/).fill("Hej, fortæl mig mere om AI-tjekket.");
  await page.getByText(/Jeg accepterer/).click();
  await expect(send).toBeEnabled();
  await send.click();

  await expect(page.getByText(/Tak for din besked/)).toBeVisible();
  expect(bodies[0].email).toBe("test@firma.dk");
  expect(bodies[0].consent).toBe(true);
  expect(bodies[0].felde).toBe("");
});

test("kontaktformular: API-fejl vises pænt", async ({ page }) => {
  await page.route("**/api/kontakt", (route) =>
    route.fulfill({
      status: 429,
      contentType: "application/json",
      body: JSON.stringify({ error: "For mange beskeder. Prøv igen om lidt." }),
    }),
  );
  await page.goto("/#kontakt");
  await page.getByPlaceholder("Navn").fill("T");
  await page.getByPlaceholder("E-mail").fill("t@t.dk");
  await page.getByPlaceholder(/interesseret i at høre mere/).fill("x");
  await page.getByText(/Jeg accepterer/).click();
  await page.getByRole("button", { name: /Send besked/ }).click();
  await expect(page.getByText(/For mange beskeder/)).toBeVisible();
});
