// app/api/providers/places.js
// Looks up the business in Google Places and returns GBP health signals.

export async function runPlaces(companyName) {
  const apiKey = process.env.GOOGLE_API_KEY;

  // Step 1: Find Place ID by name
  const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(companyName)}&inputtype=textquery&fields=place_id,name,formatted_address&key=${apiKey}`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();

  const candidate = searchData.candidates?.[0];
  if (!candidate) {
    return { found: false, companyName };
  }

  // Step 2: Get place details
  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${candidate.place_id}&fields=name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,business_status,opening_hours,types&key=${apiKey}`;
  const detailsRes = await fetch(detailsUrl);
  const detailsData = await detailsRes.json();

  const place = detailsData.result;
  if (!place) return { found: false, companyName };

  return {
    found:         true,
    name:          place.name,
    address:       place.formatted_address,
    phone:         place.formatted_phone_number ?? null,
    website:       place.website ?? null,
    rating:        place.rating ?? null,
    reviewCount:   place.user_ratings_total ?? 0,
    businessStatus: place.business_status ?? 'UNKNOWN',
    isOpen:        place.opening_hours?.open_now ?? null,
    categories:    place.types ?? [],
    hasPhone:      !!place.formatted_phone_number,
    hasWebsite:    !!place.website,
    hasHours:      !!place.opening_hours,
    // Simple health score: each signal = 20 points
    profileScore: Math.min(100, [
      !!place.name,
      !!place.formatted_address,
      !!place.formatted_phone_number,
      !!place.website,
      (place.user_ratings_total ?? 0) > 0,
    ].filter(Boolean).length * 20),
  };
}
