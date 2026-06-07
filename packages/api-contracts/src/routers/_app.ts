// Platform router — health only.
// Projects compose their own appRouter in apps/server/src/trpc/_app.ts,
// merging this healthRouter with their domain-specific routers.
export { healthRouter } from './health'
