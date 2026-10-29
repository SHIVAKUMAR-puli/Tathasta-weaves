# Tathasta Weaves

Marketing site for Tathasta Weaves, built with Next.js (App Router).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com, choose **Add New → Project** and import the repository.
3. Keep the defaults (Vercel detects Next.js) and press **Deploy**.

Or from the terminal: `npx vercel` (preview) and `npx vercel --prod` (production).

## Where things live

- `app/page.js` – page layout, platform copy, headline numbers
- `components/` – Loom Studio, catalogue, contact form
- `lib/fabrics.js` – fabric catalogue
- `lib/weave.js` – palette and weave pattern drawing

## Before launch

- Replace the figures in `LEDGER` (`app/page.js`) and the fabrics in `lib/fabrics.js` with real ones.
- Wire the contact form in `components/Contact.js` to an email service.
