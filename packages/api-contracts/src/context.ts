import type { Database } from '@sb-codex/db'

export type MemberRole = 'owner' | 'admin' | 'manager' | 'commercial' | 'member'

export interface Context {
  requestId: string
  user: { id: string; email: string; name: string } | null
  workspace: { id: string; slug: string; name: string } | null
  memberRole: MemberRole | null
  db: Database
}
