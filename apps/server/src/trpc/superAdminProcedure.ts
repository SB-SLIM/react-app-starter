import { TRPCError } from '@trpc/server'
import { eq } from 'drizzle-orm'
import { user } from '@sb-codex/db'
import { middleware, protectedProcedure } from '@sb-codex/api-contracts'
import { type PlatformRole, PLATFORM_ROLE_HIERARCHY } from '@sb-codex/acl'

const enforcePlatform = (roles?: PlatformRole[]) =>
  middleware(async ({ ctx, next }) => {
    if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' })
    const [row] = await ctx.db
      .select({ platformRole: user.platformRole })
      .from(user)
      .where(eq(user.id, ctx.user.id))
      .limit(1)
    const role = row?.platformRole as PlatformRole | null
    if (!role) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Platform access required',
      })
    }
    if (roles && roles.length > 0) {
      const userRank = PLATFORM_ROLE_HIERARCHY[role]
      const minRank = Math.min(...roles.map((r) => PLATFORM_ROLE_HIERARCHY[r]))
      if (userRank < minRank) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Insufficient platform role',
        })
      }
    }
    return next({ ctx: { ...ctx, platformRole: role } })
  })

/** Gate a procedure on one or more platform roles (any matching role passes). */
export const platformProcedure = (roles?: PlatformRole[]) =>
  protectedProcedure.use(enforcePlatform(roles))

/** Any platform role — equivalent to former superAdminProcedure. */
export const superAdminProcedure = platformProcedure()

/** Only platform owners can call this procedure. */
export const platformOwnerProcedure = platformProcedure(['owner'])
