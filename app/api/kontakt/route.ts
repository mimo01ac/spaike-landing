/**
 * Kontaktformular: POST { navn, email, besked, consent, felde } ->
 * gemmes i PocketBase (kontakt_beskeder) + Brevo-notifikation til Michael
 * med reply-to sat til afsenderen. Fail-soft: fejler mailen, ligger beskeden
 * stadig i PocketBase.
 *
 * Anti-spam: honeypot-felt ("felde") + per-IP rate-limit. Ingen captcha:
 * friktion vejer tungere end spamrisikoen ved nuvaerende trafik.
 */

import { NextResponse } from "next/server";
import { createRecord } from "@/lib/pocketbase";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 15;

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`kontakt:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "For mange beskeder. Prøv igen om lidt." }, { status: 429 });
  }

  let body: { navn?: string; email?: string; besked?: string; consent?: boolean; felde?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig anmodning." }, { status: 400 });
  }

  // Honeypot: bots udfylder feltet; svar "ok" uden at gemme noget.
  if ((body.felde ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const navn = (body.navn ?? "").trim().slice(0, 120);
  const email = (body.email ?? "").trim().slice(0, 200);
  const besked = (body.besked ?? "").trim().slice(0, 4000);
  if (!navn || !besked) {
    return NextResponse.json({ error: "Udfyld navn og besked." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "Skriv en gyldig e-mail." }, { status: 400 });
  }
  if (!body.consent) {
    return NextResponse.json(
      { error: "Du skal acceptere behandlingen af din besked." },
      { status: 400 },
    );
  }

  try {
    await createRecord("kontakt_beskeder", { navn, email, besked, consent: true });
  } catch (e) {
    console.error("kontakt: PB-gem fejlede:", (e as Error).message);
    return NextResponse.json(
      { error: "Noget gik galt. Skriv i stedet direkte til michael@spaike.dk." },
      { status: 500 },
    );
  }

  await sendEmail({
    to: process.env.EMAIL_FROM_ADDRESS || "michael@spaike.dk",
    subject: `Kontaktformular: besked fra ${navn}`,
    html: `<p><b>Fra:</b> ${esc(navn)} &lt;${esc(email)}&gt;</p><p style="white-space:pre-wrap">${esc(besked)}</p><p style="color:#6b6650;font-size:12px">Sendt via kontaktformularen på spaike.dk. Svar direkte til afsenderen.</p>`,
    replyTo: { email, name: navn },
  });

  return NextResponse.json({ ok: true });
}
