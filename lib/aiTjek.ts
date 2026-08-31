/**
 * AI-tjek scan-motor: deterministisk AI-parathedsscore 0-100 for en URL.
 * INGEN LLM-kald; kun eget crawl af forside + robots.txt + sitemap-probe.
 * Rubrikken kommer fra vaultens "SEO & GEO drejebog (2026)".
 *
 * Server-side only (bruger node:dns til SSRF-guard).
 */

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

export interface TjekCheck {
  key: string;
  titel: string;
  /** "ok" | "delvist" | "problem" | "info" */
  status: "ok" | "delvist" | "problem" | "info";
  point: number;
  maxPoint: number;
  fund: string;
  betydning: string;
}

export interface TjekResultat {
  url: string;
  domaene: string;
  score: number;
  checks: TjekCheck[];
  hentetOk: boolean;
}

const FETCH_UA =
  "SpAIkeAITjek/1.0 (+https://www.spaike.dk/ai-tjek; diagnostisk enkelt-opslag)";
const MAX_HTML = 1_500_000;

/** AI-crawlere hvis adgang afgør synlighed i AI-svar (drejebogens liste). */
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
];

export function normalizeUrl(raw: string): URL | null {
  const v = (raw || "").trim();
  if (!v || v.length > 300) return null;
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const u = new URL(withProto);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    if (!u.hostname.includes(".")) return null;
    if (u.port && u.port !== "80" && u.port !== "443") return null;
    u.hash = "";
    return u;
  } catch {
    return null;
  }
}

function privatIp(ip: string): boolean {
  if (ip.includes(":")) {
    const low = ip.toLowerCase();
    return (
      low === "::1" ||
      low.startsWith("fc") ||
      low.startsWith("fd") ||
      low.startsWith("fe80") ||
      low.startsWith("::ffff:127.") ||
      low.startsWith("::ffff:10.") ||
      low.startsWith("::ffff:192.168.")
    );
  }
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) ||
    a >= 224
  );
}

/** SSRF-guard: afvis hostnames der peger på private/interne adresser. */
export async function erSikkerHost(hostname: string): Promise<boolean> {
  try {
    if (isIP(hostname)) return !privatIp(hostname);
    const addrs = await lookup(hostname, { all: true });
    if (!addrs.length) return false;
    return addrs.every((a) => !privatIp(a.address));
  } catch {
    return false;
  }
}

