import { httpBatchLink, loggerLink } from '@trpc/client'
import superjson from 'superjson'
import { trpc } from './trpc'

const TRPC_URL = import.meta.env.VITE_TRPC_URL ?? 'http://localhost:3001/trpc'

export const trpcClient = trpc.createClient({
  links: [
    loggerLink({
      enabled: (op) =>
        import.meta.env.DEV ||
        (op.direction === 'down' && op.result instanceof Error),
    }),
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
