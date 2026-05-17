import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import type { Context } from '@sb-codex/api-contracts'

export function createContext({ req }: CreateFastifyContextOptions): Context {
  return {
    requestId: req.id as string,
    // Phase 3 replaces this with a real session lookup
    user: null,
  }
}
