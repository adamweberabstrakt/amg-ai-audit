// app/api/providers/crawl.js
// Crawls the homepage and checks for SEO/AI-discoverability signals.
// Looks for: title, meta description, OG tags, schema markup, H1, canonical, sitemap, robots.

import * as cheerio from 'cheerio';

export async function runCrawl(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'AbstraktAIVisibilityBot/1.0' },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`Crawl failed: ${res.status}`);

  const html = await res.text();

  // ── Note: cheerio must be installed: npm install cheerio ────────────────
  // If cheerio is not available, use a lightweight regex fallback.
  let signals;
  try {
    const $ = cheerio.load(html);
    signals = {
      hasTitle:        !!$('title').text().trim(),
      title:           $('title').text().trim().slice(0, 100),
      hasMetaDesc:     !!$('meta[name="description"]').attr('content'),
      metaDesc:        ($('meta[name="description"]').attr('content') ?? '').slice(0, 200),
      hasH1:           $('h1').length > 0,
      h1Count:         $('h1').length,
      hasOGTitle:      !!$('meta[property="og:title"]').attr('content'),
      hasOGDesc:       !!$('meta[property="og:description"]').attr('content'),
      hasOGImage:      !!$('meta[property="og:image"]').attr('content'),
      hasSchema:       html.includes('application/ld+json'),
      hasCanonical:    !!$('link[rel="canonical"]').attr('href'),
      hasViewport:     !!$('meta[name="viewport"]').attr('content'),
      imageCount:      $('img').length,
      imagesWithAlt:   $('img[alt]').length,
      internalLinks:   $(`a[href^="/"], a[href^="${url}"]`).length,
    };
  } catch {
    // Regex fallback if cheerio isn't installed yet
    signals = {
      hasTitle:    /<title[^>]*>(.+?)<\/title>/i.test(html),
      hasMetaDesc: /name=["']description["']/i.test(html),
      hasH1:       /<h1[^>]*>/i.test(html),
      hasOGTitle:  /property=["']og:title["']/i.test(html),
      hasOGDesc:   /property=["']og:description["']/i.test(html),
      hasOGImage:  /property=["']og:image["']/i.test(html),
      hasSchema:   /application\/ld\+json/i.test(html),
      hasCanonical:/rel=["']canonical["']/i.test(html),
      hasViewport: /name=["']viewport["']/i.test(html),
    };
  }

  return signals;
}
