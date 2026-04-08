// app/api/webhook/route.js
// Forwards lead + UTM data to Zapier on form submission.
// Fires before the audit starts. Silent fail — don't block the UX.

import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('[webhook] ZAPIER_WEBHOOK_URL not set — skipping');
      return NextResponse.json({ ok: true, skipped: true });
    }

    const payload = {
      // Contact
      firstName:  body.firstName,
      lastName:   body.lastName,
      email:      body.email,
      phone:      body.phone,
      company:    body.company,
      website:    body.website,
      // Business context
      industry:       body.industry,
      goal:           body.goal,
      budgetRange:    body.budgetRange,
      runningPaidAds: body.runningPaidAds,
      // Brand maturity
      brandRating:       body.brandRating,
      hasSocialMedia:    body.hasSocialMedia,
      aiToolsUsed:       body.aiToolsUsed,
      requestReviewCall: body.requestReviewCall ?? false,
      // UTM attribution
      utmSource:   body.utmSource,
      utmMedium:   body.utmMedium,
      utmCampaign: body.utmCampaign,
      utmContent:  body.utmContent,
      gclid:       body.gclid,
      // Meta
      timestamp:  new Date().toISOString(),
      source:     'ai-visibility-assessment',
      resultsUrl: body.resultsUrl ?? null,
    };

    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) console.error('[webhook] Zapier returned', res.status);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[webhook] Error:', err);
    // Return 200 — don't surface Zapier errors to the user
    return NextResponse.json({ ok: true });
  }
}
