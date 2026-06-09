# Agent: Tests

Specialized context for writing, fixing, and expanding tests in this monorepo.
Read `CLAUDE.md` for global rules and `.claude/skills/testing-patterns/SKILL.md`
for patterns and code examples. This file adds scope, priorities, and setup context.

---

## Test inventory — current state

| Package / App | Runner | Test files | Coverage gate |
|---|---|---|---|
| `@sb-codex/db` | Vitest (node) | `__tests__/rls.test.ts` | v8 70% branches |
| `@sb-codex/acl` | Vitest (node) | `__tests__/` (enforceRole, hasRole, client) | none set |
| `@sb-codex/core` | Vitest (node) | **none** | none |
| `@sb-codex/auth` | Vitest (node) | **none** | none |
| `@sb-codex/api-contracts` | Vitest (node) | **none** | none |
| `@sb-codex/jobs` | **not in workspace** | **none** | none |
| `@sb-codex/config` | **not in workspace** | **none** | none |
| `apps/server` | **none** | **none** | none |
| `apps/e2e` | Playwright | `auth.spec.ts`, `tenant-isolation.spec.ts` | none |

**Highest priority gaps (from audit):**
1. `requirePermission` factory in `@sb-codex/acl` — security-critical, untested
2. `@sb-codex/core` utilities — zero tests on shared code
3. `apps/server` tRPC procedures — no integration tests
4. E2e: member management, client CRUD, workspace switching flows

---

## Running tests

```bash
pnpm test                           # all packages via vitest.workspace.ts
pnpm --filter @sb-codex/acl test    # single package
pnpm --filter @sb-codex/db test     # RLS integration (needs TEST_DATABASE_URL)
pnpm --filter e2e test              # Playwright (needs running stack)
pnpm test --coverage                # generate coverage report
```

---

## Test file placement

| What | Where |
|---|---|
| Package unit test | `packages/<name>/src/__tests__/<module>.test.ts` |
| Server procedure test | `apps/server/src/__tests__/<router>.test.ts` |
| E2E flow | `apps/e2e/tests/<feature>.spec.ts` |
| RLS isolation | `packages/db/src/__tests__/rls.test.ts` (extend this file) |

---

## vitest.workspace.ts — adding a new package

When a package has no `vitest.config.ts`, add it to `vitest.workspace.ts` at root:

```ts
// vitest.workspace.ts
export default defineWorkspace([
  'packages/core/vitest.config.ts',
  'packages/acl/vitest.config.ts',
  // add here
  'packages/jobs/vitest.config.ts',
  'packages/config/vitest.config.ts',
])
```

And create `packages/<name>/vitest.config.ts` (see `.claude/skills/testing-patterns/SKILL.md` § 1).

---

## tRPC procedure test setup

`apps/server` has no test helper yet. When adding the first procedure test, create:

```
apps/server/src/__tests__/
  helpers/
    createTestCaller.ts   ← caller factory + DB setup
    fixtures.ts           ← seed workspace, user, member
  clients.test.ts
  members.test.ts
  ...
```

The caller factory pattern is documented in `.claude/skills/testing-patterns/SKILL.md` § 3.

Key constraint: procedure tests need a real Postgres instance with the `app` role created.
Use `TEST_DATABASE_URL` env (same as the RLS tests). The CI `rls-isolation` job already
spins a Postgres service — extend it to also run procedure tests.

---

## ACL test priorities

Write these first — they are security-critical and fast (no DB needed):

```ts
// packages/acl/src/__tests__/requirePermission.test.ts
describe('requirePermission', () => {
  it('allows owner to perform any action')
  it('allows admin to delete clients')
  it('blocks member from deleting clients')
  it('blocks commercial from inviting members')
  it('throws FORBIDDEN, not UNAUTHORIZED')
})
```

---

## E2E test priorities

Extend `apps/e2e/tests/` with:

1. `clients.spec.ts` — create, edit, delete client; verify in list
2. `members.spec.ts` — invite member, accept invite, change role, remove member
3. `workspace.spec.ts` — create workspace, switch between workspaces
4. `permissions.spec.ts` — sign in as `member` role, verify delete button is hidden

Add axe-core to all E2E tests (see `.claude/skills/testing-patterns/SKILL.md` § 4).

---

## Coverage targets

| Package | Lines | Functions | Branches |
|---|---|---|---|
| `@sb-codex/core` | 90% | 90% | 85% |
| `@sb-codex/acl` | 90% | 90% | 85% |
| `@sb-codex/auth` | 80% | 80% | 70% |
| `@sb-codex/db` | 80% | 80% | 70% |
| `@sb-codex/api-contracts` | 80% | 80% | 70% |
| `apps/server` (procedures) | 75% | 75% | 65% |

Add these thresholds to each package's `vitest.config.ts` once tests exist.
