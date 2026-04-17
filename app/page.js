import Link from 'next/link';
import Image from 'next/image';
import CountUpStats from '@/components/CountUpStats';
import ReviewSlider from '@/components/ReviewSlider';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden">
      <Header />
      <Hero />
      <ScrollingTrustBanner />
      <PainStats />
      <PainPoints />
      <WhatYouGet />
      <ReviewSlider />
      <TrustBar />
      <FinalCTA />
      <GrowZoneBanner />
      <Footer />
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="border-b border-white/10 px-6 py-4 sticky top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img src="/brand/logo-white.png" alt="Abstrakt Marketing Group" className="dark-logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          <img src="/brand/logo-gray.png"  alt="Abstrakt Marketing Group" className="light-logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          <span className="text-gray-400">·</span>
          <span className="font-heading font-semibold text-sm uppercase tracking-widest text-gray-300">
            AI Search Radar
          </span>
        </a>
        <Link href="/assess" className="btn-primary text-sm px-5 py-2.5">
          Get Free Assessment →
        </Link>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-24 pb-24">
      {/* Animated grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
        animation: 'gridPulse 8s ease-in-out infinite',
      }} />
      {/* Glow orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start gap-12">
          {/* Main content */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange font-heading text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8">
              <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-pulse inline-block" />
              Free AI Visibility Assessment
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8 max-w-4xl">
              Find Out Why Your<br />
              Competitors Are{' '}
              <span className="relative inline-block">
                <span className="text-white">Beating You</span>
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-brand-orange/40 rounded" />
              </span>
              {' '}in AI Search
            </h1>

            <p className="text-xl text-gray-300 mb-5 max-w-2xl leading-relaxed">
              ChatGPT, Perplexity, and Google AI Overviews are recommending your competitors.{' '}
              <em className="text-white not-italic font-medium">Find out why — and what it's costing you.</em>
            </p>
            <p className="text-gray-500 mb-12 max-w-xl leading-relaxed">
              Get a free competitor gap assessment in under 2 minutes. See exactly where your brand stands vs. the competition in AI search.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <Link href="/assess" className="btn-primary text-base">
                See How I Compare to Competitors →
              </Link>
              <p className="text-sm text-gray-600">No credit card &nbsp;·&nbsp; Takes 2 minutes</p>
            </div>

            {/* Trust stats row */}
            <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-white/10">
              {[
                { num: '2,000+', label: 'Active clients' },
                { num: '500+',   label: 'Websites built' },
                { num: '$1B+',   label: 'Revenue generated' },
              ].map((s) => (
                <div key={s.num} className="flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-bold text-brand-orange leading-none">{s.num}</span>
                  <span className="text-gray-500 text-sm">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wistia video */}
          <div className="lg:flex-shrink-0 lg:w-[480px] w-full max-w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(232,93,4,0.08)]">
            <style>{`wistia-player[media-id='m2kgo37bny']:not(:defined){background:center/contain no-repeat url('https://fast.wistia.com/embed/medias/m2kgo37bny/swatch');display:block;filter:blur(5px);padding-top:56.25%}`}</style>
            {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
            <wistia-player media-id="m2kgo37bny" aspect="1.7777777777777777"></wistia-player>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </section>
  );
}

// ─── Pain Stats ───────────────────────────────────────────────────────────────
function PainStats() {
  return (
    <section className="bg-[#111] border-y border-white/10 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-gray-600 text-xs uppercase tracking-[0.2em] font-heading mb-12">
          Why your competitors are pulling ahead right now
        </p>
        <CountUpStats />
      </div>
    </section>
  );
}

// ─── Pain Points ──────────────────────────────────────────────────────────────
function PainPoints() {
  const pains = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-brand-orange">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
      headline: '"Our rankings are fine but traffic keeps dropping."',
      body: 'AI Overviews sit above organic results and answer the question directly. You rank #1 — but nobody clicks through to your site.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-brand-orange">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      ),
      headline: '"We\'re spending more on ads just to maintain lead volume."',
      body: 'When organic traffic falls, paid ads become the lifeline. CPCs rise as more businesses compete for the same shrinking pool.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-brand-orange">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      ),
      headline: '"Our SEO agency says everything looks good. So why is traffic down?"',
      body: 'Traditional SEO metrics don\'t capture AI visibility. Perfect on-page SEO won\'t save you if AI tools don\'t know you exist.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7 text-brand-orange">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      ),
      headline: '"ChatGPT recommends our competitors. Why not us?"',
      body: 'AI tools build brand reputations from structured data, review signals, and content authority — not just keyword rankings.',
    },
  ];

  return (
    <section className="relative px-6 py-28">
      <div className="absolute inset-0 bg-noise-pattern opacity-[0.02] pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="section-label mb-4">Sound Familiar?</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold leading-tight max-w-2xl">
            The Signs Your Competitors Are{' '}
            <span className="text-brand-orange">Winning AI Search</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {pains.map((pain) => (
            <div
              key={pain.headline}
              className="group relative bg-[#222] rounded-xl p-8 border border-white/10 hover:border-brand-orange/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-brand-orange/0 group-hover:bg-brand-orange/[0.03] transition-colors duration-300 pointer-events-none rounded-xl" />
              {/* Glow border on hover */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 0 1px rgba(232,93,4,0.4)' }} />
              <div className="w-11 h-11 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-brand-orange/15">
                {pain.icon}
              </div>
              <h3 className="font-heading text-lg font-semibold text-white mb-3 leading-snug">
                {pain.headline}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{pain.body}</p>
            </div>
          ))}
        </div>

        {/* Warning callout */}
        <div className="mt-10 relative overflow-hidden rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-8">
          <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange rounded-l-xl" />
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 pl-2">
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#E85D04" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                Every Day You Wait, the Gap Gets Wider.
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Competitors already optimizing for AI search are pulling further ahead every week. The brands that adapt now will own the AI recommendations. Those that wait are funding their competitors' growth.
              </p>
            </div>
            <Link href="/assess" className="btn-primary whitespace-nowrap flex-shrink-0 text-sm">
              See Where I Stand →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── AI Explainer Image ────────────────────────────────────────────────────────
// ─── Scrolling Trust Banner ───────────────────────────────────────────────────
function ScrollingTrustBanner() {
  const items = [
    { type: 'badge', img: '/brand/badge-semrush.png',        alt: 'SEMRush Certified Agency Partner', h: 44 },
    { type: 'text',  label: '200+ Creative Awards' },
    { type: 'badge', img: '/brand/badge-google-partner.png', alt: 'Google Partner',                  h: 36 },
    { type: 'text',  label: '2,000+ Active B2B Clients' },
    { type: 'badge', img: '/brand/badge-clutch.png',         alt: 'Clutch — Clients Say We Deliver', h: 52 },
    { type: 'text',  label: '500+ Websites Built & Ranked' },
    { type: 'badge', img: '/brand/badge-inc5000.png',        alt: 'Inc. 5000 Ten-Time Honoree',      h: 52 },
    { type: 'text',  label: '$1B+ Revenue Generated' },
    { type: 'badge', img: '/brand/badge-forbes.avif',        alt: 'As Featured in Forbes',           h: 32 },
    { type: 'text',  label: '10 Consecutive Years on Inc. 5000' },
  ];

  const Track = () => (
    <div className="flex items-center gap-16 flex-shrink-0 pr-16">
      {items.map((item, i) => (
        <div key={i} className="flex-shrink-0">
          {item.type === 'badge' ? (
            <img
              src={item.img}
              alt={item.alt}
              style={{ height: `${item.h}px`, width: 'auto', objectFit: 'contain', opacity: 0.8 }}
            />
          ) : (
            <span className="font-heading font-semibold text-sm uppercase tracking-widest text-gray-400 whitespace-nowrap">
              ✦&nbsp;&nbsp;{item.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#111] border-y border-white/10 py-5 overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 w-24 h-full bg-gradient-to-r from-[#111] to-transparent z-10" style={{ position: 'absolute' }} />
      <div className="pointer-events-none absolute right-0 w-24 h-full bg-gradient-to-l from-[#111] to-transparent z-10" style={{ position: 'absolute' }} />

      <div className="flex" style={{ animation: 'trustMarquee 50s linear infinite' }}>
        <Track />
        <Track />
      </div>

      <style>{`
        @keyframes trustMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}


function WhatYouGet() {
  const items = [
    {
      number: '01',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-orange">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: 'Competitor Gap Analysis',
      points: [
        'Competitor domain authority comparison',
        'Top transactional keywords competitors rank for',
        'Where competitors outrank you in AI search',
        'Traffic and keyword volume gaps',
      ],
      why: 'See exactly what your competitors are doing that you aren\'t — so you can close the gap.',
    },
    {
      number: '02',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-orange">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
      ),
      title: 'Website Health Score',
      points: [
        'Page speed & Core Web Vitals',
        'Technical SEO signals',
        'Schema & structured data gaps',
        'Missing meta, alt tags, OG data',
      ],
      why: 'AI tools favor fast, well-structured sites. Slow or broken sites are skipped entirely.',
    },
    {
      number: '03',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-brand-orange">
          <rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h6v6H9z"/><path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3"/>
        </svg>
      ),
      title: 'AI Visibility Score (0–100)',
      points: [
        'Overall AI Visibility Score',
        'Content authority analysis',
        'Local & brand signal audit',
        'Top priority action plan',
      ],
      why: 'We score how likely AI tools are to surface your brand vs. your competitors — then tell you what to fix first.',
    },
  ];

  return (
    <section className="relative px-6 py-28 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="section-label mb-4">Your Free Assessment Includes</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-5 leading-tight">
            A Complete Picture of{' '}
            <span className="text-white">Your Competitive Position</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            In under 2 minutes, you'll see exactly how you stack up against competitors in AI search — and what to do about it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="group relative bg-[#1e1e1e] rounded-xl border border-white/10 hover:border-brand-orange/50 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <div className="h-[3px] w-full bg-gradient-to-r from-brand-orange/0 via-brand-orange to-brand-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-7 flex flex-col gap-4 flex-1">
                <span className="absolute top-4 right-5 font-heading text-6xl font-bold text-white/[0.04] select-none">
                  {item.number}
                </span>
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-heading text-xl font-semibold text-white">{item.title}</h3>
                <ul className="space-y-2.5 flex-1">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#E85D04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 flex-shrink-0">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-white/10 mt-2">
                  <p className="text-xs text-gray-600 italic leading-relaxed">{item.why}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link href="/assess" className="btn-primary text-base">
            See How I Compare →
          </Link>
          <p className="text-gray-600 text-sm mt-4">No credit card &nbsp;·&nbsp; No commitment &nbsp;·&nbsp; Takes 2 minutes</p>
        </div>
      </div>
    </section>
  );
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────
function TrustBar() {
  const stats = [
    { value: '2,000+', label: 'Active Clients' },
    { value: '500+',   label: 'Websites Built' },
    { value: '$1B+',   label: 'Revenue Generated' },
    { value: '10+',    label: 'Years in Business' },
  ];

  return (
    <section className="relative px-6 py-20 bg-[#111] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-gray-600 text-xs uppercase tracking-[0.2em] font-heading mb-14">
          Trusted by B2B companies across North America
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={stat.label} className="relative">
              {i < 3 && (
                <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-px bg-white/10" />
              )}
              <div className="font-heading text-5xl font-bold text-brand-orange mb-2 leading-none">
                {stat.value}
              </div>
              <div className="text-gray-500 text-sm leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section className="relative px-6 py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-brand-orange/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-orange/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-8 rounded-2xl border border-brand-orange/20 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <p className="section-label mb-6">Ready to Find Out?</p>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Find Out Why Competitors Are Ahead —
          <br />
          <span className="text-white">Then Take That Spot Back</span>
        </h2>
        <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-xl mx-auto">
          Your free AI Visibility Assessment takes 2 minutes. Get your score, see your competitor gaps, and walk away with a clear action plan.
        </p>
        <Link
          href="/assess"
          className="inline-block bg-brand-orange text-white font-heading font-bold uppercase tracking-wide px-12 py-5 rounded-lg hover:bg-orange-600 transition-all duration-200 text-lg shadow-[0_0_40px_rgba(232,93,4,0.3)] hover:shadow-[0_0_60px_rgba(232,93,4,0.5)]"
        >
          Run My Free Competitor Assessment →
        </Link>
        <p className="text-gray-600 text-sm mt-5">No credit card &nbsp;·&nbsp; No commitment</p>
      </div>
    </section>
  );
}

// ─── Grow Zone Banner ─────────────────────────────────────────────────────────
function GrowZoneBanner() {
  return (
    <div className="bg-[#111] border-t border-white/10 px-6 py-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-400 text-center sm:text-left">
          Want to learn more about AI visibility and SEO?
        </p>
        <a
          href="https://www.abstraktmg.com/grow-zone/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-heading font-semibold text-brand-orange hover:text-orange-400 transition-colors whitespace-nowrap"
        >
          Explore the Grow Zone
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-white/10 bg-[#111]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-600 text-sm">
          © {new Date().getFullYear()} Abstrakt Marketing Group. All rights reserved.
        </p>
        <div className="flex items-center gap-6 text-xs text-gray-700">
          <a href="https://www.abstraktmg.com" className="hover:text-gray-400 transition-colors">abstraktmg.com</a>
          <a href="https://www.abstraktmg.com/privacy-policy" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <a href="https://www.abstraktmg.com/terms" className="hover:text-gray-400 transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
}