async function hent(url: string): Promise<{ status: number; text: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": FETCH_UA, Accept: "text/html,*/*" },
      redirect: "follow",
      signal: AbortSignal.timeout(10_000),
    });
    const text = (await res.text()).slice(0, MAX_HTML);
    return { status: res.status, text };
  } catch {
    return null;
  }
}

/** Synlig tekst i rå HTML (uden JS-eksekvering) — proxyen for AI-crawler-læsbarhed. */
export function synligTekstLaengde(html: string): number {
  const stripped = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return stripped.length;
}

interface RobotsAnalyse {
  findes: boolean;
  blokerede: string[];
  altBlokeret: boolean;
}

/** Pragmatisk robots-parse: er nogen af AI-botterne (eller alle via *) lukket ude fra roden? */
export function analyserRobots(txt: string | null): RobotsAnalyse {
  if (txt === null) return { findes: false, blokerede: [], altBlokeret: false };
  const grupper: { agents: string[]; disallowAll: boolean }[] = [];
  let aktuelle: string[] = [];
  let disallowAll = false;
  let iGruppe = false;
  const flush = () => {
    if (aktuelle.length) grupper.push({ agents: aktuelle, disallowAll });
    aktuelle = [];
    disallowAll = false;
  };
  for (const raaLinje of txt.split(/\r?\n/)) {
    const linje = raaLinje.replace(/#.*$/, "").trim();
    if (!linje) continue;
    const m = linje.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const felt = m[1].toLowerCase();
    const vaerdi = m[2].trim();
    if (felt === "user-agent") {
      if (iGruppe) flush();
      aktuelle.push(vaerdi.toLowerCase());
      iGruppe = false;
    } else if (felt === "disallow") {
      iGruppe = true;
      if (vaerdi === "/" || vaerdi === "/*") disallowAll = true;
    } else if (felt === "allow") {
      iGruppe = true;
      if (vaerdi === "/") disallowAll = false;
    }
  }
  flush();

  const blokerede: string[] = [];
  let altBlokeret = false;
  for (const bot of AI_BOTS) {
    const specifik = grupper.find((g) => g.agents.includes(bot.toLowerCase()));
    if (specifik) {
      if (specifik.disallowAll) blokerede.push(bot);
    }
  }
  const wildcard = grupper.find((g) => g.agents.includes("*"));
  if (wildcard?.disallowAll) altBlokeret = true;
  return { findes: true, blokerede, altBlokeret };
}

export async function koerTjek(rawUrl: string): Promise<TjekResultat | { fejl: string }> {
  const u = normalizeUrl(rawUrl);
  if (!u) return { fejl: "Det ligner ikke en gyldig adresse. Prøv fx jeres-domæne.dk" };
  if (!(await erSikkerHost(u.hostname))) {
    return { fejl: "Adressen kan ikke tjekkes (privat eller ukendt vært)." };
  }

  const base = `${u.protocol}//${u.host}`;
  const [forside, robots, sitemap, llms] = await Promise.all([
    hent(u.toString()),
    hent(`${base}/robots.txt`),
    hent(`${base}/sitemap.xml`),
    hent(`${base}/llms.txt`),
  ]);

  const checks: TjekCheck[] = [];
  const html = forside && forside.status < 400 ? forside.text : "";
  const hentetOk = !!html;

  // 1. Render uden JavaScript (25)
  const tekst = synligTekstLaengde(html);
  checks.push({
    key: "render",
    titel: "Kan AI-crawlere læse jeres indhold uden JavaScript?",
    status: !hentetOk ? "problem" : tekst > 800 ? "ok" : tekst > 300 ? "delvist" : "problem",
    point: !hentetOk ? 0 : tekst > 800 ? 25 : tekst > 300 ? 12 : 0,
    maxPoint: 25,
    fund: !hentetOk
      ? "Forsiden kunne ikke hentes."
      : `${tekst.toLocaleString("da-DK")} tegn synlig tekst i den rå HTML.`,
    betydning:
      "De fleste AI-crawlere kører IKKE JavaScript. Er teksten kun synlig efter JS, findes jeres indhold reelt ikke for ChatGPT, Perplexity og AI Overviews.",
  });

  // 2. AI-crawlere i robots.txt (20)
  const ra = analyserRobots(robots && robots.status < 400 ? robots.text : null);
  const botStatus = ra.altBlokeret
    ? "problem"
    : ra.blokerede.length >= 3
      ? "problem"
      : ra.blokerede.length > 0
        ? "delvist"
        : "ok";
  checks.push({
    key: "ai_bots",
    titel: "Er AI-crawlerne lukket inde eller ude i robots.txt?",
    status: botStatus,
    point: botStatus === "ok" ? 20 : botStatus === "delvist" ? 10 : 0,
    maxPoint: 20,
    fund: ra.altBlokeret
      ? "robots.txt blokerer ALLE crawlere fra hele sitet."
      : ra.blokerede.length
        ? `Blokerede AI-crawlere: ${ra.blokerede.join(", ")}.`
        : ra.findes
          ? "Ingen AI-crawlere er blokeret."
          : "Ingen robots.txt fundet (alle crawlere har adgang, men uden styring).",
    betydning:
      "GPTBot, ClaudeBot, PerplexityBot m.fl. skal kunne hente jeres sider, ellers kan AI-motorerne hverken citere eller anbefale jer.",
  });

  // 3. Struktureret data / JSON-LD (12)
  const harJsonLd = /<script[^>]+application\/ld\+json/i.test(html);
  const harOrg = harJsonLd && /"@type"\s*:\s*"?(Organization|LocalBusiness)/i.test(html);
  checks.push({
    key: "schema",
    titel: "Struktureret data (schema.org)",
    status: harOrg ? "ok" : harJsonLd ? "delvist" : "problem",
    point: harOrg ? 12 : harJsonLd ? 8 : 0,
    maxPoint: 12,
    fund: harOrg
      ? "JSON-LD fundet, inkl. Organization/LocalBusiness."
      : harJsonLd
        ? "JSON-LD fundet, men ingen Organization-markup."
        : "Ingen JSON-LD fundet.",
    betydning:
      "Struktureret data gør jeres fakta (navn, ydelser, priser) maskinlæsbare og fodrer brand-entiteten, som AI-svar læner sig op ad.",
  });

  // 4. Meta-basics (12)
  const harTitle = /<title[^>]*>[^<]{3,}<\/title>/i.test(html);
  const harDesc = /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{20,}/i.test(html);
  const harCanonical = /<link[^>]+rel=["']canonical["']/i.test(html);
  const metaPoint = (harTitle ? 4 : 0) + (harDesc ? 5 : 0) + (harCanonical ? 3 : 0);
  checks.push({
    key: "meta",
    titel: "Titel, beskrivelse og canonical",
    status: metaPoint >= 12 ? "ok" : metaPoint >= 5 ? "delvist" : "problem",
    point: metaPoint,
    maxPoint: 12,
    fund: `Titel: ${harTitle ? "ja (4/4)" : "nej (0/4)"} · Meta description: ${harDesc ? "ja (5/5)" : "nej (0/5)"} · Canonical: ${harCanonical ? "ja (3/3)" : "nej (0/3)"}.`,
    betydning:
      "Basal metadata er stadig det, både Google og AI-motorer bruger til at forstå og præsentere siden.",
  });

  // 5. Sitemap (8)
  const harSitemap = !!sitemap && sitemap.status < 400 && /<(urlset|sitemapindex)/i.test(sitemap.text);
  checks.push({
    key: "sitemap",
    titel: "sitemap.xml",
    status: harSitemap ? "ok" : "problem",
    point: harSitemap ? 8 : 0,
    maxPoint: 8,
    fund: harSitemap ? "Sitemap fundet og gyldigt." : "Intet gyldigt sitemap på /sitemap.xml.",
    betydning: "Sitemappet er crawlernes indholdsfortegnelse; uden det opdages nye sider langsomt.",
  });

  // 6. robots.txt findes (5)
  checks.push({
    key: "robots",
    titel: "robots.txt",
    status: ra.findes ? "ok" : "delvist",
    point: ra.findes ? 5 : 3,
    maxPoint: 5,
    fund: ra.findes ? "robots.txt findes." : "Ingen robots.txt (alt er åbent, men ustyret).",
    betydning: "Filen er jeres kontrakt med crawlerne, også de nye AI-crawlere.",
  });

  // 7. Overskrift + sprog (10)
  const harH1 = /<h1[\s>]/i.test(html);
  const harLang = /<html[^>]+lang=["'][a-z]{2}/i.test(html);
  checks.push({
    key: "grundstruktur",
    titel: "H1-overskrift og sprogangivelse",
    status: harH1 && harLang ? "ok" : harH1 || harLang ? "delvist" : "problem",
    point: (harH1 ? 5 : 0) + (harLang ? 5 : 0),
    maxPoint: 10,
    fund: `H1: ${harH1 ? "ja (5/5)" : "nej (0/5)"} · lang-attribut: ${harLang ? "ja (5/5)" : "nej (0/5)"}.`,
    betydning: "Tydelig struktur og sprogmarkering hjælper maskiner med at forstå, hvad og for hvem siden er.",
  });

  // 8. OG-tags / delingskort (8)
  const ogTitle = /<meta[^>]+property=["']og:title["']/i.test(html);
  const ogDesc = /<meta[^>]+property=["']og:description["']/i.test(html);
  const ogImage = /<meta[^>]+property=["']og:image["']/i.test(html);
  const ogPoint = (ogTitle ? 3 : 0) + (ogDesc ? 2 : 0) + (ogImage ? 3 : 0);
  checks.push({
    key: "og",
    titel: "Delingskort (OpenGraph)",
    status: ogPoint >= 8 ? "ok" : ogPoint > 0 ? "delvist" : "problem",
    point: ogPoint,
    maxPoint: 8,
    fund: `og:title: ${ogTitle ? "ja (3/3)" : "nej (0/3)"} · og:description: ${ogDesc ? "ja (2/2)" : "nej (0/2)"} · og:image: ${ogImage ? "ja (3/3)" : "nej (0/3)"}.`,
    betydning:
      "Deles jeres sider på LinkedIn eller citeres med preview, afgør OG-tags om I ligner en professionel afsender.",
  });

  // Info: llms.txt (0 point, bevidst)
  const harLlms = !!llms && llms.status < 400 && llms.text.trim().length > 0 && !/<html/i.test(llms.text);
  checks.push({
    key: "llms",
    titel: "llms.txt",
    status: "info",
    point: 0,
    maxPoint: 0,
    fund: harLlms ? "llms.txt findes." : "Ingen llms.txt.",
    betydning:
      "Omdiskuteret standard uden målt effekt hos de store AI-motorer endnu; medtaget til orientering, tæller ikke i scoren.",
  });

  const score = Math.min(100, checks.reduce((s, c) => s + c.point, 0));
  return {
    url: u.toString(),
    domaene: u.hostname.replace(/^www\./, ""),
    score,
    checks,
    hentetOk,
  };
}
