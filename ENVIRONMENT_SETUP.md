# Environment Variables

All env vars live in Vercel → Project Settings → Environment Variables.

## Core audit

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Claude AI analysis of audit data |
| `GOOGLE_API_KEY` | PageSpeed Insights + Google Places API |
| `SEMRUSH_API_KEY` | Domain authority + transactional keywords |

## Lead capture

| Variable | Purpose |
|---|---|
| `ZAPIER_WEBHOOK_URL` | Lead form → Google Sheets via Zapier |

## User report email (PDF attachment)

Fires automatically right after the audit completes, delivering the lead's AI Visibility Report PDF to their inbox.

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Required. Resend API key for transactional email |
| `RESEND_FROM_EMAIL` | Optional. Defaults to `assessments@abstraktmg.com` |

## Internal team notifications (optional — manual "Notify Team" button)

Wired to the "Notify Team" button on the results page. Safe to leave unset; button just reports no channels configured.

| Variable | Purpose |
|---|---|
| `TEAMS_WEBHOOK_URL` | Teams channel incoming webhook |
| `BREVO_SMTP_KEY` | Brevo API key for internal email notifications |
| `BREVO_FROM_EMAIL` | Defaults to `notifications@abstraktmg.com` |
| `BREVO_TO_EMAIL` | Defaults to `team@abstraktmg.com` |

## Booking + analytics

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_CHILIPIPER_SUBDOMAIN` | ChiliPiper iframe subdomain |
| `NEXT_PUBLIC_CHILIPIPER_ROUTER` | ChiliPiper router name |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container (Meta Pixel + LinkedIn Insight Tag live inside GTM) |

## Feature flows

**PDF download (manual button on results page):** `ReportActions.jsx` → `POST /api/pdf` → generates PDF via PDFKit and streams back as attachment.

**User report email (auto after audit):** `AssessmentForm.jsx` → `POST /api/report` → generates PDF via PDFKit and emails via Resend.

Both routes share `lib/generatePdf.js` so PDF output stays consistent.
