'use client';

import { useState, useEffect } from 'react';

const LOADING_STEPS = [
  { label: 'Analyzing your website performance',   duration: 4000 },
  { label: 'Checking your local search presence',  duration: 4000 },
  { label: 'Crawling site structure & signals',    duration: 5000 },
  { label: 'Running AI visibility analysis',       duration: 6000 },
  { label: 'Generating your personalized report',  duration: 3000 },
];

const LOADING_FACTS = [
  {
    stat: '58%',
    label: 'Zero-Click Searches',
    body: 'Google searches now end with zero clicks because AI Overviews answer directly above organic results.',
    iconSvg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  },
  {
    stat: '10+',
    label: 'Sources per B2B Decision', 
    body: 'The average B2B buyer consults before a purchase decision. AI tools synthesize across them all.',
    iconSvg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>
  },
  {
    stat: 'Schema Markup',
    label: '#1 AI Signal',
    body: 'Structured data is the top signal AI crawlers use to interpret what a business does and serves.',
    iconSvg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  },
  {
    stat: '4+',
    label: 'Reviews Minimum',
    body: 'Businesses with fewer GBP reviews than competitors are rarely surfaced in AI local recommendations.',
    iconSvg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  },
  {
    stat: '3x',
    label: 'More Likely in AI',
    body: 'Pages with complete meta, schema, and canonical tags appear in AI-generated answers.',
    iconSvg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  },
  {
    stat: 'Brand Mentions',
    label: 'Beat Backlinks',
    body: 'For AI visibility, named references across the web feed directly into LLM training data.',
    iconSvg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  },
  {
    stat: '77%',
    label: 'Independent Research',
    body: 'B2B buyers research independently before talking to sales. AI has moved that research upstream.',
    iconSvg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
  },
  {
    stat: 'Video Content',
    label: 'In AI Overviews',
    body: 'Now factors into Google AI Overviews through YouTube, Shorts, and indexed transcripts.',
    iconSvg: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
  },
];

export default function AuditLoading() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
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

  // Cycle through facts every 5.5 seconds
  useEffect(() => {
    const factTimer = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % LOADING_FACTS.length);
    }, 5500);
    return () => clearInterval(factTimer);
  }, []);

  // Animated dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const progress = Math.round(((currentStep + 1) / LOADING_STEPS.length) * 100);
  const fact = LOADING_FACTS[currentFact];

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
      <p className="text-gray-400 mb-8 max-w-md">
        Sit tight — this takes about 15–20 seconds. We're checking multiple data sources to build your complete picture.
      </p>

      {/* Cycling fact card */}
      <div className="w-full max-w-md mb-8 p-4 rounded-xl border border-brand-orange/20 bg-brand-orange/5 transition-opacity duration-500">
        <div className="flex items-start gap-3 text-left">
          <div className="flex-shrink-0 mt-1 text-brand-orange">
            {fact.iconSvg}
          </div>
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-heading text-xl font-bold text-brand-orange">{fact.stat}</span>
              <span className="text-sm font-medium text-white">{fact.label}</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">{fact.body}</p>
          </div>
        </div>
      </div>

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
              {i < currentStep ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : i + 1}
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
