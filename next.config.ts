import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // GitHub Pages configuration
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Output as static for GitHub Pages deployment
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
