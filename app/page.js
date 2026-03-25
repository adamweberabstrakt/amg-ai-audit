import Link from 'next/link';
import Image from 'next/image';

// ─── Styles injected directly — no Tailwind purge risk ───────────────────────
const styles = `
  .amg-page { background: #161616; color: #fff; font-family: 'Inter', sans-serif; }

  /* Header */
  .amg-header { position: sticky; top: 0; z-index: 50; background: rgba(22,22,22,0.96); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(255,255,255,0.08); padding: 16px 24px; }
  .amg-header-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
  .amg-logo { font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 18px; letter-spacing: 0.05em; }
  .amg-logo-orange { color: #e85d04; }

  /* Buttons */
  .amg-btn { display: inline-block; background: #e85d04; color: #fff; font-family: 'Oswald', sans-serif; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; padding: 14px 32px; border-radius: 6px; text-decoration: none; transition: background 0.2s, box-shadow 0.2s; white-space: nowrap; }
  .amg-btn:hover { background: #c94e00; box-shadow: 0 0 30px rgba(232,93,4,0.4); }
  .amg-btn-sm { padding: 10px 20px; font-size: 13px; }
  .amg-btn-glow { box-shadow: 0 0 40px rgba(232,93,4,0.25); }

  /* Hero */
  .amg-hero { position: relative; padding: 96px 24px 88px; overflow: hidden; }
  .amg-hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 64px 64px; pointer-events: none; }
  .amg-hero-glow { position: absolute; top: -100px; right: -100px; width: 600px; height: 600px; background: radial-gradient(circle, rgba(232,93,4,0.12) 0%, transparent 70%); pointer-events: none; }
  .amg-hero-inner { position: relative; max-width: 1100px; margin: 0 auto; }
  .amg-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(232,93,4,0.1); border: 1px solid rgba(232,93,4,0.3); color: #e85d04; font-family: 'Oswald', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; padding: 8px 16px; border-radius: 100px; margin-bottom: 28px; }
  .amg-pill-dot { width: 6px; height: 6px; background: #e85d04; border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
  .amg-h1 { font-family: 'Oswald', sans-serif; font-size: clamp(42px, 7vw, 76px); font-weight: 700; line-height: 1.05; margin-bottom: 28px; }
  .amg-h1-accent { color: #e85d04; position: relative; display: inline-block; }
  .amg-h1-accent::after { content: ''; position: absolute; left: 0; right: 0; bottom: -4px; height: 3px; background: rgba(232,93,4,0.4); border-radius: 2px; }
  .amg-hero-body { font-size: 18px; color: #ccc; line-height: 1.7; max-width: 640px; margin-bottom: 16px; }
  .amg-hero-sub { font-size: 15px; color: #666; line-height: 1.7; max-width: 500px; margin-bottom: 44px; }
  .amg-hero-cta-row { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
  .amg-cta-note { font-size: 13px; color: #555; }

  /* Stats */
  .amg-stats { background: #0e0e0e; position: relative; padding: 72px 24px; }
  .amg-stats::before, .amg-stats::after { content: ''; position: absolute; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent); }
  .amg-stats::before { top: 0; }
  .amg-stats::after { bottom: 0; }
  .amg-stats-inner { max-width: 1100px; margin: 0 auto; }
  .amg-stats-label { text-align: center; font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #444; font-family: 'Oswald', sans-serif; margin-bottom: 48px; }
  .amg-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 640px) { .amg-stats-grid { grid-template-columns: 1fr; } }
  .amg-stat-item { padding: 40px 32px; text-align: center; border-right: 1px solid rgba(255,255,255,0.08); }
  .amg-stat-item:last-child { border-right: none; }
  @media (max-width: 640px) { .amg-stat-item { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.08); } }
  .amg-stat-num { font-family: 'Oswald', sans-serif; font-size: clamp(52px, 7vw, 80px); font-weight: 700; color: #e85d04; line-height: 1; margin-bottom: 10px; transition: transform 0.3s; }
  .amg-stat-item:hover .amg-stat-num { transform: scale(1.05); }
  .amg-stat-name { font-family: 'Oswald', sans-serif; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: #fff; margin-bottom: 12px; }
  .amg-stat-desc { font-size: 13px; color: #555; line-height: 1.6; max-width: 200px; margin: 0 auto; }

  /* Pain section */
  .amg-pain { padding: 96px 24px; position: relative; }
  .amg-section-inner { max-width: 1100px; margin: 0 auto; }
  .amg-section-label { font-family: 'Oswald', sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; color: #e85d04; margin-bottom: 16px; display: block; }
  .amg-h2 { font-family: 'Oswald', sans-serif; font-size: clamp(32px, 5vw, 52px); font-weight: 700; line-height: 1.1; margin-bottom: 48px; }
  .amg-h2-accent { color: #e85d04; }
  .amg-pain-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
  @media (max-width: 700px) { .amg-pain-grid { grid-template-columns: 1fr; } }
  .amg-pain-card { background: #1c1c1c; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 32px; transition: border-color 0.3s, background 0.3s; }
  .amg-pain-card:hover { border-color: rgba(232,93,4,0.35); background: #1f1f1f; }
  .amg-pain-emoji { font-size: 28px; margin-bottom: 16px; display: block; }
  .amg-pain-headline { font-family: 'Oswald', sans-serif; font-size: 17px; font-weight: 600; color: #fff; margin-bottom: 10px; line-height: 1.3; }
  .amg-pain-body { font-size: 14px; color: #666; line-height: 1.65; }
  .amg-callout { border: 1px solid rgba(232,93,4,0.3); background: rgba(232,93,4,0.05); border-radius: 12px; padding: 32px; display: flex; align-items: center; gap: 24px; flex-wrap: wrap; border-left: 4px solid #e85d04; }
  .amg-callout-text { flex: 1; min-width: 220px; }
  .amg-callout-title { font-family: 'Oswald', sans-serif; font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 8px; }
  .amg-callout-desc { font-size: 14px; color: #888; line-height: 1.6; }

  /* AI Explainer */
  .amg-explainer { background: #0e0e0e; padding: 88px 24px; position: relative; overflow: hidden; }
  .amg-explainer::before, .amg-explainer::after { content: ''; position: absolute; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent); }
  .amg-explainer::before { top: 0; }
  .amg-explainer::after { bottom: 0; }
  .amg-explainer-glow { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 800px; height: 400px; background: radial-gradient(ellipse, rgba(232,93,4,0.06) 0%, transparent 70%); pointer-events: none; }
  .amg-explainer-header { text-align: center; max-width: 700px; margin: 0 auto 56px; }
  .amg-explainer-img { border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 0 80px rgba(232,93,4,0.06); position: relative; }
  .amg-explainer-img img { width: 100%; height: auto; display: block; }

  /* What you get */
  .amg-wyg { padding: 96px 24px; position: relative; overflow: hidden; }
  .amg-wyg-glow { position: absolute; bottom: -100px; right: -100px; width: 500px; height: 500px; background: radial-gradient(circle, rgba(232,93,4,0.06) 0%, transparent 70%); pointer-events: none; }
  .amg-wyg-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 56px; }
  @media (max-width: 900px) { .amg-wyg-grid { grid-template-columns: 1fr; } }
  .amg-wyg-card { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 32px; display: flex; flex-direction: column; gap: 16px; position: relative; overflow: hidden; transition: border-color 0.3s; }
  .amg-wyg-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, #e85d04, transparent); opacity: 0; transition: opacity 0.3s; }
  .amg-wyg-card:hover { border-color: rgba(232,93,4,0.4); }
  .amg-wyg-card:hover::before { opacity: 1; }
  .amg-wyg-num { position: absolute; top: 16px; right: 20px; font-family: 'Oswald', sans-serif; font-size: 56px; font-weight: 700; color: rgba(255,255,255,0.03); line-height: 1; user-select: none; }
  .amg-wyg-icon { font-size: 36px; }
  .amg-wyg-title { font-family: 'Oswald', sans-serif; font-size: 20px; font-weight: 600; color: #fff; }
  .amg-wyg-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; flex: 1; }
  .amg-wyg-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; color: #aaa; line-height: 1.5; }
  .amg-wyg-check { color: #e85d04; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
  .amg-wyg-why { font-size: 12px; color: #555; font-style: italic; line-height: 1.6; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.06); }
  .amg-wyg-cta { text-align: center; }
  .amg-cta-subtext { font-size: 13px; color: #555; margin-top: 14px; }

  /* Trust bar */
  .amg-trust { background: #0e0e0e; padding: 72px 24px; position: relative; }
  .amg-trust::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent); }
  .amg-trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; text-align: center; }
  @media (max-width: 700px) { .amg-trust-grid { grid-template-columns: repeat(2, 1fr); } }
  .amg-trust-val { font-family: 'Oswald', sans-serif; font-size: clamp(36px, 5vw, 52px); font-weight: 700; color: #e85d04; line-height: 1; margin-bottom: 8px; }
  .amg-trust-lbl { font-size: 13px; color: #666; line-height: 1.4; }

  /* Final CTA */
  .amg-final-cta { padding: 104px 24px; position: relative; overflow: hidden; }
  .amg-final-cta-bg { position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(232,93,4,0.15) 0%, transparent 70%); pointer-events: none; }
  .amg-final-cta-frame { position: absolute; inset: 32px; border: 1px solid rgba(232,93,4,0.15); border-radius: 20px; pointer-events: none; }
  .amg-final-cta-inner { position: relative; max-width: 800px; margin: 0 auto; text-align: center; }
  .amg-final-h2 { font-family: 'Oswald', sans-serif; font-size: clamp(36px, 6vw, 60px); font-weight: 700; line-height: 1.1; margin-bottom: 24px; }

  /* Footer */
  .amg-footer { background: #0e0e0e; border-top: 1px solid rgba(255,255,255,0.06); padding: 28px 24px; text-align: center; }
  .amg-footer p { font-size: 13px; color: #444; margin: 0 0 4px; }
  .amg-footer a { color: #555; text-decoration: none; transition: color 0.2s; }
  .amg-footer a:hover { color: #aaa; }
`;

