# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

pnpm workspace + Turborepo with two layers:

- `packages/` — shared libraries built with `tsup`, consumed by apps
  - `@sb-codex/core` — utilities (`cn` classname helper)
  - `@sb-codex/ui-components` — React component library (`Button`, `CardUser`)
  - `@sb-codex/config` — Zod-validated `createEnv()` loader
  - `@sb-codex/db` — Drizzle ORM schema, migrations, RLS, `createDb()`
  - `@sb-codex/auth` — better-auth + organization plugin (`createAuth()`)
  - `@sb-codex/api-contracts` — tRPC router, procedures, shared Zod schemas
  - `@sb-codex/jobs` — BullMQ queue definitions + worker entrypoint
- `apps/` — end-user applications
  - `admin` — React 19 + Vite + Tailwind v4 + TanStack Router/Query
  - `server` — Fastify 5 + tRPC v11 + Pino
  - `web` — Next.js 15 marketing site
  - `e2e` — Playwright test suite

Workspace packages resolve via pnpm `overrides` in the root `package.json`.

## Commands

All commands run from the repo root unless noted.

```bash
pnpm install          # install everything
pnpm dev              # watch-builds all packages + starts all apps
pnpm dev:admin        # admin + its package deps only
pnpm dev:server       # server + its package deps only
pnpm dev:app          # admin + server together
pnpm build            # build all packages + apps (respects dep order)
pnpm clean            # remove all dist/ outputs
pnpm lint             # ESLint across the workspace
pnpm test             # Vitest across all packages
pnpm typecheck        # tsc --noEmit across all packages
pnpm db:migrate       # apply Drizzle migrations (requires DATABASE_URL)
pnpm db:generate      # generate migration SQL from schema changes
pnpm db:studio        # open Drizzle Studio
```

## Build Pipeline (Turborepo)

`turbo.json` defines the task graph:

- **`build`** — `dependsOn: ["^build"]`: packages build before apps. Outputs cached under `dist/**`.
- **`dev`** — persistent, no cache. All `dev` tasks run in parallel.
- **`test`** — `dependsOn: ["^build"]`: packages must be built before tests run.
- **`lint`** / **`typecheck`** — `dependsOn: ["^build"]`.
- **`clean`** — no cache, removes `dist/`.

A clean rebuild: `pnpm clean && pnpm build`.

## Package Tooling

- **Packages** use a shared tsup config from `scripts/getTsupConfig.js`. Outputs CJS + ESM, generates `.d.ts`, minifies.
- **Apps** use Vite (`admin`) or Next.js (`web`) or plain `tsc` + `tsx` (`server`).
- `tsconfig.base.json` is the shared strict TypeScript base. Each package extends it.

## Key architectural rules

- **Multi-tenant**: every business table has `workspace_id TEXT NOT NULL`. Never omit it.
- **RLS enforces isolation**: the `enforceWorkspace` tRPC middleware calls `SET LOCAL app.workspace_id = '<id>'` inside a transaction. RLS policies do the rest — no manual `WHERE workspace_id = ?` needed in procedure bodies.
- **Context shape** (`packages/api-contracts/src/context.ts`): `{ requestId, user, workspace, db }`. `db` is a Drizzle instance; inside `enforceWorkspace` it becomes a transaction.
- **Auth routes** skip the tenant plugin (`/api/auth/*` prefix check in `tenant.plugin.ts`).
- **Admin app** only imports `AppRouter` as `import type` — never bundles server code.

## Adding a new tenant-scoped table

1. Add schema to `packages/db/src/schema/`.
2. Run `pnpm db:generate` then append RLS to the new migration.
3. Add CRUD procedures to `packages/api-contracts/src/routers/` using `workspaceProcedure`.
4. Export the new router from `packages/api-contracts/src/routers/_app.ts`.
5. Run `pnpm db:migrate`.

## Adding a New Package

