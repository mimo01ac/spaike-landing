/**
 * Session-route: opdaterer discovery_sessions-recorden med transcript,
 * case_brief og/eller valgt vej (diy/apply/none). Kaldes når briefen er
 * produceret og når brugeren vælger en vej.
 */

import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/sessionToken";
import { createRecord, updateRecord } from "@/lib/pocketbase";

export const runtime = "nodejs";

type Body = {
  token?: string;
  recordId?: string | null;
  transcript?: unknown;
  case_brief?: unknown;
  path_chosen?: "diy" | "apply" | "none";
  company?: string;
  size?: string;
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

  const data: Record<string, unknown> = {};
  if (body.transcript !== undefined) data.transcript = body.transcript;
  if (body.case_brief !== undefined) data.case_brief = body.case_brief;
  if (body.path_chosen) data.path_chosen = body.path_chosen;
  if (body.company) data.company = body.company;
  if (body.size) data.size = body.size;

  try {
    if (body.recordId) {
      await updateRecord("discovery_sessions", body.recordId, data);
      return NextResponse.json({ recordId: body.recordId });
    }
    const id = await createRecord("discovery_sessions", data);
    return NextResponse.json({ recordId: id });
  } catch (e) {
    console.error("session update fejlede:", (e as Error).message);
    // Persistering må ikke vælte brugeroplevelsen.
    return NextResponse.json({ recordId: body.recordId ?? null }, { status: 200 });
  }
}
