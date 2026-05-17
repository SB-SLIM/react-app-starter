import type { Database } from '@sb-codex/db'

export interface Context {
  requestId: string
  user: { id: string; email: string; name: string } | null
  workspace: { id: string; slug: string; name: string } | null
  db: Database
}
