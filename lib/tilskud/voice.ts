/**
 * ElevenLabs Agents-adapter for stemme-tilstanden i /tilskud. ENESTE sted der
 * taler med api.elevenlabs.io (et motorskifte koster denne fil + agent-konfigen).
 *
 * Mønster fra voice-calling-agent: agenten er konfig som kode
 * (lib/tilskud/voice-agent.ts), synkes med `npm run tilskud:voice -- sync`,
 * og felterne læses tilbage, fordi ElevenLabs dropper ukendte felter lydløst.
 */

const BASE = "https://api.elevenlabs.io";

export function voiceKonfigureret(): boolean {
  return !!(process.env.ELEVENLABS_API_KEY && process.env.TILSKUD_VOICE_AGENT_ID);
}

export function agentId(): string {
  return process.env.TILSKUD_VOICE_AGENT_ID ?? "";
}

async function el<T = unknown>(method: string, path: string, body?: unknown, timeoutMs = 15000): Promise<T> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY mangler");
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "xi-api-key": key, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    const d = data as { detail?: { message?: string } | string } | null;
    const msg = typeof d?.detail === "string" ? d.detail : d?.detail?.message ?? text.slice(0, 300);
    throw new Error(`ElevenLabs ${method} ${path} -> ${res.status}: ${msg}`);
  }
  return data as T;
}

/** WebRTC-token til browseren + samtalens id (så serveren selv kender samtalen). */
export async function hentSamtaleToken(): Promise<{ token: string; conversationId: string | null }> {
  const r = await el<{ token: string; conversation_id?: string }>(
    "GET",
    `/v1/convai/conversation/token?agent_id=${encodeURIComponent(agentId())}`,
  );
  return { token: r.token, conversationId: r.conversation_id ?? null };
}

export interface SamtaleTur {
  role: "user" | "agent";
  message: string;
}

export interface Samtale {
  agentId: string;
  status: string;
  transcript: SamtaleTur[];
}

export async function hentSamtale(conversationId: string): Promise<Samtale> {
  const r = await el<{ agent_id?: string; status?: string; transcript?: { role: string; message?: string | null }[] }>(
    "GET",
    `/v1/convai/conversations/${encodeURIComponent(conversationId)}`,
  );
  return {
    agentId: r.agent_id ?? "",
    status: r.status ?? "",
    transcript: (r.transcript ?? [])
      .filter((t) => (t.role === "user" || t.role === "agent") && typeof t.message === "string" && t.message.trim())
      .map((t) => ({ role: t.role as "user" | "agent", message: String(t.message) })),
  };
}

// --- Agent-konfig (bruges af sync-scriptet) ---------------------------------

export interface AgentKonfig {
  name: string;
  tags?: string[];
  conversation_config: Record<string, unknown>;
  platform_settings?: Record<string, unknown>;
}

export async function opretAgent(cfg: AgentKonfig): Promise<string> {
  const r = await el<{ agent_id: string }>("POST", "/v1/convai/agents/create", cfg, 30000);
  return r.agent_id;
}

export async function opdaterAgent(id: string, cfg: AgentKonfig): Promise<void> {
  await el("PATCH", `/v1/convai/agents/${encodeURIComponent(id)}`, cfg, 30000);
}

export async function hentAgent(id: string): Promise<Record<string, unknown>> {
  return el("GET", `/v1/convai/agents/${encodeURIComponent(id)}`);
}

/** Felter vi sendte, som ElevenLabs gemte anderledes (eller droppede). */
export function diffKonfig(sendt: unknown, gemt: unknown, sti = ""): string[] {
  if (sendt && typeof sendt === "object" && !Array.isArray(sendt)) {
    const g = (gemt ?? {}) as Record<string, unknown>;
    return Object.entries(sendt as Record<string, unknown>).flatMap(([k, v]) =>
      diffKonfig(v, g[k], sti ? `${sti}.${k}` : k),
    );
  }
  if (Array.isArray(sendt)) {
    const g = Array.isArray(gemt) ? gemt : [];
    // Tools: match på navn, ikke position.
    if (sendt.every((x) => x && typeof x === "object" && "name" in x)) {
      return sendt.flatMap((x) => {
        const navn = (x as { name: string }).name;
        const match = g.find((y) => y && typeof y === "object" && (y as { name?: string }).name === navn);
        return match ? diffKonfig(x, match, `${sti}[${navn}]`) : [`${sti}[${navn}]: mangler i det gemte`];
      });
    }
  }
  return JSON.stringify(sendt) === JSON.stringify(gemt) ? [] : [`${sti}: sendt=${JSON.stringify(sendt)?.slice(0, 120)} gemt=${JSON.stringify(gemt)?.slice(0, 120)}`];
}

/**
 * Kør agenten mod en simuleret bruger (ingen mikrofon). simulate-conversation
 * blev fjernet 31-10-2026; afløseren er agent-testing: opret en simulationstest,
 * kør den, og poll invocation'en. Client tools mockes, så vi ser om agenten
 * kalder dem rigtigt. Testen slettes bagefter.
 */
export async function simulerSamtale(opts: {
  navn: string;
  scenarie: string;
  dynamiskeVariabler: Record<string, string>;
  succeskriterier: string[];
  maksTure?: number;
  /** A/B uden at ændre den live agent (run-tests' agent_config_override kræver hele konfigen). */
  override?: Pick<AgentKonfig, "conversation_config" | "platform_settings">;
}): Promise<{
  status: string;
  transcript: { role: string; message: string; tool_calls?: unknown[] }[];
  kriterier: unknown;
  raa: unknown;
}> {
  const test = await el<{ id: string }>("POST", "/v1/convai/agent-testing/create", {
    name: opts.navn,
    type: "simulation",
    simulation_scenario: opts.scenarie,
    simulation_max_turns: opts.maksTure ?? 30,
    success_conditions: opts.succeskriterier,
    dynamic_variables: opts.dynamiskeVariabler,
    tool_mock_config: { mocking_strategy: "all" },
  });
  try {
    const kørsel = await el<{ id: string }>("POST", `/v1/convai/agents/${encodeURIComponent(agentId())}/run-tests`, {
      tests: [{ test_id: test.id }],
      name: opts.navn,
      ...(opts.override ? { agent_config_override: opts.override } : {}),
    });
    type Run = { status?: string; agent_responses?: { role: string; message?: string | null; tool_calls?: unknown[] }[]; condition_result?: unknown };
    let run: Run = {};
    let raa: unknown = null;
    for (let i = 0; i < 80; i++) {
      await new Promise((r) => setTimeout(r, 5000));
      const inv = await el<{ test_runs?: Run[] }>("GET", `/v1/convai/test-invocations/${encodeURIComponent(kørsel.id)}`);
      raa = inv;
      run = inv.test_runs?.[0] ?? {};
      if (run.status && run.status !== "pending" && run.status !== "running") break;
    }
    return {
      status: run.status ?? "ukendt",
      transcript: (run.agent_responses ?? []).map((t) => ({ role: t.role, message: t.message ?? "", tool_calls: t.tool_calls })),
      kriterier: run.condition_result ?? null,
      raa,
    };
  } finally {
    await el("DELETE", `/v1/convai/agent-testing/${encodeURIComponent(test.id)}`).catch(() => undefined);
  }
}
