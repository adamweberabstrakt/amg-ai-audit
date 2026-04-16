'use client';

import { useEffect, useState } from 'react';

// GDPR/CCPA cookie consent banner.
// GTM is already loaded in layout.js with consent defaulted to 'denied'.
// On Accept: fires a GTM consent_update event → GTM handles firing all tags
// (Meta Pixel, LinkedIn, Google Ads, GA4) based on your GTM consent configuration.
// No pixel IDs needed here — GTM manages everything.

export default function CookieBanner() {
  const [visible,    setVisible]    = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [prefs,      setPrefs]      = useState({ analytics: true, marketing: true });

  useEffect(() => {
    const saved = localStorage.getItem('cookie_consent');
    if (!saved) {
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
    try { applyConsent(JSON.parse(saved)); } catch {}
  }, []);

  function applyConsent(consent) {
    if (typeof window === 'undefined') return;
    // Use gtag consent update (defined in layout.js) — this is the correct Consent Mode v2 approach
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage:          consent.marketing ? 'granted' : 'denied',
        analytics_storage:   consent.analytics ? 'granted' : 'denied',
        ad_user_data:        consent.marketing ? 'granted' : 'denied',
        ad_personalization:  consent.marketing ? 'granted' : 'denied',
      });
    }
    // Also push to dataLayer for GTM trigger listeners
    if (window.dataLayer) {
      window.dataLayer.push({ event: 'consent_update' });
    }
  }

  function accept() {
    const consent = { analytics: true, marketing: true };
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    applyConsent(consent);
    setVisible(false);
  }

  function decline() {
    const consent = { analytics: true, marketing: false };
    localStorage.setItem('cookie_consent', JSON.stringify(consent));
    applyConsent(consent);
    setVisible(false);
  }

  function savePrefs() {
    localStorage.setItem('cookie_consent', JSON.stringify(prefs));
    applyConsent(prefs);
    setVisible(false);
    setShowManage(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-[#1e1e1e] border border-white/15 rounded-2xl shadow-2xl p-5 sm:p-6">
        {!showManage ? (
          <>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 font-heading">Cookie Preferences</p>
            <p className="text-sm text-gray-300 mb-4 leading-relaxed">
              We use cookies to analyze site performance and deliver relevant ads. By clicking{' '}
              <strong className="text-white">Accept All</strong>, you consent to our use of analytics and
              marketing cookies. You can manage preferences at any time.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={accept}  className="btn-primary text-sm px-6 py-2.5">Accept All</button>
              <button onClick={decline} className="btn-secondary text-sm px-6 py-2.5">Analytics Only</button>
              <button onClick={() => setShowManage(true)} className="text-sm text-gray-400 hover:text-white underline underline-offset-2 transition-colors px-2">
                Manage
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3 font-heading">Manage Cookie Preferences</p>
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Necessary</p>
                  <p className="text-xs text-gray-500">Required for the site to function. Cannot be disabled.</p>
                </div>
                <span className="text-xs text-gray-500 font-medium">Always On</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <div>
                  <p className="text-sm font-medium text-white">Analytics</p>
                  <p className="text-xs text-gray-500">Helps us understand how visitors use the site (GA4).</p>
                </div>
                <ToggleSwitch on={prefs.analytics} onChange={(v) => setPrefs(p => ({ ...p, analytics: v }))} />
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <div>
                  <p className="text-sm font-medium text-white">Marketing & Retargeting</p>
                  <p className="text-xs text-gray-500">Google Ads, Meta Pixel, LinkedIn — managed via GTM.</p>
                </div>
                <ToggleSwitch on={prefs.marketing} onChange={(v) => setPrefs(p => ({ ...p, marketing: v }))} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={savePrefs} className="btn-primary text-sm px-6 py-2.5">Save Preferences</button>
              <button onClick={() => setShowManage(false)} className="text-sm text-gray-400 hover:text-white transition-colors">← Back</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ToggleSwitch({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-brand-orange' : 'bg-white/20'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${on ? 'translate-x-4' : ''}`} />
    </button>
  );
}
