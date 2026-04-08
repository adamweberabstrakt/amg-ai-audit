'use client';

// Tab 3: Local & Search Presence
// Google Business Profile data + directory listing audit.

const DIRECTORIES = [
  { name: 'Yelp',                   url: 'https://www.yelp.com/search?find_desc=',                             category: 'Reviews' },
  { name: 'Better Business Bureau', url: 'https://www.bbb.org/search?find_text=',                              category: 'Trust' },
  { name: 'Angi',                   url: 'https://www.angi.com/search?q=',                                     category: 'Home Services' },
  { name: 'Yellow Pages',           url: 'https://www.yellowpages.com/search?search_terms=',                   category: 'Directory' },
  { name: 'Bing Places',            url: 'https://www.bingplaces.com/',                                        category: 'Search' },
  { name: 'Apple Maps',             url: 'https://maps.apple.com/?q=',                                        category: 'Maps' },
  { name: 'Facebook Business',      url: 'https://www.facebook.com/search/pages/?q=',                         category: 'Social' },
  { name: 'LinkedIn Company',       url: 'https://www.linkedin.com/search/results/companies/?keywords=',       category: 'B2B' },
  { name: 'Foursquare',             url: 'https://foursquare.com/explore?q=',                                  category: 'Local' },
  { name: 'Manta',                  url: 'https://www.manta.com/search?search=',                               category: 'Directory' },
  { name: 'Thumbtack',              url: 'https://www.thumbtack.com/search?q=',                                category: 'Services' },
  { name: 'Clutch',                 url: 'https://clutch.co/search?q=',                                       category: 'B2B' },
];

