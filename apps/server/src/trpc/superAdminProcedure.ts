import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { user } from '@sb-codex/db'
import { middleware, protectedProcedure } from '@sb-codex/api-contracts'

const enforceSuperAdmin = middleware(async ({ ctx, next }) => {
  if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
  const [row] = await ctx.db
    .select({ isSuperAdmin: user.isSuperAdmin })
    .from(user)
    .where(eq(user.id, ctx.user.id))
    .limit(1)
  if (!row?.isSuperAdmin) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Super admin access required',
    })
  }
  return next({ ctx })
})

export const superAdminProcedure = protectedProcedure.use(enforceSuperAdmin)
