import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // GitHub Pages configuration
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Output as static for GitHub Pages deployment
  output: process.env.NEXT_BUILD_STANDALONE ? 'standalone' : undefined,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
