# Feature: Progressive / Lazy-Load Audit Results

## Approach
Split into two phases:
- Phase 1 (fast, ~10-15s): PageSpeed + Crawl + Places + SEMRush + Claude → redirect to results
- Phase 2 (lazy, ~0-20s): GTMetrix loads in background on the results page, Website Health tab updates when done

## Todo

- [ ] `app/api/audit/route.js` — remove GTMetrix from parallel batch + Claude prompt; reduce maxDuration to 30
- [ ] `app/api/gtmetrix/route.js` — new GET endpoint: accepts ?url=, runs GTMetrix, returns data
- [ ] `vercel.json` — add gtmetrix route with maxDuration:25; reduce audit to 30
- [ ] `app/results/ResultsClient.jsx` — after auditData loads, fire lazy GTMetrix fetch; embed _gtmetrixLoading flag in auditData state so WebsiteHealthTab can react
- [ ] `components/tabs/WebsiteHealthTab.jsx` — show loading skeleton while _gtmetrixLoading is true

## Review
