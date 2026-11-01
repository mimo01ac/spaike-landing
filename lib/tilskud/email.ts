/**
 * Mail-skabeloner for /tilskud (bruger-mail med vurderingen + notifikation
 * til Michael). Selve afsendelsen sker via lib/email.ts (Brevo).
 */

import type { Vurdering } from "./types";

const ink = "#0f1a2e";
const soft = "#3a3f4e";
const amber = "#b88f3f";
const rule = "#d8d3c7";
const cream = "#f3eee2";
const CALENDLY = "https://calendly.com/michael-spaike/new-meeting";

function esc(s: unknown): string {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function kr(n: number): string {
  return `${Math.round(n).toLocaleString("da-DK")} kr.`;
}
function p(text: string): string {
  return `<p style="font:400 14px/1.6 Arial,sans-serif;color:${soft};margin:0 0 10px;">${text}</p>`;
}
function h(text: string): string {
  return `<div style="font:600 11px/1.4 Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:${amber};margin:22px 0 6px;">${esc(text)}</div>`;
}
function li(items: string[]): string {
  return `<ul style="margin:0 0 10px;padding-left:18px;">${items
    .map((i) => `<li style="font:400 14px/1.6 Arial,sans-serif;color:${soft};margin:0 0 4px;">${esc(i)}</li>`)
    .join("")}</ul>`;
}

const STATUS_LABEL: Record<string, string> = {
  groen: "Grøn: I kan sandsynligvis søge",
  gul: "Gul: I kan muligvis søge, med forbehold",
  roed: "Rød: I kan ikke søge som det ser ud nu",
};
const STATUS_FARVE: Record<string, string> = { groen: "#1f7a4d", gul: "#b88f3f", roed: "#a23b2e" };

export function renderVurderingMail(v: Vurdering, virksomhed: string): { subject: string; html: string } {
  const farve = STATUS_FARVE[v.egnethed.status] ?? ink;
  const kandidater = v.projekt.kandidater
    .map(
      (k) => `
      <div style="border:1px solid ${rule};border-radius:6px;padding:14px 16px;background:#fff;margin:0 0 10px;">
        <div style="font:600 15px/1.3 Georgia,serif;color:${ink};margin-bottom:6px;">${esc(k.titel)}</div>
        ${p(`<b style="color:${ink}">Problem:</b> ${esc(k.problem)}`)}
        ${p(`<b style="color:${ink}">Mulig gevinst:</b> ${esc(k.gevinst)}`)}
        ${p(`<b style="color:${ink}">Teknologi:</b> ${esc(k.teknologi)}`)}
      </div>`,
    )
    .join("");
  const forloeb = v.projekt.forloeb.map((f) => `${f.leverance}: ${f.beskrivelse}`);

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:${cream};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${cream};padding:28px 0;"><tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;padding:0 20px;">
    <tr><td style="padding:0 0 18px;"><div style="font:700 22px/1 Arial,sans-serif;color:${ink};">Sp<span style="color:${amber};">AI</span>ke</div></td></tr>
    <tr><td><div style="font:600 11px/1.4 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:${amber};">Dit tilskudstjek</div></td></tr>
    <tr><td style="padding:4px 0 14px;"><div style="font:600 24px/1.2 Georgia,serif;color:${ink};">${esc(virksomhed || "Jeres virksomhed")}</div></td></tr>
    <tr><td>
      <div style="border-left:4px solid ${farve};padding:8px 0 8px 14px;margin:0 0 14px;">
        <div style="font:600 14px/1.4 Arial,sans-serif;color:${farve};">${esc(STATUS_LABEL[v.egnethed.status] ?? v.egnethed.status)}</div>
        ${p(esc(v.egnethed.opsummering))}
      </div>
      ${li(v.egnethed.begrundelse)}
      ${v.egnethed.stoppere.length ? h("Det der skal afklares") + li(v.egnethed.stoppere) : ""}

      ${h("Pulje")}
      ${p(`<b style="color:${ink}">${esc(v.pulje.navn)}</b>. ${esc(v.pulje.hvorfor)}`)}

      ${h("Projektoplæg")}
      <div style="font:600 17px/1.3 Georgia,serif;color:${ink};margin:0 0 6px;">${esc(v.projekt.titel)}</div>
      ${p(esc(v.projekt.formaal))}
      ${v.projekt.omfang ? p(`<b style="color:${ink}">Omfang:</b> ${esc(v.projekt.omfang)}`) : ""}
      ${v.projekt.analysespoergsmaal.length ? p(`<b style="color:${ink}">Det analysen skal svare på:</b>`) + li(v.projekt.analysespoergsmaal) : ""}
      ${p(`<b style="color:${ink}">Hypoteser analysen tester:</b>`)}
      ${kandidater}
      ${p(`<b style="color:${ink}">Rådgivningsforløb:</b>`)}
      ${li(forloeb)}
      ${p(`<b style="color:${ink}">Økonomi (skøn):</b> ca. ${v.projekt.estimeret_timer} timer, ${kr(v.projekt.estimeret_pris_kr)} i alt. Tilskud ${kr(v.projekt.tilskud_kr)}, egenbetaling ${kr(v.projekt.egenbetaling_kr)} (kontant, lægges ud og refunderes bagud).`)}

      ${h("Pointindikation")}
      ${p(`Potentiale ${v.point.potentiale}/5: ${esc(v.point.potentiale_begrundelse)}`)}
      ${p(`Kapacitet ${v.point.kapacitet}/5: ${esc(v.point.kapacitet_begrundelse)}`)}
      ${p(esc(v.point.samlet_indikation))}

      ${h("Udkast til ansøgningstekst")}
      ${p(`<b style="color:${ink}">Projektbeskrivelse:</b><br>${esc(v.ansoegningsudkast.projektbeskrivelse).replace(/\n/g, "<br>")}`)}
      ${p(`<b style="color:${ink}">Business case:</b><br>${esc(v.ansoegningsudkast.business_case).replace(/\n/g, "<br>")}`)}

      ${h("Næste skridt")}
      <ol style="margin:0 0 14px;padding-left:18px;">${v.naeste_skridt
        .map((s) => `<li style="font:400 14px/1.6 Arial,sans-serif;color:${soft};margin:0 0 4px;">${esc(s)}</li>`)
        .join("")}</ol>

      <a href="${CALENDLY}" style="display:inline-block;background:${ink};color:${cream};text-decoration:none;font:600 13px/1 Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;padding:14px 22px;border-radius:2px;margin:6px 0 20px;">Book 20 minutter med Michael &rarr;</a>

      <div style="border-top:1px solid ${rule};padding:14px 0 0;">
        ${p(`Vurderingen er en indikation lavet med AI ud fra dine svar og offentlige CVR-data, ikke en afgørelse. Tilsagn gives af SMV:Digital efter pointscoring. Åbenhed: SpAIke er godkendt rådgiver i SMV:Digital og kan være én af de rådgivere, I indhenter tilbud fra; puljen kræver, at I sammenligner flere.`)}
        <p style="font:400 12px/1.5 Arial,sans-serif;color:#6b6650;margin:0;">SpAIke ApS · michael@spaike.dk · spaike.dk/tilskud</p>
      </div>
    </td></tr>
  </table></td></tr></table></body></html>`;

  return { subject: `Tilskudstjek: ${STATUS_LABEL[v.egnethed.status]?.split(":")[0] ?? "resultat"} for ${virksomhed || "jer"}`, html };
}

export function renderLeadNotifikation(opts: {
  email: string;
  navn?: string;
  telefon?: string;
  virksomhed: string;
  cvr?: string;
  puljeAlarm: boolean;
  vurdering: Vurdering | null;
  pbId: string;
}): { subject: string; html: string } {
  const v = opts.vurdering;
  const status = v?.egnethed.status ?? "ukendt";
  const html = `<p>Nyt lead fra <b>/tilskud</b>.</p>
  <p><b>Virksomhed:</b> ${esc(opts.virksomhed)}${opts.cvr ? ` (CVR ${esc(opts.cvr)})` : ""}<br>
  <b>Kontakt:</b> ${esc(opts.navn ?? "")} &lt;${esc(opts.email)}&gt; ${opts.telefon ? esc(opts.telefon) : ""}<br>
  <b>Egnethed:</b> ${esc(status)}${v ? ` · point ${v.point.potentiale}+${v.point.kapacitet}` : ""}<br>
  <b>Puljealarm:</b> ${opts.puljeAlarm ? "ja" : "nej"}<br>
  <b>PocketBase:</b> tilskud_leads/${esc(opts.pbId)}</p>
  ${v ? `<p><b>Projekt:</b> ${esc(v.projekt.titel)}<br>${esc(v.projekt.formaal)}</p><p><b>Økonomi:</b> ${kr(v.projekt.estimeret_pris_kr)} i alt, tilskud ${kr(v.projekt.tilskud_kr)}.</p><p><b>Stoppere:</b> ${v.egnethed.stoppere.length ? esc(v.egnethed.stoppere.join("; ")) : "ingen"}</p>` : "<p>Ingen vurdering (leadet kom før chatten var færdig).</p>"}`;
  return { subject: `Tilskud-lead (${status}): ${opts.virksomhed || opts.email}`, html };
}
