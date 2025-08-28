/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' *.tosspayments.com *.toss.im *.kakao.com *.daumcdn.net;
              connect-src 'self' *.tosspayments.com *.toss.im *.kakao.com;
              frame-src 'self' *.tosspayments.com *.toss.im *.kakao.com;
              style-src 'self' 'unsafe-inline';
            `.replace(/\s{2,}/g, ' ').trim()
          }
        ]
      }
    ]
  }
};

module.exports = nextConfig;