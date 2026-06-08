import { z } from 'zod'
import { eq, count, and } from 'drizzle-orm'
import { client } from '@sb-codex/db'
import { router, workspaceProcedure } from '@sb-codex/api-contracts'
import { requirePermission } from '@sb-codex/acl'

const clientInput = z.object({
  name: z.string().min(1),
  email: z.email().nullish(),
  phone: z.string().nullish(),
  notes: z.string().nullish(),
})

const clientSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const clientsRouter = router({
  list: workspaceProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).max(100).default(20),
          offset: z.number().int().min(0).default(0),
        })
        .optional(),
    )
    .output(z.array(clientSchema))
    .query(async ({ ctx, input }) => {
      const { limit = 20, offset = 0 } = input ?? {}
      return ctx.db.select().from(client).limit(limit).offset(offset)
    }),

  count: workspaceProcedure
    .output(z.object({ total: z.number() }))
    .query(async ({ ctx }) => {
      const rows = await ctx.db.select({ value: count() }).from(client)
      return { total: rows[0]?.value ?? 0 }
    }),

  get: workspaceProcedure
    .input(z.object({ id: z.string().uuid() }))
    .output(clientSchema.nullable())
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select()
        .from(client)
        .where(eq(client.id, input.id))
        .limit(1)
      return rows[0] ?? null
    }),

  create: requirePermission('clients:create')
    .input(clientInput)
    .output(clientSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.workspace) throw new Error('Workspace not found')

      if (input.email) {
        const [existing] = await ctx.db
          .select({ id: client.id })
          .from(client)
          .where(
            and(
              eq(client.workspaceId, ctx.workspace.id),
              eq(client.email, input.email),
            ),
          )
          .limit(1)
        if (existing) throw new Error('A client with this email already exists')
      }

      const rows = await ctx.db
        .insert(client)
        .values({ ...input, workspaceId: ctx.workspace.id })
        .returning()
      const row = rows[0]
      if (!row) throw new Error('Insert failed')
      return row
    }),

  update: requirePermission('clients:update')
    .input(z.object({ id: z.uuid() }).extend(clientInput.partial().shape))
    .output(clientSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...patch } = input

      if (patch.email && ctx.workspace) {
        const [existing] = await ctx.db
          .select({ id: client.id })
          .from(client)
          .where(
            and(
              eq(client.workspaceId, ctx.workspace.id),
              eq(client.email, patch.email),
            ),
          )
          .limit(1)
        if (existing && existing.id !== id)
          throw new Error('A client with this email already exists')
      }

      const rows = await ctx.db
        .update(client)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(client.id, id))
        .returning()
      const row = rows[0]
      if (!row) throw new Error('Client not found')
      return row
    }),

  delete: requirePermission('clients:delete')
    .input(z.object({ id: z.uuid() }))
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(client).where(eq(client.id, input.id))
      return { id: input.id }
    }),
})
