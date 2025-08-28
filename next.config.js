/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export output so the app can run as a SPA on static hosts
  output: 'export',
  images: {
    // Disable image optimization for static export/GitHub Pages compatibility
    unoptimized: true,
    domains: ['localhost'],
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
