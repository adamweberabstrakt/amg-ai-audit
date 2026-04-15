// app/api/audit/route.js
// Orchestrates all data providers in parallel and returns combined results.
// Providers: PageSpeed, Google Places, Custom Crawl, Claude Analysis

import { NextResponse } from 'next/server';
import { runPageSpeed }     from '../providers/pagespeed';
import { runCrawl }         from '../providers/crawl';
import { runPlaces }        from '../providers/places';
import { runClaudeAnalysis } from '../providers/claude-analysis';
import { runSemrush }        from '../providers/semrush';

// Extend Vercel function timeout to 60s (default is 10s — not enough for parallel API calls)
export const maxDuration = 60;

export async function POST(req) {
  try {
    const body = await req.json();
    const { website, company, industry, goal, budgetRange, brandRating, competitor1, competitor2 } = body;

    if (!website || !company) {
      return NextResponse.json({ error: 'website and company are required' }, { status: 400 });
    }

    // Normalize URL
    const url = website.startsWith('http') ? website : `https://${website}`;

    // ── Run all providers in parallel ───────────────────────────────────────
    const [pageSpeedData, crawlData, placesData, semrushData] = await Promise.allSettled([
      runPageSpeed(url),
      runCrawl(url),
      runPlaces(company),
      runSemrush({ website: url, competitor1, competitor2 }),
    ]);

    const ps       = pageSpeedData.status === 'fulfilled'  ? pageSpeedData.value  : null;
    const crawl    = crawlData.status     === 'fulfilled'   ? crawlData.value      : null;
    const places   = placesData.status   === 'fulfilled'   ? placesData.value     : null;
    const semrush  = semrushData.status  === 'fulfilled'   ? semrushData.value    : null;

    // ── Run Claude analysis — wrapped so a failure returns fallback, not 500 ─
    let claudeData;
    try {
      claudeData = await runClaudeAnalysis({
        company,
        website: url,
        industry,
        goal,
        budgetRange,
        brandRating,
        competitor1,
        competitor2,
        pageSpeedScore: ps?.score ?? null,
        crawlData:      crawl,
        placesData:     places,
        semrushData:    semrush,
      });
    } catch (claudeErr) {
      console.error('[audit/route] Claude analysis failed, using fallback:', claudeErr);
      claudeData = null;
    }

    return NextResponse.json({
      pageSpeed: ps,
      crawl,
      places,
      semrush,
      claude: claudeData,
      meta: {
        company,
        website: url,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error('[audit/route] Error:', err);
    return NextResponse.json({ error: 'Audit failed. Please try again.' }, { status: 500 });
  }
}
