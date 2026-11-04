/**
 * Tragt-rapport for /tilskud: hvor mange kommer ind, hvor falder de fra, og
 * hvor lang tid bruger de. Samler to kilder:
 *  - Umami (analytics.spaike.dk): besøg, tragt pr. unik besøgende, trin ved
 *    frafald og sekunder pr. trin (events fra app/tilskud/_components/tragt.ts).
 *  - PocketBase `tilskud_sessioner`: alle startede tjek server-side (også
 *    dem med adblocker), status, kanal og varighed. Testsessioner udelades.
 *
 * Brug:
 *   npm run tilskud:tragt [-- --fra 2026-11-04] [--til 2026-11-30] [--ud fil.html] [--json]
 * Kræver UMAMI_URL/UMAMI_USER/UMAMI_PASSWORD og PocketBase-creds i .env.local.
 */

import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { findRecords } from "../lib/pocketbase";

const WEBSITE_ID = "0b7517b0-d5a4-4785-aaff-009e05e85ba7";
const args = process.argv.slice(2);
const flag = (n: string, d?: string) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : d;
};

// Tragt-events gik live 2026-11-04; før det mangler formular-trinnet.
const fra = new Date(flag("fra", "2026-11-04")!);
const til = flag("til") ? new Date(flag("til")!) : new Date();
const UD = flag("ud", `${homedir()}/Desktop/tilskud-tragt.html`)!;

const TRIN: { navn: string; type: "path" | "event"; value: string }[] = [
  { navn: "Åbnede siden", type: "path", value: "/tilskud" },
  { navn: "Begyndte på formularen", type: "event", value: "tilskud_formular_begyndt" },
  { navn: "Startede tjekket", type: "event", value: "tilskud_start" },
  { navn: "Valgte tale eller chat", type: "event", value: "tilskud_kanal_valgt" },
  { navn: "Samtalen gik i gang", type: "event", value: "tilskud_samtale_begyndt" },
  { navn: "Fik kvalificering", type: "event", value: "tilskud_kvalificering_klar" },
  { navn: "Fik vurdering", type: "event", value: "tilskud_vurdering_klar" },
  { navn: "Resultat mailet", type: "event", value: "tilskud_lead_sendt" },
];

const TRIN_NAVN: Record<string, string> = {
  formular: "Formularen",
  start: "Efter start, før kanalvalg",
  kanal: "Efter kanalvalg, før første svar",
  samtale: "Midt i samtalen",
  kvalificering: "Efter kvalificering",
  forberedelse: "I forberedelsen",
  vurdering: "Efter vurdering, før mail",
};

async function umami() {
  const base = process.env.UMAMI_URL ?? "https://analytics.spaike.dk";
  const login = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ username: process.env.UMAMI_USER, password: process.env.UMAMI_PASSWORD }),
  });
  if (!login.ok) throw new Error(`Umami-login fejlede: ${login.status}`);
  const { token } = (await login.json()) as { token: string };
  const h = { Authorization: `Bearer ${token}`, "content-type": "application/json" };
  const qs = `startAt=${fra.getTime()}&endAt=${til.getTime()}`;
  const get = async <T>(p: string): Promise<T> => {
    const r = await fetch(`${base}/api/websites/${WEBSITE_ID}/${p}${p.includes("?") ? "&" : "?"}${qs}`, { headers: h });
    if (!r.ok) throw new Error(`Umami ${p}: ${r.status}`);
    return r.json() as Promise<T>;
  };
  const vaerdier = (event: string, prop: string) =>
    get<{ value: string; total: number }[]>(`event-data/values?event=${event}&propertyName=${prop}`);

  const side = await get<{ pageviews: number; visitors: number; visits: number; bounces: number; totaltime: number }>(
    "stats?path=eq./tilskud",
  );
  const funnelRes = await fetch(`${base}/api/reports/funnel`, {
    method: "POST",
    headers: h,
    body: JSON.stringify({
      websiteId: WEBSITE_ID,
      type: "funnel",
      filters: {},
      parameters: {
        startDate: fra.toISOString(),
        endDate: til.toISOString(),
        window: 240,
        steps: TRIN.map(({ type, value }) => ({ type, value })),
      },
    }),
  });
  if (!funnelRes.ok) throw new Error(`Umami funnel: ${funnelRes.status}`);
  const tragt = (await funnelRes.json()) as { visitors: number }[];

  const [forladtTrin, forladtSek, kanal, sekKval, sekVurd, sekLead, opkald] = await Promise.all([
    vaerdier("tilskud_forladt", "trin"),
    vaerdier("tilskud_forladt", "sekunder"),
    vaerdier("tilskud_kanal_valgt", "kanal"),
    vaerdier("tilskud_kvalificering_klar", "sekunder"),
    vaerdier("tilskud_vurdering_klar", "sekunder"),
    vaerdier("tilskud_lead_sendt", "sekunder"),
    vaerdier("tilskud_voice_slut", "opkald_sekunder"),
  ]);
  return { side, tragt, forladtTrin, forladtSek, kanal, sekKval, sekVurd, sekLead, opkald };
}

