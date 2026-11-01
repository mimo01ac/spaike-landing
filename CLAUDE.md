# spaike-landing (spaike.dk)

Next.js 14 App Router + Tailwind + TS, hostet på Vercel. Brand og stack-reference: vault `01 SpAIke/SpAIke.dk build-reference.md` (læs FØR nyt arbejde). Deploy: push til `main` = production via Vercel Git-integration; feature-branches får preview automatisk. Kør ALDRIG `vercel --prod`.

## Properties
- `/` landing · `/ai-tjek` (lead-magnet, deterministisk scan) · `/ai-innovationsdag` (Claude discovery-agent) · `/tilskud` (Tilskudstjek: CVR + Claude-interview + lead, v1 2026-11-01) · juridiske sider.
- Vercel Hobby: **12 serverless functions**. Tæl `app/api/**/route.ts` før du tilføjer (7 efter /tilskud). Nye handlinger lægges som `action` i et eksisterende endpoint, ikke som ny route.

## Arkitektur-regler (gælder her)
- Alt eksternt bag `lib/`: `lib/pocketbase.ts`, `lib/email.ts` (Brevo), `lib/tilskud/cvr.ts` (CVR), `lib/tilskud/chat.ts` (Anthropic). Komponenter og routes kalder aldrig en SDK/API direkte.
- Hvert endpoint har en CLI-vej: `scripts/ai-tjek-cli.mjs`, `scripts/tilskud-cli.mjs`.
- Umami på alt nyt: sider i `app/` arver scriptet; samme-fane-links `data-track-event`, `_blank`-links `data-umami-event`. Ny side → `tests/e2e/helpers.ts` PUBLIC_PAGES + `app/sitemap.ts`.
- Fravalg logges i `DEFERRED.md`, eksterne adgange i `DEPENDENCIES.md`.

## Fejlsøgning & evidens
Sidst verificeret: 2026-11-01

**Logs/telemetri**
- Serverless-logs: Vercel dashboard → projekt `spaike-landing` → Logs (filtrér på `/api/tilskud`, `/api/innovationsdag/*`, `/api/ai-tjek/*`). Routes logger med præfiks, fx `tilskud chat-fejl:`, `tilskud lead: PB-gem fejlede:`, `Brevo-fejl:`, `CVR-opslag fejlede:`.
- Besøg/klik: Umami på `analytics.spaike.dk` (events: `tilskud_start`, `tilskud_chat_foerste_svar`, `tilskud_vurdering_klar`, `tilskud_lead_sendt`, `book_moede_click`).
- Leads/data: PocketBase `spaike-crm.fly.dev` (collections `tilskud_leads`, `ai_tjek_leads`, `kontakt_beskeder`, `discovery_sessions`, `applications`). Creds i `.env.local` (hent med `vercel env pull .env.local --environment=production`; kræver `.vercel/project.json`, se hukommelsen "spaike-landing-vercel-deploy").
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
- Turnstile er ikke konfigureret i prod (nøgler mangler); gaten springer bot-tjek over.
- cvrapi.dk returnerer `employees: null` for mange små selskaber → forhåndstjek viser "?" og agenten spørger selv.
