/**
 * Start-route: udsteder et signeret session-token så chat-routen kan bruges.
 * Ingen mail-gate længere (lav trafik + stateless beskyttelse = lav risiko).
 * Beskyttelse: per-IP rate-limit + valgfri Turnstile (verificeres kun hvis
 * TURNSTILE_SECRET_KEY er sat og der sendes et token). Token + tur-loft +
 * payload-guard i chat-routen er rygraden.
 */

import { NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/turnstile";
import { issueSessionToken } from "@/lib/sessionToken";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = clientIp(req);

  // Maks. 20 sessions-starter pr. IP / 10 min.
  const rl = checkRateLimit(`start:${ip}`, 20, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "For mange forsøg. Prøv igen om lidt." }, { status: 429 });
  }

  let turnstileToken: string | undefined;
  try {
    const body = await req.json();
    turnstileToken = body?.turnstileToken;
  } catch {
    /* tom body er ok */
  }

  // Verificér kun hvis Turnstile er konfigureret (ellers no-op i dev/uden keys).
  if (process.env.TURNSTILE_SECRET_KEY) {
    const ts = await verifyTurnstile(turnstileToken, ip);
    if (!ts.ok) {
      return NextResponse.json(
        { error: "Bot-tjek fejlede. Genindlæs siden og prøv igen." },
        { status: 403 },
      );
    }
  }

  return NextResponse.json({ token: issueSessionToken() });
}
