// lib/generatePdf.js
// Shared PDFKit generator — used by both /api/pdf (download) and /api/report (email attachment).
// Returns a Buffer. Serverless-compatible (no Puppeteer).

export async function generatePdf({ leadData, auditData }) {
  // Dynamic import — PDFKit is a CommonJS module
  const PDFDocument = (await import('pdfkit')).default;

  return new Promise((resolve, reject) => {
    const doc    = new PDFDocument({ margin: 50, size: 'LETTER' });
    const chunks = [];

    doc.on('data',  (chunk) => chunks.push(chunk));
    doc.on('end',   () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const claude  = auditData?.claude ?? {};
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
      .text(leadData?.company ?? '', 50, 105)
      .text(leadData?.website ?? '', 50, 125)
      .fontSize(11).fillColor('#999999')
      .text(
        `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        50, 155,
      );

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
