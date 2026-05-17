import { router } from '../init'
import { healthRouter } from './health'
import { clientsRouter } from './clients'

export const appRouter = router({
  health: healthRouter,
  clients: clientsRouter,
})

export type AppRouter = typeof appRouter
