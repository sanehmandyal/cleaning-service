# SEO Plan, Checklists and Test Report

## 1. Keyword-to-page map (hypotheses — validate in Search Console / a keyword tool before committing)
One primary intent per page. Replace `[city]` with places you genuinely serve.

| Page | Primary keyword (intent) | Secondary / long-tail |
|---|---|---|
| `/` | cleaning services [main city] (commercial/local) | professional cleaning company, book a cleaner |
| `/services/home-cleaning` | home cleaning services (commercial) | house cleaning for apartments, regular home cleaning |
| `/services/deep-cleaning` | deep cleaning services (commercial) | post-renovation cleaning, move-in cleaning |
| `/services/window-glass-cleaning` | window cleaning services (commercial) | office glass cleaning, glass partition cleaning |
| `/services/office-cleaning` | office cleaning services (commercial) | commercial cleaning schedule, clinic cleaning |
| `/service-areas/[city]` | cleaning services in [city] (local) | window cleaning [city], office cleaning [city] |
| `/blog/office-cleaning-checklist` | office cleaning checklist (informational) | daily/weekly cleaning tasks |

Cannibalisation rule: informational posts target "how/checklist" queries and link to the service page; service pages own "services/hire" queries; area pages own "[service] in [city]". Track this in Admin → Keyword map.

## 2. On-page checklist (per indexable page)
- [ ] Unique title (≈50–60 chars, topic first) and description (≈120–160 chars) — guidelines, not Google limits
- [ ] One H1; H2/H3 reflect real sections; headings differ across pages
- [ ] Original content for the intent; no city-swap duplicates; limitations stated honestly
- [ ] Hero image with descriptive alt (decorative = empty alt); real photos preferred; compress, WebP/AVIF; hero not lazy-loaded
- [ ] Internal links: home→services/areas; service↔related services; service↔areas; breadcrumbs; footer
- [ ] Canonical correct; `noindex` only for pages that should be hidden
- [ ] JSON-LD matches visible content; no invented ratings/prices/hours/addresses
- [ ] Admin → SEO audit shows no issues for the page

## 3. Technical SEO status
Implemented in code: per-URL head injection, canonicals, noindex handling, live sitemap, robots.txt, 404 status codes, DB redirects with chain/loop detection, HTTPS + preferred-host redirect, breadcrumbs, lazy-loading below fold, skip link, semantic landmarks. Measured performance (Lighthouse/CWV) is **not yet measured** — run PageSpeed Insights after deployment; do not treat LCP ≤2.5s / INP ≤200ms / CLS ≤0.1 as met until measured.

## 4. Local SEO & Google Business Profile checklist
- [ ] Claim/verify profile; choose accurate primary category (e.g. "House cleaning service" or "Commercial cleaning service") and relevant secondaries
- [ ] Decide address visibility: hide address if you serve customers at their location (Google service-area rules); list service areas you truly cover
- [ ] NAP identical on site, profile and citations (Admin → Settings is the source of truth)
- [ ] Add genuine photos (team at work, before/after with permission)
- [ ] Link profile to the relevant page (homepage or main service page)
- [ ] Post periodic real updates; reply to all reviews politely
- [ ] Only publish area pages for places you serve, each with genuinely local content, photos and coverage limits (areas seed as **draft** for this reason)
- [ ] No fake addresses or duplicate profiles

## 5. Off-page plan (needs human actions; the admin tracks it)
Tools in Admin: **Backlinks** (prospects → contacted → replied → agreed → live-unverified → verified-live), **Citations**, **Outreach log**. "Verified-live" requires a link URL and sets a verification date; nothing is shown as secured until you verify it.

