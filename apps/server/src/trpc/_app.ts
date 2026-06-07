import { router, healthRouter } from '@sb-codex/api-contracts'
import { clientsRouter } from './routers/clients'

export const appRouter = router({
  health: healthRouter,
  clients: clientsRouter,
})

export type AppRouter = typeof appRouter
