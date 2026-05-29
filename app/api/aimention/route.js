// app/api/aimention/route.js
// Lazy-loaded AI mention check. Called from the results page after the fast
// audit returns. Accepts ?company=...&industry=...&city=... (city optional).
// Returns { openaiMention: {...} } or { openaiMention: null } on failure.

import { NextResponse } from 'next/server';
import { runOpenAIMention } from '../providers/openai-mention';

export const maxDuration = 45;
export const dynamic     = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const company  = searchParams.get('company')?.slice(0, 150) ?? '';
    const industry = searchParams.get('industry')?.slice(0, 100) ?? '';
    const address  = searchParams.get('address')?.slice(0, 300) ?? '';

    if (!company || !industry) {
      return NextResponse.json({ error: 'Missing company or industry' }, { status: 400 });
    }

    // Re-hydrate a minimal placesData shape so the provider can extract city
    const placesData = address ? { address } : null;

    const data = await runOpenAIMention({ company, industry, placesData });
    return NextResponse.json({ openaiMention: data });
  } catch (err) {
    console.error('[aimention/route] Error:', err);
    return NextResponse.json({ openaiMention: null });
  }
}
