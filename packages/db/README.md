# @sb-codex/db

Drizzle ORM **platform** schema, migrations, and multi-tenant Row-Level Security for the sb-codex SaaS starter. Ships only the schemas every SaaS needs (auth + tenant). Every tenant-scoped table carries a `workspace_id` and is isolated via Postgres RLS.

## Installation

```bash
pnpm add @sb-codex/db
# peer dependency
pnpm add drizzle-orm
```

## Usage

```ts
import { createDb, schema } from '@sb-codex/db'

const db = createDb(process.env.DATABASE_URL!)

await db.select().from(schema.client)
```

## API

| Export          | Description                                         |
| --------------- | --------------------------------------------------- |
| `createDb(url)` | Create a Drizzle Postgres client.                   |
| `Database`      | Type of the Drizzle instance.                       |
| `schema`        | Namespace with every table (also re-exported flat). |

## Scripts

```bash
pnpm db:generate   # generate migration SQL from schema changes
pnpm db:migrate    # apply migrations (needs DATABASE_URL)
pnpm db:studio     # open Drizzle Studio
```

## Platform vs business schema

This package is a **reusable plugin** — it contains only **platform schemas** shared by every SaaS:

- **Auth + tenant** — `user`, `session`, `account`, `verification`, `organization` (workspace), `member`, `invitation`.

It deliberately does **not** contain product-specific (business/domain) tables. The `client` table shipped here is an **example/template** of the tenant-scoped pattern (`workspace_id` + RLS + CRUD) — clone it, don't treat it as shared.

When you build a real product, your domain tables go:

- **Full monorepo / `create-sb-app` scaffold** (package is `workspace:^`, editable): copy the `client` pattern into `src/schema/` and follow [_Adding a new tenant-scoped table_](../../CLAUDE.md).
- **apps-only project** (`@sb-codex/db` pulled from npm, immutable): define them in the consuming app or a project-owned `@your-scope/db` package — never fork this published plugin.

## Multi-tenant RLS

Each tenant-scoped table has `workspace_id TEXT NOT NULL` with a policy:

```sql
CREATE POLICY tenant_isolation ON my_table
  USING (workspace_id = current_setting('app.workspace_id', true));
```

The consuming server sets `app.workspace_id` per request inside a transaction, so queries are scoped automatically. See [docs/architecture.md](../../docs/architecture.md).

## Peer dependencies

- `drizzle-orm` `^0.44`

---

Part of the [sb-codex SaaS starter](https://github.com/SB-SLIM/react-app-starter). See [docs/plugins](../../docs/plugins/README.md).
