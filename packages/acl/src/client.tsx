'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { MemberRole } from './index'

export type { MemberRole }

interface AclContextValue {
  role: MemberRole | null
  isPending: boolean
}

const AclContext = createContext<AclContextValue>({
  role: null,
  isPending: true,
})

interface AclProviderProps extends AclContextValue {
  children: ReactNode
}

export function AclProvider({ role, isPending, children }: AclProviderProps) {
  return (
    <AclContext.Provider value={{ role, isPending }}>
      {children}
    </AclContext.Provider>
  )
}

export function useRole(): AclContextValue {
  return useContext(AclContext)
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
