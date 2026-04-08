import { Suspense } from 'react';
import ResultsClient from './ResultsClient';

export const metadata = {
  title: 'Your AI Visibility Results | Abstrakt Marketing Group',
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
