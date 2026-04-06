import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden">
      <Header />
      <Hero />
      <PainStats />
      <PainPoints />
      <AIExplainer />
      <WhatYouGet />
      <TrustBar />
      <FinalCTA />
      <Footer />
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="border-b border-white/10 px-6 py-4 sticky top-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="font-heading font-bold text-lg tracking-wide">
          <span className="text-brand-orange">ABSTRAKT</span>
          <span className="text-white"> MARKETING GROUP</span>
        </div>
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
      {/* Grid texture */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.04] pointer-events-none" />
      {/* Glow orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Label pill */}
        <div className="inline-flex items-center gap-2 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange font-heading text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8">
          <span className="w-1.5 h-1.5 bg-brand-orange rounded-full animate-pulse inline-block" />
          Free AI Visibility Assessment
        </div>

        <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8 max-w-4xl">
          Your SEO Traffic<br />
          Is Being{' '}
          <span className="relative inline-block">
            <span className="text-brand-orange">Stolen by AI.</span>
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-brand-orange/40 rounded" />
          </span>
        </h1>

        <p className="text-xl text-gray-300 mb-5 max-w-2xl leading-relaxed">
          Google's AI Overviews, ChatGPT, and Perplexity are answering your customers'
          questions <em className="text-white not-italic font-medium">without sending them to your website.</em> Organic
          traffic is collapsing — and most businesses have no idea what to do next.
        </p>
        <p className="text-gray-500 mb-12 max-w-xl leading-relaxed">
          Find out exactly how visible your business is to AI — and what it's costing you —
          with a free assessment in under 5 minutes.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Link href="/assess" className="btn-primary text-base">
            Get My Free AI Assessment →
          </Link>
          <p className="text-sm text-gray-600">No credit card &nbsp;·&nbsp; Takes 2 minutes</p>
        </div>
      </div>
    </section>
  );
}

