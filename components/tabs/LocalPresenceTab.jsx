'use client';

// Tab 3: Local & Search Presence
// Google Business Profile data with educational context.

export default function LocalPresenceTab({ auditData }) {
  const places = auditData?.places ?? null;

  return (
    <div className="space-y-8">
      {/* Why This Matters */}
      <div className="card border-l-4 border-brand-orange">
        <p className="section-label mb-2">Why This Matters</p>
        <p className="text-gray-300 text-sm leading-relaxed">
          When someone asks an AI tool "who's the best [service] near me," the answer pulls heavily from Google
          Business Profile data. An incomplete or missing profile is one of the most common reasons businesses
          are invisible in local AI recommendations.
        </p>
      </div>

      {/* GBP not found */}
      {!places?.found && (
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
      )}

      {/* GBP found */}
      {places?.found && (
        <>
          {/* Profile score */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-5">Google Business Profile</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="card">
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Profile Completeness</p>
                <div className="flex items-end gap-2 mb-2">
                  <span className={`font-heading text-4xl font-bold ${scoreColor(places.profileScore)}`}>
                    {places.profileScore}
                  </span>
                  <span className="text-gray-500 text-sm mb-1">/100</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${places.profileScore}%`, backgroundColor: scoreHex(places.profileScore) }}
                  />
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
          </div>

          {/* Profile details */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">Profile Details</h3>
            <div className="card">
              <div className="space-y-3">
                <DetailRow label="Business Name" value={places.name} />
                <DetailRow label="Address"       value={places.address} />
                <DetailRow label="Phone"         value={places.phone} />
                <DetailRow label="Website"       value={places.website} />
                <DetailRow
                  label="Status"
                  value={places.businessStatus === 'OPERATIONAL' ? '✓ Open for Business' : places.businessStatus}
                  highlight={places.businessStatus === 'OPERATIONAL'}
                />
              </div>
            </div>
          </div>

          {/* Profile signals */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">Profile Signals</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <SignalRow label="Phone Number Listed"   present={places.hasPhone}   tip="A phone number increases trust and click-to-call conversions." />
              <SignalRow label="Website Linked"        present={places.hasWebsite} tip="Linking your website reinforces NAP consistency signals." />
              <SignalRow label="Business Hours Set"    present={places.hasHours}   tip="Hours help AI tools recommend your business for 'open now' searches." />
              <SignalRow label="Customer Reviews"      present={places.reviewCount > 0} tip="Reviews are a primary signal AI tools use to gauge business quality." />
              <SignalRow label="Has 10+ Reviews"       present={places.reviewCount >= 10} tip="10+ reviews is a threshold that meaningfully improves AI recommendation rates." />
              <SignalRow label="Rating 4.0+"           present={(places.rating ?? 0) >= 4.0} tip="High-rated businesses are far more likely to appear in AI recommendations." />
            </div>
          </div>

          {/* Review gap callout */}
          {places.reviewCount < 10 && (
            <div className="card border-yellow-900/50 bg-yellow-900/10">
              <p className="section-label text-yellow-400 mb-2">Opportunity: Reviews</p>
              <p className="text-sm text-gray-300">
                You have <strong className="text-white">{places.reviewCount} reviews</strong>. Businesses with
                10+ reviews see significantly higher mention rates in AI-generated recommendations. Consider
                a structured review request campaign as a quick win.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
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
