#!/usr/bin/env node
/**
 * CLI-harness for AI Proficiency Snapshot Trin 2 (jf. CLI-testbarheds-reglen).
 *
 *   node scripts/ai-niveau-cli.mjs [--base http://localhost:3000]
 *       [--env copilot|aaben|begge] [--level 2] [--role "..."] [--case "..."]
 *
 * Rammer /api/ai-niveau/plan (samme vej som browseren) og printer den
 * skræddersyede plan. Kræver ANTHROPIC_API_KEY i serverens miljø.
 */

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const base = flag("base", "http://localhost:3000");
const payload = {
  level: Number(flag("level", "2")),
  levelName: flag("levelName", "Den Daglige bruger"),
  env: flag("env", "copilot"),
  weak: flag("weak", "Automation & agenter"),
  role: flag("role", "HR-partner i en mellemstor dansk virksomhed"),
  tasks: flag("tasks", "Screener ansøgninger og skriver referater fra samtaler"),
  aiToday: flag("aiToday", "Bruger Copilot i Word til at rette mine egne tekster"),
  case: flag("case", "Jeg bruger en hel formiddag på at samle noter fra fem samtaler"),
};

const res = await fetch(`${base}/api/ai-niveau/plan`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
const data = await res.json();
if (!res.ok || !data.plan) {
  console.error(`FEJL (${res.status}):`, data.error ?? data);
  process.exit(1);
}
console.log(data.plan);
