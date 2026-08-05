# Handoff — 2026-06-22 — AI-innovationsdag live på spaike.dk

**Repo:** spaike-landing (spaike.dk) · Next.js 14 App Router + Tailwind · Vercel auto-deploy fra `main`
**Status:** Featuren er **live på production og verificeret end-to-end.**

---

## 1. Løst i denne tråd

### SPA-590 (afsluttet)
- ✅ Lighthouse verificeret på field note (`/field-notes/anthropic-sales-playbook`): SEO 100, A11y 95 (begge ≥ 95). Ticket kan lukkes.

### AI-innovationsdag — hele featuren (bygget, deployet, verificeret)
Tre offentlige sider (ikke linket fra forsiden, tilgås via direkte links):
- **`/ai-innovationsdag`** — landing: hero, "hvad er det", værdi-accordion (ét klik åbner alle), agenda, forberedelse/readiness, embedded discovery-tool, kontakt.
- **`/ai-innovationsdag/guide`** — DIY-guide: lettere rolle-model (solo-facilitator + kunde-IT-standby) + ambitiøs-ærlig værdi-framing, sticky TOC, print-PDF.
- **`/ai-innovationsdag/ideer`** — GTM-idékatalog: 16 kommercielle cases (Salg, RevOps, Marketing, CS, Onboarding, Internt), kategori-selector.
- `/hackathon` → redirect til `/ai-innovationsdag`.

Backend/flow:
- Discovery-agent: `claude-haiku-4-5`, streaming (NDJSON), **kort problem-fokuseret prompt** (identificér 2-3 kandidater, grav ikke i systemer/steps/sprog). Brief = tool-kald, simpelt schema (titel/problem/hvorfor-godt-fit/mulig-løsning).
- **Valgfrit website-opslag** før chat → async branche-research (Anthropic `web_fetch`, Sonnet), fodres ind som kontekst. Chatten åbner straks; research i baggrunden.
- **Mail-gated brief:** vises ikke på skærm, ingen download. "Din brief er klar, indtast mail." → **Brevo** sender brief + guide-link. Verificeret modtaget i indbakke.
- **PocketBase** på `spaike-crm` (Fly.io, EU): `discovery_sessions` + `applications`. Idempotent setup-script (`scripts/setup-pocketbase.mjs`). Persondata kun ved samtykke.
- localStorage-persistens (chat overlever reload), signeret session-token, tur-loft, per-IP rate-limit.

### Deploy + Vercel-CLI-adgang
- Vercel-projekt `spaike-landing` linket til denne workspace (manglede blot `.vercel/project.json` — se memory).
- **8 env vars sat i Production + Preview** (Anthropic, PocketBase, APP_SESSION_SECRET, Brevo, afsender).
- `main` opdateret + redeployet → live på www.spaike.dk. Fuldt flow verificeret på prod.

---

## 2. Udestående TODOs
- 🟠 **Brevo domæne-verifikation** af spaike.dk (DKIM/SPF via Cloudflare) → bedre levering + fjerner "Sent with Brevo"-footer (free-plan).
- 🟡 **Cloudflare Turnstile** på gaten (bot-beskyttelse) — keys ikke sat.
- 🟡 **Case → PowerPoint-template** som deliverable i slut-steppet (flagget, ikke bygget).
- 🟡 **Vault ikke committet:** ændringer i `06 Knowledge/Sales & Consulting/Vibe Coding Hackathon — produkt-playbook.md` (værdi-framing, praktiker-research, GTM-idékatalog) ligger på disk i obsidian-vaulten, ikke committet til obsidian-repoet.
- 🟡 Agenten beder af og til om ét ekstra spørgsmål før briefen fyrer (mindre; prompt kan strammes yderligere i `_config/agent.ts`).
- 🟢 Denne handoff-fil er skrevet men untracked; commit den til main når det passer.
- 🟢 Merged feature-branch `feature/ai-innovationsdag-discovery-tool` kan slettes (alt er på main).

---

## 3. Vigtige referencer
- **Kode:** alt under `app/ai-innovationsdag/` + `app/api/innovationsdag/{start,chat,research,lead}/` + `lib/{email,pocketbase,sessionToken,rateLimit,turnstile}.ts`.
- **Feature-README:** `app/ai-innovationsdag/README.md` (arkitektur, env, TODO).
- **Env:** `.env.local` (gitignored) = single source of truth. Samme 8 vars i Vercel Production+Preview.
- **Vercel:** projekt `spaike-landing`, team `Michael's projects`. Deploy via push til `main`.
- **PocketBase:** `spaike-crm` på Fly.io. Superuser michael@spaike.dk (password i `.env.local` + Fly secret).

---

## 4. Handoff-prompt til næste tråd

```
Jeg fortsætter på spaike.dk / AI-innovationsdag (repo spaike-landing). Featuren
er live på production og verificeret (chat → brief → Brevo-mail). Sidste tråd
wrapped up 2026-06-22 — se docs/handoffs/2026-06-22-ai-innovationsdag-live.md.

Muligt næste skridt (valgfrit): Brevo domæne-verifikation af spaike.dk (DKIM/SPF),
Cloudflare Turnstile på gaten, eller case → PowerPoint-template i slut-steppet.

Læs først:
- docs/handoffs/2026-06-22-ai-innovationsdag-live.md
- app/ai-innovationsdag/README.md
- alt er på main (live); .vercel-linket findes lokalt i denne workspace
```
