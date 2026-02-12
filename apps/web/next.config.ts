import "./env/server"
import "./env/client"
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV !== 'development',
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
    typedEnv: true,
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  }
}

export default nextConfig