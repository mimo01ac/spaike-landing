#!/usr/bin/env node
/**
 * CLI-harness for /api/tilskud. Rammer HTTP-routen, så det der testes er det
 * der kører i produktion.
 *
 *   node scripts/tilskud-cli.mjs soeg  --term "mimoco" [--json]
 *   node scripts/tilskud-cli.mjs start --cvr 39127709 [--base http://localhost:3000]
 *   node scripts/tilskud-cli.mjs chat  --cvr 39127709 [--auto] [--say "..."] [--json]
 *   node scripts/tilskud-cli.mjs lead  --cvr 39127709 --email test@example.com [--navn ..] [--alarm]
 *   node scripts/tilskud-cli.mjs flow  --cvr 39127709 [--email test@example.com] [--json]
 *
 * --auto spiller en fast fixture af svar ind, indtil agenten afgiver vurderingen
 * (eller der er brugt 14 ture). --json printer kun det strukturerede resultat.
 */

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (name, def) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return def;
  const v = args[i + 1];
  return v === undefined || v.startsWith("--") ? true : v;
};
const BASE = (flag("base", process.env.TILSKUD_BASE || "http://localhost:3000")).replace(/\/$/, "");
const JSON_ONLY = !!flag("json", false);
const log = (...a) => {
  if (!JSON_ONLY) console.log(...a);
};

// Fixture = en typisk bruger der IKKE ved hvor han skal starte (Michaels pointe
// 2026-11-01): agenten skal guide, ikke forhøre. Svarene er bevidst løse.
const FIXTURE = [
  "Ærligt talt har vi bare hørt, at man kan få tilskud til digitalisering, og vi ved ikke rigtig hvor vi skal starte. Vi er 12 ansatte.",
  "Ja, vi har aflagt regnskab hvert år siden 2019, og vi kan godt betale vores halvdel kontant og lægge beløbet ud.",
  "Nej, ingen offentlige tilskud de seneste tre år, og vi er ejet af de to stiftere.",
  "Det der fylder mest er, at Lene og Peter i administrationen drukner. Alt skal igennem dem, og når en af dem er syg, går det i stå. Og vi laver for mange fejl i fakturaerne. Det er nok faktureringsflowet, vi skal kigge på.",
  "Hvis det blev løst, kunne vi tage flere kunder ind uden at ansætte en tredje i administrationen, og pengene ville komme hurtigere ind. Det er nok en halv stilling i dag, tror jeg.",
  "Det ville være mig som direktør og Lene fra administrationen, der driver det. Vi skiftede til e-conomic for tre år siden og satte selv Shopify op, men vi har ikke brugt AI eller automatisering til noget endnu. Til implementering bagefter kan vi nok finde 150-200.000 kr.",
];
const FALLBACK = "Det ved jeg ikke præcist, tag dit bedste skøn og gå videre.";

