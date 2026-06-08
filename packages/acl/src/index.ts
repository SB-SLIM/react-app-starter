import { TRPCError } from '@trpc/server'
import {
  middleware,
  workspaceProcedure,
  type MemberRole,
} from '@sb-codex/api-contracts'
import { PERMISSIONS, type Permission } from './permissions'

export type { MemberRole }
export { PERMISSIONS, type Permission }

// ── Role hierarchy (kept for genuine "rank" checks) ──────────────────────────
export const ROLE_HIERARCHY: Record<MemberRole, number> = {
  owner: 5,
  admin: 4,
  manager: 3,
  commercial: 2,
  member: 1,
}

export function hasRole(
  userRole: MemberRole | null,
  required: MemberRole,
): boolean {
  if (!userRole) return false
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[required]
}

// ── Permissions (the source of truth for feature access) ─────────────────────
// `'*'` grants everything. This map is SERVER-ONLY — the browser receives the
// resolved permission strings via `permissionsFor`, never this object.
const ROLE_PERMISSIONS: Record<MemberRole, readonly Permission[] | ['*']> = {
  owner: ['*'],
  admin: ['*'],
  manager: [
    'clients:read',
    'clients:create',
    'clients:update',
    'clients:delete',
  ],
  commercial: ['clients:read', 'clients:create', 'clients:update'],
  member: ['clients:read'],
}

/** Resolve a role to its concrete permission strings (expands `'*'`). */
export function permissionsFor(role: MemberRole | null): Permission[] {
  if (!role) return []
  const grants = ROLE_PERMISSIONS[role]
  if (grants[0] === '*') return [...PERMISSIONS]
  return [...(grants as readonly Permission[])]
}

/** Does the role grant a given permission? */
export function can(role: MemberRole | null, perm: Permission): boolean {
  return permissionsFor(role).includes(perm)
}

// ── tRPC middleware / procedures ─────────────────────────────────────────────
export const enforceRole = (allowed: MemberRole[]) =>
  middleware(({ ctx, next }) => {
    if (!ctx.memberRole || !allowed.includes(ctx.memberRole)) {
      throw new TRPCError({ code: 'FORBIDDEN', message: 'Insufficient role' })
    }
    return next({ ctx })
  })

/** Gate a procedure on a specific permission (the canonical feature gate). */
export const requirePermission = (perm: Permission) =>
  workspaceProcedure.use(({ ctx, next }) => {
    if (!can(ctx.memberRole, perm)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Missing permission: ${perm}`,
      })
    }
    return next({ ctx })
  })

export const adminProcedure = workspaceProcedure.use(
  enforceRole(['owner', 'admin']),
)

export const ownerProcedure = workspaceProcedure.use(enforceRole(['owner']))
