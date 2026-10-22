# Lynn Luxe Event Studio — website + admin

Next.js 15 (App Router, TypeScript) · Tailwind CSS 4 · Framer Motion + Lenis · Prisma (SQLite locally, Postgres in production) · Plus Jakarta Sans / Inter / JetBrains Mono.

## Run it

```bash
npm install          # first time only
npm run setup        # creates the database and fills it with Lynn Luxe content
npm run build
npm start            # http://localhost:3000
```

For editing code with live reload use `npm run dev`. Or just double-click `START.bat`.

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin. Login comes from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env`. **Change them before going live.**

## What's in the admin

| Section | What you can edit |
|---|---|
| Dashboard | Lead counts, pipeline, latest enquiries |
| Leads | Every enquiry with one-tap Call / WhatsApp, status (new → booked), notes, CSV export |
| Pages & settings | Every headline, paragraph, button, image and list on Home, About, Contact; phone, WhatsApp, address, socials, SEO, announcement bar, popup, quote-form options, footer, credits |
| Services | 7 categories, each with its own page and sub-services (43 included) — add, edit, reorder, hide, duplicate |
| Portfolio | Case studies (story, brief/design/details, palette, gallery, services used, client quote) at /portfolio/[slug] |
| Journal | Blog articles at /journal/[slug] — body supports ## headings and - bullet lists |
| Packages | Full Planning / Design & Styling / Day-of Coordination comparison on /services |
| Event types · Venues · Gallery · Testimonials · FAQs | Full add / edit / reorder / publish control |
| Media library | Upload photos/videos (drag & drop), reuse them anywhere |

Saving in the admin updates the live site instantly. No rebuild needed.

Testimonials start as **hidden samples**. Add real client reviews and switch them to Published, and the section appears on the home page.

## Pages
Home · Services (tabbed explorer + packages) · Service & sub-service pages · Occasions · Portfolio + case studies · Venues · Gallery · Journal + articles · About · Contact · FAQ (searchable) · Inquire (full inquiry form → saved + WhatsApp).

## Conversion features
Multi-step quote modal (event → details → contact, then continue on WhatsApp), timed + exit-intent popup (cool-down, never shown after a lead), sticky mobile Call / WhatsApp / Quote bar, WhatsApp button, announcement bar, CTAs on every page and service, honeypot + rate-limit spam protection, optional `LEAD_WEBHOOK_URL` to push every lead to Zapier / Make / Google Sheets.

SEO: per-page titles & descriptions, Open Graph, sitemap.xml, robots.txt, EventPlanner + FAQPage structured data.

## Going live
1. Host on Vercel, Railway, Render or any Node server.
2. Use Postgres: in `prisma/schema.prisma` set `provider = "postgresql"` and set `DATABASE_URL` (e.g. Neon/Supabase), then `npm run setup`.
3. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, a long random `AUTH_SECRET`, and `NEXT_PUBLIC_SITE_URL`.
4. Uploads are stored in `./uploads`. On serverless hosts (Vercel) use a persistent disk or move uploads to object storage. On a VPS / Railway / Render with a disk they work as-is.
