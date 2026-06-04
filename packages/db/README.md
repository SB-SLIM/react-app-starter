# @sb-codex/db

Drizzle ORM schema, migrations, and multi-tenant Row-Level Security for the sb-codex SaaS starter. Every business table carries a `workspace_id` and is isolated via Postgres RLS.

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