export default function LocalPresenceTab({ auditData }) {
  const places  = auditData?.places ?? null;
  const company = auditData?.meta?.company ?? '';

  return (
    <div className="space-y-8">
      {/* Why This Matters */}
      <div className="card border-l-4 border-brand-orange">
        <p className="section-label mb-2">Why This Matters</p>
        <p className="text-gray-300 text-sm leading-relaxed">
          When someone asks an AI tool "who's the best [service] near me," the answer pulls from Google
          Business Profile, review sites, and directory citations. The more consistent and complete your
          presence across these platforms, the more likely AI tools are to recommend you.
        </p>
      </div>

      {/* GBP Section */}
      <div>
        <h3 className="font-heading text-xl font-semibold mb-5">Google Business Profile</h3>

        {!places?.found ? (
          <div className="card border-red-900/50 text-center py-10">
            <p className="text-red-400 text-4xl mb-4">⚠️</p>
            <h3 className="font-heading text-xl font-semibold text-red-300 mb-2">
              No Google Business Profile Found
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              We couldn't find a Google Business Profile for this company. This is a significant gap — AI tools
              rely heavily on GBP data for local and service-based recommendations.
            </p>
            <a
              href="https://business.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-6 btn-primary text-sm"
            >
              Create Your Google Business Profile →
            </a>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-6 mb-6">
              <div className="card">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Profile Completeness</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className={`font-heading text-4xl font-bold ${scoreColor(places.profileScore)}`}>
                    {places.profileScore}
                  </span>
                  <span className="text-gray-500 text-sm mb-1">/100</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${places.profileScore}%`, backgroundColor: scoreHex(places.profileScore) }} />
                </div>
              </div>
              <div className="card">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Customer Rating</p>
                {places.rating ? (
                  <>
                    <div className="flex items-end gap-2 mb-1">
                      <span className="font-heading text-4xl font-bold text-yellow-400">{places.rating}</span>
                      <span className="text-yellow-400 text-xl mb-1">★</span>
                    </div>
                    <p className="text-gray-400 text-sm">{places.reviewCount?.toLocaleString()} reviews</p>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm mt-2">No ratings yet</p>
                )}
              </div>
            </div>

            <div className="card mb-6">
              <div className="space-y-3">
                <DetailRow label="Business Name" value={places.name} />
                <DetailRow label="Address"       value={places.address} />
                <DetailRow label="Phone"         value={places.phone} />
                <DetailRow label="Website"       value={places.website} />
                <DetailRow label="Status" value={places.businessStatus === 'OPERATIONAL' ? '✓ Open for Business' : places.businessStatus} highlight={places.businessStatus === 'OPERATIONAL'} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              <SignalRow label="Phone Number Listed"  present={places.hasPhone}             tip="A phone number increases trust and click-to-call conversions." />
              <SignalRow label="Website Linked"       present={places.hasWebsite}           tip="Linking your website reinforces NAP consistency signals." />
              <SignalRow label="Business Hours Set"   present={places.hasHours}             tip="Hours help AI tools recommend your business for open now searches." />
              <SignalRow label="Has Customer Reviews" present={places.reviewCount > 0}      tip="Reviews are a primary signal AI tools use to gauge business quality." />
              <SignalRow label="Has 10+ Reviews"      present={places.reviewCount >= 10}    tip="10+ reviews meaningfully improves AI recommendation rates." />
              <SignalRow label="Rating 4.0+"          present={(places.rating ?? 0) >= 4.0} tip="High-rated businesses are far more likely to appear in AI recommendations." />
            </div>

            {places.reviewCount < 10 && (
              <div className="card border-yellow-900/50 bg-yellow-900/10">
                <p className="section-label text-yellow-400 mb-2">Opportunity: Reviews</p>
                <p className="text-sm text-gray-300">
                  You have <strong className="text-white">{places.reviewCount} reviews</strong>. Businesses with
                  10+ reviews see significantly higher mention rates in AI-generated recommendations.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Directory Listing Audit */}
      <div>
        <h3 className="font-heading text-xl font-semibold mb-2">Business Directory Audit</h3>
        <p className="text-gray-400 text-sm mb-5">
          AI tools cross-reference your business across these directories for NAP consistency (Name, Address, Phone).
          Each gap reduces your local AI visibility. Click each row to verify your listing is claimed and accurate.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {DIRECTORIES.map((dir) => (
            <a
              key={dir.name}
              href={`${dir.url}${encodeURIComponent(company)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center justify-between gap-3 hover:border-brand-orange/50 transition-colors group"
              style={{ textDecoration: 'none' }}
            >
              <div>
                <p className="text-sm font-medium text-white group-hover:text-brand-orange transition-colors">{dir.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{dir.category}</p>
              </div>
              <span className="text-xs text-brand-orange font-medium whitespace-nowrap flex-shrink-0">Verify →</span>
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-4">
          💡 Each link searches for your business name on that platform. Claim and complete any missing listings to strengthen your local AI visibility.
        </p>
      </div>
    </div>
  );
}

function DetailRow({ label, value, highlight }) {
  if (!value) return (
    <div className="flex gap-4 py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-500 text-sm w-32 flex-shrink-0">{label}</span>
      <span className="text-red-400 text-sm">Not listed</span>
    </div>
  );
  return (
    <div className="flex gap-4 py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-500 text-sm w-32 flex-shrink-0">{label}</span>
      <span className={`text-sm ${highlight ? 'text-green-400' : 'text-gray-200'}`}>{value}</span>
    </div>
  );
}

function SignalRow({ label, present, tip }) {
  return (
    <div className="card flex gap-3 items-start">
      <span className={`text-base flex-shrink-0 mt-0.5 ${present ? 'text-green-400' : 'text-red-400'}`}>
        {present ? '✓' : '✗'}
      </span>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{tip}</p>
      </div>
    </div>
  );
}

function scoreColor(val) {
  if (val >= 70) return 'text-green-400';
  if (val >= 40) return 'text-yellow-400';
  return 'text-red-400';
}
function scoreHex(val) {
  if (val >= 70) return '#22c55e';
  if (val >= 40) return '#f59e0b';
  return '#ef4444';
}
