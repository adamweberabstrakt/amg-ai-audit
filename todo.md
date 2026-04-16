# AMG AI Audit — Task Tracker
_Last updated: April 2026_

---

## COMPLETED

### Brand & Visual
- [x] All logo/brand assets copied to /public/brand/ (logos, logomarks, badges)
- [x] Fonts switched to Barlow Condensed (headings) + Barlow (body)
- [x] Header logo swapped to white SVG on home page and results page
- [x] AIExplainer section removed from home page
- [x] Wistia video embedded in hero (replaces proof widget; stats moved inline under CTA)
- [x] Scrolling trust marquee — 5 badge images + 5 text items, infinite loop
- [x] Review slider — 5 real Clutch/Google quotes, 5s auto-advance, dots + arrows
- [x] Colored logomark accents on all 5 tab section headers
- [x] Grow Zone banner on home page and results page

### ChiliPiper
- [x] Auto-popup timer changed from 45s to 5s
- [x] Two-column results layout: tabs left, BookingSidebar right (sticky desktop, stacks mobile)
- [x] BookingSidebar.jsx created with ChiliPiper iframe embed

### Assessment Form
- [x] Industry list expanded from 10 to 51 items (matches brand lift tool)
- [x] Privacy Policy + Terms of Service links added below submit button
- [x] Honeypot hidden field wired with useRef (reads actual DOM value at submit)
- [x] Minimum submission time check (< 3s = bot rejection)

### Security
- [x] IP rate limiting on /api/audit (5 req/IP/hour, in-memory Map)
- [x] Server-side input validation (URL format, HTML stripping, length caps)
- [x] Honeypot field server-side check
- [x] Minimum submission time check on server

### Cookie / Compliance
- [x] GTM Consent Mode defaults to denied before GTM loads (layout.js)
- [x] CookieBanner fires gtag consent update properly (fixed from raw dataLayer push)
- [x] Privacy Policy + Terms linked in footer and assessment form

---

## REMAINING — Active Backlog

### High Priority
- [ ] OG image — Create 1200x630 for social share previews; wire into layout.js metadata
- [ ] Email notifications — Add Zapier step to email team on new lead (no code needed), OR integrate Resend from /api/webhook
- [ ] Share results modal — upgrade share button to open modal with email input field

### Medium Priority
- [ ] Confirm Wistia video renders in production (watch for React hydration warnings)
- [ ] Vary CTA copy across home page sections (currently repetitive)
- [ ] Inline form validation — green checkmark on valid, red border on invalid blur
- [ ] Loading screen upgrade — branded scan animation + cycling status copy
- [ ] PDF download button on results page

### Low Priority
- [ ] Light/dark mode preference persistence across pages
- [ ] UTM parameter audit — confirm UTMs reach Google Sheet via Zapier
- [ ] OG image meta tag on results page
- [ ] Expandable detail sections on recommendation cards

---

## NOTES

- ChiliPiper: iframe embed is stable. Do not revert to SDK approach.
- Fonts: Barlow Condensed (headings) + Barlow (body) via Google Fonts in layout.js
- Security: In-memory rate limiter resets on Vercel cold starts. For production, consider Upstash Redis.
- Email sending: Resend is simplest (one package, free tier). Zapier is zero-code alternative.
- Cookie compliance: GTM Consent Mode v2 is correctly implemented. Load Meta Pixel and LinkedIn via GTM tags, not direct script tags.
