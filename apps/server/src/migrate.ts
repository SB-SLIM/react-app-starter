import path from 'node:path'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db } from './db'

void (async () => {
  await migrate(db, {
    migrationsFolder: path.join(process.cwd(), 'migrations'),
  })
  console.log('Migrations complete')
  process.exit(0)
})()
