// lib/utmCapture.js
// Captures UTM params + GCLID from URL and persists to sessionStorage.
// Called on /assess page mount. Passed into Zapier webhook and Chilipiper lead object.

export function captureUTMParams(searchParams) {
  const params = {
    utmSource:   searchParams.get('utm_source')   || '',
    utmMedium:   searchParams.get('utm_medium')   || '',
    utmCampaign: searchParams.get('utm_campaign') || '',
    utmContent:  searchParams.get('utm_content')  || '',
    gclid:       searchParams.get('gclid')        || '',
  };

  // Persist so they survive page navigation
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('utmParams', JSON.stringify(params));
  }

  return params;
}

export function getStoredUTMParams() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(sessionStorage.getItem('utmParams') || '{}');
  } catch {
    return {};
  }
}
