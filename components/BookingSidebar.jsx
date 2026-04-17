'use client';

export default function BookingSidebar({ onBook }) {
  return (
    <div className="lg:flex-shrink-0" style={{ width: '100%', maxWidth: '360px' }}>
      {/* On desktop: sticky. On mobile: normal block, stacks below tabs */}
      <div className="lg:sticky lg:top-24 space-y-4">
        
        {/* Panel 1: Review Results + Primary CTA */}
        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.4)]">
          <div className="px-5 py-4 bg-gradient-to-r from-brand-orange/10 to-transparent border-b border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <img src="/brand/logomark-white.png" alt="" aria-hidden="true" style={{ height: '20px', width: 'auto' }} />
              <span className="font-heading font-semibold text-xs uppercase tracking-widest text-gray-400">Strategy Call</span>
            </div>
            <h3 className="font-heading text-lg font-bold text-white leading-tight">
              Review Your Search Results
            </h3>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
              Book a free 30-min call — we'll walk through your gaps and build a clear action plan.
            </p>
          </div>
          <div className="px-5 py-4">
            <button
              onClick={onBook}
              className="btn-primary w-full text-center font-heading font-semibold"
            >
              Get More Traffic
            </button>
          </div>
        </div>

        {/* Panel 2: Lead Gen Guide Soft Conversion */}
        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center flex-shrink-0 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-brand-orange">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-sm mb-1">
                The B2B Guide to Lead Generation
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Download our free playbook with proven strategies to generate qualified leads for your business.
              </p>
              <a 
                href="https://www.abstraktmg.com/guide-to-lead-generation/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-brand-orange hover:text-orange-400 transition-colors text-xs font-medium"
              >
                Get the Free Guide
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path d="M7 17L17 7"/>
                  <path d="M7 7h10v10"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Panel 3: Grow Zone Education */}
        <div className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-green-400">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-sm mb-1">
                Grow Zone
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Access free marketing insights, case studies, and growth strategies from our expert team.
              </p>
              <a 
                href="https://www.abstraktmg.com/grow-zone/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors text-xs font-medium"
              >
                Explore Resources
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path d="M7 17L17 7"/>
                  <path d="M7 7h10v10"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
