import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as schema from './schema'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const TEST_WORKSPACE_ID = 'seed-workspace-001'

async function runMigrations() {
  const connectionString = process.env['DATABASE_URL']
  if (!connectionString) throw new Error('DATABASE_URL is required')

  // Use a single connection for migrations (not pooled)
  const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(sql, { schema })

  await migrate(db, {
    migrationsFolder: path.join(__dirname, '../migrations'),
  })

  // Seed test data once — skipped if clients already exist
  const existing = await db.select().from(schema.client).limit(1)
  if (existing.length === 0) {
    await db
      .insert(schema.organization)
      .values({
        id: TEST_WORKSPACE_ID,
        name: 'Test Workspace',
        slug: 'test',
        createdAt: new Date(),
      })
      .onConflictDoNothing()

    await db.insert(schema.client).values([
      {
        workspaceId: TEST_WORKSPACE_ID,
        name: 'Alice Martin',
        email: 'alice@example.com',
        phone: '+33 6 10 00 00 01',
        notes: 'VIP client',
      },
      {
        workspaceId: TEST_WORKSPACE_ID,
        name: 'Bob Dupont',
        email: 'bob@example.com',
        phone: '+33 6 10 00 00 02',
        notes: null,
      },
      {
        workspaceId: TEST_WORKSPACE_ID,
        name: 'Clara Nguyen',
        email: 'clara@example.com',
        phone: null,
        notes: 'Via LinkedIn',
      },
      {
        workspaceId: TEST_WORKSPACE_ID,
        name: 'David Ramos',
        email: null,
        phone: '+33 6 10 00 00 04',
        notes: null,
      },
      {
        workspaceId: TEST_WORKSPACE_ID,
        name: 'Eva Schmidt',
        email: 'eva@example.com',
        phone: '+33 6 10 00 00 05',
        notes: 'Referred by Alice',
      },
    ])
    console.log('Seed complete — 5 test clients inserted (workspace: test)')
  }

  await sql.end()
  console.log('Migrations complete')
}

runMigrations().catch((err) => {
  console.error(err)
  process.exit(1)
})
