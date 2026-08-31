/**
 * AI-tjek scan-route: POST { url } -> kører den deterministiske scanning
 * (INGEN LLM-kald, se lib/aiTjek.ts), gemmer resultatet i PocketBase og
 * returnerer { id } til den delbare rapportside.
 *
 * Guards: per-IP rate-limit + globalt dagsloft (best effort, in-memory) +
 * SSRF-guard i motoren. Ingen persondata gemmes ved scan.
 */

import { NextResponse } from "next/server";
import { koerTjek } from "@/lib/aiTjek";
import { createRecord } from "@/lib/pocketbase";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 30;

const DAGSLOFT = 200;
let dagsTaeller = { dag: "", antal: 0 };

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`aitjek:${ip}`, 10, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "For mange tjek fra din adresse. Prøv igen om lidt." },
      { status: 429 },
    );
  }

  const iDag = new Date().toISOString().slice(0, 10);
  if (dagsTaeller.dag !== iDag) dagsTaeller = { dag: iDag, antal: 0 };
  if (dagsTaeller.antal >= DAGSLOFT) {
    return NextResponse.json(
      { error: "Dagens kapacitet er brugt. Prøv igen i morgen." },
      { status: 429 },
    );
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig anmodning." }, { status: 400 });
  }

  const resultat = await koerTjek(body.url ?? "");
  if ("fejl" in resultat) {
    return NextResponse.json({ error: resultat.fejl }, { status: 400 });
  }
  dagsTaeller.antal += 1;

  try {
    const id = await createRecord("ai_tjek_scans", {
      url: resultat.url,
      domaene: resultat.domaene,
      score: resultat.score,
      checks: resultat.checks,
    });
    return NextResponse.json({ id, score: resultat.score });
  } catch (e) {
    console.error("ai-tjek: PB-gem fejlede:", (e as Error).message);
    return NextResponse.json(
      { error: "Kunne ikke gemme rapporten. Prøv igen." },
      { status: 500 },
    );
  }
}
