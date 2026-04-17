'use client';

import SectionHeader from '@/components/SectionHeader';

// Tab 2: Website Health
// PageSpeed scores, Core Web Vitals, and crawl signals with educational tooltips.

export default function WebsiteHealthTab({ auditData }) {
  const ps    = auditData?.pageSpeed ?? null;
  const crawl = auditData?.crawl ?? null;

  if (!ps && !crawl) {
    return <EmptyState message="Website performance data could not be retrieved for this domain." />;
  }

  return (
    <div className="space-y-8">
      {/* Tab identity */}
      <SectionHeader />

      {/* Why This Matters */}
      <div className="card border-l-4 border-brand-orange">
        <p className="section-label mb-2">Why This Matters</p>
        <p className="text-gray-300 text-sm leading-relaxed">
          AI tools and search engines favor fast, well-structured websites. A slow or technically broken site
          sends negative signals that can suppress your visibility in both traditional search and AI-powered results.
          These are often the quickest wins available.
        </p>
      </div>

      {/* Performance scores */}
      {ps && (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-5">Performance Scores</h3>
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
            <MetricCard label="Largest Contentful Paint" value={ps.metrics.lcp} tip="How fast your main content loads. Google recommends under 2.5s." />
            <MetricCard label="Total Blocking Time"      value={ps.metrics.fid} tip="How long your page is unresponsive. Should be under 300ms." />
            <MetricCard label="Cumulative Layout Shift"  value={ps.metrics.cls} tip="How much your page jumps around as it loads. Should be under 0.1." />
            <MetricCard label="First Contentful Paint"   value={ps.metrics.fcp} tip="When the first piece of content appears. Should be under 1.8s." />
            <MetricCard label="Speed Index"              value={ps.metrics.si}  tip="How quickly content is visually populated. Under 3.4s is good." />
            <MetricCard label="Server Response Time"     value={ps.metrics.ttfb} tip="How fast your server responds. Should be under 600ms." />
          </div>
        </div>
      )}

      {/* Technical issues */}
      {ps?.issues && (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-5">Technical Issues Found</h3>
          <div className="space-y-3">
            <IssueRow
              label="Missing image alt tags"
              failed={ps.issues.missingAltTags}
              tip="Alt tags help AI and search engines understand your images. Missing alt tags are a common AI discoverability gap."
            />
            <IssueRow
              label="Missing meta description"
              failed={ps.issues.missingMetaDesc}
              tip="Meta descriptions are one of the first things AI tools read to understand what a page is about."
            />
            <IssueRow
              label="Mobile viewport not configured"
              failed={ps.issues.notMobileFriendly}
              tip="Over 60% of searches happen on mobile. AI tools heavily weight mobile-friendliness."
            />
            <IssueRow
              label="Non-HTTPS links found"
              failed={ps.issues.httpLinks}
              tip="Mixed content (HTTP links on an HTTPS site) can cause trust and indexing issues."
            />
          </div>
        </div>
      )}

      {/* Crawl signals */}
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

// ─── Sub-components ───────────────────────────────────────────────────────────
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

function IssueRow({ label, failed, tip }) {
  return (
    <div className={`card flex gap-4 items-start ${failed ? 'border-red-900/50' : 'border-green-900/30'}`}>
      <span className={`text-lg flex-shrink-0 ${failed ? 'text-red-400' : 'text-green-400'}`}>
        {failed ? '✗' : '✓'}
      </span>
      <div>
        <p className={`text-sm font-medium ${failed ? 'text-red-300' : 'text-green-300'}`}>{label}</p>
        <p className="text-xs text-gray-500 mt-1">{tip}</p>
      </div>
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
