'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { MemberRole } from './index'
import type { Permission } from './permissions'

export type { MemberRole, Permission }

interface AclContextValue {
  /** Resolved permission strings for the current user (from the server). */
  permissions: string[]
  /** Kept for the few genuine "rank" checks; prefer permission checks. */
  role: MemberRole | null
  isPending: boolean
}

const AclContext = createContext<AclContextValue>({
  permissions: [],
  role: null,
  isPending: true,
})

interface AclProviderProps extends Partial<AclContextValue> {
  children: ReactNode
}

export function AclProvider({
  permissions = [],
  role = null,
  isPending = false,
  children,
}: AclProviderProps) {
  return (
    <AclContext.Provider value={{ permissions, role, isPending }}>
      {children}
    </AclContext.Provider>
  )
}

export function useAcl(): AclContextValue {
  return useContext(AclContext)
}

/** True if the current user holds the given permission. */
export function usePermission(permission: Permission): boolean {
  return useContext(AclContext).permissions.includes(permission)
}

interface CanProps {
  /** A single permission or a list (all required). */
  permission: Permission | Permission[]
  children: ReactNode
  fallback?: ReactNode
}

/** Render children only when the user holds the required permission(s). */
export function Can({ permission, children, fallback = null }: CanProps) {
  const { permissions, isPending } = useContext(AclContext)
  if (isPending) return <>{fallback}</>
  const required = Array.isArray(permission) ? permission : [permission]
  const allowed = required.every((p) => permissions.includes(p))
  return <>{allowed ? children : fallback}</>
}

// ── Role-based API (back-compat; prefer Can/usePermission) ───────────────────

export function useRole(): { role: MemberRole | null; isPending: boolean } {
  const { role, isPending } = useContext(AclContext)
  return { role, isPending }
}

interface AccessGuardProps {
  roles: MemberRole[]
  children: ReactNode
  fallback?: ReactNode
}

export function AccessGuard({
  roles,
  children,
  fallback = null,
}: AccessGuardProps) {
  const { role, isPending } = useRole()
  if (isPending || !role || !roles.includes(role)) return <>{fallback}</>
  return <>{children}</>
}
