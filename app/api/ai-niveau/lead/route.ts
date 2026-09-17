/**
 * AI-niveau lead-route: POST { email, consent, level, levelName, weak, env }
 * -> notificerer Michael pr. mail (Brevo, fail-soft). Blød opt-in: brugeren
 * har allerede sin plan, mailen er kun hvis de vil have mere.
 *
 * MVP: leadet mailes til Michael, ikke persisteret i PocketBase endnu
 * (bevidst, se DEFERRED.md — tilføj ai_niveau_leads-collection ved list-behov).
 */

import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`ai-niveau-lead:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "For mange forsøg. Prøv igen om lidt." }, { status: 429 });
  }

  let body: {
    email?: string;
    consent?: boolean;
    level?: string | number;
    levelName?: string;
    weak?: string;
    env?: string;
  };
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

  const clean = (v: unknown, n: number) =>
    String(v ?? "").replace(/[\r\n<>]/g, "").trim().slice(0, n);
  const level = clean(body.level, 4);
  const levelName = clean(body.levelName, 60);
  const weak = clean(body.weak, 60);
  const env = clean(body.env, 20);

  // Notifikation til Michael (fail-soft).
  try {
    await sendEmail({
      to: process.env.EMAIL_FROM_ADDRESS || "michael@spaike.dk",
      subject: `AI-niveau: ny tilmelding (${levelName || "ukendt niveau"})`,
      html: `<p>Ny opt-in fra AI Proficiency Snapshot.</p><p><b>E-mail:</b> ${email}<br><b>Niveau:</b> ${level || "?"} af 4 (${levelName || "?"})<br><b>Svageste område:</b> ${weak || "?"}<br><b>Miljø:</b> ${env || "?"}</p>`,
    });
  } catch (e) {
    // Fail-soft: brugeren skal stadig få en kvittering.
    console.error("ai-niveau lead: mail fejlede:", (e as Error).message);
  }

  return NextResponse.json({ ok: true });
}
