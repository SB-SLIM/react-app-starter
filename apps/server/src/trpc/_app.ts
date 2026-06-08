import { router, healthRouter } from '@sb-codex/api-contracts'
import { clientsRouter } from './routers/clients'
import { membersRouter } from './routers/members'

export const appRouter = router({
  health: healthRouter,
  clients: clientsRouter,
  members: membersRouter,
})

export type AppRouter = typeof appRouter
