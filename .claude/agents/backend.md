# Agent: Backend

Specialized context for working in `apps/server` and all `packages/*`.
Read `CLAUDE.md` for global rules. This file adds backend-specific guardrails.

---

## Scope

- `apps/server` — Fastify 5 + tRPC v11 + Pino (owns `appRouter` and `AppRouter` type)
- `packages/db` — Drizzle ORM schema, migrations, RLS
- `packages/auth` — better-auth server config + client facade
- `packages/api-contracts` — tRPC factories, context, procedure types
- `packages/acl` — RBAC permission system
- `packages/jobs` — BullMQ queues and workers
- `packages/core`, `packages/config` — pure utilities

---

## The most important rule: RLS is the tenant boundary

The `app` Postgres role has RLS active. The `app.workspace_id` session variable is the key.

```
enforceWorkspace middleware
  1. reads x-workspace-slug header
  2. validates ctx.user is an ACTIVE MEMBER of that workspace  ← MUST happen
  3. opens a transaction
  4. SET LOCAL app.workspace_id = '<workspace_uuid>'
  5. all queries inside the transaction are automatically filtered by RLS
```

**Never** add `WHERE workspace_id = ctx.workspace.id` to queries inside `enforceWorkspace`. It is redundant — RLS does it. Adding it anyway creates a false sense of security (it could be removed, and nothing would break the RLS path, but the manual filter would also be gone).

**Never** use `db.delete(table).where(...)` without verifying `.returning()` checks that a row was actually deleted. Use `.returning()` and throw `NOT_FOUND` if the result is empty.

---

## Connection roles — never confuse them

| Role | Used by | RLS enforced? |
|---|---|---|
| `postgres` (superuser) | `migrate` service only | No — superusers bypass RLS |
| `app` | `apps/server` at runtime | Yes |

`DATABASE_URL` in `.env.production` is the **superuser URL for migrations only**.
The server reads `APP_DB_PASSWORD` and constructs its own connection string to connect as `app`.

---

## Adding a new tRPC router

1. Create `apps/server/src/trpc/routers/<name>.ts`.
2. Use the procedure factory from `.claude/skills/api-design/SKILL.md`.
3. Wire into `apps/server/src/trpc/_app.ts`:
   ```ts
   import { nameRouter } from './routers/name'
   export const appRouter = router({ ..., name: nameRouter })
   export type AppRouter = typeof appRouter
   ```
4. The admin app imports `AppRouter` **as a type only** — never as a value.

---

## Adding a new database table

1. Add schema to `packages/db/src/schema/<name>.ts`.
2. Export from `packages/db/src/schema/index.ts`.
3. Run `pnpm db:generate` — inspect the generated migration SQL.
4. **Manually append RLS** to the migration file:
   ```sql
   ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;
   ALTER TABLE <name> FORCE ROW LEVEL SECURITY;

   CREATE POLICY ws_isolation ON <name>
     USING (workspace_id = current_setting('app.workspace_id'))
     WITH CHECK (workspace_id = current_setting('app.workspace_id'));
   ```
5. Run `pnpm db:migrate`.
6. Add the `workspace_id` composite index if the table will be queried by `workspace_id + another_column`.

---

## Fastify plugin system

Plugins are registered in `apps/server/src/server.ts`. Order matters:

1. `helmet` — security headers
2. `cors` — must be before auth routes
3. `rate-limit` — before business routes
4. `auth.plugin` — registers `/api/auth/*` routes, skips tenant check
5. `tenant.plugin` — resolves workspace for all other routes
6. `trpc.plugin` — mounts `/api/trpc/*`

When adding a new plugin, register it in this order and document why in a comment.

---

## BullMQ jobs

Queue definitions and typed payloads live in `packages/jobs/src/queues/`.
Workers live in `packages/jobs/src/workers/`.

```ts
// Enqueue (from apps/server)
import { emailQueue } from '@sb-codex/jobs'
await emailQueue.add('send-invite', { to: 'user@example.com', template: 'invite', ... })

// Worker (packages/jobs/src/workers/email.worker.ts)
emailQueue.process(async (job) => {
  // send via Nodemailer
})
```

Rules:
- All payloads must be typed (Zod or TypeScript interface) — no `any`.
- Add an idempotency key to jobs that interact with external services (Meilisearch, webhooks) to make retries safe.
- Never do database writes inside a worker without a transaction + `SET LOCAL app.workspace_id`.

---

## Environment variables

All new env vars for `apps/server` must be:
1. Added to `apps/server/src/env.ts` (Zod schema — server fails to start if invalid).
2. Added to `.env.example`.
3. Added to `CLAUDE.md` § Production Deployment if required in production.
4. Added as a GitHub Actions secret/variable if needed at CI/build time.

---

## Packages are publishable — no business logic

Every `packages/*` must be product-agnostic. If you find yourself adding a domain concept
(a `booking` table, a `travel` type) to a package, stop — it belongs in `apps/server` or a
project-owned package, not in `@sb-codex/*`.
