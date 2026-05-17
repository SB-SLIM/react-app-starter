import { initTRPC, TRPCError } from '@trpc/server'
import { sql } from 'drizzle-orm'
import superjson from 'superjson'
import type { Database } from '@sb-codex/db'
import type { Context } from './context'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        code: error.code,
      },
    }
  },
})

export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware

export const enforceAuth = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({ ctx: { ...ctx, user: ctx.user } })
})

export const protectedProcedure = publicProcedure.use(enforceAuth)

// Wraps the downstream call in a transaction with SET LOCAL app.workspace_id.
// RLS on tenant-scoped tables then enforces isolation automatically.
export const enforceWorkspace = middleware(async ({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
  if (!ctx.workspace) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'No workspace context' })
  }

  const workspaceId = ctx.workspace.id

  return ctx.db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('app.workspace_id', ${workspaceId}, true)`,
    )
    return next({ ctx: { ...ctx, db: tx as unknown as Database } })
  })
})

export const workspaceProcedure = protectedProcedure.use(enforceWorkspace)
