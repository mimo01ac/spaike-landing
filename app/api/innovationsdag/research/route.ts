/**
 * Research-route: tager en virksomheds website (valgfrit, fra intro-skærmen),
 * slår det op via Anthropics web_fetch-værktøj (Anthropic henter siden, så der
 * er ingen SSRF på vores infrastruktur), og returnerer en kort dansk kontekst
 * om virksomhed + branche + typiske processer. Bruges til at give discovery-
 * agenten kontekst, så den ikke starter fra Adam og Eva.
 *
 * Kræver session-token (fra /start). Rate-limited. Fejler blødt: kan vi ikke
 * researche, returnerer vi tom kontekst, og flowet fortsætter uden.
 */

import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/sessionToken";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 30;

// Research-kaldet kører på Sonnet (bedre kontekst-ekstraktion); chatten er Haiku.
const RESEARCH_MODEL = "claude-sonnet-4-6";

function normalizeUrl(raw: string): string | null {
  const v = raw.trim();
  if (!v) return null;
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withProto);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname.includes(".")) return null;
    return u.toString();
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`research:${ip}`, 15, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ context: "" }, { status: 200 });
  }

  let body: { token?: string; url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ context: "" });
  }

  if (!verifySessionToken(body.token)) {
    return NextResponse.json({ error: "Sessionen er udløbet." }, { status: 401 });
  }

  const url = normalizeUrl(body.url ?? "");
  if (!url) return NextResponse.json({ context: "" });

  try {
    const client = new Anthropic();
    const messages: Anthropic.MessageParam[] = [
      {
        role: "user",
        content: `Slå op på denne virksomheds website og giv mig en kort kontekst på dansk, så jeg kan forstå dem inden en samtale. Svar i 4-5 korte bullets: hvad laver de, hvilken branche, og hvilke typiske operationelle processer eller problemer i den branche kunne egne sig til en en-dags AI-innovationsdag. Hold det faktuelt og kort. Hvis siden ikke kan læses, så svar kun "INGEN". Website: ${url}`,
      },
    ];

    let resp = await client.messages.create({
      model: RESEARCH_MODEL,
      max_tokens: 700,
      tools: [{ type: "web_fetch_20260209", name: "web_fetch", max_uses: 3 }],
      messages,
    });

    // Server-tool-loop: fortsæt mens modellen henter (pause_turn).
    let guard = 0;
    while (resp.stop_reason === "pause_turn" && guard < 3) {
      guard += 1;
      messages.push({ role: "assistant", content: resp.content });
      resp = await client.messages.create({
        model: RESEARCH_MODEL,
        max_tokens: 700,
        tools: [{ type: "web_fetch_20260209", name: "web_fetch", max_uses: 3 }],
        messages,
      });
    }

    const text = resp.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim();

    if (!text || /^INGEN/i.test(text)) {
      return NextResponse.json({ context: "" });
    }
    return NextResponse.json({ context: text });
  } catch (e) {
    console.error("research fejlede:", (e as Error).message);
    return NextResponse.json({ context: "" });
  }
}
