# Fix: GTMetrix lazy load never resolves

## Root Cause (3 issues)

1. MAX_WAIT_MS = 20s in provider — GTMetrix tests take 30-60s, always times out
2. maxDuration = 25s on the route — even if provider waited, function gets killed
3. Infinite loop in ResultsClient — on failure, gtmetrix stays null, effect re-fires forever

## Todo

- [ ] gtmetrix.js — MAX_WAIT_MS 20s → 55s
- [ ] app/api/gtmetrix/route.js — maxDuration 25 → 60
- [ ] vercel.json — gtmetrix route maxDuration 25 → 60
- [ ] ResultsClient.jsx — add useRef guard to fire fetch once; set false on failure to stop spinner
- [ ] WebsiteHealthTab.jsx — treat false as "done, no data" so spinner stops after failure

## Review
