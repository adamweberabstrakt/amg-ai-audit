# Home Page Polish + GTMetrix + Website Health Score + Competitor Analysis

## Scope

Four tasks from user (original list minus #2, which they're handling via uploaded transparent PNGs later):

1. **Hero stats prominence** — bump the "2,000+ / 500+ / $1B+" stats under the CTA so they stand out
2. ~~Trust banner images~~ — SKIPPED, user providing clean PNGs
3. **GTMetrix integration** — new provider feeding into audit + Website Health tab
4. **Website Health score + surface real issues** — composite 0–100 score with a Critical Issues section so site doesn't read as "everything's fine" when it isn't
5. **Overview competitor analysis** — Competitive Position Score + clear ahead/behind verdict; handle empty-data states so the section isn't blank

## Also deferred (pending user action)

- **Webhook extension** — send audit scores/recommendations to Zapier. User is updating the Google Sheet headers first (I gave them the 20 new column specs). Once the sheet is ready, I'll extend `/api/webhook/route.js` and fire a second post-audit call from `AssessmentForm.jsx`.

---

## Task 1 — Hero stats prominence

**File:** `app/page.js` (Hero function, lines ~93–105)

**Current:** inline flex row, 3 small `text-2xl` orange numbers with gray labels side-by-side.

**Target:** 3-column grid, `text-4xl` orange numbers stacked above labels, subtle divider pillars between each, more breathing room. Keeps to one simple JSX block — no new components.

- [x] 1. Update the stats block in `app/page.js` Hero

---

## Task 3 — GTMetrix integration

**New file:** `app/api/providers/gtmetrix.js`

GTMetrix uses a submit-then-poll pattern (different from PageSpeed's single call). API:
- `POST https://gtmetrix.com/api/2.0/tests` — submit, returns test ID
- `GET /api/2.0/tests/{id}` — poll until `state === 'completed'`
- Auth: HTTP Basic with API key as username, empty password
- Env var: `GTMETRIX_API_KEY`
- Defaults: Vancouver location (`1`), Chrome Desktop browser (`3`)

**Timeout strategy:** audit route has `maxDuration = 60` — GTMetrix tests typically finish in 30–60s. I'll cap polling at 45s and return `null` if it doesn't complete so the audit as a whole still succeeds gracefully.

**Returns:**
```js
{
  grade: 'B',               // A–F GTMetrix grade
  performanceScore: 82,     // 0–100
  structureScore: 95,       // 0–100
  lcp: '1.8s',              // display values
  tbt: '180ms',
  cls: 0.05,
  fullyLoadedTime: '2.4s',
  reportUrl: 'https://...'  // shareable report
}
```

- [x] 3a. Create `app/api/providers/gtmetrix.js`
- [x] 3b. Add `runGTMetrix` to parallel provider chain in `app/api/audit/route.js`
- [x] 3c. Pass `gtmetrixData` into `runClaudeAnalysis` and add to the prompt (so Claude can reference real load time in brandGapAnalysis)
- [x] 3d. Surface GTMetrix block in `WebsiteHealthTab.jsx` (grade + scores + load time + link to full report)

---

## Task 4 — Website Health score + Critical Issues

**File:** `components/tabs/WebsiteHealthTab.jsx`

**Composite health score (0–100)** — weighted blend of signals, shown prominently at top of tab:

| Signal | Weight (no GTMetrix) | Weight (with GTMetrix) |
|---|---|---|
| PageSpeed performance | 35% | 25% |
| PageSpeed SEO | 20% | 15% |
| PageSpeed accessibility | 15% | 10% |
| PageSpeed best practices | 15% | 10% |
| Crawl signals (meta/schema/OG/H1/canonical) | 15% | 15% |
| GTMetrix performance | — | 15% |
| GTMetrix structure | — | 10% |

**Critical Issues panel** — show actual problems prominently with severity:
- **Critical** (red): Performance < 50, LCP > 4s, CLS > 0.25, not mobile-friendly
- **High** (orange): missing schema, missing H1, non-HTTPS links, TBT > 600ms
- **Medium** (yellow): missing meta desc, missing canonical, images missing alt text, missing OG tags

If 0 critical/high issues and score ≥ 80, show a "Foundation is solid — focus on growth signals" green banner instead. Otherwise the tab leads with the red/orange badges.

**File:** new helper at `lib/healthScore.js` — pure computation, no side effects. Keeps the JSX component clean.

- [x] 4a. Create `lib/healthScore.js` with `computeHealthScore()` and `extractCriticalIssues()` helpers
- [x] 4b. Rework top section of `WebsiteHealthTab.jsx` to show composite score + issues panel

---

## Task 5 — Overview competitor analysis

**File:** `components/tabs/OverviewTab.jsx`

**Problem:** Overview's "Competitive Intelligence" section renders nothing when SEMRush returns no stats for competitor domains (small/unknown sites). User sees a blank gap in the tab.

**Fix:**

1. **Competitive Position Score (0–100)** per competitor, rolled up from:
   - Domain authority gap (40%)
   - Organic keyword count gap (30%)
   - Brand signals proxy — organic traffic gap (30%)
   
   Verdict per competitor: "You're ahead" (score > 55), "Roughly even" (45–55), "They're ahead" (< 45)

2. **Scoreboard at top** of the Competitive Intelligence section — one row per competitor with the score + verdict + quick stats (DA, keywords, traffic).

3. **Empty-data handling** — when SEMRush has no data for a competitor domain, show that explicitly ("SEMRush has no data for example.com — they may be below the crawl threshold") instead of hiding the competitor entirely. Signals to the user that there's a reason, not a bug.

**File:** new helper at `lib/competitiveScore.js` — pure computation.

- [x] 5a. Create `lib/competitiveScore.js`
- [x] 5b. Add a `CompetitivePositionScoreboard` sub-component to `OverviewTab.jsx`, wire it above the existing DomainAuthorityCompare block
- [x] 5c. Handle empty data states in DomainAuthorityCompare and KeywordComparisonGrid

---

## Build + ship

- [x] 6. Run `npm run build` — verify zero errors
- [x] 7. Push to GitHub `main`
- [x] 8. Add Review section

---

## Review

**Summary of changes** — 6 files edited, 3 new files added. Every change scoped tightly per the simplicity rule.

### Task 1 — Hero stats prominence (`app/page.js`)
Replaced the cramped inline flex row (three small `text-2xl` orange numbers with gray labels beside them) with a 3-column responsive grid. Numbers are now `text-3xl sm:text-4xl lg:text-5xl` in Momentum Orange, stacked above uppercase tracking-wider labels, with subtle pillar dividers between columns on desktop. Same copy, same stats — just sized to actually get noticed.

### Task 3 — GTMetrix integration
- **New:** `app/api/providers/gtmetrix.js` — submit-and-poll implementation with HTTP Basic auth (key as username, empty password). Hard 45s poll cap so a slow GTMetrix test never takes down the audit; returns `null` on missing key, failure, error state, or timeout. Defaults to Vancouver + Chrome Desktop.
- **Edited:** `app/api/audit/route.js` — added `runGTMetrix(url)` to the parallel `Promise.allSettled`; new `gtmetrix` field in the response payload.
- **Edited:** `app/api/providers/claude-analysis.js` — added `gtmetrixData` param to `runClaudeAnalysis`, injected a one-line summary (grade, perf score, structure score, LCP, CLS, fully-loaded time) into the prompt's TECHNICAL DATA section so Claude references real load metrics in the brand-gap analysis.
- **Edited:** `components/tabs/WebsiteHealthTab.jsx` — new `GTMetrixPanel` block with a big letter grade, performance + structure scores, fully-loaded time, and a link out to the full GTMetrix report. Auto-hides if the provider returned null (no key, timed out, etc.).

### Task 4 — Website Health score + Critical Issues
- **New:** `lib/healthScore.js` — two pure functions. `computeHealthScore()` returns a weighted 0–100 composite; weights shift automatically based on whether GTMetrix data is present (when present: PageSpeed 60% / GTMetrix 25% / crawl 15%; when absent: PageSpeed 85% / crawl 15%). `extractCriticalIssues()` returns an ordered list of concrete problems tagged Critical / High / Medium — performance under 50, LCP > 4s, CLS > 0.25, missing schema, missing H1, HTTP links, missing meta desc, missing OG, images without alt text, etc.
- **Edited:** `components/tabs/WebsiteHealthTab.jsx` — rewrote the tab's top section. Now leads with a big score ring (green/yellow/red based on the composite) + verdict ("Strong" / "Needs Attention" / "Critical Gaps") + one-line summary of how many Critical/High issues were found. Followed by a color-coded Issues panel (red/orange/yellow severity chips) with concrete labels and detail text explaining WHY each issue matters for AI discoverability. If zero critical/high issues exist, shows a green "Foundation Is Solid — focus on growth signals" banner instead. No more false reassurance from green checkmarks on a site that has real problems.

### Task 5 — Overview competitor analysis (`components/tabs/OverviewTab.jsx`)
- **New:** `lib/competitiveScore.js` — `computeCompetitivePositions()` rolls DA + organic keyword count + organic traffic into a single 0–100 score per competitor (weighted 40/30/30), using a log-scaled ratio so a 10× difference doesn't collapse to 0 or 100. Returns structured verdict strings (`ahead` / `even` / `behind` / `no-data` / `no-client-data`) with an explanatory message for the empty cases.
- **Edited:** Added a `CompetitivePositionScoreboard` component wired above the existing Domain Authority bars. One row per competitor with a colored dot, verdict chip ("You're ahead" / "Roughly even" / "They're ahead"), big score number, and gap stats (`DA: 52 (-8)`, `Keywords: 3,421 (+1,200)`, etc.) showing exactly where each competitor sits relative to the client.
- **Fixed:** Competitors that SEMRush has no data for now render as an explicit row saying "SEMRush has no data for [domain] — they may be below the crawl threshold" instead of being silently filtered out. Same treatment in the Domain Authority comparison.
- **Bonus bugfix:** The old `DomainAuthorityCompare` had `isLeading` and `isBehind` variables semantically swapped — it was painting the client's bar green when they were actually behind a competitor, and red when they were ahead. Corrected while I was in there.

### Docs
- **Edited:** `ENVIRONMENT_SETUP.md` — added `GTMETRIX_API_KEY` to the core audit env var table with a note on the HTTP Basic auth quirk and graceful-degradation behavior when unset.

### Build
`npm run build` passes clean — all 13 pages generate, zero errors or warnings related to these changes. Results page bundle grew from 16.8 kB → 19.9 kB (expected — new scoring logic and scoreboard component).

### Deployment
Pushed to `main`. Vercel auto-deploys.

### Still on backlog (per our simplicity rule, not shipped in this batch)
- **Webhook extension** — adding the 20 new audit-data columns to the Zapier payload. Waiting on you to add the new headers to the Google Sheet, then I'll extend `/api/webhook/route.js` + fire a second post-audit call from `AssessmentForm.jsx` with the full enriched payload.
- **Trust banner images** — waiting on clean transparent PNG uploads from you. Once those arrive, I'll swap them in and bump the banner display heights.
- **Momentum Orange color correction** — `#e85d04` → `#F46F0A` across the app. Trivial global find/replace, separate task.
