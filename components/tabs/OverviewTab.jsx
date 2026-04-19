'use client';

import SectionHeader from '@/components/SectionHeader';
import { computeCompetitivePositions } from '@/lib/competitiveScore';

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

  const hasCompetitors = semrush?.competitor1 || semrush?.competitor2 || (semrush?.competitors?.length > 0);

  return (
    <div className="space-y-8">

      {/* Tab identity */}
      <SectionHeader />

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
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/></svg>}
            description="Likelihood AI tools recommend your brand"
          />
          <CategoryCard
            label="Site Performance"
            score={siteScore}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>}
            description="PageSpeed & technical health"
          />
          <CategoryCard
            label="Local Presence"
            score={gbpRating !== null ? Math.round((gbpRating / 5) * 100) : null}
            rawLabel={gbpRating !== null ? gbpRating + '\u2605 \u00b7 ' + gbpCount + ' reviews' : 'Not Found'}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>}
            description="Google Business Profile strength"
          />
          <CategoryCard
            label="Brand Signals"
            score={brandScore}
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-400"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>}
            description="Brand authority across the web"
          />
        </div>
      </div>

      {/* Competitor comparison — Competitive Position Scoreboard + detail panels */}
      {(hasCompetitors || (semrush?.competitors?.length > 0)) && (
        <div className="space-y-6">
          <h3 className="font-heading text-xl font-semibold mb-5">Competitive Intelligence</h3>

          {/* Scoreboard: one row per competitor with ahead/even/behind verdict */}
          <CompetitivePositionScoreboard
            clientStats={semrush?.clientStats}
            competitors={semrush?.competitors || []}
            company={company}
          />

          {/* Domain Authority comparison bars */}
          <DomainAuthorityCompare
            clientStats={semrush?.clientStats}
            competitors={semrush?.competitors || []}
            company={company}
          />

          {/* Backlink gaps */}
          {semrush?.backlinksGaps?.length > 0 && (
            <BacklinkGapsPanel gaps={semrush.backlinksGaps} />
          )}

          {/* Keyword comparison grid */}
          <KeywordComparisonGrid
            clientStats={semrush?.clientStats}
            competitors={semrush?.competitors || []}
            company={company}
          />
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
        <span className="flex-shrink-0">{icon}</span>
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
      <div className="overflow-x-auto">
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
    </div>
  );
}

