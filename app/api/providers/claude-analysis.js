// app/api/providers/claude-analysis.js
// One Claude call per audit. Returns AI visibility score, breakdown, 
// brand gap analysis, and top recommendations.
// Using claude-haiku for cost efficiency (~$0.003–0.008 per audit).

import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function runClaudeAnalysis({
  company,
  website,
  industry,
  goal,
  budgetRange,
  brandRating,
  competitor1,
  competitor2,
  pageSpeedScore,
  crawlData,
  placesData,
}) {
  const prompt = buildPrompt({
    company, website, industry, goal, budgetRange, brandRating,
    competitor1, competitor2, pageSpeedScore, crawlData, placesData,
  });

  const message = await client.messages.create({
    model:      'claude-haiku-4-5-20251001', // cost-efficient for per-audit use
    max_tokens: 1500,
    messages: [
      {
        role:    'user',
        content: prompt,
      },
    ],
  });

  const raw = message.content[0]?.text ?? '{}';

  try {
    // Strip markdown code fences if present
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    console.error('[claude-analysis] Failed to parse JSON response:', raw);
    return getFallbackResponse(company);
  }
}

// ─── Prompt ───────────────────────────────────────────────────────────────────
function buildPrompt({
  company, website, industry, goal, budgetRange, brandRating,
  competitor1, competitor2, pageSpeedScore, crawlData, placesData,
}) {
  return `You are a senior digital marketing analyst at Abstrakt Marketing Group reviewing a business's online AI visibility.

BUSINESS INFO:
- Company: ${company}
- Website: ${website}
- Industry: ${industry ?? 'Not specified'}
- Primary goal: ${goal ?? 'Not specified'}
- Marketing budget: ${budgetRange ?? 'Not specified'}
- Brand maturity self-rating: ${brandRating}/5

TECHNICAL DATA:
- PageSpeed score (mobile): ${pageSpeedScore ?? 'Not available'}/100
- Has page title: ${crawlData?.hasTitle ?? 'Unknown'}
- Has meta description: ${crawlData?.hasMetaDesc ?? 'Unknown'}
- Has H1 tag: ${crawlData?.hasH1 ?? 'Unknown'}
- Has OG tags: ${crawlData?.hasOGTitle ?? 'Unknown'}
- Has schema markup: ${crawlData?.hasSchema ?? 'Unknown'}
- Has canonical tag: ${crawlData?.hasCanonical ?? 'Unknown'}
- Images with alt text: ${crawlData?.imagesWithAlt ?? 'Unknown'} of ${crawlData?.imageCount ?? 'Unknown'}
- Google Business Profile found: ${placesData?.found ?? false}
- GBP rating: ${placesData?.rating ?? 'N/A'} (${placesData?.reviewCount ?? 0} reviews)
- Competitors provided: ${[competitor1, competitor2].filter(Boolean).join(', ') || 'None'}

Return ONLY a valid JSON object with this exact structure, no preamble, no markdown:

{
  "aiVisibilityScore": <number 0-100, overall score>,
  "scoreBreakdown": {
    "contentAuthority": <number 0-100, based on meta, title, schema, content signals>,
    "structuredData": <number 0-100, based on schema, OG, canonical presence>,
    "brandSignals": <number 0-100, based on GBP, reviews, brand maturity rating>,
    "localPresence": <number 0-100, based on GBP completeness and review count>
  },
  "visibilitySummary": "<2-3 sentence plain-language explanation for a business owner — what this score means for them and how AI tools currently see their brand>",
  "brandGapAnalysis": "<3-4 paragraph analysis written for a marketing manager, not a developer. Explain what gaps exist, why they matter for AI discoverability, and what competitors with better scores likely have that this business doesn't. Be specific to the industry if possible.>",
  "topRecommendations": [
    "<recommendation 1 — specific, actionable, written for a non-technical marketing manager>",
    "<recommendation 2>",
    "<recommendation 3>"
  ],
  "urgencyLevel": "<high|medium|low based on score and competitive context>"
}`;
}

// ─── Fallback if Claude parse fails ───────────────────────────────────────────
function getFallbackResponse(company) {
  return {
    aiVisibilityScore:  42,
    scoreBreakdown: {
      contentAuthority: 40,
      structuredData:   35,
      brandSignals:     50,
      localPresence:    45,
    },
    visibilitySummary: `We were unable to fully analyze ${company}'s AI visibility at this time. Based on the data we could collect, there appear to be opportunities to improve how AI tools discover and recommend your business.`,
    brandGapAnalysis: `Your assessment encountered a partial data issue. Our team will review your results and reach out with a personalized analysis. Book a call below to discuss your AI visibility strategy.`,
    topRecommendations: [
      'Complete your Google Business Profile with accurate NAP data and recent photos.',
      'Add structured data (schema markup) to your website to help AI tools understand your business.',
      'Build a content strategy that addresses the questions your customers ask AI tools.',
    ],
    urgencyLevel: 'medium',
  };
}
