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

---

## Locked architecture decisions

| Layer                    | Choice                                                                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Tenant isolation         | Shared Postgres + **Row-Level Security** (`SET LOCAL app.workspace_id`); server connects as non-privileged `app` role (see ADR-001) |
| Tenant URL               | `x-workspace-slug` header (stored in `localStorage` after signup/login)                                                             |
| Auth + organizations     | **better-auth** (MIT) + organization plugin                                                                                         |
| Auth client              | Library-agnostic facade in `@sb-codex/auth/client`                                                                                  |
| Server                   | **Fastify 5** + **tRPC v11** + Pino                                                                                                 |
| SQL                      | **Postgres 16** + **Drizzle ORM**                                                                                                   |
| Connection pool          | PgBouncer (transaction mode)                                                                                                        |
| Cache / queue / sessions | **Valkey** (BSD-3, OSS Redis 7.2 fork)                                                                                              |
| Queue runner             | BullMQ on Valkey                                                                                                                    |
| Search                   | Meilisearch                                                                                                                         |
| Object storage           | MinIO (S3-compatible)                                                                                                               |
| Email                    | Nodemailer + SMTP (MailHog in dev)                                                                                                  |
| Reverse proxy / TLS      | Traefik v3.1 — **file provider** (Docker API incompatibility)                                                                       |
| Containers               | Docker multi-stage + docker-compose                                                                                                 |
| CI/CD                    | GitHub Actions + GHCR — native arm64 runner                                                                                         |
| Frontend routing         | TanStack Router (file-based)                                                                                                        |
| Frontend server-state    | TanStack Query                                                                                                                      |
| Styling                  | Tailwind CSS v4 — semantic tokens, overridable per app/tenant                                                                       |
| Component primitives     | Radix UI + shadcn-style copy-in                                                                                                     |
| Forms                    | React Hook Form + Zod (via `useZodForm` wrapper)                                                                                    |
| Unit tests               | Vitest + Testing Library                                                                                                            |
| E2E tests                | Playwright                                                                                                                          |
| Pre-commit               | Husky + lint-staged + commitlint                                                                                                    |

---

## Phase status

| #   | Phase                                                                                                 | Status  |
| --- | ----------------------------------------------------------------------------------------------------- | ------- |
| 1   | Frontend foundations (Tailwind v4, TanStack Router/Query, RHF+Zod, feature folder layout)             | ✅ Done |
| 2   | Backend skeleton (Fastify + tRPC v11 + Pino + Zod env, admin↔server health pipeline)                 | ✅ Done |
| 3   | Multi-tenant core (Drizzle, RLS, better-auth org plugin, Fastify auth/tenant plugins, `clients` CRUD) | ✅ Done |
| 4   | Infra (Dockerfiles, docker-compose, Traefik, Postgres, Valkey, MinIO, Meilisearch)                    | ✅ Done |
| 5   | Auth UI (login/signup pages, workspace auto-creation, feature-based frontend structure)               | ✅ Done |
| 6   | Theme system (UIProvider, `theme.css`, semantic `primary-*` tokens, dark mode, runtime override)      | ✅ Done |
| 7   | CI/CD (GitHub Actions: `ci.yml`, `build-images.yml`, `deploy.yml`, GHCR, native arm64 runner)         | ✅ Done |
| 8   | Production deploy (hub.slimbouchoucha.tn, Let's Encrypt TLS, Traefik file provider)                   | ✅ Done |
| 9   | Publishable plugins: `@sb-codex/*` on npm (beta) + `@sb-codex/create-sb-app` scaffolder (apps-only)   | ✅ Done |
| 10  | Testing (Vitest workspace + Playwright `apps/e2e` with tenant-isolation suite)                        | ⏳      |
| 11  | Client management UI (list/create/edit/delete — API exists, frontend missing)                         | ⏳      |
| 12  | Member management (invite flow, role management)                                                      | ⏳      |
| 13  | Billing (Stripe via better-auth plugin)                                                               | ⏳      |

---

## What's shipped

### Auth flow

- Signup → auto-create workspace → store slug in `localStorage` → dashboard
- Login → fetch existing workspaces → restore slug → dashboard
- Auth guard on `/dashboard` — redirects to `/sign-in` if no session
- Nav shows email + logout when authenticated

### Multi-tenant isolation

- Every `workspaceProcedure` call opens a transaction with `SET LOCAL app.workspace_id`
- RLS policies (`USING` + `WITH CHECK`, `FORCE ROW LEVEL SECURITY`) enforce isolation at the DB level — no manual `WHERE workspace_id = ?` needed
- The **server** connects as the non-privileged `app` role (RLS applies); **migrations** connect as the superuser (bypass, intended). Pointing the server at the superuser silently disables isolation.
- `x-workspace-slug` header resolved by tenant plugin → workspace looked up + membership verified
- Regression test `packages/db/src/__tests__/rls.test.ts` (CI job `rls-isolation`) proves a tenant cannot read/write another's rows

> **ADR-001 (2026-06-06):** isolation stays **shared Postgres + RLS** (not schema-per-tenant — that caps tenant count and complicates migrations). Per-tenant backup/export/delete is a separate lifecycle concern, to be solved on top of RLS. Mirrored on Notion.

### Publishable plugins

- The 7 `@sb-codex/*` packages are published to npm under the `beta` dist-tag (`0.0.1-beta.x`).
- `@sb-codex/create-sb-app` (tag `latest`) scaffolds a new project: `pnpm create @sb-codex/sb-app@latest <name>`.
- The scaffold is **apps-only** — `apps/` only, `@sb-codex/*` pulled from npm at the published version with peer deps injected; `packages/`, `.claude/`, `CLAUDE.md`, `docs/` and changeset config are stripped.
- `@sb-codex/auth` bundles `better-auth` as a regular dependency (facade engine), not a peer.

### CI/CD pipeline

```text
push → main
  └── CI (lint/typecheck/test — Node 20+22)
        └── if success → Build & Push Images (native arm64 runner → GHCR)
                  └── if success → Deploy to VPS
                        ├── git pull
                        ├── docker compose pull   ← images from GHCR (no downtime)
                        ├── docker compose up -d  ← 2-5s downtime per service
                        └── migrate
```

- Build concurrency: `cancel-in-progress: true` — new push cancels old build
- Deploy concurrency: `cancel-in-progress: false` — deploys queue, never interrupted mid-flight
- Gate job: Build workflow fails (not skips) when CI didn't pass, preventing Deploy trigger

### Production stack (hub.slimbouchoucha.tn)

- Traefik v3.1 with file provider + Let's Encrypt `tlsChallenge`
- `PathPrefix(/api)` → Fastify, catch-all → nginx/admin SPA
- All services on internal Docker network — only Traefik exposes ports 80/443

---

## Scope guard

This roadmap does **not** include:

- Building a specific vertical (travel, e-commerce, cars) — those are forks
- Cloud deployment manifests (k8s, Terraform) — VPS compose stack is the baseline
- Mobile clients — tRPC router types are reusable for React Native later
