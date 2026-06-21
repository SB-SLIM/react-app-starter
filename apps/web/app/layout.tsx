import type { Metadata } from 'next'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import { UIProvider } from '@sb-codex/ui-components'
import './globals.css'

export const metadata: Metadata = {
  title: 'SB Codex — Batteries-included SaaS starter',
  description:
    'Auth, multi-tenant API, background jobs, and a full design system — ready to ship.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <UIProvider>{children}</UIProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
