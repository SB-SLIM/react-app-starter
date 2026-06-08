import { authClient } from '../api/authClient'
import { trpc } from '@/app/trpc'
import type { MemberRole } from '@sb-codex/acl'

export function useMemberRole(): {
  role: MemberRole | null
  permissions: string[]
  isPending: boolean
} {
  const { session } = authClient.useSession()

  const query = trpc.members.me.useQuery(undefined, {
    enabled: !!session,
    staleTime: 5 * 60 * 1000,
  })

  return {
    role: query.data?.role ?? null,
    permissions: query.data?.permissions ?? [],
    isPending: query.isPending && !!session,
  }
}
