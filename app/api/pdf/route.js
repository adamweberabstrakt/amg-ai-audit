// app/api/pdf/route.js
// PDF download for audit reports — uses PDFKit (serverless-compatible).
// Called by the "Download PDF Report" button in ReportActions.jsx.

import { NextResponse } from 'next/server';
import { generatePdf } from '@/lib/generatePdf';

export const maxDuration = 30;

export async function POST(req) {
  try {
    const { auditData, leadData } = await req.json();

    if (!auditData || !leadData) {
      return NextResponse.json({ error: 'Missing audit or lead data' }, { status: 400 });
    }

    const pdfBuffer = await generatePdf({ leadData, auditData });

    const safeCompany = (leadData.company ?? 'report').replace(/[^a-zA-Z0-9]/g, '-');
    const dateStr     = new Date().toISOString().split('T')[0];

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="ai-audit-${safeCompany}-${dateStr}.pdf"`,
        'Content-Length':      pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('[pdf] Generation error:', error);
    return NextResponse.json(
      { error: 'PDF generation failed', details: error.message },
      { status: 500 },
    );
  }
}
