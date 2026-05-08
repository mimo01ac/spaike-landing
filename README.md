# spaike-website

Single-page website for **SpAIke** — AI-automation consultancy til danske mid-market virksomheder.

> **Brand-tese:** Spiken er i kombinationen. AI alene giver kapacitet. Forretningsforståelse alene giver retning. Det er kombinationen der skaber målbart impact.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Inter font (`next/font/google`)
- Hosted on Vercel

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Sektioner i V1

- ✅ Header med anchor-navigation
- ✅ Hero ("Spiken er i kombinationen.")
- ✅ Manifest (5 udsagn + thesis)
- ✅ Discovery CTA (3-step + primær CTA)
- ✅ Footer (placeholder)
- ⏳ Sektion 4 — Produkter (kommer i SPA-460)
- ⏳ Sektion 5 — Cases (kommer i SPA-460)
- ⏳ Sektion 6 — Om Michael (kommer i SPA-460)
- ⏳ Sektion 7 — Waitlist (kommer i SPA-460)

## Brand system (V1)

Defineret i `Visuel Identitet - Workstream.md` (Obsidian).

### Farver
- `spaike.blue` (#5ECEEA) — primær accent
- `spaike.blue-dark` (#3FB6D4) — hover state
- `spaike.dark` (#0F2A36) — sjælden brug
- `background.primary` (#FFFFFF) — hovedbaggrund
- `background.secondary` (#FAFAF9) — sektion-skift
- `background.tertiary` (#F5F5F4) — cards

### Typografi
- Inter via `next/font/google` (weight 400, 500, 600, 700, 800)

## Deploy

1. Push til GitHub
2. Connect repo til Vercel-projekt for `spaike.dk`
3. Verificér DNS peger på Vercel
4. Auto-deploy ved hver merge til `main`

## Linear

Tracket i [SPA-459](https://linear.app/spaike/issue/SPA-459).

## Næste skridt

```bash
git init
git add -A
git commit -m "feat(SPA-459): bootstrap spaike.dk with V1 brand system and sections 1-3"
gh repo create spaike-website --private --source=. --remote=origin --push
# eller manuelt på github.com → ny repo → følg instructions
```

Derefter kobl Vercel-projektet til repoen.
