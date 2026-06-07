import path from 'node:path'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { db } from './db'

void (async () => {
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), 'migrations'),
  })
  console.log('Migrations complete')

  // Sync the non-privileged `app` role LOGIN password on every deploy.
  // The init script (01_init.sh) only runs on a fresh Postgres volume — this
  // covers already-initialised databases so deploys are always self-healing.
  const appPw = process.env.APP_DB_PASSWORD
  const databaseUrl = process.env.DATABASE_URL
  if (appPw && databaseUrl) {
    const adminSql = postgres(databaseUrl, { max: 1 })
    // DDL does not support $1 parameters — escape single quotes manually.
    const escapedPw = appPw.replace(/'/g, "''")
    await adminSql.unsafe(`ALTER ROLE app WITH LOGIN PASSWORD '${escapedPw}'`)
    await adminSql.end()
    console.log('app role password synchronised')
  }

  process.exit(0)
})()
