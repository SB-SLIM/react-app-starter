---
name: testing-patterns
description: >
  Write tests in this repository. Covers Vitest unit/integration patterns for
  packages, tRPC procedure testing, RLS isolation tests, and Playwright E2E
  patterns. Use when asked to write, fix, or expand tests anywhere in the
  monorepo.
---

# Testing Patterns — sb-codex monorepo

Read the relevant section for the type of test needed. Do not load all sections
if only one is needed.

---

## 1. Vitest — package unit tests

**Config location**: each package has its own `vitest.config.ts`.
**Run**: `pnpm --filter @sb-codex/<name> test`
**Workspace runner**: `vitest.workspace.ts` at repo root federates all packages.

### Minimal package vitest.config.ts
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      thresholds: { lines: 80, functions: 80, branches: 70 },
    },
  },
})
```

### @sb-codex/core — pure util tests
Tests live in `packages/core/src/__tests__/`. No external deps, no mocks needed.

```ts
import { describe, it, expect } from 'vitest'
import { slugify } from '../slugify'

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })
  it('removes special characters', () => {
    expect(slugify('Héllo!')).toBe('hello')
  })
})
```

### @sb-codex/acl — permission tests
```ts
import { describe, it, expect } from 'vitest'
import { can, permissionsFor } from '../permissions'

describe('can()', () => {
  it('owner can do everything', () => {
    expect(can('owner', 'clients:delete')).toBe(true)
  })
  it('member cannot delete clients', () => {
    expect(can('member', 'clients:delete')).toBe(false)
  })
})
```

---

## 2. RLS integration tests

**Reference**: `packages/db/src/__tests__/rls.test.ts`
**Requires**: `TEST_DATABASE_URL` env (Postgres 16 with app role created).
**CI job**: `rls-isolation` spins a Postgres service container.

### Pattern
```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

// Two separate connections: superuser for setup, app role for assertions
let superDb: ReturnType<typeof drizzle>
let appDb: ReturnType<typeof drizzle>

beforeAll(async () => {
  const superClient = postgres(process.env.TEST_DATABASE_URL!)
  superDb = drizzle(superClient)
  // run migrations as superuser
  // create two workspaces (ws-1, ws-2)
  // insert rows with each workspace_id

  const appClient = postgres(process.env.TEST_DATABASE_URL!.replace('postgres:', 'postgresql://app:'))
  appDb = drizzle(appClient)
})

it('app role cannot read rows from a different workspace', async () => {
  // SET LOCAL only in a transaction
  await appDb.transaction(async (tx) => {
    await tx.execute(sql`SET LOCAL app.workspace_id = 'ws-1'`)
    const rows = await tx.select().from(myTable)
    // must only see ws-1 rows
    expect(rows.every(r => r.workspaceId === 'ws-1')).toBe(true)
  })
})
```

**Key rules**:
- `SET LOCAL` only works inside a transaction.
- The `app` role must NOT be a table owner or superuser — RLS is bypassed for owners.
- Always test both directions: ws-1 cannot read ws-2, and ws-2 cannot read ws-1.

---

## 3. tRPC procedure integration tests

Tests live in `apps/server/src/__tests__/`. Use a test Postgres instance (same `TEST_DATABASE_URL`).

### Setup helper
```ts
import { createCallerFactory } from '@trpc/server'
import { appRouter } from '../trpc/_app'
import { createDb } from '@sb-codex/db'
import { createAuth } from '@sb-codex/auth'

export function createTestCaller(overrides?: Partial<Context>) {
  const db = createDb(process.env.TEST_DATABASE_URL!)
  const createCaller = createCallerFactory(appRouter)
  const ctx: Context = {
    requestId: 'test',
    user: null,
    workspace: null,
    db,
    ...overrides,
  }
  return createCaller(ctx)
}
```

### Procedure test example
```ts
describe('clients.list', () => {
  it('requires authentication', async () => {
    const caller = createTestCaller({ user: null })
    await expect(caller.clients.list({ limit: 10 })).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    })
  })

  it('returns only workspace-scoped clients', async () => {
    const caller = createTestCaller({
      user: { id: 'u1', ... },
      workspace: { id: 'ws-1', slug: 'acme' },
    })
    const result = await caller.clients.list({ limit: 10 })
    expect(result.items.every(c => c.workspaceId === 'ws-1')).toBe(true)
  })
})
```

---

## 4. Playwright E2E tests

**Config**: `apps/e2e/playwright.config.ts`
**Run**: `pnpm --filter e2e test`
**Base URL**: `http://localhost:5173` (admin SPA)

### Auth fixture
```ts
import { test as base } from '@playwright/test'

export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ page }, use) => {
    await page.goto('/sign-in')
    await page.fill('[name=email]', 'test@example.com')
    await page.fill('[name=password]', 'password123')
    await page.click('[type=submit]')
    await page.waitForURL('/dashboard')
    await use(page)
  },
})
```

### Tenant isolation E2E pattern
```ts
test('workspace A cannot see workspace B data', async ({ page }) => {
  // sign in as workspace A user
  // navigate to clients list
  // assert workspace B client names are absent
})
```

### Accessibility check (axe-core)
```ts
import AxeBuilder from '@axe-core/playwright'

test('dashboard has no critical a11y violations', async ({ page }) => {
  await page.goto('/dashboard')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
  expect(results.violations).toHaveLength(0)
})
```

---

## Coverage targets

| Package | Lines | Functions | Branches |
|---|---|---|---|
| @sb-codex/core | 90% | 90% | 85% |
| @sb-codex/acl | 90% | 90% | 85% |
| @sb-codex/auth | 80% | 80% | 70% |
| @sb-codex/db | 80% | 80% | 70% |
| @sb-codex/api-contracts | 80% | 80% | 70% |
| apps/server (procedures) | 75% | 75% | 65% |
