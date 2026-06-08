import { router, healthRouter } from '@sb-codex/api-contracts'
import { clientsRouter } from './routers/clients'
import { membersRouter } from './routers/members'
import { superAdminRouter } from './routers/superAdmin'
import { dashboardRouter } from './routers/dashboard'
import { workspaceRouter } from './routers/workspace'

export const appRouter = router({
  health: healthRouter,
  clients: clientsRouter,
  members: membersRouter,
  superAdmin: superAdminRouter,
  dashboard: dashboardRouter,
  workspace: workspaceRouter,
})

export type AppRouter = typeof appRouter
