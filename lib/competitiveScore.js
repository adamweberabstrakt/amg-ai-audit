// lib/competitiveScore.js
// Pure-function helper: rolls up SEMRush signals into a single "Competitive
// Position Score" per competitor — clear verdict on whether you're ahead,
// roughly even, or behind in AI/search positioning.
//
// 0–100 scale centered at 50 (even):
//   > 55  → you're ahead
//   45–55 → roughly even
//   < 45  → they're ahead

const AUTHORITY_WEIGHT = 0.40;
const KEYWORD_WEIGHT   = 0.30;
const TRAFFIC_WEIGHT   = 0.30;

/**
 * Returns an array of competitor comparison objects, one per competitor domain.
 * Each has: domain, hasData, score, verdict, gaps (for display), clientStats, competitorStats.
 */
export function computeCompetitivePositions({ clientStats, competitors, company }) {
  if (!competitors || competitors.length === 0) return [];

  return competitors.map((comp) => {
    const compStats = comp?.data?.stats ?? null;

    // No data for this competitor — return an explicit empty state
    if (!compStats) {
      return {
        domain:   comp.domain,
        hasData:  false,
        score:    null,
        verdict:  'no-data',
        message:  `SEMRush has no data for ${comp.domain} — they may be below the crawl threshold or not yet indexed.`,
      };
    }

    // If we have no client stats either, we can't make a comparison
    if (!clientStats) {
      return {
        domain:         comp.domain,
        hasData:        true,
        score:          null,
        verdict:        'no-client-data',
        message:        `${company} not found in SEMRush — comparison unavailable.`,
        competitorStats: compStats,
      };
    }

    // Compute normalized edges for each metric: client-relative percent
    // A normalized value of 0.5 means "even"; > 0.5 means client is ahead.
    const authorityEdge = normalizeEdge(clientStats.authorityScore,  compStats.authorityScore);
    const keywordEdge   = normalizeEdge(clientStats.organicKeywords, compStats.organicKeywords);
    const trafficEdge   = normalizeEdge(clientStats.organicTraffic,  compStats.organicTraffic);

    const composite =
      authorityEdge * AUTHORITY_WEIGHT +
      keywordEdge   * KEYWORD_WEIGHT   +
      trafficEdge   * TRAFFIC_WEIGHT;

    const score = Math.round(composite * 100);

    const verdict = score > 55 ? 'ahead'
      : score < 45 ? 'behind'
      : 'even';

    return {
      domain:         comp.domain,
      hasData:        true,
      score,
      verdict,
      clientStats,
      competitorStats: compStats,
      gaps: {
        authority:  compStats.authorityScore  - clientStats.authorityScore,
        keywords:   compStats.organicKeywords - clientStats.organicKeywords,
        traffic:    compStats.organicTraffic  - clientStats.organicTraffic,
      },
    };
  });
}

/**
 * Returns a normalized 0–1 value where:
 *   0.5 = even
 *   > 0.5 = client ahead
 *   < 0.5 = competitor ahead
 * Uses a log-scale comparison to dampen huge numeric differences (e.g., 10k vs 100k keywords
 * shouldn't return a score of 0.99 behind — that's correct but not useful).
 */
function normalizeEdge(clientValue, competitorValue) {
  const a = Math.max(0, Number(clientValue)      || 0);
  const b = Math.max(0, Number(competitorValue)  || 0);

  if (a === 0 && b === 0) return 0.5; // no data for either → call it even
  if (a === 0) return 0.2;            // client has nothing, competitor has something → strongly behind
  if (b === 0) return 0.8;            // client has something, competitor has nothing → strongly ahead

  // Log-scaled ratio centered at 0.5
  const ratio = Math.log(a) / (Math.log(a) + Math.log(b));
  return Math.max(0, Math.min(1, ratio));
}
