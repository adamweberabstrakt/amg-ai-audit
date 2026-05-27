# Fix: Results Share Links Failing on Cold Start

## Problem
app/api/share/route.js uses an in-memory Map for storage.
Vercel serverless instances go cold and wipe the Map — share links 404 and redirect to /assess.

## Fix
Swap in-memory Map for Vercel Blob (persistent object storage).

## Todo
- [x] Install @vercel/blob
- [x] Rewrite app/api/share/route.js to use Blob instead of Map
- [x] npm run build verify
- [x] Push to main

## Review
- Only one file changed: app/api/share/route.js
- POST now calls put() to write a JSON blob keyed by UUID
- GET now calls list()+fetch() to read the blob back
- Requires BLOB_READ_WRITE_TOKEN env var in Vercel dashboard (see instructions)
