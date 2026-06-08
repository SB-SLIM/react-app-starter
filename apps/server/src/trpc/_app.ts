import { router, healthRouter } from '@sb-codex/api-contracts'
import { clientsRouter } from './routers/clients'
import { membersRouter } from './routers/members'
import { superAdminRouter } from './routers/superAdmin'

export const appRouter = router({
  health: healthRouter,
  clients: clientsRouter,
  members: membersRouter,
  superAdmin: superAdminRouter,
})

export type AppRouter = typeof appRouter
