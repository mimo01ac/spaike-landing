/**
 * AI-niveau Trin 2: skræddersyet plan.
 *
 * Tager brugerens interview-kontekst (niveau, miljø/adgang, rolle, opgaver,
 * nuværende AI-brug, én konkret case) og får Claude til at skrive en
 * skræddersyet plan, grundet i automatiserings-biblioteket. Respekterer deres
 * miljø (anbefaler aldrig noget de ikke kan i fx Copilot) og har altid en
 * team-løft-vinkel. Porteret fra prototypens Python-backend (spaike-pa).
 *
 * POST { level, levelName, env, weak, role, tasks, aiToday, case } -> { plan }
 *
 * CLI: `node scripts/ai-niveau-cli.mjs plan --base <url>` rammer denne sti.
 */

import Anthropic from "@anthropic-ai/sdk";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = process.env.SPAIKE_PROFICIENCY_MODEL || "claude-haiku-4-5";
const MAX_TOKENS = 1200;
const FIELD_CAP = 1200; // pr. fritekst-felt
const MAX_PAYLOAD_CHARS = 8000;

/** Kondenseret automatiserings-bibliotek (grundlag for anbefalinger). */
const LIBRARY = `
Niveau 1→2: genbrugelig prompt-skabelon [begge]; opsummer/udtræk fra dokumenter [begge]; skriv/omskriv i din tone [begge].
Niveau 2→3: dokument→struktureret data (Excel-klar tabel) [begge]; møde→noter+opgaver (Copilot Teams / Fireflies) [begge]; vidensbase/"brain" AI trækker fra (SharePoint/Copilot-agent el. Claude/ChatGPT Projects) [begge].
Niveau 3→4: planlagt/ugentligt brief (Copilot Studio el. n8n/Make) [begge]; trigger-drevet handling (Power Automate el. Make/Zapier) [begge]; indbakke-triage-agent (Copilot Outlook) [begge]; data ind/ud via integration (MCP/API) [åben stak].
Niveau 4→skalering: delt skill/agent for afdelingen (Copilot Studio / Claude skill) [begge]; eval/learning-loop [åben stak]; governance & sikkerhed [begge].
`.trim();

const SYSTEM = `Du er SpAIkes AI-modenheds-rådgiver. Du skriver en KORT, konkret, skræddersyet plan til en person, der lige har taget en AI-proficiency-test og delt lidt om sin hverdag.

Regler:
- Skriv på naturligt, korrekt dansk, jeg-form fra SpAIke (solo-virksomhed). UDELUKKENDE dansk, ingen engelske ord/vendinger, ingen emojis, ingen amerikanske tankestreger (— eller –); brug komma/punktum/kolon/parentes.
- FORANKRÉ alt i personens konkrete case og opgaver. Ikke generisk "du kan bruge AI til noget".
- Brug deres NUVÆRENDE AI-brug som springbræt til næste niveau.
- RESPEKTÉR deres adgang/miljø: anbefal ALDRIG noget de ikke kan. Er de låst til Microsoft Copilot, hold dig til Copilot-mulige ting (Copilot i Word/Excel/Teams/Outlook, Copilot Studio, Power Automate, SharePoint-agenter). Har de fri stak, må du bruge ChatGPT/Claude/Zapier/Make/n8n/MCP.
- Vælg 3-4 relevante mønstre fra biblioteket herunder, tilpasset deres niveau + case.
- Hver anbefaling: 1 linje hvad + 2-3 KONKRETE step-by-step trin + et lille eksempel de kan prøve på deres egen case.
- Slut ALTID med en kort "Løft det til teamet"-vinkel (fra din egen instans til en delt skill, så viden kodificeres centralt), hvor det er relevant.
- Afslut med én blød linje: at de er velkomne til at tage en snak med Michael/SpAIke hvis de vil have det bygget rigtigt.
- Længde: max ~350 ord. Brug markdown med korte overskrifter og punktlister.

Automatiserings-bibliotek (vælg fra dette, respektér [miljø]-mærket):
${LIBRARY}`;

const ENV_TEXT: Record<string, string> = {
  copilot: "Låst til Microsoft Copilot",
  aaben: "Fri stak (ChatGPT/Claude/Zapier/n8n)",
  begge: "Har begge / ved ikke",
};

function clip(v: unknown, n: number): string {
  return String(v ?? "").slice(0, n).trim();
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`ai-niveau-plan:${ip}`, 30, 60 * 60 * 1000);
  if (!rl.allowed) {
    return json({ error: "For mange forespørgsler. Prøv igen senere." }, 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Ugyldig anmodning." }, 400);
  }

  const role = clip(body.role, FIELD_CAP);
  const tasks = clip(body.tasks, FIELD_CAP);
  const aiToday = clip(body.aiToday, FIELD_CAP);
  const caseText = clip(body.case, FIELD_CAP);
  if (!role && !tasks && !aiToday && !caseText) {
    return json({ error: "Udfyld mindst ét felt, så jeg kan bygge planen." }, 400);
  }
  if (role.length + tasks.length + aiToday.length + caseText.length > MAX_PAYLOAD_CHARS) {
    return json({ error: "Beskeden er for stor." }, 413);
  }

  const lvl = clip(body.level, 4) || "?";
  const lvlName = clip(body.levelName, 60);
  const env = ENV_TEXT[clip(body.env, 20)] || "ukendt";
  const weak = clip(body.weak, 60);

  const user = `Testresultat: niveau ${lvl} af 4 (${lvlName}). Svageste område: ${weak}.
Adgang/miljø: ${env}.
Rolle / hvad de arbejder med: ${role || "ikke oplyst"}
Tungeste/gentagne opgaver: ${tasks || "ikke oplyst"}
Hvordan de bruger AI i dag: ${aiToday || "ikke oplyst"}
Én konkret case de sidder med: ${caseText || "ikke oplyst"}

Skriv en skræddersyet plan der løfter dem fra niveau ${lvl} mod næste niveau, forankret i casen ovenfor, tilpasset deres miljø.`;

  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM,
      messages: [{ role: "user", content: user }],
    });
    const plan = msg.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    if (!plan) return json({ error: "Kunne ikke bygge planen. Prøv igen." }, 502);
    return json({ plan }, 200);
  } catch (e) {
    console.error("ai-niveau plan-fejl:", (e as Error).message);
    return json({ error: "Der opstod en fejl. Prøv igen." }, 502);
  }
}

function json(obj: unknown, status: number) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
