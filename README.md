# sfmbusiness-web

Mobile-first public inventory for **SFM Auto Sales** (www.sfmautosales.com).
Next.js 15 (server-rendered for SEO) + Turso (read-only) + installable PWA. Bilingual EN/ES (auto-detected from the phone language).

## Features
- Search + filters: make, model, max price, min year, max mileage, sort
- Vehicle pages with swipe gallery, specs, schema.org `Car`/`Offer` JSON-LD
- Price indicator (Great / Good / Fair / Higher) vs comparable inventory
- Contact: call, WhatsApp, message form (opens WhatsApp prefilled)
- SEO: sitemap.xml, robots.txt, hreflang, canonical, Open Graph, AutoDealer JSON-LD
- PWA: manifest, generated icons, service worker, "Add to Home Screen" prompt
- Only vehicles with estado `Available` / `In Shop` are public (never `Sold`)

## Setup
```bash
cp .env.example .env.local   # fill TURSO_AUTH_TOKEN (use a read-only token)
npm install
npm run dev
```
Env vars (server-only; `VITE_TURSO_DB_URL` / `VITE_TURSO_AUTH_TOKEN` are also accepted as fallback): `TURSO_DB_URL`, `TURSO_AUTH_TOKEN`.
Optional: `NEXT_PUBLIC_SITE_URL` (default https://www.sfmautosales.com), `HEALTH_CHECK_TOKEN` (enables details on `/api/health` when sent as `Authorization: Bearer <token>`).

## Scripts
- `npm run dev` / `npm run build` / `npm run start`
- `npm run lint`: ESLint with the Next.js rules
- `npm test`: unit tests for pricing, filters and slugs (`tests/`)

## Deploy
Import the repo in Vercel, add the env vars, attach the domain `www.sfmautosales.com`. Configure `usedcarventa.com` (if still owned) to 301-redirect to `www.sfmautosales.com` at the registrar or Vercel.
