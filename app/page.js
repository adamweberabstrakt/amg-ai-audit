import Link from 'next/link';

// ─── Landing Page (/): AI Visibility Assessment ─────────────────────────────
// No API calls. Fast load. Optimized for paid ad traffic.
// AdSmith educational landing page pattern.

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <AISearchFlywheel />
      <WhatWeAudit />
      <TrustBar />
      <FinalCTA />
      <Footer />
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header className="border-b border-white/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="font-heading font-bold text-xl tracking-wide">
          <span className="text-brand-orange">ABSTRAKT</span>
          <span className="text-white"> MARKETING GROUP</span>
        </div>
        <Link href="/assess" className="btn-primary text-sm px-6 py-2">
          Get Free Assessment
        </Link>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="px-6 py-20 text-center max-w-4xl mx-auto">
      <p className="section-label mb-4">Free AI Visibility Assessment</p>
      <h1 className="font-heading text-5xl md:text-6xl font-bold leading-tight mb-6">
        Is Your Business
        <br />
        <span className="text-brand-orange">Invisible to AI?</span>
      </h1>
      <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto">
        ChatGPT, Perplexity, and Google's AI Overview are now the first stop for millions of buyers.
        If your brand isn't showing up there, you're losing leads you never knew existed.
      </p>
      <p className="text-gray-400 mb-10 max-w-xl mx-auto">
        Get a free AI Visibility Assessment in under 5 minutes — and find out exactly where your gaps are.
      </p>
      <Link href="/assess" className="btn-primary text-lg">
        Get Your Free AI Visibility Assessment
      </Link>
      <p className="text-sm text-gray-500 mt-4">No credit card. No commitment. Takes 2 minutes.</p>
    </section>
  );
}

// ─── AI Search Flywheel (4-step explainer) ────────────────────────────────────
function AISearchFlywheel() {
  const steps = [
    {
      number: '01',
      title: 'AI Tools Crawl the Web',
      body: 'ChatGPT, Perplexity, and Google AI Overview constantly crawl websites, reviews, directories, and social profiles to build their knowledge of your industry.',
    },
    {
      number: '02',
      title: 'They Build a Picture of Your Brand',
      body: 'Based on what they find — or don\'t find — AI tools form a reputation for your business. Strong signals = more mentions. Weak signals = invisibility.',
    },
    {
      number: '03',
      title: 'Buyers Ask AI for Recommendations',
      body: '"What\'s the best [your service] in [your city]?" If your brand isn\'t in the AI\'s knowledge base, you won\'t be in the answer.',
    },
    {
      number: '04',
      title: 'Invisible Brands Lose Leads',
      body: 'Your competitors who show up in AI answers are capturing demand you\'re generating. AI visibility is the new SEO — and most businesses aren\'t ready.',
    },
  ];

  return (
    <section className="px-6 py-20 bg-brand-dark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-3">How AI Search Works</p>
          <h2 className="font-heading text-4xl font-bold">
            The AI Search Flywheel
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Understanding how AI tools discover and recommend businesses — and why most brands are invisible to them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="card relative">
              <span className="text-brand-orange font-heading text-4xl font-bold block mb-3">
                {step.number}
              </span>
              <h3 className="font-heading text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── What We Audit (3-pillar section) ─────────────────────────────────────────
function WhatWeAudit() {
  const pillars = [
    {
      icon: '⚡',
      title: 'Website Performance',
      points: [
        'Page speed & Core Web Vitals',
        'Mobile usability',
        'Technical SEO signals',
        'Structured data & schema',
        'Missing meta, alt tags, OG data',
      ],
      why: 'AI tools favor fast, well-structured websites. Slow or broken sites are often skipped entirely.',
    },
    {
      icon: '📍',
      title: 'Search & Local Visibility',
      points: [
        'Google Business Profile status',
        'Star rating & review count',
        'NAP consistency',
        'Local search signals',
        'Directory presence',
      ],
      why: 'Local AI recommendations pull heavily from Google Business data. Missing or incomplete profiles mean missing recommendations.',
    },
    {
      icon: '🤖',
      title: 'AI Discoverability',
      points: [
        'AI Visibility Score (0–100)',
        'Content authority signals',
        'Brand mention analysis',
        'Competitor gap comparison',
        'Top recommendations to improve',
      ],
      why: 'This is the new frontier. We score how likely AI tools are to surface your brand and identify your biggest gaps.',
    },
  ];

  return (
    <section className="px-6 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-3">What You Get</p>
          <h2 className="font-heading text-4xl font-bold">
            A Full Picture of Your Digital Presence
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Your assessment covers three areas that determine whether AI tools — and the buyers using them — can find your business.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="card flex flex-col gap-4">
              <div className="text-4xl">{pillar.icon}</div>
              <h3 className="font-heading text-xl font-semibold">{pillar.title}</h3>
              <ul className="space-y-2">
                {pillar.points.map((point) => (
                  <li key={point} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-brand-orange mt-0.5">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 italic">{pillar.why}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/assess" className="btn-primary text-lg">
            Start My Free Assessment
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Trust Bar ────────────────────────────────────────────────────────────────
function TrustBar() {
  const stats = [
    { value: '500+', label: 'Websites Built' },
    { value: '10+', label: 'Years in Business' },
    { value: '95%', label: 'Client Retention Rate' },
    { value: '#1', label: 'B2B Lead Gen Agency in STL' },
  ];

  return (
    <section className="px-6 py-16 bg-brand-dark border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-gray-500 text-sm uppercase tracking-widest mb-10 font-heading">
          Trusted by B2B companies across North America
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-heading text-4xl font-bold text-brand-orange mb-1">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
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
    <section className="px-6 py-24 text-center bg-brand-orange">
      <div className="max-w-3xl mx-auto">
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
          Find Out Where You Stand — Before Your Competitors Do
        </h2>
        <p className="text-orange-100 text-lg mb-10">
          Your free AI Visibility Assessment takes 2 minutes. Get your score, see your gaps,
          and get a plain-language plan to fix them.
        </p>
        <Link
          href="/assess"
          className="inline-block bg-white text-brand-orange font-heading font-bold uppercase tracking-wide px-10 py-5 rounded hover:bg-orange-50 transition-colors duration-200 text-lg"
        >
          Get My Free Assessment
        </Link>
        <p className="text-orange-200 text-sm mt-4">No credit card. No commitment.</p>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-white/10 text-center">
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
