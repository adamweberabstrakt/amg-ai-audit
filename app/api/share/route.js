// app/api/share/route.js
// Stores audit results in Vercel KV.
// Requires KV_REST_API_URL + KV_REST_API_TOKEN env vars.
// Connect the KV store to this project in Vercel dashboard → Storage → your store → Projects.
// Keys are prefixed "audit:" to avoid collision with other apps sharing the same store.
// TTL: 90 days.

import { NextResponse } from 'next/server';
import { kv }          from '@vercel/kv';
import { randomUUID }  from 'crypto';

const TTL_SECONDS = 60 * 60 * 24 * 90; // 90 days

function kvConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// POST /api/share  — save audit data, return { id }
export async function POST(req) {
  if (!kvConfigured()) {
    console.error('[share] KV_REST_API_URL or KV_REST_API_TOKEN not set');
    return NextResponse.json({ error: 'Share storage not configured' }, { status: 503 });
  }

  try {
    const body  = await req.json();
    const rawId = body.id;
    const id    = (rawId && /^[0-9a-f-]{36}$/i.test(rawId)) ? rawId : randomUUID();

    await kv.set(`audit:${id}`, body, { ex: TTL_SECONDS });

    return NextResponse.json({ id });
  } catch (err) {
    console.error('[share] KV set failed:', err?.message ?? err);
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

  if (!kvConfigured()) {
    return NextResponse.json({ error: 'Share storage not configured' }, { status: 503 });
  }

  try {
    const data = await kv.get(`audit:${id}`);
    if (!data) return NextResponse.json({ error: 'Not found or expired' }, { status: 404 });
    return NextResponse.json(data);
  } catch (err) {
    console.error('[share] KV get failed:', err?.message ?? err);
    return NextResponse.json({ error: 'Not found or expired' }, { status: 404 });
  }
}
