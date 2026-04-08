// app/api/share/route.js
// Stores audit results server-side with a UUID and retrieves them by ID.
// Uses a simple in-memory Map — adequate for sharing links in a demo/launch context.
// For production at scale, swap the Map for Redis or a DB.

import { NextResponse } from 'next/server';
import { randomUUID }   from 'crypto';

// In-memory store. Lives as long as the serverless function instance is warm.
// TTL: entries older than 7 days are pruned on each write.
const store = new Map();
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function pruneOld() {
  const now = Date.now();
  for (const [key, val] of store.entries()) {
    if (now - val.savedAt > TTL_MS) store.delete(key);
  }
}

// POST /api/share  — save audit data, return { id }
export async function POST(req) {
  try {
    const body = await req.json();
    pruneOld();
    const id = randomUUID();
    store.set(id, { data: body, savedAt: Date.now() });
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

  const entry = store.get(id);
  if (!entry) return NextResponse.json({ error: 'Not found or expired' }, { status: 404 });

  return NextResponse.json(entry.data);
}
