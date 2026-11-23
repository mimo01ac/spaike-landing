"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  BRANCHER,
  LOEN,
  MAKS_PROCESSER,
  MODENHED_NIVEAUER,
  MODENHED_SVAR,
  PROCESSER,
  PROCES_RAEKKEFOELGE,
  ROLLER,
  STOERRELSER,
  TIMER,
  beregn,
  formatInterval,
  formatTal,
  procesLabel,
  regnestykke,
  standardTimeloen,
  type ProcesId,
  type Svar,
} from "@/lib/snapshot/beregn";
import * as tragt from "./tragt";

const BOOKING_URL = "https://calendly.com/michael-spaike/new-meeting";

type Kladde = Partial<Omit<Svar, "timer" | "processer">> & {
  processer: ProcesId[];
  timer: Partial<Record<ProcesId, string>>;
};

const TOM: Kladde = { processer: [], timer: {} };

function skridtListe(k: Kladde): string[] {
  return ["intro", "branche", "stoerrelse", "rolle", "processer", ...k.processer.map((p) => `timer:${p}`), "timeloen", "modenhed", "resultat"];
}

/** Fast plads til Umami (se tragt.ts). */
function plads(skridt: string, k: Kladde): number {
  if (skridt.startsWith("timer:")) return 5 + k.processer.indexOf(skridt.slice(6) as ProcesId);
  return { branche: 1, stoerrelse: 2, rolle: 3, processer: 4, timeloen: 8, modenhed: 9 }[skridt] ?? 0;
}

