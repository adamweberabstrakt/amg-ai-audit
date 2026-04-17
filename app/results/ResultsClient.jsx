'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams }   from 'next/navigation';
import Image                            from 'next/image';
import ResultsTabs      from '@/components/ResultsTabs';
import BookingCTA       from '@/components/BookingCTA';
import BookingSidebar   from '@/components/BookingSidebar';
import ThemeToggle      from '@/components/ThemeToggle';
import ChiliPiperModal  from '@/components/ChiliPiperModal';
import ShareModal       from '@/components/ShareModal';
import ReportActions    from '@/components/ReportActions';

export default function ResultsClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const shareId      = searchParams.get('id');

  const [auditData,     setAuditData]    = useState(null);
  const [leadData,      setLeadData]     = useState(null);
  const [shareUrl,       setShareUrl]      = useState('');
  const [shareLoading,   setShareLoading]  = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
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
    }, 5000);
    return () => clearTimeout(popupTimer.current);
  }, [auditData]);

  async function handleShare() {
    // If we already have a URL just open the modal
    if (shareUrl) { setShareModalOpen(true); return; }
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
      setShareModalOpen(true);
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
          <a href="/" className="flex items-center gap-3">
            {/* Dark mode: white logo */}
            <Image src="/brand/logo-white.png" alt="Abstrakt" width={140} height={40}
              className="dark-logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} priority />
            {/* Light mode: gray logo */}
            <Image src="/brand/logo-gray.png" alt="Abstrakt" width={140} height={40}
              className="light-logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} priority />
            <span className="text-gray-400">·</span>
            <span className="font-heading font-semibold text-sm uppercase tracking-widest text-gray-300">
              AI Search Radar
            </span>
          </a>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              disabled={shareLoading}
              title="Share your results with your team"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/30 disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              {shareLoading ? 'Generating…' : 'Share Results'}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Results hero */}
      <div className="px-6 py-10 border-b border-white/10 bg-brand-dark relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse at 50% 50%, rgba(232,93,4,0.06), transparent 70%)' }} />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 relative">
          <div className="flex-shrink-0 text-center w-full md:w-auto">
            <ScoreCircle score={score} />
          </div>
          <div className="w-full">
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

      {/* Tabs + Booking Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 min-w-0 w-full">
          <ResultsTabs auditData={auditData} onBook={() => setSchedulerOpen(true)} />
        </div>
        <BookingSidebar onBook={() => setSchedulerOpen(true)} />
      </div>

      {/* Report Actions (PDF Download + Notifications) */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="p-6 border border-white/10 rounded-xl bg-[#1a1a1a]">
          <div className="flex items-center gap-2 mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-brand-orange">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h3 className="font-heading text-lg font-bold text-white">Report & Notifications</h3>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            Download a comprehensive PDF report or notify your team about these results.
          </p>
          <ReportActions auditData={auditData} leadData={leadData} shareId={shareId} />
        </div>
      </div>

      {/* Brand Lift Tool Handoff */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="flex flex-col items-center justify-center gap-4 py-6 border-t border-white/10 bg-gradient-to-r from-transparent via-brand-orange/5 to-transparent rounded-xl">
          <div className="text-center">
            <h3 className="font-heading text-xl font-bold text-white mb-2">
              Next: Check Your Paid Ads Brand Lift
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              See how your brand shows up when competitors bid on your company name — and what you can do about it.
            </p>
          </div>
          <a
            href={`https://abstrakt-ai-brand-lift.vercel.app/?${new URLSearchParams({
              firstName: leadData?.firstName || '',
              lastName: leadData?.lastName || '',
              email: leadData?.email || '',
              phone: leadData?.phone || '',
              company: leadData?.company || '',
              website: leadData?.website || '',
              industry: leadData?.industry || '',
            }).toString()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-brand-orange hover:bg-orange-600 text-white font-heading font-semibold rounded-lg transition-colors shadow-[0_0_20px_rgba(232,93,4,0.3)]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M9 12l2 2 4-4"/>
              <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
              <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
              <path d="M3 12h6m6 0h6"/>
            </svg>
            Run Your Free Brand Lift Audit
          </a>
        </div>
      </div>

      {/* Booking CTA — always show */}
      <BookingCTA score={score} leadData={leadData} onOpen={() => setSchedulerOpen(true)} />

      {/* ChiliPiper scheduling modal */}
      <ChiliPiperModal isOpen={schedulerOpen} onClose={() => setSchedulerOpen(false)} />

      {/* Share results modal */}
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} shareUrl={shareUrl} />
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
