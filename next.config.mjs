/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['pdfkit'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'abstrakt-ai-brand-lift.vercel.app',
      },
    ],
  },
  // ── HTTP Security Headers (OWASP / SOC 2) ──────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Deny framing (clickjacking protection)
          { key: 'X-Frame-Options', value: 'DENY' },
          // HSTS — 1 year, include subdomains
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          // Limit referrer info to same origin
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Permissions policy — restrict unneeded browser features
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // CSP — allows self, Google APIs (PageSpeed/Places), Brevo, CDNs used by the app
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://cdn.chilipiper.com https://js.chilipiper.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https: blob:",
              "connect-src 'self' https://api.anthropic.com https://www.googleapis.com https://api.semrush.com https://gtmetrix.com https://api.brevo.com https://api.resend.com https://hooks.zapier.com https://*.vercel-blob.com",
              "frame-src https://chilipiper.com https://*.chilipiper.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
