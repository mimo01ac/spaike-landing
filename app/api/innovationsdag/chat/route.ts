/**
 * Chat-route: streamer Claude (Haiku 4.5) til discovery-agenten.
 *
 * Sikkerhed (cost/abuse):
 *  - Kræver gyldigt, ikke-udløbet session-token fra gate-routen.
 *  - Tur-loft: afviser hvis samtalen overstiger MAX_TURNS bruger-ture.
 *  - Størrelses-guard: afviser urimeligt store payloads.
 *  - Best-effort per-IP rate-limit (defense in depth).
 *
 * Protokol til klienten: NDJSON (én JSON pr. linje):
 *   {"type":"text","text":"..."}   løbende svar-tekst
 *   {"type":"brief","brief":{...}}  den færdige case-brief (tool-kald)
 *   {"type":"error","error":"..."}
 *   {"type":"done"}
 *
 * Prompt caching: cache_control på system+tool (stort stabilt prefix) og på
 * sidste besked (inkrementel caching af den voksende historik).
 */

import Anthropic from "@anthropic-ai/sdk";
import { verifySessionToken } from "@/lib/sessionToken";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import {
  MODEL,
  MAX_TOKENS,
  MAX_TURNS,
  SYSTEM_PROMPT,
  BRIEF_TOOL,
  BRIEF_TOOL_NAME,
} from "@/app/ai-innovationsdag/_config/agent";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_PAYLOAD_CHARS = 60_000;

type ClientMsg = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const ip = clientIp(req);

  // Maks. 60 chat-kald pr. IP / 5 min.
  const rl = checkRateLimit(`chat:${ip}`, 60, 5 * 60 * 1000);
  if (!rl.allowed) {
    return json({ type: "error", error: "For mange anmodninger. Vent lidt." }, 429);
  }

  let body: { token?: string; messages?: ClientMsg[] };
  try {
    body = await req.json();
  } catch {
    return json({ type: "error", error: "Ugyldig anmodning." }, 400);
  }

  if (!verifySessionToken(body.token)) {
    return json({ type: "error", error: "Sessionen er udløbet. Genindlæs siden." }, 401);
  }

  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (messages.length === 0) {
    return json({ type: "error", error: "Ingen beskeder." }, 400);
  }

  const userTurns = messages.filter((m) => m.role === "user").length;
  if (userTurns > MAX_TURNS) {
    return json(
      { type: "error", error: "Samtalen er blevet for lang. Start forfra for en ny brief." },
      429,
    );
  }

  const totalChars = messages.reduce((n, m) => n + (m.content?.length ?? 0), 0);
  if (totalChars > MAX_PAYLOAD_CHARS) {
    return json({ type: "error", error: "Beskeden er for stor." }, 413);
  }

  // Byg Anthropic-beskeder; cache_control på sidste besked (inkrementel caching).
  const anthropicMessages: Anthropic.MessageParam[] = messages.map((m, i) => {
    const isLast = i === messages.length - 1;
    return {
      role: m.role,
      content: isLast
        ? [{ type: "text", text: m.content, cache_control: { type: "ephemeral" } }]
        : m.content,
    };
  });

  const client = new Anthropic();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) =>
        controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
      try {
        const claudeStream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: [
            { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
          ],
          tools: [BRIEF_TOOL],
          messages: anthropicMessages,
        });

        claudeStream.on("text", (delta) => send({ type: "text", text: delta }));

        const final = await claudeStream.finalMessage();
        const briefBlock = final.content.find(
          (b): b is Anthropic.ToolUseBlock =>
            b.type === "tool_use" && b.name === BRIEF_TOOL_NAME,
        );
        if (briefBlock) {
          send({ type: "brief", brief: briefBlock.input });
        }
        send({ type: "done" });
      } catch (e) {
        console.error("Claude stream-fejl:", (e as Error).message);
        send({ type: "error", error: "Der opstod en fejl. Prøv igen." });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function json(obj: unknown, status: number) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
