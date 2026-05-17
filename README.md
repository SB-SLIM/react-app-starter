# SaaS Starter

An open-source, multi-tenant SaaS starter built for forking. Ships with auth, workspaces, RLS-enforced tenant isolation, a typed API, and a full local dev stack — ready to fork for travel, e-commerce, or any vertical.

## Quick start

```bash
# 1. Clone and install
git clone <repo-url> && cd react-app-starter
pnpm install

# 2. Configure environment
cp .env.example .env

# 3. Start the dev infrastructure (Postgres, Valkey, MailHog, …)
docker compose -f infra/compose/docker-compose.yml up -d postgres valkey mailhog

# 4. Run migrations
pnpm db:migrate

# 5. Start all apps in watch mode
pnpm dev
```

Admin UI → <http://localhost:5173>  
API → <http://localhost:3001>  
MailHog → <http://localhost:8025>

## Monorepo structure

```
apps/
  admin/      Vite + React 19 + Tailwind v4 + TanStack Router/Query — workspace dashboard
  server/     Fastify 5 + tRPC v11 + Pino — stateless API
  web/        Next.js 15 — marketing / public site
  e2e/        Playwright test suite
packages/
  core/             cn() utility
  ui-components/    Tailwind + Radix primitives
  config/           Zod env loader (createEnv)
  db/               Drizzle schema, migrations, RLS
  auth/             better-auth + organization plugin
  api-contracts/    tRPC router + Zod schemas (shared client/server)
  jobs/             BullMQ queues + worker entrypoint
infra/
  docker/     Multi-stage Dockerfiles
  compose/    docker-compose.yml + Postgres init
  traefik/    Reverse proxy config for wildcard *.localhost
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

| Layer         | Choice                                             |
| ------------- | -------------------------------------------------- |
| Auth          | better-auth + organization plugin                  |
| API           | Fastify 5 + tRPC v11                               |
| ORM           | Drizzle + Postgres 16 RLS                          |
| Cache / Queue | Valkey (Redis OSS fork) + BullMQ                   |
| Frontend      | React 19 + TanStack Router/Query + Tailwind v4     |
| Infra         | Docker + Traefik + PgBouncer + MinIO + Meilisearch |
| Tests         | Vitest + Playwright                                |
| CI/CD         | GitHub Actions + GHCR                              |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for tenant isolation details and the scaling path to 1–2 M users.  
See [ROADMAP.md](./ROADMAP.md) for the phase-by-phase implementation plan.
