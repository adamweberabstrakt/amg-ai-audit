'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { captureUTMParams } from '@/lib/utmCapture';
import AuditLoading from './AuditLoading';

const TOTAL_STEPS = 3;

const INDUSTRIES = [
  'Accounting','Architecture','Automotive','B2B SaaS','Cleaning',
  'Commercial Printing','Construction','Consulting','Cybersecurity','E-commerce',
  'Education','Electrical Services','Engineering Services','Environmental Services',
  'Event Management','Facilities Management','Finance','Financial Services',
  'Fleet Management','Flooring','Healthcare','HVAC','Industrial Equipment',
  'Insurance','Janitorial Services','Landscaping','LED Lighting','Legal Services',
  'Logistics & Supply Chain','Managed Services (IT)','Manufacturing',
  'Marketing Services','Merchant Services','Outsourced HR','Painting','Paving',
  'Pest Control','Plumbing','Professional Services','Property Management',
  'Real Estate','Roofing','Security Services','Solar','Staffing & Recruiting',
  'Technology','Telecom','Training & Development','Warehousing & Distribution',
  'Waste Management','Other',
];

const GOALS = [
  { label: 'Generate leads', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { label: 'Book appointments', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { label: 'Sell products online', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> },
  { label: 'Build brand awareness', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
];

const BUDGET_RANGES = [
  'Under $2,500/mo','$2,500 – $5,000/mo','$5,000 – $10,000/mo',
  '$10,000 – $25,000/mo','$25,000+/mo',
];

const BRAND_LABELS = ['Just starting','Early stage','Growing','Established','Market leader'];
const AI_TOOLS = ['ChatGPT','Perplexity','Google AI Overview','Not sure'];
const VIDEO_CHANNELS = ['TV', 'YouTube', 'Social (TikTok/Reels)', 'Online video ads', 'Sales videos'];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AssessmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep]       = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [utmParams, setUtmParams] = useState({});
  const [errors, setErrors]   = useState({});
  const formOpenTime = useState(() => Date.now())[0];
  const honeypotRef  = useRef(null);

  const [formData, setFormData] = useState({
    firstName:'', lastName:'', email:'', phone:'', company:'', website:'',
    industry:'', goal:'', budgetRange:'', runningPaidAds:'',
    brandRating:3, hasSocialMedia:'', 
    competitors: ['', '', '', ''], // Support up to 4 competitors
    usesVideo: '', // Yes/No for video marketing
    videoChannels: [], // Array of selected video channels
    aiToolsUsed:[], requestReviewCall:true,
  });

  useEffect(() => {
    const params = captureUTMParams(searchParams);
    setUtmParams(params);
    const saved = sessionStorage.getItem('assessmentFormData');
    if (saved) { try { setFormData(JSON.parse(saved)); } catch {} }
  }, [searchParams]);

  useEffect(() => {
    sessionStorage.setItem('assessmentFormData', JSON.stringify(formData));
  }, [formData]);

  function update(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function toggleAITool(tool) {
    setFormData((prev) => ({
      ...prev,
      aiToolsUsed: prev.aiToolsUsed.includes(tool)
        ? prev.aiToolsUsed.filter((t) => t !== tool)
        : [...prev.aiToolsUsed, tool],
    }));
  }

  function updateCompetitor(index, value) {
    setFormData((prev) => ({
      ...prev,
      competitors: prev.competitors.map((comp, i) => i === index ? value : comp),
    }));
  }

  function addCompetitor() {
    const visibleCount = formData.competitors.filter(Boolean).length;
    if (visibleCount < 4) {
      // Find first empty slot
      const emptyIndex = formData.competitors.findIndex(comp => !comp);
      if (emptyIndex !== -1) {
        // Focus will be added automatically when the input appears
      }
    }
  }

  function toggleVideoChannel(channel) {
    setFormData((prev) => ({
      ...prev,
      videoChannels: prev.videoChannels.includes(channel)
        ? prev.videoChannels.filter((c) => c !== channel)
        : [...prev.videoChannels, channel],
    }));
  }

  function validateStep(stepNum) {
    const errs = {};
    if (stepNum === 1) {
      if (!formData.firstName.trim()) errs.firstName = 'Required';
      if (!formData.lastName.trim())  errs.lastName  = 'Required';
      if (!formData.email.trim())     errs.email     = 'Required';
      if (!formData.company.trim())   errs.company   = 'Required';
      if (!formData.website.trim())   errs.website   = 'Required';
      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Enter a valid email';
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
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function prevStep() {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleSubmit() {
    setIsLoading(true);
    const shareId    = crypto.randomUUID();
    const resultsUrl = `${window.location.origin}/results?id=${shareId}`;
    
    // Build payload with backward compatibility for competitors
    const payload = { 
      ...formData, 
      ...utmParams, 
      resultsUrl, 
      _hp: honeypotRef.current?.value ?? '', 
      _t: formOpenTime,
      // Backward compatibility: populate old competitor1/competitor2 fields
      competitor1: formData.competitors[0] || '',
      competitor2: formData.competitors[1] || '',
      // New format: competitors array (for new backend)
      competitors: formData.competitors,
    };

    try {
      fetch('/api/webhook', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }).catch(()=>{});
      const res = await fetch('/api/audit', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) });
      const auditData = await res.json();
      if (!res.ok) throw new Error(auditData.error || 'Audit failed');
      try {
        await fetch('/api/share', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ id:shareId, auditData, leadData:payload }) });
      } catch {
        sessionStorage.setItem('auditResults', JSON.stringify(auditData));
        sessionStorage.setItem('leadData', JSON.stringify(payload));
      }
      sessionStorage.removeItem('assessmentFormData');
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
        <StepProgress current={step} total={TOTAL_STEPS} />

        {/* Honeypot — hidden from real users, bots fill this */}
        <input ref={honeypotRef} type="text" name="_hp" tabIndex={-1} autoComplete="off"
          aria-hidden="true" style={{ display: 'none' }} />

        <div style={{ animation: 'stepFadeIn 0.3s ease-out' }}>
          {step === 1 && <Step1 formData={formData} update={update} errors={errors} />}
          {step === 2 && <Step2 formData={formData} update={update} errors={errors} />}
          {step === 3 && <Step3 formData={formData} update={update} toggleAITool={toggleAITool} 
                                 updateCompetitor={updateCompetitor} addCompetitor={addCompetitor} 
                                 toggleVideoChannel={toggleVideoChannel} />}
        </div>

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button onClick={prevStep} className="btn-secondary inline-flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back
            </button>
          ) : <div />}
          {step < TOTAL_STEPS ? (
            <button onClick={nextStep} className="btn-primary inline-flex items-center gap-2">
              Next
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary inline-flex items-center gap-2">
              Run My Assessment
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          )}
        </div>
      </div>
      <p className="text-center text-xs text-gray-600 mt-4">
        By submitting, you agree to our{' '}
        <a href="https://www.abstraktmg.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400 transition-colors">Privacy Policy</a>
        {' '}and{' '}
        <a href="https://www.abstraktmg.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-400 transition-colors">Terms of Service</a>.
      </p>
      <style>{`@keyframes stepFadeIn { from { opacity:0; transform:translateX(16px); } to { opacity:1; transform:translateX(0); } }`}</style>
    </div>
  );
}

