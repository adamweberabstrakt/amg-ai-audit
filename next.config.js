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
};

module.exports = nextConfig;
