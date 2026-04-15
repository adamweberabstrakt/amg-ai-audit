'use client';

// Tab 0: Overview
// Executive dashboard — one glance shows the full picture.

export default function OverviewTab({ auditData, onBook }) {
  const claude   = auditData?.claude    ?? {};
  const ps       = auditData?.pageSpeed ?? {};
  const places   = auditData?.places    ?? {};
  const semrush  = auditData?.semrush   ?? null;
  const company  = auditData?.meta?.company ?? 'Your Business';

  const aiScore    = claude.aiVisibilityScore             ?? 0;
  const siteScore  = ps.score                             ?? null;
  const gbpRating  = places.found ? places.rating         : null;
  const gbpCount   = places.found ? (places.reviewCount ?? 0) : 0;
  const brandScore = claude.scoreBreakdown?.brandSignals  ?? null;
  const urgency    = claude.urgencyLevel ?? 'medium';

  const hasCompetitors = semrush?.competitor1 || semrush?.competitor2;

  return (
    <div className="space-y-8">

      {/* Summary narrative */}
      {claude.visibilitySummary && (
        <div className="card border-l-4 border-brand-orange">
          <p className="section-label mb-2">Executive Summary</p>
          <p className="text-gray-300 text-sm leading-relaxed">{claude.visibilitySummary}</p>
          <div className="mt-3">
            <UrgencyBadge urgency={urgency} />
          </div>
        </div>
      )}

      {/* 4 Category score cards */}
      <div>
        <h3 className="font-heading text-xl font-semibold mb-5">Performance Across All Dimensions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <CategoryCard
            label="AI Visibility"
            score={aiScore}
            icon="🤖"
            description="Likelihood AI tools recommend your brand"
          />
          <CategoryCard
            label="Site Performance"
            score={siteScore}
            icon="⚡"
            description="PageSpeed & technical health"
          />
          <CategoryCard
            label="Local Presence"
            score={gbpRating !== null ? Math.round((gbpRating / 5) * 100) : null}
            rawLabel={gbpRating !== null ? gbpRating + '\u2605 \u00b7 ' + gbpCount + ' reviews' : 'Not Found'}
            icon="📍"
            description="Google Business Profile strength"
          />
          <CategoryCard
            label="Brand Signals"
            score={brandScore}
            icon="🎯"
            description="Brand authority across the web"
          />
        </div>
      </div>

      {/* Competitor comparison */}
      {hasCompetitors && (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-5">Competitor Comparison</h3>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 pr-6 text-gray-400 font-medium">Domain</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Authority</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Est. Monthly Traffic</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Ranking Keywords</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {semrush.clientStats && (
                  <DomainRow
                    domain={semrush.clientStats.domain ?? company}
                    stats={semrush.clientStats}
                    isClient
                  />
                )}
                {semrush.competitor1?.stats && (
                  <DomainRow domain={semrush.competitor1.domain} stats={semrush.competitor1.stats} />
                )}
                {semrush.competitor2?.stats && (
                  <DomainRow domain={semrush.competitor2.domain} stats={semrush.competitor2.stats} />
                )}
              </tbody>
            </table>
          </div>

          {/* Keyword tables */}
          {(semrush.competitor1?.keywords?.length > 0 || semrush.competitor2?.keywords?.length > 0) && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {[semrush.competitor1, semrush.competitor2].filter(Boolean).map((comp) =>
                comp.keywords?.length > 0 ? (
                  <KeywordTable key={comp.domain} domain={comp.domain} keywords={comp.keywords} />
                ) : null
              )}
            </div>
          )}
        </div>
      )}

      {/* Top recommendations */}
      {claude.topRecommendations?.length > 0 && (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-4">Your Top Priority Actions</h3>
          <div className="space-y-3">
            {claude.topRecommendations.map((rec, i) => (
              <div key={i} className="card flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-brand-orange/10 border border-brand-orange flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="font-heading text-brand-orange font-bold text-sm">{i + 1}</span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed pt-1">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="card bg-brand-orange/10 border-brand-orange text-center py-8">
        <h3 className="font-heading text-2xl font-bold mb-2">
          Want us to close these gaps for you?
        </h3>
        <p className="text-gray-300 text-sm mb-6 max-w-md mx-auto">
          Book a free 30-minute call. We will walk through your competitor gaps and hand you a concrete action plan.
        </p>
        <button onClick={onBook} className="btn-primary">
          Book My Free Strategy Call →
        </button>
      </div>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryCard({ label, score, rawLabel, icon, description }) {
  const display  = rawLabel ?? (score !== null ? score : '—');
  const color    = score === null ? 'text-gray-400'
    : score >= 70 ? 'text-green-400'
    : score >= 40 ? 'text-yellow-400'
    : 'text-red-400';
  const barColor = score === null ? '#6b7280'
    : score >= 70 ? '#22c55e'
    : score >= 40 ? '#f59e0b'
    : '#ef4444';

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className={`font-heading text-2xl font-bold ${color}`}>{display}</span>
      </div>
      <div>
        <p className="font-heading font-semibold text-sm text-white">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </div>
      {score !== null && (
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: score + '%', backgroundColor: barColor }}
          />
        </div>
      )}
    </div>
  );
}

function DomainRow({ domain, stats, isClient }) {
  return (
    <tr className={isClient ? 'bg-brand-orange/5' : ''}>
      <td className="py-3 pr-6">
        <span className="font-medium text-white">{domain}</span>
        {isClient && (
          <span className="ml-2 text-xs bg-brand-orange/20 text-brand-orange px-2 py-0.5 rounded-full">You</span>
        )}
      </td>
      <td className="text-right py-3 px-4">
        <AuthorityBadge score={stats.authorityScore} />
      </td>
      <td className="text-right py-3 px-4 text-gray-300">
        {stats.organicTraffic > 0 ? stats.organicTraffic.toLocaleString() : '—'}
      </td>
      <td className="text-right py-3 px-4 text-gray-300">
        {stats.organicKeywords > 0 ? stats.organicKeywords.toLocaleString() : '—'}
      </td>
    </tr>
  );
}

function AuthorityBadge({ score }) {
  const color = score >= 60 ? 'text-green-400' : score >= 30 ? 'text-yellow-400' : 'text-red-400';
  return <span className={`font-heading font-bold ${color}`}>{score || '—'}</span>;
}

function KeywordTable({ domain, keywords }) {
  return (
    <div className="card">
      <p className="text-xs text-gray-500 uppercase tracking-widest font-heading mb-3">
        {domain} — Top Transactional Keywords
      </p>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-2 text-gray-500 font-medium">Keyword</th>
            <th className="text-right py-2 text-gray-500 font-medium">Pos</th>
            <th className="text-right py-2 text-gray-500 font-medium">Vol/mo</th>
            <th className="text-right py-2 text-gray-500 font-medium">CPC</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {keywords.map((kw, i) => (
            <tr key={i}>
              <td className="py-2 pr-2 text-gray-300 max-w-[160px] truncate" title={kw.keyword}>
                {kw.keyword}
              </td>
              <td className="text-right py-2 px-2">
                <span className={`font-heading font-semibold ${kw.position <= 5 ? 'text-green-400' : kw.position <= 20 ? 'text-yellow-400' : 'text-gray-400'}`}>
                  #{kw.position}
                </span>
              </td>
              <td className="text-right py-2 px-2 text-gray-400">
                {kw.volume > 0 ? kw.volume.toLocaleString() : '—'}
              </td>
              <td className="text-right py-2 text-gray-400">
                ${kw.cpc.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UrgencyBadge({ urgency }) {
  const map = {
    high:   { label: '🔴 High Priority — Competitors are pulling ahead now',    cls: 'bg-red-900/50 text-red-300' },
    medium: { label: '🟡 Medium Priority — Gaps exist but still closeable',     cls: 'bg-yellow-900/50 text-yellow-300' },
    low:    { label: '🟢 Low Priority — Strong foundation, optimize from here', cls: 'bg-green-900/50 text-green-300' },
  };
  const { label, cls } = map[urgency] ?? map.medium;
  return <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${cls}`}>{label}</span>;
}
