'use client';

import { useEffect, useRef, useState } from 'react';
import SectionHeader from '@/components/SectionHeader';

export default function AIVisibilityTab({ auditData }) {
  const claude    = auditData?.claude    ?? {};
  const breakdown = claude.scoreBreakdown ?? {};
  const mention   = auditData?.openaiMention;  // null=loading, false=no data, obj=result
  const ref       = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimated(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const breakdownItems = [
    { label: 'Content Authority', key: 'contentAuthority', tip: 'How well your site content signals expertise and relevance to AI crawlers.' },
    { label: 'Structured Data',   key: 'structuredData',   tip: 'Schema markup, OG tags, and canonical signals that help AI understand your pages.' },
    { label: 'Brand Signals',     key: 'brandSignals',     tip: 'How recognizable and consistent your brand is across the web.' },
    { label: 'Local Presence',    key: 'localPresence',    tip: 'Google Business Profile completeness, reviews, and local citation quality.' },
  ];

  return (
    <div className="space-y-8">
      {/* Tab identity */}
      <SectionHeader />

      <div className="card border-l-4 border-brand-orange">
        <p className="section-label mb-2">Why This Matters</p>
        <p className="text-gray-300 text-sm leading-relaxed">
          AI tools like ChatGPT, Perplexity, and Google AI Overview decide which businesses to recommend based on
          how well-established and authoritative a brand appears across the web. A low score means buyers asking
          AI for recommendations in your space likely won't hear your name.
        </p>
      </div>

      <div ref={ref}>
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
                  <div className="h-full rounded-full"
                    style={{
                      width: animated ? `${val}%` : '0%',
                      backgroundColor: scoreHex(val),
                      transition: animated ? 'width 1.2s cubic-bezier(0.4,0,0.2,1)' : 'none',
                    }} />
                </div>
                <p className="text-xs text-gray-500">{item.tip}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Live AI Mention Test ──────────────────────────────────────── */}
      <AIMentionPanel mention={mention} />

      {claude.topRecommendations?.length > 0 && (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-4">Top Recommendations</h3>
          <div className="space-y-3">
            {claude.topRecommendations.map((rec, i) => (
              <div key={i} className="card flex gap-4">
                <span className="text-brand-orange font-heading text-2xl font-bold flex-shrink-0">{i + 1}</span>
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

// ─── Live AI Mention Panel ────────────────────────────────────────────────────
function AIMentionPanel({ mention }) {
  // null = still loading, false = failed/no data, object = result
  const isLoading = mention === null;
  const hasData   = mention && mention !== false;

  return (
    <div>
      <h3 className="font-heading text-xl font-semibold mb-4">What AI Actually Says About You</h3>

      {isLoading && (
        <div className="card flex items-center gap-4 py-6 border border-brand-orange/30 bg-brand-orange/5">
          <div className="w-5 h-5 rounded-full border-2 border-brand-orange border-t-transparent animate-spin flex-shrink-0" />
          <div>
            <p className="font-heading font-semibold text-white text-sm">Querying ChatGPT with live web search…</p>
            <p className="text-xs text-gray-400 mt-0.5">Asking GPT-4o who it recommends in your industry. This takes up to 30 seconds.</p>
          </div>
        </div>
      )}

      {hasData && (
        <div className="space-y-4">
          {/* Verdict banner */}
          <div className={`card flex items-center gap-4 py-5 border-l-4 ${
            mention.mentioned
              ? 'border-green-500 bg-green-950/20'
              : 'border-red-500 bg-red-950/20'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg ${
              mention.mentioned ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {mention.mentioned ? '✓' : '✗'}
            </div>
            <div>
              <p className={`font-heading font-bold text-base ${mention.mentioned ? 'text-green-300' : 'text-red-300'}`}>
                {mention.mentioned
                  ? 'Your business was mentioned by ChatGPT'
                  : 'Your business was not mentioned by ChatGPT'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Query: <span className="text-gray-300 italic">"{mention.query}"</span>
              </p>
            </div>
          </div>

          {/* The actual AI response */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 flex-shrink-0">
                {/* OpenAI logo-ish icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 w-5 h-5">
                  <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
                </svg>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-heading">GPT-4o Response (Live Web Search)</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">{mention.responseText}</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Generated {new Date(mention.generatedAt).toLocaleString()} · Model: {mention.model}
            </p>
          </div>
        </div>
      )}

      {mention === false && (
        <div className="card border border-white/10 py-5 text-center">
          <p className="text-gray-500 text-sm">AI mention check unavailable — request timed out.</p>
        </div>
      )}

      {mention && mention !== false && !mention.responseText && mention.error && (
        <div className="card border border-red-500/30 bg-red-950/20 py-5">
          <p className="text-red-300 text-sm font-medium mb-1">OpenAI API Error</p>
          <p className="text-gray-400 text-xs">{mention.error}</p>
          {mention.query && <p className="text-gray-500 text-xs mt-2">Query: "{mention.query}"</p>}
        </div>
      )}
    </div>
  );
}
