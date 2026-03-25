import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-bg text-white">
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
    <header className="border-b border-white/10 px-6 py-4 sticky top-0 z-50 bg-brand-bg/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="font-heading font-bold text-xl tracking-wide">
          <span className="text-brand-orange">ABSTRAKT</span>
          <span className="text-white"> MARKETING GROUP</span>
        </div>
        <Link href="/assess" className="btn-primary text-sm px-6 py-2">
          Get Free Assessment →
        </Link>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-bg to-brand-bg pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        <div className="max-w-3xl">
          <p className="section-label mb-5">Free AI Visibility Assessment</p>
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Your SEO Traffic
            <br />
            Is Being{' '}
            <span className="text-brand-orange">Stolen by AI.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl leading-relaxed">
            Google's AI Overviews, ChatGPT, and Perplexity are answering your customers'
            questions without sending them to your website. Organic traffic is collapsing
            — and most businesses have no idea what to do next.
          </p>
          <p className="text-gray-400 mb-10 max-w-xl leading-relaxed">
            Find out exactly how visible your business is to AI — and what it's costing you —
            with a free assessment in under 5 minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link href="/assess" className="btn-primary text-lg">
              Get My Free AI Assessment →
            </Link>
            <p className="text-sm text-gray-500 self-center">No credit card. Takes 2 minutes.</p>
          </div>
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
      label: 'Drop in organic CTR',
      detail: 'AI Overviews answer the query without a click — your traffic never arrives.',
    },
    {
      value: '30%+',
      label: 'Avg. B2B traffic loss',
      detail: 'Most B2B websites have seen double-digit organic traffic declines since 2024.',
    },
    {
      value: '50%+',
      label: 'Drop in impressions',
      detail: 'Search impressions are collapsing as AI answers push organic results further down.',
    },
  ];

  return (
    <section className="px-6 py-14 bg-brand-dark border-t border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-gray-500 text-sm uppercase tracking-widest font-heading mb-10">
          What's happening to organic search right now
        </p>
        <div className="grid md:grid-cols-3 gap-px bg-white/10">
          {stats.map((stat) => (
            <div key={stat.value} className="bg-brand-dark px-8 py-10 text-center">
              <div className="font-heading text-6xl font-bold text-brand-orange mb-2 leading-none">
                {stat.value}
              </div>
              <div className="font-heading text-lg font-semibold text-white mb-3 uppercase tracking-wide">
                {stat.label}
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
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
      headline: '"We\'re spending more on ads just to maintain our lead volume."',
      body: 'When organic traffic falls, paid ads become the lifeline. CPCs rise as more businesses compete for the same eyeballs.',
    },
    {
      emoji: '🤷',
      headline: '"Our SEO agency says everything looks good. So why is traffic down?"',
      body: 'Traditional SEO metrics don\'t capture AI visibility. You can have perfect on-page SEO and still be invisible to AI search.',
    },
    {
      emoji: '🔍',
      headline: '"ChatGPT recommends our competitors. Why not us?"',
      body: 'AI tools build reputations from structured data, review signals, and content authority — not just keyword rankings.',
    },
  ];

  return (
    <section className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="section-label mb-4">Sound Familiar?</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
            The Signs Your Business Is
            <span className="text-brand-orange"> Losing the AI Search War</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pains.map((pain) => (
            <div key={pain.headline} className="card-pain">
              <span className="text-3xl mb-4 block">{pain.emoji}</span>
              <h3 className="font-heading text-lg font-semibold text-white mb-3 leading-snug">
                {pain.headline}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{pain.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-brand-orange/10 border border-brand-orange/30 rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="text-5xl">⚠️</div>
            <div className="flex-1">
              <h3 className="font-heading text-xl font-bold text-white mb-2">
                This Is Not a Temporary Dip. This Is a Structural Shift.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                AI search isn't going away. Businesses that adapt now — optimizing for AI visibility
                alongside traditional SEO — will pull ahead. Those that wait are watching the gap grow every day.
              </p>
            </div>
            <Link href="/assess" className="btn-primary whitespace-nowrap flex-shrink-0">
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
    <section className="px-6 py-20 bg-brand-dark border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-4">How AI Search Really Works</p>
          <h2 className="font-heading text-4xl font-bold mb-4">
            From Query to Answer —{' '}
            <span className="text-brand-orange">Why Your Website Gets Skipped</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            AI search engines don't browse your site like a human. They synthesize signals
            from across the web — and if your signals are weak, you don't make the cut.
          </p>
        </div>

        <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl">
          <Image
            src="https://abstrakt-ai-brand-lift.vercel.app/images/ai-search-explainer.png"
            alt="How AI Search Works: From Query to Answer"
            width={1200}
            height={600}
            className="w-full h-auto"
            unoptimized
          />
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
      why: 'AI tools favor fast, well-structured websites. Slow or broken sites are skipped entirely.',
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
      why: 'Local AI recommendations pull heavily from GBP data. Incomplete profiles = missing recommendations.',
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
      why: 'We score how likely AI tools are to surface your brand — then tell you exactly what to fix.',
    },
  ];

  return (
    <section className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-4">Your Free Assessment Includes</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            A Complete Picture of Your{' '}
            <span className="text-brand-orange">AI Search Readiness</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
            In under 5 minutes, you'll know exactly where you stand — and what to do about it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.title} className="card flex flex-col gap-4 relative overflow-hidden">
              <span className="absolute top-4 right-4 font-heading text-5xl font-bold text-white/5">
                {item.number}
              </span>
              <div className="text-4xl">{item.icon}</div>
              <h3 className="font-heading text-xl font-semibold">{item.title}</h3>
              <ul className="space-y-2 flex-1">
                {item.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-brand-orange mt-0.5 flex-shrink-0">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 italic leading-relaxed">{item.why}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <Link href="/assess" className="btn-primary text-lg">
            Start My Free Assessment →
          </Link>
          <p className="text-gray-500 text-sm mt-3">No credit card. No commitment. Takes 2 minutes.</p>
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
    { value: '$1B+', label: 'Revenue Generated for Clients' },
    { value: '10+', label: 'Years in Business' },
  ];

  return (
    <section className="px-6 py-16 bg-brand-dark border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-gray-500 text-sm uppercase tracking-widest mb-12 font-heading">
          Trusted by B2B companies across North America
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-heading text-4xl md:text-5xl font-bold text-brand-orange mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm leading-snug max-w-[120px] mx-auto">
                {stat.label}
              </div>
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
    <section className="px-6 py-24 bg-brand-orange relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-brand-orange pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-black/10 rounded-full pointer-events-none" />
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          Find Out Where You Stand —
          <br />
          Before Your Competitors Do
        </h2>
        <p className="text-orange-100 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
          Your free AI Visibility Assessment takes 2 minutes. Get your score,
          see your gaps, and get a clear plan to fix them.
        </p>
        <Link
          href="/assess"
          className="inline-block bg-white text-brand-orange font-heading font-bold uppercase tracking-wide px-10 py-5 rounded hover:bg-orange-50 transition-colors duration-200 text-lg"
        >
          Get My Free Assessment →
        </Link>
        <p className="text-orange-200 text-sm mt-4">No credit card. No commitment.</p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-white/10 text-center bg-brand-dark">
      <p className="text-gray-500 text-sm">
        © {new Date().getFullYear()} Abstrakt Marketing Group. All rights reserved.
      </p>
      <p className="text-gray-600 text-xs mt-1">
        <a href="https://www.abstraktmg.com" className="hover:text-gray-400 transition-colors">
          abstraktmg.com
        </a>
      </p>
    </footer>
  );
}
