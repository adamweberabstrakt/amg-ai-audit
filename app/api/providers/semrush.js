// app/api/providers/semrush.js
// Fetches top 5 transactional competitor keywords + domain authority comparison.
// Uses SEMRush Export API (v1).
// Requires SEMRUSH_API_KEY env var.

const BASE = 'https://api.semrush.com/';
const KEY  = process.env.SEMRUSH_API_KEY;

// ─── Public entry point ───────────────────────────────────────────────────────
export async function runSemrush({ website, competitors = [] }) {
  if (!KEY) {
    console.warn('[semrush] No API key — skipping');
    return null;
  }

  const clientDomain = extractDomain(website);
  const competitorDomains = competitors
    .map(comp => extractDomain(comp))
    .filter(Boolean)
    .slice(0, 4); // Limit to 4 competitors max

  // Run client stats + referring domains + all competitor data in parallel
  const promises = [
    getDomainStats(clientDomain),
    getReferringDomains(clientDomain),
    ...competitorDomains.map(domain => getCompetitorData(domain))
  ];

  const results = await Promise.allSettled(promises);
  
  // Extract results
  const clientStats = results[0].status === 'fulfilled' ? results[0].value : null;
  const clientRefDomains = results[1].status === 'fulfilled' ? results[1].value : [];
  const competitorData = results.slice(2).map((result, index) => ({
    domain: competitorDomains[index],
    data: result.status === 'fulfilled' ? result.value : null,
  }));

  // Compute backlink gaps for each competitor
  const backlinksGaps = computeBacklinkGaps(clientRefDomains, competitorData);

  return {
    clientStats,
    clientRefDomains,
    competitors: competitorData,
    backlinksGaps,
    // Backward compatibility: populate competitor1/competitor2 for existing code
    competitor1: competitorData[0]?.data || null,
    competitor2: competitorData[1]?.data || null,
  };
}

// ─── Compute backlink gaps: domains that link to competitors but not client ───
function computeBacklinkGaps(clientRefDomains, competitorData) {
  const clientDomainSet = new Set(clientRefDomains.map(rd => rd.domain.toLowerCase()));
  
  return competitorData.map(comp => {
    if (!comp.data?.refDomains) {
      return { competitorDomain: comp.domain, gapDomains: [] };
    }
    
    // Find competitor referring domains that don't link to client
    const gapDomains = comp.data.refDomains
      .filter(rd => !clientDomainSet.has(rd.domain.toLowerCase()))
      .sort((a, b) => b.authorityScore - a.authorityScore) // Sort by authority desc
      .slice(0, 3); // Top 3 gap domains
    
    return {
      competitorDomain: comp.domain,
      gapDomains,
    };
  });
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

// ─── Competitor: keywords + domain stats + backlink gaps ─────────────────────
async function getCompetitorData(domain) {
  if (!domain) return null;
  const [stats, keywords, refDomains] = await Promise.allSettled([
    getDomainStats(domain),
    getTopKeywords(domain),
    getReferringDomains(domain),
  ]);
  return {
    domain,
    stats:      stats.status      === 'fulfilled' ? stats.value      : null,
    keywords:   keywords.status   === 'fulfilled' ? keywords.value   : [],
    refDomains: refDomains.status === 'fulfilled' ? refDomains.value : [],
  };
}

// ─── Top 5 organic keywords (transactional intent proxy: CPC > $0.50) ──────────
async function getTopKeywords(domain) {
  if (!domain) return [];
  // Sorted by search volume DESC, filter for keywords with CPC (commercial intent)
  const params = new URLSearchParams({
    type:            'domain_organic',
    key:             KEY,
    export_columns:  'Ph,Po,Nq,Cp,Co,Ur',
    domain,
    database:        'us',
    display_limit:   '50',    // fetch 50, filter to top 5 transactional
    display_sort:    'nq_desc', // highest search volume first
  });
  const res  = await fetch(`${BASE}?${params}`);
  const text = await res.text();
  return parseKeywords(text);
}

// ─── Top 25 referring domains with domain authority ───────────────────────────
async function getReferringDomains(domain) {
  if (!domain) return [];
  const params = new URLSearchParams({
    type:            'backlinks_refdomains',
    key:             KEY,
    export_columns:  'domain,domain_ascore,domain_ip,backlinks_num',
    target:          domain,
    database:        'us',
    display_limit:   '25',    // top 25 referring domains
    display_sort:    'domain_ascore_desc', // highest authority first
  });
  const res  = await fetch(`${BASE}?${params}`);
  const text = await res.text();
  return parseReferringDomains(text);
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

function parseReferringDomains(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(';').map((h) => h.trim());

  const rows = lines.slice(1).map((line) => {
    const vals = line.split(';');
    const row  = {};
    headers.forEach((h, i) => { row[h] = (vals[i] ?? '').trim(); });
    return {
      domain:          row['Domain']       ?? row['domain'] ?? '',
      authorityScore:  parseInt(row['Domain Score'] ?? row['domain_ascore'] ?? '0', 10),
      backlinksCount:  parseInt(row['Backlinks'] ?? row['backlinks_num'] ?? '0', 10),
    };
  });

  // Return domains with authority score > 0, sorted by authority desc
  return rows
    .filter((r) => r.domain && r.authorityScore > 0)
    .sort((a, b) => b.authorityScore - a.authorityScore)
    .slice(0, 25);
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