async function post(body) {
  const res = await fetch(`${BASE}/api/tilskud`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}

async function start(cvr) {
  const res = await post({ action: "start", cvr });
  const data = await res.json();
  if (!res.ok) throw new Error(`start ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function chatTurn(token, cvr, messages) {
  const res = await post({ action: "chat", token, cvr, messages });
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}));
    throw new Error(`chat ${res.status}: ${JSON.stringify(data)}`);
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let text = "";
  let vurdering = null;
  let kvalificering = null;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.trim()) continue;
      let evt;
      try {
        evt = JSON.parse(line);
      } catch {
        continue;
      }
      if (evt.type === "text") {
        text += evt.text;
        if (!JSON_ONLY) process.stdout.write(evt.text);
      } else if (evt.type === "vurdering") vurdering = evt.vurdering;
      else if (evt.type === "kvalificering") kvalificering = evt.kvalificering;
      else if (evt.type === "error") throw new Error(`chat-fejl: ${evt.error}`);
    }
  }
  if (!JSON_ONLY) process.stdout.write("\n");
  return { text, vurdering, kvalificering };
}

async function runChat(token, cvr, { auto, say }) {
  const messages = [
    { role: "user", content: "Hej. Jeg vil gerne tjekke, om vi kan søge tilskud til et projekt om AI og automatisering." },
  ];
  let vurdering = null;
  let kvalificering = null;
  let fixtureIdx = 0;
  for (let turn = 0; turn < 16; turn++) {
    log(`\n--- tur ${turn + 1} (assistent) ---`);
    const r = await chatTurn(token, cvr, messages);
    if (r.kvalificering) {
      // Fase 1 afgivet: markér det i historikken (som klienten gør) og sig ja til fase 2.
      kvalificering = r.kvalificering;
      messages.push({ role: "assistant", content: `${r.text}\n\n[Kvalificering afgivet: ${r.kvalificering.status}]` });
      log(`\n=== KVALIFICERING === ${JSON.stringify(r.kvalificering)}`);
      if (flag("stop-efter-kvalificering", false)) break;
      const ja = "Ja, lad os fortsætte til forberedelsen.";
      log(`\n> ${ja}`);
      messages.push({ role: "user", content: ja });
      continue;
    }
    messages.push({ role: "assistant", content: r.text });
    if (r.vurdering) {
      vurdering = r.vurdering;
      break;
    }
    if (!auto) {
      if (say && turn === 0) {
        messages.push({ role: "user", content: say });
        log(`\n> ${say}`);
        continue;
      }
      break;
    }
    const svar = FIXTURE[fixtureIdx++] ?? FALLBACK;
    log(`\n> ${svar}`);
    messages.push({ role: "user", content: svar });
  }
  return { messages, vurdering, kvalificering };
}

async function lead(token, cvr, virksomhed, vurdering, transcript, kvalificering = null) {
  const res = await post({
    action: "lead",
    token,
    cvr,
    virksomhed,
    navn: flag("navn", "CLI Test"),
    email: flag("email"),
    telefon: flag("telefon", ""),
    puljeAlarm: !!flag("alarm", false),
    consent: true,
    vurdering,
    kvalificering,
    transcript,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`lead ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function main() {
  const cvr = String(flag("cvr", ""));
  if (cmd === "tts") {
    const s = await start(cvr || "");
    const res = await post({ action: "tts", token: s.token, text: flag("text", "Hej. Det her er en test af den danske stemme på tilskudstjekket.") });
    if (!res.ok) throw new Error(`tts ${res.status}: ${await res.text()}`);
    const buf = Buffer.from(await res.arrayBuffer());
    const out = flag("out", "/tmp/tilskud-tts.mp3");
    (await import("node:fs")).writeFileSync(out, buf);
    console.log(`tts ok: ${buf.length} bytes -> ${out} (${res.headers.get("content-type")})`);
    return;
  }
  if (cmd === "soeg") {
    const res = await post({ action: "soeg", term: flag("term", "") });
    const data = await res.json();
    if (!res.ok) throw new Error(`soeg ${res.status}: ${JSON.stringify(data)}`);
    if (JSON_ONLY) console.log(JSON.stringify(data));
    else for (const h of data.resultater ?? []) console.log(`${h.cvr}  ${h.navn}  |  ${[h.selskabsform, h.postnr, h.by, h.ansatteInterval].filter(Boolean).join(" ")}`);
    if (!JSON_ONLY && !(data.resultater ?? []).length) console.log("(ingen resultater)", data.utilgaengelig ? "navnesøgning ikke konfigureret (CVR_USER/CVR_PASS)" : "");
    return;
  }
  if (cmd === "start") {
    const s = await start(cvr);
    console.log(JSON.stringify(s, null, 2));
    return;
  }
  if (cmd === "chat" || cmd === "flow") {
    const s = await start(cvr);
    log("Virksomhed:", s.virksomhed?.navn ?? "(intet opslag)", "| forhåndstjek:", JSON.stringify(s.forhaandstjek));
    const { messages, vurdering, kvalificering } = await runChat(s.token, cvr, {
      auto: cmd === "flow" || !!flag("auto", false),
      say: flag("say"),
    });
    if (vurdering) {
      console.log(JSON_ONLY ? JSON.stringify(vurdering) : "\n=== VURDERING ===\n" + JSON.stringify(vurdering, null, 2));
    } else if (kvalificering && JSON_ONLY) {
      console.log(JSON.stringify({ kvalificering }));
    } else {
      log("\n(ingen vurdering endnu)");
    }
    if (cmd === "flow" && flag("email")) {
      const r = await lead(s.token, cvr, s.virksomhed?.navn ?? "", vurdering, messages, kvalificering);
      console.log("lead:", JSON.stringify(r));
    }
    return;
  }
  if (cmd === "lead") {
    const s = await start(cvr);
    const r = await lead(s.token, cvr, s.virksomhed?.navn ?? "", null, []);
    console.log(JSON.stringify(r));
    return;
  }
  console.error("Brug: soeg --term <navn> | start|chat|lead|flow --cvr <8 cifre> [--email ..] [--auto] [--say ..] [--base ..] [--json]");
  process.exit(1);
}

main().catch((e) => {
  console.error("FEJL:", e.message);
  process.exit(1);
});
