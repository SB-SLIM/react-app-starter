---
name: api-design
description: >
  Design and implement backend features in this repository. Use when adding a
  new tRPC router, procedure, or middleware to apps/server or
  packages/api-contracts; when adding a new database table with RLS policies;
  when registering a Fastify plugin; or when working with BullMQ jobs in
  packages/jobs. Covers procedure factory selection, pagination contract, error
  codes, Zod schema conventions, the permission-enforcement pattern, the
  tenant-scoped RLS SQL template, Fastify plugin registration order, and the
  BullMQ enqueue/worker pattern.
---

# API Design — tRPC in sb-codex

## Procedure factory decision tree

```
Is the user required to be signed in?
  └─ No  → publicProcedure
  └─ Yes → Is a workspace required?
              └─ No  → protectedProcedure
              └─ Yes → workspaceProcedure
                          └─ Does the operation need a permission check?
                                └─ Yes → requirePermission('resource:action')(workspaceProcedure)
```

### Imports

```ts
import {
  router,
  publicProcedure,
  protectedProcedure,
  workspaceProcedure,
} from '@sb-codex/api-contracts'
import { requirePermission } from '@sb-codex/acl'
```

---

## workspaceProcedure — what it does

`workspaceProcedure` calls `enforceWorkspace` middleware which:

1. Reads `x-workspace-slug` from the request header.
2. **Validates that `ctx.user` is an active member** of that workspace.
3. Calls `SET LOCAL app.workspace_id = '<id>'` inside a transaction.
4. Injects `ctx.workspace` into the context.

Never use `protectedProcedure` for business data — RLS only activates if `enforceWorkspace` ran first.

---

## requirePermission

```ts
// packages/acl/src/server.ts
export const requirePermission = (perm: Permission) =>
  (procedure: typeof workspaceProcedure) =>
    procedure.use(async ({ ctx, next }) => {
      if (!can(ctx.workspace.role, perm)) {
        throw new TRPCError({ code: 'FORBIDDEN', message: `Missing permission: ${perm}` })
      }
      return next()
    })

// Usage
const deleteClientProcedure = requirePermission('clients:delete')(workspaceProcedure)

export const clientsRouter = router({
  delete: deleteClientProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => { ... }),
})
```

---

## Pagination — required on all list procedures

Every `list`/`search` procedure **must** accept pagination input. Unbounded queries are not allowed.

### Cursor-based (preferred for large datasets)

```ts
const listInput = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(), // last item's id
})

const listOutput = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    items: z.array(itemSchema),
    nextCursor: z.string().nullable(),
  })
```

### Offset-based (acceptable for small datasets / admin tables)

```ts
const pageInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
})
```

---

## Zod schema conventions

```ts
// ✅ Good — explicit, no z.any()
const createClientInput = z.object({
  name: z.string().min(1).max(255).trim(),
  email: z.string().email().toLowerCase(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-()]{7,20}$/)
    .optional(),
})

// ❌ Bad — accepts anything, breaks type inference
const createClientInput = z.object({
  name: z.string(),
  extra: z.any(),
})
```

- Strings: always add `.trim()`. Add `.min(1)` to required strings.
- IDs: use `z.string().uuid()` — never `z.string()` alone for IDs.
- Enums: use `z.enum(['a','b'])` not `z.string()` when values are known.
- Dates: use `z.coerce.date()` at API boundaries, store as ISO strings in DB.

---

## Error codes — domain taxonomy

Use structured `TRPCError` with a `message` that is safe to display to the user.

```ts
import { TRPCError } from '@trpc/server'

// Authentication / authorization
throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Please sign in.' })
throw new TRPCError({
  code: 'FORBIDDEN',
  message: 'You do not have permission to delete clients.',
})

// Resource not found
throw new TRPCError({ code: 'NOT_FOUND', message: 'Client not found.' })

// Validation (prefer Zod parse errors, but use this for business rule violations)
throw new TRPCError({
  code: 'BAD_REQUEST',
  message: 'A client with this email already exists.',
})

// Conflict
throw new TRPCError({
  code: 'CONFLICT',
  message: 'This invitation has already been accepted.',
})

// Server fault
throw new TRPCError({
  code: 'INTERNAL_SERVER_ERROR',
  message: 'Something went wrong. Please try again.',
})
```

