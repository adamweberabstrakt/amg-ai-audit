// lib/healthScore.js
// Pure-function helpers for website health scoring + surfacing critical issues.
// Used by WebsiteHealthTab. No side effects.

/**
 * Computes a composite 0–100 website health score from PageSpeed, crawl, and
 * (optionally) GTMetrix data. If GTMetrix data is present, weights shift to
 * incorporate it; otherwise, PageSpeed weights scale up.
 */
export function computeHealthScore({ pageSpeed, crawl, gtmetrix }) {
  const hasGt = !!(gtmetrix && (gtmetrix.performanceScore != null || gtmetrix.structureScore != null));

  const weights = hasGt
    ? { psPerf: 0.25, psSeo: 0.15, psAcc: 0.10, psBp: 0.10, crawl: 0.15, gtPerf: 0.15, gtStruct: 0.10 }
    : { psPerf: 0.35, psSeo: 0.20, psAcc: 0.15, psBp: 0.15, crawl: 0.15 };

  const psPerf = clamp100(pageSpeed?.score);
  const psSeo  = clamp100(pageSpeed?.seoScore);
  const psAcc  = clamp100(pageSpeed?.accessScore);
  const psBp   = clamp100(pageSpeed?.bestPractices);
  const crawlScore = computeCrawlScore(crawl);

  let total = 0;
  total += psPerf     * weights.psPerf;
  total += psSeo      * weights.psSeo;
  total += psAcc      * weights.psAcc;
  total += psBp       * weights.psBp;
  total += crawlScore * weights.crawl;
  if (hasGt) {
    total += clamp100(gtmetrix.performanceScore) * weights.gtPerf;
    total += clamp100(gtmetrix.structureScore)   * weights.gtStruct;
  }

  return Math.round(total);
}

/**
 * Returns a list of concrete issues found in the audit, tagged by severity.
 * Drives the "Critical Issues" panel — surfaces actual problems instead of
 * showing passing checkmarks when the site has real gaps.
 */
export function extractCriticalIssues({ pageSpeed, crawl, gtmetrix }) {
  const issues = [];

  // ── Critical severity ────────────────────────────────────────────────
  if (pageSpeed?.score != null && pageSpeed.score < 50) {
    issues.push({
      severity: 'critical',
      label:    'Page performance is critically slow',
      detail:   `PageSpeed score of ${pageSpeed.score}/100 means most visitors will bounce before your page loads. AI tools de-prioritize slow sites.`,
    });
  }
  if (pageSpeed?.issues?.notMobileFriendly) {
    issues.push({
      severity: 'critical',
      label:    'Site is not mobile-friendly',
      detail:   'Over 60% of searches happen on mobile. AI tools heavily weight mobile usability. This is a blocking issue.',
    });
  }
  if (isSlowLcp(pageSpeed?.metrics?.lcp) || isSlowLcp(gtmetrix?.lcp)) {
    issues.push({
      severity: 'critical',
      label:    'Largest Contentful Paint is too slow',
      detail:   'Main content takes over 4 seconds to render. Google and AI tools treat this as a fundamental quality signal.',
    });
  }
  if (isHighCls(pageSpeed?.metrics?.cls) || isHighCls(gtmetrix?.cls)) {
    issues.push({
      severity: 'critical',
      label:    'Page layout shifts heavily during load',
      detail:   'Cumulative Layout Shift above 0.25 creates a jarring user experience and hurts conversion.',
    });
  }

  // ── High severity ────────────────────────────────────────────────────
  if (crawl && !crawl.hasSchema) {
    issues.push({
      severity: 'high',
      label:    'No schema markup detected',
      detail:   'Structured data is one of the strongest AI discoverability signals. Without it, ChatGPT and Perplexity struggle to cite your business accurately.',
    });
  }
  if (crawl && !crawl.hasH1) {
    issues.push({
      severity: 'high',
      label:    'Missing H1 heading',
      detail:   'H1 tags signal the primary topic of a page. Without one, crawlers and AI tools have to guess what the page is about.',
    });
  }
  if (pageSpeed?.issues?.httpLinks) {
    issues.push({
      severity: 'high',
      label:    'Non-HTTPS links found',
      detail:   'Mixed content on a secure site causes trust warnings and can suppress indexing.',
    });
  }

  // ── Medium severity ──────────────────────────────────────────────────
  if (crawl && !crawl.hasMetaDesc) {
    issues.push({
      severity: 'medium',
      label:    'Missing meta description',
      detail:   'Meta descriptions are one of the first things AI tools read to understand a page.',
    });
  }
  if (crawl && !crawl.hasCanonical) {
    issues.push({
      severity: 'medium',
      label:    'No canonical tag',
      detail:   'Canonical tags prevent duplicate content issues that confuse crawlers.',
    });
  }
  if (crawl && !crawl.hasOGTitle) {
    issues.push({
      severity: 'medium',
      label:    'Missing Open Graph tags',
      detail:   'OG tags control how your page appears when shared and cited across platforms.',
    });
  }
  if (crawl?.imageCount > 0 && crawl?.imagesWithAlt < crawl?.imageCount) {
    const missing = crawl.imageCount - crawl.imagesWithAlt;
    issues.push({
      severity: 'medium',
      label:    `${missing} ${missing === 1 ? 'image is' : 'images are'} missing alt text`,
      detail:   'Alt text helps AI tools understand your images and improves accessibility scoring.',
    });
  }
  if (pageSpeed?.issues?.missingAltTags && !(crawl?.imageCount > 0 && crawl?.imagesWithAlt < crawl?.imageCount)) {
    // Fallback if PageSpeed flagged alt tags but crawl didn't detect
    issues.push({
      severity: 'medium',
      label:    'Images missing alt tags (PageSpeed)',
      detail:   'Alt text helps AI tools understand your images and improves accessibility scoring.',
    });
  }

  // Order by severity: critical > high > medium
  const sevOrder = { critical: 0, high: 1, medium: 2 };
  return issues.sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity]);
}

// ── Internal helpers ─────────────────────────────────────────────────────

function clamp100(v) {
  if (v == null) return 0;
  const n = typeof v === 'number' ? v : parseFloat(v);
  if (isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

// Crawl data is a set of booleans — convert to a 0–100 score
function computeCrawlScore(crawl) {
  if (!crawl) return 0;
  const signals = [
    crawl.hasTitle,
    crawl.hasMetaDesc,
    crawl.hasH1,
    crawl.hasOGTitle,
    crawl.hasOGDesc,
    crawl.hasSchema,
    crawl.hasCanonical,
    crawl.hasViewport,
  ];
  const defined = signals.filter((s) => s !== undefined && s !== null);
  if (defined.length === 0) return 0;
  const passing = defined.filter(Boolean).length;
  return Math.round((passing / defined.length) * 100);
}

// LCP display values come as strings like "2.3 s" or "1.8 s" from PageSpeed
function isSlowLcp(lcp) {
  if (lcp == null) return false;
  const match = String(lcp).match(/([\d.]+)\s*s/i);
  if (!match) return false;
  return parseFloat(match[1]) > 4.0;
}

// CLS can be string "0.15" or number
function isHighCls(cls) {
  if (cls == null) return false;
  const n = typeof cls === 'number' ? cls : parseFloat(String(cls).match(/[\d.]+/)?.[0] ?? '0');
  return n > 0.25;
}
