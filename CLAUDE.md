# spaike-landing (spaike.dk)

Next.js 14 App Router + Tailwind + TS, hostet på Vercel. Brand og stack-reference: vault `01 SpAIke/SpAIke.dk build-reference.md` (læs FØR nyt arbejde). Deploy: push til `main` = production via Vercel Git-integration; feature-branches får preview automatisk. Kør ALDRIG `vercel --prod`.

## Properties
- `/` landing · `/ai-tjek` (lead-magnet, deterministisk scan) · `/ai-innovationsdag` (Claude discovery-agent) · `/tilskud` (Tilskudstjek: CVR + Claude-interview + lead, v1 2026-11-01) · juridiske sider.
- Vercel Hobby: **12 serverless functions**. Tæl `app/api/**/route.ts` før du tilføjer (7 efter /tilskud). Nye handlinger lægges som `action` i et eksisterende endpoint, ikke som ny route.

## /tilskud: faglige regler (Michael, 2026-11-01)
- Tilskuddet betaler analysen (potentialeafklaring): interview og oplæg ligger på analysens niveau, aldrig en byggeliste.
- Blødt discovery-interview med smerten som anker; højst 4 spørgsmål efter de formelle krav (smerte/område, forventet effekt, forankring). Spørg ikke "hvor i flowet går tiden" (det er analysens leverance).
- To faser: **1) kvalificering** (formelle krav + overordnet idé → tool `afgiv_kvalificering` → kort med stop/fortsæt; stop = let lead m. kvalificerings-mail) og **2) forberedelse** (kun efter brugerens ja; højst 4 spørgsmål → `afgiv_vurdering`). Markøren `[Kvalificering afgivet: <status>]` i historikken fortæller modellen, at fase 1 er afgivet.
- Ansøgeren bekræfter selv at have udarbejdet ansøgningen → vi leverer en **projektbeskrivelse som grundlag** (neutral tredje person, strukturet efter skabelonens felter, `docs/smv-digital-ansoegningsskabelon-2026-11.md`), aldrig ansøgningstekst.

## Arkitektur-regler (gælder her)
- Alt eksternt bag `lib/`: `lib/pocketbase.ts`, `lib/email.ts` (Brevo), `lib/tilskud/cvr.ts` + `cvr-es.ts` (CVR: Erhvervsstyrelsens Elasticsearch primært med env `CVR_USER`/`CVR_PASS`, cvrapi.dk fallback), `lib/tilskud/chat.ts` (Anthropic), `lib/tilskud/voice.ts` (ElevenLabs Agents, env `ELEVENLABS_API_KEY`/`TILSKUD_VOICE_AGENT_ID`), `lib/tilskud/session.ts` (alle tjek gemmes i PB `tilskud_sessioner` + mail til Michael ved start). Komponenter og routes kalder aldrig en SDK/API direkte.
- Hvert endpoint har en CLI-vej: `scripts/ai-tjek-cli.mjs`, `scripts/tilskud-cli.mjs`.
- Umami på alt nyt: sider i `app/` arver scriptet; samme-fane-links `data-track-event`, `_blank`-links `data-umami-event`. Ny side → `tests/e2e/helpers.ts` PUBLIC_PAGES + `app/sitemap.ts`.
- Fravalg logges i `DEFERRED.md`, eksterne adgange i `DEPENDENCIES.md`.

## Fejlsøgning & evidens
Sidst verificeret: 2026-11-01 (aften, stemme v2)

