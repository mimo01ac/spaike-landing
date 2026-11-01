/**
 * /api/tilskud: ét endpoint med flere handlinger (holder Vercel-function-tallet
 * nede; 7 af 12). POST { action, ... }:
 *
 *  soeg:   navnesøgning i CVR.
 *  start:  CVR-opslag + forhåndstjek + session-token. Opretter sessionen i
 *          PocketBase (tilskud_sessioner) og mailer Michael med det samme.
 *  chat:   streamer Claude som NDJSON: {type:"text"} | {type:"kvalificering"} |
 *          {type:"vurdering"} | {type:"error"} | {type:"done"}. Skriver
 *          samtalen til sessionen.
 *  voice-start:    WebRTC-token til ElevenLabs-agenten + dynamiske variabler.
 *  voice-resultat: udskrift fra ElevenLabs -> kvalificering/vurdering (Claude).
 *  lead:   gemmer lead (tilskud_leads) + Brevo til Michael og brugeren.
 *          Fail-soft: mails sendes også, når PocketBase er nede.
 *
 * CLI: node scripts/tilskud-cli.mjs <soeg|start|chat|lead|flow|voice-start|voice-resultat>.
 */

import { NextResponse } from "next/server";
import { issueSessionToken, sessionIdFraToken, verifySessionToken } from "@/lib/sessionToken";
import { nytSessionId, opdaterSession, opretSession } from "@/lib/tilskud/session";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { createRecord } from "@/lib/pocketbase";
import { sendEmail } from "@/lib/email";
import {
  forhaandstjek,
  hentFraCvrCache,
  mapCvrApiSvar,
  normaliserCvr,
  saetCvrCache,
  sidsteCvrFejl,
  slaaCvrOp,
  virksomhedSomTekst,
} from "@/lib/tilskud/cvr";
import { esKonfigureret, soegVirksomheder } from "@/lib/tilskud/cvr-es";
import { agentId, hentSamtale, hentSamtaleToken, voiceKonfigureret } from "@/lib/tilskud/voice";
import { dynamiskeVariabler } from "@/lib/tilskud/voice-agent";
import { normaliserNote } from "@/lib/tilskud/afklaring";
import { naesteRaadgivningspulje } from "@/lib/tilskud/puljer";
import { MAX_TURNS } from "@/lib/tilskud/agent";
import { startTilskudChat, udledResultatAfSamtale } from "@/lib/tilskud/chat";
import { renderKvalificeringMail, renderLeadNotifikation, renderVurderingMail } from "@/lib/tilskud/email";
import { normaliserKvalificering, normaliserVurdering } from "@/lib/tilskud/vurdering";
import type { Virksomhed } from "@/lib/tilskud/cvr";
import type { ChatMsg, Kvalificering, StartSvar, Vurdering } from "@/lib/tilskud/types";

export const runtime = "nodejs";
// voice-resultat skriver hele vurderingen med Opus (~45 s målt 2026-11-01); 60 s var for tæt på.
export const maxDuration = 120;

const MAX_PAYLOAD_CHARS = 60_000;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Ugyldig anmodning." }, 400);
  }
  const action = String(body.action ?? "");
  if (action === "soeg") return soeg(req, body);
  if (action === "voice-start") return voiceStart(req, body);
  if (action === "voice-resultat") return voiceResultat(req, body);
  if (action === "start") return start(req, body);
  if (action === "chat") return chat(req, body);
  if (action === "lead") return lead(req, body);
  return json({ error: "Ukendt handling." }, 400);
}

/** Navnesøgning i CVR -> liste at vælge fra (for dem der ikke husker CVR-nummeret). */
async function soeg(req: Request, body: Record<string, unknown>) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`tilskud-soeg:${ip}`, 40, 5 * 60 * 1000);
  if (!rl.allowed) return json({ error: "For mange søgninger. Vent lidt." }, 429);
  const term = String(body.term ?? "").trim().slice(0, 80);
  if (term.length < 2) return json({ resultater: [] }, 200);
  if (!esKonfigureret()) return json({ resultater: [], utilgaengelig: true }, 200);
  const resultater = await soegVirksomheder(term, 8);
  return json({ resultater }, 200);
}