function Valg({
  valgt,
  onClick,
  children,
  multi = false,
  disabled = false,
}: {
  valgt: boolean;
  onClick: () => void;
  children: React.ReactNode;
  multi?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={valgt}
      disabled={disabled}
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-3.5 border rounded-sm font-sans text-[15px] transition-colors ${
        valgt ? "border-amber bg-[#fbf4e4] shadow-[inset_0_0_0_1px_#d4a857]" : "border-rule bg-white hover:border-amber"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} text-ink`}
    >
      <span
        aria-hidden="true"
        className={`flex-none w-5 h-5 border-[1.5px] flex items-center justify-center text-[12px] ${
          multi ? "rounded-[4px]" : "rounded-full"
        } ${valgt ? "bg-amber border-amber text-ink" : "border-rule"}`}
      >
        {valgt ? "✓" : ""}
      </span>
      <span>{children}</span>
    </button>
  );
}

function Skala({ niveau }: { niveau: number }) {
  return (
    <ol className="grid grid-cols-4 gap-2 list-none p-0 m-0" aria-label="Modenhedsskala fra 0 til 3">
      {MODENHED_NIVEAUER.map((m) => {
        const aktiv = m.n === niveau;
        return (
          <li key={m.n} aria-current={aktiv ? "true" : undefined} className="flex flex-col">
            <span className={`h-2 rounded-sm ${m.n <= niveau ? "bg-amber" : "bg-rule"}`} />
            <span className={`font-mono text-[11px] tracking-wider mt-2 ${aktiv ? "text-ink font-semibold" : "text-muted"}`}>
              {m.n}
            </span>
            <span className={`font-sans text-[12px] leading-tight ${aktiv ? "text-ink font-semibold" : "text-muted"}`}>
              {m.navn}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function SnapshotFlow() {
  const [k, setK] = useState<Kladde>(TOM);
  const [skridt, setSkridt] = useState("intro");
  const [loenTekst, setLoenTekst] = useState("");
  const [kontakt, setKontakt] = useState({ navn: "", email: "", firma: "", cvr: "", felde: "" });
  const [sender, setSender] = useState(false);
  const [fejl, setFejl] = useState("");
  const [laastOp, setLaastOp] = useState(false);
  const overskrift = useRef<HTMLHeadingElement>(null);
  const utm = useRef<Record<string, string>>({});

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      const v = qs.get(key);
      if (v) utm.current[key] = v;
    }
    if (document.referrer) utm.current.referrer = document.referrer;
  }, []);

  useEffect(() => {
    if (skridt === "intro") return;
    overskrift.current?.focus({ preventScroll: true });
    const top = document.getElementById("snapshot")?.getBoundingClientRect().top ?? 0;
    if (top < 0) document.getElementById("snapshot")?.scrollIntoView({ block: "start" });
  }, [skridt]);

  const liste = skridtListe(k);
  const idx = liste.indexOf(skridt);
  const antalSpm = k.processer.length > 0 ? liste.length - 2 : 9;
  const fremdrift = Math.round((idx / (liste.length - 1)) * 100);

  function gaaTil(ny: Kladde, fra: string) {
    const l = skridtListe(ny);
    const n = l[l.indexOf(fra) + 1];
    if (fra !== "intro") tragt.besvaret(plads(fra, ny));
    setSkridt(n);
  }
  function videre() {
    if (skridt === "intro") tragt.start();
    gaaTil(k, skridt);
  }
  function tilbage() {
    setSkridt(liste[Math.max(1, idx - 1)]);
  }
  /** Ét-valgs-spørgsmål: gem og gå videre med det samme. */
  function vaelgOgVidere(patch: Partial<Kladde>) {
    const ny = { ...k, ...patch };
    setK(ny);
    gaaTil(ny, skridt);
  }

  const svar = useMemo<Svar | null>(() => {
    if (!k.branche || !k.stoerrelse || !k.rolle || !k.timeloen || !k.modenhed || k.processer.length === 0) return null;
    return k as Svar;
  }, [k]);

  const loenTal = Number(loenTekst.replace(/[^\d]/g, ""));
  const loenGyldig = loenTal >= 50 && loenTal <= 3000;
  const res = useMemo(() => (svar ? beregn(svar, loenGyldig ? loenTal : undefined) : null), [svar, loenGyldig, loenTal]);

  useEffect(() => {
    if (skridt === "resultat" && res) tragt.resultat({ niveau: res.niveau, top: res.top.id });
  }, [skridt, res]);

  async function sendLead(e: React.FormEvent) {
    e.preventDefault();
    if (!svar || !res) return;
    setFejl("");
    if (!kontakt.navn.trim() || !kontakt.firma.trim()) return setFejl("Udfyld navn og firma.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(kontakt.email.trim())) return setFejl("Skriv en gyldig e-mail.");
    if (kontakt.cvr.trim() && !/^\d{8}$/.test(kontakt.cvr.replace(/\s/g, ""))) {
      return setFejl("CVR-nummeret skal være 8 cifre.");
    }
    setSender(true);
    try {
      const r = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "snapshot",
          svar,
          timeloenKr: res.antagelser.timeloenKr,
          ...kontakt,
          utm: utm.current,
        }),
      });
      const data = (await r.json().catch(() => ({}))) as { error?: string };
      if (!r.ok) throw new Error(data.error || "Noget gik galt. Prøv igen om lidt.");
      tragt.mailSendt();
      setLaastOp(true);
    } catch (err) {
      setFejl((err as Error).message);
    } finally {
      setSender(false);
    }
  }

  const etiket = (n: number) => (
    <p className="font-mono text-[11px] tracking-widest uppercase text-muted mb-3">
      Spørgsmål {n} af {antalSpm}
    </p>
  );
  const h1 = "font-serif text-[26px] md:text-[32px] leading-[1.2] font-normal text-ink outline-none";
  const knap =
    "inline-flex items-center gap-2 px-6 py-3 bg-amber text-ink hover:bg-amber-dark font-sans font-semibold text-[15px] rounded-sm transition-colors disabled:bg-cream-deep disabled:text-muted disabled:cursor-not-allowed";
  const navRaekke = (ok: boolean, visVidere = true) => (
    <div className="flex justify-between items-center mt-7">
      <button type="button" onClick={tilbage} className="font-sans text-[14px] text-muted hover:text-ink">
        ← Tilbage
      </button>
      {visVidere ? (
        <button type="button" onClick={videre} disabled={!ok} className={knap}>
          Videre →
        </button>
      ) : (
        <span />
      )}
    </div>
  );

  let indhold: React.ReactNode = null;

  if (skridt === "intro") {
    indhold = (
      <>
        <p className="font-mono text-[11px] tracking-widest uppercase text-muted mb-3">SpAIke Snapshot · gratis</p>
        <h1 className={h1}>Hvor går jeres tid, og hvad koster det?</h1>
        <p className="font-sans text-[15.5px] text-ink-soft mt-4 leading-relaxed">
          Højst 9 korte spørgsmål, ca. 2 minutter. Du ser med det samme jeres største tidsrøver i timer om måneden
          og kroner om året, hvor I står på skalaen fra 0 til 3, og hvilket modul der passer. Du skal ikke oplyse
          din mail for at se resultatet.
        </p>
        <div className="mt-7">
          <button type="button" onClick={videre} className={knap}>
            Start →
          </button>
        </div>
      </>
    );
  } else if (skridt === "branche") {
    indhold = (
      <>
        {etiket(idx)}
        <h1 ref={overskrift} tabIndex={-1} className={h1}>Hvilken branche er I i?</h1>
        <div className="flex flex-col gap-2 mt-6">
          {BRANCHER.map((b) => (
            <Valg
              key={b}
              valgt={k.branche === b}
              onClick={() => (b === "Andet" ? setK({ ...k, branche: b }) : vaelgOgVidere({ branche: b, brancheAndet: undefined }))}
            >
              {b}
            </Valg>
          ))}
        </div>
        {k.branche === "Andet" && (
          <input
            aria-label="Hvilken branche?"
            autoFocus
            placeholder="Skriv jeres branche, fx restaurant eller landbrug"
            value={k.brancheAndet ?? ""}
            onChange={(e) => setK({ ...k, brancheAndet: e.target.value })}
            className="mt-3 w-full px-4 py-3 border border-rule rounded-sm bg-white font-sans text-[15px] focus:outline-none focus:border-amber"
          />
        )}
        {navRaekke(!!k.branche && (k.branche !== "Andet" || !!k.brancheAndet?.trim()), !!k.branche)}
      </>
    );
  } else if (skridt === "stoerrelse") {
    indhold = (
      <>
        {etiket(idx)}
        <h1 ref={overskrift} tabIndex={-1} className={h1}>Hvor mange er I i virksomheden?</h1>
        <div className="flex flex-col gap-2 mt-6">
          {STOERRELSER.map((s) => (
            <Valg key={s.id} valgt={k.stoerrelse === s.id} onClick={() => vaelgOgVidere({ stoerrelse: s.id })}>
              {s.tekst}
            </Valg>
          ))}
        </div>
        {navRaekke(!!k.stoerrelse, !!k.stoerrelse)}
      </>
    );
  } else if (skridt === "rolle") {
    indhold = (
      <>
        {etiket(idx)}
        <h1 ref={overskrift} tabIndex={-1} className={h1}>Hvad er din rolle?</h1>
        <div className="flex flex-col gap-2 mt-6">
          {ROLLER.map((r) => (
            <Valg key={r} valgt={k.rolle === r} onClick={() => vaelgOgVidere({ rolle: r })}>
              {r}
            </Valg>
          ))}
        </div>
        {navRaekke(!!k.rolle, !!k.rolle)}
      </>
    );
  } else if (skridt === "processer") {
    const fuld = k.processer.length >= MAKS_PROCESSER;
    const toggle = (p: ProcesId) => {
      if (k.processer.includes(p)) {
        const timer = { ...k.timer };
        delete timer[p];
        setK({ ...k, processer: k.processer.filter((x) => x !== p), timer, ...(p === "andet" ? { procesAndet: undefined } : {}) });
      } else if (!fuld) {
        setK({ ...k, processer: [...k.processer, p] });
      }
    };
    const andetValgt = k.processer.includes("andet");
    indhold = (
      <>
        {etiket(idx)}
        <h1 ref={overskrift} tabIndex={-1} className={h1}>Hvilke opgaver fylder mest manuelt hos jer?</h1>
        <p className="font-sans text-[13px] text-muted mt-2">Vælg op til tre.</p>
        <div className="flex flex-col gap-2 mt-5">
          {PROCES_RAEKKEFOELGE.map((p) => (
            <Valg
              key={p}
              multi
              valgt={k.processer.includes(p)}
              disabled={fuld && !k.processer.includes(p)}
              onClick={() => toggle(p)}
            >
              {p === "andet" ? "Andet (en anden manuel opgave)" : PROCESSER[p].label}
            </Valg>
          ))}
        </div>
        {andetValgt && (
          <input
            aria-label="Hvilken opgave?"
            placeholder="Skriv opgaven, fx tilbudsberegning eller vagtplan"
            value={k.procesAndet ?? ""}
            onChange={(e) => setK({ ...k, procesAndet: e.target.value })}
            className="mt-3 w-full px-4 py-3 border border-rule rounded-sm bg-white font-sans text-[15px] focus:outline-none focus:border-amber"
          />
        )}
        {navRaekke(k.processer.length > 0 && (!andetValgt || !!k.procesAndet?.trim()))}
      </>
    );
  } else if (skridt.startsWith("timer:")) {
    const p = skridt.slice(6) as ProcesId;
    indhold = (
      <>
        {etiket(idx)}
        <h1 ref={overskrift} tabIndex={-1} className={h1}>
          Hvor mange timer om ugen bruger I tilsammen på{" "}
          <span className="text-amber-dark">{procesLabel(p, k.procesAndet).toLowerCase()}</span>?
        </h1>
        <p className="font-sans text-[13px] text-muted mt-2">Alle, der laver opgaven, tilsammen. Et skøn er fint.</p>
        <div className="flex flex-col gap-2 mt-5">
          {TIMER.map((t) => (
            <Valg key={t.id} valgt={k.timer[p] === t.id} onClick={() => vaelgOgVidere({ timer: { ...k.timer, [p]: t.id } })}>
              {t.tekst}
            </Valg>
          ))}
        </div>
        {navRaekke(!!k.timer[p], !!k.timer[p])}
      </>
    );
  } else if (skridt === "timeloen") {
    indhold = (
      <>
        {etiket(idx)}
        <h1 ref={overskrift} tabIndex={-1} className={h1}>
          Hvad er timelønnen ca. for dem, der laver opgaverne?
        </h1>
        <p className="font-sans text-[13px] text-muted mt-2">
          Bruges kun til at regne tiden om til kroner. Du kan rette tallet bagefter.
        </p>
        <div className="flex flex-col gap-2 mt-5">
          {LOEN.map((l) => (
            <Valg
              key={l.id}
              valgt={k.timeloen === l.id}
              onClick={() => {
                setLoenTekst(String(l.kr));
                vaelgOgVidere({ timeloen: l.id });
              }}
            >
              {l.tekst}
            </Valg>
          ))}
        </div>
        {navRaekke(!!k.timeloen, !!k.timeloen)}
      </>
    );
  } else if (skridt === "modenhed") {
    indhold = (
      <>
        {etiket(idx)}
        <h1 ref={overskrift} tabIndex={-1} className={h1}>Kører noget af jeres arbejde af sig selv i dag?</h1>
        <div className="flex flex-col gap-2 mt-6">
          {MODENHED_SVAR.map((m) => (
            <Valg key={m.id} valgt={k.modenhed === m.id} onClick={() => vaelgOgVidere({ modenhed: m.id })}>
              {m.tekst}
            </Valg>
          ))}
        </div>
        {navRaekke(!!k.modenhed, !!k.modenhed)}
      </>
    );
  } else if (skridt === "resultat" && res && svar) {
    const a = res.antagelser;
    indhold = (
      <>
        <p className="font-mono text-[11px] tracking-widest uppercase text-muted mb-3">Jeres Snapshot</p>
        <div className="bg-ink text-cream rounded px-6 py-7" data-testid="snapshot-resultat">
          <p className="font-mono text-[11px] tracking-widest uppercase text-[#9a9482]">Største tidsrøver</p>
          <h1 ref={overskrift} tabIndex={-1} className="font-serif text-[24px] md:text-[28px] leading-snug text-cream mt-2 outline-none">
            {res.top.label}
          </h1>
          <p className="font-serif text-[26px] md:text-[32px] leading-tight mt-4">
            <span className="text-amber">{formatInterval(res.top.timerMd, "timer")}</span>{" "}
            <span className="text-cream/80 text-[18px] md:text-[20px]">om måneden</span>
          </p>
          <p className="font-serif text-[26px] md:text-[32px] leading-tight mt-1">
            <span className="text-amber">{formatInterval(res.top.krAar, "kr.")}</span>{" "}
            <span className="text-cream/80 text-[18px] md:text-[20px]">om året i løn</span>
          </p>
          <p className="font-sans text-[13px] text-[#c9c2ad] mt-4">
            Det er jeres eget skøn, ikke en måling.
          </p>
        </div>

        <div className="mt-5 border border-rule bg-white rounded-sm px-5 py-5">
          <p className="font-mono text-[11px] tracking-widest uppercase text-muted">Antagelser</p>
          <ul className="list-none p-0 m-0 mt-3 space-y-2 font-sans text-[14px] text-ink-soft">
            <li className="flex flex-wrap items-center gap-2">
              <label htmlFor="timeloen" className="text-ink">Timeløn:</label>
              <input
                id="timeloen"
                inputMode="numeric"
                value={loenTekst}
                onChange={(e) => setLoenTekst(e.target.value)}
                className="w-24 px-2 py-1 border border-rule rounded-sm bg-cream/40 text-ink focus:outline-none focus:border-amber"
              />
              <span>kr. i timen</span>
              <span className="text-muted text-[12.5px]">
                {loenGyldig ? (a.timeloenErStandard ? "(standard ud fra jeres svar, ret den gerne)" : "(rettet af dig)") : `(skriv et tal mellem 50 og 3.000; jeg regner med ${formatTal(standardTimeloen(svar.timeloen))} kr.)`}
              </span>
            </li>
            <li>
              <span className="text-ink">Antal personer i virksomheden:</span> {STOERRELSER.find((s) => s.id === a.stoerrelse)?.tekst} (jeres svar). Timerne er jeres samlede skøn for alle, der laver opgaven.
            </li>
            <li>
              <span className="text-ink">Lønomkostning:</span> timelønnen ganges med 1,25 for pension, ferie og andre lønudgifter, og der regnes med 52 uger om året.
            </li>
          </ul>
        </div>

        <div className="mt-5 border border-rule bg-white rounded-sm px-5 py-5" data-testid="snapshot-modenhed">
          <p className="font-mono text-[11px] tracking-widest uppercase text-muted">Hvor meget kører af sig selv</p>
          <p className="font-serif text-[20px] text-ink mt-2">
            Niveau {res.niveau}: {res.niveauNavn}
          </p>
          <p className="font-sans text-[14px] text-ink-soft mt-1 mb-4">{res.niveauTekst} {res.naesteSkridt}</p>
          <Skala niveau={res.niveau} />
        </div>

        <div className="mt-5 border border-amber bg-cream-deep rounded-sm px-5 py-5">
          <p className="font-mono text-[11px] tracking-widest uppercase text-amber-dark">Det modul, der passer</p>
          <p className="font-serif text-[20px] text-ink mt-2">{res.modul.navn}</p>
          <p className="font-sans text-[14px] text-ink-soft mt-1">{res.modul.goer}</p>
          <a
            href={res.modul.href}
            data-track-event="snapshot_modul_click"
            data-track-modul={res.modul.id}
            className="inline-block mt-3 font-mono text-[11px] tracking-wider uppercase text-ink hover:text-amber-dark no-underline"
          >
            Se modulet under ydelser →
          </a>
        </div>

        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => tragt.bookKlik("resultat")}
          className="block text-center mt-6 px-6 py-4 bg-ink text-cream hover:bg-amber hover:text-ink no-underline font-sans font-semibold text-[15px] rounded-sm transition-colors"
        >
          Book 20 minutter om jeres største tidsrøver →
        </a>

        {!laastOp ? (
          <form onSubmit={sendLead} className="mt-8 border-t border-rule pt-7" noValidate>
            <h2 className="font-serif text-[22px] text-ink">Vil du have detaljerne?</h2>
            <p className="font-sans text-[14.5px] text-ink-soft mt-2">
              Du får alle opgaverne regnet igennem, regnestykket i klartekst og tre konkrete måder at fjerne
              jeres største tidsrøver. Dine svar lander hos mig, så jeg kan vende tilbage, hvis jeg ser noget
              konkret for jer.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
              {(
                [
                  ["navn", "Navn", "text", "name"],
                  ["email", "Arbejdsmail", "email", "email"],
                  ["firma", "Firma", "text", "organization"],
                  ["cvr", "CVR-nummer (valgfrit)", "text", "off"],
                ] as const
              ).map(([felt, label, type, ac]) => (
                <label key={felt} className="flex flex-col gap-1">
                  <span className="font-mono text-[11px] tracking-wider uppercase text-muted">{label}</span>
                  <input
                    type={type}
                    autoComplete={ac}
                    inputMode={felt === "cvr" ? "numeric" : undefined}
                    value={kontakt[felt]}
                    onChange={(e) => setKontakt({ ...kontakt, [felt]: e.target.value })}
                    className="px-4 py-3 border border-rule rounded-sm bg-white font-sans text-[15px] focus:outline-none focus:border-amber"
                  />
                </label>
              ))}
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={kontakt.felde}
                onChange={(e) => setKontakt({ ...kontakt, felde: e.target.value })}
                className="hidden"
              />
            </div>
            {fejl && <p className="font-sans text-[13.5px] text-[#a14b2f] mt-3" role="alert">{fejl}</p>}
            <div className="flex flex-wrap items-center gap-4 mt-5">
              <button type="submit" disabled={sender} className={knap}>
                {sender ? "Sender..." : "Vis detaljerne →"}
              </button>
              <p className="font-sans text-[12.5px] text-muted">
                Ingen nyhedsbrev. Læs <a href="/privatlivspolitik" className="underline">privatlivspolitikken</a>.
              </p>
            </div>
          </form>
        ) : (
          <section className="mt-8 border-t border-rule pt-7" data-testid="snapshot-detaljer">
            <h2 className="font-serif text-[22px] text-ink">Detaljerne</h2>
            <p className="font-sans text-[14px] text-ink-soft mt-2">
              Tak. Jeg har fået dine svar og skriver til dig, hvis jeg ser noget konkret for jer.
            </p>
            <div className="overflow-x-auto mt-4">
              <table className="w-full border-collapse font-sans text-[14px]">
                <thead>
                  <tr className="text-left font-mono text-[11px] tracking-wider uppercase text-muted">
                    <th className="py-2 pr-3 border-b border-rule font-medium">Opgave</th>
                    <th className="py-2 px-3 border-b border-rule font-medium whitespace-nowrap">Om måneden</th>
                    <th className="py-2 pl-3 border-b border-rule font-medium whitespace-nowrap">Om året</th>
                  </tr>
                </thead>
                <tbody>
                  {res.processer.map((p) => (
                    <tr key={p.id} className="text-ink-soft">
                      <td className="py-2 pr-3 border-b border-rule">{p.label}</td>
                      <td className="py-2 px-3 border-b border-rule whitespace-nowrap">{formatInterval(p.timerMd, "timer")}</td>
                      <td className="py-2 pl-3 border-b border-rule whitespace-nowrap">{formatInterval(p.krAar, "kr.")}</td>
                    </tr>
                  ))}
                  {res.processer.length > 1 && (
                    <tr className="text-ink font-semibold">
                      <td className="py-2 pr-3">I alt</td>
                      <td className="py-2 px-3 whitespace-nowrap">{formatInterval(res.samlet.timerMd, "timer")}</td>
                      <td className="py-2 pl-3 whitespace-nowrap">{formatInterval(res.samlet.krAar, "kr.")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="font-mono text-[11px] tracking-widest uppercase text-muted mt-6">Regnestykket</p>
            <ul className="list-none p-0 m-0 mt-2 space-y-1.5 font-sans text-[13.5px] text-ink-soft">
              {res.processer.map((p) => (
                <li key={p.id}>
                  <span className="text-ink">{p.label}:</span> {regnestykke(p, a.timeloenKr)}
                </li>
              ))}
            </ul>
            <p className="font-mono text-[11px] tracking-widest uppercase text-muted mt-6">
              Tre måder at fjerne jeres største tidsrøver
            </p>
            {res.forslag ? (
              <ol className="mt-2 pl-5 space-y-2 font-sans text-[14.5px] text-ink-soft">
                {res.forslag.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 font-sans text-[14.5px] text-ink-soft">
                Du har selv beskrevet opgaven, så jeg giver ikke standardsvar her. De fleste gentagne opgaver kan
                enten køre helt af sig selv eller få et system, der laver det meste af arbejdet, mens en
                medarbejder godkender. Det tager vi på et kort møde.
              </p>
            )}
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => tragt.bookKlik("detaljer")}
              className="block text-center mt-6 px-6 py-4 bg-amber text-ink hover:bg-amber-dark no-underline font-sans font-semibold text-[15px] rounded-sm transition-colors"
            >
              Book 20 minutter: se hvordan den kan køre af sig selv →
            </a>
          </section>
        )}

        <div className="mt-6">
          <button type="button" onClick={tilbage} className="font-sans text-[14px] text-muted hover:text-ink">
            ← Ret dine svar
          </button>
        </div>
      </>
    );
  }

  return (
    <div id="snapshot" className="max-w-2xl mx-auto w-full">
      <div className="h-1.5 bg-cream-deep rounded-sm overflow-hidden" aria-hidden="true">
        <i className="block h-full bg-amber transition-[width] duration-300" style={{ width: `${fremdrift}%` }} />
      </div>
      <div className="pt-8 pb-4">{indhold}</div>
    </div>
  );
}
