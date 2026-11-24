/**
 * Snapshot-lead (/tjek, mail-gaten): validerer svar + kontakt, regner
 * resultatet igen på serveren (klientens tal stoles ikke på), gemmer i
 * PocketBase `snapshot_leads` og mailer Michael.
 *
 * Kaldes fra /api/kontakt med `action: "snapshot"` (12-function-loftet).
 * Fail-soft: fejler PocketBase (fx collectionen mangler), logges
 * `snapshot lead: PB-gem fejlede:` og brugeren får stadig et pænt svar.
 * Test-requests (header `x-snapshot-test: 1`) gemmes med test=true og
 * sender ingen mail.
 */

import { createRecord } from "@/lib/pocketbase";
import { sendEmail } from "@/lib/email";
import {
  beregn,
  brancheLabel,
  formatInterval,
  formatTal,
  regnestykke,
  validerSvar,
  type Resultat,
  type Svar,
} from "@/lib/snapshot/beregn";

const FRIMAIL = new Set([
  "gmail.com", "hotmail.com", "hotmail.dk", "outlook.com", "outlook.dk", "live.dk", "live.com",
  "yahoo.com", "yahoo.dk", "icloud.com", "me.com", "msn.com", "aol.com", "protonmail.com",
  "proton.me", "gmx.com", "mail.dk",
]);

const UTM_FELTER = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "referrer"] as const;

export type SnapshotLeadInput = {
  svar?: unknown;
  timeloenKr?: unknown;
  navn?: unknown;
  email?: unknown;
  firma?: unknown;
  cvr?: unknown;
  utm?: unknown;
};

export type SnapshotLeadSvar =
  | { ok: true; gemt: boolean; mailSendt: boolean; test: boolean; resultat: Resultat }
  | { ok: false; status: number; fejl: string };

function esc(s: unknown): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function haandterSnapshotLead(
  input: SnapshotLeadInput,
  opts: { test: boolean },
): Promise<SnapshotLeadSvar> {
  const v = validerSvar(input.svar);
  if (!v.ok) return { ok: false, status: 400, fejl: v.fejl };

  const navn = str(input.navn, 120);
  const email = str(input.email, 200).toLowerCase();
  const firma = str(input.firma, 160);
  const cvr = str(input.cvr, 20).replace(/\s/g, "");
  if (!navn || !firma) return { ok: false, status: 400, fejl: "Udfyld navn og firma." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, status: 400, fejl: "Skriv en gyldig e-mail." };
  if (cvr && !/^\d{8}$/.test(cvr)) return { ok: false, status: 400, fejl: "CVR-nummeret skal være 8 cifre." };

  const loenRaa = Number(input.timeloenKr);
  const timeloenKr = Number.isFinite(loenRaa) && loenRaa >= 50 && loenRaa <= 3000 ? loenRaa : undefined;
  const resultat = beregn(v.svar, timeloenKr);

  const utmRaa = (input.utm && typeof input.utm === "object" ? input.utm : {}) as Record<string, unknown>;
  const utm: Record<string, string> = {};
  for (const k of UTM_FELTER) {
    const val = str(utmRaa[k], 300);
    if (val) utm[k] = val;
  }

  const domaene = email.split("@")[1] ?? "";

  let gemt = false;
  try {
    await createRecord("snapshot_leads", {
      navn,
      email,
      firma,
      cvr,
      domaene: FRIMAIL.has(domaene) ? "" : domaene,
      branche: brancheLabel(v.svar),
      niveau: resultat.niveau,
      top_proces: resultat.top.label,
      svar: v.svar,
      resultat,
      utm,
      test: opts.test,
      status: "new",
    });
    gemt = true;
  } catch (e) {
    console.error("snapshot lead: PB-gem fejlede:", (e as Error).message);
  }

  let mailSendt = false;
  if (!opts.test) {
    const r = await sendEmail({
      to: process.env.EMAIL_FROM_ADDRESS || "michael@spaike.dk",
      subject: `Snapshot: ${firma} (${resultat.top.label}, niveau ${resultat.niveau})`,
      html: renderNotifikation({ navn, email, firma, cvr, svar: v.svar, resultat, utm, gemt }),
      replyTo: { email, name: navn },
    });
    mailSendt = r.ok;
  }

  return { ok: true, gemt, mailSendt, test: opts.test, resultat };
}

function renderNotifikation(d: {
  navn: string;
  email: string;
  firma: string;
  cvr: string;
  svar: Svar;
  resultat: Resultat;
  utm: Record<string, string>;
  gemt: boolean;
}): string {
  const r = d.resultat;
  const rows = r.processer
    .map(
      (p) =>
        `<tr><td style="padding:4px 8px 4px 0">${esc(p.label)}</td><td style="padding:4px 8px">${esc(formatInterval(p.timerMd, "t/md"))}</td><td style="padding:4px 0">${esc(formatInterval(p.krAar, "kr./år"))}</td></tr>`,
    )
    .join("");
  const utm = Object.entries(d.utm)
    .map(([k, v]) => `${esc(k)}=${esc(v)}`)
    .join(" · ");
  return `<div style="font:14px/1.5 Arial,sans-serif;color:#0f1a2e">
<p><b>Nyt Snapshot-lead</b>${d.gemt ? "" : " <span style=\"color:#a14b2f\">(ikke gemt i PocketBase, se Vercel-log)</span>"}</p>
<p><b>${esc(d.navn)}</b> &lt;${esc(d.email)}&gt;<br>${esc(d.firma)}${d.cvr ? ` · CVR ${esc(d.cvr)}` : ""}<br>
${esc(brancheLabel(d.svar))} · ${esc(d.svar.stoerrelse)} personer · ${esc(d.svar.rolle)}</p>
<p><b>Største tidsrøver:</b> ${esc(r.top.label)}: ${esc(formatInterval(r.top.timerMd, "timer om måneden"))}, ${esc(formatInterval(r.top.krAar, "kr. om året"))}<br>
<span style="color:#6b6650">${esc(regnestykke(r.top, r.antagelser.timeloenKr))}${r.antagelser.timeloenErStandard ? "" : " (timeløn rettet af brugeren)"}</span></p>
<table style="border-collapse:collapse;font-size:13px">${rows}</table>
<p><b>Modenhed:</b> ${r.niveau} · ${esc(r.niveauNavn)}<br><b>Anbefalet modul:</b> ${esc(r.modul.navn)}</p>
${utm ? `<p style="color:#6b6650;font-size:12px">Kilde: ${utm}</p>` : ""}
<p style="color:#6b6650;font-size:12px">Sendt fra spaike.dk/tjek. Svar direkte til afsenderen. Timeløn ${formatTal(r.antagelser.timeloenKr)} kr.</p>
</div>`;
}
