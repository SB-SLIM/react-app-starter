import { createTRPCClient, httpBatchLink } from '@trpc/client'
import superjson from 'superjson'
import type { AppRouter } from '../../../server/src/trpc/_app'

const TRPC_URL = import.meta.env.VITE_TRPC_URL ?? 'http://localhost:3001/trpc'

export const trpcVanillaClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: TRPC_URL,
      transformer: superjson,
      headers() {
        const slug = localStorage.getItem('workspace-slug')
        return slug ? { 'x-workspace-slug': slug } : {}
      },
      fetch(url, options) {
        return fetch(url, { ...options, credentials: 'include' })
      },
    }),
  ],
})
