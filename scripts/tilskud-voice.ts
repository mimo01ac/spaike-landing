/**
 * Stemme-agenten i /tilskud: sync og test uden mikrofon.
 *
 *   npm run tilskud:voice -- vis                 # konfig der sendes (kort)
 *   npm run tilskud:voice -- sync                # opret/opdatér agenten + læs felterne tilbage
 *   npm run tilskud:voice -- simuler [--persona typisk|stop|roed] [--cvr 39127709] [--resultat] [--json]
 *
 * sync: uden TILSKUD_VOICE_AGENT_ID oprettes en ny agent (id printes; læg det i
 * .env.local + Vercel). Med id opdateres den. Bagefter hentes agenten og hvert
 * felt vi sendte sammenlignes (ElevenLabs dropper ukendte felter lydløst).
 * simuler: ElevenLabs' simulate-conversation med en simuleret bruger og mockede
 * client tools. --resultat sender udskriften videre til Claude og viser
 * kvalificeringen/vurderingen, præcis som /api/tilskud voice-resultat gør.
 */

import { AFKLARINGSPUNKTER } from "../lib/tilskud/afklaring";
import { udledResultatAfSamtale } from "../lib/tilskud/chat";
import { forhaandstjek, slaaCvrOp, virksomhedSomTekst } from "../lib/tilskud/cvr";
import { diffKonfig, hentAgent, opdaterAgent, opretAgent, simulerSamtale } from "../lib/tilskud/voice";
import { NOTER_TOOL, dynamiskeVariabler, voiceAgentKonfig } from "../lib/tilskud/voice-agent";

const args = process.argv.slice(2);
const cmd = args[0];
const flag = (navn: string, def?: string) => {
  const i = args.indexOf(`--${navn}`);
  if (i === -1) return def;
  const v = args[i + 1];
  return v === undefined || v.startsWith("--") ? "true" : v;
};

const PERSONAER: Record<string, string> = {
  typisk: `Du er Henrik, ejer af en tømrervirksomhed med tolv ansatte (cirka elleve fuldtidsstillinger) og cirka fjorten millioner kroner i omsætning. I har aflagt regnskab hvert år siden 2015. I kan godt betale jeres halvdel kontant og lægge beløbet ud. Ingen offentlige tilskud de seneste tre år. I er ejet af dig og din bror. Du har bare hørt, at man kan få tilskud til digitalisering, og ved ikke helt hvor du skal starte. Det der fylder: tilbud og fakturering tager alt for lang tid, Lene på kontoret drukner, og der sker fejl i fakturaerne. Du siger ja til at fortsætte med forberedelsen. Hvis det blev løst, kunne I tage flere opgaver uden at ansætte på kontoret, det er nok en halv stilling i dag. Dig og Lene ville drive projektet. I skiftede til e-conomic for tre år siden, ingen AI endnu. Til implementering bagefter kan I nok finde hundrede og halvtreds tusind. Svar kort og naturligt som i en telefonsamtale, én til to sætninger. Sig farvel når assistenten siger farvel.`,
  stop: `Du er Mette, direktør i et lille revisionsfirma med seks fuldtidsansatte og fem millioner i omsætning, regnskab hvert år siden 2012, kan betale kontant, ingen tilskud, ejet af dig selv. Du vil gerne have styr på kundeonboarding, som er meget manuel. Når assistenten spørger om du vil fortsætte med forberedelsen, siger du nej tak, ikke lige nu. Svar kort og naturligt, én til to sætninger. Sig farvel når assistenten siger farvel.`,
  roed: `Du er Jonas, der driver en enkeltmandsvirksomhed som webdesigner. Det er kun dig, ingen ansatte, omsætning cirka otte hundrede tusind. Du har aflagt to regnskaber. Du kan ikke lægge halvtreds tusind kroner ud kontant. Du vil gerne bruge AI til at skrive tilbud hurtigere. Svar kort og naturligt, én til to sætninger. Sig farvel når assistenten siger farvel.`,
};

function medLlm(cfg: ReturnType<typeof voiceAgentKonfig>, llm: string) {
  const kopi = JSON.parse(JSON.stringify(cfg)) as ReturnType<typeof voiceAgentKonfig>;
  (kopi.conversation_config.agent as { prompt: { llm: string } }).prompt.llm = llm;
  return { conversation_config: kopi.conversation_config, platform_settings: kopi.platform_settings ?? {} };
}

