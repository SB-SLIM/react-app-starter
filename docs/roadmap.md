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
- **Batteries-included plugins** — `@sb-codex/*` cover the full platform layer so a new product starts with auth, UI, typed API, background jobs, and infra already wired up.

### Plugin boundary (applies to every `packages/*`)

Every plugin is **product-agnostic** — reusable in any project, with no business logic or domain schema.

| Plugin                    | Ships                                                                                                         | Does NOT ship                                           |
| ------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `@sb-codex/core`          | Pure utils (format, slugify, type guards, …)                                                                  | Product-specific helpers                                |
| `@sb-codex/ui-components` | Design system — primitives, layouts, patterns                                                                 | Brand colors, product copy                              |
| `@sb-codex/config`        | `createEnv()` Zod loader                                                                                      | App-specific env vars                                   |
| `@sb-codex/db`            | Platform schema (auth + tenant) + RLS + `createDb()`                                                          | Business/domain tables (`client` = example template)    |
| `@sb-codex/auth`          | Auth server config + client facade (email + Google)                                                           | Custom auth flows                                       |
| `@sb-codex/api-contracts` | tRPC factory (`workspaceProcedure`, middlewares) + `healthRouter`                                             | Project `AppRouter` — assembled in the consuming server |
| `@sb-codex/jobs`          | BullMQ queue definitions + typed payloads + worker entrypoint (email/search-index/webhook/export)             | Domain-specific job processors                          |
| `@sb-codex/acl`           | RBAC middleware (`adminProcedure`, `ownerProcedure`) + React client (`AclProvider`, `useRole`, `AccessGuard`) | Product-specific role sets                              |

**`AppRouter` lives in the project, not the plugin.** The server assembles its own `appRouter` from the platform `healthRouter` plus project-specific routers. The admin imports `AppRouter` as `import type` from the server (monorepo: relative path; deployed: a project-owned type package).

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
| Data tables              | TanStack Table (headless) — `DataTable` wrapper with search/sort/pagination                                                         |
| Date picker              | react-datepicker (styled to the design system)                                                                                      |
| Select / dropdown        | react-select v5 (`unstyled` + Tailwind `primary-*` tokens)                                                                          |
| Forms                    | React Hook Form + Zod (via `useZodForm` wrapper)                                                                                    |
| Unit tests               | Vitest + Testing Library                                                                                                            |
| E2E tests                | Playwright                                                                                                                          |
| Pre-commit               | Husky + lint-staged + commitlint                                                                                                    |
| Plugin boundary          | `packages/*` product-agnostic — no business schema (db: platform only)                                                              |

---

## Phase status

