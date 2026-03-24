'use client';

import { useState, useEffect } from 'react';

const LOADING_STEPS = [
  { label: 'Analyzing your website performance',   duration: 4000 },
  { label: 'Checking your local search presence',  duration: 4000 },
  { label: 'Crawling site structure & signals',    duration: 5000 },
  { label: 'Running AI visibility analysis',       duration: 6000 },
  { label: 'Generating your personalized report',  duration: 3000 },
];

export default function AuditLoading() {
  const [currentStep, setCurrentStep] = useState(0);
  const [dots, setDots] = useState('');

  // Advance through steps based on estimated durations
  useEffect(() => {
    let stepIndex = 0;

    function advance() {
      if (stepIndex >= LOADING_STEPS.length - 1) return;
      stepIndex++;
      setCurrentStep(stepIndex);
      setTimeout(advance, LOADING_STEPS[stepIndex].duration);
    }

    const timer = setTimeout(advance, LOADING_STEPS[0].duration);
    return () => clearTimeout(timer);
  }, []);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.round(((currentStep + 1) / LOADING_STEPS.length) * 100);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      {/* Animated logo / icon */}
      <div className="mb-10">
        <div className="w-20 h-20 rounded-full border-4 border-brand-orange border-t-transparent animate-spin mx-auto" />
      </div>

      <p className="section-label mb-3">Running Your Assessment</p>
      <h2 className="font-heading text-3xl font-bold mb-2">
        Analyzing Your Digital Presence{dots}
      </h2>
      <p className="text-gray-400 mb-10 max-w-md">
        Sit tight — this takes about 15–20 seconds. We're checking multiple data sources to build your complete picture.
      </p>

      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-orange rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step list */}
      <div className="w-full max-w-md space-y-3 text-left">
        {LOADING_STEPS.map((step, i) => (
          <div
            key={step.label}
            className={`flex items-center gap-3 text-sm transition-opacity duration-300 ${
              i > currentStep ? 'opacity-30' : 'opacity-100'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                i < currentStep
                  ? 'bg-brand-orange text-white'
                  : i === currentStep
                  ? 'border-2 border-brand-orange bg-transparent animate-pulse'
                  : 'bg-white/10 text-gray-600'
              }`}
            >
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className={i === currentStep ? 'text-white' : i < currentStep ? 'text-gray-400' : 'text-gray-600'}>
              {step.label}
              {i === currentStep && <span className="text-brand-orange">{dots}</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
