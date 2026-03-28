import type { NextConfig } from 'next'


const repo = 'EnglishAppForDev';
const nextConfig: NextConfig = {
  // Configuração para GitHub Pages
  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
