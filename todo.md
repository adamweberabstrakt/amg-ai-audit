# Fix: Audit Function Timeout

## Root Cause

`FUNCTION_INVOCATION_TIMEOUT` on every audit submission.

The execution is sequential in two phases:
1. GTMetrix polls up to 45s (all providers run in parallel, but GTMetrix is the slowest)
2. Claude runs AFTER all providers complete — adds another 5-15s

Total: easily 50-60s+, hitting the function limit.

## Fix Plan

- [ ] `app/api/providers/gtmetrix.js` — reduce MAX_WAIT_MS from 45000 → 20000 (20s cap)
- [ ] `vercel.json` — add explicit maxDuration: 60 for the audit route (belt + suspenders with the export)
- [ ] Verify build passes, push to main

## Review
