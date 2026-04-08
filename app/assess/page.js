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
          <Link href="/" className="flex items-center">
            <img src="/logo-orange.png" alt="Abstrakt Marketing Group" height="36" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} className="dark-logo" />
            <img src="/logo-dark.png"   alt="Abstrakt Marketing Group" height="36" style={{ height: '36px', width: 'auto', objectFit: 'contain', display: 'none' }} className="light-logo" />
          </Link>
          <p className="text-sm text-gray-400 hidden sm:block">AI Visibility Assessment</p>
        </div>
      </header>
 
      {/* Suspense boundary required for useSearchParams in AssessmentForm */}
      <Suspense fallback={<div className="text-center py-20 text-gray-400">Loading...</div>}>
        <AssessmentForm />
      </Suspense>
    </div>
  );
}
