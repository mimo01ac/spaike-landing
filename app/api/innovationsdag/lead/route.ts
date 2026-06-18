/**
 * Lead-route: slut-steppet efter case-briefen er produceret.
 *
 * Brugeren skriver navn + mail for at få briefen + DIY-guiden tilsendt, og kan
 * krydse af at de gerne vil høre om hjælp til at køre en innovationsdag (pilot).
 * Dette er det ENESTE sted vi persisterer persondata, og kun med samtykke
 * (GDPR: ingen lagring uden eksplicit samtykke).
 *
 * - Opretter altid en discovery_sessions-record (lead + transcript + brief).
 * - Hvis want_help: opretter også en applications-record.
 *
 * TODO (Michael): faktisk mail-afsendelse af rapport + guide kræver en mail-
 * udbyder (fx Resend). Indtil da fanges leadet her, og mailen sendes manuelt
 * eller via en senere integration.
 */

import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/sessionToken";
import { createRecord } from "@/lib/pocketbase";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  token?: string;
  name?: string;
  email?: string;
  company?: string;
  website?: string;
  consent?: boolean;
  want_help?: boolean;
  case_brief?: unknown;
  transcript?: unknown;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig anmodning." }, { status: 400 });
  }

  if (!verifySessionToken(body.token)) {
    return NextResponse.json({ error: "Sessionen er udløbet. Genindlæs siden." }, { status: 401 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const company = (body.company ?? "").trim();
  const website = (body.website ?? "").trim().slice(0, 300);
  const wantHelp = body.want_help === true;

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

  try {
    await createRecord("discovery_sessions", {
      name,
      email,
      company,
      website,
      consent: true,
      path_chosen: wantHelp ? "apply" : "diy",
      case_brief: body.case_brief ?? null,
      transcript: body.transcript ?? null,
    });

    if (wantHelp) {
      await createRecord("applications", {
        name,
        email,
        company,
        website,
        consent: true,
        case_brief: body.case_brief ?? null,
        notes: "Via discovery-tool: ønsker hjælp til at køre en innovationsdag.",
        status: "new",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("lead create fejlede:", (e as Error).message);
    return NextResponse.json({ error: "Kunne ikke gemme. Prøv igen." }, { status: 500 });
  }
}
