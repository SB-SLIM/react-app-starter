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