async function start(req: Request, body: Record<string, unknown>) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`tilskud-start:${ip}`, 20, 10 * 60 * 1000);
  if (!rl.allowed) return json({ error: "For mange forsøg. Prøv igen om lidt." }, 429);

  if (process.env.TURNSTILE_SECRET_KEY) {
    const ts = await verifyTurnstile(body.turnstileToken as string | undefined, ip);
    if (!ts.ok) return json({ error: "Bot-tjek fejlede. Genindlæs siden og prøv igen." }, 403);
  }

  const cvr = normaliserCvr(String(body.cvr ?? ""));
  let virksomhed = cvr ? await slaaCvrOp(cvr) : null;
  // Fallback: klienten har selv slået op hos cvrapi.dk (CORS) fordi serverens
  // IP-kvote er opbrugt. Vi mapper og validerer svaret mod det indtastede CVR.
  if (cvr && !virksomhed && body.cvrFallback && typeof body.cvrFallback === "object") {
    virksomhed = mapCvrApiSvar(body.cvrFallback, cvr);
    if (virksomhed) saetCvrCache(virksomhed);
  }
  const tjek = virksomhed ? forhaandstjek(virksomhed) : null;
  const p = naesteRaadgivningspulje();
  const sid = nytSessionId();
  await opretSession({ id: sid, cvr: cvr ?? "", virksomhed, forhaandstjek: tjek, notificer: req.headers.get("x-tilskud-test") !== "1" });

  const svar: StartSvar & { cvrFejl?: string } = {
    token: issueSessionToken(sid),
    virksomhed,
    forhaandstjek: tjek,
    pulje: p ? { id: p.id, navn: p.navn, aabner: p.aabner, lukker: p.lukker, maksTilskudKr: p.maksTilskudKr } : null,
  };
  // Diagnose (ingen persondata) så et fejlet opslag kan fejlsøges fra klienten/CLI.
  if (cvr && !virksomhed && sidsteCvrFejl) svar.cvrFejl = sidsteCvrFejl;
  return json(svar, 200);
}

async function chat(req: Request, body: Record<string, unknown>) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`tilskud-chat:${ip}`, 60, 5 * 60 * 1000);
  if (!rl.allowed) return json({ type: "error", error: "For mange anmodninger. Vent lidt." }, 429);

  if (!verifySessionToken(body.token as string | undefined)) {
    return json({ type: "error", error: "Sessionen er udløbet. Genindlæs siden." }, 401);
  }
  const messages = (Array.isArray(body.messages) ? body.messages : []) as ChatMsg[];
  if (messages.length === 0) return json({ type: "error", error: "Ingen beskeder." }, 400);
  if (messages.filter((m) => m.role === "user").length > MAX_TURNS) {
    return json({ type: "error", error: "Samtalen er blevet for lang. Start forfra." }, 429);
  }
  if (messages.reduce((n, m) => n + (m.content?.length ?? 0), 0) > MAX_PAYLOAD_CHARS) {
    return json({ type: "error", error: "Beskeden er for stor." }, 413);
  }

  // Kontekst genopbygges server-side fra det CVR klienten sender, så prompten
  // ikke kan forfalskes med fri tekst.
  const v = await virksomhedFraBody(body);
  const kontekst = v ? virksomhedSomTekst(v, forhaandstjek(v)) : "";

  const encoder = new TextEncoder();
  let handle: ReturnType<typeof startTilskudChat> | null = null;

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const send = (obj: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));
        } catch {
          closed = true;
        }
      };
      try {
        handle = startTilskudChat({
          messages,
          kontekst,
          onText: (delta) => send({ type: "text", text: delta }),
        });
        const { tekst, vurdering, kvalificering, afskaaret } = await handle.faerdig;
        await opdaterSession(sessionIdFraToken(body.token as string | undefined), {
          kanal: "chat",
          transcript: [...messages, { role: "assistant", content: tekst }],
          ...(kvalificering && !afskaaret ? { kvalificering, status: "kvalificeret", egnethed: kvalificering.status } : {}),
          ...(vurdering && !afskaaret ? { vurdering, status: "vurderet", egnethed: vurdering.egnethed.status } : {}),
        });
        if (kvalificering && !afskaaret) {
          send({ type: "kvalificering", kvalificering });
        } else if (vurdering && !afskaaret) {
          send({ type: "vurdering", vurdering });
        } else if ((vurdering || kvalificering) && afskaaret) {
          // Ufuldstændig vurdering: bed brugeren trigge et nyt forsøg frem for
          // at vise et halvt resultat.
          send({ type: "error", error: "Vurderingen blev afbrudt undervejs. Skriv 'prøv igen', så samler jeg den en gang til." });
        }
        send({ type: "done" });
      } catch (e) {
        console.error("tilskud chat-fejl:", (e as Error).message);
        send({ type: "error", error: "Der opstod en fejl. Prøv igen." });
      } finally {
        if (!closed) {
          closed = true;
          try {
            controller.close();
          } catch {
            /* allerede lukket */
          }
        }
      }
    },
    cancel() {
      handle?.afbryd();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}

