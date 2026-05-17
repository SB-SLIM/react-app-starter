# Roadmap

Living plan for evolving this repo into a production-grade multi-tenant SaaS starter.

---

## Goal

Build an **open-source, multi-tenant SaaS starter** that can be forked to ship vertical SaaS products (travel agency, e-commerce, car marketplace, …).

- Every tenant ("workspace") has **collaborators** (internal team, role-based) and **clients** (the workspace's end-customers).
- Launch capacity: ~100 users. Architecture must scale to **1M–2M users** without rewrites — only adding replicas / shards / read pools.
- **~90% open source.** Paid infra (VPS, CDN) and a handful of hosted services are acceptable. No proprietary lock-in inside application code.
- **Stateless application tier** behind a load balancer.
- **Multi-tenant from day one** — every domain model is tenant-scoped.

Full architecture, stack-by-layer rationale, and verification steps live in `~/.claude/plans/jazzy-jingling-snowflake.md`.

---

## Locked architecture decisions

| Layer | Choice |
|---|---|
| Tenant isolation | Shared Postgres + **Row-Level Security** (`SET LOCAL app.workspace_id`) |
| Tenant URL | Subdomain (`acme.app.com`), path fallback (`/t/acme`) for local dev |
| Auth + organizations | **better-auth** (MIT) + organization plugin |
| Server | **Fastify 5** + **tRPC v11** + Pino |
| SQL | **Postgres 16** + **Drizzle ORM** |
| Connection pool | PgBouncer (transaction mode) |
| Cache / queue / sessions | **Valkey** (BSD-3, OSS Redis 7.2 fork) |
| Queue runner | BullMQ on Valkey |
| NoSQL (documents) | Postgres JSONB now → FerretDB later if a real document workload emerges |
| Search | Meilisearch |
| Object storage | MinIO (S3-compatible) |
| Email | Nodemailer + SMTP (MailHog in dev) |
| Email templates | react-email |
| Reverse proxy / TLS | Traefik (wildcard `*.localhost` for dev) |
| Containers | Docker multi-stage + docker-compose; k3s/K8s later |
| Frontend routing | TanStack Router (file-based) |
| Frontend server-state | TanStack Query |
| Styling | Tailwind CSS v4 |
| Component primitives | Radix UI + shadcn-style copy-in |
| Forms | React Hook Form + Zod (via `useZodForm` wrapper) |
| Unit tests | Vitest + Testing Library |
| E2E tests | Playwright |
| CI/CD | GitHub Actions + Turborepo Remote Cache |
| Pre-commit | Husky + lint-staged |

---

## Phase status

| # | Phase | Status |
|---|---|---|
| 1 | Frontend foundations (Tailwind v4, TanStack Router/Query, RHF+Zod, feature folder layout) | ✅ Done |
| 2 | Backend skeleton (Fastify + tRPC v11 + Pino + Zod env, admin↔server health pipeline verified) | ✅ Done |
| 3 | Multi-tenant core (Drizzle, RLS, better-auth org plugin, Fastify auth/tenant plugins, reference `clients` CRUD) | ⏳ Next |
| 4 | Infra (Dockerfiles, docker-compose: Postgres + PgBouncer + Valkey + MinIO + Meilisearch + Traefik + MailHog) | ⏳ Next (do with 3) |
| 5 | Testing (Vitest workspace + Playwright `apps/e2e` with tenant-isolation suite) | ⏳ |
| 6 | CI/CD (GitHub Actions: `ci.yml`, `e2e.yml`, `build-images.yml`, `release.yml` + GHCR) | ⏳ |
| 7 | Pre-commit (Husky + lint-staged + commitlint), README, ARCHITECTURE.md | ⏳ |

> **Why 3 and 4 ship together**: Phase 3 code (RLS policies, better-auth, tenant plugin) cannot be verified end-to-end without the Phase 4 services (Postgres + Valkey). Writing Phase 3 first then validating in Phase 4 wastes one round-trip — better to land both and verify together.

---

## What's in place today

### Monorepo (pnpm workspaces + Turborepo)

```
apps/
  admin/        Vite + React 19 + Tailwind v4 + TanStack Router/Query + tRPC client
  web/          Next 15 (marketing site; rename → apps/marketing in Phase 4)
  server/       Fastify 5 + tRPC v11 + Pino  ← :3001
packages/
  core/         cn() utility
  ui-components/  Tailwind+cn-based Button, CardUser
  api-contracts/  tRPC v11 init + appRouter (health) + Context type
  config/       Zod-validated env loader (createEnv)
scripts/        getTsupConfig.js (shared tsup base for packages)
```

### Verified pipelines

- `pnpm dev:admin` → Vite on :5173, file-based routes, HMR, devtools (Router + Query).
- `pnpm dev:server` → Fastify on :3001, `/health`, `/ready`, `/trpc/*` mounted.
- `pnpm dev:app` → both at once via Turbo.
- Admin's `/dashboard` page polls `trpc.health.ping` every 5s → green/red status card proves end-to-end roundtrip.

### Run commands

```bash
pnpm install              # install everything
pnpm build                # build all packages + apps (respects deps via Turbo)
pnpm dev:admin            # admin only
pnpm dev:server           # server only
pnpm dev:app              # admin + server
pnpm dev                  # everything (admin + server + web + packages in watch)
pnpm lint                 # ESLint across the workspace
```

---

## Phase 3 + 4 plan (next session)

### Phase 3 deliverables

1. **`packages/db`** — Drizzle schema for `users`, `workspaces`, `workspace_members` (role enum: owner/admin/member), `invitations`, `clients`. Every business table has `workspace_id UUID NOT NULL`.
2. **RLS migration** — `ENABLE ROW LEVEL SECURITY` on every tenant-scoped table + policy:
   ```sql
   CREATE POLICY tenant_isolation ON <table>
     USING (workspace_id = current_setting('app.workspace_id')::uuid);
   ```
3. **`packages/auth`** — better-auth config with the **organization plugin** (orgs = workspaces). Email/password + magic link + Google OAuth. Sessions stored in Valkey.
4. **`apps/server/src/plugins/auth.plugin.ts`** — verifies session, attaches `request.user`.
5. **`apps/server/src/plugins/tenant.plugin.ts`** — resolves workspace from subdomain (or `x-workspace-slug` header in dev), checks membership, opens a transaction with `SET LOCAL app.workspace_id = '<uuid>'`.
6. **tRPC middleware** — `enforceAuth`, `enforceWorkspaceRole(['owner','admin'])`.
7. **Reference `clients` CRUD** — minimal vertical-agnostic example demonstrating end-to-end tenant scoping.

### Phase 4 deliverables

1. **Multi-stage Dockerfiles** per app using `pnpm fetch` + `turbo prune --docker`.
2. **`infra/compose/docker-compose.yml`** services: `traefik`, `postgres`, `pgbouncer`, `valkey`, `meilisearch`, `minio`, `mailhog`, `admin`, `marketing`, `server`, `worker`.
3. **Traefik config** — wildcard `*.localhost` → `acme.localhost`, `globex.localhost`, etc., with local TLS.
4. **`packages/jobs`** — BullMQ queues (email, search-indexing, webhooks) + worker entrypoint.
5. **Postgres init script** — creates `app` role with RLS-compatible grants.

### Joint checkpoint

```bash
docker compose up -d
pnpm db:migrate && pnpm db:seed
pnpm dev
# https://acme.localhost  → sign up → MailHog → confirm → dashboard
# https://globex.localhost with acme's cookie → blocked (RLS)
```

---

## How to resume

Open a fresh Claude Code session and say:

> Resume the SaaS starter roadmap. Phases 1+2 are done. Do Phase 3 + 4 together — see `ROADMAP.md` and the detailed plan at `~/.claude/plans/jazzy-jingling-snowflake.md`.

---

## Scope guard

This roadmap does **not** include:

- Building a specific vertical (travel, e-commerce, cars) — those are forks.
- Cloud deployment manifests (k8s, Terraform). Phase 4 lands a production-ready compose stack; cloud deploy is a separate effort.
- Billing — wire better-auth's Stripe plugin when the first paying customer is close.
- Mobile clients — tRPC router types are reusable for React Native later if needed.
