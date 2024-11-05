import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // hostname: process.env.NEXT_PUBLIC_GATEWAY_URL || 'localhost',
        hostname: 'ivory-brilliant-bedbug-584.mypinata.cloud',
        port: '',
        pathname: '/files/**',
      }
      
    ]
  }
}

export default nextConfig
