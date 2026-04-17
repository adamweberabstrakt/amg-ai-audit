'use client';

import SectionHeader from '@/components/SectionHeader';

// Tab 4: Brand Gap Analysis
// Claude-generated narrative analysis + top recommendations.
// Written for marketing managers, not developers.

export default function BrandGapTab({ auditData }) {
  const claude = auditData?.claude ?? {};

  return (
    <div className="space-y-8">
      {/* Tab identity */}
      <SectionHeader />

      {/* Why This Matters */}
      <div className="card border-l-4 border-brand-orange">
        <p className="section-label mb-2">Why This Matters</p>
        <p className="text-gray-300 text-sm leading-relaxed">
          AI tools build a profile of your brand based on everything they can find across the web — your website,
          reviews, social presence, mentions, and more. This analysis identifies the specific gaps between where
          your brand is today and what it would take to consistently appear in AI-generated recommendations.
        </p>
      </div>

      {/* Brand gap analysis narrative */}
      {claude.brandGapAnalysis ? (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-5">Your Brand Gap Analysis</h3>
          <div className="card space-y-4">
            {claude.brandGapAnalysis
              .split('\n')
              .filter((p) => p.trim())
              .map((paragraph, i) => (
                <p key={i} className="text-gray-300 leading-relaxed text-sm">
                  {paragraph}
                </p>
              ))}
          </div>
        </div>
      ) : (
        <div className="card text-center py-10">
          <p className="text-gray-400">Brand gap analysis is being generated. Please check back shortly.</p>
        </div>
      )}

      {/* Top recommendations */}
      {claude.topRecommendations?.length > 0 && (
        <div>
          <h3 className="font-heading text-xl font-semibold mb-5">Your Action Plan</h3>
          <p className="text-gray-400 text-sm mb-5">
            These are the highest-impact actions you can take to improve your AI visibility — written for a
            marketing manager, not a developer.
          </p>
          <div className="space-y-4">
            {claude.topRecommendations.map((rec, i) => (
              <div key={i} className="card flex gap-5 items-start">
                <div className="w-10 h-10 rounded-full bg-brand-orange/10 border border-brand-orange flex items-center justify-center flex-shrink-0">
                  <span className="font-heading text-brand-orange font-bold text-lg">{i + 1}</span>
                </div>
                <div className="pt-1">
                  <p className="text-gray-200 text-sm leading-relaxed">{rec}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA nudge */}
      <div className="card bg-brand-orange/10 border-brand-orange text-center py-8">
        <h3 className="font-heading text-2xl font-bold mb-3">
          Want a Custom Roadmap to Fix These Gaps?
        </h3>
        <p className="text-gray-300 text-sm mb-6 max-w-md mx-auto">
          Book a free 30-minute AI Visibility Assessment call with our team. We'll walk through your results,
          prioritize the gaps, and give you a concrete plan — no pitch, just strategy.
        </p>
        <p className="text-brand-orange font-heading font-semibold text-sm uppercase tracking-widest">
          ↓ Use the button below to book your call ↓
        </p>
      </div>
    </div>
  );
}
