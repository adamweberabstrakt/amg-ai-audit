'use client';

const CHILIPIPER_URL = 'https://abstraktmg.chilipiper.com/round-robin/inbound-sdr';

export default function BookingSidebar() {
  return (
    <div className="lg:flex-shrink-0" style={{ width: '100%', maxWidth: '360px' }}>
      {/* On desktop: sticky. On mobile: normal block, stacks below tabs */}
      <div className="lg:sticky lg:top-24">
        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-brand-orange/10 to-transparent border-b border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <img src="/brand/logomark-teal.png" alt="" aria-hidden="true" style={{ height: '20px', width: 'auto' }} />
              <span className="font-heading font-semibold text-xs uppercase tracking-widest text-gray-400">Free Strategy Call</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-white leading-tight">
              Want us to walk through your results?
            </h3>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              Book a free 30-min call — we'll review your gaps and build a clear action plan.
            </p>
          </div>

          {/* ChiliPiper iframe */}
          <div style={{ height: '580px' }}>
            <iframe
              src={CHILIPIPER_URL}
              title="Schedule a Meeting"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
