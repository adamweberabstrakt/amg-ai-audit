// app/api/report/route.js
// Generates a PDF report from audit results and delivers it via Resend email.
// Called after booking is confirmed (from /thank-you page or Chilipiper onSuccess).
// Uses PDFKit for PDF generation, Resend for email delivery.

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req) {
  try {
    const { leadData, auditData } = await req.json();

    if (!leadData?.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate PDF buffer
    const pdfBuffer = await generatePDF({ leadData, auditData });

    // Send via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from:    process.env.RESEND_FROM_EMAIL ?? 'assessments@abstraktmg.com',
      to:      leadData.email,
      subject: `Your AI Visibility Report — ${leadData.company}`,
      html:    buildEmailHTML(leadData, auditData),
      attachments: [
        {
          filename:    `AI-Visibility-Report-${leadData.company.replace(/\s+/g, '-')}.pdf`,
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

// ─── PDF Generation ───────────────────────────────────────────────────────────
async function generatePDF({ leadData, auditData }) {
  // Dynamic import — PDFKit is a CommonJS module
  const PDFDocument = (await import('pdfkit')).default;

  return new Promise((resolve, reject) => {
    const doc    = new PDFDocument({ margin: 50, size: 'LETTER' });
    const chunks = [];

    doc.on('data',  (chunk) => chunks.push(chunk));
    doc.on('end',   () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const claude  = auditData?.claude ?? {};
    const places  = auditData?.places ?? {};
    const ps      = auditData?.pageSpeed ?? {};
    const score   = claude.aiVisibilityScore ?? 0;
    const orange  = '#e85d04';
    const dark    = '#3d3d3d';

    // ── Cover ──────────────────────────────────────────────────────────────
    doc
      .rect(0, 0, doc.page.width, 200).fill(dark)
      .fillColor(orange).fontSize(24).font('Helvetica-Bold')
      .text('ABSTRAKT MARKETING GROUP', 50, 40)
      .fillColor('#ffffff').fontSize(18)
      .text('AI Visibility Assessment Report', 50, 75)
      .fontSize(14).fillColor('#cccccc')
      .text(leadData.company, 50, 105)
      .text(leadData.website ?? '', 50, 125)
      .fontSize(11).fillColor('#999999')
      .text(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 50, 155);

    // ── AI Visibility Score ────────────────────────────────────────────────
    doc.moveDown(8);
    doc.fillColor(dark).fontSize(18).font('Helvetica-Bold').text('AI Visibility Score', 50, 230);

    const scoreColor = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
    doc.fillColor(scoreColor).fontSize(60).text(`${score}`, 50, 255);
    doc.fillColor('#666666').fontSize(12).font('Helvetica').text('out of 100', 50, 320);

    if (claude.visibilitySummary) {
      doc.moveDown()
        .fillColor('#333333').fontSize(11)
        .text(claude.visibilitySummary, 50, 360, { width: 500 });
    }

    // ── Score Breakdown ────────────────────────────────────────────────────
    if (claude.scoreBreakdown) {
      doc.addPage();
      doc.fillColor(dark).fontSize(16).font('Helvetica-Bold').text('Score Breakdown', 50, 50);
      doc.moveDown();

      const items = [
        ['Content Authority',  claude.scoreBreakdown.contentAuthority],
        ['Structured Data',    claude.scoreBreakdown.structuredData],
        ['Brand Signals',      claude.scoreBreakdown.brandSignals],
        ['Local Presence',     claude.scoreBreakdown.localPresence],
      ];

      let y = 90;
      items.forEach(([label, val]) => {
        const color = (val ?? 0) >= 70 ? '#22c55e' : (val ?? 0) >= 40 ? '#f59e0b' : '#ef4444';
        doc.fillColor('#333333').fontSize(12).font('Helvetica').text(label, 50, y);
        doc.fillColor(color).font('Helvetica-Bold').text(`${val ?? '—'}`, 400, y);
        y += 25;
      });
    }

    // ── Top Recommendations ────────────────────────────────────────────────
    if (claude.topRecommendations?.length > 0) {
      doc.addPage();
      doc.fillColor(dark).fontSize(16).font('Helvetica-Bold').text('Top Recommendations', 50, 50);
      doc.moveDown();

      let y = 90;
      claude.topRecommendations.forEach((rec, i) => {
        doc.fillColor(orange).fontSize(13).font('Helvetica-Bold').text(`${i + 1}.`, 50, y);
        doc.fillColor('#333333').fontSize(11).font('Helvetica').text(rec, 75, y, { width: 450 });
        y += 60;
      });
    }

    // ── CTA Page ───────────────────────────────────────────────────────────
    doc.addPage();
    doc.rect(0, 0, doc.page.width, doc.page.height).fill(dark);
    doc
      .fillColor(orange).fontSize(22).font('Helvetica-Bold')
      .text('Ready to Fix Your AI Visibility Gaps?', 50, 200, { align: 'center', width: 500 })
      .fillColor('#ffffff').fontSize(14).font('Helvetica')
      .text('Book a free 30-minute strategy call with our team.', 50, 250, { align: 'center', width: 500 })
      .text('We\'ll walk through your results and build a custom action plan.', 50, 275, { align: 'center', width: 500 })
      .fillColor(orange).fontSize(13).font('Helvetica-Bold')
      .text('abstraktmg.com', 50, 330, { align: 'center', width: 500 });

    doc.end();
  });
}

// ─── Email HTML Template ──────────────────────────────────────────────────────
function buildEmailHTML(leadData, auditData) {
  const score  = auditData?.claude?.aiVisibilityScore ?? 0;
  const recs   = auditData?.claude?.topRecommendations ?? [];
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
          <p style="color:#e85d04;font-size:18px;font-weight:bold;margin:0;">ABSTRAKT MARKETING GROUP</p>
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
              <span style="color:#e85d04;font-size:18px;font-weight:bold;min-width:20px;">${i + 1}.</span>
              <p style="font-size:13px;color:#555;line-height:1.5;margin:0;">${rec}</p>
            </div>
          `).join('')}
        </td></tr>` : ''}

        <!-- CTA -->
        <tr><td style="padding:30px 40px;text-align:center;background:#3d3d3d;">
          <p style="color:#fff;font-size:16px;margin:0 0 15px;">Your full report is attached.</p>
          <p style="color:#ccc;font-size:13px;margin:0 0 25px;">Ready to fix your AI visibility gaps? Book a free strategy call with our team.</p>
          <a href="https://abstraktmg.com" style="background:#e85d04;color:#fff;text-decoration:none;padding:14px 28px;border-radius:5px;font-weight:bold;font-size:14px;">Book My Free Call</a>
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
