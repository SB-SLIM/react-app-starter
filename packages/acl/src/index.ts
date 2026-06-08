import { TRPCError } from '@trpc/server'
import {
  middleware,
  workspaceProcedure,
  type MemberRole,
} from '@sb-codex/api-contracts'

export type { MemberRole }

export const ROLE_HIERARCHY: Record<MemberRole, number> = {
  owner: 3,
  admin: 2,
  member: 1,
}

export function hasRole(
  userRole: MemberRole | null,
  required: MemberRole,
): boolean {
  if (!userRole) return false
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[required]
}

export const enforceRole = (allowed: MemberRole[]) =>
  middleware(({ ctx, next }) => {
    if (!ctx.memberRole || !allowed.includes(ctx.memberRole)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Insufficient role' })
    }
    return next({ ctx })
  })

export const adminProcedure = workspaceProcedure.use(
  enforceRole(['owner', 'admin']),
)

export const ownerProcedure = workspaceProcedure.use(enforceRole(['owner']))
