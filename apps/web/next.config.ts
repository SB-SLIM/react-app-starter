import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@sb-codex/ui-components', '@sb-codex/core'],
  eslint: {
    // Linting runs as a dedicated turbo task (pnpm lint), not during build
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
