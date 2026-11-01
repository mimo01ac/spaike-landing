/**
 * Sessioner i Tilskudstjekket (Michael 2026-11-01): ALLE tjek gemmes fra det
 * øjeblik de starter (virksomhed + samtale), ikke kun dem der beder om mail,
 * og Michael får besked med det samme, så han kan ringe og følge op.
 * Privatlivspolitikken og en linje over CVR-feltet siger det.
 *
 * Record-id = session-tokenets sid, så opdateringer altid rammer brugerens
 * egen session (id'et kommer fra det signerede token, aldrig fra klienten).
 * Alt er fail-soft: en PocketBase- eller mail-fejl må aldrig stoppe brugeren.
 */

import crypto from "crypto";
import { createRecord, updateRecord } from "@/lib/pocketbase";
import { sendEmail } from "@/lib/email";
import type { Forhaandstjek, Virksomhed } from "./cvr";
import { renderSessionStartNotifikation } from "./email";

export const SESSION_COLLECTION = "tilskud_sessioner";

/** Brugeren må aldrig vente på PocketBase eller mail: højst et par sekunder, så fortsætter vi. */
const MAKS_VENT_MS = 3000;
function hoejst<T>(p: Promise<T>, ms = MAKS_VENT_MS): Promise<T | void> {
  return Promise.race([p, new Promise<void>((r) => setTimeout(r, ms))]);
}

/** PocketBase-id: 15 tegn [a-z0-9]. */
export function nytSessionId(): string {
  const alfabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(15);
  return Array.from(bytes, (b) => alfabet[b % alfabet.length]).join("");
}

// Samme CVR startet flere gange inden for en halv time giver kun én mail (pr. instans).
const senestNotificeret = new Map<string, number>();
const DEDUP_MS = 30 * 60 * 1000;

export async function opretSession(opts: {
  id: string;
  cvr: string;
  virksomhed: Virksomhed | null;
  forhaandstjek: Forhaandstjek | null;
  /** false for CLI-/testkørsler (header x-tilskud-test: 1). */
  notificer?: boolean;
}): Promise<void> {
  const v = opts.virksomhed;
  const gem = createRecord(SESSION_COLLECTION, {
    id: opts.id,
    cvr: opts.cvr,
    virksomhed: v?.navn ?? "",
    branche: v?.branche ?? "",
    by: v?.by ?? "",
    ansatte: v?.ansatteInterval ?? (typeof v?.ansatte === "number" ? String(v.ansatte) : ""),
    reklamebeskyttet: !!v?.reklamebeskyttet,
    kanal: "chat",
    status: "startet",
    test: opts.notificer === false,
  }).catch((e) => console.error("tilskud session: PB-opret fejlede:", (e as Error).message));

  const noegle = opts.cvr || "uden-cvr";
  const sidst = senestNotificeret.get(noegle) ?? 0;
  let mail: Promise<unknown> = Promise.resolve();
  if (opts.notificer !== false && Date.now() - sidst > DEDUP_MS) {
    senestNotificeret.set(noegle, Date.now());
    const n = renderSessionStartNotifikation({ id: opts.id, cvr: opts.cvr, virksomhed: v, forhaandstjek: opts.forhaandstjek });
    mail = sendEmail({ to: process.env.EMAIL_FROM_ADDRESS || "michael@spaike.dk", subject: n.subject, html: n.html });
  }
  await hoejst(Promise.allSettled([gem, mail]));
}

export type SessionStatus = "startet" | "kvalificeret" | "vurderet" | "lead";

/** Opdater sessionen (transcript, resultat, kanal, status). Fail-soft. */
export async function opdaterSession(id: string | null, data: Record<string, unknown>): Promise<void> {
  if (!id) return;
  await hoejst(
    updateRecord(SESSION_COLLECTION, id, data).catch((e) =>
      console.error("tilskud session: PB-opdatering fejlede:", (e as Error).message),
    ),
  );
}
