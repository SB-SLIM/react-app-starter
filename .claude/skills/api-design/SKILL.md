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

Guard every destructive or privileged mutation. Permission strings are `resource:action` (defined in `@sb-codex/acl`).

```ts
const deleteClientProcedure =
  requirePermission('clients:delete')(workspaceProcedure)

export const clientsRouter = router({
  delete: deleteClientProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      /* ... */
    }),
})
```

---

## Pagination — required on all list procedures

Every `list`/`search` procedure **must** accept pagination input — unbounded queries are not allowed. Cursor-based is preferred for large datasets:

```ts
const listInput = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(), // last item's id
})
```

Offset variant + the `listOutput` helper → `references/conventions.md`.

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

## Read the right reference

Read only the file that fits the task — don't preload all.

- **Shaping a procedure** — Zod input/output conventions, the `TRPCError` error-code taxonomy, and a full router-file example → `references/conventions.md`.
- **Adding a tenant-scoped table** — RLS SQL template (`ENABLE` + `FORCE` + `USING`/`WITH CHECK`), indexing, and the connection-role rule (**canonical RLS reference**) → `references/rls.md`.
- **Registering a Fastify plugin** — registration order and why it matters → `references/fastify-plugins.md`.
- **Background jobs** — BullMQ queues, typed payloads, workers, idempotency, and the RLS-in-worker rule → `references/jobs.md`.
