// app/api/providers/places.js
// Looks up the business in Google Places and returns GBP health signals.
// Accepts companyName + optional website domain to improve match accuracy.

export async function runPlaces(companyName, websiteUrl) {
  const apiKey = process.env.GOOGLE_API_KEY;

  // Build search query — include domain to disambiguate common business names
  const domain = extractDomain(websiteUrl);
  const searchQuery = domain
    ? `${companyName} ${domain}`
    : companyName;

  // Step 1: Find Place ID by name (+ domain for disambiguation)
  const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`;
  const searchRes  = await fetch(searchUrl);
  const searchData = await searchRes.json();

  let candidate = searchData.candidates?.[0];
  if (!candidate) {
    return { found: false, companyName };
  }

  // Step 2: Get place details
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${candidate.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,business_status,opening_hours,types&key=${apiKey}`;
  const detailsRes  = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();

  const place = detailsData.result;
  if (!place) return { found: false, companyName };

  // Step 3: Validate the result matches the submitted domain when possible
  // If GBP website doesn't match submitted domain, try a fallback search by name only
  if (domain && place.website) {
    const gbpDomain = extractDomain(place.website);
    if (gbpDomain && gbpDomain !== domain) {
      // Domains don't match — try name-only search as fallback
      const fallbackUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(companyName)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`;
      const fallbackRes  = await fetch(fallbackUrl);
      const fallbackData = await fallbackRes.json();
      const fallbackCandidate = fallbackData.candidates?.[0];

      if (fallbackCandidate && fallbackCandidate.place_id !== candidate.place_id) {
        // Check if fallback matches domain better
        const fbDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${fallbackCandidate.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,business_status,opening_hours,types&key=${apiKey}`;
        const fbDetailsRes  = await fetch(fbDetailsUrl);
        const fbDetailsData = await fbDetailsRes.json();
        const fbPlace = fbDetailsData.result;
        if (fbPlace?.website && extractDomain(fbPlace.website) === domain) {
          // Fallback is a better match — use it
          return buildPlaceResult(fbPlace, companyName);
        }
      }
      // Neither matched — return the original result but flag the mismatch
      return { ...buildPlaceResult(place, companyName), domainMismatch: true };
    }
  }

  return buildPlaceResult(place, companyName);
}

function buildPlaceResult(place, companyName) {
  return {
    found:          true,
    name:           place.name,
    address:        place.formatted_address,
    phone:          place.formatted_phone_number ?? null,
    website:        place.website ?? null,
    rating:         place.rating ?? null,
    reviewCount:    place.user_ratings_total ?? 0,
    businessStatus: place.business_status ?? 'UNKNOWN',
    isOpen:         place.opening_hours?.open_now ?? null,
    categories:     place.types ?? [],
    hasPhone:       !!place.formatted_phone_number,
    hasWebsite:     !!place.website,
    hasHours:       !!place.opening_hours,
    profileScore: Math.min(100, [
      !!place.name,
      !!place.formatted_address,
      !!place.formatted_phone_number,
      !!place.website,
      (place.user_ratings_total ?? 0) > 0,
    ].filter(Boolean).length * 20),
  };
}

function extractDomain(url) {
  if (!url) return null;
  try {
    const u = url.startsWith('http') ? url : `https://${url}`;
    return new URL(u).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return null;
  }
}
