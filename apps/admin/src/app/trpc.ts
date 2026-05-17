import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '@sb-codex/api-contracts'

export const trpc = createTRPCReact<AppRouter>()
