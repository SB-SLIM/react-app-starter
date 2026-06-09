# Agent: Architecture

Specialized context for cross-cutting architectural review, ADRs, and system
design decisions. Read `CLAUDE.md` and `docs/architecture.md` first — they are
the canonical source of truth. This file adds decision criteria and review checklists.

---

## Locked decisions — do not re-litigate

These were decided in the roadmap and are not up for debate without an ADR:

| Decision | Rationale (short) |
|---|---|
| RLS for tenant isolation | Defense in depth — isolation enforced at DB level, not just application layer |
| `x-workspace-slug` header | Stateless API; slug is human-readable and URL-friendly |
| `better-auth` | Ships org plugin, session management, OAuth; facade hides internals |
| Fastify 5 | Typed plugins, async-native, minimal overhead vs. Express |
| tRPC v11 | End-to-end type safety without codegen; `AppRouter` is the contract |
| Drizzle ORM | Type-safe queries, migration ownership, compatible with RLS `SET LOCAL` |
| Valkey (Redis-compatible) | BullMQ session store; MIT-licensed Redis fork |
| BullMQ | Redis-backed queues; reliable, typed, proven |
| Meilisearch | Self-hosted full-text search; no per-query cost |
| MinIO | S3-compatible object storage; self-hosted |
| Traefik v3 file provider | Docker API < 1.40 dropped in Docker Engine 27+ |
| Turborepo | Build graph, caching, parallel execution |
| TanStack Router/Query | Type-safe routing + data fetching for SPAs |
| Tailwind v4 | CSS-first config, semantic token system, no PostCSS required |

---

## Tenant model — the invariant

```
platform
  └── organization (= workspace)
        ├── members  (roles: owner | admin | manager | commercial | member)
        └── business tables (workspace_id TEXT NOT NULL on every row)
```

Every architectural change must preserve this invariant.
No shared data between workspaces except through explicit cross-workspace platform APIs
(superadmin only).

---

## Permission system — the two axes

```
Axis 1: Platform (is_super_admin)
  └── boolean flag on the user record
  └── checked at: apps/superadmin sign-in; superAdmin tRPC router
  └── separate from workspace roles

Axis 2: Workspace role → permissions
  └── ROLE_PERMISSIONS map lives in packages/acl/src/server.ts  ← ONLY source of truth
  └── map NEVER ships to the browser
  └── members.me returns resolved string[] — what the user CAN do, not their role
  └── AclProvider + Can component = display-only
  └── requirePermission() = enforcement (server-side tRPC middleware)
```

When adding a new permission:
1. Add to `PERMISSIONS` array in `packages/acl/src/permissions.ts`.
2. Add to the appropriate roles in `ROLE_PERMISSIONS` map.
3. Add a `requirePermission` unit test.
4. Update `docs/architecture.md` § Roles & Permissions.

---

## Module system rules

- **Packages** (`packages/*`): output CJS + ESM via `tsup`. Both formats.
- **apps/server**: currently CommonJS. Migration to ESM is tracked in the audit (TS-3).
  Until migrated, keep `"module": "commonjs"` in `apps/server/tsconfig.json`.
  Do not introduce ESM-only deps to `apps/server` until migration is complete.
- **apps/admin, apps/superadmin**: Vite bundles ESM — no restriction.
- **apps/web**: Next.js 16 — follow Next.js module guidance (read docs first per AGENTS.md).

---

## Package publishability rules

Before adding anything to `packages/*`, verify it is product-agnostic:
- No domain types (no `Booking`, `Product`, `Order` unless it's an auth/tenant concept)
- No business rules (pricing logic, domain-specific validations)
- No hard-coded tenant schema beyond the `client` example table

If the code is specific to one vertical, it belongs in `apps/server` or a project-owned package.

---

## ADR format

New architectural decisions should be documented in `docs/adr/`:

```markdown
# ADR-NNN: <title>

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-XXX

## Context
What is the problem? What forces are at play?

## Decision
What was decided and why?

## Consequences
What becomes easier? What becomes harder? What is the risk?
```

---

## Scaling tiers (from docs/architecture.md)

| DAU | Strategy |
|---|---|
| 0–50k | Single Postgres + PgBouncer |
| 50k–500k | Read replicas (Drizzle read/write split) |
| 500k–2M | Shard by workspace_id hash |
| 2M+ | ClickHouse for analytics; keep OLTP in Postgres |

Architectural changes that would prevent moving to the next tier are regressions.
Specifically: any change that makes workspace_id non-deterministic or removes it from
the data model blocks the shard path.

---

## Review checklist — for cross-cutting changes

Use this when a change touches multiple packages, the database schema, the permission
system, or the CI/CD pipeline:

- [ ] Does it preserve the workspace_id invariant on all new tables?
- [ ] Does it add RLS policies to new tables?
- [ ] Does it use the `app` role (not superuser) for runtime queries?
- [ ] Does it keep ROLE_PERMISSIONS server-side only?
- [ ] Does it add new env vars to `apps/server/src/env.ts` and `.env.example`?
- [ ] Does it keep packages product-agnostic?
- [ ] Is there an ADR if this reverses or significantly extends a locked decision?
- [ ] Does it scale to the 50k–500k DAU tier without a rewrite?