**Logs/telemetri**
- Serverless-logs: Vercel dashboard → projekt `spaike-landing` → Logs (filtrér på `/api/tilskud`, `/api/innovationsdag/*`, `/api/ai-tjek/*`). Routes logger med præfiks, fx `tilskud chat-fejl:`, `tilskud lead: PB-gem fejlede:`, `Brevo-fejl:`, `CVR-opslag fejlede:`.
- Besøg/klik: Umami på `analytics.spaike.dk` (events: `tilskud_start`, `tilskud_chat_foerste_svar`, `tilskud_vurdering_klar`, `tilskud_lead_sendt`, `book_moede_click`).
- Leads/data: PocketBase `spaike-crm.fly.dev` (collections `tilskud_leads`, `ai_tjek_leads`, `kontakt_beskeder`, `discovery_sessions`, `applications`). Creds i `.env.local` (hent med `vercel env pull .env.local --environment=production`; kræver `.vercel/project.json`, se hukommelsen "spaike-landing-vercel-deploy").
- Stemme (eget flow, ikke oplæsning af chatten): coach-agent på ElevenLabs Agents, konfig som kode i `lib/tilskud/voice-agent.ts` (prompt, tjekliste-tools `noter_afklaring`/`vis_foreloebig_vurdering`, `end_call`, Sonnet 4.6, stemme fra `TILSKUD_TTS_VOICE`, privat agent, loft 50 samtaler/døgn, ingen lydoptagelse). Ændringer: `npm run tilskud:voice -- sync` (readback-diff) og `-- simuler --persona typisk|stop|roed [--resultat]` (samtale uden mikrofon via ElevenLabs agent-testing; `simulate-conversation` er fjernet 31-10-2026). Browser: `app/tilskud/_components/VoiceSamtale.tsx` (`@elevenlabs/react`, WebRTC). API: `voice-start` (token + dynamiske variabler) og `voice-resultat` (udskrift -> Claude -> kvalificering/vurdering). CLI: `node scripts/tilskud-cli.mjs voice-start|voice-resultat --cvr 39127709`. Samtaler/forbrug: ElevenLabs-dashboard -> Agents -> "Tilskudstjek: stemme-coach". Toggle'en vises i produktion kun med `?stemme=1`, indtil Michael godkender.
- Sessioner: `start` opretter `tilskud_sessioner/<sid>` (sid = session-tokenets id) og mailer Michael; chat/stemme/lead skriver løbende til samme record. CLI sender `x-tilskud-test: 1` (gemmes med `test=true`, ingen mail).
- Claude-forbrug: Anthropic Console (Usage). `/tilskud` bruger `claude-opus-5-5`, lav effort, prompt caching på system-prompt.

**Test lokalt**
- `npm run dev` → `node scripts/tilskud-cli.mjs flow --cvr 39127709 [--email dig@…]` kører hele kæden (CVR → chat med fixture-svar → vurdering → lead + mails). `--json` giver kun vurderingen. `start --cvr` tester kun CVR + forhåndstjek.
- `npx tsc --noEmit` og `npm run build` før commit. E2E: `npx playwright test` (PUBLIC_PAGES renderer, links).
- PB-schema: `node --env-file=.env.local scripts/setup-pocketbase.mjs` (idempotent).

**Overvågning**
- Ingen aktiv alarm. Tjek ugentligt indtil 2026-12-01: Anthropic-forbrug (misbrug af chat) og `tilskud_leads` i PB vs. Umami `tilskud_lead_sendt` (mismatch = PB-fejl).

**Spørg indmelderen om**
- Tidspunkt, CVR-nummer brugt, hvilket trin (CVR-opslag / chat / "send mig vurderingen"), fejltekst på skærmen, browser. Matcher mod Vercel-logs på tidspunkt + `/api/tilskud`.

**Kendte gotchas**
- Frisk Conductor-workspace mangler `.vercel/` og `.env.local` → API-routes giver 500 lokalt indtil env er hentet.
- Rate-limit er in-memory pr. serverless-instans (best effort).
- PocketBase (spaike-crm, Fly ARN) var nede 2026-11-01 ~20:10 UTC pga. Fly-hændelse ("Outbound IPv4 connectivity failures in ARN"); sund indefra, 502 udefra. Lead og sessioner er nu fail-soft (8 s timeout i `lib/pocketbase.ts`, sessioner højst 3 s), og lead-mailen går til Michael uanset.
- Turnstile er ikke konfigureret i prod (nøgler mangler); gaten springer bot-tjek over.
- CVR-ES (`distribution.virk.dk`) svarer kun på http; status for aktive virksomheder er `NORMAL` (ikke "Aktiv"); små selskaber har ofte hverken ansatte- eller årsværk-interval → forhåndstjek viser "?" og agenten spørger selv. Uden `CVR_USER`/`CVR_PASS` falder opslag tilbage til cvrapi.dk, som er kvote-blokeret fra Vercels IP'er (så sker opslaget i browseren).