export default function HomePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="amg-page">
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
    </>
  );
}

function Header() {
  return (
    <header className="amg-header">
      <div className="amg-header-inner">
        <div className="amg-logo">
          <span className="amg-logo-orange">ABSTRAKT</span>
          <span> MARKETING GROUP</span>
        </div>
        <Link href="/assess" className="amg-btn amg-btn-sm">
          Get Free Assessment →
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="amg-hero">
      <div className="amg-hero-grid" />
      <div className="amg-hero-glow" />
      <div className="amg-hero-inner">
        <div className="amg-pill">
          <span className="amg-pill-dot" />
          Free AI Visibility Assessment
        </div>
        <h1 className="amg-h1">
          Your SEO Traffic<br />
          Is Being{' '}
          <span className="amg-h1-accent">Stolen by AI.</span>
        </h1>
        <p className="amg-hero-body">
          Google AI Overviews, ChatGPT, and Perplexity are answering your customers'
          questions without sending them to your website. Organic traffic is collapsing
          — and most businesses have no idea what to do next.
        </p>
        <p className="amg-hero-sub">
          Find out exactly how visible your business is to AI — and what it's costing you —
          with a free assessment in under 5 minutes.
        </p>
        <div className="amg-hero-cta-row">
          <Link href="/assess" className="amg-btn amg-btn-glow">
            Get My Free AI Assessment →
          </Link>
          <span className="amg-cta-note">No credit card &nbsp;·&nbsp; Takes 2 minutes</span>
        </div>
      </div>
    </section>
  );
}

