// app/api/providers/pagespeed.js
// Calls Google PageSpeed Insights API and returns structured performance data.

export async function runPageSpeed(url) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed`;

  // URLSearchParams object required — plain object drops duplicate keys
  const params = new URLSearchParams();
  params.append('url',      url);
  params.append('key',      apiKey);
  params.append('strategy', 'mobile');
  params.append('category', 'performance');
  params.append('category', 'accessibility');
  params.append('category', 'best-practices');
  params.append('category', 'seo');

  const res = await fetch(`${endpoint}?${params}`);
  if (!res.ok) throw new Error(`PageSpeed API error: ${res.status}`);

  const data = await res.json();
  const cats  = data.lighthouseResult?.categories ?? {};
  const audits = data.lighthouseResult?.audits ?? {};

  return {
    score:          Math.round((cats.performance?.score ?? 0) * 100),
    seoScore:       Math.round((cats.seo?.score ?? 0) * 100),
    accessScore:    Math.round((cats.accessibility?.score ?? 0) * 100),
    bestPractices:  Math.round((cats['best-practices']?.score ?? 0) * 100),
    metrics: {
      lcp:  audits['largest-contentful-paint']?.displayValue  ?? 'N/A',
      fid:  audits['total-blocking-time']?.displayValue       ?? 'N/A',
      cls:  audits['cumulative-layout-shift']?.displayValue   ?? 'N/A',
      ttfb: audits['server-response-time']?.displayValue      ?? 'N/A',
      fcp:  audits['first-contentful-paint']?.displayValue    ?? 'N/A',
      si:   audits['speed-index']?.displayValue               ?? 'N/A',
    },
    issues: {
      missingAltTags: audits['image-alt']?.score === 0,
      missingMetaDesc: audits['meta-description']?.score === 0,
      notMobileFriendly: audits['viewport']?.score === 0,
      httpLinks: audits['is-on-https']?.score === 0,
    },
  };
}
