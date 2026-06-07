// tRPC building blocks — import these to compose your project's AppRouter.
// The AppRouter itself lives in apps/server/src/trpc/_app.ts (not in this plugin).
export {
  router,
  publicProcedure,
  protectedProcedure,
  workspaceProcedure,
  middleware,
  enforceAuth,
  enforceWorkspace,
} from './init'
export type { Context } from './context'

// Platform routers shipped by the plugin (product-agnostic).
export { healthRouter } from './routers/health'
