// app/api/gtmetrix/route.js
// Lazy-loaded GTMetrix endpoint. Called from the results page after the fast audit returns.
// Accepts ?url=https://example.com — returns GTMetrix data or null on failure.

import { NextResponse }  from 'next/server';
import { runGTMetrix }   from '../providers/gtmetrix';

export const maxDuration = 25;
export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
    }

    // Basic sanity check — must be a plausible URL
    try { new URL(url.startsWith('http') ? url : `https://${url}`); }
    catch { return NextResponse.json({ error: 'Invalid url' }, { status: 400 }); }

    const data = await runGTMetrix(url);
    return NextResponse.json({ gtmetrix: data });
  } catch (err) {
    console.error('[gtmetrix/route] Error:', err);
    return NextResponse.json({ gtmetrix: null });
  }
}
