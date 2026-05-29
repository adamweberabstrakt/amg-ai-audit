// lib/generatePdf.js
// Shared PDFKit generator — used by both /api/pdf (download) and /api/report (email attachment).
// Returns a Buffer. Serverless-compatible (no Puppeteer).

export async function generatePdf({ leadData, auditData }) {
  const PDFDocument = (await import('pdfkit')).default;

  return new Promise((resolve, reject) => {
    const doc    = new PDFDocument({ margin: 50, size: 'LETTER' });
    const chunks = [];

    doc.on('data',  (chunk) => chunks.push(chunk));
    doc.on('end',   () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const claude   = auditData?.claude    ?? {};
    const ps       = auditData?.pageSpeed ?? {};
    const places   = auditData?.places    ?? {};
    const semrush  = auditData?.semrush   ?? null;
    const score    = claude.aiVisibilityScore ?? 0;
    const orange   = '#F46F0A';
    const dark     = '#1a1a1a';
    const heading  = '#111827';
    const body     = '#374151';
    const muted    = '#6b7280';
    const W        = doc.page.width;

    // ── Helper: section page header ───────────────────────────────────────
    function sectionHeader(title) {
      doc.addPage();
      doc.rect(0, 0, W, 60).fill(dark);
      doc.fillColor(orange).fontSize(10).font('Helvetica-Bold')
        .text('ABSTRAKT AI VISIBILITY ASSESSMENT', 50, 18);
      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold')
        .text(title, 50, 36);
      doc.y = 80;
    }

    // ── Helper: score pill ────────────────────────────────────────────────
    function scorePill(label, val, x, y) {
      const color = (val ?? 0) >= 70 ? '#22c55e' : (val ?? 0) >= 40 ? '#f59e0b' : '#ef4444';
      doc.fillColor(body).fontSize(11).font('Helvetica').text(label, x, y);
      doc.fillColor(color).font('Helvetica-Bold').text(`${val ?? '—'}`, x + 340, y);
    }

    // ── Helper: safe text block ───────────────────────────────────────────
    function bodyText(text, opts = {}) {
      doc.fillColor(body).fontSize(11).font('Helvetica')
        .text(text, 50, doc.y, { width: 500, lineGap: 3, ...opts });
      doc.moveDown(0.5);
    }

    // ── Cover ──────────────────────────────────────────────────────────────
    doc.rect(0, 0, W, 220).fill(dark);
    doc.fillColor(orange).fontSize(11).font('Helvetica-Bold')
      .text('ABSTRAKT MARKETING GROUP', 50, 35);
    doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold')
      .text('AI Visibility Assessment Report', 50, 58);
    doc.fillColor('#cccccc').fontSize(13).font('Helvetica')
      .text(leadData?.company ?? '', 50, 100)
      .text(leadData?.website ?? '', 50, 118);
    doc.fillColor('#999999').fontSize(10)
      .text(
        `Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
        50, 148,
      );

    // Score ring (text representation)
    const scoreColor = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
    doc.fillColor(scoreColor).fontSize(64).font('Helvetica-Bold').text(`${score}`, 50, 250);
    doc.fillColor(muted).fontSize(12).font('Helvetica').text('/ 100  AI Visibility Score', 50, 325);

    if (claude.urgencyLevel) {
      const urgencyLabel = { high: '⚠ High Priority', medium: '● Medium Priority', low: '✓ Low Priority' }[claude.urgencyLevel] ?? '';
      const urgencyColor = { high: '#ef4444', medium: '#f59e0b', low: '#22c55e' }[claude.urgencyLevel] ?? muted;
      doc.fillColor(urgencyColor).fontSize(11).font('Helvetica-Bold').text(urgencyLabel, 50, 350);
    }

    if (claude.visibilitySummary) {
      doc.fillColor(body).fontSize(11).font('Helvetica')
        .text(claude.visibilitySummary, 50, 385, { width: 500, lineGap: 3 });
    }

    // ── TABLE OF CONTENTS ──────────────────────────────────────────────────
    doc.addPage();
    doc.fillColor(heading).fontSize(18).font('Helvetica-Bold').text('Contents', 50, 50);
    const toc = [
      '1.  AI Visibility',
      '2.  Website Health',
      '3.  Local & Search Presence',
      '4.  Brand Gap Analysis',
      '5.  Competitive Intelligence',
      '6.  Top Recommendations',
    ];
    let tocY = 90;
    toc.forEach(item => {
      doc.fillColor(body).fontSize(12).font('Helvetica').text(item, 50, tocY);
      tocY += 24;
    });

    // ══════════════════════════════════════════════════════════════════════
    // ── 1. AI VISIBILITY ──────────────────────────────────────────────────
    // ══════════════════════════════════════════════════════════════════════
    sectionHeader('1. AI Visibility');

    doc.fillColor(heading).fontSize(14).font('Helvetica-Bold').text('Score Breakdown', 50, doc.y);
    doc.moveDown(0.5);
    const breakdown = claude.scoreBreakdown ?? {};
    [
      ['Content Authority',  breakdown.contentAuthority],
      ['Structured Data',    breakdown.structuredData],
      ['Brand Signals',      breakdown.brandSignals],
      ['Local Presence',     breakdown.localPresence],
    ].forEach(([label, val]) => {
      scorePill(label, val, 50, doc.y);
      doc.moveDown(0.8);
    });

    // AI Mention Test result
    const mention = auditData?.openaiMention;
    if (mention && mention !== false && mention !== null) {
      doc.moveDown(0.5);
      doc.fillColor(heading).fontSize(14).font('Helvetica-Bold').text('Live AI Mention Test (GPT-4o)', 50, doc.y);
      doc.moveDown(0.4);
      const verdictColor = mention.mentioned ? '#22c55e' : '#ef4444';
      const verdictLabel = mention.mentioned
        ? '✓  Your business WAS mentioned by ChatGPT'
        : '✗  Your business was NOT mentioned by ChatGPT';
      doc.fillColor(verdictColor).fontSize(12).font('Helvetica-Bold').text(verdictLabel, 50, doc.y, { width: 500 });
      doc.moveDown(0.4);
      doc.fillColor(muted).fontSize(9).font('Helvetica').text(`Query: "${mention.query}"`, 50, doc.y, { width: 500 });
      doc.moveDown(0.6);
      doc.fillColor(heading).fontSize(11).font('Helvetica-Bold').text('GPT-4o Response:', 50, doc.y);
      doc.moveDown(0.3);
      doc.fillColor(body).fontSize(10).font('Helvetica')
        .text(mention.responseText, 50, doc.y, { width: 500, lineGap: 2 });
      doc.moveDown(0.5);
    }

    if (claude.criticalGaps?.length > 0) {
      doc.moveDown(0.5);
      doc.fillColor(heading).fontSize(14).font('Helvetica-Bold').text('Critical Gaps', 50, doc.y);
      doc.moveDown(0.4);
      claude.criticalGaps.forEach(gap => {
        doc.fillColor('#ef4444').fontSize(10).font('Helvetica-Bold').text('✗', 50, doc.y);
        doc.fillColor(body).fontSize(10).font('Helvetica').text(gap, 65, doc.y, { width: 490 });
        doc.moveDown(0.6);
      });
    }

    if (claude.quickWins?.length > 0) {
      doc.moveDown(0.5);
      doc.fillColor(heading).fontSize(14).font('Helvetica-Bold').text('Quick Wins', 50, doc.y);
      doc.moveDown(0.4);
      claude.quickWins.forEach(win => {
        doc.fillColor('#22c55e').fontSize(10).font('Helvetica-Bold').text('✓', 50, doc.y);
        doc.fillColor(body).fontSize(10).font('Helvetica').text(win, 65, doc.y, { width: 490 });
        doc.moveDown(0.6);
      });
    }

    // ══════════════════════════════════════════════════════════════════════
    // ── 2. WEBSITE HEALTH ─────────────────────────────────────────────────
    // ══════════════════════════════════════════════════════════════════════
    sectionHeader('2. Website Health');

    if (ps.score != null) {
      doc.fillColor(heading).fontSize(14).font('Helvetica-Bold').text('PageSpeed Insights (Mobile)', 50, doc.y);
      doc.moveDown(0.5);
      [
        ['Performance Score',  ps.score],
        ['SEO Score',          ps.seoScore],
        ['Accessibility',      ps.accessScore],
        ['Best Practices',     ps.bestPractices],
      ].forEach(([label, val]) => {
        scorePill(label, val, 50, doc.y);
        doc.moveDown(0.8);
      });
    }

    if (ps?.metrics) {
      doc.moveDown(0.5);
      doc.fillColor(heading).fontSize(14).font('Helvetica-Bold').text('Core Web Vitals', 50, doc.y);
      doc.moveDown(0.4);
      [
        ['Largest Contentful Paint (LCP)', ps.metrics.lcp],
        ['Total Blocking Time (TBT)',       ps.metrics.fid],
        ['Cumulative Layout Shift (CLS)',   ps.metrics.cls],
        ['First Contentful Paint (FCP)',    ps.metrics.fcp],
        ['Speed Index',                     ps.metrics.si],
        ['Server Response Time (TTFB)',     ps.metrics.ttfb],
      ].filter(([, v]) => v != null).forEach(([label, val]) => {
        doc.fillColor(body).fontSize(11).font('Helvetica').text(label, 50, doc.y);
        doc.fillColor(heading).font('Helvetica-Bold').text(String(val), 390, doc.y);
        doc.moveDown(0.7);
      });
    }

    const gt = auditData?.gtmetrix;
    if (gt && gt !== null && gt !== false) {
      doc.moveDown(0.5);
      doc.fillColor(heading).fontSize(14).font('Helvetica-Bold').text('GTMetrix Report', 50, doc.y);
      doc.moveDown(0.4);
      if (gt.grade) {
        doc.fillColor(body).fontSize(11).font('Helvetica').text('GTMetrix Grade', 50, doc.y);
        doc.fillColor(orange).font('Helvetica-Bold').text(gt.grade, 390, doc.y);
        doc.moveDown(0.7);
      }
      if (gt.performanceScore != null) {
        scorePill('Performance Score', gt.performanceScore, 50, doc.y); doc.moveDown(0.8);
      }
      if (gt.structureScore != null) {
        scorePill('Structure Score', gt.structureScore, 50, doc.y); doc.moveDown(0.8);
      }
      if (gt.fullyLoadedTime) {
        doc.fillColor(body).fontSize(11).font('Helvetica').text('Fully Loaded Time', 50, doc.y);
        doc.fillColor(heading).font('Helvetica-Bold').text(gt.fullyLoadedTime, 390, doc.y);
        doc.moveDown(0.7);
      }
    }

    // ══════════════════════════════════════════════════════════════════════
    // ── 3. LOCAL & SEARCH PRESENCE ────────────────────────────────────────
    // ══════════════════════════════════════════════════════════════════════
    sectionHeader('3. Local & Search Presence');

    if (places.found) {
      doc.fillColor(heading).fontSize(14).font('Helvetica-Bold').text('Google Business Profile', 50, doc.y);
      doc.moveDown(0.5);
      [
        ['Business Name',   places.name],
        ['Address',         places.address],
        ['Phone',           places.phone],
        ['Rating',          places.rating ? `${places.rating} ★ (${places.reviewCount?.toLocaleString() ?? 0} reviews)` : null],
        ['Profile Score',   places.profileScore != null ? `${places.profileScore}/100` : null],
        ['Status',          places.businessStatus === 'OPERATIONAL' ? 'Open for Business' : places.businessStatus],
      ].filter(([, v]) => v).forEach(([label, val]) => {
        doc.fillColor(body).fontSize(11).font('Helvetica').text(label, 50, doc.y);
        doc.fillColor(heading).font('Helvetica-Bold').text(String(val), 220, doc.y);
        doc.moveDown(0.7);
      });
    } else {
      bodyText('Google Business Profile not found for this business. Claiming and optimizing your GBP listing is one of the highest-impact local SEO actions available.');
    }

    // ══════════════════════════════════════════════════════════════════════
    // ── 4. BRAND GAP ANALYSIS ─────────────────────────────────────────────
    // ══════════════════════════════════════════════════════════════════════
    sectionHeader('4. Brand Gap Analysis');

    if (claude.brandGapAnalysis) {
      doc.fillColor(heading).fontSize(14).font('Helvetica-Bold').text('Analysis', 50, doc.y);
      doc.moveDown(0.4);
      claude.brandGapAnalysis.split('\n').filter(p => p.trim()).forEach(para => {
        bodyText(para);
      });
    }

    if (claude.mentionedByAI === false) {
      doc.moveDown(0.4);
      doc.fillColor('#ef4444').fontSize(11).font('Helvetica-Bold')
        .text('⚠  Your business was not mentioned by AI tools when asked for recommendations in your category.', 50, doc.y, { width: 500 });
      doc.moveDown(0.6);
    } else if (claude.mentionedByAI === true) {
      doc.fillColor('#22c55e').fontSize(11).font('Helvetica-Bold')
        .text('✓  Your business was mentioned by AI tools when asked for recommendations in your category.', 50, doc.y, { width: 500 });
      doc.moveDown(0.6);
    }

    // ══════════════════════════════════════════════════════════════════════
    // ── 5. COMPETITIVE INTELLIGENCE ───────────────────────────────────────
    // ══════════════════════════════════════════════════════════════════════
    if (semrush?.clientStats || semrush?.competitors?.length > 0) {
      sectionHeader('5. Competitive Intelligence');

      const client = semrush.clientStats;
      if (client) {
        doc.fillColor(heading).fontSize(14).font('Helvetica-Bold').text('Your Domain Metrics', 50, doc.y);
        doc.moveDown(0.4);
        [
          ['Domain Authority',   client.authorityScore],
          ['Organic Keywords',   client.organicKeywords?.toLocaleString()],
          ['Organic Traffic',    client.organicTraffic?.toLocaleString()],
        ].filter(([, v]) => v != null).forEach(([label, val]) => {
          doc.fillColor(body).fontSize(11).font('Helvetica').text(label, 50, doc.y);
          doc.fillColor(heading).font('Helvetica-Bold').text(String(val), 300, doc.y);
          doc.moveDown(0.7);
        });
      }

      semrush.competitors?.forEach((comp, ci) => {
        const stats = comp.data?.stats;
        if (!stats) return;
        doc.moveDown(0.5);
        doc.fillColor(heading).fontSize(13).font('Helvetica-Bold')
          .text(`Competitor ${ci + 1}: ${comp.domain}`, 50, doc.y);
        doc.moveDown(0.4);
        [
          ['Domain Authority',   stats.authorityScore],
          ['Organic Keywords',   stats.organicKeywords?.toLocaleString()],
          ['Organic Traffic',    stats.organicTraffic?.toLocaleString()],
        ].filter(([, v]) => v != null).forEach(([label, val]) => {
          doc.fillColor(body).fontSize(11).font('Helvetica').text(label, 50, doc.y);
          doc.fillColor(body).font('Helvetica-Bold').text(String(val), 300, doc.y);
          doc.moveDown(0.7);
        });
      });
    }

    // ══════════════════════════════════════════════════════════════════════
    // ── 6. TOP RECOMMENDATIONS ────────────────────────────────────────────
    // ══════════════════════════════════════════════════════════════════════
    sectionHeader('6. Top Recommendations');

    if (claude.topRecommendations?.length > 0) {
      claude.topRecommendations.forEach((rec, i) => {
        doc.fillColor(orange).fontSize(13).font('Helvetica-Bold').text(`${i + 1}.`, 50, doc.y);
        doc.fillColor(body).fontSize(11).font('Helvetica').text(rec, 70, doc.y, { width: 480 });
        doc.moveDown(1);
      });
    }

    // ── CTA Page ───────────────────────────────────────────────────────────
    doc.addPage();
    doc.rect(0, 0, W, doc.page.height).fill(dark);
    doc
      .fillColor(orange).fontSize(22).font('Helvetica-Bold')
      .text('Ready to Fix Your AI Visibility Gaps?', 50, 220, { align: 'center', width: 500 })
      .fillColor('#ffffff').fontSize(13).font('Helvetica')
      .text('Book a free 30-minute strategy call with our team.', 50, 265, { align: 'center', width: 500 })
      .text("We'll walk through your results and build a custom action plan.", 50, 285, { align: 'center', width: 500 })
      .fillColor(orange).fontSize(13).font('Helvetica-Bold')
      .text('abstraktmg.com', 50, 330, { align: 'center', width: 500 });

    doc.end();
  });
}
