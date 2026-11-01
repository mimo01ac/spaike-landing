/**
 * Claude-adapter for Tilskudstjekket. Eneste sted i /tilskud der taler med
 * Anthropic SDK'et. Streamer tekst-deltaer og returnerer den strukturerede
 * vurdering, hvis agenten kaldte værktøjet.
 *
 * Prompt caching: cache_control på system-prompten (stort, stabilt prefix) og
 * på sidste besked (inkrementel caching af historikken).
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  KVALIFICERING_TOOL,
  KVALIFICERING_TOOL_NAME,
  MAX_TOKENS,
  MODEL,
  SYSTEM_PROMPT,
  VURDERING_TOOL,
  VURDERING_TOOL_NAME,
  understoetterEffort,
} from "./agent";
import type { ChatMsg, Kvalificering, Vurdering } from "./types";
import { erKomplet, manglendeFelter, normaliserKvalificering, normaliserVurdering, standardNaesteSkridt } from "./vurdering";

export interface TilskudChatHandle {
  /** Løses når Claude er færdig. `afskaaret` = max_tokens ramt midt i et tool-kald. */
  faerdig: Promise<{
    tekst: string;
    kvalificering: Kvalificering | null;
    vurdering: Vurdering | null;
    afskaaret: boolean;
  }>;
  /** Stop streamen (klienten forsvandt). */
  afbryd: () => void;
}

export function startTilskudChat(opts: {
  messages: ChatMsg[];
  /** Virksomhedskontekst fra CVR-opslaget (kan være tom). */
  kontekst: string;
  onText: (delta: string) => void;
}): TilskudChatHandle {
  const client = new Anthropic();

  const anthropicMessages: Anthropic.MessageParam[] = opts.messages.map((m, i) => {
    const sidste = i === opts.messages.length - 1;
    return {
      role: m.role,
      content: sidste
        ? [{ type: "text", text: m.content, cache_control: { type: "ephemeral" } }]
        : m.content,
    };
  });

  const system: Anthropic.TextBlockParam[] = [
    { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
  ];
  if (opts.kontekst.trim()) {
    system.push({
      type: "text",
      text: `CVR-KONTEKST (slået op automatisk, kan være ufuldstændig):\n${opts.kontekst.slice(0, 3000)}`,
    });
  } else {
    system.push({ type: "text", text: "CVR-KONTEKST: ingen (opslaget fejlede eller blev sprunget over)." });
  }

  const params: Anthropic.MessageStreamParams = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system,
    tools: [KVALIFICERING_TOOL, VURDERING_TOOL],
    messages: anthropicMessages,
    ...(understoetterEffort(MODEL) ? { output_config: { effort: "low" } } : {}),
  };

  const stream = client.messages.stream(params);
  stream.on("text", (delta: string) => opts.onText(delta));

  const faerdig = stream.finalMessage().then((final: Anthropic.Message) => {
    const tekst = final.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");
    const kval = final.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === KVALIFICERING_TOOL_NAME,
    );
    if (kval) {
      const kvalificering = normaliserKvalificering(kval.input);
      const afskaaret = final.stop_reason === "max_tokens" || !kvalificering.opsummering;
      return { tekst, kvalificering, vurdering: null, afskaaret };
    }
    const tool = final.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === VURDERING_TOOL_NAME,
    );
    if (!tool) return { tekst, kvalificering: null, vurdering: null, afskaaret: false };
    const vurdering = normaliserVurdering(tool.input);
    const mangler = manglendeFelter(vurdering);
    if (!vurdering.naeste_skridt.length) vurdering.naeste_skridt = standardNaesteSkridt(vurdering);
    const afskaaret = final.stop_reason === "max_tokens" || !erKomplet(vurdering);
    if (afskaaret || mangler.length) {
      console.warn("tilskud: vurdering", afskaaret ? "afskåret" : "med tomme felter", {
        stop_reason: final.stop_reason,
        output_tokens: final.usage.output_tokens,
        mangler,
      });
    }
    return { tekst, kvalificering: null, vurdering, afskaaret };
  });

  return {
    faerdig,
    afbryd: () => {
      try {
        stream.abort();
      } catch {
        /* ignore */
      }
    },
  };
}
