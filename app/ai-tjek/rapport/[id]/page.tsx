import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { DoubleRule, SectionLabel } from "../../../components/EditorialUI";
import { getRecord } from "@/lib/pocketbase";
import type { TjekCheck } from "@/lib/aiTjek";
import LeadForm from "./LeadForm";

export const dynamic = "force-dynamic";

interface ScanRecord {
  id: string;
  url: string;
  domaene: string;
  score: number;
  checks: TjekCheck[];
  created: string;
}

interface Params {
  params: { id: string };
}

async function hentScan(id: string): Promise<ScanRecord | null> {
  if (!/^[a-z0-9]{10,20}$/i.test(id)) return null;
  try {
    return await getRecord<ScanRecord>("ai_tjek_scans", id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const scan = await hentScan(params.id);
  if (!scan) return { title: "Rapport ikke fundet · SpAIke AI-tjek" };
  return {
    title: `AI-parathed ${scan.score}/100 · ${scan.domaene} · SpAIke AI-tjek`,
    description: `Teknisk AI-parathedsrapport for ${scan.domaene}: crawlbarhed, robots.txt, struktureret data og metadata set med AI-søgemaskinernes øjne.`,
    robots: { index: false },
  };
}

function scoreDom(score: number): { label: string; tone: string } {
  if (score >= 80) return { label: "Godt AI-fundament", tone: "text-green-700" };
  if (score >= 55) return { label: "Fornuftig basis, tydelige huller", tone: "text-amber-dark" };
  return { label: "AI-motorerne har svært ved at se jer", tone: "text-red-700" };
}

const STATUS_TEGN: Record<TjekCheck["status"], { tegn: string; farve: string }> = {
  ok: { tegn: "✓", farve: "text-green-700" },
  delvist: { tegn: "!", farve: "text-amber-dark" },
  problem: { tegn: "✕", farve: "text-red-700" },
  info: { tegn: "i", farve: "text-muted" },
};

export default async function RapportPage({ params }: Params) {
  const scan = await hentScan(params.id);
  if (!scan) notFound();
  const checks = Array.isArray(scan.checks) ? scan.checks : [];
  // Én kilde til sandhed: score OG maksimum udregnes af selve tjekkene, så
  // toptallet pr. definition altid stemmer med summen af rækkerne nedenfor.
  const score = checks.reduce((s, c) => s + (c.point || 0), 0);
  const maxScore = checks.reduce((s, c) => s + (c.maxPoint || 0), 0) || 100;
  const dom = scoreDom(Math.round((score / maxScore) * 100));

  return (
    <>
      <Header />
      <main>
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-12 pb-10">
          <SectionLabel>AI-tjek · rapport</SectionLabel>
          <div className="flex flex-wrap items-end gap-x-10 gap-y-6 mt-3">
            <div>
              <div className="font-mono text-[11px] tracking-widest uppercase text-muted">
                {scan.domaene}
              </div>
              <div className="font-serif text-[88px] md:text-[110px] leading-none tracking-tight text-ink">
                {scan.score}
                <span className="text-3xl text-muted">/100</span>
              </div>
              <div className={`font-serif text-xl italic ${dom.tone}`}>{dom.label}</div>
            </div>
            <p className="font-sans text-[14px] leading-relaxed text-ink-soft max-w-md">
              Scoren måler de tekniske forudsætninger for at blive læst, forstået og
              citeret af AI-søgemaskiner (ChatGPT, Perplexity, Google AI Overviews).
              Den er en indikator, ikke en facitliste.
            </p>
          </div>
        </section>

        <DoubleRule />
        <section className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-10 pb-10">
          <SectionLabel>De {checks.length} tjek</SectionLabel>
          <div className="mt-4 divide-y divide-rule">
            {checks.map((c) => {
              const s = STATUS_TEGN[c.status] ?? STATUS_TEGN.info;
              return (
                <div key={c.key} className="py-5 grid md:grid-cols-[32px_1fr_90px] gap-x-4 gap-y-1">
                  <div className={`font-mono text-lg ${s.farve}`}>{s.tegn}</div>
                  <div>
                    <h3 className="font-serif text-lg font-medium leading-tight">{c.titel}</h3>
                    <p className="font-sans text-[13.5px] text-ink mt-1">{c.fund}</p>
                    <p className="font-sans text-[13px] text-ink-soft mt-1 max-w-2xl">
                      {c.betydning}
                    </p>
                  </div>
                  <div className="font-mono text-[12px] text-muted md:text-right">
                    {c.maxPoint > 0 ? `${c.point}/${c.maxPoint} p` : "info"}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <DoubleRule />
        <section className="bg-ink text-cream">
          <div className="max-w-editorial mx-auto w-full px-6 md:px-14 pt-12 pb-14">
            <SectionLabel inverted>Næste skridt · det fulde AI-panel</SectionLabel>
            <h2 className="font-serif text-3xl md:text-4xl font-normal leading-tight max-w-3xl mt-2">
              Teknikken er halvdelen. Vil du vide, hvad AI'erne{" "}
              <em className="italic text-amber">faktisk svarer</em> om jer?
            </h2>
            <p className="font-sans text-[14.5px] leading-relaxed text-cream/75 max-w-2xl mt-4">
              I det fulde AI-panel slår jeg jeres virksomhed op i de store AI-motorer med
              de spørgsmål, jeres kunder stiller: bliver I nævnt, hvem anbefales i stedet,
              og hvilke kilder bygger svarene på? Du får resultatet som rapport pr. mail.
            </p>
            <div className="mt-7 bg-cream text-ink rounded p-6">
              <LeadForm scanId={scan.id} />
            </div>
            <p className="font-sans text-[13px] text-cream/60 mt-6">
              Eller spring direkte til en snak:{" "}
              <a
                href="https://calendly.com/michael-spaike/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="book_moede_click"
                data-umami-event-location="ai-tjek-rapport"
                className="text-amber underline"
              >
                book 20 minutter
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
