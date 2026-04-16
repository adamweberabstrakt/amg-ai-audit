'use client';

import { useState, useEffect } from 'react';

export default function ShareModal({ isOpen, onClose, shareUrl }) {
  const [copied,     setCopied]     = useState(false);
  const [email,      setEmail]      = useState('');
  const [sending,    setSending]    = useState(false);
  const [sent,       setSent]       = useState(false);
  const [emailError, setEmailError] = useState('');

  // Lock body scroll; close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) { setCopied(false); setEmail(''); setSent(false); setEmailError(''); }
  }, [isOpen]);

  function copyLink() {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function sendEmail() {
    const trimmed = email.trim();
    if (!trimmed || !/\S+@\S+\.\S+/.test(trimmed)) {
      setEmailError('Enter a valid email address.');
      return;
    }
    setSending(true);
    setEmailError('');
    try {
      // Use mailto as a lightweight fallback — opens user's mail client pre-filled
      const subject = encodeURIComponent('Your AI Visibility Assessment Results');
      const body    = encodeURIComponent(
        `Hi,\n\nHere are the AI Visibility Assessment results from Abstrakt Marketing Group:\n\n${shareUrl}\n\nThis link is valid for 7 days.\n\nAbstrakt Marketing Group\nhttps://www.abstraktmg.com`
      );
      window.open(`mailto:${trimmed}?subject=${subject}&body=${body}`, '_blank');
      setSent(true);
    } finally {
      setSending(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg bg-[#1e1e1e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-brand-orange/10 to-transparent flex items-start justify-between">
          <div>
            <h3 className="font-heading text-xl font-bold text-white">Share Your Results</h3>
            <p className="text-gray-400 text-sm mt-1">Send this report to your team or save the link for later.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white flex-shrink-0 ml-4"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">

          {/* Copy link section */}
          <div>
            <p className="text-xs font-heading font-semibold uppercase tracking-widest text-gray-500 mb-2">Report Link</p>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#111] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-400 truncate font-mono">
                {shareUrl || 'Generating…'}
              </div>
              <button
                onClick={copyLink}
                disabled={!shareUrl}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-orange hover:bg-orange-600 text-white text-sm font-heading font-semibold transition-colors disabled:opacity-40 whitespace-nowrap"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1.5">Link is valid for 7 days.</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600 uppercase tracking-widest">or send via email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Email section */}
          <div>
            <p className="text-xs font-heading font-semibold uppercase tracking-widest text-gray-500 mb-2">Send to a Teammate</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); setSent(false); }}
                placeholder="colleague@company.com"
                className="flex-1 bg-[#111] border border-white/10 focus:border-brand-orange/50 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors"
              />
              <button
                onClick={sendEmail}
                disabled={sending || !email.trim() || !shareUrl}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 hover:border-white/40 text-gray-300 hover:text-white text-sm font-heading font-semibold transition-colors disabled:opacity-40 whitespace-nowrap"
              >
                {sending ? 'Opening…' : sent ? '✓ Email opened' : 'Send'}
              </button>
            </div>
            {emailError && <p className="text-xs text-red-400 mt-1.5">{emailError}</p>}
            {sent && <p className="text-xs text-green-400 mt-1.5">Your mail client opened with the report link pre-filled.</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#111] text-center">
          <button onClick={onClose} className="text-sm text-gray-500 hover:text-white transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
