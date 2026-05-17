# Architecture

## Tenant model

Every tenant is an **organization** (from better-auth's organization plugin). The terms "workspace" and "organization" are used interchangeably in the code.

```
Organization (workspace)
  ├── Members  — internal collaborators (owner / admin / member)
  └── Clients  — the workspace's end-customers
```

### Isolation strategy: shared Postgres + Row-Level Security

All business data lives in one Postgres database. Every tenant-scoped table has a `workspace_id TEXT NOT NULL` column. Postgres RLS enforces that every query only sees rows belonging to the active workspace.

The tenant plugin (`apps/server/src/plugins/tenant.plugin.ts`) resolves the workspace from the request and the `enforceWorkspace` tRPC middleware wraps each procedure in a transaction that calls:

```sql
SELECT set_config('app.workspace_id', '<uuid>', true);
```

Because the policy is `USING (workspace_id = current_setting('app.workspace_id', true))`, any `SELECT`, `UPDATE`, or `DELETE` that omits a `WHERE workspace_id = ?` clause is automatically scoped — a missing filter cannot leak data across tenants.

Superusers and the table owner (used during `db:migrate`) bypass RLS by default, so migrations work without setting the config variable.

### Tenant URL resolution

| Environment           | Pattern          | Resolution                              |
| --------------------- | ---------------- | --------------------------------------- |
| Production            | `acme.app.com`   | Subdomain extracted from `Host` header  |
| Local dev             | `acme.localhost` | Subdomain extracted from `Host` header  |
| Dev (no wildcard DNS) | Any host         | `x-workspace-slug: acme` request header |

---

## Request lifecycle

```
Browser → Traefik → Fastify
  → @fastify/cors
  → @fastify/helmet
  → @fastify/cookie
  → @fastify/rate-limit
  → auth.plugin  (resolves session → request.user)
  → tenant.plugin (resolves workspace → request.workspace)
  → tRPC handler
      → enforceAuth  (throws UNAUTHORIZED if no user)
      → enforceWorkspace (throws FORBIDDEN if no workspace;
                          opens transaction, SET LOCAL app.workspace_id)
      → procedure resolver (queries DB — RLS applies automatically)
      → commit transaction
```

---

## Scaling path

| Users        | Action                                              |
| ------------ | --------------------------------------------------- |
| 0 – 50 k DAU | Single Postgres primary + PgBouncer                 |
| 50 k – 500 k | Add Postgres read replicas; route reads via Drizzle |
| 500 k – 2 M  | Shard by `workspace_id`; move hot reads to Valkey   |
| 2 M +        | Migrate analytics queries to ClickHouse             |

No application-level rewrites required — the `workspace_id` column is the natural shard key.

---

## Package map

| Package                   | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `@sb-codex/core`          | `cn()` classname utility                     |
| `@sb-codex/ui-components` | Tailwind + Radix component primitives        |
| `@sb-codex/config`        | Zod-validated `createEnv()` loader           |
| `@sb-codex/db`            | Drizzle schema, migrations, `createDb()`     |
| `@sb-codex/auth`          | better-auth config + organization plugin     |
| `@sb-codex/api-contracts` | tRPC router, procedures, shared Zod schemas  |
| `@sb-codex/jobs`          | BullMQ queue definitions + worker entrypoint |

---

## Adding a new tenant-scoped table

1. Add the table to `packages/db/src/schema/` with `workspace_id TEXT NOT NULL`.
2. Run `pnpm db:generate` to generate the migration SQL.
3. Append RLS to `packages/db/migrations/<N>_rls.sql`:
   ```sql
   ALTER TABLE "my_table" ENABLE ROW LEVEL SECURITY;
   CREATE POLICY tenant_isolation ON "my_table"
     USING (workspace_id = current_setting('app.workspace_id', true));
   ```
4. Add CRUD procedures to `packages/api-contracts/src/routers/` using `workspaceProcedure`.
5. Run `pnpm db:migrate`.

Because `enforceWorkspace` middleware already calls `SET LOCAL app.workspace_id`, no additional filtering is needed in the procedure body.
