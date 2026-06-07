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

The policy uses both `USING (workspace_id = current_setting('app.workspace_id', true))` (filters reads) and `WITH CHECK (...)` (rejects cross-tenant writes), and the table is set to `FORCE ROW LEVEL SECURITY`. So any `SELECT`, `UPDATE`, `DELETE`, or `INSERT` that omits a `WHERE workspace_id = ?` clause is automatically scoped — a missing filter cannot leak or mis-write data across tenants.

### Critical: who connects as which role

Postgres **superusers and table owners bypass RLS** (FORCE only re-enables it for the owner, never for a superuser). This makes the connection role the linchpin of isolation:

| Connection     | Role                              | Why                                                      |
| -------------- | --------------------------------- | -------------------------------------------------------- |
| **Server**     | `app` — non-privileged, non-owner | RLS always applies → tenant isolation is enforced        |
| **Migrations** | superuser (`POSTGRES_USER`)       | must manage every workspace → intentionally bypasses RLS |

The `app` role is created by `infra/compose/init/01_init.sh` (password from `APP_DB_PASSWORD`) and by migration `0002`. **Never point the server at the superuser** — doing so silently disables all tenant isolation. This is covered by the regression test `packages/db/src/__tests__/rls.test.ts` (CI job `rls-isolation`).

### Tenant URL resolution

| Environment | Pattern                 | Resolution                                                                                   |
| ----------- | ----------------------- | -------------------------------------------------------------------------------------------- |
| Production  | `hub.slimbouchoucha.tn` | `x-workspace-slug` header sent by the frontend (stored in `localStorage` after signup/login) |
| Local dev   | `localhost:5173`        | Same: `x-workspace-slug` header                                                              |

> **Note:** The original plan used subdomain-based resolution (`acme.app.com`). The deployed architecture uses path-based routing (`hub.domain.com/api`) with a header instead, because a single VPS with one domain is simpler and avoids wildcard DNS.

---

## Request lifecycle

```
Browser → Traefik → Fastify
  → @fastify/cors
  → @fastify/helmet
  → @fastify/cookie
  → @fastify/rate-limit
  → auth.plugin    (resolves session → request.user via better-auth)
  → tenant.plugin  (resolves workspace from x-workspace-slug header → request.workspace)
  → tRPC handler
      → enforceAuth       (throws UNAUTHORIZED if no user)
      → enforceWorkspace  (throws FORBIDDEN if no workspace;
                           opens transaction, SET LOCAL app.workspace_id)
      → procedure resolver (queries DB — RLS applies automatically)
      → commit transaction
```

### Routing (Traefik v3.1)

Traefik uses a **static file provider** (`infra/traefik/dynamic.prod.yml`) — NOT the Docker label provider. Docker Engine 27+ dropped support for the Docker API version that Traefik's Docker client requires.

```
https://hub.slimbouchoucha.tn/api/*  →  Fastify server :3001  (priority 10)
https://hub.slimbouchoucha.tn/*      →  nginx/admin SPA :80   (priority 1)
```

TLS via Let's Encrypt `tlsChallenge` (TLS-ALPN-01 on port 443).

---

## Auth client facade

`packages/auth/src/client.ts` exports `createSbAuthClient(baseURL)` — a library-agnostic wrapper over better-auth. Apps import from `@sb-codex/auth/client`, never from `better-auth` directly.

```
@sb-codex/auth/client
  └── createSbAuthClient(baseURL)
        ├── signIn(email, password)
        ├── signUp(name, email, password)
        ├── signOut()
        ├── getSession()
        ├── useSession()           ← React hook (better-auth/react)
        ├── createWorkspace(name)
        └── listWorkspaces()
```

To swap the auth library: rewrite only `packages/auth/src/client.ts`. No app code changes needed.

---

## Frontend structure (feature-based)

```
apps/admin/src/
  app/          composition root — router, queryClient, trpc client setup
  shared/       cross-feature code — ui, hooks, lib (e.g. useZodForm)
  features/     one folder per domain feature
    auth/
      api/          authClient.ts (instance of createSbAuthClient)
      hooks/        useSignIn, useSignUp
      components/   LoginForm, SignupForm
  routes/       TanStack file-based routes — thin, only wiring
```

