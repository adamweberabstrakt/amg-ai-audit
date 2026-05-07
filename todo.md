# Debug: Results Page Not Loading

## Root Cause

The share route (`/api/share`) uses an **in-memory Map** for storage. Vercel serverless functions
are ephemeral — each request can hit a *different* container with a fresh, empty Map.

**The bug flow:**
1. User submits audit → `/api/audit` succeeds
2. `/api/share` POST succeeds (saves to in-memory Map *on this container*)
3. `sessionStorage` is **NOT set** — it only sets in the `catch` block if share POST *throws*
4. User is redirected to `/results?id=shareId`
5. Results page does `GET /api/share?id=xxx` — **hits a fresh container with empty Map → 404**
6. `ResultsClient` catches the 404 → redirects back to `/assess` (appears broken)

## Fix Plan

Two minimal changes, same two files as the bug:

### Todo

- [ ] **`components/AssessmentForm.jsx`** — Move `sessionStorage.setItem` calls **outside** the inner
      try/catch so they always run after a successful audit (not just when share POST fails).

- [ ] **`app/results/ResultsClient.jsx`** — When shareId is present but the share GET returns
      404/error, fall back to sessionStorage before redirecting to /assess.

- [ ] Verify build passes, push to main

## Review

_(filled after changes are made)_