function PainStats() {
  const stats = [
    { value: '58%', label: 'Drop in Organic CTR', detail: 'AI Overviews answer queries without a click — your traffic never arrives.' },
    { value: '30%+', label: 'Avg. B2B Traffic Loss', detail: 'Most B2B sites have seen double-digit organic traffic declines since 2024.' },
    { value: '50%+', label: 'Drop in Impressions', detail: 'Search impressions collapse as AI answers push organic results below the fold.' },
  ];
  return (
    <section className="amg-stats">
      <div className="amg-stats-inner">
        <p className="amg-stats-label">What is happening to organic search right now</p>
        <div className="amg-stats-grid">
          {stats.map((s) => (
            <div key={s.value} className="amg-stat-item">
              <div className="amg-stat-num">{s.value}</div>
              <div className="amg-stat-name">{s.label}</div>
              <p className="amg-stat-desc">{s.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PainPoints() {
  const pains = [
    { emoji: '📉', headline: '"Our rankings are fine but traffic keeps dropping."', body: 'AI Overviews sit above organic results and answer the question directly. You rank #1 — but nobody clicks through.' },
    { emoji: '💸', headline: '"We are spending more on ads just to maintain lead volume."', body: 'When organic traffic falls, paid ads become the lifeline. CPCs rise as more businesses compete for the same shrinking pool.' },
    { emoji: '🤷', headline: '"Our SEO agency says everything looks good. So why is traffic down?"', body: 'Traditional SEO metrics do not capture AI visibility. Perfect on-page SEO will not save you if AI tools do not know you exist.' },
    { emoji: '🔍', headline: '"ChatGPT recommends our competitors. Why not us?"', body: 'AI tools build brand reputations from structured data, review signals, and content authority — not just keyword rankings.' },
  ];
  return (
    <section className="amg-pain">
      <div className="amg-section-inner">
        <span className="amg-section-label">Sound Familiar?</span>
        <h2 className="amg-h2">
          The Signs Your Business Is{' '}
          <span className="amg-h2-accent">Losing the AI Search War</span>
        </h2>
        <div className="amg-pain-grid">
          {pains.map((p) => (
            <div key={p.headline} className="amg-pain-card">
              <span className="amg-pain-emoji">{p.emoji}</span>
              <h3 className="amg-pain-headline">{p.headline}</h3>
              <p className="amg-pain-body">{p.body}</p>
            </div>
          ))}
        </div>
        <div className="amg-callout">
          <span style={{ fontSize: '36px' }}>⚠️</span>
          <div className="amg-callout-text">
            <h3 className="amg-callout-title">This Is Not a Temporary Dip. This Is a Structural Shift.</h3>
            <p className="amg-callout-desc">AI search is not going away. Businesses that adapt now will pull ahead. Those that wait are watching the gap widen every single day.</p>
          </div>
          <Link href="/assess" className="amg-btn amg-btn-sm">See Where I Stand →</Link>
        </div>
      </div>
    </section>
  );
}

function AIExplainer() {
  return (
    <section className="amg-explainer">
      <div className="amg-explainer-glow" />
      <div className="amg-section-inner">
        <div className="amg-explainer-header">
          <span className="amg-section-label">How AI Search Really Works</span>
          <h2 className="amg-h2" style={{ marginBottom: '16px' }}>
            From Query to Answer —{' '}
            <span className="amg-h2-accent">Why Your Website Gets Skipped</span>
          </h2>
          <p style={{ fontSize: '15px', color: '#666', lineHeight: '1.7' }}>
            AI engines do not browse your site like a human. They synthesize signals from across
            the web — and if your signals are weak, you do not make the cut.
          </p>
        </div>
        <div className="amg-explainer-img">
          <Image
            src="https://abstrakt-ai-brand-lift.vercel.app/images/ai-search-explainer.png"
            alt="How AI Search Works: From Query to Answer"
            width={1200}
            height={600}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}

function WhatYouGet() {
  const items = [
    {
      number: '01', icon: '⚡', title: 'Website Health Score',
      points: ['Page speed and Core Web Vitals', 'Technical SEO signals', 'Schema and structured data gaps', 'Missing meta, alt tags, OG data'],
      why: 'AI tools favor fast, well-structured sites. Slow or broken sites get skipped entirely.',
    },
    {
      number: '02', icon: '📍', title: 'Local and Search Presence',
      points: ['Google Business Profile audit', 'Star rating and review signals', 'NAP consistency check', 'Directory and citation presence'],
      why: 'Local AI recommendations pull from GBP data. Incomplete profiles mean missing mentions.',
    },
    {
      number: '03', icon: '🤖', title: 'AI Visibility Score (0-100)',
      points: ['Overall AI Visibility Score', 'Content authority analysis', 'Competitor gap comparison', 'Top priority recommendations'],
      why: 'We score how likely AI tools are to surface your brand — then tell you what to fix.',
    },
  ];
  return (
    <section className="amg-wyg">
      <div className="amg-wyg-glow" />
      <div className="amg-section-inner">
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <span className="amg-section-label">Your Free Assessment Includes</span>
          <h2 className="amg-h2" style={{ marginBottom: '16px' }}>
            A Complete Picture of Your{' '}
            <span className="amg-h2-accent">AI Search Readiness</span>
          </h2>
          <p style={{ fontSize: '15px', color: '#666', maxWidth: '500px', margin: '0 auto', lineHeight: '1.7' }}>
            In under 5 minutes, you will know exactly where you stand — and what to do about it.
          </p>
        </div>
        <div className="amg-wyg-grid">
          {items.map((item) => (
            <div key={item.title} className="amg-wyg-card">
              <span className="amg-wyg-num">{item.number}</span>
              <div className="amg-wyg-icon">{item.icon}</div>
              <h3 className="amg-wyg-title">{item.title}</h3>
              <ul className="amg-wyg-list">
                {item.points.map((pt) => (
                  <li key={pt}><span className="amg-wyg-check">✓</span>{pt}</li>
                ))}
              </ul>
              <p className="amg-wyg-why">{item.why}</p>
            </div>
          ))}
        </div>
        <div className="amg-wyg-cta">
          <Link href="/assess" className="amg-btn amg-btn-glow">Start My Free Assessment →</Link>
          <p className="amg-cta-subtext">No credit card &nbsp;·&nbsp; No commitment &nbsp;·&nbsp; Takes 2 minutes</p>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const stats = [
    { value: '2,000+', label: 'Active Clients' },
    { value: '500+', label: 'Websites Built' },
    { value: '$1B+', label: 'Revenue Generated' },
    { value: '10+', label: 'Years in Business' },
  ];
  return (
    <section className="amg-trust">
      <div className="amg-section-inner">
        <p className="amg-stats-label" style={{ marginBottom: '48px' }}>Trusted by B2B companies across North America</p>
        <div className="amg-trust-grid">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="amg-trust-val">{s.value}</div>
              <div className="amg-trust-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="amg-final-cta">
      <div className="amg-final-cta-bg" />
      <div className="amg-final-cta-frame" />
      <div className="amg-final-cta-inner">
        <span className="amg-section-label" style={{ marginBottom: '20px' }}>Ready to Find Out?</span>
        <h2 className="amg-final-h2">
          Find Out Where You Stand —<br />
          <span className="amg-h2-accent">Before Your Competitors Do</span>
        </h2>
        <p style={{ fontSize: '17px', color: '#888', marginBottom: '44px', lineHeight: '1.7', maxWidth: '540px', margin: '0 auto 44px' }}>
          Your free AI Visibility Assessment takes 2 minutes. Get your score,
          see your gaps, and walk away with a clear plan to fix them.
        </p>
        <Link href="/assess" className="amg-btn amg-btn-glow" style={{ fontSize: '17px', padding: '18px 44px' }}>
          Get My Free Assessment →
        </Link>
        <p className="amg-cta-subtext" style={{ marginTop: '16px' }}>No credit card &nbsp;·&nbsp; No commitment</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="amg-footer">
      <p>© {new Date().getFullYear()} Abstrakt Marketing Group. All rights reserved.</p>
      <p><a href="https://www.abstraktmg.com">abstraktmg.com</a></p>
    </footer>
  );
}
