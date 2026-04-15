# AIO Audit — Full Improvement Backlog
# Source: Design comp review + team recommendations doc

---

## IMPLEMENTING NOW (from design comps)

### Landing Page (`app/page.js`)
- [x] Fix `$$1B+` double-dollar bug in TrustBar → `$1B+`
- [x] Animated grid pulse in hero background (CSS keyframe)
- [x] Add hero proof widget sidebar (2,000+ clients, 500+ websites, $1B+ revenue)
- [x] Replace emoji icons with inline SVGs in PainPoints cards
- [x] Replace emoji icons with inline SVGs in WhatYouGet cards
- [x] Add scroll-triggered count-up animation on PainStats numbers (client component)

### Assessment Form (`components/AssessmentForm.jsx`)
- [x] Redesign StepProgress: connecting animated bar, completed checkmark, labels always visible
- [x] Add SVG icons to input fields (user, mail, phone, globe, building)
- [x] Upgrade RadioCard: SVG icon slot, stronger background fill on selected, circle check indicator
- [x] Custom slider: labeled stop dots, dynamic label display below

### Results Page
- [x] Animated score ring count-up (0 → final score over ~1.5s) in `ResultsClient.jsx`
- [x] Larger, more prominent urgency badge with icon in `ResultsClient.jsx`
- [x] Pill-style tab bar with issue count badges in `ResultsTabs.jsx`
- [x] Desktop floating CTA → full-width bottom bar (not corner bubble) in `BookingCTA.jsx`
- [x] Animated progress bar fills on score breakdown cards in `AIVisibilityTab.jsx` + `OverviewTab.jsx`

---

## PHASE 1 — Quick Wins (P1–P2, est. 1–2 days)

### Visual
- [ ] **P1** Create and add OG image (1200×630) for LinkedIn/Slack/Twitter share previews
- [ ] **P1** Animated score ring count-up on results page ✦ (implementing now)
- [ ] **P1** Fix floating CTA to bottom bar on desktop ✦ (implementing now)
- [ ] **P2** Add subtle animated particle or grid effect behind hero text ✦ (implementing now)
- [ ] **P2** Add animated count-up on landing page stats ✦ (implementing now)
- [ ] **P2** Replace all emoji icons with SVG icons sitewide ✦ (implementing now)

### Technical
- [ ] Move explainer image (`ai-search-explainer.png`) from `abstrakt-ai-brand-lift.vercel.app` to this domain — currently a cross-origin dependency that adds latency
- [ ] Clear `assessmentFormData` from sessionStorage after successful audit submission (currently stale data persists)
- [ ] Fix logo `display:none` approach — use a single logo file or CSS `content` swap rather than two hidden images

---

## PHASE 2 — Design Polish (P2–P3, est. 3–5 days)

### Form UX
- [ ] **P1** Redesign step indicator with connected progress bar ✦ (implementing now)
- [ ] **P2** Inline validation: green checkmark on valid field, red border on blur if invalid
- [ ] **P2** Add input field icons (envelope, globe, phone, user) ✦ (implementing now)
- [ ] **P2** Replace native range slider with custom-styled version with labeled stops ✦ (implementing now)
- [ ] **P2** Redesign selection buttons (industry, goal, budget) with SVG icons + stronger selected state ✦ (implementing now)
- [ ] **P3** Add CSS slide/fade transitions between form steps (200–300ms)
- [ ] **P4** "Resume your assessment" banner when returning to `/assess` with saved sessionStorage data

### Loading Screen (`components/AuditLoading.jsx`)
- [ ] **P2** Replace spinner with branded radar/scan animation (pulsing rings, scanning grid)
- [ ] **P3** Add dynamic copy that cycles through what's being checked (e.g., "Checking Google Business Profile…", "Analyzing competitor keywords…", "Scoring AI visibility…")

