'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams }   from 'next/navigation';
import Image                            from 'next/image';
import ResultsTabs      from '@/components/ResultsTabs';
import BookingCTA       from '@/components/BookingCTA';
import ThemeToggle      from '@/components/ThemeToggle';
import ChiliPiperModal  from '@/components/ChiliPiperModal';

export default function ResultsClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const shareId      = searchParams.get('id');

  const [auditData,     setAuditData]    = useState(null);
  const [leadData,      setLeadData]     = useState(null);
  const [shareUrl,      setShareUrl]     = useState('');
  const [shareCopied,   setShareCopied]  = useState(false);
  const [shareLoading,  setShareLoading] = useState(false);
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const hasShownAutoPopup = useRef(false);
  const popupTimer        = useRef(null);

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

  // Auto-popup: fires once 45s after audit data is loaded
  useEffect(() => {
    if (!auditData || hasShownAutoPopup.current) return;
    popupTimer.current = setTimeout(() => {
      setSchedulerOpen(true);
      hasShownAutoPopup.current = true;
    }, 45000);
    return () => clearTimeout(popupTimer.current);
  }, [auditData]);

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
      <div className="px-6 py-10 border-b border-white/10 bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse at 50% 50%, rgba(232,93,4,0.06), transparent 70%)' }} />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 relative">
          <div className="flex-shrink-0 text-center">
            <ScoreCircle score={score} />
          </div>
          <div>
            <p className="section-label mb-2">AI Search Competitive Assessment</p>
            <h1 className="font-heading text-3xl font-bold mb-3">
              {leadData.company} vs. Competitors in AI Search
            </h1>
            <p className="text-gray-300 leading-relaxed max-w-xl">
              {auditData.claude?.visibilitySummary ?? 'Your assessment is complete. Review each tab below for detailed findings.'}
            </p>
            <div className="mt-5">
              <UrgencyBadge urgency={auditData.claude?.urgencyLevel} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ResultsTabs auditData={auditData} onBook={() => setSchedulerOpen(true)} />
      </div>

      {/* Booking CTA — always show (leadData is available in both direct and shared views) */}
      <BookingCTA score={score} leadData={leadData} onOpen={() => setSchedulerOpen(true)} />

      {/* ChiliPiper scheduling modal */}
      <ChiliPiperModal isOpen={schedulerOpen} onClose={() => setSchedulerOpen(false)} />
    </div>
  );
}

function ScoreCircle({ score }) {
  const [displayed, setDisplayed] = useState(0);
  const [offset, setOffset] = useState(2 * Math.PI * 54);

  useEffect(() => {
    const circumference = 2 * Math.PI * 54;
    const targetOffset = circumference - (score / 100) * circumference;
    const duration = 1500;
    const start = performance.now();
    let raf;
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));
      setOffset(circumference - eased * (score / 100) * circumference);
      if (progress < 1) raf = requestAnimationFrame(update);
    }
    const t = setTimeout(() => { raf = requestAnimationFrame(update); }, 300);
    return () => { clearTimeout(t); cancelAnimationFrame(raf); };
  }, [score]);

  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 54;

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        {/* Glow layer */}
        <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} opacity="0.12" />
        {/* Main ring */}
        <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-5xl font-bold leading-none" style={{ color }}>{displayed}</span>
        <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">/ 100</span>
      </div>
    </div>
  );
}

function UrgencyBadge({ urgency }) {
  const map = {
    high: {
      cls: 'bg-red-950/60 border border-red-500/40 text-red-300',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
      label: 'High Priority — Competitors are actively pulling ahead in AI search',
    },
    medium: {
      cls: 'bg-yellow-950/60 border border-yellow-500/40 text-yellow-300',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
      label: 'Medium Priority — Competitive gap is widening. Close it now.',
    },
    low: {
      cls: 'bg-green-950/60 border border-green-500/40 text-green-300',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
      label: 'Low Priority — Strong AI search position. Keep optimizing.',
    },
  };
  const { cls, icon, label } = map[urgency] ?? map.medium;
  return (
    <div className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg font-medium text-sm ${cls}`}>
      {icon}
      {label}
    </div>
  );
}
