# Tenant-scoped table — RLS template (canonical)

Read this when adding a tenant-scoped table or writing/editing a migration. This is the
**canonical** Row-Level Security reference for the repo; other skills link here.

## Why RLS, not manual `WHERE`

Every tenant-scoped table carries `workspace_id`. `workspaceProcedure` opens a transaction
and runs `SET LOCAL app.workspace_id = '<id>'`; the RLS policy then scopes every
`SELECT/INSERT/UPDATE/DELETE` automatically — procedure bodies never add `WHERE workspace_id`.

## Connection role is the linchpin

Postgres **superusers and table owners bypass RLS**. So:

- The **server** connects as the non-privileged `app` role → RLS always applies.
- **Migrations** connect as the superuser (`POSTGRES_USER`) → intentionally bypass RLS.

Never point the server at the superuser — it silently disables all isolation. Full detail:
`docs/architecture.md` → "Critical: who connects as which role". Regression test:
`packages/db/src/__tests__/rls.test.ts` (CI job `rls-isolation`).

## SQL template

After `pnpm db:generate`, **manually append** this to the generated migration before
`pnpm db:migrate` (drizzle-kit does not emit RLS):

```sql
ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;
ALTER TABLE <name> FORCE ROW LEVEL SECURITY;

CREATE POLICY ws_isolation ON <name>
  USING      (workspace_id = current_setting('app.workspace_id', true))
  WITH CHECK (workspace_id = current_setting('app.workspace_id', true));
```

- `USING` filters reads + the rows `UPDATE`/`DELETE` can touch.
- `WITH CHECK` rejects cross-tenant `INSERT`/`UPDATE` (a row whose `workspace_id` ≠ the active one).
- `FORCE` re-enables RLS even for the table owner (defense-in-depth).
- The `, true` second arg = `missing_ok` → unset GUC returns `NULL`, so a query with no
  workspace set matches **zero** rows (fail-closed) instead of erroring.

## Indexing

Add a composite index when the table will be queried by `workspace_id` + another column:

```sql
CREATE INDEX ON <name> (workspace_id, <other_column>);
```

## Guardrail

Mirror the pattern in `packages/db/src/__tests__/rls.test.ts`: connect as `app`, set
workspace A, then assert workspace B can neither read nor write A's rows. See the
`testing-patterns` skill for the full test shape.
