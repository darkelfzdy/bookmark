/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8788/api/:path*',
      },
    ]
  },
  allowedDevOrigins: ['3000.zdyhh.top'],
}

export default nextConfig;
