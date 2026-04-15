'use client';

import { useEffect } from 'react';

export default function ChiliPiperModal({ isOpen, onClose }) {
  const subdomain = process.env.NEXT_PUBLIC_CHILIPIPER_SUBDOMAIN;
  const router    = process.env.NEXT_PUBLIC_CHILIPIPER_ROUTER;
  const src       = subdomain && router
    ? `https://${subdomain}.chilipiper.com/book/${router}`
    : null;

  // Lock body scroll when open; close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl bg-[#1e1e1e] rounded-xl shadow-2xl border border-white/10 overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-brand-orange/10 to-transparent">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h3 className="font-heading text-xl font-bold text-white mb-1">
                Want us to walk through your results?
              </h3>
              <p className="text-gray-400 text-sm">
                Book a free 30-minute call with our team — we'll review your competitor gaps and build you a clear action plan.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Iframe */}
        <div style={{ height: '520px' }}>
          <iframe
            src={src}
            title="Schedule a Meeting"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-[#111] text-center">
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            I'll schedule later
          </button>
        </div>
      </div>
    </div>
  );
}
