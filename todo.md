# AI Visibility Assessment — Build Todo

## Phase 1 — Repo Setup & Scaffolding
- [x] Create directory structure
- [x] `package.json`
- [x] `next.config.js`
- [x] `tailwind.config.js` (Abstrakt brand tokens: orange #e85d04, bg #3d3d3d, Oswald/Inter)
- [x] `.env.local.example`
- [x] `app/layout.js` (root layout + Chilipiper script stub + GTM stub)
- [ ] Remove SEMrush provider (not porting from base repo)
- [ ] Install dependencies: `npm install`

## Phase 2 — Landing Page (`/`)
- [x] `app/page.js` — full landing page stub
  - [x] Hero: "Is Your Business Invisible to AI?"
  - [x] AI Search Flywheel explainer (4-step)
  - [x] "What We Audit" 3-pillar section
  - [x] Trust/social proof bar
  - [x] CTA → `/assess` with UTM passthrough

## Phase 3 — Assessment Form (`/assess`)
- [x] `components/AssessmentForm.jsx` — 3-step form shell
  - [x] Step 1: Contact info (lead gate)
  - [x] Step 2: Business context
  - [x] Step 3: Brand maturity
  - [x] UTM/GCLID capture on mount
  - [x] sessionStorage persistence
  - [x] On submit: fire webhook → trigger audit API → show loading
- [x] `app/assess/page.js`
- [x] `components/AuditLoading.jsx`

## Phase 4 — Audit API
- [x] `app/api/audit/route.js` — parallel orchestrator
- [x] `app/api/providers/pagespeed.js`
- [x] `app/api/providers/crawl.js`
- [x] `app/api/providers/places.js`
- [x] `app/api/providers/claude-analysis.js` — single Claude call, returns full JSON
- [x] `app/api/webhook/route.js` — Zapier lead forwarding

## Phase 5 — Results Page (`/results`)
- [x] `app/results/page.js`
- [x] `components/ResultsTabs.jsx` — tabbed shell
- [x] `components/tabs/AIVisibilityTab.jsx` — score + Claude summary
- [x] `components/tabs/WebsiteHealthTab.jsx` — PageSpeed + crawl data
- [x] `components/tabs/LocalPresenceTab.jsx` — Google Places data
- [x] `components/tabs/BrandGapTab.jsx` — Claude brand gap analysis
- [x] `components/BookingCTA.jsx` — sticky Chilipiper trigger

## Phase 6 — Chilipiper & Thank You
- [x] Chilipiper script in `layout.js`
- [x] `BookingCTA.jsx` wired with ChiliPiper.submit() + pre-filled lead data
- [x] `app/thank-you/page.js`

## Phase 7 — PDF Report + Email
- [x] `app/api/report/route.js` — PDFKit generation + Resend delivery

---

## Review

### Files Created (26 total)
| File | Purpose |
|---|---|
| `package.json` | Dependencies (Next.js 14, Anthropic SDK, Resend, PDFKit) |
| `next.config.js` | Next.js config |
| `tailwind.config.js` | Abstrakt brand tokens (orange #e85d04, bg #3d3d3d, Oswald/Inter) |
| `.env.local.example` | All required env vars documented |
| `app/layout.js` | Root layout with Chilipiper script + GTM stub |
| `app/globals.css` | Tailwind directives + shared component classes |
| `app/page.js` | Full landing page (hero, flywheel, 3-pillar, trust bar, CTA) |
| `app/assess/page.js` | Assess page wrapper with Suspense boundary |
| `app/results/page.js` | Results page — reads sessionStorage, renders tabs |
| `app/thank-you/page.js` | Post-booking confirmation page |
| `app/api/audit/route.js` | Parallel orchestrator (PageSpeed + Places + Crawl + Claude) |
| `app/api/providers/pagespeed.js` | Google PageSpeed Insights provider |
| `app/api/providers/crawl.js` | Homepage crawler (meta, schema, OG, H1, alt tags) |
| `app/api/providers/places.js` | Google Places / GBP provider |
| `app/api/providers/claude-analysis.js` | Single Claude call returning full AI score + brand gap JSON |
| `app/api/webhook/route.js` | Zapier lead webhook (fires on form submit) |
| `app/api/report/route.js` | PDFKit PDF generation + Resend email delivery |
| `components/AssessmentForm.jsx` | 3-step form with UTM capture, validation, sessionStorage |
| `components/AuditLoading.jsx` | Animated loading screen with step progress |
| `components/ResultsTabs.jsx` | Tabbed shell with 4 tabs |
| `components/tabs/AIVisibilityTab.jsx` | Score breakdown + recommendations |
| `components/tabs/WebsiteHealthTab.jsx` | PageSpeed scores + crawl signals |
| `components/tabs/LocalPresenceTab.jsx` | GBP status + local signals |
| `components/tabs/BrandGapTab.jsx` | Claude narrative analysis + action plan |
| `components/BookingCTA.jsx` | Sticky Chilipiper booking trigger |
| `lib/utmCapture.js` | UTM/GCLID capture + sessionStorage utility |

### Still Needed Before Launch
- GTM container ID (replace `GTM-XXXXXXX` in `layout.js`)
- Chilipiper subdomain + router name (replace placeholders in `.env.local`)
- Zapier webhook URL
- Install `cheerio` for crawl provider: `npm install cheerio`
- Trigger `api/report` from thank-you page or Chilipiper onSuccess callback
- Phase 8 (GA4 events) and Phase 9 (QA + deploy) still to complete

## Phase 8 — Analytics
- [ ] GTM container snippet in `layout.js` (needs GTM ID)
- [ ] GA4 event: `assessment_started`
- [ ] GA4 event: `assessment_completed`
- [ ] GA4 event: `booking_clicked`
- [ ] GA4 event: `booking_confirmed`

## Phase 9 — QA & Launch
- [ ] Mobile responsiveness pass
- [ ] LCP < 3s on landing page
- [ ] Copy review — business-owner friendly language
- [ ] Full end-to-end flow test with real Chilipiper router
- [ ] Deploy to Vercel
- [ ] DNS + SSL

## Open Items (Needs Input)
- [ ] Chilipiper subdomain + router name
- [ ] CRM: Salesforce or HubSpot?
- [ ] Production domain
- [ ] Zapier webhook URL
- [ ] Send PDF on booking confirmed, or immediately after audit?
- [ ] Paid ad platforms: Google, Meta, or both?
- [ ] Show score before or after Chilipiper booking?

---

## Review
_To be filled in after build is complete._
