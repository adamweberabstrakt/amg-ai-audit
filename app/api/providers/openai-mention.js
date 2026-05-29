// app/api/providers/openai-mention.js
// Asks GPT-4o (with live web search) whether this business appears when
// a buyer asks for recommendations in their industry.
// Returns null on missing key or failure — never throws.

const OPENAI_API = 'https://api.openai.com/v1/responses';

export async function runOpenAIMention({ company, industry, placesData }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.warn('[openai-mention] No OPENAI_API_KEY — skipping');
    return null;
  }

  // Use city from GBP address if available, otherwise omit location
  const city = extractCity(placesData?.address);
  const locationClause = city ? ` in ${city}` : '';
  const query = `Who are the best ${industry} companies${locationClause}? Give me your top recommendations.`;

  try {
    const res = await fetch(OPENAI_API, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        tools: [{ type: 'web_search_preview' }],
        input: query,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      console.warn('[openai-mention] API error:', res.status);
      return null;
    }

    const data = await res.json();

    // Extract text from output blocks
    const responseText = (data.output ?? [])
      .filter(block => block.type === 'message')
      .flatMap(block => block.content ?? [])
      .filter(c => c.type === 'output_text')
      .map(c => c.text)
      .join('\n')
      .trim();

    if (!responseText) {
      console.warn('[openai-mention] Empty response');
      return null;
    }

    // Check if company name appears in the response (case-insensitive)
    const mentioned = responseText.toLowerCase().includes(company.toLowerCase());

    // Find which competitor names also appear
    return {
      query,
      responseText,
      mentioned,
      model: 'gpt-4o',
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[openai-mention] Error:', err);
    return null;
  }
}

// ── Extract city from a formatted GBP address string ─────────────────────────
// e.g. "123 Main St, St. Louis, MO 63101, USA" → "St. Louis, MO"
function extractCity(address) {
  if (!address) return null;
  const parts = address.split(',').map(p => p.trim());
  // Typical format: [street, city, state+zip, country]
  if (parts.length >= 3) {
    const city  = parts[1];
    const state = parts[2]?.split(' ')[0]; // "MO" from "MO 63101"
    if (city && state) return `${city}, ${state}`;
    return city || null;
  }
  return null;
}