1. **Audit first**: export referring domains from Search Console (Links report) and any backlink tool you have; note lost/broken links and unlinked brand mentions. Do not disavow without evidence of manipulation.
2. **Citations (quality over quantity)**: Google Business Profile, Bing Places, Apple Business Connect, 3–5 established India/local directories that actually list cleaning services (verify legitimacy and consistency of NAP first), local chamber/trade bodies.
3. **Relationship links**: property managers, real-estate agents, facility managers, builders/contractors, hospitality, suppliers — offer a useful resource or partnership; record each in Backlinks.
4. **Digital PR / content**: seasonal glass-care guides, office cleaning checklists, local tips; pitch to local publications; never fabricate coverage.
5. **Guest contributions**: only to relevant sites; original articles; no exact-match anchor manipulation.
6. **Reviews**: ask every genuine customer with a neutral message and the direct review link; no incentives for positive reviews, no gating, no fakes; reply professionally to all.
7. **Do not**: buy links, use PBNs, directory spam, hidden links, irrelevant exchanges. Mark paid/sponsored links `rel="sponsored"`.

Outreach template (edit): "Hi [name], we're [business], a cleaning service in [area]. We wrote a practical [guide/checklist] that your [members/readers/tenants] may find useful: [URL]. Happy to adapt it or contribute a short piece if helpful."

## 6. Search Console & analytics setup
1. Add a Domain property in Search Console; paste the verification token in Admin → Settings (or use DNS).
2. Submit `https://YOUR-DOMAIN/sitemap.xml`; inspect homepage + a service page; watch Pages (indexing) and Performance.
3. Create GA4; paste the `G-` ID in Settings. Events already sent when GA4 is present: `call_click`, `whatsapp_click`, `quote_submit`, `booking_submit`, `contact_submit`. Mark them as key events in GA4. Add a consent banner if required for your audience (not included).
4. Link GA4 ↔ Search Console; review monthly: clicks/impressions by page, enquiries from organic, CWV, review count.

## 7. Test report (honest status)
Tested against FerretDB 1.24 (a MongoDB-compatible server, SQLite backend) in the build sandbox, with the seed data. Real MongoDB/Atlas was not available, so run the same checks once on your real database.

| Area | Status |
|---|---|
| Clean reinstall + Vite production build; server syntax/imports | **PASSED** |
| Server boots, DB connected (`/healthz`), seed runs (non-destructive) | **PASSED** |
| Public API returns only published content; draft area → 404 | **PASSED** |
| Login; bad password 401; NoSQL-injection login rejected (400); no token 401 | **PASSED** |
| Enquiry form: valid 201, invalid 400, saved and visible in admin, rate limit (429 after 10) | **PASSED** |
| Role checks: editor gets 403 on settings, user creation, CSV export | **PASSED** |
| Admin rules: testimonial needs consent (400), backlink verified needs URL (400), duplicate slug 409 | **PASSED** |
| Publish area → public 200 + appears in sitemap; archive → hidden again | **PASSED** |
| Settings edit → public API updated immediately (no caching) | **PASSED** |
| Per-page head: title, description, canonical, H1 snapshot, Service/Breadcrumb JSON-LD | **PASSED** (checked in raw HTML) |
| LocalBusiness JSON-LD only includes filled fields | **PASSED** |
| robots.txt, sitemap (excludes drafts/admin/legal), /admin noindex, unknown URL 404, DB 301 redirect | **PASSED** |
| Image upload: valid PNG saved + served; wrong type rejected 400 (bug found and fixed in testing) | **PASSED** |
| SEO audit endpoint and dashboard return real data | **PASSED** |
| Real MongoDB Atlas, production HTTPS/host redirects | **NOT TESTED** |
| Browser rendering, responsive 320–1920px, keyboard/accessibility | **NOT TESTED** (no browser in sandbox) |
| Lighthouse / Core Web Vitals / Rich Results validation | **NOT TESTED** |
| Images persisting across deploys | **NOT TESTED** (needs persistent disk or cloud storage on your host) |
| Deployment, GSC, GA4, GBP, citations, backlinks, reviews | **NOT DONE** — require your accounts/actions |
