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

  let body: {
    token?: string;
    messages?: ClientMsg[];
    companyContext?: string;
    companyName?: string;
  };
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

  // System-prompt + valgfri virksomheds-kontekst (fra research-routen).
  const system: Anthropic.TextBlockParam[] = [
    { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
  ];
  // Vist-navn udledt af website-domænet klient-side. Er der med det samme
  // (modsat researchen, som er asynkron), så åbningen kan nævne virksomheden.
  const companyName = String(body.companyName ?? "")
    .replace(/[\r\n"]/g, "")
    .trim()
    .slice(0, 60);
  if (companyName) {
    system.push({
      type: "text",
      text: `VIRKSOMHEDSNAVN: Brugeren kommer fra virksomheden "${companyName}" (navnet er udledt af deres website-domæne og kan afvige let fra det officielle navn). Brug navnet naturligt i din åbning og undervejs.`,
    });
  }
  const ctx = (body.companyContext ?? "").trim();
  if (ctx) {
    system.push({
      type: "text",
      text:
        `KONTEKST OM VIRKSOMHEDEN (research fra deres website, indtastet på forhånd):\n${ctx.slice(0, 4000)}\n\n` +
        `Brug konteksten til at åbne med forståelse for deres branche. Spring spørgsmål over som konteksten allerede besvarer (fx hvad virksomheden laver). Bekræft kort din forståelse af branchen frem for at udspørge om den.`,
    });
  }

  const client = new Anthropic();

  const encoder = new TextEncoder();
  let claudeStream: ReturnType<Anthropic["messages"]["stream"]> | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const safeClose = () => {
        if (closed) return;
        closed = true;
        try {
          controller.close();
        } catch {
          /* allerede lukket */
        }
      };
      // Guard mod enqueue på en lukket/afbrudt controller (klienten kan droppe
      // forbindelsen mens Claude stadig streamer).
      const send = (obj: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
        } catch {
          closed = true;
        }
      };
      try {
        claudeStream = client.messages.stream({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system,
          tools: [BRIEF_TOOL],
          messages: anthropicMessages,
        });

        claudeStream.on("text", (delta: string) => send({ type: "text", text: delta }));

        const final: Anthropic.Message = await claudeStream.finalMessage();
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
        safeClose();
      }
    },
    cancel() {
      // Klienten afbrød: stop Claude-streamen så vi ikke spilder tokens.
      try {
        claudeStream?.abort();
      } catch {
        /* ignore */
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
