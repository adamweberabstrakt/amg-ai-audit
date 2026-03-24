'use client';

// Tab 1: AI Visibility Score
// Displays the Claude-generated score, breakdown, and visibility summary.

export default function AIVisibilityTab({ auditData }) {
  const claude = auditData?.claude ?? {};
  const breakdown = claude.scoreBreakdown ?? {};

  const breakdownItems = [
    { label: 'Content Authority',  key: 'contentAuthority',  tip: 'How well your site content signals expertise and relevance to AI crawlers.' },
    { label: 'Structured Data',    key: 'structuredData',    tip: 'Schema markup, OG tags, and canonical signals that help AI understand your pages.' },
    { label: 'Brand Signals',      key: 'brandSignals',      tip: 'How recognizable and consistent your brand is across the web.' },
    { label: 'Local Presence',     key: 'localPresence',     tip: 'Google Business Profile completeness, reviews, and local citation quality.' },
  ];

  return (
    <div className="space-y-8">
      {/* What This Means callout */}
      <div className="card border-l-4 border-brand-orange">
        <p className="section-label mb-2">Why This Matters</p>
        <p className="text-gray-300 text-sm leading-relaxed">
          AI tools like ChatGPT, Perplexity, and Google AI Overview decide which businesses to recommend based on
          how well-established and authoritative a brand appears across the web. A low score means buyers asking
          AI for recommendations in your space likely won't hear your name.
        </p>
      </div>

      {/* Score breakdown */}
      <div>
        <h3 className="font-heading text-xl font-semibold mb-5">Score Breakdown</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {breakdownItems.map((item) => {
            const val = breakdown[item.key] ?? 0;
            return (
              <div key={item.key} className="card">
                <div className="flex justify-between items-start mb-3">
                  <span className="font-medium text-sm">{item.label}</span>
                  <span className={`font-heading text-xl font-bold ${scoreColor(val)}`}>{val}</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${val}%`, backgroundColor: scoreHex(val) }}
                  />
                </div>
                <p className="text-xs text-gray-500">{item.tip}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations preview */}
      {claude.topRecommendations?.length > 0 && (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-4">Top Recommendations</h3>
          <div className="space-y-3">
            {claude.topRecommendations.map((rec, i) => (
              <div key={i} className="card flex gap-4">
                <span className="text-brand-orange font-heading text-2xl font-bold flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-gray-300 text-sm leading-relaxed pt-1">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function scoreColor(val) {
  if (val >= 70) return 'text-green-400';
  if (val >= 40) return 'text-yellow-400';
  return 'text-red-400';
}

function scoreHex(val) {
  if (val >= 70) return '#22c55e';
  if (val >= 40) return '#f59e0b';
  return '#ef4444';
}
