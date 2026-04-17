'use client';

export default function SectionHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Logomark - theme switching via CSS classes */}
      <img 
        src="/brand/logomark-white.png" 
        alt="" 
        aria-hidden="true" 
        className="dark-logo" 
        style={{ height: '28px', width: 'auto' }} 
      />
      <img 
        src="/brand/logomark-gray.png" 
        alt="" 
        aria-hidden="true" 
        className="light-logo" 
        style={{ height: '28px', width: 'auto' }} 
      />
      
      {/* Abstrakt wordmark */}
      <img 
        src="/brand/logo-white.png" 
        alt="Abstrakt" 
        className="dark-logo" 
        style={{ height: '20px', width: 'auto' }} 
      />
      <img 
        src="/brand/logo-gray.png" 
        alt="Abstrakt" 
        className="light-logo" 
        style={{ height: '20px', width: 'auto' }} 
      />
      
      {/* Separator + tagline */}
      <span className="text-gray-400 font-heading text-sm">·</span>
      <span className="font-heading font-semibold text-sm uppercase tracking-widest text-gray-400">
        AI Search Assessment Results
      </span>
    </div>
  );
}
