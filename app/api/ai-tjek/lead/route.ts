/**
 * AI-tjek lead-route: POST { scanId, email, consent } -> gemmer tilmeldingen
 * til det fulde AI-panel i PocketBase og notificerer Michael pr. mail (Brevo,
 * fail-soft). Panelet køres pt. via den eksisterende ai-visibility-motor og
 * leveres manuelt; automatiseret kørsel er bevidst udskudt (se DEFERRED.md).
 */

import { NextResponse } from "next/server";
import { createRecord, getRecord } from "@/lib/pocketbase";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`aitjek-lead:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "For mange forsøg. Prøv igen om lidt." }, { status: 429 });
  }

  let body: { scanId?: string; email?: string; consent?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig anmodning." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().slice(0, 200);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Skriv en gyldig e-mail." }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json(
      { error: "Du skal acceptere behandlingen af din e-mail." },
      { status: 400 },
    );
  }
  const scanId = (body.scanId ?? "").slice(0, 40);
  const scan = scanId
    ? await getRecord<{ domaene?: string; score?: number }>("ai_tjek_scans", scanId).catch(
        () => null,
      )
    : null;
  if (!scan) {
    return NextResponse.json({ error: "Rapporten blev ikke fundet." }, { status: 404 });
  }

  try {
    await createRecord("ai_tjek_leads", {
      email,
      scan: scanId,
      domaene: scan.domaene ?? "",
      consent: true,
    });
  } catch (e) {
    console.error("ai-tjek lead: PB-gem fejlede:", (e as Error).message);
    return NextResponse.json({ error: "Noget gik galt. Prøv igen." }, { status: 500 });
  }

  // Notifikation til Michael (fail-soft; leadet er allerede gemt).
  await sendEmail({
    to: process.env.EMAIL_FROM_ADDRESS || "michael@spaike.dk",
    subject: `AI-tjek: nyt panel-lead for ${scan.domaene ?? "ukendt domæne"}`,
    html: `<p>Nyt lead fra AI-tjekket.</p><p><b>Domæne:</b> ${scan.domaene ?? "?"}<br><b>Instant-score:</b> ${scan.score ?? "?"}/100<br><b>E-mail:</b> ${email}</p><p>Kør panelet med ai-visibility-motoren og send rapporten retur.</p>`,
  });

  return NextResponse.json({ ok: true });
}
