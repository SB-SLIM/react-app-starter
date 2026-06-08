import { redirect } from '@tanstack/react-router'
import { authClient } from '@/features/auth/api/authClient'
import { trpcVanillaClient } from '@/app/trpcVanillaClient'
import type { MemberRole } from '@sb-codex/acl'

export function requireRole(allowed: MemberRole[]) {
  return async () => {
    const session = await authClient.getSession()
    if (!session) throw redirect({ to: '/sign-in' })

    let role: MemberRole
    try {
      const result = await trpcVanillaClient.members.me.query()
      role = result.role
    } catch {
      throw redirect({ to: '/dashboard' })
    }

    if (!allowed.includes(role)) throw redirect({ to: '/dashboard' })
  }
}