async function main() {
  const cfg = voiceAgentKonfig();

  if (cmd === "vis") {
    const a = cfg.conversation_config.agent as { prompt: { prompt: string; llm: string; tools: { name: string }[] }; first_message: string };
    console.log(JSON.stringify({ name: cfg.name, llm: a.prompt.llm, tools: a.prompt.tools.map((t) => t.name), tts: cfg.conversation_config.tts, prompt_tegn: a.prompt.prompt.length, first_message: a.first_message, platform_settings: cfg.platform_settings }, null, 2));
    return;
  }

  if (cmd === "sync") {
    let id = process.env.TILSKUD_VOICE_AGENT_ID;
    if (id) {
      await opdaterAgent(id, cfg);
      console.log(`opdateret: ${id}`);
    } else {
      id = await opretAgent(cfg);
      console.log(`OPRETTET: ${id}\nLæg den i .env.local og Vercel (production + preview) som TILSKUD_VOICE_AGENT_ID.`);
    }
    const gemt = await hentAgent(id);
    const diffs = [
      ...diffKonfig(cfg.conversation_config, gemt.conversation_config, "conversation_config"),
      ...diffKonfig(cfg.platform_settings, gemt.platform_settings, "platform_settings"),
    ];
    console.log(diffs.length ? `AFVIGELSER (${diffs.length}):\n- ${diffs.join("\n- ")}` : "readback: 0 afvigelser");
    return;
  }

  if (cmd === "simuler") {
    const persona = flag("persona", "typisk")!;
    const prompt = PERSONAER[persona];
    if (!prompt) throw new Error(`ukendt persona: ${persona} (${Object.keys(PERSONAER).join(", ")})`);
    const cvr = flag("cvr");
    const v = cvr ? await slaaCvrOp(cvr) : null;
    const dyn = dynamiskeVariabler(v);
    const t0 = Date.now();
    const sim = await simulerSamtale({
      navn: `tilskud-voice ${persona} ${new Date().toISOString()}`,
      scenarie: prompt,
      dynamiskeVariabler: dyn,
      maksTure: 30,
      override: flag("llm") ? medLlm(cfg, flag("llm")!) : undefined,
      succeskriterier: [
        "Sagde agenten i sin første replik, at den er en AI-assistent?",
        "Fik agenten afklaret både antal ansatte eller årsværk og omsætning?",
        "Talte agenten i korte sætninger uden lister og uden ros som perfekt eller glimrende? (Ét samlet spørgsmål om ansatte og omsætning er tilladt.)",
        "Sagde agenten farvel, og sagde den intet på engelsk eller om værktøjer?",
      ],
    });
    const sek = Math.round((Date.now() - t0) / 1000);

    const noter: Record<string, string> = {};
    const json = flag("json") === "true";
    for (const tur of sim.transcript) {
      if (!json && tur.message) console.log(`${tur.role === "agent" ? "AGENT " : "BRUGER"}: ${tur.message}`);
      for (const tc of (tur.tool_calls ?? []) as { tool_name?: string; params_as_json?: string }[]) {
        let p: Record<string, string> = {};
        try {
          p = JSON.parse(tc.params_as_json ?? "{}");
        } catch {
          /* ignore */
        }
        if (!json) console.log(`        [${tc.tool_name}] ${JSON.stringify(p)}`);
        if (tc.tool_name === NOTER_TOOL && p.punkt) noter[p.punkt] = `${p.status}: ${p.note}`;
      }
    }
    const mangler = AFKLARINGSPUNKTER.filter((p) => p.fase === "kvalificering" && !noter[p.id]).map((p) => p.id);
    const opsummering = {
      persona,
      llm: flag("llm") ?? "(agentens)",
      ros: sim.transcript.filter((t) => t.role === "agent" && /perfekt|glimrende|fantastisk|super\b|held og lykke/i.test(t.message)).length,
      sekunder: sek,
      test_status: sim.status,
      ture: sim.transcript.length,
      noteret: noter,
      kvalificeringspunkter_mangler: mangler,
      afsluttet_med_end_call: sim.transcript.some((t) => ((t.tool_calls ?? []) as { tool_name?: string }[]).some((c) => c.tool_name === "end_call")),
    };
    console.log(JSON.stringify(opsummering, null, 2));
    console.log("kriterier:", JSON.stringify(sim.kriterier, null, 2));
    if (!sim.transcript.length) console.log("RÅ:", JSON.stringify(sim.raa).slice(0, 3000));

    if (flag("resultat") === "true") {
      const udskrift = sim.transcript
        .filter((t) => t.message)
        .map((t) => ({ role: t.role === "user" ? ("user" as const) : ("assistant" as const), content: t.message }));
      const kontekst = v ? virksomhedSomTekst(v, forhaandstjek(v)) : "";
      const r = await udledResultatAfSamtale({
        udskrift,
        kontekst,
        afklaringer: Object.entries(noter).map(([k, x]) => `${k}: ${x}`).join("\n"),
      });
      if (r.vurdering) console.log(JSON.stringify({ type: "vurdering", status: r.vurdering.egnethed.status, titel: r.vurdering.projekt.titel, opsummering: r.vurdering.egnethed.opsummering, point: r.vurdering.point.samlet_indikation, tilskud: r.vurdering.projekt.tilskud_kr }, null, 2));
      else if (r.kvalificering) console.log(JSON.stringify({ type: "kvalificering", ...r.kvalificering }, null, 2));
      else console.log("INTET RESULTAT");
    }
    return;
  }

  console.log("Brug: vis | sync | simuler [--persona typisk|stop|roed] [--cvr N] [--resultat] [--json]");
  process.exit(1);
}

main().catch((e) => {
  console.error((e as Error).message);
  process.exit(1);
});
