# Cleaning Services Website (MERN) — Public Site + Admin + SEO

Everything business-specific is a **placeholder** (name, phone, services copy, areas). Replace it in the admin panel. Nothing here claims rankings, reviews, backlinks or listings.

## Structure
```
cleaning-site/
  server/   Express + Mongoose API, auth, sitemap/robots, SEO head injection, seed
    src/models/index.js        all Mongoose models
    src/routes/public.js       published-content API + enquiry form (rate-limited, honeypot)
    src/routes/admin.js        JWT-protected CRUD, enquiries, settings, uploads, dashboard, audit
    src/routes/seo.js          /sitemap.xml, /robots.txt, 301 redirects, per-page <head> + content snapshot
    src/utils/audit.js         real SEO checks on stored content
    src/seed.js                NON-destructive seed (insert-if-missing only)
  client/   React + Vite + Tailwind (public pages + /admin)
  docs/     SEO-PLAN.md (keyword map, checklists, off-page plan, test report)
```

## Run locally
```bash
# 1. MongoDB running locally or an Atlas URI
cd server && cp .env.example .env     # edit JWT_SECRET, MONGODB_URI, SITE_URL
npm install && npm run seed           # creates first admin + starter content (drafts for areas/blog)
cd ../client && npm install && npm run build
cd ../server && npm start             # serves API + built site on :5000
# Dev: `npm run dev` in server/ and client/ (Vite proxies /api to :5000)
```
Sign in at `/admin/login` with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, then change the password flow by creating a new admin (`POST /api/admin/users`, 12+ chars) and removing the seed user.

## SEO architecture
Express serves the built SPA. For every public URL it injects into `index.html`: unique `<title>`, meta description, canonical, robots, Open Graph, JSON-LD (WebSite, LocalBusiness-type, Service, BlogPosting, BreadcrumbList) and a crawlable HTML snapshot of the content (headings, text, internal links) that React replaces on load. Unknown or unpublished URLs return a real **404** with `noindex`. `/admin` is `noindex` and disallowed in robots.txt. Sitemap is generated live from published, indexable, self-canonical pages (drafts, noindex, admin, utility legal pages excluded). LocalBusiness data only includes fields you actually filled in. No ratings/reviews/hours are emitted unless entered.

## API (summary)
Public (no auth, `Cache-Control: no-cache`): `GET /api/public/{settings,services,services/:slug,areas,areas/:slug,blog,blog/:slug,testimonials,gallery}`, `POST /api/public/enquiries`.
Auth: `POST /api/auth/login` → JWT (8h). Admin (Bearer token): CRUD on `/api/admin/{services,areas,blog,testimonials,gallery,backlinks,citations,outreach,seotasks,redirects}`; `GET/PATCH /api/admin/enquiries`; `GET /api/admin/enquiries-export.csv` (admin only); `GET/PUT /api/admin/settings` (PUT admin only); `GET /api/admin/{dashboard,seo-audit}`; `POST /api/admin/upload`; `POST /api/admin/users` (admin only). Content "delete" = archive (data kept).

## Data safety rules built in
No drops/resets; seed is insert-if-missing; updates use targeted `$set`; slugs unique (409 on duplicate); testimonials can't be published without recorded consent; a backlink can't be `verified-live` without a link URL; draft/archived content never appears publicly or in the sitemap.

## Security
bcrypt hashes, JWT, role checks, zod validation, helmet + CSP, NoSQL-sanitising, rate limits (login, forms), CORS allow-list, upload type/size limits with random filenames, CSV-injection-safe export, no secrets in client. Token is stored in `sessionStorage` (cleared on tab close); for stricter setups move to httpOnly cookies + CSRF tokens.

## Deploy (single host, e.g. Render)
Build: `cd client && npm ci && npm run build && cd ../server && npm ci`. Start: `cd server && npm start`. Env: `MONGODB_URI` (Atlas), `JWT_SECRET` (32+ random chars), `SITE_URL` (canonical, e.g. `https://www.example.com`), `CORS_ORIGINS`, `NODE_ENV=production`, `UPLOAD_DIR` pointing to a **persistent disk** (otherwise uploads vanish on redeploy; or switch to S3/Cloudinary). In production the server 301-redirects HTTP→HTTPS and non-canonical hosts → `SITE_URL` host. Frontend on a separate host (Vercel) works for the API-only case but loses server-side head injection — keep single-host for SEO.

## Backup / rollback
Atlas: enable continuous/scheduled backups. Manual: `mongodump --uri "$MONGODB_URI" --out backup-$(date +%F)`; restore with `mongorestore`. Keep `uploads/` backed up too. Roll back by redeploying the previous commit; schema changes are additive.

## Not done / needs you
Real business details, real photos/alt text, real local content per area, Google Business Profile, citations, outreach, Search Console + GA4 setup, privacy/terms text, deployment. See `docs/SEO-PLAN.md`.

## Quick start (from the project root)
```bash
cp server/.env.example server/.env   # then edit values
npm run setup && npm run build && npm run seed && npm start
```
