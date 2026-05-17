import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import * as schema from './schema'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function runMigrations() {
  const connectionString = process.env['DATABASE_URL']
  if (!connectionString) throw new Error('DATABASE_URL is required')

  // Use a single connection for migrations (not pooled)
  const sql = postgres(connectionString, { max: 1 })
  const db = drizzle(sql, { schema })

  await migrate(db, {
    migrationsFolder: path.join(__dirname, '../migrations'),
  })

  await sql.end()
  console.log('Migrations complete')
}

runMigrations().catch((err) => {
  console.error(err)
  process.exit(1)
})
