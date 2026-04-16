import './globals.css';
import Script from 'next/script';
import CookieBanner from '@/components/CookieBanner';

export const metadata = {
  title: 'AI Visibility Assessment | Abstrakt Marketing Group',
  description:
    'Find out if your business is invisible to AI. Get a free AI Visibility Assessment — covering your website health, local presence, and how AI tools like ChatGPT and Perplexity see your brand.',
  openGraph: {
    title: 'AI Visibility Assessment | Abstrakt Marketing Group',
    description: 'Is your business invisible to AI? Find out in minutes.',
    url: 'https://audit.abstraktmg.com',
    siteName: 'Abstrakt Marketing Group',
    images: [
      {
        url: 'https://audit.abstraktmg.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Find Out Why Your Competitors Are Beating You in AI Search',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Visibility Assessment | Abstrakt Marketing Group',
    description: 'Is your business invisible to AI? Find out in minutes.',
    images: ['https://audit.abstraktmg.com/og-image.png'],
  },
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID; // e.g. GTM-XXXXXXX

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ── Google Fonts ── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;600;700&display=swap"
          rel="stylesheet"
        />

        {/* ── GTM consent mode defaults (must fire before GTM loads) ──
            Sets all ad/analytics consent to denied by default.
            CookieBanner grants consent when user accepts.             */}
        {GTM_ID && (
          <script dangerouslySetInnerHTML={{ __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent','default',{
              ad_storage:             'denied',
              analytics_storage:      'denied',
              ad_user_data:           'denied',
              ad_personalization:     'denied',
              wait_for_update:        500
            });
            gtag('set','ads_data_redaction', true);
          `}} />
        )}

        {/* ── Google Tag Manager ── */}
        {GTM_ID && (
          <script dangerouslySetInnerHTML={{ __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}} />
        )}

      </head>

      <body className="bg-brand-bg text-white font-body antialiased">
        {/* GTM noscript fallback */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0" width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        {children}

        {/* ── Cookie consent banner ── */}
        <CookieBanner />

        {/* ── Wistia player ── */}
        <Script src="https://fast.wistia.com/player.js" strategy="afterInteractive" />
        <Script src="https://fast.wistia.com/embed/m2kgo37bny.js" strategy="afterInteractive" type="module" />
      </body>
    </html>
  );
}
