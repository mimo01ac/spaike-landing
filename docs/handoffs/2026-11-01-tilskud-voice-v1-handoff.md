# Handoff: Tilskudstjek voice-tilstand v1 (2026-11-01, aften)

Status: koden er færdig, type-tjekket og bygget (`npm run build` grøn), men IKKE merget til main. Ligger som WIP-commit på branch `mimo01ac/digitaliseringsst-tte-id-kritik`. Michael vil teste stemmen i morgen formiddag (2026-11-02) på www.spaike.dk/tilskud, så næste tråd skal merge og verificere i prod FØRST.

## Hvad er bygget (uncommitted før denne handoff, nu i WIP-commit)

- `lib/tilskud/tts.ts`: ElevenLabs TTS (`eleven_flash_v2_5`, `language_code: da`, stream mp3 44.1k/64), `tilTale()` der stripper markdown og klipper til 1500 tegn, `ttsKonfigureret()`.
- `app/api/tilskud/route.ts`: ny `action: "tts"` (kræver session-token, rate-limit 80/5 min pr. IP, 503 hvis env mangler, svarer `audio/mpeg`). Stadig én route (Hobby-loftet er uændret).
- `app/tilskud/_components/VoiceControls.tsx`: Web Speech API (da-DK) til brugerens tale, afspiller agentens svar via tts-action, auto-lyt efter hvert svar, tilstande klar/lytter/tænker/taler/fejl/ikke-understøttet, event `tilskud_voice_start`.
- `app/tilskud/_components/TilskudFlow.tsx`: toggle "Skrive i chatten" / "Tale med agenten" efter virksomhedskortet; `Chat` får `voice`-prop og rendrer `VoiceControls` med `sidsteSvar`.
- `scripts/tilskud-cli.mjs`: `tts --text "..." --out fil.mp3` (CLI-vej for endpointet).
- Docs: CLAUDE.md (tts-linje), DEFERRED.md (sektion "voice-tilstand v1"), DEPENDENCIES.md (ElevenLabs + Web Speech).

## Hvad er verificeret

- CLI: `node scripts/tilskud-cli.mjs tts --base http://localhost:3077 --cvr 39127709 --out /tmp/x.mp3` → `tts ok: 62737 bytes (audio/mpeg)`. Lydprøve ligger på Michaels Desktop: `~/Desktop/tilskud-stemme-test.mp3`.
- Browser (lokal dev, Chrome): CVR 39127709 → "Tale med agenten" → "Start samtalen med stemmen" → agentens åbningssvar blev hentet som TTS (POST 582 ms, 123 KB audio) og afspillet; derefter gik kontrollen selv i "Lytter … tal nu". Ingen console-fejl set.
- IKKE verificeret: selve talegenkendelsen (jeg kan ikke tale ind i mikrofonen). Det er Michaels test i morgen.
- `npx tsc --noEmit` OK, `npm run build` OK (2026-11-01 aften).

## Env (allerede sat, intet at gøre)

- Lokalt `.env.local` og Vercel production + preview: `ELEVENLABS_API_KEY`, `TILSKUD_TTS_VOICE=2FnlfmVwtwwygasoGwH4` ("Michael Stemme", professionel klon). Alternativ stemme: "Mads SpAIke" `BIWC0507fYMfhPcAEIRP` (kun env-skift + redeploy).

## Plan for næste tråd (i rækkefølge)

1. `git status` på branchen: WIP-commit `wip(tilskud): voice-tilstand v1` skal ligge øverst. Ingen løse filer.
2. Åbn PR mod `main` (gh pr create), squash-merge. Kør ALDRIG `vercel --prod`; push til main deployer.
3. Vent på Vercel-deploy, verificér i prod:
   - `node scripts/tilskud-cli.mjs tts --base https://www.spaike.dk --cvr 39127709 --out /tmp/prod-tts.mp3` → forvent `audio/mpeg` og > 20 KB.
   - Åbn https://www.spaike.dk/tilskud i Chrome MCP, indtast CVR, klik "Tale med agenten", klik "Start samtalen med stemmen", bekræft tilstand skifter Taler → Lytter og at der ikke er console-fejl.
4. Skriv til Michael med testinstruks: Chrome på Mac med headset, tillad mikrofon, tal når knappen er gul og pulserer ("Lytter … tal nu"), tryk på knappen for at afbryde agenten. Spørg om ÉT: er stemmen "Michael Stemme" ok, eller skal den skiftes til "Mads SpAIke" (ét env-skift).
5. Efter Michaels test: notér feedback i DEFERRED.md eller ret direkte. Kendte v1-grænser står allerede i DEFERRED.md (ingen barge-in, latens = Claude + hel TTS før afspilning, Web Speech kun i Chrome, ingen cost-cap på TTS ud over rate-limit).

## Øvrige åbne punkter fra tråden (ikke voice)

- LinkedIn-opslag: tekst + billede ligger klar i LinkedIns composer (fane "Feed | LinkedIn", sharing/compose). Michael klikker selv Post/Schedule og lægger første kommentar: `spaike.dk/tilskud (gratis, ingen konto, dansk)`. Hvis fanen er lukket: teksten står i den forrige tråds transskript (søg "Kender du en SMV-virksomhed").
- Google Ads-test: kræver adgang til Ads-kontoen. Plan: start 4/11, 100-150 kr/dag, exact match på tilskuds-søgeord, UTM til /tilskud, Michael godkender kampagnen før aktivering.
- Rådgiverportalen (SMV:Digital CV): erstat tankestreger i referencetitler, tilføj en analyse-type reference (kandidat: 21-5 analysen), foto.
- Puljealarm: manuel mail til tilmeldte 8/11 (flag `pulje_alarm` i PB `tilskud_leads`).
- Ugentligt til 2026-12-01: Anthropic- og ElevenLabs-forbrug + PB-leads vs Umami `tilskud_lead_sendt`.
- Infowebinar SMV:Digital 2/11 kl. 11:00 (i kalenderen): læringer derfra ind i agentens system-prompt (`lib/tilskud/agent.ts`).
- Michaels egen prod-gennemkørsel af hele flowet (kvalificering → forberedelse → mail).
