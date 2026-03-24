'use client';

import { useState } from 'react';

// Sticky bottom CTA on the results page.
// Fires ChiliPiper.submit() with pre-filled lead data + UTM attribution.
// On booking success, redirects to /thank-you.

export default function BookingCTA({ score, leadData }) {
  const [isLoading, setIsLoading] = useState(false);

  function handleBooking() {
    setIsLoading(true);

    const subdomain = process.env.NEXT_PUBLIC_CHILIPIPER_SUBDOMAIN;
    const router    = process.env.NEXT_PUBLIC_CHILIPIPER_ROUTER;

    // ChiliPiper global is injected via the <script> tag in layout.js
    if (typeof window === 'undefined' || !window.ChiliPiper) {
      console.warn('ChiliPiper not loaded — check layout.js script tag');
      setIsLoading(false);
      // Fallback: open Chilipiper URL directly
      window.open(`https://${subdomain}.chilipiper.com/book/${router}`, '_blank');
      return;
    }

    window.ChiliPiper.submit(subdomain, router, {
      lead: {
        FirstName: leadData?.firstName ?? '',
        LastName:  leadData?.lastName  ?? '',
        Email:     leadData?.email     ?? '',
        Phone:     leadData?.phone     ?? '',
        Company:   leadData?.company   ?? '',
        Website:   leadData?.website   ?? '',
        // UTM attribution
        UTM_Source:   leadData?.utmSource   ?? '',
        UTM_Medium:   leadData?.utmMedium   ?? '',
        UTM_Campaign: leadData?.utmCampaign ?? '',
        UTM_Content:  leadData?.utmContent  ?? '',
        GCLID:        leadData?.gclid       ?? '',
        // Score context
        AI_Visibility_Score: score,
      },
      onSuccess: () => {
        // Fire GA4 event
        if (window.dataLayer) {
          window.dataLayer.push({ event: 'booking_confirmed', ai_score: score });
        }
        window.location.href = '/thank-you';
      },
      onError: () => {
        setIsLoading(false);
      },
      onClose: () => {
        setIsLoading(false);
      },
    });
  }

  const urgencyText = score < 40
    ? 'Your score is critically low — book now before competitors pull further ahead.'
    : score < 70
    ? 'You have clear gaps our team can help you close quickly.'
    : 'Great foundation — let\'s build on it with a targeted strategy.';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-dark border-t border-white/10 shadow-2xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Score + message */}
        <div className="text-center sm:text-left">
          <p className="font-heading text-lg font-semibold">
            Your AI Visibility Score:{' '}
            <span className={score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'}>
              {score}/100
            </span>
          </p>
          <p className="text-gray-400 text-sm">{urgencyText}</p>
        </div>

        {/* CTA button */}
        <button
          onClick={handleBooking}
          disabled={isLoading}
          className="btn-primary whitespace-nowrap disabled:opacity-70 disabled:cursor-wait"
        >
          {isLoading ? 'Loading calendar...' : 'Book My Free Assessment Call →'}
        </button>
      </div>
    </div>
  );
}
