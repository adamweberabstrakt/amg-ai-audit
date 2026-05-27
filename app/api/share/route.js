// app/api/share/route.js
// Stores audit results in Vercel Blob (persistent across cold starts).
// Requires BLOB_READ_WRITE_TOKEN env var — set in Vercel dashboard under Storage > Blob.

import { NextResponse } from 'next/server';
import { put, head }    from '@vercel/blob';
import { randomUUID }   from 'crypto';

// POST /api/share  — save audit data, return { id }
export async function POST(req) {
  try {
    const body = await req.json();
    const id   = body.id ?? randomUUID();

    await put(`audits/${id}.json`, JSON.stringify(body), {
      access:      'public',
      contentType: 'application/json',
    });

    return NextResponse.json({ id });
  } catch (err) {
    console.error('[share] POST error:', err);
    return NextResponse.json({ error: 'Failed to save results' }, { status: 500 });
  }
}

// GET /api/share?id=xxx  — retrieve saved audit data
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    const blob = await head(`audits/${id}.json`);
    const res  = await fetch(blob.url);
    if (!res.ok) throw new Error('fetch failed');
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Not found or expired' }, { status: 404 });
  }
}