### Results Page
- [ ] **P2** Pill-style tabs with issue count badges ✦ (implementing now)
- [ ] **P2** Animated progress bar fills on score breakdown (trigger on first tab view) ✦ (implementing now)
- [ ] **P2** Make urgency badge larger and more visually prominent ✦ (implementing now)
- [ ] **P3** Directory listing status indicators (claimed / unclaimed / unknown) in LocalPresenceTab
- [ ] **P3** Expandable detail sections on recommendation cards (click to expand: context + implementation steps)

---

## PHASE 3 — Content, Conversion & Features (P3–P4, est. 1 week)

### Landing Page Content
- [ ] **P3** Vary CTA button copy across sections ("See My AI Score", "Run My Audit", "Check My Visibility") — currently repetitive
- [ ] **P3** Add source citations to the 58%, 30%+, 50%+ stats
- [ ] **P3** Replace static PNG explainer with an inline animated SVG diagram (how AI search works, step-by-step)
- [ ] **P3** Add gradient border / glow hover state on pain-point cards (more dramatic than current border-color only)
- [ ] **P3** Complete footer redesign: social links, brief description, privacy/terms links
- [ ] **P4** Logo bar or client testimonial snippet above or below stats section

### Results Conversion
- [ ] **P3** Social sharing buttons (LinkedIn, X/Twitter, email) alongside the share link
- [ ] **P3** "Download PDF Report" button alongside share link
- [ ] **P3** Improve ChiliPiper trigger — current 45s timer is good; add scroll-based fallback (trigger after user scrolls through at least one full tab section)

### Technical Improvements
- [ ] **P3** Respect `prefers-color-scheme` as the default for light/dark mode instead of always defaulting dark
- [ ] **P3** Persist light/dark mode preference across pages (currently resets between pages)
- [ ] **P4** UTM parameter validation — confirm UTMs are flowing correctly into CRM via Zapier
- [ ] **P4** Add a proper OG image meta tag to results page (currently only on landing page)
- [ ] **P4** Consider rate limiting on `/api/audit` route to prevent abuse

---

## Review
_(filled in after implementing "IMPLEMENTING NOW" items)_

---

## Review — Design Comp Implementation

### Landing Page (`app/page.js`) ✅
- Hero headline reframed to competitor angle; animated CSS grid background (gridPulse keyframe)
- Added proof widget sidebar (2,000+ clients, 500+ websites, $1B+ revenue) alongside hero copy
- All emoji icons replaced with inline SVGs in PainPoints (signal line, dollar, search, chat) and WhatYouGet (users, lightning, chip)
- `CountUpStats` client component added — IntersectionObserver triggers count-up animation when stats scroll into view
- Fixed `$$1B+` double-dollar bug → `$1B+`
- Footer expanded with privacy/terms links

### Assessment Form (`components/AssessmentForm.jsx`) ✅
- `StepProgress` fully redesigned: 40px numbered circles, green checkmark on completed steps, animated connecting bar fills, labels always visible
- `IconField` wrapper adds SVG icons to inputs (user, mail, phone, building, globe)
- `IconSelectBtn` replaces `RadioCard`: icon slot, stronger orange background fill on selected, circle check indicator
- Custom slider: orange gradient fill tracking thumb position, 5 stop dots, dynamic label below (e.g. "Established (3/5)")
- Custom checkbox replaces native input for review call opt-in
- sessionStorage cleared on successful submission (no stale data on return to `/assess`)
- Step fade-in animation (CSS keyframe `stepFadeIn`)

### Results Page ✅
- `ScoreCircle` → animated count-up: ring draws from 0 to final score over 1.5s with glow layer; number counts up simultaneously
- `UrgencyBadge` → full-width badge with SVG icon (warning triangle, info circle, check), colored border, descriptive copy
- `ResultsTabs` → pill-style tabs with SVG icons; badge system counts real issues (missing schema, GBP not found, low AI score)
- `BookingCTA` → desktop is now a full-width sticky bottom bar with mini score ring, context copy, and CTA button; mobile keeps slim footer with 5s pulse
- `AIVisibilityTab` → score breakdown bars now animate from 0 on scroll into view (IntersectionObserver)

### New Files
- `components/CountUpStats.jsx` — client component for scroll-triggered stat animation
