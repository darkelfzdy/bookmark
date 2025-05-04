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
  typescript: {
    // !! 警告 !!
    // 仅用于解决部署问题，生产环境不推荐
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig