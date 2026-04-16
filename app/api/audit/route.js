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

// ── Simple in-memory rate limiter: max 5 requests per IP per hour ─────────────
const rateLimitMap = new Map(); // ip -> { count, resetAt }
const RATE_LIMIT    = 5;
const WINDOW_MS     = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
  const now    = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT) return false;
  record.count++;
  return true;
}

// ── Input sanitization helpers ────────────────────────────────────────────────
function stripHtml(str) {
  return typeof str === 'string' ? str.replace(/<[^>]*>/g, '').trim() : '';
}

function isValidUrl(str) {
  try {
    const u = new URL(str.startsWith('http') ? str : `https://${str}`);
    return u.hostname.includes('.');
  } catch { return false; }
}

function isValidDomain(str) {
  if (!str) return true; // optional fields
  return /^[a-zA-Z0-9][a-zA-Z0-9-_.]{0,200}\.[a-zA-Z]{2,}$/.test(str.replace(/^https?:\/\//, '').split('/')[0]);
}

export async function POST(req) {
  try {
    // ── Rate limiting ──────────────────────────────────────────────────────
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { website, company, industry, goal, budgetRange, brandRating, competitor1, competitor2,
            _hp, _t } = body;

    // ── Honeypot check (bots fill hidden fields, humans don't) ────────────
    if (_hp) {
      return NextResponse.json({ error: 'Invalid submission.' }, { status: 400 });
    }

    // ── Minimum submission time (< 3s = bot) ─────────────────────────────
    if (_t && Date.now() - _t < 3000) {
      return NextResponse.json({ error: 'Submission too fast.' }, { status: 400 });
    }

    // ── Input validation ──────────────────────────────────────────────────
    const cleanWebsite  = stripHtml(website ?? '');
    const cleanCompany  = stripHtml(company ?? '').slice(0, 150);
    const cleanComp1    = stripHtml(competitor1 ?? '').slice(0, 200);
    const cleanComp2    = stripHtml(competitor2 ?? '').slice(0, 200);

    if (!cleanWebsite || !cleanCompany) {
      return NextResponse.json({ error: 'website and company are required' }, { status: 400 });
    }
    if (!isValidUrl(cleanWebsite)) {
      return NextResponse.json({ error: 'Invalid website URL.' }, { status: 400 });
    }
    if (cleanComp1 && !isValidDomain(cleanComp1)) {
      return NextResponse.json({ error: 'Invalid competitor 1 URL.' }, { status: 400 });
    }
    if (cleanComp2 && !isValidDomain(cleanComp2)) {
      return NextResponse.json({ error: 'Invalid competitor 2 URL.' }, { status: 400 });
    }

    // Normalize URL
    const url = cleanWebsite.startsWith('http') ? cleanWebsite : `https://${cleanWebsite}`;

    // ── Run all providers in parallel ───────────────────────────────────────
    const [pageSpeedData, crawlData, placesData, semrushData] = await Promise.allSettled([
      runPageSpeed(url),
      runCrawl(url),
      runPlaces(cleanCompany),
      runSemrush({ website: url, competitor1: cleanComp1, competitor2: cleanComp2 }),
    ]);

    const ps       = pageSpeedData.status === 'fulfilled'  ? pageSpeedData.value  : null;
    const crawl    = crawlData.status     === 'fulfilled'   ? crawlData.value      : null;
    const places   = placesData.status   === 'fulfilled'   ? placesData.value     : null;
    const semrush  = semrushData.status  === 'fulfilled'   ? semrushData.value    : null;

    // ── Run Claude analysis — wrapped so a failure returns fallback, not 500 ─
    let claudeData;
    try {
      claudeData = await runClaudeAnalysis({
        company:    cleanCompany,
        website:    url,
        industry,
        goal,
        budgetRange,
        brandRating,
        competitor1: cleanComp1,
        competitor2: cleanComp2,
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
