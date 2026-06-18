/**
 * Apply-route: opretter en ansøgning om gratis innovationsdag i PocketBase,
 * med den genererede case-brief auto-vedhæftet + GDPR-samtykke. Opdaterer
 * discovery_sessions-recorden til path_chosen="apply".
 */

import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/sessionToken";
import { createRecord, updateRecord } from "@/lib/pocketbase";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  token?: string;
  recordId?: string | null;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
  consent?: boolean;
  case_brief?: unknown;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig anmodning." }, { status: 400 });
  }

  if (!verifySessionToken(body.token)) {
    return NextResponse.json({ error: "Sessionen er udløbet." }, { status: 401 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  if (!name) return NextResponse.json({ error: "Udfyld dit navn." }, { status: 400 });
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Udfyld en gyldig e-mail." }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json(
      { error: "Du skal acceptere behandlingen af dine oplysninger." },
      { status: 400 },
    );
  }

  try {
    await createRecord("applications", {
      name,
      email,
      phone: (body.phone ?? "").trim(),
      company: (body.company ?? "").trim(),
      notes: (body.notes ?? "").trim(),
      consent: true,
      case_brief: body.case_brief ?? null,
      status: "new",
    });

    if (body.recordId) {
      await updateRecord("discovery_sessions", body.recordId, {
        path_chosen: "apply",
      }).catch(() => {});
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("application create fejlede:", (e as Error).message);
    return NextResponse.json(
      { error: "Kunne ikke sende ansøgningen. Prøv igen." },
      { status: 500 },
    );
  }
}
