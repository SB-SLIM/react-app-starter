import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@sb-codex/ui-components', '@sb-codex/core'],
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
