import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
    typedEnv: true,
  },
}

export default nextConfig