Rules:

- Routes stay thin — business logic lives in `features/<name>/`
- Features don't import each other — shared needs go through `shared/`
- Backend mirrors this — each tRPC router in `packages/api-contracts/src/routers/` is one feature

---

## Theme system

`packages/ui-components/src/theme.css` is the single Tailwind entry point for all apps:

- `@import 'tailwindcss'`
- `@source` auto-scans the package's own components
- `@custom-variant dark` for class-based dark mode
- `@theme` with semantic tokens (`primary-*`, not brand names)

Apps override tokens by re-declaring them after the import:

```css
@import '@sb-codex/ui-components/theme.css';
@theme {
  --color-primary-600: #db2777; /* this app's brand color */
}
```

Runtime override (per-tenant branding):

```ts
document.documentElement.style.setProperty(
  '--color-primary-600',
  workspace.brandColor,
)
```

`<UIProvider>` manages light/dark theme state, persists to `localStorage`, and toggles the `.dark` class on `<html>`.

---

## Scaling path

| Users        | Action                                              |
| ------------ | --------------------------------------------------- |
| 0 – 50 k DAU | Single Postgres primary + PgBouncer                 |
| 50 k – 500 k | Add Postgres read replicas; route reads via Drizzle |
| 500 k – 2 M  | Shard by `workspace_id`; move hot reads to Valkey   |
| 2 M +        | Migrate analytics queries to ClickHouse             |

No application-level rewrites required — `workspace_id` is the natural shard key.

---

## Package map

| Package                   | Purpose                                                     |
| ------------------------- | ----------------------------------------------------------- |
| `@sb-codex/core`          | `cn()` classname utility                                    |
| `@sb-codex/ui-components` | Tailwind + Radix primitives + `UIProvider` + `theme.css`    |
| `@sb-codex/config`        | Zod-validated `createEnv()` loader                          |
| `@sb-codex/db`            | Drizzle **platform** schema (auth + tenant) + migrations    |
| `@sb-codex/auth`          | better-auth server config + auth client facade (`./client`) |
| `@sb-codex/api-contracts` | tRPC router, procedures, shared Zod schemas                 |
| `@sb-codex/jobs`          | BullMQ queue definitions + worker entrypoint                |

Each package is an independent npm plugin (`@sb-codex` scope), **published to npm** (currently `beta`). Shared-instance libs are `peerDependencies`; `@sb-codex/auth` keeps `better-auth` as a regular dependency (facade engine). New projects are scaffolded **apps-only** with `pnpm create @sb-codex/sb-app@latest` — plugins resolved from npm, no `packages/`. See [plugins/README.md](plugins/README.md) and [starting-a-new-project.md](starting-a-new-project.md).

### Plugin reusability boundary

Every `packages/*` plugin must be **reusable in any project** — it is product-agnostic infrastructure with **no business/domain logic or schema** tied to a specific vertical. Business code lives in the consuming `apps/`.

This is why `@sb-codex/db` ships **only platform schemas** (auth tables + `organization`/tenant model). The `client` table is an **example/template** of the tenant-scoped pattern (workspace_id + RLS + CRUD), kept so you can clone it — it is _not_ a shared domain schema. When you build a real product, your domain tables go in the app (full monorepo / scaffold: copy the pattern; apps-only: a project-owned package), never inside the published `@sb-codex/db`.

---

## Adding a new tenant-scoped table

1. Add the table to `packages/db/src/schema/` with `workspace_id TEXT NOT NULL`.
2. Run `pnpm db:generate` then append RLS to the new migration.
3. Add CRUD procedures to `packages/api-contracts/src/routers/` using `workspaceProcedure`.
4. Export the new router from `packages/api-contracts/src/routers/_app.ts`.
5. Run `pnpm db:migrate`.

Because `enforceWorkspace` already calls `SET LOCAL app.workspace_id`, no additional filtering is needed in procedure bodies.
