/**
 * Mail-afsendelse via Brevo (transactional email API, EU/GDPR-fint).
 * Bruges af /lead til at sende case-briefen + DIY-guide-link til brugeren.
 *
 * Server-side only. Fejler blødt: hvis BREVO_API_KEY mangler eller Brevo
 * fejler, logges det og leadet er stadig gemt i PocketBase (manuel opfølgning).
 *
 * Env: BREVO_API_KEY, EMAIL_FROM_ADDRESS (verificeret afsender i Brevo),
 * EMAIL_FROM_NAME.
 */

import type { CaseBriefData, CaseItem } from "@/app/ai-innovationsdag/_types";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";
const GUIDE_URL = "https://www.spaike.dk/ai-innovationsdag/guide";

export async function sendEmail(opts: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; reason?: string }> {
  const key = process.env.BREVO_API_KEY;
  if (!key) {
    console.warn("BREVO_API_KEY mangler, springer mail-afsendelse over");
    return { ok: false, reason: "no_key" };
  }
  const fromEmail = process.env.EMAIL_FROM_ADDRESS || "michael@spaike.dk";
  const fromName = process.env.EMAIL_FROM_NAME || "SpAIke";

  try {
    const res = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        "api-key": key,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: fromName, email: fromEmail },
        to: [{ email: opts.to, name: opts.toName || opts.to }],
        replyTo: { email: fromEmail, name: fromName },
        subject: opts.subject,
        htmlContent: opts.html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error("Brevo-fejl:", res.status, body.slice(0, 300));
      return { ok: false, reason: `brevo_${res.status}` };
    }
    return { ok: true };
  } catch (e) {
    console.error("Brevo exception:", (e as Error).message);
    return { ok: false, reason: "exception" };
  }
}

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Render case-briefen som en enkel, brand-tonet HTML-mail (inline styles). */
export function renderBriefEmail(brief: CaseBriefData): { subject: string; html: string } {
  const ink = "#0f1a2e";
  const soft = "#3a3f4e";
  const amber = "#b88f3f";
  const rule = "#d8d3c7";
  const cream = "#f3eee2";

  const cases = Array.isArray(brief?.cases) ? brief.cases : [];
  const caseBlocks = cases
    .map(
      (c: CaseItem, i: number) => `
      <tr><td style="padding:0 0 22px 0;">
        <div style="border:1px solid ${rule};border-radius:6px;padding:18px 20px;background:#ffffff;">
          <div style="font:600 11px/1.4 Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:${amber};margin-bottom:6px;">Case ${i + 1}</div>
          <div style="font:600 18px/1.3 Georgia,serif;color:${ink};margin-bottom:10px;">${esc(c.titel)}</div>
          <p style="font:400 14px/1.6 Arial,sans-serif;color:${soft};margin:0 0 8px;"><strong style="color:${ink};">Problem:</strong> ${esc(c.problem)}</p>
          <p style="font:400 14px/1.6 Arial,sans-serif;color:${soft};margin:0 0 8px;"><strong style="color:${ink};">Hvorfor godt fit:</strong> ${esc(c.hvorfor_godt_fit)}</p>
          <p style="font:400 14px/1.6 Arial,sans-serif;color:${soft};margin:0;"><strong style="color:${ink};">Mulig løsning:</strong> ${esc(c.mulig_loesning)}</p>
        </div>
      </td></tr>`,
    )
    .join("");

  const deltagere =
    brief?.deltagere_forslag && brief.deltagere_forslag.length
      ? `<p style="font:400 14px/1.6 Arial,sans-serif;color:${soft};margin:0 0 18px;"><strong style="color:${ink};">Hvem kunne være med:</strong> ${esc(brief.deltagere_forslag.join(", "))}</p>`
      : "";

  const html = `<!doctype html><html><body style="margin:0;padding:0;background:${cream};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${cream};padding:28px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;padding:0 20px;">
        <tr><td style="padding:0 0 18px;">
          <div style="font:700 22px/1 Arial,sans-serif;color:${ink};">Sp<span style="color:${amber};">AI</span>ke</div>
        </td></tr>
        <tr><td style="padding:0 0 6px;">
          <div style="font:600 11px/1.4 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:${amber};">Din case-brief</div>
        </td></tr>
        <tr><td style="padding:0 0 14px;">
          <div style="font:600 26px/1.2 Georgia,serif;color:${ink};">${esc(brief?.virksomhed) || "Jeres AI-innovationsdag"}</div>
        </td></tr>
        <tr><td style="padding:0 0 22px;">
          <p style="font:400 15px/1.6 Arial,sans-serif;color:${soft};margin:0;">Tak fordi du prøvede Innovationsdag-guiden. Her er de problemstillinger, jeg vil starte med, hvis I skulle køre en AI-innovationsdag. Det er et afsæt, ikke en færdig plan. Vil du have hjælp til at køre dagen, så svar bare på denne mail.</p>
        </td></tr>
        ${deltagere ? `<tr><td>${deltagere}</td></tr>` : ""}
        ${caseBlocks}
        <tr><td style="padding:4px 0 22px;">
          <div style="border-left:3px solid ${amber};padding:4px 0 4px 14px;">
            <div style="font:600 11px/1.4 Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:${soft};margin-bottom:4px;">Min anbefaling</div>
            <p style="font:italic 16px/1.6 Georgia,serif;color:${ink};margin:0;">${esc(brief?.samlet_anbefaling)}</p>
          </div>
        </td></tr>
        <tr><td style="padding:6px 0 26px;">
          <a href="${GUIDE_URL}" style="display:inline-block;background:${ink};color:${cream};text-decoration:none;font:600 13px/1 Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;padding:14px 22px;border-radius:2px;">Læs guiden: kør dagen selv &rarr;</a>
        </td></tr>
        <tr><td style="border-top:1px solid ${rule};padding:16px 0 0;">
          <p style="font:400 12px/1.5 Arial,sans-serif;color:#6b6650;margin:0;">SpAIke ApS · michael@spaike.dk · spaike.dk</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body></html>`;

  return { subject: "Din case-brief til en AI-innovationsdag", html };
}