| #   | Phase                                                                                                     | Status  |
| --- | --------------------------------------------------------------------------------------------------------- | ------- |
| 1   | Frontend foundations (Tailwind v4, TanStack Router/Query, RHF+Zod, feature folder layout)                 | ✅ Done |
| 2   | Backend skeleton (Fastify + tRPC v11 + Pino + Zod env, admin↔server health pipeline)                     | ✅ Done |
| 3   | Multi-tenant core (Drizzle, RLS, better-auth org plugin, Fastify auth/tenant plugins, `clients` CRUD)     | ✅ Done |
| 4   | Infra (Dockerfiles, docker-compose, Traefik, Postgres, Valkey, MinIO, Meilisearch)                        | ✅ Done |
| 5   | Auth UI (login/signup pages, workspace auto-creation, feature-based frontend structure)                   | ✅ Done |
| 6   | Theme system (UIProvider, `theme.css`, semantic `primary-*` tokens, dark mode, runtime override)          | ✅ Done |
| 7   | CI/CD (GitHub Actions: `ci.yml`, `build-images.yml`, `deploy.yml`, GHCR, native arm64 runner)             | ✅ Done |
| 8   | Production deploy (hub.slimbouchoucha.tn, Let's Encrypt TLS, Traefik file provider)                       | ✅ Done |
| 9   | Publishable plugins: `@sb-codex/*` on npm (beta) + `@sb-codex/create-sb-app` scaffolder (apps-only)       | ✅ Done |
| 10  | Plugin boundary: `AppRouter`+domain routers move to server; all plugins product-agnostic                  | ✅ Done |
| 11  | `core` utils: slugify, format\*, truncate, initials, debounce, groupBy, pick, type guards                 | ✅ Done |
| 12  | `ui-components` primitives (RSC-aware): Input, Dialog, Badge, Avatar, Card, Toast, charts…                | ✅ Done |
| 13  | `ui-components` layouts: `BlankLayout`, `MainLayout` (sidebar+header), `LandingHeader`, `Footer`          | ✅ Done |
| 14  | `ui-components` patterns: `PageHeader`, `EmptyState`, `StatCard`; showcase route + landing page           | ✅ Done |
| 15  | `auth` Google: `signInWithGoogle` + `signInWithProvider` in client facade                                 | ✅ Done |
| 16  | `jobs` queues: typed payloads — `emailQueue`, `exportQueue`, `searchIndexQueue`, `webhookQueue`           | ✅ Done |
| 17  | Testing — Vitest workspace (db/auth/api-contracts/core/acl); Playwright `apps/e2e` tenant-isolation suite | 🔨      |

<!-- Phase 17 — current test inventory (as of 2026-06-09):
  Covered: @sb-codex/db (rls.test.ts), @sb-codex/acl (enforceRole/hasRole/client tests), apps/e2e (auth.spec.ts, tenant-isolation.spec.ts).
  Gaps (priority order): (1) requirePermission factory in @sb-codex/acl — security-critical, untested; (2) @sb-codex/core — zero tests on shared utils; (3) apps/server — no tRPC procedure integration tests; (4) E2E: member management, client CRUD, workspace-switching flows. @sb-codex/jobs and @sb-codex/config are not yet in vitest.workspace.ts.
-->

| 18 | Client management UI — list + global search + delete shipped (`DataTable`); create/edit pending | 🔨 |
| 19 | Member management (invite flow, role management, workspace settings) | ✅ Done |
| 20 | Billing (Stripe via better-auth plugin) | ⏳ |
| 21 | `ui-components` round 2: `DropdownMenu`, `ConfirmDialog`, `Pagination`, `Spinner`, `Breadcrumb`, `Popover`, `Stepper`, `RadioGroup`; travel-agency dashboard; header dark/light toggle + runtime theme presets demo | ✅ Done |
| 22 | `DataTable` on `@tanstack/react-table` (search/sort/pagination) + `DatePicker` on `react-datepicker` | ✅ Done |
| 23 | `ui-components` hooks: `useStepper`, `useModal` (multi-modal control with typed per-modal data) | ✅ Done |
| 24 | `@sb-codex/acl` plugin — `hasRole`, `ROLE_HIERARCHY`, `enforceRole`, `adminProcedure`, `ownerProcedure`; React client `AclProvider`, `useRole`, `AccessGuard`; 18-test Vitest suite | ✅ Done |
| 25 | `jobs` worker implementations — Nodemailer email, Meilisearch search-index, HMAC-signed webhook, export scaffold; `src/env.ts` env extraction | ✅ Done |
| 26 | Multi-app subdomain routing — `hub.*` → Next.js web, `hub-admin.*` → admin SPA, `hub-superadmin.*` → superadmin SPA; Traefik file provider updated; `Dockerfile.web` + `Dockerfile.superadmin` added | ✅ Done |
| 27 | Super admin app (`apps/superadmin`) — platform-level overview, all-workspace stats, Fastify `superAdminRouter` protected by `superAdminProcedure` | ✅ Done |
| 28 | Super admin bootstrap + gate — `pnpm seed:superadmin` (only path to the first super admin); `is_super_admin` surfaced on the better-auth session (`additionalFields`, `input: false`); superadmin app signs out non-super-admins | ✅ Done |
| 29 | Permission-based RBAC — `@sb-codex/acl` `resource:action` permissions + `requirePermission`; roles `manager`/`commercial` added; server-resolved `permissions` via `members.me` → `AclProvider`/`Can`/`usePermission`; clients + members + settings gated end-to-end; 23-test suite | ✅ Done |

---

## Releases

Versioned delivery milestones. The phases above roll up into these releases. The first vertical product built on the starter is a **travel app**, whose lifecycle drives the deployment-target shift.

| Release                                       | Scope                                                                                                                                                        | Deploy target                 | Status     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | ---------- |
| **v0.x — Starter beta**                       | Phases 1–9: multi-tenant RLS core, auth UI, theme system, CI/CD, prod deploy, `@sb-codex/*` plugins on npm (`beta`) + `create-sb-app` scaffolder             | VPS (`hub.slimbouchoucha.tn`) | ✅ Shipped |
| **v1.0 — Production starter + Travel app v1** | Phases 10–13: testing (Vitest + Playwright), client management UI, member management, billing. First vertical (travel app) built on the starter and launched | VPS                           | ⏳ Next    |
| **v2.0 — Cloud-native**                       | Migrate off the single VPS to **Google Cloud or AWS**: managed Postgres / cache / object storage, IaC (Terraform), k8s optional. Travel app v2 runs here     | GCP / AWS                     | 🔭 Planned |

The VPS compose stack is the baseline **through v1**. Cloud manifests and IaC are intentionally deferred to the **v2.0 — Cloud-native** release — see the Scope guard.

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

### Production stack

| Subdomain                          | Service                   |
| ---------------------------------- | ------------------------- |
| `hub.slimbouchoucha.tn`            | Next.js web/marketing     |
| `hub.slimbouchoucha.tn/api`        | Fastify API (priority 10) |
| `hub-admin.slimbouchoucha.tn`      | Admin SPA (nginx)         |
| `hub-superadmin.slimbouchoucha.tn` | Super admin SPA (nginx)   |

- Traefik v3.1 with file provider + Let's Encrypt `tlsChallenge`
- `PathPrefix(/api)` on hub.\* → Fastify (priority 10), Host matchers → respective SPAs/Next.js (priority 1)
- All services on internal Docker network — only Traefik exposes ports 80/443

---

## Scope guard

This roadmap does **not** include:

- Building a specific vertical (travel, e-commerce, cars) — those are forks
- Cloud deployment manifests (k8s, Terraform) — VPS compose stack is the baseline **through v1**; cloud + IaC arrive in the **v2.0 — Cloud-native** release (GCP/AWS)
- Mobile clients — tRPC router types are reusable for React Native later
