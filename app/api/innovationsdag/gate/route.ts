/**
 * Gate-route: validerer Turnstile + samtykke, opretter et discovery_sessions-
 * lead i PocketBase, og udsteder et signeret session-token til chat-routen.
 *
 * Dette er det stateless sikkerhedslag: ingen chat uden et token herfra.
 */

import { NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { issueSessionToken } from "@/lib/sessionToken";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import { createRecord } from "@/lib/pocketbase";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const ip = clientIp(req);

  // Maks. 10 gate-forsøg pr. IP / 10 min.
  const rl = checkRateLimit(`gate:${ip}`, 10, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "For mange forsøg. Prøv igen om lidt." },
      { status: 429 },
    );
  }

  let body: {
    name?: string;
    email?: string;
    company?: string;
    consent?: boolean;
    turnstileToken?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig anmodning." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const company = (body.company ?? "").trim();

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "Udfyld dit navn." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ error: "Udfyld en gyldig e-mail." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Du skal acceptere behandlingen af dine oplysninger." },
      { status: 400 },
    );
  }

  const turnstile = await verifyTurnstile(body.turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json(
      { error: "Bot-tjek fejlede. Genindlæs siden og prøv igen." },
      { status: 403 },
    );
  }

  // Opret lead (best-effort: en CRM-hikke må ikke blokere brugeren).
  let recordId: string | null = null;
  try {
    recordId = await createRecord("discovery_sessions", {
      name,
      email,
      company,
      consent: true,
      path_chosen: "none",
    });
  } catch (e) {
    console.error("discovery_sessions create fejlede:", (e as Error).message);
  }

  const token = issueSessionToken();
  return NextResponse.json({ token, recordId });
}
