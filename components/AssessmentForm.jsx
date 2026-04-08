'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { captureUTMParams } from '@/lib/utmCapture';
import AuditLoading from './AuditLoading';

const TOTAL_STEPS = 3;

const INDUSTRIES = [
  'Manufacturing',
  'Technology / Software',
  'Professional Services',
  'Healthcare',
  'Construction / Trades',
  'Financial Services',
  'Logistics / Distribution',
  'Real Estate',
  'Staffing / HR',
  'Other',
];

const GOALS = [
  'Generate leads',
  'Book appointments',
  'Sell products online',
  'Build brand awareness',
];

const BUDGET_RANGES = [
  'Under $2,500/mo',
  '$2,500 – $5,000/mo',
  '$5,000 – $10,000/mo',
  '$10,000 – $25,000/mo',
  '$25,000+/mo',
];

const AI_TOOLS = ['ChatGPT', 'Perplexity', 'Google AI Overview', 'Not sure'];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AssessmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [utmParams, setUtmParams] = useState({});
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    // Step 1 — Contact Info
    firstName:  '',
    lastName:   '',
    email:      '',
    phone:      '',
    company:    '',
    website:    '',
    // Step 2 — Business Context
    industry:       '',
    goal:           '',
    budgetRange:    '',
    runningPaidAds: '',
    // Step 3 — Brand Maturity
    brandRating:    3,
    hasSocialMedia: '',
    competitor1:    '',
    competitor2:    '',
    aiToolsUsed:        [],
    requestReviewCall:  true,  // opt-in by default
  });

  // Capture UTM params on mount
  useEffect(() => {
    const params = captureUTMParams(searchParams);
    setUtmParams(params);

    // Restore from sessionStorage if user navigated back
    const saved = sessionStorage.getItem('assessmentFormData');
    if (saved) {
      try { setFormData(JSON.parse(saved)); } catch {}
    }
  }, [searchParams]);

  // Persist form data to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem('assessmentFormData', JSON.stringify(formData));
  }, [formData]);

  function update(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function toggleAITool(tool) {
    setFormData((prev) => {
      const current = prev.aiToolsUsed;
      return {
        ...prev,
        aiToolsUsed: current.includes(tool)
          ? current.filter((t) => t !== tool)
          : [...current, tool],
      };
    });
  }

  // ─── Validation ──────────────────────────────────────────────────────────
  function validateStep(stepNum) {
    const errs = {};
    if (stepNum === 1) {
      if (!formData.firstName.trim())  errs.firstName = 'Required';
      if (!formData.lastName.trim())   errs.lastName  = 'Required';
      if (!formData.email.trim())      errs.email     = 'Required';
      if (!formData.company.trim())    errs.company   = 'Required';
      if (!formData.website.trim())    errs.website   = 'Required';
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        errs.email = 'Enter a valid email';
      }
    }
    if (stepNum === 2) {
      if (!formData.industry)       errs.industry       = 'Required';
      if (!formData.goal)           errs.goal           = 'Required';
      if (!formData.budgetRange)    errs.budgetRange    = 'Required';
      if (!formData.runningPaidAds) errs.runningPaidAds = 'Required';
    }
    return errs;
  }

  function nextStep() {
    const errs = validateStep(step);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function prevStep() {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit() {
    setIsLoading(true);

    // Generate UUID now so the results URL is known before the webhook fires
    const shareId    = crypto.randomUUID();
    const resultsUrl = `${window.location.origin}/results?id=${shareId}`;
    const payload    = { ...formData, ...utmParams, resultsUrl };

    try {
      // 1. Fire Zapier webhook (lead capture) — includes resultsUrl
      fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {}); // silent fail

      // 2. Run the audit (parallel: PageSpeed + Places + Crawl + Claude)
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const auditData = await res.json();

      if (!res.ok) throw new Error(auditData.error || 'Audit failed');

      // 3. Save results using the pre-generated UUID so the URL is predictable
      try {
        await fetch('/api/share', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ id: shareId, auditData, leadData: payload }),
        });
      } catch {
        // Fallback to sessionStorage if share API fails
        sessionStorage.setItem('auditResults', JSON.stringify(auditData));
        sessionStorage.setItem('leadData',     JSON.stringify(payload));
      }
      router.push(`/results?id=${shareId}`);
    } catch (err) {
      console.error('Audit error:', err);
      setIsLoading(false);
      alert('Something went wrong. Please try again.');
    }
  }

  if (isLoading) return <AuditLoading />;

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <StepProgress current={step} total={TOTAL_STEPS} />

        {step === 1 && <Step1 formData={formData} update={update} errors={errors} />}
        {step === 2 && <Step2 formData={formData} update={update} errors={errors} />}
        {step === 3 && <Step3 formData={formData} update={update} toggleAITool={toggleAITool} />}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button onClick={prevStep} className="btn-secondary">
              ← Back
            </button>
          ) : <div />}

          {step < TOTAL_STEPS ? (
            <button onClick={nextStep} className="btn-primary">
              Next →
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary">
              Run My Assessment →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Step Progress ────────────────────────────────────────────────────────────
function StepProgress({ current, total }) {
  const labels = ['Contact Info', 'Business Context', 'Brand Maturity'];
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-2">
        {labels.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i + 1 <= current ? 'bg-brand-orange text-white' : 'bg-white/10 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i + 1 <= current ? 'text-white' : 'text-gray-500'}`}>
              {label}
            </span>
            {i < total - 1 && (
              <div className={`h-px w-8 sm:w-16 mx-2 ${i + 1 < current ? 'bg-brand-orange' : 'bg-white/10'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 1: Contact Info ─────────────────────────────────────────────────────
function Step1({ formData, update, errors }) {
  return (
    <div>
      <p className="section-label mb-2">Step 1 of 3</p>
      <h2 className="font-heading text-3xl font-bold mb-2">Let's get started</h2>
      <p className="text-gray-400 mb-8">We'll send your full report to this email after your assessment.</p>

      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name *" error={errors.firstName}>
          <input type="text" value={formData.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Jane" />
        </Field>
        <Field label="Last Name *" error={errors.lastName}>
          <input type="text" value={formData.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Smith" />
        </Field>
      </div>

      <Field label="Work Email *" error={errors.email}>
        <input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)} placeholder="jane@company.com" />
      </Field>

      <Field label="Phone" error={errors.phone}>
        <input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(555) 000-0000" />
      </Field>

      <Field label="Company Name *" error={errors.company}>
        <input type="text" value={formData.company} onChange={(e) => update('company', e.target.value)} placeholder="Acme Corp" />
      </Field>

      <Field label="Website URL *" error={errors.website}>
        <input type="url" value={formData.website} onChange={(e) => update('website', e.target.value)} placeholder="https://acmecorp.com" />
      </Field>
    </div>
  );
}

// ─── Step 2: Business Context ─────────────────────────────────────────────────
function Step2({ formData, update, errors }) {
  return (
    <div>
      <p className="section-label mb-2">Step 2 of 3</p>
      <h2 className="font-heading text-3xl font-bold mb-2">Tell us about your business</h2>
      <p className="text-gray-400 mb-8">This helps us tailor your AI Visibility report to your industry and goals.</p>

      <Field label="Industry *" error={errors.industry}>
        <select value={formData.industry} onChange={(e) => update('industry', e.target.value)}>
          <option value="">Select your industry</option>
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </Field>

      <Field label="Primary website goal *" error={errors.goal}>
        <div className="grid grid-cols-2 gap-3 mt-1">
          {GOALS.map((g) => (
            <RadioCard key={g} label={g} selected={formData.goal === g} onClick={() => update('goal', g)} />
          ))}
        </div>
      </Field>

      <Field label="Monthly marketing budget *" error={errors.budgetRange}>
        <select value={formData.budgetRange} onChange={(e) => update('budgetRange', e.target.value)}>
          <option value="">Select a range</option>
          {BUDGET_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field>

      <Field label="Are you currently running paid ads? *" error={errors.runningPaidAds}>
        <div className="flex gap-4 mt-1">
          {['Yes', 'No'].map((v) => (
            <RadioCard key={v} label={v} selected={formData.runningPaidAds === v} onClick={() => update('runningPaidAds', v)} />
          ))}
        </div>
      </Field>
    </div>
  );
}

// ─── Step 3: Brand Maturity ───────────────────────────────────────────────────
function Step3({ formData, update, toggleAITool }) {
  return (
    <div>
      <p className="section-label mb-2">Step 3 of 3</p>
      <h2 className="font-heading text-3xl font-bold mb-2">One last thing</h2>
      <p className="text-gray-400 mb-8">This helps our AI score how well-established your brand is in your market.</p>

      <Field label="How well-known is your brand in your market?">
        <div className="mt-2">
          <input
            type="range"
            min={1} max={5}
            value={formData.brandRating}
            onChange={(e) => update('brandRating', Number(e.target.value))}
            className="w-full accent-brand-orange"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Just getting started</span>
            <span>Very well-known</span>
          </div>
          <p className="text-brand-orange font-heading text-sm mt-2">
            Rating: {formData.brandRating}/5
          </p>
        </div>
      </Field>

      <Field label="Active social media profiles?">
        <div className="flex gap-4 mt-1">
          {['Yes', 'No', 'Some'].map((v) => (
            <RadioCard key={v} label={v} selected={formData.hasSocialMedia === v} onClick={() => update('hasSocialMedia', v)} />
          ))}
        </div>
      </Field>

      <Field label="Top competitor URLs (optional)">
        <input type="url" value={formData.competitor1} onChange={(e) => update('competitor1', e.target.value)} placeholder="https://competitor.com" className="mb-3" />
        <input type="url" value={formData.competitor2} onChange={(e) => update('competitor2', e.target.value)} placeholder="https://competitor2.com" />
      </Field>

      <Field label="Which AI tools do your customers use? (select all that apply)">
        <div className="grid grid-cols-2 gap-3 mt-1">
          {AI_TOOLS.map((tool) => (
            <RadioCard
              key={tool}
              label={tool}
              selected={formData.aiToolsUsed.includes(tool)}
              onClick={() => toggleAITool(tool)}
              multi
            />
          ))}
        </div>
      </Field>

      {/* ── Opt-in: request review call — checked by default ── */}
      <div className="mt-6 p-4 rounded-xl border border-brand-orange/30 bg-brand-orange/5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.requestReviewCall}
            onChange={(e) => update('requestReviewCall', e.target.checked)}
            className="mt-1 w-4 h-4 accent-brand-orange flex-shrink-0 cursor-pointer"
          />
          <div>
            <p className="text-sm font-medium text-white">
              Yes, I'd like an Abstrakt team member to walk through my results with me.
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              We'll reach out within 1 business day to schedule a free 20-minute review call.
            </p>
          </div>
        </label>
      </div>
    </div>
  );
}

// ─── Shared UI Primitives ─────────────────────────────────────────────────────
function Field({ label, children, error }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <div className="[&_input]:w-full [&_input]:bg-brand-dark [&_input]:border [&_input]:border-white/20 [&_input]:rounded [&_input]:px-4 [&_input]:py-3 [&_input]:text-white [&_input]:placeholder-gray-600 [&_input]:focus:outline-none [&_input]:focus:border-brand-orange [&_select]:w-full [&_select]:bg-brand-dark [&_select]:border [&_select]:border-white/20 [&_select]:rounded [&_select]:px-4 [&_select]:py-3 [&_select]:text-white [&_select]:focus:outline-none [&_select]:focus:border-brand-orange">
        {children}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function RadioCard({ label, selected, onClick, multi }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-3 rounded border text-sm font-medium text-left transition-colors ${
        selected
          ? 'border-brand-orange bg-brand-orange/10 text-white'
          : 'border-white/20 text-gray-400 hover:border-white/40'
      }`}
    >
      {selected && <span className="mr-1">{multi ? '✓' : '●'}</span>}
      {label}
    </button>
  );
}
