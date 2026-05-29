// components/ReportActions.jsx
// PDF download + Bug Report suggestion box (emails adam.weber@abstraktmg.com)

'use client';

import { useState } from 'react';

export default function ReportActions({ auditData, leadData, shareId }) {
  const [pdfLoading, setPdfLoading]       = useState(false);
  const [bugOpen,    setBugOpen]          = useState(false);
  const [bugMessage, setBugMessage]       = useState('');
  const [bugSending, setBugSending]       = useState(false);
  const [bugSent,    setBugSent]          = useState(false);
  const [bugError,   setBugError]         = useState('');

  // ── PDF Download ──────────────────────────────────────────────────────
  const downloadPDF = async () => {
    setPdfLoading(true);
    try {
      const response = await fetch('/api/pdf', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ auditData, leadData, shareId }),
      });
      if (!response.ok) throw new Error('PDF generation failed');
      const blob = await response.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `ai-audit-${leadData?.company?.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      alert('PDF generation failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  // ── Bug Report Submit ─────────────────────────────────────────────────
  const submitBugReport = async () => {
    if (!bugMessage.trim()) return;
    setBugSending(true);
    setBugError('');
    try {
      const res = await fetch('/api/notify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'bug_report',
          data: {
            bugMessage,
            resultsUrl:  window.location.href,
            shareId,
            company:     leadData?.company ?? '',
            website:     leadData?.website ?? '',
            score:       auditData?.claude?.aiVisibilityScore ?? 0,
            timestamp:   new Date().toISOString(),
            toEmail:     'adam.weber@abstraktmg.com',
            subject:     'AI Search Audit Bug Report',
          },
        }),
      });
      const result = await res.json();
      if (result.success || res.ok) {
        setBugSent(true);
        setBugMessage('');
      } else {
        setBugError('Failed to send. Please try again.');
      }
    } catch {
      setBugError('Failed to send. Please try again.');
    } finally {
      setBugSending(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">

        {/* PDF Download */}
        <button
          onClick={downloadPDF}
          disabled={pdfLoading}
          className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-[#d45e00] disabled:opacity-60 text-white rounded-lg transition-colors font-medium text-sm"
        >
          {pdfLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
              Download Full PDF Report
            </>
          )}
        </button>

        {/* Report a Bug */}
        <button
          onClick={() => { setBugOpen(o => !o); setBugSent(false); setBugError(''); }}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg transition-colors font-medium text-sm border border-white/20"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Report an Issue
        </button>
      </div>

      {/* Bug Report Box */}
      {bugOpen && (
        <div className="border border-white/10 rounded-xl p-5 bg-white/5 space-y-3">
          <p className="font-heading font-semibold text-white text-sm">Report an Issue or Suggestion</p>
          <p className="text-xs text-gray-400">
            Found something wrong with your results, or have feedback about this tool? Let us know — we read every report.
          </p>
          {bugSent ? (
            <div className="flex items-center gap-2 text-green-400 text-sm py-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 flex-shrink-0">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Report sent — thanks! We'll look into it.
            </div>
          ) : (
            <>
              <textarea
                value={bugMessage}
                onChange={e => setBugMessage(e.target.value)}
                placeholder="Describe what looks wrong or what you'd like to see improved..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-orange resize-none"
              />
              {bugError && <p className="text-xs text-red-400">{bugError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={submitBugReport}
                  disabled={bugSending || !bugMessage.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-[#d45e00] disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {bugSending ? (
                    <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                  ) : 'Send Report'}
                </button>
                <button
                  onClick={() => setBugOpen(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}

    </div>
  );
}
