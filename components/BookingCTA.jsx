'use client';

import { useState } from 'react';

// Polls for window.ChiliPiper up to 3s before falling back to direct URL.
// Fixes the race condition where the script hasn't fully loaded yet.
function waitForChiliPiper(timeout = 3000) {
  return new Promise((resolve) => {
    if (window.ChiliPiper) { resolve(true); return; }
    const interval = 150;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      if (window.ChiliPiper) { clearInterval(timer); resolve(true); return; }
      if (elapsed >= timeout)  { clearInterval(timer); resolve(false); }
    }, interval);
  });
}

export default function BookingCTA({ score, leadData }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleBooking() {
    setIsLoading(true);

    const subdomain = process.env.NEXT_PUBLIC_CHILIPIPER_SUBDOMAIN;
    const router    = process.env.NEXT_PUBLIC_CHILIPIPER_ROUTER;

    const loaded = await waitForChiliPiper();

    if (!loaded) {
      // Graceful fallback — open booking page directly
      window.open(`https://${subdomain}.chilipiper.com/book/${router}`, '_blank');
      setIsLoading(false);
      return;
    }

    window.ChiliPiper.submit(subdomain, router, {
      lead: {
        FirstName:           leadData?.firstName   ?? '',
        LastName:            leadData?.lastName    ?? '',
        Email:               leadData?.email       ?? '',
        Phone:               leadData?.phone       ?? '',
        Company:             leadData?.company     ?? '',
        Website:             leadData?.website     ?? '',
        UTM_Source:          leadData?.utmSource   ?? '',
        UTM_Medium:          leadData?.utmMedium   ?? '',
        UTM_Campaign:        leadData?.utmCampaign ?? '',
        UTM_Content:         leadData?.utmContent  ?? '',
        GCLID:               leadData?.gclid       ?? '',
        AI_Visibility_Score: score,
      },
      onSuccess: () => {
        if (window.dataLayer) window.dataLayer.push({ event: 'booking_confirmed', ai_score: score });
        window.location.href = '/thank-you';
      },
      onError: () => setIsLoading(false),
      onClose: () => setIsLoading(false),
    });
  }

  const scoreLabel = score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400';
  const btnLabel   = isLoading ? 'Loading calendar…' : 'Book My Free Assessment Call →';

  return (
    <>
      {/* Desktop: floating pill bottom-right */}
      <div className="hidden sm:flex fixed bottom-8 right-8 z-50 flex-col items-end gap-2">
        <div className="bg-[#1e1e1e] border border-white/20 rounded-full px-4 py-1.5 text-xs text-gray-400 shadow-lg">
          AI Score: <span className={`font-bold font-heading text-sm ${scoreLabel}`}>{score}</span>
          <span className="text-gray-500">/100</span>
        </div>
        <button
          onClick={handleBooking}
          disabled={isLoading}
          className="btn-primary shadow-2xl shadow-brand-orange/30 disabled:opacity-70 disabled:cursor-wait"
          style={{ borderRadius: '9999px' }}
        >
          {btnLabel}
        </button>
      </div>

      {/* Mobile: slim sticky footer */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1a1a1a] border-t border-white/10 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">AI Score</span>
          <span className={`font-heading font-bold text-lg leading-none ${scoreLabel}`}>
            {score}<span className="text-gray-500 text-xs font-body font-normal">/100</span>
          </span>
        </div>
        <button
          onClick={handleBooking}
          disabled={isLoading}
          className="btn-primary text-sm py-3 px-5 disabled:opacity-70 disabled:cursor-wait flex-shrink-0"
        >
          {btnLabel}
        </button>
      </div>

      <div className="sm:hidden h-20" />
    </>
  );
}
