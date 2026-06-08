import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  transpilePackages: ['@sb-codex/ui-components', '@sb-codex/core'],
}

export default nextConfig
