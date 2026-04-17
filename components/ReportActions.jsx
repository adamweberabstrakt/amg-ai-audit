// components/ReportActions.jsx
// PDF download and notification integration for audit results

'use client';

import { useState } from 'react';

export default function ReportActions({ auditData, leadData, shareId }) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [notifying, setNotifying] = useState(false);
  const [notificationResult, setNotificationResult] = useState(null);

  // Generate and download PDF report
  const downloadPDF = async () => {
    setPdfLoading(true);
    
    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auditData, leadData, shareId }),
      });

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      // Get the PDF blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-audit-${leadData?.company?.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('PDF download error:', error);
      alert('PDF generation failed. Please try again.');
    } finally {
      setPdfLoading(false);
    }
  };

  // Send notification to configured channels
  const sendNotification = async (type = 'audit_completed') => {
    setNotifying(true);
    setNotificationResult(null);

    try {
      const notificationData = {
        ...leadData,
        score: auditData?.claude?.aiVisibilityScore || 0,
        urgency: auditData?.claude?.urgencyLevel || 'medium',
        resultsUrl: window.location.href,
        shareId,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data: notificationData }),
      });

      const result = await response.json();
      setNotificationResult(result);
      
      if (!result.success) {
        console.warn('Some notifications failed:', result);
      }
      
    } catch (error) {
      console.error('Notification error:', error);
      setNotificationResult({
        success: false,
        error: 'Notification system unavailable'
      });
    } finally {
      setNotifying(false);
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
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium text-sm"
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
              Download PDF Report
            </>
          )}
        </button>

        {/* Send Notification */}
        <button
          onClick={() => sendNotification()}
          disabled={notifying}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg transition-colors font-medium text-sm"
        >
          {notifying ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              Notify Team
            </>
          )}
        </button>

      </div>

      {/* Notification Result */}
      {notificationResult && (
        <div className={`p-3 rounded-lg text-sm ${
          notificationResult.success 
            ? 'bg-green-900/50 border border-green-600 text-green-300' 
            : 'bg-red-900/50 border border-red-600 text-red-300'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            {notificationResult.success ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            )}
            <span className="font-medium">
              {notificationResult.success 
                ? `Notification sent (${notificationResult.successfulChannels}/${notificationResult.totalChannels} channels)`
                : 'Notification failed'
              }
            </span>
          </div>
          
          {notificationResult.results && (
            <div className="space-y-1">
              {notificationResult.results.map((result, index) => (
                <div key={index} className="flex items-center gap-2 text-xs opacity-80">
                  <span className="capitalize font-medium">{result.channel}:</span>
                  <span className={result.success ? 'text-green-400' : 'text-red-400'}>
                    {result.success ? 'Success' : result.error}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Environment Status */}
      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Notification Channels:</strong></p>
        <div className="flex flex-wrap gap-4">
          <span>Teams: {process.env.NEXT_PUBLIC_TEAMS_AVAILABLE ? '✅ Configured' : '❌ Not configured'}</span>
          <span>Email: {process.env.NEXT_PUBLIC_BREVO_AVAILABLE ? '✅ Configured' : '❌ Not configured'}</span>
        </div>
      </div>
      
    </div>
  );
}
