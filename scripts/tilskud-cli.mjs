#!/usr/bin/env node
/**
 * CLI-harness for /api/tilskud. Rammer HTTP-routen, så det der testes er det
 * der kører i produktion.
 *
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

const FIXTURE = [
  "Vi er 12 ansatte og har aflagt regnskab hvert år siden 2019.",
  "Ja, vi kan godt betale vores halvdel kontant og lægge beløbet ud.",
  "Nej, vi har ikke fået offentlige tilskud de seneste tre år.",
  "Nej, vi er ejet af de to stiftere, ingen store ejere.",
  "Det der koster mest tid er at taste tilbud og ordrer fra mails ind i e-conomic, og at samle ugerapporter i Excel. Cirka 15 timer om ugen fordelt på to personer.",
  "Vi bruger e-conomic, Outlook og Excel, og en webshop på Shopify.",
  "Vi prøvede en Zapier-kobling for to år siden, men den holdt ikke, når formaterne ændrede sig.",
  "Om et år skal ordrer gå automatisk ind, og vi skal kunne se omsætning pr. kunde uden at samle det i hånden.",
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
      else if (evt.type === "error") throw new Error(`chat-fejl: ${evt.error}`);
    }
  }
  if (!JSON_ONLY) process.stdout.write("\n");
  return { text, vurdering };
}

async function runChat(token, cvr, { auto, say }) {
  const messages = [
    { role: "user", content: "Hej. Jeg vil gerne tjekke, om vi kan søge tilskud til et projekt om AI og automatisering." },
  ];
  let vurdering = null;
  let fixtureIdx = 0;
  for (let turn = 0; turn < 14; turn++) {
    log(`\n--- tur ${turn + 1} (assistent) ---`);
    const r = await chatTurn(token, cvr, messages);
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
  return { messages, vurdering };
}

async function lead(token, cvr, virksomhed, vurdering, transcript) {
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
    transcript,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`lead ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function main() {
  const cvr = String(flag("cvr", ""));
  if (cmd === "start") {
    const s = await start(cvr);
    console.log(JSON.stringify(s, null, 2));
    return;
  }
  if (cmd === "chat" || cmd === "flow") {
    const s = await start(cvr);
    log("Virksomhed:", s.virksomhed?.navn ?? "(intet opslag)", "| forhåndstjek:", JSON.stringify(s.forhaandstjek));
    const { messages, vurdering } = await runChat(s.token, cvr, {
      auto: cmd === "flow" || !!flag("auto", false),
      say: flag("say"),
    });
    if (vurdering) {
      console.log(JSON_ONLY ? JSON.stringify(vurdering) : "\n=== VURDERING ===\n" + JSON.stringify(vurdering, null, 2));
    } else {
      log("\n(ingen vurdering endnu)");
    }
    if (cmd === "flow" && flag("email")) {
      const r = await lead(s.token, cvr, s.virksomhed?.navn ?? "", vurdering, messages);
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
  console.error("Brug: start|chat|lead|flow --cvr <8 cifre> [--email ..] [--auto] [--say ..] [--base ..] [--json]");
  process.exit(1);
}

main().catch((e) => {
  console.error("FEJL:", e.message);
  process.exit(1);
});