type Sess = { id: string; created: string; updated: string; status: string; kanal: string; egnethed: string; virksomhed: string };

async function sessioner(): Promise<Sess[]> {
  const iso = (d: Date) => d.toISOString().replace("T", " ");
  return findRecords<Sess>(
    "tilskud_sessioner",
    `test=false && created>="${iso(fra)}" && created<="${iso(til)}"`,
    "-created",
    500,
  );
}

/** Median af en værdi/antal-fordeling (Umami event-data) eller en talliste. */
function median(v: { value: string; total: number }[] | number[]): number | null {
  const tal = (typeof v[0] === "number"
    ? (v as number[])
    : (v as { value: string; total: number }[]).flatMap((x) => Array(x.total).fill(Number(x.value)))
  ).filter((n) => Number.isFinite(n)).sort((a, b) => a - b);
  if (!tal.length) return null;
  const m = Math.floor(tal.length / 2);
  return tal.length % 2 ? tal[m] : Math.round((tal[m - 1] + tal[m]) / 2);
}

const tid = (s: number | null) => (s === null ? "ingen data" : s < 60 ? `${s} sek.` : `${Math.floor(s / 60)} min. ${s % 60} sek.`);
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : "-");
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

async function main() {
  const [u, s] = await Promise.all([umami(), sessioner()]);
  const varighed = (x: Sess) => Math.round((Date.parse(x.updated) - Date.parse(x.created)) / 1000);
  const statusTael = (st: string) => s.filter((x) => (x.status || "startet") === st).length;
  const data = {
    periode: { fra: fra.toISOString(), til: til.toISOString() },
    side: {
      ...u.side,
      bounce_pct: u.side.visits ? Math.round((u.side.bounces / u.side.visits) * 100) : null,
      sek_pr_besoeg: u.side.visits ? Math.round(u.side.totaltime / u.side.visits) : null,
    },
    tragt: TRIN.map((t, i) => ({ trin: t.navn, besoegende: u.tragt[i]?.visitors ?? 0 })),
    frafald: u.forladtTrin.map((x) => ({ trin: x.value, antal: x.total })).sort((a, b) => b.antal - a.antal),
    median_sek: {
      ved_frafald: median(u.forladtSek),
      til_kvalificering: median(u.sekKval),
      til_vurdering: median(u.sekVurd),
      til_mail: median(u.sekLead),
      stemmeopkald: median(u.opkald),
    },
    kanal: Object.fromEntries(u.kanal.map((x) => [x.value, x.total])),
    sessioner: {
      i_alt: s.length,
      startet: statusTael("startet"),
      kvalificeret: statusTael("kvalificeret"),
      vurderet: statusTael("vurderet"),
      lead: statusTael("lead"),
      chat: s.filter((x) => x.kanal === "chat").length,
      stemme: s.filter((x) => x.kanal === "stemme").length,
      median_varighed_sek: median(s.filter((x) => x.kanal).map(varighed)),
    },
  };

  if (args.includes("--json")) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  const top = data.tragt[0].besoegende;
  const tragtRaekker = data.tragt
    .map((t, i) => {
      const forrige = i ? data.tragt[i - 1].besoegende : t.besoegende;
      const bredde = top ? Math.max(2, Math.round((t.besoegende / top) * 100)) : 2;
      return `<tr><td>${esc(t.trin)}</td><td class="tal">${t.besoegende}</td><td><div class="bar"><span style="width:${bredde}%"></span></div></td><td class="tal">${i ? pct(t.besoegende, forrige) : ""}</td><td class="tal muted">${pct(t.besoegende, top)}</td></tr>`;
    })
    .join("");
  const frafaldRaekker = data.frafald.length
    ? data.frafald.map((f) => `<tr><td>${esc(TRIN_NAVN[f.trin] ?? f.trin)}</td><td class="tal">${f.antal}</td></tr>`).join("")
    : `<tr><td colspan="2" class="muted">Ingen registreret frafald i perioden endnu.</td></tr>`;
  const sessRaekker = s
    .slice(0, 15)
    .map(
      (x) =>
        `<tr><td>${new Date(x.created).toLocaleString("da-DK", { timeZone: "Europe/Copenhagen", dateStyle: "short", timeStyle: "short" })}</td><td>${esc(x.virksomhed || "-")}</td><td>${esc(x.kanal || "-")}</td><td>${esc(x.status || "startet")}</td><td class="tal">${x.kanal ? tid(varighed(x)) : "-"}</td></tr>`,
    )
    .join("");
  const kort = (titel: string, vaerdi: string, under = "") =>
    `<div class="kort"><div class="label">${titel}</div><div class="vaerdi">${vaerdi}</div>${under ? `<div class="under">${under}</div>` : ""}</div>`;
  const dato = (d: Date) => d.toLocaleDateString("da-DK", { day: "numeric", month: "long", year: "numeric" });

  const html = `<!doctype html><html lang="da"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tilskudstjek: tragt og tid</title>
<style>
:root{--ink:#0f1a2e;--soft:#3a3f4e;--cream:#faf7f0;--deep:#f1ece1;--rule:#e2dccf;--amber:#d4a857;--amberd:#b88f3f;--muted:#7a7f8c}
*{box-sizing:border-box}body{margin:0;background:var(--cream);color:var(--ink);font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.wrap{max-width:960px;margin:0 auto;padding:48px 28px 80px}
.eyebrow{font:11px/1 ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
h1{font:600 34px/1.15 Georgia,serif;margin:10px 0 6px}h2{font:600 21px/1.2 Georgia,serif;margin:44px 0 6px}
p.lead{color:var(--soft);margin:0 0 28px}.muted{color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:14px}
.kort{background:#fff;border:1px solid var(--rule);border-radius:6px;padding:16px 18px}.label{font-size:12.5px;color:var(--muted)}
.vaerdi{font:600 26px/1.2 Georgia,serif;margin-top:4px}.under{font-size:12.5px;color:var(--soft);margin-top:2px}
table{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--rule);border-radius:6px;overflow:hidden;margin-top:12px}
th,td{text-align:left;padding:10px 14px;border-bottom:1px solid var(--rule);font-size:14px}th{background:var(--deep);font-weight:600;font-size:12.5px;color:var(--soft)}
tr:last-child td{border-bottom:0}.tal{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.bar{background:var(--deep);height:10px;border-radius:5px;min-width:140px}.bar span{display:block;height:10px;border-radius:5px;background:var(--amber)}
.note{font-size:13px;color:var(--soft);margin-top:10px}a{color:var(--amberd)}
</style></head><body><div class="wrap">
<div class="eyebrow">SpAIke · Tilskudstjek</div>
<h1>Tragt og tid på /tilskud</h1>
<p class="lead">${dato(fra)} til ${dato(til)}. Kilder: Umami (besøg og trin) og de gemte sessioner i PocketBase (testkørsler er udeladt).</p>

<div class="grid">
${kort("Besøgende på siden", String(data.side.visitors), `${data.side.visits} besøg, ${data.side.pageviews} sidevisninger`)}
${kort("Gik videre fra siden", data.side.bounce_pct === null ? "-" : `${100 - data.side.bounce_pct} %`, `${data.side.bounce_pct ?? "-"} % forlod siden uden at gøre noget`)}
${kort("Tid pr. besøg", tid(data.side.sek_pr_besoeg), "gennemsnit for siden")}
${kort("Startede tjek (server)", String(data.sessioner.i_alt), `${data.sessioner.lead} fik resultatet mailet`)}
</div>

<h2>Tragten</h2>
<p class="muted">Unikke besøgende, der nåede hvert trin i rækkefølge (inden for fire timer). Kolonnen "af forrige" viser, hvor mange der gik videre fra trinnet før.</p>
<table><thead><tr><th>Trin</th><th class="tal">Besøgende</th><th></th><th class="tal">Af forrige</th><th class="tal">Af alle</th></tr></thead><tbody>${tragtRaekker}</tbody></table>

<h2>Hvor falder de fra</h2>
<p class="muted">Registreres, når nogen lukker eller forlader siden midt i flowet. Median tid før de gik: ${tid(data.median_sek.ved_frafald)}.</p>
<table><thead><tr><th>Forlod siden</th><th class="tal">Antal</th></tr></thead><tbody>${frafaldRaekker}</tbody></table>

<h2>Tid brugt</h2>
<div class="grid" style="margin-top:12px">
${kort("Til kvalificering", tid(data.median_sek.til_kvalificering), "median fra formularen")}
${kort("Til vurdering", tid(data.median_sek.til_vurdering), "median fra formularen")}
${kort("Til mailet resultat", tid(data.median_sek.til_mail), "median fra formularen")}
${kort("Stemmeopkald", tid(data.median_sek.stemmeopkald), "median længde")}
${kort("Session (server)", tid(data.sessioner.median_varighed_sek), "median fra start til sidste svar")}
</div>

<h2>Tale eller chat</h2>
<div class="grid" style="margin-top:12px">
${kort("Valgte tale", String(data.kanal.stemme ?? 0), `${data.sessioner.stemme} sessioner gemt`)}
${kort("Valgte chat", String(data.kanal.chat ?? 0), `${data.sessioner.chat} sessioner gemt`)}
${kort("Kvalificeret / vurderet", `${data.sessioner.kvalificeret + data.sessioner.vurderet + data.sessioner.lead} / ${data.sessioner.vurderet + data.sessioner.lead}`, "sessioner i PocketBase")}
</div>

<h2>Seneste sessioner</h2>
<table><thead><tr><th>Startet</th><th>Virksomhed</th><th>Kanal</th><th>Status</th><th class="tal">Varighed</th></tr></thead><tbody>${sessRaekker || `<tr><td colspan="5" class="muted">Ingen sessioner i perioden.</td></tr>`}</tbody></table>

<p class="note">Umami tæller ikke besøgende med adblocker, så sessionstallet fra serveren kan være højere end tragten. Frafald måles, når siden lukkes, og fanges ikke altid på mobil. Fuld detalje: <a href="https://analytics.spaike.dk">analytics.spaike.dk</a>. Lavet med <code>npm run tilskud:tragt</code>.</p>
</div></body></html>`;
  writeFileSync(UD, html);
  console.log(`Rapport: file://${UD}`);
  console.log(JSON.stringify({ tragt: data.tragt.map((t) => t.besoegende), sessioner: data.sessioner }, null, 0));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
