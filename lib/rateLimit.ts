/**
 * Best-effort in-memory per-IP rate limiter.
 *
 * NB: På Vercel serverless deles state ikke pålideligt på tværs af
 * instanser/cold starts, så dette er defense-in-depth, ikke den primære
 * beskyttelse. De stateless lag (Turnstile-gate + signeret session-token +
 * tur-loft i payloaden) er det der reelt holder. Vil man have hård,
 * distribueret rate-limiting, så skift til Vercel KV / Upstash Redis.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { allowed: boolean; retryAfterMs: number } {
  // E2E-suiten laver langt flere sideloads fra 127.0.0.1 end en rigtig bruger.
  // Sættes KUN af Playwrights webServer (playwright.config.ts), aldrig i prod.
  if (process.env.DISABLE_RATE_LIMIT === "1") {
    return { allowed: true, retryAfterMs: 0 };
  }
  const now = Date.now();
  const b = buckets.get(key);

  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }

  if (b.count >= limit) {
    return { allowed: false, retryAfterMs: b.resetAt - now };
  }

  b.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}

/** Hiv klient-IP ud af request-headers (Vercel/proxy). */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
