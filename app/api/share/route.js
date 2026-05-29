// app/api/share/route.js
// Stores audit results in Vercel Blob.
// Requires BLOB_READ_WRITE_TOKEN — create a Blob store in Vercel dashboard > Storage,
// then ensure the store is connected to this project.

import { NextResponse } from 'next/server';
import { put, head }    from '@vercel/blob';
import { randomUUID }   from 'crypto';

function blobConfigured() {
  // Accept any non-empty token — don't enforce format, Vercel handles auth
  return !!(process.env.BLOB_READ_WRITE_TOKEN ?? '').trim();
}

// POST /api/share  — save audit data, return { id }
export async function POST(req) {
  if (!blobConfigured()) {
    console.error('[share] BLOB_READ_WRITE_TOKEN not set');
    return NextResponse.json({ error: 'Share storage not configured' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const rawId = body.id;
    const id = (rawId && /^[0-9a-f-]{36}$/i.test(rawId)) ? rawId : randomUUID();

    await put(`audits/${id}.json`, JSON.stringify(body), {
      access:      'public',
      contentType: 'application/json',
    });

    return NextResponse.json({ id });
  } catch (err) {
    console.error('[share] PUT failed:', err?.message ?? err);
    return NextResponse.json({ error: 'Failed to save results' }, { status: 500 });
  }
}

// GET /api/share?id=xxx  — retrieve saved audit data
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  if (!blobConfigured()) {
    return NextResponse.json({ error: 'Share storage not configured' }, { status: 503 });
  }

  try {
    const blob = await head(`audits/${id}.json`);
    const res  = await fetch(blob.url);
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('[share] GET failed:', err?.message ?? err);
    return NextResponse.json({ error: 'Not found or expired' }, { status: 404 });
  }
}
