---
name: code-review
description: >
  Review code in this repository for correctness, security, and architectural
  compliance. Use when asked to review a PR, a diff, or a specific file.
  Covers RLS/tenant isolation, tRPC procedure patterns, permission enforcement,
  TypeScript strictness, feature boundary violations, and the audit findings
  catalogued in docs/roadmap.md.
---

# Code Review — sb-codex monorepo

Perform a structured review across the four concern tiers below. Read only the
files relevant to the diff — do not load the entire codebase.

---

## Tier 1 — Security & Data Isolation (block merge if violated)

### RLS / Multi-tenancy
- [ ] Every new business table has `workspace_id TEXT NOT NULL`.
- [ ] Every new Drizzle migration appends `ENABLE ROW LEVEL SECURITY`, `FORCE ROW LEVEL SECURITY`, and RLS policies (`USING` + `WITH CHECK`) keyed on `current_setting('app.workspace_id')`.
- [ ] No procedure performs a raw `WHERE workspace_id = X` — isolation is handled by RLS + `SET LOCAL` in `enforceWorkspace`. Any explicit filter is redundant and a smell.
- [ ] `enforceWorkspace` middleware validates that `req.user` is an **active member** of the workspace before calling `SET LOCAL app.workspace_id`. A slug header alone is not sufficient proof of membership.
- [ ] Migrations connect as superuser; the server connects as the `app` role. Never swap these.

### Permission enforcement
- [ ] Any procedure that mutates data uses `workspaceProcedure` (not `protectedProcedure`).
- [ ] Destructive or privileged operations use `requirePermission('resource:action')` from `@sb-codex/acl`.
- [ ] `ROLE_PERMISSIONS` map (server-side only) is the source of truth. No permission logic in client code.
- [ ] `AclProvider` in the UI receives resolved `permissions: string[]` from `members.me` — it is display-only. Never use it as the actual gate.

### Auth
- [ ] Apps import from `@sb-codex/auth/client`, never from `better-auth` directly.
- [ ] `isSuperAdmin` flag is only checked on the platform axis — never conflated with workspace roles.

### Dangerous Drizzle patterns
- [ ] No `db.delete(table)` without a `.where(...)` clause.
- [ ] No `db.update(table).set(...)` without a `.where(...)` clause.
- [ ] Bulk deletes/updates are reviewed for blast radius before approval.

---

## Tier 2 — Correctness (flag for fix before merge)

### TypeScript
- [ ] No `as any` or `@ts-ignore` without a comment explaining why.
- [ ] Array index access (`arr[i]`) followed by property access without a guard — flag for `noUncheckedIndexedAccess`.
- [ ] Async functions passed to `.forEach` — flag as unhandled promise (`no-misused-promises`).
- [ ] `.then()` chains not returned or awaited — flag as floating promise (`no-floating-promises`).

### tRPC procedures
- [ ] Input schemas use Zod and are as strict as possible (no `z.any()`).
- [ ] List procedures have pagination input (`limit`/`cursor` or `page`/`pageSize`) — unbounded queries are not allowed.
- [ ] Output is typed — no `as unknown as X` casts.
- [ ] Error is thrown via `new TRPCError({ code, message })` with a structured code from the domain error taxonomy.

### Feature boundaries
- [ ] No feature folder imports another feature folder directly (`features/clients` must not import from `features/members`). Shared code goes to `shared/`.
- [ ] Route files are thin — no business logic, only wiring.
- [ ] Packages under `packages/` contain no domain/business logic specific to one product vertical.

---

## Tier 3 — Code Quality (suggest, don't block)

- Cognitive complexity: functions > 15 branches should be decomposed.
- No comment that explains *what* the code does — only *why* (hidden constraints, workarounds).
- New packages: must have `README.md`, `publishConfig.access: public`, and be listed in `docs/plugins/README.md`.
- Environment variables: new vars must be added to `apps/server/src/env.ts` (Zod-validated) and `.env.example`.
- New Docker images: must have a non-root `USER` directive and a `HEALTHCHECK`.

---

## Tier 4 — Test coverage (advisory)

- New tRPC procedures should have a corresponding integration test in `apps/server/src/__tests__/` or the relevant package.
- New utility functions in `@sb-codex/core` must have unit tests.
- New ACL permissions must be tested via `requirePermission` unit tests in `packages/acl/src/__tests__/`.
- E2E: new user-facing flows should have a Playwright test in `apps/e2e/tests/`.

---

## Review output format

Emit findings grouped by tier. For each finding:

```
[TIER] FILE:LINE — description
Suggestion: ...
```

End with a summary line: `✅ No blockers` or `🚫 N blocker(s), M suggestion(s)`.
