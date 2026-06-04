# SaaS Starter

An open-source, multi-tenant SaaS starter built for forking. Ships with auth, workspaces, RLS-enforced tenant isolation, a typed API, a CI/CD pipeline, and a full production deploy — ready to fork for travel, e-commerce, or any vertical.

**Live demo:** <https://hub.slimbouchoucha.tn>

## Quick start

```bash
# 1. Clone and install
git clone https://github.com/SB-SLIM/react-app-starter && cd react-app-starter
pnpm install

# 2. Configure environment
cp .env.example .env
# Edit .env — DATABASE_URL and BETTER_AUTH_SECRET are required

# 3. Start dev infrastructure (Postgres, Valkey, MailHog)
docker compose -f infra/compose/docker-compose.yml up -d postgres valkey mailhog

# 4. Run migrations
pnpm db:migrate

# 5. Start all apps in watch mode
pnpm dev
```

- Admin UI → <http://localhost:5173>
- API → <http://localhost:3001>
- MailHog → <http://localhost:8025>

## Monorepo structure

```text
apps/
  admin/      Vite + React 19 + Tailwind v4 + TanStack Router/Query — workspace dashboard
  server/     Fastify 5 + tRPC v11 + Pino — stateless API
  web/        Next.js 15 — marketing / public site
  e2e/        Playwright test suite
packages/
  core/             cn() utility
  ui-components/    Tailwind + Radix primitives + UIProvider + theme.css
  config/           Zod env loader (createEnv)
  db/               Drizzle schema, migrations, RLS
  auth/             better-auth server config + client facade (@sb-codex/auth/client)
  api-contracts/    tRPC router + Zod schemas (shared client/server)
  jobs/             BullMQ queues + worker entrypoint
infra/
  docker/     Multi-stage Dockerfiles (arm64 + amd64)
  compose/    docker-compose files (dev + prod)
  traefik/    Reverse proxy config (file provider)
docs/
  architecture.md   Tenant model, request lifecycle, theme system, scaling path
  roadmap.md        Phase status, what's shipped, what's next
```

## Commands

```bash
pnpm install          # install everything
pnpm dev              # start all apps + package watchers
pnpm dev:app          # admin + server only
pnpm build            # build all packages + apps
pnpm test             # run Vitest across all packages
pnpm lint             # ESLint across the workspace
pnpm typecheck        # tsc --noEmit across all packages
pnpm db:migrate       # apply Drizzle migrations
pnpm db:generate      # generate migration SQL from schema changes
pnpm db:studio        # open Drizzle Studio
```

## Stack

| Layer         | Choice                                                                       |
| ------------- | ---------------------------------------------------------------------------- |
| Auth          | better-auth + organization plugin (client facade in `@sb-codex/auth/client`) |
| API           | Fastify 5 + tRPC v11                                                         |
| ORM           | Drizzle + Postgres 16 RLS                                                    |
| Cache / Queue | Valkey (Redis OSS fork) + BullMQ                                             |
| Frontend      | React 19 + TanStack Router/Query + Tailwind v4                               |
| Theme         | Semantic `primary-*` tokens, overridable per app and per tenant at runtime   |
| Infra         | Docker + Traefik + PgBouncer + MinIO + Meilisearch                           |
| Tests         | Vitest + Playwright                                                          |
| CI/CD         | GitHub Actions + GHCR (native arm64 runner)                                  |

## Environment variables

Required in `.env` (local) or `.env.production` (VPS):

| Variable             | Description                                    |
| -------------------- | ---------------------------------------------- |
| `DATABASE_URL`       | Postgres connection string                     |
| `BETTER_AUTH_SECRET` | 32+ char secret for session signing            |
| `BETTER_AUTH_URL`    | Server base URL (e.g. `http://localhost:3001`) |
| `REDIS_URL`          | Valkey/Redis connection string                 |
| `CORS_ORIGIN`        | Admin app URL (e.g. `http://localhost:5173`)   |

Required as **GitHub Actions Variables** (for CI builds of the admin SPA):

| Variable               | Value                              |
| ---------------------- | ---------------------------------- |
| `VITE_TRPC_URL`        | `https://your-domain.com/api/trpc` |
| `VITE_BETTER_AUTH_URL` | `https://your-domain.com`          |

See [docs/architecture.md](docs/architecture.md) for tenant isolation details and the scaling path to 1–2 M users.
See [docs/roadmap.md](docs/roadmap.md) for the phase-by-phase implementation plan.
