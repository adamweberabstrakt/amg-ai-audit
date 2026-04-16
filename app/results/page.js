import { Suspense } from 'react';
import ResultsClient from './ResultsClient';

export const metadata = {
  title: 'Your AI Visibility Results | Abstrakt Marketing Group',
  description: 'Your free AI Visibility Assessment is ready. See how you stack up against competitors in AI search — and what to do about it.',
  openGraph: {
    title: 'Your AI Visibility Results | Abstrakt Marketing Group',
    description: 'See how your business stacks up against competitors in AI search.',
    images: [{ url: 'https://audit.abstraktmg.com/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['https://audit.abstraktmg.com/og-image.png'],
  },
};

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-orange border-t-transparent animate-spin" />
      </div>
    }>
      <ResultsClient />
    </Suspense>
  );
}
