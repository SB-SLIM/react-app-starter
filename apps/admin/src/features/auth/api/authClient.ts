import { createSbAuthClient } from '@sb-codex/auth/client'

export const authClient = createSbAuthClient(
  import.meta.env.VITE_BETTER_AUTH_URL ?? 'http://localhost:3001',
)

export const { useSession } = authClient