1. Create `packages/<name>/` with `package.json` (name `@sb-codex/<name>`, scripts `build`/`dev`/`clean`), `tsconfig.json` (extends `../../tsconfig.base.json`), `tsup.config.ts`.
2. Add the name to pnpm `overrides` in root `package.json` with `"workspace:^"`.
3. Consumers declare it as a `workspace:^` dependency and import normally.

---

## Production Deployment

### Domain & Subdomains

| Env  | Admin                               | API                                     |
| ---- | ----------------------------------- | --------------------------------------- |
| Prod | `https://hub.slimbouchoucha.tn`     | `https://hub.slimbouchoucha.tn/api`     |
| Dev  | `https://hub-dev.slimbouchoucha.tn` | `https://hub-dev.slimbouchoucha.tn/api` |
| QA   | `https://hub-qa.slimbouchoucha.tn`  | `https://hub-qa.slimbouchoucha.tn/api`  |

**VPS IP:** 152.53.187.54

### Routing Architecture (Traefik v3.1)

Traefik uses a **static file provider** (`infra/traefik/dynamic.prod.yml`) — NOT the Docker label provider. This is because the VPS runs Docker Engine 27+ which dropped support for Docker API < 1.40, and Traefik's Docker client requests API 1.24.

- `PathPrefix(/api)` → Fastify server (priority 10)
- `Host(hub.*)` catch-all → nginx/admin SPA (priority 1)
- HTTPS redirect at entrypoint level (port 80 → 443)
- TLS certificates via Let's Encrypt `tlsChallenge` (port 443, stored in `infra/traefik/acme.json`)

### Fastify Routes

All routes are prefixed with `/api`:

- `GET /api/health` — health check (public)
- `GET /api/ready` — readiness check with DB ping (public)
- `GET /api/auth/*` — better-auth endpoints
- `/api/trpc/*` — tRPC endpoint

### Key Files

| File                                    | Purpose                                              |
| --------------------------------------- | ---------------------------------------------------- |
| `infra/compose/docker-compose.prod.yml` | Production stack                                     |
| `infra/compose/docker-compose.test.yml` | Test stack (VPS, no TLS)                             |
| `infra/traefik/traefik.prod.yml`        | Traefik static config (tlsChallenge, entrypoints)    |
| `infra/traefik/dynamic.prod.yml`        | Traefik routes (hardcoded domain, file provider)     |
| `infra/traefik/acme.json`               | Let's Encrypt certs (600 permissions, never commit)  |
| `apps/server/src/migrate.ts`            | Standalone migration script → `node dist/migrate.js` |
| `.env.production`                       | Prod secrets on VPS (never committed)                |

### Deploy Commands (on VPS)

```bash
# Full deploy after git pull
git pull
docker compose -f infra/compose/docker-compose.prod.yml --env-file .env.production up -d --build

# Run migrations only (before deploying server)
docker compose -f infra/compose/docker-compose.prod.yml --env-file .env.production --profile migrate run --rm migrate

# Rebuild single service
docker compose -f infra/compose/docker-compose.prod.yml --env-file .env.production up -d --build server
docker compose -f infra/compose/docker-compose.prod.yml --env-file .env.production up -d --build admin
```

### .env.production required variables

```
DOMAIN=slimbouchoucha.tn
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<secret>
POSTGRES_DB=saas
VALKEY_PASSWORD=<secret>
BETTER_AUTH_SECRET=<32+ chars>
BETTER_AUTH_URL=https://hub.slimbouchoucha.tn
CORS_ORIGIN=https://hub.slimbouchoucha.tn
DATABASE_URL=postgresql://postgres:<password>@postgres:5432/saas
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
MINIO_ROOT_USER, MINIO_ROOT_PASSWORD
MEILI_MASTER_KEY
```

### tRPC Client (admin app)

`VITE_TRPC_URL` is baked at build time via Docker build arg:

- Prod: `https://hub.slimbouchoucha.tn/api/trpc`
- Test: `http://<VPS_IP>:3001/api/trpc`

The workspace slug is sent via `x-workspace-slug` header (to be implemented — currently uses subdomain extraction from `window.location.hostname`).
