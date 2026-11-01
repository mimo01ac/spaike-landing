/**
 * /api/tilskud: ét endpoint med tre handlinger (holder Vercel-function-tallet
 * nede; 7 af 12 efter denne). POST { action: "start" | "chat" | "lead", ... }.
 *
 *  start: CVR-opslag + forhåndstjek + session-token. Fejler CVR-opslaget,
 *         udstedes tokenet alligevel (agenten spørger så selv).
 *  chat:  streamer Claude som NDJSON: {type:"text"} | {type:"vurdering"} |
 *         {type:"error"} | {type:"done"}. Kræver gyldigt token.
 *  lead:  gemmer lead i PocketBase (tilskud_leads) + Brevo til Michael og
 *         vurderings-mail til brugeren (fail-soft).
 *
 * CLI: node scripts/tilskud-cli.mjs <start|chat|lead|flow> ... (se filen).
 */

import { NextResponse } from "next/server";
import { issueSessionToken, verifySessionToken } from "@/lib/sessionToken";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import { verifyTurnstile } from "@/lib/turnstile";
import { createRecord } from "@/lib/pocketbase";
import { sendEmail } from "@/lib/email";
import { forhaandstjek, normaliserCvr, slaaCvrOp, virksomhedSomTekst } from "@/lib/tilskud/cvr";
import { naesteRaadgivningspulje } from "@/lib/tilskud/puljer";
import { MAX_TURNS } from "@/lib/tilskud/agent";
import { startTilskudChat } from "@/lib/tilskud/chat";
import { renderLeadNotifikation, renderVurderingMail } from "@/lib/tilskud/email";
import { normaliserVurdering } from "@/lib/tilskud/vurdering";
import type { ChatMsg, StartSvar, Vurdering } from "@/lib/tilskud/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_PAYLOAD_CHARS = 60_000;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Ugyldig anmodning." }, 400);
  }
  const action = String(body.action ?? "");
  if (action === "start") return start(req, body);
  if (action === "chat") return chat(req, body);
  if (action === "lead") return lead(req, body);
  return json({ error: "Ukendt handling." }, 400);
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
  const virksomhed = cvr ? await slaaCvrOp(cvr) : null;
  const tjek = virksomhed ? forhaandstjek(virksomhed) : null;
  const p = naesteRaadgivningspulje();

  const svar: StartSvar = {
    token: issueSessionToken(),
    virksomhed,
    forhaandstjek: tjek,
    pulje: p ? { id: p.id, navn: p.navn, aabner: p.aabner, lukker: p.lukker, maksTilskudKr: p.maksTilskudKr } : null,
  };
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
  let kontekst = "";
  const cvr = normaliserCvr(String(body.cvr ?? ""));
  if (cvr) {
    const v = await slaaCvrOp(cvr);
    if (v) kontekst = virksomhedSomTekst(v, forhaandstjek(v));
  }

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
        const { vurdering, afskaaret } = await handle.faerdig;
        if (vurdering && !afskaaret) {
          send({ type: "vurdering", vurdering });
        } else if (vurdering && afskaaret) {
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
  const transcript = (Array.isArray(body.transcript) ? body.transcript : []).slice(0, 80) as ChatMsg[];

  let pbId = "";
  try {
    pbId = await createRecord("tilskud_leads", {
      email,
      navn,
      telefon,
      cvr,
      virksomhed,
      egnethed: vurdering?.egnethed?.status ?? "",
      vurdering: vurdering ?? null,
      transcript,
      consent: true,
      pulje_alarm: puljeAlarm,
      status: "new",
    });
  } catch (e) {
    console.error("tilskud lead: PB-gem fejlede:", (e as Error).message);
    return json({ error: "Noget gik galt. Prøv igen." }, 500);
  }

  // Fail-soft notifikationer: leadet er gemt uanset.
  const notif = renderLeadNotifikation({ email, navn, telefon, virksomhed, cvr, puljeAlarm, vurdering, pbId });
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
  }

  return json({ ok: true, id: pbId, mailSendt }, 200);
}

function json(obj: unknown, status: number) {
  return NextResponse.json(obj, { status });
}
