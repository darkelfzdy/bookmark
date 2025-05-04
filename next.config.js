/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    // 启用Cloudflare Workers支持
    edge: true,
  },
};

module.exports = nextConfig;