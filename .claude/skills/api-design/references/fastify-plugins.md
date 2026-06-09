# Fastify plugin registration order

Read this when adding or reordering a Fastify plugin in `apps/server/src/server.ts`.

**Order matters — do not rearrange:**

1. `helmet` — security headers
2. `cors` — must precede auth routes so preflight requests are handled
3. `rate-limit` — before business routes
4. `auth.plugin` — registers `/api/auth/*`, skips the tenant check
5. `tenant.plugin` — resolves workspace for all remaining routes
6. `trpc.plugin` — mounts `/api/trpc/*`

When adding a new plugin, insert it at the correct position and add a comment explaining
why. A plugin that needs the resolved session must come **after** `auth.plugin`; one that
needs the resolved workspace must come **after** `tenant.plugin`.
