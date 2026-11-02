/**
 * Tekst til tale-dansk for stemme-agenten (Michael 2026-11-02: "tallene og AI
 * udtales forkert"). Alt faktagrundlag og alle puljedata, agenten får, køres
 * igennem her, så der aldrig står cifre, "kr.", "%" eller "AI" i det, den læser
 * fra. Samme regel som i alle SpAIkes andre voice-agenter: tal som danske ord,
 * "kunstig intelligens" i stedet for forkortelsen.
 */

const EN = ["nul", "en", "to", "tre", "fire", "fem", "seks", "syv", "otte", "ni", "ti", "elleve", "tolv", "tretten", "fjorten", "femten", "seksten", "sytten", "atten", "nitten"];
const TI = ["", "", "tyve", "tredive", "fyrre", "halvtreds", "tres", "halvfjerds", "firs", "halvfems"];

function under100(n: number): string {
  if (n < 20) return EN[n];
  const t = Math.floor(n / 10);
  const e = n % 10;
  return e ? `${EN[e]}og${TI[t]}` : TI[t];
}

function under1000(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const hs = h === 0 ? "" : h === 1 ? "hundrede" : `${EN[h]} hundrede`;
  if (!r) return hs || "nul";
  return hs ? `${hs} og ${under100(r)}` : under100(r);
}

/** Heltal som danske ord, fx 150000 -> "hundrede og halvtreds tusind". */
export function talSomOrd(n: number): string {
  if (!Number.isFinite(n)) return String(n);
  if (n < 0) return `minus ${talSomOrd(-n)}`;
  n = Math.round(n);
  if (n < 1000) return under1000(n);
  if (n < 1_000_000) {
    const t = Math.floor(n / 1000);
    const r = n % 1000;
    const ts = t === 1 ? "tusind" : `${under1000(t)} tusind`;
    if (!r) return ts;
    return r < 100 ? `${ts} og ${under100(r)}` : `${ts} ${under1000(r)}`;
  }
  const m = Math.floor(n / 1_000_000);
  const r = n % 1_000_000;
  const ms = m === 1 ? "en million" : `${under1000(m)} millioner`;
  return r ? `${ms} ${talSomOrd(r)}` : ms;
}

const ORDENSTAL = ["", "første", "anden", "tredje", "fjerde", "femte", "sjette", "syvende", "ottende", "niende", "tiende", "ellevte", "tolvte", "trettende", "fjortende", "femtende", "sekstende", "syttende", "attende", "nittende", "tyvende", "enogtyvende", "toogtyvende", "treogtyvende", "fireogtyvende", "femogtyvende", "seksogtyvende", "syvogtyvende", "otteogtyvende", "niogtyvende", "tredivte", "enogtredivte"];
const MAANEDER = "januar|februar|marts|april|maj|juni|juli|august|september|oktober|november|december";

function heltal(s: string): number {
  return Number(s.replace(/\./g, ""));
}

/** Gør en tekst klar til at blive læst højt på dansk. */
export function tilTaleDansk(tekst: string): string {
  let s = tekst;
  s = s.replace(/\s*\[id: [^\]]+\]/g, "");
  s = s.replace(/SMV:Digital/g, "SMV Digital");
  s = s.replace(/\bmin\.\s/g, "mindst ").replace(/\bmaks\.\s/g, "højst ").replace(/\bca\.\s/g, "cirka ").replace(/\bfx\b/g, "for eksempel");
  s = s.replace(/SpAIke/g, "Spajk");
  // "AI" (også i sammensætninger som "AI-assistent") -> kunstig intelligens.
  s = s.replace(/\bAI-/g, "kunstig intelligens-").replace(/\bAI\b/g, "kunstig intelligens");
  // Datoer: "9. november 2026" / "9. november" (ordenstal + årstal).
  s = s.replace(new RegExp(`(?:\\bden\\s+)?\\b(\\d{1,2})\\.\\s+(${MAANEDER})(\\s+(\\d{4}))?`, "g"), (_m, d: string, mdr: string, _a, aar?: string) => {
    const dag = ORDENSTAL[Number(d)] ?? d;
    return `den ${dag} ${mdr}${aar ? ` ${talSomOrd(Number(aar))}` : ""}`;
  });
  // Klokkeslæt: "kl. 09.00" -> "klokken ni", "kl. 23.55" -> "klokken treogtyve femoghalvtreds".
  s = s.replace(/\bkl\.\s*(\d{1,2})[.:](\d{2})/g, (_m, t: string, mi: string) =>
    Number(mi) ? `klokken ${talSomOrd(Number(t))} ${talSomOrd(Number(mi))}` : `klokken ${talSomOrd(Number(t))}`,
  );
  // Intervaller: "0-5" -> "nul til fem".
  s = s.replace(/\b(\d+)-(\d+)\b/g, (_m, a: string, b: string) => `${talSomOrd(Number(a))} til ${talSomOrd(Number(b))}`);
  // Forhold: "1:1" -> "en til en".
  s = s.replace(/\b(\d+):(\d+)\b/g, (_m, a: string, b: string) => `${talSomOrd(Number(a))} til ${talSomOrd(Number(b))}`);
  // Beløb og enheder.
  s = s.replace(/\b(\d[\d.]*)\s*mio\.(\s*kr\.)?/g, (_m, t: string, kr?: string) => `${talSomOrd(heltal(t))} millioner${kr ? " kroner" : ""}`);
  s = s.replace(/\b(\d[\d.]*)\s*kr\./g, (_m, t: string) => `${talSomOrd(heltal(t))} kroner`);
  s = s.replace(/\b(\d[\d.]*)\s*%/g, (_m, t: string) => `${talSomOrd(heltal(t))} procent`);
  s = s.replace(/\bkr\./g, "kroner");
  // Resterende tal (inkl. tusindtalsseparator "150.000").
  s = s.replace(/\b\d{1,3}(?:\.\d{3})+\b|\b\d+\b/g, (t) => talSomOrd(heltal(t)));
  return s;
}
