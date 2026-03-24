'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResultsTabs from '@/components/ResultsTabs';
import BookingCTA from '@/components/BookingCTA';

export default function ResultsPage() {
  const router = useRouter();
  const [auditData, setAuditData] = useState(null);
  const [leadData, setLeadData] = useState(null);

  useEffect(() => {
    const audit = sessionStorage.getItem('auditResults');
    const lead  = sessionStorage.getItem('leadData');

    if (!audit || !lead) {
      // No results — send them back to start
      router.push('/assess');
      return;
    }

    try {
      setAuditData(JSON.parse(audit));
      setLeadData(JSON.parse(lead));
    } catch {
      router.push('/assess');
    }
  }, [router]);

  if (!auditData || !leadData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
      </div>
    );
  }

  const score = auditData.claude?.aiVisibilityScore ?? 0;

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="font-heading font-bold text-xl tracking-wide">
            <span className="text-brand-orange">ABSTRAKT</span>
            <span className="text-white"> MARKETING GROUP</span>
          </div>
          <p className="text-sm text-gray-400 hidden sm:block">AI Visibility Assessment Results</p>
        </div>
      </header>

      {/* Results hero */}
      <div className="px-6 py-10 border-b border-white/10 bg-brand-dark">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Score circle */}
          <div className="flex-shrink-0 text-center">
            <ScoreCircle score={score} />
          </div>
          {/* Summary */}
          <div>
            <p className="section-label mb-2">Your Results</p>
            <h1 className="font-heading text-3xl font-bold mb-3">
              {leadData.company}'s AI Visibility Assessment
            </h1>
            <p className="text-gray-300 leading-relaxed max-w-xl">
              {auditData.claude?.visibilitySummary ?? 'Your assessment is complete. Review each tab below for detailed findings.'}
            </p>
            <div className="mt-4">
              <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                auditData.claude?.urgencyLevel === 'high'   ? 'bg-red-900/50 text-red-300' :
                auditData.claude?.urgencyLevel === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                'bg-green-900/50 text-green-300'
              }`}>
                {auditData.claude?.urgencyLevel === 'high'   ? '🔴 High Priority' :
                 auditData.claude?.urgencyLevel === 'medium' ? '🟡 Moderate Priority' :
                 '🟢 Low Priority'} — {auditData.claude?.urgencyLevel} urgency
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabbed results */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ResultsTabs auditData={auditData} />
      </div>

      {/* Sticky booking CTA */}
      <BookingCTA score={score} leadData={leadData} />
    </div>
  );
}

// ─── Score Circle ─────────────────────────────────────────────────────────────
function ScoreCircle({ score }) {
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-400 uppercase tracking-wide">/ 100</span>
      </div>
    </div>
  );
}