function UrgencyBadge({ urgency }) {
  const map = {
    high:   { label: 'High Priority — Competitors are pulling ahead now',    cls: 'bg-red-900/50 text-red-300', dotColor: '#ef4444' },
    medium: { label: 'Medium Priority — Gaps exist but still closeable',     cls: 'bg-yellow-900/50 text-yellow-300', dotColor: '#f59e0b' },
    low:    { label: 'Low Priority — Strong foundation, optimize from here', cls: 'bg-green-900/50 text-green-300', dotColor: '#22c55e' },
  };
  const { label, cls, dotColor } = map[urgency] ?? map.medium;
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-medium ${cls}`}>
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }}></span>
      {label}
    </span>
  );
}

// ─── Domain Authority Comparison (horizontal bars) ───────────────────────────
function DomainAuthorityCompare({ clientStats, competitors, company }) {
  if (!clientStats && (!competitors || competitors.length === 0)) return null;

  const domains = [];

  // Add client domain
  if (clientStats) {
    domains.push({
      name: company,
      domain: clientStats.domain || company,
      authorityScore: clientStats.authorityScore || 0,
      isClient: true,
      hasData: true,
    });
  }

  // Add competitor domains — include ones without stats so the user sees them
  competitors?.forEach(comp => {
    if (comp.data?.stats) {
      domains.push({
        name: comp.domain,
        domain: comp.domain,
        authorityScore: comp.data.stats.authorityScore || 0,
        isClient: false,
        hasData: true,
      });
    } else {
      domains.push({
        name: comp.domain,
        domain: comp.domain,
        authorityScore: 0,
        isClient: false,
        hasData: false,
      });
    }
  });

  if (domains.length === 0) return null;

  const maxScore = Math.max(...domains.filter(d => d.hasData).map(d => d.authorityScore), 100);

  return (
    <div className="card">
      <p className="section-label mb-3">Domain Authority Comparison</p>
      <div className="space-y-3">
        {domains.map((domain, index) => {
          if (!domain.hasData) {
            return (
              <div key={index} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-b-0">
                <span className="text-gray-300">{domain.name}</span>
                <span className="text-xs text-gray-500 italic">No SEMRush data available</span>
              </div>
            );
          }
          const percentage = maxScore > 0 ? (domain.authorityScore / maxScore) * 100 : 0;
          const isBehind = domain.isClient && domains.some(d => !d.isClient && d.hasData && d.authorityScore > domain.authorityScore);
          const isLeading = domain.isClient && domains.some(d => !d.isClient && d.hasData && d.authorityScore < domain.authorityScore);

          return (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className={`font-medium ${domain.isClient ? 'text-white' : 'text-gray-300'}`}>
                  {domain.name} {domain.isClient && '(You)'}
                </span>
                <span className={`font-heading font-bold ${
                  domain.authorityScore >= 70 ? 'text-green-400'
                  : domain.authorityScore >= 40 ? 'text-yellow-400'
                  : 'text-red-400'
                }`}>
                  {domain.authorityScore}
                </span>
              </div>
              <div className="relative">
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      domain.isClient
                        ? isLeading ? 'bg-green-500' : isBehind ? 'bg-red-500' : 'bg-brand-orange'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                {domain.isClient && isBehind && (
                  <div className="absolute -top-1 -right-1 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded">
                    Behind by {Math.max(...domains.filter(d => !d.isClient && d.hasData).map(d => d.authorityScore)) - domain.authorityScore}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Backlink Gaps Panel ──────────────────────────────────────────────────────
function BacklinkGapsPanel({ gaps }) {
  const topGaps = gaps.filter(gap => gap.gapDomains?.length > 0).slice(0, 3);
  
  if (topGaps.length === 0) return null;
  
  return (
    <div className="card">
      <p className="section-label mb-2">High-Authority PR & Outreach Opportunities</p>
      <p className="text-xs text-gray-400 mb-4">
        Domains that link to your competitors but not to you — sorted by domain authority.
      </p>
      <div className="grid md:grid-cols-3 gap-4">
        {topGaps.map((gap, index) => (
          <div key={index} className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300">{gap.competitorDomain}</h4>
            <div className="space-y-1">
              {gap.gapDomains.slice(0, 3).map((domain, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-gray-300 truncate">{domain.domain}</span>
                  <span className="text-brand-orange font-medium ml-2">DA {domain.authorityScore}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Keyword Comparison Grid ──────────────────────────────────────────────────
function KeywordComparisonGrid({ clientStats, competitors, company }) {
  const domains = [];

  // Add client (if has keywords - need to fetch separately)
  if (clientStats) {
    domains.push({
      name: company,
      domain: clientStats.domain || company,
      keywords: [], // Client keywords would need separate API call
      isClient: true,
    });
  }

  // Add competitors with keywords
  competitors?.forEach(comp => {
    if (comp.data?.keywords?.length > 0) {
      domains.push({
        name: comp.domain,
        domain: comp.domain,
        keywords: comp.data.keywords,
        isClient: false,
      });
    }
  });

  const hasAny = domains.filter(d => d.keywords.length > 0).length > 0;

  // If no competitors have keyword data, don't render — the empty-state note
  // in the Scoreboard already explains why
  if (!hasAny) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="section-label">Top Commercial Keywords by Volume</p>
        <span className="text-xs text-gray-400">Sorted by search volume (highest first)</span>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.filter(d => d.keywords.length > 0).map((domain, index) => (
          <KeywordTable key={index} domain={domain.domain} keywords={domain.keywords} />
        ))}
      </div>
    </div>
  );
}

// ─── Competitive Position Scoreboard ──────────────────────────────────────────
// One row per competitor with a rolled-up ahead/even/behind verdict.
// Powered by lib/competitiveScore.js.
function CompetitivePositionScoreboard({ clientStats, competitors, company }) {
  if (!competitors || competitors.length === 0) return null;

  const positions = computeCompetitivePositions({ clientStats, competitors, company });
  if (positions.length === 0) return null;

  return (
    <div className="card">
      <p className="section-label mb-1">Competitive Position Score</p>
      <p className="text-xs text-gray-400 mb-4">
        Rolled up from domain authority, organic keywords, and traffic relative to each competitor.
      </p>
      <div className="space-y-2">
        {positions.map((pos, i) => (
          <PositionRow key={i} position={pos} />
        ))}
      </div>
    </div>
  );
}

function PositionRow({ position }) {
  // Empty-data states — make the "why" visible to the user
  if (position.verdict === 'no-data' || position.verdict === 'no-client-data') {
    return (
      <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-b-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2 h-2 rounded-full bg-gray-500 flex-shrink-0" />
          <span className="text-sm text-gray-300 truncate">{position.domain}</span>
        </div>
        <span className="text-xs text-gray-500 italic ml-3 text-right">{position.message}</span>
      </div>
    );
  }

  const verdictMap = {
    ahead:  { label: "You're ahead",   cls: 'bg-green-500/20 text-green-300',  dot: '#22c55e', scoreColor: 'text-green-400' },
    even:   { label: 'Roughly even',   cls: 'bg-yellow-500/20 text-yellow-300', dot: '#eab308', scoreColor: 'text-yellow-400' },
    behind: { label: "They're ahead",  cls: 'bg-red-500/20 text-red-300',       dot: '#ef4444', scoreColor: 'text-red-400' },
  };
  const v = verdictMap[position.verdict] ?? verdictMap.even;

  return (
    <div className="py-3 border-b border-white/5 last:border-b-0">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: v.dot }} />
          <span className="text-sm font-medium text-white truncate">{position.domain}</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded uppercase tracking-wide font-heading ${v.cls}`}>
            {v.label}
          </span>
          <span className={`font-heading text-2xl font-bold leading-none ${v.scoreColor}`}>
            {position.score}
          </span>
        </div>
      </div>
      <div className="flex gap-4 text-xs text-gray-400 pl-5 flex-wrap">
        <GapStat label="DA"       clientVal={position.clientStats.authorityScore}   compVal={position.competitorStats.authorityScore}   />
        <GapStat label="Keywords" clientVal={position.clientStats.organicKeywords}  compVal={position.competitorStats.organicKeywords}  />
        <GapStat label="Traffic"  clientVal={position.clientStats.organicTraffic}   compVal={position.competitorStats.organicTraffic}   />
      </div>
    </div>
  );
}

function GapStat({ label, clientVal, compVal }) {
  const diff = (compVal || 0) - (clientVal || 0);
  const tone = diff > 0 ? 'text-red-400' : diff < 0 ? 'text-green-400' : 'text-gray-500';
  const sign = diff > 0 ? '+' : '';
  return (
    <span>
      <span className="text-gray-500">{label}:</span>{' '}
      <span className="text-gray-300">{(compVal || 0).toLocaleString()}</span>{' '}
      <span className={tone}>({sign}{diff.toLocaleString()})</span>
    </span>
  );
}
