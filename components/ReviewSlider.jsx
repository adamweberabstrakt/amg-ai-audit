'use client';

import { useState, useEffect, useCallback } from 'react';

const REVIEWS = [
  {
    quote: "With Abstrakt, I got more than just a web development team. They delivered a true comprehensive digital strategy. Within one week of launch, I got a new lead from the site.",
    author: "Law Firm Owner",
    source: "Google Review",
    stars: 5,
  },
  {
    quote: "Redesigned a website that grabbed the attention of key leads, including a local engineering firm. Landed a $40K project and expanded the partnership into new markets.",
    author: "VP of Sales, Roofcorp of America",
    source: "Clutch Review",
    stars: 5,
  },
  {
    quote: "They've created the best website we've had yet and the assistance in reading the results of the website is great! We're really happy with the work they've done for us.",
    author: "Business Owner",
    source: "Google Review",
    stars: 5,
  },
  {
    quote: "We had an excellent experience with Abstrakt in redesigning and launching our new firm website with SEO. The team ensured seamless customer experience through timely deliveries.",
    author: "Professional Services Client",
    source: "Trustpilot Review",
    stars: 5,
  },
  {
    quote: "They have the ability to deliver quality leads, superb marketing collateral, and a robust SEO program. Projects were organized and updated regularly with milestone reviews.",
    author: "Commercial Roofing Contractor",
    source: "Clutch Review",
    stars: 5,
  },
];

export default function ReviewSlider() {
  const [active, setActive] = useState(0);

  const next = useCallback(() => setActive((p) => (p + 1) % REVIEWS.length), []);
  const prev = () => setActive((p) => (p - 1 + REVIEWS.length) % REVIEWS.length);

  useEffect(() => {
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next]);

  const r = REVIEWS[active];

  return (
    <section className="relative px-6 py-24 bg-[#111] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <p className="section-label mb-3">Client Results</p>
          <h2 className="font-heading text-4xl md:text-5xl font-bold leading-tight">
            What Clients Say About{' '}
            <span className="text-brand-orange">Our Website Work</span>
          </h2>
        </div>

        {/* Card */}
        <div className="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-10 md:p-14 text-center min-h-[220px] flex flex-col items-center justify-center">
          {/* Quote mark */}
          <div className="absolute top-6 left-8 text-brand-orange/20 font-heading text-8xl leading-none select-none">"</div>

          {/* Stars */}
          <div className="flex gap-1 justify-center mb-6">
            {Array.from({ length: r.stars }).map((_, i) => (
              <svg key={i} className="w-5 h-5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 max-w-2xl relative z-10">
            "{r.quote}"
          </p>

          <div>
            <p className="font-heading font-semibold text-white text-base">{r.author}</p>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">{r.source}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-colors"
            aria-label="Previous review"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === active ? 'w-6 bg-brand-orange' : 'w-1.5 bg-white/20'}`}
                aria-label={`Review ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/40 transition-colors"
            aria-label="Next review"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
