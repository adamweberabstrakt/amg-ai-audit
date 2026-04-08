'use client';

import { useEffect, useState }       from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image                          from 'next/image';
import ResultsTabs from '@/components/ResultsTabs';
import BookingCTA  from '@/components/BookingCTA';
import ThemeToggle from '@/components/ThemeToggle';

export default function ResultsClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const shareId      = searchParams.get('id');

  const [auditData,    setAuditData]    = useState(null);
  const [leadData,     setLeadData]     = useState(null);
  const [shareUrl,     setShareUrl]     = useState('');
  const [shareCopied,  setShareCopied]  = useState(false);
  const [shareLoading, setShareLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (shareId) {
        try {
          const res  = await fetch(`/api/share?id=${shareId}`);
          if (!res.ok) throw new Error('not found');
          const saved = await res.json();
          setAuditData(saved.auditData);
          setLeadData(saved.leadData);
          setShareUrl(window.location.href);
        } catch { router.push('/assess'); }
        return;
      }

      const audit = sessionStorage.getItem('auditResults');
      const lead  = sessionStorage.getItem('leadData');
      if (!audit || !lead) { router.push('/assess'); return; }
      try {
        setAuditData(JSON.parse(audit));
        setLeadData(JSON.parse(lead));
      } catch { router.push('/assess'); }
    }
    load();
  }, [router, shareId]);

  async function handleShare() {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
      return;
    }
    setShareLoading(true);
    try {
      const res    = await fetch('/api/share', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ auditData, leadData }),
      });
      const { id } = await res.json();
      const url    = `${window.location.origin}/results?id=${id}`;
      setShareUrl(url);
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch { alert('Could not generate share link. Please try again.'); }
    finally  { setShareLoading(false); }
  }

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
          <a href="/">
            {/* Dark mode: orange logo */}
            <Image src="/logo-orange.png" alt="Abstrakt" width={140} height={40}
              className="dark-logo" style={{ objectFit: 'contain' }} priority />
            {/* Light mode: dark logo */}
            <Image src="/logo-dark.png" alt="Abstrakt" width={140} height={40}
              className="light-logo" style={{ objectFit: 'contain' }} priority />
          </a>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              disabled={shareLoading}
              title="Generates a link valid for ~7 days"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 disabled:opacity-50"
            >
              {shareCopied ? '✓ Link Copied!' : shareLoading ? 'Generating…' : '🔗 Share Results'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Results hero */}
      <div className="px-6 py-10 border-b border-white/10 bg-brand-dark">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 text-center">
            <ScoreCircle score={score} />
          </div>
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

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ResultsTabs auditData={auditData} />
      </div>

      {/* Booking CTA — always show (leadData is available in both direct and shared views) */}
      <BookingCTA score={score} leadData={leadData} />
    </div>
  );
}

function ScoreCircle({ score }) {
  const color       = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 54;
  const offset      = circumference - (score / 100) * circumference;
  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-4xl font-bold" style={{ color }}>{score}</span>
        <span className="text-xs text-gray-400 uppercase tracking-wide">/ 100</span>
      </div>
    </div>
  );
}