/**
 * Virksomheden til agentens kontekst: cache (sat af start-trinnet), så opslag,
 * så klientens kopi fra start-svaret (ny serverless-instans uden cache), men
 * kun hvis den matcher det CVR der blev slået op.
 */
async function virksomhedFraBody(body: Record<string, unknown>): Promise<Virksomhed | null> {
  const cvr = normaliserCvr(String(body.cvr ?? ""));
  if (!cvr) return null;
  let v = hentFraCvrCache(cvr) ?? (await slaaCvrOp(cvr));
  if (!v && body.virksomhed && typeof body.virksomhed === "object") {
    const k = body.virksomhed as Record<string, unknown>;
    if (k.cvr === cvr && typeof k.navn === "string") {
      v = {
        cvr,
        navn: k.navn.slice(0, 200),
        by: typeof k.by === "string" ? k.by.slice(0, 80) : undefined,
        postnr: typeof k.postnr === "string" ? k.postnr.slice(0, 10) : undefined,
        startdato: typeof k.startdato === "string" ? k.startdato.slice(0, 10) : undefined,
        ophoert: !!k.ophoert,
        ansatte: typeof k.ansatte === "number" ? k.ansatte : null,
        ansatteInterval: typeof k.ansatteInterval === "string" ? k.ansatteInterval.slice(0, 20) : null,
        branchekode: typeof k.branchekode === "number" ? k.branchekode : undefined,
        branche: typeof k.branche === "string" ? k.branche.slice(0, 200) : undefined,
        selskabsform: typeof k.selskabsform === "string" ? k.selskabsform.slice(0, 80) : undefined,
      };
      saetCvrCache(v);
    }
  }
  return v;
}

/**
 * Stemme-tilstanden starter: WebRTC-token til ElevenLabs-agenten + de
 * dynamiske variabler (CVR-kontekst) bygget her på serveren. Agenten er privat,
 * så den kan kun bruges med et token fra denne handling.
 */
