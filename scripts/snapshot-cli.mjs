#!/usr/bin/env node
/**
 * CLI-harness for SpAIke Snapshot (/tjek), jf. CLI-testbarheds-reglen.
 *
 *   node scripts/snapshot-cli.mjs beregn --svar fixtures/snapshot-eksempel.json [--loen 300] [--json]
 *     Offline: kører samme beregning som siden og serveren (lib/snapshot/beregn.ts).
 *
 *   node scripts/snapshot-cli.mjs lead [--base http://localhost:3000] [--svar <fil>] [--email test@spaike.dk]
 *     Sender et test-lead til /api/kontakt (action "snapshot") med header
 *     x-snapshot-test: 1 (gemmes med test=true, ingen mail).
 *
 * Node 22.18+ stripper TypeScript-typer selv, så beregn.ts importeres direkte.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Skjul Nodes støj om type-stripping af .ts-filen; andre advarsler vises stadig.
process.removeAllListeners("warning");
process.on("warning", (w) => {
  if (!/MODULE_TYPELESS_PACKAGE_JSON|Type Stripping/i.test(`${w.code ?? ""} ${w.message}`)) console.warn(w);
});

const here = dirname(fileURLToPath(import.meta.url));
const { beregn, validerSvar, formatInterval, formatTal, regnestykke } = await import(
  resolve(here, "../lib/snapshot/beregn.ts")
);

const [cmd, ...rest] = process.argv.slice(2);
const arg = (navn, std) => {
  const i = rest.indexOf(`--${navn}`);
  return i >= 0 ? rest[i + 1] : std;
};
const flag = (navn) => rest.includes(`--${navn}`);

function laesSvar() {
  const fil = arg("svar", resolve(here, "../fixtures/snapshot-eksempel.json"));
  const v = validerSvar(JSON.parse(readFileSync(fil, "utf8")));
  if (!v.ok) {
    console.error(`Ugyldige svar i ${fil}: ${v.fejl}`);
    process.exit(1);
  }
  return v.svar;
}

function print(r) {
  const a = r.antagelser;
  console.log(`Største tidsrøver: ${r.top.label}`);
  console.log(`  ${formatInterval(r.top.timerMd, "timer om måneden")} · ${formatInterval(r.top.krAar, "kr. om året")}`);
  console.log(`  ${regnestykke(r.top, a.timeloenKr)}`);
  console.log(`Alle opgaver:`);
  for (const p of r.processer) {
    console.log(`  - ${p.label}: ${formatInterval(p.timerMd, "t/md")}, ${formatInterval(p.krAar, "kr./år")}`);
  }
  if (r.processer.length > 1) {
    console.log(`  I alt: ${formatInterval(r.samlet.timerMd, "t/md")}, ${formatInterval(r.samlet.krAar, "kr./år")}`);
  }
  console.log(`Modenhed: niveau ${r.niveau} (${r.niveauNavn})`);
  console.log(`Anbefalet modul: ${r.modul.navn} (${r.modul.href})`);
  console.log(`Antagelser: timeløn ${formatTal(a.timeloenKr)} kr.${a.timeloenErStandard ? " (standard)" : " (rettet)"}, × ${String(a.overhead).replace(".", ",")}, ${a.ugerPrAar} uger, ${a.stoerrelse} personer`);
}

if (cmd === "beregn") {
  const loen = arg("loen") ? Number(arg("loen")) : undefined;
  const r = beregn(laesSvar(), loen);
  if (flag("json")) console.log(JSON.stringify(r, null, 2));
  else print(r);
} else if (cmd === "lead") {
  const base = arg("base", "http://localhost:3000");
  const res = await fetch(`${base}/api/kontakt`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-snapshot-test": "1" },
    body: JSON.stringify({
      action: "snapshot",
      svar: laesSvar(),
      navn: arg("navn", "CLI Test"),
      email: arg("email", "test@spaike.dk"),
      firma: arg("firma", "CLI Testfirma ApS"),
      cvr: arg("cvr", ""),
      utm: { utm_source: "cli" },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`FEJL (${res.status}):`, data.error ?? data);
    process.exit(1);
  }
  console.log(`HTTP ${res.status} · ok=${data.ok} · gemt i PocketBase=${data.gemt} · test=${data.test}`);
  if (!data.gemt) console.log("Ikke gemt: se server-loggen for 'snapshot lead: PB-gem fejlede:' (collection mangler eller PB-env ikke sat).");
  if (data.resultat) print(data.resultat);
} else {
  console.error("Brug: node scripts/snapshot-cli.mjs beregn --svar <fil> [--loen N] [--json]\n       node scripts/snapshot-cli.mjs lead [--base <url>] [--svar <fil>]");
  process.exit(1);
}
