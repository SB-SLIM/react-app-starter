import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

/**
 * RLS tenant-isolation guardrail (integration test).
 *
 * Proves that the multi-tenant isolation actually works END TO END at the DB level:
 * connecting as the non-privileged `app` role, a tenant can only ever see / write its
 * own rows. This is the regression test for the P0 fix (ADR-001) — if someone reverts
 * the app to a superuser connection, or drops FORCE RLS / WITH CHECK, this goes red.
 *
 * Requires a Postgres reachable via TEST_DATABASE_URL (a SUPERUSER connection, used to
 * run migrations + seed). Skipped automatically when that env var is absent, so plain
 * `pnpm test` without a database stays green. CI provides it (see .github/workflows).
 */

const SUPERUSER_URL = process.env['TEST_DATABASE_URL']
const APP_TEST_PASSWORD = 'app_rls_test_pw'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsFolder = path.join(__dirname, '../../migrations')

// Unique ids so the suite is safe to re-run against a persistent database.
const suffix = Math.random().toString(36).slice(2, 10)
const WS_A = `rls-test-a-${suffix}`
const WS_B = `rls-test-b-${suffix}`

describe.skipIf(!SUPERUSER_URL)('RLS tenant isolation', () => {
  let adminSql: ReturnType<typeof postgres>
  let appSql: ReturnType<typeof postgres>

  beforeAll(async () => {
    adminSql = postgres(SUPERUSER_URL as string, { max: 1 })

    // Apply every migration: creates tables, the `app` role, FORCE RLS + WITH CHECK policy.
    await migrate(drizzle(adminSql), { migrationsFolder })

    // Give the (NOLOGIN) app role a throwaway login password for this test only.
    await adminSql.unsafe(
      `ALTER ROLE app WITH LOGIN PASSWORD '${APP_TEST_PASSWORD}'`,
    )

    // Two workspaces + one client that belongs to workspace A.
    await adminSql`
      INSERT INTO organization (id, name, slug, created_at)
      VALUES (${WS_A}, 'WS A', ${WS_A}, now()), (${WS_B}, 'WS B', ${WS_B}, now())
      ON CONFLICT (id) DO NOTHING
    `
    await adminSql`INSERT INTO client (workspace_id, name) VALUES (${WS_A}, 'A-only client')`

    // App-role connection, derived from the superuser URL.
    const u = new URL(SUPERUSER_URL as string)
    u.username = 'app'
    u.password = APP_TEST_PASSWORD
    appSql = postgres(u.toString(), { max: 1 })
  })

  afterAll(async () => {
    if (adminSql) {
      // Cascades to clients via the workspace_id FK.
      await adminSql`DELETE FROM organization WHERE id IN (${WS_A}, ${WS_B})`
    }
    if (appSql) await appSql.end({ timeout: 5 })
    if (adminSql) await adminSql.end({ timeout: 5 })
  })

  it('a tenant sees only its own rows', async () => {
    await appSql.begin(async (tx) => {
      await tx`SELECT set_config('app.workspace_id', ${WS_A}, true)`
      const rows = await tx<{ name: string; workspace_id: string }[]>`
        SELECT name, workspace_id FROM client`
      expect(rows.length).toBeGreaterThan(0)
      expect(rows.every((r) => r.workspace_id === WS_A)).toBe(true)
      expect(rows.some((r) => r.name === 'A-only client')).toBe(true)
    })
  })

  it("a tenant cannot see another tenant's rows", async () => {
    await appSql.begin(async (tx) => {
      await tx`SELECT set_config('app.workspace_id', ${WS_B}, true)`
      const rows = await tx<{ name: string }[]>`SELECT name FROM client`
      expect(rows.some((r) => r.name === 'A-only client')).toBe(false)
    })
  })

  it('WITH CHECK rejects a cross-tenant insert', async () => {
    await expect(
      appSql.begin(async (tx) => {
        await tx`SELECT set_config('app.workspace_id', ${WS_B}, true)`
        // Acting as B, try to write a row owned by A.
        await tx`INSERT INTO client (workspace_id, name) VALUES (${WS_A}, 'sneaky')`
      }),
    ).rejects.toThrow()
  })

  it('fails closed when no workspace is set', async () => {
    await appSql.begin(async (tx) => {
      const rows = await tx<{ name: string }[]>`SELECT name FROM client`
      expect(rows.length).toBe(0)
    })
  })
})
