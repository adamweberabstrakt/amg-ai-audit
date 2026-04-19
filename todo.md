# PDF Download + Email Confirmations — Final Wire-Up

## Context

Two features are half-built and not firing in production:

### PDF download
- "Download PDF Report" button in `components/ReportActions.jsx` calls `/api/pdf`
- `/api/pdf/route.js` uses **Puppeteer**, which does NOT work on Vercel serverless without `@sparticuz/chromium` + `puppeteer-core`
- Meanwhile, `/api/report/route.js` has a working **PDFKit** generator (serverless-compatible) but nothing calls it
- `pdfkit` is already in `package.json` — no new deps needed

### Email confirmation to the user
- `/thank-you` page tells the user *"We've also sent your full AI Visibility Report to your inbox"* — but nothing is actually sending that email
- `/api/report/route.js` already generates a PDF with PDFKit AND emails it via Resend — but it's dead code (nothing calls it)
- `RESEND_API_KEY` + `RESEND_FROM_EMAIL` env vars already listed in the route
- `/api/notify` (Brevo + Teams) is separate — it's for internal team notifications, not the user, and is already wired to its own manual button. Leave it alone.

## Decision points

- **Extract the PDFKit generator into a shared helper** (`lib/generatePdf.js`) so both `/api/pdf` (download) and `/api/report` (email attachment) use the same code. One source of truth.
- **Fire `/api/report` right after audit completes** in `AssessmentForm.jsx` — same spot as the existing Zapier webhook, fire-and-forget (`.catch(()=>{})`). This matches the pattern and matches the thank-you page copy.
- **Drop Puppeteer from `package.json`** — saves ~170MB of serverless bundle and cuts cold-start time significantly.
- **Leave `/api/notify` untouched** — it works, it's for internal team alerts, different concern.

## Todo items

- [x] 1. Create `lib/generatePdf.js` — extract the PDFKit generator function from `/api/report/route.js` into a reusable module
- [x] 2. Rewrite `app/api/pdf/route.js` — swap Puppeteer → PDFKit, import from `lib/generatePdf.js`, add `export const maxDuration = 30`
- [x] 3. Update `app/api/report/route.js` — import PDF generator from `lib/generatePdf.js` instead of defining inline
- [x] 4. Update `components/AssessmentForm.jsx` — after audit succeeds, fire `/api/report` with `leadData` + `auditData` (fire-and-forget, matches existing webhook pattern)
- [x] 5. Remove `puppeteer` from `package.json` dependencies
- [x] 6. Clean up `ENVIRONMENT_SETUP.md` — drop the Puppeteer sections that are out of date, document `RESEND_API_KEY` + `RESEND_FROM_EMAIL` clearly
- [x] 7. Run `npm install` then `npm run build` to verify clean build
- [x] 8. Push to GitHub
- [x] 9. Write review section

## Review

**Summary of changes** — 6 files touched, 1 new file added, all changes scoped as tightly as possible.

- **`lib/generatePdf.js` (new):** Extracted the working PDFKit generator (previously buried inside `/api/report/route.js`) into a shared helper. Both the PDF download and the email attachment now call the same function — one source of truth for PDF output.
- **`app/api/pdf/route.js`:** Rewrote from ~430 lines of Puppeteer-based HTML→PDF to ~35 lines of PDFKit. Puppeteer doesn't run on Vercel serverless without `@sparticuz/chromium` + `puppeteer-core`, which is why the download button was failing in production. PDFKit runs natively in Node and was already installed.
- **`app/api/report/route.js`:** Trimmed down — dropped the inline PDF generator, now imports from `lib/generatePdf.js`. The Resend email flow and HTML template are unchanged.
- **`components/AssessmentForm.jsx`:** Added one line. Right after the audit succeeds, we fire `POST /api/report` fire-and-forget (same pattern as the existing Zapier webhook call) to send the user their PDF report by email. This is what makes the `/thank-you` page copy ("We've also sent your full AI Visibility Report to your inbox") actually true.
- **`package.json`:** Dropped `puppeteer` dependency. Saves ~170MB of serverless bundle space and cuts Vercel cold-start time significantly.
- **`ENVIRONMENT_SETUP.md`:** Rewrote to match current reality — clear table of every env var grouped by purpose (core audit, lead capture, user report email, internal team notifications, booking + analytics). Dropped stale Puppeteer/vercel.json Puppeteer config notes.

**What we did NOT touch** — kept scope tight:
- `/api/notify` (internal Teams/Brevo notifications for the "Notify Team" button) — works fine, different concern, untouched
- The Zapier webhook flow — untouched
- The `ReportActions.jsx` component UI — untouched, the buttons just work now
- The `#e85d04` → `#F46F0A` orange color discrepancy — still on the backlog, separate task

**Build:** `npm run build` passes clean — compiled successfully, all 13 static pages generated, both `/api/pdf` and `/api/report` show up as dynamic server routes, zero errors or warnings related to these changes.

**Env vars needed in Vercel** (both should already exist per memory):
- `RESEND_API_KEY` — required for the user report email to send
- `RESEND_FROM_EMAIL` — optional, defaults to `assessments@abstraktmg.com`

**Deployment:** Pushed to `main`. Vercel auto-deploys.

## Non-goals

- Not touching `/api/notify` (internal Teams/Brevo notifications — works fine, separate concern)
- Not changing the "Download PDF Report" or "Notify Team" buttons in `ReportActions.jsx` — just fixing the backend so Download PDF works
- Not touching the Zapier webhook flow
- Not fixing the `#e85d04` → `#F46F0A` orange color discrepancy (separate task in the backlog)

## Environment variables required (already in Vercel)

- `RESEND_API_KEY` — for sending the user's email
- `RESEND_FROM_EMAIL` — defaults to `assessments@abstraktmg.com` if missing
