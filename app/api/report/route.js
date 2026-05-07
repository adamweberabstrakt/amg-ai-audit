// app/api/report/route.js
// Generates a PDF report and delivers it to the user via Resend email.
// Called fire-and-forget from AssessmentForm.jsx right after the audit completes.

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generatePdf } from '@/lib/generatePdf';

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { leadData, auditData } = await req.json();

    if (!leadData?.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    if (!process.env.RESEND_API_KEY) {
      console.warn('[report] RESEND_API_KEY not set — skipping');
      return NextResponse.json({ ok: true, skipped: true });
    }

    const pdfBuffer = await generatePdf({ leadData, auditData });
    const resend    = new Resend(process.env.RESEND_API_KEY);
    const safeName  = (leadData.company ?? 'report').replace(/\s+/g, '-');

    const { error } = await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL ?? 'assessments@abstraktmg.com',
      to:      leadData.email,
      subject: `Your AI Visibility Report — ${leadData.company ?? ''}`.trim(),
      html:    buildEmailHTML(leadData, auditData),
      attachments: [
        {
          filename:    `AI-Visibility-Report-${safeName}.pdf`,
          content:     pdfBuffer.toString('base64'),
          contentType: 'application/pdf',
        },
      ],
    });

    if (error) {
      console.error('[report/route] Resend error:', error);
      return NextResponse.json({ error: 'Email delivery failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[report/route] Error:', err);
    return NextResponse.json({ error: 'Report generation failed' }, { status: 500 });
  }
}

// ─── Email HTML Template ──────────────────────────────────────────────────────
function buildEmailHTML(leadData, auditData) {
  const score   = auditData?.claude?.aiVisibilityScore ?? 0;
  const recs    = auditData?.claude?.topRecommendations ?? [];
  const summary = auditData?.claude?.visibilitySummary ?? '';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:#3d3d3d;padding:30px 40px;">
          <p style="color:#FF210F;font-size:18px;font-weight:bold;margin:0;">ABSTRAKT MARKETING GROUP</p>
          <p style="color:#ffffff;font-size:14px;margin:5px 0 0;">AI Visibility Assessment Report</p>
        </td></tr>

        <!-- Score hero -->
        <tr><td style="padding:40px;text-align:center;background:#f9f9f9;">
          <p style="color:#666;font-size:14px;margin:0 0 10px;">Your AI Visibility Score</p>
          <p style="font-size:72px;font-weight:bold;color:${score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444'};margin:0;">${score}</p>
          <p style="color:#999;font-size:13px;margin:5px 0 0;">out of 100</p>
        </td></tr>

        <!-- Summary -->
        <tr><td style="padding:30px 40px;">
          <p style="font-size:14px;color:#444;line-height:1.6;">${summary}</p>
        </td></tr>

        <!-- Recommendations -->
        ${recs.length > 0 ? `
        <tr><td style="padding:0 40px 30px;">
          <p style="font-size:16px;font-weight:bold;color:#3d3d3d;margin-bottom:15px;">Your Top Recommendations</p>
          ${recs.map((rec, i) => `
            <div style="display:flex;gap:15px;margin-bottom:15px;">
              <span style="color:#FF210F;font-size:18px;font-weight:bold;min-width:20px;">${i + 1}.</span>
              <p style="font-size:13px;color:#555;line-height:1.5;margin:0;">${rec}</p>
            </div>
          `).join('')}
        </td></tr>` : ''}

        <!-- CTA -->
        <tr><td style="padding:30px 40px;text-align:center;background:#3d3d3d;">
          <p style="color:#fff;font-size:16px;margin:0 0 15px;">Your full report is attached.</p>
          <p style="color:#ccc;font-size:13px;margin:0 0 25px;">Ready to fix your AI visibility gaps? Book a free strategy call with our team.</p>
          <a href="https://abstraktmg.com" style="background:#FF210F;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:14px;">Book My Free Call</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 40px;text-align:center;">
          <p style="color:#999;font-size:11px;margin:0;">© ${new Date().getFullYear()} Abstrakt Marketing Group · <a href="https://abstraktmg.com" style="color:#999;">abstraktmg.com</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
