import type { Metadata } from 'next'
import { LandingClient } from './LandingClient'

export const metadata: Metadata = {
  title: 'sb-codex — The SaaS starter kit that ships everything',
  description:
    'Auth, multi-tenant API, background jobs, a full design system, and CI/CD — wired together and ready on day one.',
}

export default function LandingPage() {
  return <LandingClient />
}
