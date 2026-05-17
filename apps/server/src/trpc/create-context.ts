import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import type { Context } from '@sb-codex/api-contracts'
import { db } from '../db'

export function createContext({ req }: CreateFastifyContextOptions): Context {
  return {
    requestId: req.id as string,
    user: req.user ?? null,
    workspace: req.workspace ?? null,
    db,
  }
}
