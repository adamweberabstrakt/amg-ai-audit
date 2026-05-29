// app/api/providers/openai-mention.js
// Asks GPT-4o Search Preview (Chat Completions API with live web search) whether
// this business appears when a buyer asks for recommendations in their industry.
// Returns null on missing key or failure — never throws.

const OPENAI_API = 'https://api.openai.com/v1/chat/completions';

export async function runOpenAIMention({ company, industry, placesData }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    console.warn('[openai-mention] No OPENAI_API_KEY — skipping');
    return null;
  }

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
        model: 'gpt-4o-search-preview',
        web_search_options: {},
        messages: [{ role: 'user', content: query }],
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn('[openai-mention] API error:', res.status, err.slice(0, 200));
      return null;
    }

    const data = await res.json();
    const responseText = data.choices?.[0]?.message?.content?.trim() ?? '';

    if (!responseText) {
      console.warn('[openai-mention] Empty response');
      return null;
    }

    const mentioned = responseText.toLowerCase().includes(company.toLowerCase());

    return {
      query,
      responseText,
      mentioned,
      model: 'gpt-4o-search-preview',
      generatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error('[openai-mention] Error:', err?.message ?? err);
    return null;
  }
}

// Extract city from a formatted GBP address string
// e.g. "123 Main St, St. Louis, MO 63101, USA" → "St. Louis, MO"
function extractCity(address) {
  if (!address) return null;
  const parts = address.split(',').map(p => p.trim());
  if (parts.length >= 3) {
    const city  = parts[1];
    const state = parts[2]?.split(' ')[0];
    if (city && state) return `${city}, ${state}`;
    return city || null;
  }
  return null;
}
