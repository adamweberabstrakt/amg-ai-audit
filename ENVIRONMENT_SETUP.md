# Environment Variables for PDF + Notification Features

## Required Dependencies

```bash
npm install puppeteer@^21.5.2
```

## Teams Integration

Add to your Vercel environment variables:

```env
TEAMS_WEBHOOK_URL=https://outlook.office.com/webhook/YOUR_TEAMS_CHANNEL_WEBHOOK_URL
```

**How to get Teams webhook URL:**
1. Go to your Teams channel
2. Click the "..." menu → "Connectors"
3. Search for "Incoming Webhook" → Configure
4. Name it "AMG AI Audit Notifications"
5. Copy the webhook URL

## Brevo SMTP Email Integration

Add to your Vercel environment variables:

```env
BREVO_SMTP_KEY=your_brevo_api_key_here
BREVO_FROM_EMAIL=notifications@abstraktmg.com
BREVO_TO_EMAIL=team@abstraktmg.com
```

**How to get Brevo SMTP key:**
1. Login to Brevo (formerly SendinBlue)
2. Go to SMTP & API → API Keys
3. Create a new API key for "AMG AI Audit"
4. Copy the key

## Optional Status Indicators (for UI)

These help the ReportActions component show channel availability:

```env
NEXT_PUBLIC_TEAMS_AVAILABLE=true
NEXT_PUBLIC_BREVO_AVAILABLE=true
```

## Testing the Features

**PDF Generation:**
- Visit any audit results page
- Click "Download PDF Report" in the Report Actions section
- Professional PDF with company branding will download

**Team Notifications:**
- Click "Notify Team" button
- Sends formatted message to both Teams and email
- Shows status of each channel (success/failed)

**Notification Types:**
- `audit_completed` - Sent when user completes an audit
- `form_submission` - Sent when user submits the initial form

## Error Handling

Both features gracefully fail if environment variables are missing:
- PDF: Shows error message, user can try again
- Notifications: Shows which channels failed and why
- Missing env vars are logged in the UI for debugging

## Security Notes

- Teams webhook URL is safe to expose (it's channel-specific)
- Brevo API key should be kept secret (use Vercel environment variables)
- PDF generation runs server-side only (no client exposure)

## Vercel Configuration

For Puppeteer to work on Vercel, add to your `vercel.json`:

```json
{
  "functions": {
    "app/api/pdf/route.js": {
      "maxDuration": 30
    }
  }
}
```

This gives the PDF generation enough time to render complex reports.
