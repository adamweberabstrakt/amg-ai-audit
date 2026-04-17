// app/api/providers/claude-analysis.js
// One Claude call per audit. Returns AI visibility score, breakdown, 
// brand gap analysis, and top recommendations.

import Anthropic from '@anthropic-ai/sdk';

export async function runClaudeAnalysis({
  company,
  website,
  industry,
  goal,
  budgetRange,
  brandRating,
  competitors,
  usesVideo,
  videoChannels,
  pageSpeedScore,
  crawlData,
  placesData,
  semrushData,
}) {
  const client = new Anthropic();

  const prompt = buildPrompt({
    company, website, industry, goal, budgetRange, brandRating,
    competitors, usesVideo, videoChannels, pageSpeedScore, crawlData, placesData, semrushData,
  });

  const message = await client.messages.create({
    model:      'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = message.content[0]?.text ?? '{}';

  try {
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
  competitors, usesVideo, videoChannels, pageSpeedScore, crawlData, placesData, semrushData,
}) {
  const semrushBlock = semrushData
    ? buildSemrushBlock(semrushData, company)
    : 'SEMRush data not available.';

  return `You are a senior digital marketing analyst at Abstrakt Marketing Group reviewing a business's AI visibility and competitive position in search.

BUSINESS INFO:
- Company: ${company}
- Website: ${website}
- Industry: ${industry ?? 'Not specified'}
- Primary goal: ${goal ?? 'Not specified'}
- Marketing budget: ${budgetRange ?? 'Not specified'}
- Brand maturity self-rating: ${brandRating}/5
- Uses video marketing: ${usesVideo ?? 'Not specified'}${usesVideo === 'Yes' && videoChannels?.length ? ` (${videoChannels.join(', ')})` : ''}

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
- Competitors analyzed: ${Array.isArray(competitors) ? competitors.filter(Boolean).join(', ') || 'None' : 'None'}

COMPETITOR & SEARCH DATA (SEMRush):
${semrushBlock}

Return ONLY a valid JSON object with this exact structure, no preamble, no markdown:

{
  "aiVisibilityScore": <number 0-100, overall score>,
  "scoreBreakdown": {
    "contentAuthority": <number 0-100, based on meta, title, schema, content signals>,
    "structuredData":   <number 0-100, based on schema, OG, canonical presence>,
    "brandSignals":     <number 0-100, based on GBP, reviews, brand maturity rating>,
    "localPresence":    <number 0-100, based on GBP completeness and review count>
  },
  "visibilitySummary": "<2-3 sentence explanation for a business owner — what this score means and how AI tools see their brand vs. competitors>",
  "brandGapAnalysis": "<3-4 paragraph analysis for a marketing manager. Reference specific competitor keyword gaps, domain authority differences, and backlink opportunities where available. When video marketing is indicated, include a paragraph comparing the client's video strategy vs. typical competitors in this industry. Explain what competitors are doing better, why it matters for AI discoverability, and what this business needs to close the gap. Be specific to the industry.>",
  "topRecommendations": [
    "<recommendation 1 — specific, actionable, written for a non-technical marketing manager>",
    "<recommendation 2>",
    "<recommendation 3>"
  ],
  "urgencyLevel": "<high|medium|low based on score and competitive gap size>"
}`;
}

function buildSemrushBlock(semrush, company) {
  const lines = [];

  // Client stats
  if (semrush.clientStats) {
    const s = semrush.clientStats;
    lines.push(`${company}: authority score ${s.authorityScore}, ~${s.organicTraffic.toLocaleString()} monthly organic visits, ${s.organicKeywords.toLocaleString()} ranking keywords`);
  }

  // Client referring domains count
  if (semrush.clientRefDomains?.length) {
    lines.push(`${company}: ${semrush.clientRefDomains.length} high-authority referring domains`);
  }

  // Competitor data (up to 4 competitors)
  if (semrush.competitors?.length) {
    semrush.competitors.forEach((comp) => {
      if (!comp.data) return;
      
      // Competitor stats
      if (comp.data.stats) {
        const s = comp.data.stats;
        lines.push(`${comp.domain}: authority score ${s.authorityScore}, ~${s.organicTraffic.toLocaleString()} monthly organic visits, ${s.organicKeywords.toLocaleString()} ranking keywords`);
      }
      
      // Competitor keywords  
      if (comp.data.keywords?.length) {
        const kws = comp.data.keywords
          .map((k) => `"${k.keyword}" (pos ${k.position}, ${k.volume.toLocaleString()}/mo, $${k.cpc.toFixed(2)} CPC)`)
          .join('; ');
        lines.push(`${comp.domain} top volume keywords: ${kws}`);
      }
    });
  }

  // Backlink gaps
  if (semrush.backlinksGaps?.length) {
    const gaps = semrush.backlinksGaps
      .filter(gap => gap.gapDomains?.length > 0)
      .map(gap => `${gap.competitorDomain}: ${gap.gapDomains.map(d => `${d.domain} (DA ${d.authorityScore})`).join(', ')}`)
      .slice(0, 3); // Top 3 competitors with gaps
    
    if (gaps.length > 0) {
      lines.push(`Backlink opportunities (domains linking to competitors but not ${company}): ${gaps.join('; ')}`);
    }
  }

  // Backward compatibility for old structure
  if (!semrush.competitors && (semrush.competitor1 || semrush.competitor2)) {
    ['competitor1', 'competitor2'].forEach((key) => {
      const c = semrush[key];
      if (!c) return;
      if (c.stats) {
        lines.push(`${c.domain}: authority score ${c.stats.authorityScore}, ~${c.stats.organicTraffic.toLocaleString()} monthly organic visits, ${c.stats.organicKeywords.toLocaleString()} ranking keywords`);
      }
      if (c.keywords?.length) {
        const kws = c.keywords
          .map((k) => `"${k.keyword}" (pos ${k.position}, ${k.volume.toLocaleString()}/mo, $${k.cpc.toFixed(2)} CPC)`)
          .join('; ');
        lines.push(`${c.domain} top transactional keywords: ${kws}`);
      }
    });
  }

  return lines.length ? lines.join('\n') : 'Competitor domains not found in SEMRush database.';
}

// ─── Fallback if Claude parse fails ───────────────────────────────────────────
function getFallbackResponse(company) {
  return {
    aiVisibilityScore: 42,
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
