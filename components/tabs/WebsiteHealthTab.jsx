'use client';

import SectionHeader from '@/components/SectionHeader';
import { computeHealthScore, extractCriticalIssues } from '@/lib/healthScore';

// Tab 2: Website Health
// Composite health score + critical issues panel + PageSpeed + crawl signals.

export default function WebsiteHealthTab({ auditData, healthScore }) {
  const ps       = auditData?.pageSpeed ?? null;
  const crawl    = auditData?.crawl     ?? null;

  if (!ps && !crawl) {
    return <EmptyState message="Website performance data could not be retrieved for this domain." />;
  }

  const score       = healthScore ?? computeHealthScore({ pageSpeed: ps, crawl, gtmetrix: null });
  const issues      = extractCriticalIssues({ pageSpeed: ps, crawl, gtmetrix: null });
  const criticalCount = issues.filter((i) => i.severity === 'critical').length;
  const highCount     = issues.filter((i) => i.severity === 'high').length;

  // Top 2 performance recommendations derived from actual data
  const perfRecs = buildPerfRecs({ pageSpeed: ps, crawl });

  return (
    <div className="space-y-8">
      {/* Tab identity */}
      <SectionHeader />

      {/* Composite Health Score + verdict */}
      <HealthScoreHero score={score} criticalCount={criticalCount} highCount={highCount} />

      {/* Why This Matters */}
      <div className="card border-l-4 border-brand-orange">
        <p className="section-label mb-2">Why This Matters</p>
        <p className="text-gray-300 text-sm leading-relaxed">
          AI tools and search engines favor fast, well-structured websites. A slow or technically broken site
          sends negative signals that can suppress your visibility in both traditional search and AI-powered results.
          These are often the quickest wins available.
        </p>
      </div>

      {/* Top 2 Performance Recommendations */}
      {perfRecs.length > 0 && (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-4">Top Performance Fixes</h3>
          <div className="space-y-3">
            {perfRecs.map((rec, i) => (
              <div key={i} className="card flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-brand-orange/10 border border-brand-orange flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="font-heading text-brand-orange font-bold text-sm">{i + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-white text-sm mb-1">{rec.title}</p>
                  <p className="text-xs text-gray-400 leading-relaxed">{rec.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Issues Panel */}
      {issues.length > 0 ? (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-4">
            Issues Found ({issues.length})
          </h3>
          <div className="space-y-3">
            {issues.map((issue, i) => (
              <IssueCard key={i} {...issue} />
            ))}
          </div>
        </div>
      ) : (
        <div className="card border-l-4 border-green-500/60 bg-green-950/20">
          <p className="section-label mb-2 text-green-400">Foundation Is Solid</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            No critical or high-severity issues detected. Focus on growth signals — content authority,
            structured data depth, and brand mentions across the web.
          </p>
        </div>
      )}

      {/* PageSpeed scores */}
      {ps && (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-5">PageSpeed Insights (Mobile)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ScoreCard label="Performance"    value={ps.score}         />
            <ScoreCard label="SEO"            value={ps.seoScore}      />
            <ScoreCard label="Accessibility"  value={ps.accessScore}   />
            <ScoreCard label="Best Practices" value={ps.bestPractices} />
          </div>
        </div>
      )}

      {/* Core Web Vitals */}
      {ps?.metrics && (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-5">Core Web Vitals</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <MetricCard label="Largest Contentful Paint" value={ps.metrics.lcp}  tip="How fast your main content loads. Google recommends under 2.5s." />
            <MetricCard label="Total Blocking Time"      value={ps.metrics.fid}  tip="How long your page is unresponsive. Should be under 300ms." />
            <MetricCard label="Cumulative Layout Shift"  value={ps.metrics.cls}  tip="How much your page jumps around as it loads. Should be under 0.1." />
            <MetricCard label="First Contentful Paint"   value={ps.metrics.fcp}  tip="When the first piece of content appears. Should be under 1.8s." />
            <MetricCard label="Speed Index"              value={ps.metrics.si}   tip="How quickly content is visually populated. Under 3.4s is good." />
            <MetricCard label="Server Response Time"     value={ps.metrics.ttfb} tip="How fast your server responds. Should be under 600ms." />
          </div>
        </div>
      )}

      {/* On-page signals */}
      {crawl && (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-5">On-Page Signals</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <SignalRow label="Page Title"         present={crawl.hasTitle}     tip="Every page needs a unique, descriptive title." />
            <SignalRow label="Meta Description"   present={crawl.hasMetaDesc}  tip="Helps AI and search engines summarize your page." />
            <SignalRow label="H1 Heading"         present={crawl.hasH1}        tip="H1 tags signal the primary topic of a page to crawlers." />
            <SignalRow label="Open Graph Tags"    present={crawl.hasOGTitle}   tip="OG tags control how your page appears when shared and cited." />
            <SignalRow label="Schema Markup"      present={crawl.hasSchema}    tip="Structured data is one of the strongest AI discoverability signals." />
            <SignalRow label="Canonical Tag"      present={crawl.hasCanonical} tip="Prevents duplicate content issues that confuse crawlers." />
            {crawl.imageCount > 0 && (
              <SignalRow
                label={`Image Alt Text (${crawl.imagesWithAlt}/${crawl.imageCount} images)`}
                present={crawl.imagesWithAlt === crawl.imageCount}
                tip="All images should have descriptive alt text for accessibility and AI comprehension."
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Performance recommendation builder ──────────────────────────────────────
// Derives the top 2 most actionable recommendations from actual audit data.
function buildPerfRecs({ pageSpeed, crawl }) {
  const recs = [];

  const psScore = pageSpeed?.score ?? null;
  const lcp     = pageSpeed?.metrics?.lcp;
  const ttfb    = pageSpeed?.metrics?.ttfb;
  const cls     = pageSpeed?.metrics?.cls;

  // Site load speed — biggest impact
  if (psScore !== null && psScore < 70) {
    const lcpNote  = lcp  ? ` Your largest content paints at ${lcp}, which exceeds the 2.5s target.` : '';
    const ttfbNote = ttfb ? ` Server response is ${ttfb} — consider upgrading hosting or enabling a CDN.` : '';
    recs.push({
      title: 'Improve Page Load Speed',
      detail: `Your PageSpeed score of ${psScore}/100 is below the threshold AI tools and Google use to rank sites.${lcpNote}${ttfbNote} Compress images, enable caching, and minimize render-blocking scripts.`,
    });
  }

  // Layout stability
  const clsNum = cls ? parseFloat(String(cls).match(/[\d.]+/)?.[0] ?? '0') : 0;
  if (clsNum > 0.1) {
    recs.push({
      title: 'Fix Layout Shift (CLS)',
      detail: `Cumulative Layout Shift of ${cls} means your page visually jumps as it loads. This frustrates visitors and signals poor quality to AI crawlers. Set explicit width/height on images and avoid inserting content above the fold after load.`,
    });
  }

  // Schema missing — high AI impact
  if (crawl && !crawl.hasSchema && recs.length < 2) {
    recs.push({
      title: 'Add Schema Markup',
      detail: 'Your site has no structured data (schema.org markup). This is one of the strongest signals for AI discoverability. Add LocalBusiness, Organization, and FAQ schema to your key pages to help AI tools understand and cite your business.',
    });
  }

  // Meta description missing
  if (crawl && !crawl.hasMetaDesc && recs.length < 2) {
    recs.push({
      title: 'Write Meta Descriptions',
      detail: 'Missing meta descriptions reduce click-through rates and give AI tools less context when summarizing your pages. Add a unique, keyword-rich description (150–160 characters) to every key page.',
    });
  }

  return recs.slice(0, 2);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HealthScoreHero({ score, criticalCount, highCount }) {
  const color     = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  const verdict   = score >= 80 ? 'Strong'  : score >= 60 ? 'Needs Attention' : 'Critical Gaps';
  const tone      = score >= 80 ? 'text-green-300' : score >= 60 ? 'text-yellow-300' : 'text-red-300';

  const summary = criticalCount > 0
    ? `${criticalCount} critical ${criticalCount === 1 ? 'issue' : 'issues'} blocking AI discoverability${highCount > 0 ? ` · ${highCount} high-priority gap${highCount === 1 ? '' : 's'}` : ''}`
    : highCount > 0
      ? `${highCount} high-priority ${highCount === 1 ? 'gap' : 'gaps'} to address`
      : 'No blocking issues detected';

  return (
    <div className="card flex flex-col sm:flex-row items-center gap-6 py-8">
      <div className="relative w-32 h-32 flex-shrink-0">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle cx="60" cy="60" r="50" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 50}
            strokeDashoffset={2 * Math.PI * 50 - (score / 100) * 2 * Math.PI * 50}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-4xl font-bold leading-none" style={{ color }}>{score}</span>
          <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">/ 100</span>
        </div>
      </div>
      <div className="text-center sm:text-left flex-1">
        <p className="section-label mb-1">Website Health Score</p>
        <h2 className={`font-heading text-2xl sm:text-3xl font-bold mb-2 ${tone}`}>{verdict}</h2>
        <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
      </div>
    </div>
  );
}

function IssueCard({ severity, label, detail }) {
  const styles = {
    critical: { border: 'border-red-500/50',    bg: 'bg-red-950/30',    chip: 'bg-red-500/20 text-red-300',       dot: '#ef4444', chipLabel: 'Critical' },
    high:     { border: 'border-red-500/50', bg: 'bg-red-950/30', chip: 'bg-red-500/20 text-red-300', dot: '#FF210F', chipLabel: 'High' },
    medium:   { border: 'border-yellow-500/50', bg: 'bg-yellow-950/30', chip: 'bg-yellow-500/20 text-yellow-300', dot: '#eab308', chipLabel: 'Medium' },
  }[severity] ?? { border: 'border-gray-500/50', bg: '', chip: 'bg-gray-500/20 text-gray-300', dot: '#6b7280', chipLabel: severity };

  return (
    <div className={`card border-l-4 ${styles.border} ${styles.bg} flex gap-4 items-start`}>
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-2" style={{ backgroundColor: styles.dot }} />
      <div className="flex-1">
        <div className="flex items-start gap-2 flex-wrap mb-1">
          <p className="font-medium text-white text-sm">{label}</p>
          <span className={`text-xs px-2 py-0.5 rounded uppercase tracking-wide font-heading ${styles.chip}`}>
            {styles.chipLabel}
          </span>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}

function ScoreCard({ label, value }) {
  const color = value >= 90 ? 'text-green-400' : value >= 50 ? 'text-yellow-400' : 'text-red-400';
  return (
    <div className="card text-center">
      <div className={`font-heading text-4xl font-bold mb-1 ${color}`}>{value ?? '—'}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}

function MetricCard({ label, value, tip }) {
  return (
    <div className="card">
      <div className="font-heading text-xl font-semibold text-white mb-1">{value}</div>
      <div className="text-sm text-gray-300 mb-2">{label}</div>
      <p className="text-xs text-gray-500">{tip}</p>
    </div>
  );
}

function SignalRow({ label, present, tip }) {
  return (
    <div className="card flex gap-3 items-start">
      <span className={`text-base flex-shrink-0 mt-0.5 ${present ? 'text-green-400' : 'text-red-400'}`}>
        {present ? '✓' : '✗'}
      </span>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{tip}</p>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="card text-center py-12">
      <p className="text-gray-400">{message}</p>
    </div>
  );
}
