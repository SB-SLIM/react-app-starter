import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'
import { organization } from './auth'

// Tenant-scoped business table — RLS enforces workspace isolation
export const client = pgTable('client', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: text('workspace_id')
    .notNull()
    .references(() => organization.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type Client = typeof client.$inferSelect
export type NewClient = typeof client.$inferInsert
