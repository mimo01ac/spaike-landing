/**
 * Stateless, HMAC-signeret session-token (gate -> chat).
 *
 * Gate-routen udsteder et token efter Turnstile + samtykke. Chat-routen
 * kræver et gyldigt, ikke-udløbet token før den taler med Claude. Tokenet er
 * signeret med APP_SESSION_SECRET (server-side only) så det ikke kan forfalskes.
 * Stateless -> virker fint på Vercel serverless uden delt storage.
 */

import crypto from "crypto";

const TTL_MS = 60 * 60 * 1000; // 1 time

interface Payload {
  iat: number; // issued-at (ms)
  exp: number; // expiry (ms)
  sid: string; // session-id (tilfældig)
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function sign(data: string, secret: string): string {
  return b64url(crypto.createHmac("sha256", secret).update(data).digest());
}

function secret(): string {
  const s = process.env.APP_SESSION_SECRET;
  if (!s) throw new Error("APP_SESSION_SECRET mangler");
  return s;
}

/**
 * `sid` kan gives med, så det også er id'et på en record (fx
 * tilskud_sessioner). Serveren læser det igen fra det signerede token, så
 * klienten aldrig selv kan pege på en anden session.
 */
export function issueSessionToken(sid?: string): string {
  const now = Date.now();
  const payload: Payload = {
    iat: now,
    exp: now + TTL_MS,
    sid: sid ?? crypto.randomUUID(),
  };
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = sign(body, secret());
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !token.includes(".")) return false;
  const [body, sig] = token.split(".");
  const expected = sign(body, secret());
  // konstant-tid sammenligning
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return false;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, "base64").toString()) as Payload;
    return typeof payload.exp === "number" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

/** Session-id fra et gyldigt token, ellers null. */
export function sessionIdFraToken(token: string | undefined): string | null {
  if (!verifySessionToken(token)) return null;
  try {
    const payload = JSON.parse(Buffer.from(token!.split(".")[0], "base64").toString()) as Payload;
    return typeof payload.sid === "string" ? payload.sid : null;
  } catch {
    return null;
  }
}

/**
 * Fortsæt-token (Michael 2026-11-02): lader brugeren genoptage en påbegyndt
 * session, enten fra samme browser (localStorage) eller via et link sendt til
 * deres e-mail. Signeret med samme hemmelighed, men med eget formål ("g"), så
 * et almindeligt session-token ikke kan bruges som fortsæt-token og omvendt.
 */
const GENOPTAG_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function issueGenoptagToken(sid: string): string {
  const body = b64url(Buffer.from(JSON.stringify({ sid, exp: Date.now() + GENOPTAG_TTL_MS, k: "g" })));
  return `${body}.${sign(`g.${body}`, secret())}`;
}

/** sid fra et gyldigt fortsæt-token, ellers null. */
export function verifyGenoptagToken(token: string | undefined): string | null {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = sign(`g.${body}`, secret());
  if (!sig || sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64").toString()) as { sid?: string; exp?: number; k?: string };
    return p.k === "g" && typeof p.sid === "string" && typeof p.exp === "number" && p.exp > Date.now() ? p.sid : null;
  } catch {
    return null;
  }
}
