'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  {
    value: 58,
    suffix: '%',
    label: 'Drop in Organic CTR',
    detail: 'AI Overviews answer the query without a click — your traffic never arrives.',
  },
  {
    value: 30,
    suffix: '%+',
    label: 'Avg. B2B Traffic Loss',
    detail: 'Most B2B sites have seen double-digit organic traffic declines since 2024.',
  },
  {
    value: 50,
    suffix: '%+',
    label: 'Drop in Impressions',
    detail: 'Search impressions collapse as AI answers push organic results below the fold.',
  },
];

function useCountUp(target, duration = 1200, active = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf;
    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(update);
    }
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

function StatItem({ stat, active }) {
  const count = useCountUp(stat.value, 1200, active);
  return (
    <div className="px-8 py-10 text-center group">
      <div className="font-heading text-7xl font-bold text-brand-orange mb-3 leading-none group-hover:scale-105 transition-transform duration-300">
        {count}{stat.suffix}
      </div>
      <div className="font-heading text-sm font-semibold text-white mb-4 uppercase tracking-widest">
        {stat.label}
      </div>
      <p className="text-gray-500 text-sm leading-relaxed max-w-[220px] mx-auto">
        {stat.detail}
      </p>
    </div>
  );
}

export default function CountUpStats() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
      {stats.map((stat) => (
        <StatItem key={stat.label} stat={stat} active={active} />
      ))}
    </div>
  );
}
