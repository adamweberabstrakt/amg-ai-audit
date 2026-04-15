'use client';

export default function BookingCTA({ score, onOpen }) {
  const scoreLabel = score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400';

  return (
    <>
      {/* Desktop: floating pill bottom-right */}
      <div className="hidden sm:flex fixed bottom-8 right-8 z-40 flex-col items-end gap-2">
        <div className="bg-[#1e1e1e] border border-white/20 rounded-full px-4 py-1.5 text-xs text-gray-400 shadow-lg">
          AI Score: <span className={`font-bold font-heading text-sm ${scoreLabel}`}>{score}</span>
          <span className="text-gray-500">/100</span>
        </div>
        <button
          onClick={onOpen}
          className="btn-primary shadow-2xl shadow-brand-orange/30"
          style={{ borderRadius: '9999px' }}
        >
          Book My Free Assessment Call →
        </button>
      </div>

      {/* Mobile: slim sticky footer */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a1a1a] border-t border-white/10 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">AI Score</span>
          <span className={`font-heading font-bold text-lg leading-none ${scoreLabel}`}>
            {score}<span className="text-gray-500 text-xs font-body font-normal">/100</span>
          </span>
        </div>
        <button
          onClick={onOpen}
          className="btn-primary text-sm py-3 px-5 flex-shrink-0"
        >
          Book Free Call →
        </button>
      </div>

      <div className="sm:hidden h-20" />
    </>
  );
}