// ─── Step Progress ────────────────────────────────────────────────────────────
function StepProgress({ current, total }) {
  const steps = ['Contact Info','Business Context','Brand Maturity'];
  return (
    <div className="mb-12">
      <div className="flex items-start justify-between">
        {steps.map((label, i) => {
          const num      = i + 1;
          const done     = num < current;
          const active   = num === current;
          const isLast   = i === steps.length - 1;
          return (
            <div key={label} className="flex items-start flex-1">
              {/* Node */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-heading font-semibold text-base transition-all duration-300 ${
                  done   ? 'bg-green-500 text-white shadow-[0_0_14px_rgba(34,197,94,0.35)]' :
                  active ? 'bg-brand-orange text-white shadow-[0_0_18px_rgba(232,93,4,0.35)] border-2 border-brand-orange' :
                           'bg-white/10 text-gray-500 border-2 border-white/10'
                }`}>
                  {done ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : num}
                </div>
                <span className={`text-xs font-medium text-center leading-tight max-w-[80px] transition-colors ${
                  done ? 'text-green-400' : active ? 'text-white' : 'text-gray-600'
                }`}>{label}</span>
              </div>
              {/* Connector */}
              {!isLast && (
                <div className="flex-1 mx-3 mt-5 h-[2px] rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: done ? '100%' : '0%' }} />
                </div>
              )}
            </div>
          );
        })}
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
        <IconField label="First Name *" icon={<UserIcon />} error={errors.firstName}>
          <input type="text" value={formData.firstName} onChange={(e) => update('firstName', e.target.value)} placeholder="Jane" />
        </IconField>
        <IconField label="Last Name *" icon={<UserIcon />} error={errors.lastName}>
          <input type="text" value={formData.lastName} onChange={(e) => update('lastName', e.target.value)} placeholder="Smith" />
        </IconField>
      </div>

      <IconField label="Work Email *" icon={<MailIcon />} error={errors.email}>
        <input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)} placeholder="jane@company.com" />
      </IconField>

      <IconField label="Phone" icon={<PhoneIcon />} error={errors.phone}>
        <input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)} placeholder="(555) 000-0000" />
      </IconField>

      <IconField label="Company Name *" icon={<BuildingIcon />} error={errors.company}>
        <input type="text" value={formData.company} onChange={(e) => update('company', e.target.value)} placeholder="Acme Corp" />
      </IconField>

      <IconField label="Website URL *" icon={<GlobeIcon />} error={errors.website}>
        <input type="url" value={formData.website} onChange={(e) => update('website', e.target.value)} placeholder="https://acmecorp.com" />
      </IconField>
    </div>
  );
}

// ─── Step 2: Business Context ─────────────────────────────────────────────────
function Step2({ formData, update, errors }) {
  return (
    <div>
      <p className="section-label mb-2">Step 2 of 3</p>
      <h2 className="font-heading text-3xl font-bold mb-2">Tell us about your business</h2>
      <p className="text-gray-400 mb-8">This helps us tailor your competitor analysis to your industry and goals.</p>

      <Field label="Industry *" error={errors.industry}>
        <select value={formData.industry} onChange={(e) => update('industry', e.target.value)}
          className="w-full bg-[#222] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange">
          <option value="">Select your industry</option>
          {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </Field>

      <Field label="Primary website goal *" error={errors.goal}>
        <div className="grid grid-cols-2 gap-3 mt-1">
          {GOALS.map((g) => (
            <IconSelectBtn key={g.label} label={g.label} icon={g.icon}
              selected={formData.goal === g.label} onClick={() => update('goal', g.label)} />
          ))}
        </div>
      </Field>

      <Field label="Monthly marketing budget *" error={errors.budgetRange}>
        <select value={formData.budgetRange} onChange={(e) => update('budgetRange', e.target.value)}
          className="w-full bg-[#222] border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-orange">
          <option value="">Select a range</option>
          {BUDGET_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field>

      <Field label="Are you currently running paid ads? *" error={errors.runningPaidAds}>
        <div className="flex gap-3 mt-1">
          {['Yes','No'].map((v) => (
            <IconSelectBtn key={v} label={v} selected={formData.runningPaidAds === v}
              onClick={() => update('runningPaidAds', v)} />
          ))}
        </div>
      </Field>
    </div>
  );
}

// ─── Step 3: Brand Maturity ───────────────────────────────────────────────────
function Step3({ formData, update, toggleAITool, updateCompetitor, addCompetitor, toggleVideoChannel }) {
  const pct = ((formData.brandRating - 1) / 4) * 100;
  const visibleCompetitors = formData.competitors.filter((comp, i) => comp || i < 2); // Always show first 2
  const canAddMore = visibleCompetitors.length < 4 && formData.competitors.filter(Boolean).length < 4;
  
  return (
    <div>
      <p className="section-label mb-2">Step 3 of 3</p>
      <h2 className="font-heading text-3xl font-bold mb-2">One last thing</h2>
      <p className="text-gray-400 mb-8">Helps our AI benchmark your brand maturity vs. competitors in your market.</p>

      <Field label="How well-known is your brand in your market?">
        <div className="mt-3">
          <input type="range" min={1} max={5} value={formData.brandRating}
            onChange={(e) => update('brandRating', Number(e.target.value))}
            className="w-full"
            style={{
              WebkitAppearance:'none', height:'6px', borderRadius:'3px', outline:'none', cursor:'pointer',
              background:`linear-gradient(to right, #E85D04 0%, #E85D04 ${pct}%, rgba(255,255,255,0.1) ${pct}%)`
            }}
          />
          {/* Stop dots */}
          <div className="flex justify-between px-0.5 -mt-1">
            {[1,2,3,4,5].map((n) => (
              <div key={n} className={`w-2 h-2 rounded-full transition-colors ${n <= formData.brandRating ? 'bg-brand-orange' : 'bg-white/15'}`} />
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Just starting</span>
            <span className="text-xs text-gray-500">Very well-known</span>
          </div>
          <p className="text-brand-orange font-heading text-sm mt-2 text-center">
            {BRAND_LABELS[formData.brandRating - 1]} ({formData.brandRating}/5)
          </p>
        </div>
      </Field>

      <Field label="Active social media profiles?">
        <div className="flex gap-3 mt-1">
          {['Yes','No','Some'].map((v) => (
            <IconSelectBtn key={v} label={v} selected={formData.hasSocialMedia === v}
              onClick={() => update('hasSocialMedia', v)} />
          ))}
        </div>
      </Field>

      <Field label="Do you use video marketing?">
        <div className="flex gap-3 mt-1">
          {['Yes','No'].map((v) => (
            <IconSelectBtn key={v} label={v} selected={formData.usesVideo === v}
              onClick={() => update('usesVideo', v)} />
          ))}
        </div>
      </Field>

      {formData.usesVideo === 'Yes' && (
        <Field label="Which video channels do you use? (select all that apply)">
          <div className="grid grid-cols-2 gap-3 mt-1">
            {VIDEO_CHANNELS.map((channel) => (
              <IconSelectBtn key={channel} label={channel} selected={formData.videoChannels.includes(channel)}
                onClick={() => toggleVideoChannel(channel)} multi />
            ))}
          </div>
        </Field>
      )}

      <Field label="Top competitor URLs (optional)">
        {visibleCompetitors.map((_, index) => (
          <IconField key={index} icon={<GlobeIcon />}>
            <input 
              type="url" 
              value={formData.competitors[index]} 
              onChange={(e) => updateCompetitor(index, e.target.value)}
              placeholder={`https://competitor${index + 1}.com`} 
              className={index < visibleCompetitors.length - 1 ? "mb-3" : ""} 
            />
          </IconField>
        ))}
        {canAddMore && (
          <button 
            type="button" 
            onClick={addCompetitor}
            className="text-sm text-brand-orange hover:text-orange-400 transition-colors font-medium"
          >
            + Add competitor
          </button>
        )}
      </Field>

      <Field label="Which AI tools do your customers use? (select all that apply)">
        <div className="grid grid-cols-2 gap-3 mt-1">
          {AI_TOOLS.map((tool) => (
            <IconSelectBtn key={tool} label={tool} selected={formData.aiToolsUsed.includes(tool)}
              onClick={() => toggleAITool(tool)} multi />
          ))}
        </div>
      </Field>

      <div className="mt-6 p-5 rounded-xl border border-brand-orange/30 bg-brand-orange/5">
        <label className="flex items-start gap-3 cursor-pointer">
          <div className="relative mt-0.5 flex-shrink-0">
            <input type="checkbox" checked={formData.requestReviewCall}
              onChange={(e) => update('requestReviewCall', e.target.checked)}
              className="sr-only" />
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              formData.requestReviewCall ? 'bg-brand-orange border-brand-orange' : 'bg-transparent border-brand-orange/40'
            }`}
              onClick={() => update('requestReviewCall', !formData.requestReviewCall)}>
              {formData.requestReviewCall && (
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Yes, I'd like an Abstrakt team member to walk through my results with me.</p>
            <p className="text-xs text-gray-400 mt-0.5">We'll reach out within 1 business day to schedule a free 20-minute review call.</p>
          </div>
        </label>
      </div>
    </div>
  );
}

// ─── UI Primitives ────────────────────────────────────────────────────────────
function Field({ label, children, error }) {
  return (
    <div className="mb-5">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function IconField({ label, icon, error, children }) {
  return (
    <div className="mb-5">
      {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
      <div className={`flex items-center bg-[#222] border rounded-lg overflow-hidden transition-all focus-within:border-brand-orange focus-within:shadow-[0_0_0_3px_rgba(232,93,4,0.1)] ${error ? 'border-red-500' : 'border-white/20'}`}>
        {icon && <span className="pl-4 text-gray-500 flex-shrink-0">{icon}</span>}
        <div className="flex-1 [&_input]:w-full [&_input]:bg-transparent [&_input]:border-none [&_input]:outline-none [&_input]:px-3 [&_input]:py-3 [&_input]:text-white [&_input]:placeholder-gray-600">
          {children}
        </div>
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function IconSelectBtn({ label, icon, selected, onClick, multi }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium text-left transition-all duration-200 ${
        selected
          ? 'border-brand-orange bg-brand-orange/10 text-white shadow-[0_0_0_1px_rgba(232,93,4,0.3)]'
          : 'border-white/15 bg-[#222] text-gray-400 hover:border-white/30 hover:bg-white/5'
      }`}>
      {icon && (
        <span className={`flex-shrink-0 transition-colors ${selected ? 'text-brand-orange' : 'text-gray-600'}`}>
          {icon}
        </span>
      )}
      <span className="flex-1">{label}</span>
      {/* Check indicator */}
      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
        selected ? 'bg-brand-orange border-brand-orange' : 'border-gray-600'
      }`}>
        {selected && <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3"><polyline points="20 6 9 17 4 12"/></svg>}
      </span>
    </button>
  );
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const UserIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const MailIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>;
const PhoneIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const BuildingIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const GlobeIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