Never expose raw Postgres errors (`duplicate key`, `foreign key violation`) to the client — catch them and rethrow with a domain message.

---

## Router file structure

```ts
// apps/server/src/trpc/routers/clients.ts
import { z } from 'zod'
import { router } from '@sb-codex/api-contracts'
import { requirePermission } from '@sb-codex/acl'
import { workspaceProcedure } from '@sb-codex/api-contracts'
import { clients } from '@sb-codex/db'
import { TRPCError } from '@trpc/server'
import { eq, and } from 'drizzle-orm'

export const clientsRouter = router({
  list: workspaceProcedure
    .input(
      z.object({
        limit: z.number().int().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // RLS already filters to ctx.workspace.id — no WHERE workspace_id needed
      const rows = await ctx.db
        .select()
        .from(clients)
        .limit(input.limit + 1)
      const hasMore = rows.length > input.limit
      return {
        items: rows.slice(0, input.limit),
        nextCursor: hasMore ? rows[input.limit - 1].id : null,
      }
    }),

  delete: requirePermission('clients:delete')(workspaceProcedure)
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(clients)
        .where(eq(clients.id, input.id))
        .returning()
      if (!deleted)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Client not found.' })
      return deleted
    }),
})
```

---

## New router checklist

- [ ] File added to `apps/server/src/trpc/routers/<name>.ts`
- [ ] Router wired into `apps/server/src/trpc/_app.ts`
- [ ] All list procedures have pagination input
- [ ] All mutating procedures use `workspaceProcedure` or above
- [ ] Destructive procedures have `requirePermission(...)` guard
- [ ] No raw Postgres errors leak to client
- [ ] Corresponding integration test in `apps/server/src/__tests__/<name>.test.ts`

---

## Tenant-scoped table — RLS SQL template

After running `pnpm db:generate`, manually append the following to the generated migration file before running `pnpm db:migrate`:

```sql
ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;
ALTER TABLE <name> FORCE ROW LEVEL SECURITY;

CREATE POLICY ws_isolation ON <name>
  USING (workspace_id = current_setting('app.workspace_id'))
  WITH CHECK (workspace_id = current_setting('app.workspace_id'));
```

Also add a composite index if the table will be queried by `workspace_id + another_column`:

```sql
CREATE INDEX ON <name> (workspace_id, <other_column>);
```

---

## Fastify plugin order

Plugins are registered in `apps/server/src/server.ts`. **Order matters** — do not rearrange:

1. `helmet` — security headers
2. `cors` — must precede auth routes so preflight requests are handled
3. `rate-limit` — before business routes
4. `auth.plugin` — registers `/api/auth/*`, skips the tenant check
5. `tenant.plugin` — resolves workspace for all remaining routes
6. `trpc.plugin` — mounts `/api/trpc/*`

When adding a new plugin, insert it at the correct position and add a comment explaining why.

---

## BullMQ jobs

Queue definitions and typed payloads live in `packages/jobs/src/queues/`.
Workers live in `packages/jobs/src/workers/`.

```ts
// Enqueue (from apps/server)
import { emailQueue } from '@sb-codex/jobs'
await emailQueue.add('send-invite', {
  to: 'user@example.com',
  template: 'invite',
  workspaceId: '...',
})

// Worker (packages/jobs/src/workers/email.worker.ts)
emailQueue.process(async (job) => {
  // send via Nodemailer
})
```

Rules:

- All payloads must be typed (Zod schema or TypeScript interface) — no `any`.
- Add an **idempotency key** to jobs that call external services (Meilisearch, webhooks) so retries are safe.
- Never write to the database inside a worker without a transaction + `SET LOCAL app.workspace_id = '<id>'` — otherwise RLS is not active and writes are unscoped.
