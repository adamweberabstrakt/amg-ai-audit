'use client';

import { useEffect, useState } from 'react';

export default function BookingCTA({ score, onOpen }) {
  const [pulsing, setPulsing] = useState(false);
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444';
  const colorClass = score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400';

  // Start pulse animation 5s after mount to draw attention
  useEffect(() => {
    const t = setTimeout(() => setPulsing(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Desktop: full-width bottom bar */}
      <div className="hidden sm:block fixed bottom-0 left-0 right-0 z-40 bg-[#111]/95 backdrop-blur-sm border-t border-white/10 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          {/* Mini score ring + label */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative w-11 h-11">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 18}
                  strokeDashoffset={2 * Math.PI * 18 * (1 - score / 100)}
                  style={{ transition: 'stroke-dashoffset 1s ease' }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-heading text-xs font-bold" style={{ color }}>{score}</span>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-heading">AI Visibility Score</p>
              <p className={`font-heading font-bold text-sm ${colorClass}`}>
                {score >= 70 ? 'Strong position' : score >= 40 ? 'Gaps to close' : 'Urgent action needed'}
              </p>
            </div>
          </div>

          <p className="text-gray-400 text-sm hidden lg:block flex-1 text-center">
            See exactly how to outrank your competitors in AI search — in 30 minutes, free.
          </p>

          <button
            onClick={onOpen}
            className="btn-primary flex-shrink-0 shadow-[0_0_24px_rgba(232,93,4,0.3)]"
          >
            Close the Gap — Talk to a Strategist
          </button>
        </div>
      </div>

      {/* Mobile: slim sticky footer */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a1a1a] border-t border-white/10 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">AI Score</span>
          <span className={`font-heading font-bold text-lg leading-none ${colorClass}`}>
            {score}<span className="text-gray-500 text-xs font-normal">/100</span>
          </span>
        </div>
        <button onClick={onOpen}
          className={`btn-primary text-sm py-3 px-5 flex-shrink-0 transition-all duration-300 ${pulsing ? 'shadow-[0_0_20px_rgba(232,93,4,0.5)]' : ''}`}>
          Close the Gap
        </button>
      </div>

      {/* Spacer so content isn't hidden behind bar */}
      <div className="h-20 sm:h-[72px]" />
    </>
  );
}
