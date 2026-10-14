# Admin panel (separate app)

React + Vite + Tailwind, mobile-first, installable as an app (PWA). Talks only to Supabase.

```bash
cp .env.example .env     # Supabase URL + anon key + VITE_SITE_URL
npm install
npm run dev              # http://localhost:3001
npm run build            # → dist/
```

Host settings: build command `npm run build`, output folder `dist`, ideally on a sub-domain like
`admin.haadikereshaneshwara.com`. `vercel.json` / `public/_headers` add strict security headers
(no framing, content-security-policy, noindex). If the admin does not load after you deploy, check the browser
console for a Content-Security-Policy message and tell the developer — the policy is in those two files.

**Install on phone:** open the deployed `https://` address → use the *Install app* banner on the Dashboard
(Android/Chrome/Edge) or Share → *Add to Home Screen* (iPhone). The install option only works on the deployed
`https://` site (the service worker is disabled in `npm run dev`).

Sections: Dashboard · Inbox · Site settings · Home banner · Page texts · About & history · Sevas · Events ·
Announcements · Gallery · Trustees · SEO & AI search · Admin users · Backup & history.

`src/types.ts`, `src/lib/content.ts`, `src/lib/seo.ts`, `src/lib/stringCatalog.ts` are copies from `../website`
(kept in sync with `npm run sync-shared`).
