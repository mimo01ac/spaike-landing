/**
 * Cloudflare Turnstile server-side verifikation.
 * Bruges på gate-routen for at sikre at en rigtig browser (ikke en bot)
 * starter en session, før vi udsteder et session-token til chat-routen.
 *
 * Hvis TURNSTILE_SECRET_KEY ikke er sat OG vi ikke er i produktion, springes
 * verifikationen over (så lokal udvikling virker før Michael har oprettet
 * widget'en). I produktion er den påkrævet.
 */

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string,
): Promise<{ ok: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, reason: "turnstile_not_configured" };
    }
    // Dev uden secret: tillad.
    return { ok: true };
  }

  if (!token) return { ok: false, reason: "missing_token" };

  const form = new URLSearchParams();
  form.append("secret", secret);
  form.append("response", token);
  if (remoteIp) form.append("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, { method: "POST", body: form });
    const data = (await res.json()) as { success: boolean };
    return data.success ? { ok: true } : { ok: false, reason: "failed" };
  } catch {
    return { ok: false, reason: "verify_error" };
  }
}