// ─── Pain Stats ───────────────────────────────────────────────────────────────
function PainStats() {
  const stats = [
    {
      value: '58%',
      label: 'Drop in Organic CTR',
      detail: 'AI Overviews answer the query without a click — your traffic never arrives.',
    },
    {
      value: '30%+',
      label: 'Avg. B2B Traffic Loss',
      detail: 'Most B2B sites have seen double-digit organic traffic declines since 2024.',
    },
    {
      value: '50%+',
      label: 'Drop in Impressions',
      detail: 'Search impressions collapse as AI answers push organic results below the fold.',
    },
  ];

  return (
    <section className="relative px-6 py-0">
      {/* Diagonal cut top */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-[#111] skew-y-[-1deg] origin-left -translate-y-8 pointer-events-none" />

      <div className="relative bg-[#111] py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-600 text-xs uppercase tracking-[0.2em] font-heading mb-12">
            What's happening to organic search right now
          </p>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {stats.map((stat) => (
              <div key={stat.value} className="px-8 py-10 text-center group">
                <div className="font-heading text-7xl font-bold text-brand-orange mb-3 leading-none group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="font-heading text-sm font-semibold text-white mb-4 uppercase tracking-widest">
                  {stat.label}
                </div>
                <p className="text-gray-500 text-sm leading-relaxed max-w-[220px] mx-auto">
                  {stat.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Diagonal cut bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#111] skew-y-[1deg] origin-right translate-y-8 pointer-events-none" />
    </section>
  );
}

// ─── Pain Points ──────────────────────────────────────────────────────────────
function PainPoints() {
  const pains = [
    {
      emoji: '📉',
      headline: '"Our rankings are fine but traffic keeps dropping."',
      body: 'AI Overviews sit above organic results and answer the question directly. You rank #1 — but nobody clicks through.',
    },
    {
      emoji: '💸',
      headline: '"We\'re spending more on ads just to maintain lead volume."',
      body: 'When organic traffic falls, paid ads become the lifeline. CPCs rise as more businesses compete for the same shrinking pool.',
    },
    {
      emoji: '🤷',
      headline: '"Our SEO agency says everything looks good. So why is traffic down?"',
      body: 'Traditional SEO metrics don\'t capture AI visibility. Perfect on-page SEO won\'t save you if AI tools don\'t know you exist.',
    },
    {
      emoji: '🔍',
      headline: '"ChatGPT recommends our competitors. Why not us?"',
      body: 'AI tools build brand reputations from structured data, review signals, and content authority — not just keyword rankings.',
    },
  ];

  return (
    <section className="relative px-6 py-28">
      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-noise-pattern opacity-[0.02] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-16">
          <p className="section-label mb-4">Sound Familiar?</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold leading-tight max-w-2xl">
            The Signs Your Business Is{' '}
            <span className="text-brand-orange">Losing the AI Search War</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {pains.map((pain) => (
            <div
              key={pain.headline}
              className="group relative bg-[#222] rounded-xl p-8 border border-white/10 hover:border-brand-orange/40 transition-all duration-300 overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-brand-orange/0 group-hover:bg-brand-orange/[0.03] transition-colors duration-300 pointer-events-none rounded-xl" />
              <span className="text-3xl mb-5 block">{pain.emoji}</span>
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
            <div className="text-4xl flex-shrink-0">⚠️</div>
            <div className="flex-1">
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                This Is Not a Temporary Dip. This Is a Structural Shift.
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                AI search isn't going away. Businesses that adapt now will pull ahead.
                Those that wait are watching the gap widen every single day.
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
function AIExplainer() {
  return (
    <section className="relative px-6 py-24 bg-[#111] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {/* Glow behind image */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-4">How AI Search Really Works</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-5 leading-tight">
            From Query to Answer —{' '}
            <span className="text-brand-orange">Why Your Website Gets Skipped</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed">
            AI engines don't browse your site like a human. They synthesize signals
            from across the web — and if your signals are weak, you don't make the cut.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(232,93,4,0.08)]">
          <Image
            src="https://abstrakt-ai-brand-lift.vercel.app/images/ai-search-explainer.png"
            alt="How AI Search Works: From Query to Answer"
            width={1200}
            height={600}
            className="w-full h-auto"
            unoptimized
          />
          {/* Subtle gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}

// ─── What You Get ──────────────────────────────────────────────────────────────
function WhatYouGet() {
  const items = [
    {
      number: '01',
      icon: '⚡',
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
      number: '02',
      icon: '📍',
      title: 'Local & Search Presence',
      points: [
        'Google Business Profile audit',
        'Star rating & review signals',
        'NAP consistency check',
        'Directory & citation presence',
      ],
      why: 'Local AI recommendations pull from GBP data. Incomplete profiles = missing mentions.',
    },
    {
      number: '03',
      icon: '🤖',
      title: 'AI Visibility Score (0–100)',
      points: [
        'Overall AI Visibility Score',
        'Content authority analysis',
        'Competitor gap comparison',
        'Top priority recommendations',
      ],
      why: 'We score how likely AI tools are to surface your brand — then tell you what to fix.',
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
            A Complete Picture of Your{' '}
            <span className="text-brand-orange">AI Search Readiness</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            In under 5 minutes, you'll know exactly where you stand — and what to do about it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="group relative bg-[#1e1e1e] rounded-xl border border-white/10 hover:border-brand-orange/50 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Top accent bar */}
              <div className="h-[3px] w-full bg-gradient-to-r from-brand-orange/0 via-brand-orange to-brand-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="p-7 flex flex-col gap-4 flex-1">
                {/* Ghost number */}
                <span className="absolute top-4 right-5 font-heading text-6xl font-bold text-white/[0.04] select-none">
                  {item.number}
                </span>
                <div className="text-4xl">{item.icon}</div>
                <h3 className="font-heading text-xl font-semibold text-white">{item.title}</h3>
                <ul className="space-y-2.5 flex-1">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <span className="text-brand-orange mt-0.5 flex-shrink-0 font-bold">✓</span>
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
            Start My Free Assessment →
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
    { value: '500+', label: 'Websites Built' },
    { value: '$1B+', label: 'Revenue Generated' },
    { value: '10+', label: 'Years in Business' },
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
      {/* Orange glow backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-brand-orange/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-orange/15 rounded-full blur-[120px] pointer-events-none" />
      {/* Border frame */}
      <div className="absolute inset-8 rounded-2xl border border-brand-orange/20 pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        <p className="section-label mb-6">Ready to Find Out?</p>
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Find Out Where You Stand —
          <br />
          <span className="text-brand-orange">Before Your Competitors Do</span>
        </h2>
        <p className="text-gray-400 text-lg mb-12 leading-relaxed max-w-xl mx-auto">
          Your free AI Visibility Assessment takes 2 minutes. Get your score,
          see your gaps, and walk away with a clear plan to fix them.
        </p>
        <Link
          href="/assess"
          className="inline-block bg-brand-orange text-white font-heading font-bold uppercase tracking-wide px-12 py-5 rounded-lg hover:bg-orange-600 transition-all duration-200 text-lg shadow-[0_0_40px_rgba(232,93,4,0.3)] hover:shadow-[0_0_60px_rgba(232,93,4,0.5)]"
        >
          Get My Free Assessment →
        </Link>
        <p className="text-gray-600 text-sm mt-5">No credit card &nbsp;·&nbsp; No commitment</p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-white/10 text-center bg-[#111]">
      <p className="text-gray-600 text-sm">
        © {new Date().getFullYear()} Abstrakt Marketing Group. All rights reserved.
      </p>
      <p className="text-gray-700 text-xs mt-1">
        <a href="https://www.abstraktmg.com" className="hover:text-gray-400 transition-colors">
          abstraktmg.com
        </a>
      </p>
    </footer>
  );
}
