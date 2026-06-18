/**
 * Minimal server-side PocketBase-klient (fetch-baseret, ingen SDK-dependency).
 *
 * Authentikerer som superuser og cacher tokenet i memory indtil det udløber.
 * Kun til brug i server-routes (Node runtime). Læser creds fra env; må ALDRIG
 * importeres i klient-komponenter.
 */

const URL = process.env.POCKETBASE_URL;
const EMAIL = process.env.POCKETBASE_ADMIN_EMAIL;
const PASSWORD = process.env.POCKETBASE_ADMIN_PASSWORD;

let cachedToken: { token: string; exp: number } | null = null;

function decodeExp(jwt: string): number {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split(".")[1], "base64").toString());
    return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
  } catch {
    return 0;
  }
}

async function getToken(): Promise<string> {
  if (!URL || !EMAIL || !PASSWORD) {
    throw new Error("PocketBase env (URL/EMAIL/PASSWORD) mangler");
  }
  // Reuse hvis stadig gyldigt (med 60s margin)
  if (cachedToken && cachedToken.exp - 60_000 > Date.now()) {
    return cachedToken.token;
  }
  const res = await fetch(`${URL}/api/collections/_superusers/auth-with-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identity: EMAIL, password: PASSWORD }),
  });
  if (!res.ok) {
    throw new Error(`PocketBase auth fejlede: ${res.status}`);
  }
  const data = (await res.json()) as { token: string };
  cachedToken = { token: data.token, exp: decodeExp(data.token) || Date.now() + 600_000 };
  return data.token;
}

/** Opret en record i en collection. Returnerer record-id. */
export async function createRecord(
  collection: string,
  data: Record<string, unknown>,
): Promise<string> {
  const token = await getToken();
  const res = await fetch(`${URL}/api/collections/${collection}/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PocketBase create (${collection}) fejlede: ${res.status} ${body}`);
  }
  const rec = (await res.json()) as { id: string };
  return rec.id;
}

/** Opdater en record. */
export async function updateRecord(
  collection: string,
  id: string,
  data: Record<string, unknown>,
): Promise<void> {
  const token = await getToken();
  const res = await fetch(`${URL}/api/collections/${collection}/records/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PocketBase update (${collection}/${id}) fejlede: ${res.status} ${body}`);
  }
}
