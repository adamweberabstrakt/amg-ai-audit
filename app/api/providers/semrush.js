// app/api/providers/semrush.js
// Fetches top 5 transactional competitor keywords + domain authority comparison.
// Uses SEMRush Export API (v1).
// Requires SEMRUSH_API_KEY env var.

const BASE = 'https://api.semrush.com/';
const KEY  = process.env.SEMRUSH_API_KEY;

// ─── Public entry point ───────────────────────────────────────────────────────
export async function runSemrush({ website, competitor1, competitor2 }) {
  if (!KEY) {
    console.warn('[semrush] No API key — skipping');
    return null;
  }

  const clientDomain = extractDomain(website);
  const comp1Domain  = extractDomain(competitor1);
  const comp2Domain  = extractDomain(competitor2);

  const [clientStats, comp1Data, comp2Data] = await Promise.allSettled([
    getDomainStats(clientDomain),
    comp1Domain ? getCompetitorData(comp1Domain) : Promise.resolve(null),
    comp2Domain ? getCompetitorData(comp2Domain) : Promise.resolve(null),
  ]);

  return {
    clientStats:  clientStats.status  === 'fulfilled' ? clientStats.value  : null,
    competitor1:  comp1Data.status    === 'fulfilled' ? comp1Data.value    : null,
    competitor2:  comp2Data.status    === 'fulfilled' ? comp2Data.value    : null,
  };
}

// ─── Domain stats (traffic, keyword count, authority score) ───────────────────
async function getDomainStats(domain) {
  if (!domain) return null;
  const params = new URLSearchParams({
    type:            'domain_ranks',
    key:             KEY,
    export_columns:  'Dn,Rk,Or,Ot,Oc,Ad',
    domain,
    database:        'us',
  });
  const res  = await fetch(`${BASE}?${params}`);
  const text = await res.text();
  return parseDomainRanks(text, domain);
}

// ─── Competitor: keywords + domain stats ──────────────────────────────────────
async function getCompetitorData(domain) {
  if (!domain) return null;
  const [stats, keywords] = await Promise.allSettled([
    getDomainStats(domain),
    getTopKeywords(domain),
  ]);
  return {
    domain,
    stats:    stats.status    === 'fulfilled' ? stats.value    : null,
    keywords: keywords.status === 'fulfilled' ? keywords.value : [],
  };
}

// ─── Top 5 organic keywords (transactional intent proxy: CPC > $1) ────────────
async function getTopKeywords(domain) {
  if (!domain) return [];
  // Sorted by position ASC, filter for keywords with CPC (commercial intent)
  const params = new URLSearchParams({
    type:            'domain_organic',
    key:             KEY,
    export_columns:  'Ph,Po,Nq,Cp,Co,Ur',
    domain,
    database:        'us',
    display_limit:   '50',    // fetch 50, filter to top 5 transactional
    display_sort:    'po_asc', // best positions first
  });
  const res  = await fetch(`${BASE}?${params}`);
  const text = await res.text();
  return parseKeywords(text);
}

// ─── Parsers ──────────────────────────────────────────────────────────────────
function parseDomainRanks(text, domain) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return null;          // No data row
  const headers = lines[0].split(';');
  const values  = lines[1].split(';');
  const row     = {};
  headers.forEach((h, i) => { row[h.trim()] = (values[i] ?? '').trim(); });
  return {
    domain,
    authorityScore:   parseInt(row['Rk']  ?? '0', 10),
    organicKeywords:  parseInt(row['Or']  ?? '0', 10),
    organicTraffic:   parseInt(row['Ot']  ?? '0', 10),
    paidKeywords:     parseInt(row['Ad']  ?? '0', 10),
  };
}

function parseKeywords(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(';').map((h) => h.trim());

  const rows = lines.slice(1).map((line) => {
    const vals = line.split(';');
    const row  = {};
    headers.forEach((h, i) => { row[h] = (vals[i] ?? '').trim(); });
    return {
      keyword:  row['Keyword']  ?? row['Ph'] ?? '',
      position: parseInt(row['Position'] ?? row['Po'] ?? '0', 10),
      volume:   parseInt(row['Search Volume'] ?? row['Nq'] ?? '0', 10),
      cpc:      parseFloat(row['CPC'] ?? row['Cp'] ?? '0'),
      url:      row['URL']      ?? row['Ur'] ?? '',
    };
  });

  // Filter for transactional intent: CPC > $0.50 as proxy
  const transactional = rows.filter((r) => r.cpc > 0.5 && r.keyword);
  // Return top 5 by position
  return transactional.slice(0, 5);
}

// ─── Utility ──────────────────────────────────────────────────────────────────
function extractDomain(url) {
  if (!url) return null;
  try {
    const u = url.startsWith('http') ? url : `https://${url}`;
    return new URL(u).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}
