// app/api/providers/gtmetrix.js
// Submits a GTMetrix test and polls for results.
// Requires GTMETRIX_API_KEY env var.
// Returns null (not throws) on missing key, API failure, or timeout —
// so a GTMetrix issue never takes down the whole audit.

const BASE             = 'https://gtmetrix.com/api/2.0';
const MAX_WAIT_MS      = 55000;  // GTMetrix tests take 30-60s; route maxDuration is 60s
const POLL_INTERVAL_MS = 3000;

export async function runGTMetrix(url) {
  const key = process.env.GTMETRIX_API_KEY;
  if (!key) {
    console.warn('[gtmetrix] No API key — skipping');
    return null;
  }

  const auth = 'Basic ' + Buffer.from(`${key}:`).toString('base64');

  try {
    // ── Submit test ──────────────────────────────────────────────────────
    const submitRes = await fetch(`${BASE}/tests`, {
      method: 'POST',
      headers: {
        Authorization:  auth,
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'test',
          attributes: {
            url,
            location: '1',  // Vancouver, Canada
            browser:  '3',  // Chrome Desktop
          },
        },
      }),
    });

    if (!submitRes.ok) {
      console.warn('[gtmetrix] Submit failed:', submitRes.status);
      return null;
    }

    const submitData = await submitRes.json();
    const testId     = submitData?.data?.id;
    if (!testId) {
      console.warn('[gtmetrix] No test ID in submit response');
      return null;
    }

    // ── Poll for completion ──────────────────────────────────────────────
    const deadline = Date.now() + MAX_WAIT_MS;

    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

      const pollRes = await fetch(`${BASE}/tests/${testId}`, {
        headers: { Authorization: auth },
      });
      if (!pollRes.ok) continue;

      const pollData = await pollRes.json();
      const state    = pollData?.data?.attributes?.state;

      if (state === 'completed') {
        const attrs = pollData.data.attributes;
        return {
          grade:            attrs.gtmetrix_grade ?? null,
          performanceScore: attrs.performance_score != null ? Math.round(attrs.performance_score * 100) : null,
          structureScore:   attrs.structure_score   != null ? Math.round(attrs.structure_score   * 100) : null,
          lcp:              formatMs(attrs.largest_contentful_paint),
          tbt:              formatMs(attrs.total_blocking_time),
          cls:              attrs.cumulative_layout_shift ?? null,
          fullyLoadedTime:  formatMs(attrs.fully_loaded_time),
          reportUrl:        pollData.data?.links?.report_url ?? null,
        };
      }

      if (state === 'error') {
        console.warn('[gtmetrix] Test errored:', pollData?.data?.attributes?.error);
        return null;
      }
    }

    console.warn('[gtmetrix] Timed out waiting for result');
    return null;
  } catch (err) {
    console.error('[gtmetrix] Error:', err);
    return null;
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────
function formatMs(ms) {
  if (ms == null) return null;
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.round(ms)}ms`;
}