async function voiceStart(req: Request, body: Record<string, unknown>) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`tilskud-voice:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) return json({ error: "For mange samtaler på kort tid. Prøv igen om lidt, eller skriv i chatten." }, 429);
  const sid = sessionIdFraToken(body.token as string | undefined);
  if (!sid) return json({ error: "Sessionen er udløbet. Genindlæs siden." }, 401);
  if (!voiceKonfigureret()) return json({ error: "Stemmen er ikke sat op. Brug chatten." }, 503);

  const v = await virksomhedFraBody(body);
  let samtale: { token: string; conversationId: string | null };
  try {
    samtale = await hentSamtaleToken();
  } catch (e) {
    console.error("tilskud voice-start: token fejlede:", (e as Error).message);
    return json({ error: "Stemmen kunne ikke starte lige nu. Prøv igen, eller skriv i chatten." }, 502);
  }
  await opdaterSession(sid, { kanal: "stemme", elevenlabs_samtale: samtale.conversationId ?? "" });
  return json({ conversationToken: samtale.token, conversationId: samtale.conversationId, dynamicVariables: dynamiskeVariabler(v) }, 200);
}

/** Klientens egen kopi af udskriften (fallback, hvis ElevenLabs ikke har den klar endnu). */
function renUdskrift(raw: unknown): ChatMsg[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 120)
    .filter((m) => m && typeof m === "object" && typeof (m as ChatMsg).content === "string")
    .map((m) => ({ role: (m as ChatMsg).role === "user" ? ("user" as const) : ("assistant" as const), content: (m as ChatMsg).content.slice(0, 3000) }));
}

/** Efter stemmesamtalen: udskrift fra ElevenLabs -> samme kvalificering/vurdering som chatten. */
async function voiceResultat(req: Request, body: Record<string, unknown>) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`tilskud-voice-resultat:${ip}`, 6, 10 * 60 * 1000);
  if (!rl.allowed) return json({ error: "For mange forsøg. Vent lidt." }, 429);
  const sid = sessionIdFraToken(body.token as string | undefined);
  if (!sid) return json({ error: "Sessionen er udløbet. Genindlæs siden." }, 401);

  const klientUdskrift = renUdskrift(body.udskrift);
  let udskrift = klientUdskrift;
  const conversationId = String(body.conversationId ?? "").trim();
  if (conversationId && voiceKonfigureret()) {
    try {
      const s = await hentSamtale(conversationId);
      // Kun vores egen agents samtaler. Brug ElevenLabs' udskrift, når den er mindst lige så lang.
      if (s.agentId === agentId() && s.transcript.length >= klientUdskrift.length) {
        udskrift = s.transcript.map((t) => ({ role: t.role === "user" ? "user" : "assistant", content: t.message }));
      }
    } catch (e) {
      console.warn("tilskud voice-resultat: kunne ikke hente samtalen:", (e as Error).message);
    }
  }
  if (udskrift.filter((m) => m.role === "user").length < 1) {
    return json({ tom: true }, 200);
  }

  const afklaringer = (body.afklaringer && typeof body.afklaringer === "object" ? Object.entries(body.afklaringer as Record<string, unknown>) : [])
    .map(([punkt, x]) => normaliserNote({ punkt, ...(x && typeof x === "object" ? x : {}) }))
    .filter((x): x is NonNullable<typeof x> => !!x);
  const afklaringerTekst = afklaringer.map((a) => `${a.id}: ${a.afklaring.status} (${a.afklaring.note})`).join("\n");

  const v = await virksomhedFraBody(body);
  const kontekst = v ? virksomhedSomTekst(v, forhaandstjek(v)) : "";
  let resultat: { kvalificering: Kvalificering | null; vurdering: Vurdering | null };
  try {
    resultat = await udledResultatAfSamtale({ udskrift, kontekst, afklaringer: afklaringerTekst });
  } catch (e) {
    console.error("tilskud voice-resultat: Claude fejlede:", (e as Error).message);
    return json({ error: "Vurderingen kunne ikke samles lige nu. Prøv igen." }, 502);
  }
  await opdaterSession(sid, {
    kanal: "stemme",
    transcript: udskrift,
    afklaringer: Object.fromEntries(afklaringer.map((a) => [a.id, a.afklaring])),
    ...(resultat.kvalificering ? { kvalificering: resultat.kvalificering, status: "kvalificeret", egnethed: resultat.kvalificering.status } : {}),
    ...(resultat.vurdering ? { vurdering: resultat.vurdering, status: "vurderet", egnethed: resultat.vurdering.egnethed.status } : {}),
  });
  if (!resultat.kvalificering && !resultat.vurdering) {
    return json({ error: "Vurderingen blev ikke komplet. Prøv igen." }, 502);
  }
  return json({ ...resultat, transcript: udskrift }, 200);
}

async function lead(req: Request, body: Record<string, unknown>) {
  const ip = clientIp(req);
  const rl = checkRateLimit(`tilskud-lead:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) return json({ error: "For mange forsøg. Prøv igen om lidt." }, 429);

  if (!verifySessionToken(body.token as string | undefined)) {
    return json({ error: "Sessionen er udløbet. Genindlæs siden." }, 401);
  }
  // Honeypot: udfyldt felt = bot.
  if (String(body.website ?? "").trim()) return json({ ok: true }, 200);

  const email = String(body.email ?? "").trim().slice(0, 200);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return json({ error: "Skriv en gyldig e-mail." }, 400);
  if (!body.consent) return json({ error: "Du skal acceptere behandlingen af dine oplysninger." }, 400);

  const navn = String(body.navn ?? "").trim().slice(0, 120);
  const telefon = String(body.telefon ?? "").trim().slice(0, 40);
  const cvr = normaliserCvr(String(body.cvr ?? "")) ?? "";
  const virksomhed = String(body.virksomhed ?? "").trim().slice(0, 200);
  const puljeAlarm = !!body.puljeAlarm;
  const vurdering: Vurdering | null =
    body.vurdering && typeof body.vurdering === "object" ? normaliserVurdering(body.vurdering) : null;
  const kvalificering: Kvalificering | null =
    body.kvalificering && typeof body.kvalificering === "object" ? normaliserKvalificering(body.kvalificering) : null;
  const fase: "kvalificering" | "forberedelse" = vurdering ? "forberedelse" : "kvalificering";
  const transcript = (Array.isArray(body.transcript) ? body.transcript : []).slice(0, 80) as ChatMsg[];

  let pbId = "";
  try {
    pbId = await createRecord("tilskud_leads", {
      email,
      navn,
      telefon,
      cvr,
      virksomhed,
      egnethed: vurdering?.egnethed?.status ?? kvalificering?.status ?? "",
      fase,
      kvalificering: kvalificering ?? null,
      vurdering: vurdering ?? null,
      transcript,
      consent: true,
      pulje_alarm: puljeAlarm,
      status: "new",
    });
  } catch (e) {
    // Fail-soft (lært 2026-11-01 under Fly-udfald i ARN): mails sendes alligevel,
    // så leadet når Michael, selvom PocketBase er nede.
    console.error("tilskud lead: PB-gem fejlede:", (e as Error).message);
  }
  await opdaterSession(sessionIdFraToken(body.token as string | undefined), {
    status: "lead",
    lead_id: pbId,
    ...(vurdering ? { vurdering, egnethed: vurdering.egnethed.status } : {}),
    ...(kvalificering ? { kvalificering } : {}),
  });

  const notif = renderLeadNotifikation({ email, navn, telefon, virksomhed, cvr, puljeAlarm, vurdering, kvalificering, fase, pbId: pbId || "IKKE GEMT (PocketBase-fejl), data står kun i denne mail" });
  await sendEmail({
    to: process.env.EMAIL_FROM_ADDRESS || "michael@spaike.dk",
    subject: notif.subject,
    html: notif.html,
    replyTo: { email, name: navn || email },
  });
  let mailSendt = false;
  if (vurdering) {
    const m = renderVurderingMail(vurdering, virksomhed);
    const r = await sendEmail({ to: email, toName: navn || undefined, subject: m.subject, html: m.html });
    mailSendt = r.ok;
  } else if (kvalificering) {
    const m = renderKvalificeringMail(kvalificering, virksomhed);
    const r = await sendEmail({ to: email, toName: navn || undefined, subject: m.subject, html: m.html });
    mailSendt = r.ok;
  }

  return json({ ok: true, id: pbId, mailSendt }, 200);
}

function json(obj: unknown, status: number) {
  return NextResponse.json(obj, { status });
}
