/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '3000.zdyhh.top',
      },
    ],
  },
}

module.exports = nextConfig