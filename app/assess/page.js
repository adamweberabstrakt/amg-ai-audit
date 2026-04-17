import { Suspense } from 'react';
import Link from 'next/link';
import AssessmentForm from '@/components/AssessmentForm';
 
export const metadata = {
  title: 'Start Your AI Visibility Assessment | Abstrakt Marketing Group',
  description: 'Run your free AI Visibility Assessment. Find out how your website, local presence, and brand appear to AI tools like ChatGPT and Perplexity.',
};
 
export default function AssessPage() {
  return (
    <div className="min-h-screen">
      {/* Minimal header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/brand/logo-white.png" alt="Abstrakt Marketing Group" className="dark-logo"  style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
            <img src="/brand/logo-gray.png"  alt="Abstrakt Marketing Group" className="light-logo" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
            <span className="text-gray-400">·</span>
            <span className="font-heading font-semibold text-sm uppercase tracking-widest text-gray-300">
              AI Search Radar
            </span>
          </Link>
        </div>
      </header>
 
      {/* Suspense boundary required for useSearchParams in AssessmentForm */}
      <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}>
        <AssessmentForm />
      </Suspense>
    </div>
  );
}
