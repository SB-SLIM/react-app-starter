import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { client } from '@sb-codex/db'
import { router, workspaceProcedure } from '@sb-codex/api-contracts'

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

  create: workspaceProcedure
    .input(clientInput)
    .output(clientSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.workspace) throw new Error('Workspace not found')
      const rows = await ctx.db
        .insert(client)
        .values({ ...input, workspaceId: ctx.workspace.id })
        .returning()
      const row = rows[0]
      if (!row) throw new Error('Insert failed')
      return row
    }),

  update: workspaceProcedure
    .input(z.object({ id: z.uuid() }).extend(clientInput.partial().shape))
    .output(clientSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...patch } = input
      const rows = await ctx.db
        .update(client)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(client.id, id))
        .returning()
      const row = rows[0]
      if (!row) throw new Error('Client not found')
      return row
    }),

  delete: workspaceProcedure
    .input(z.object({ id: z.uuid() }))
    .output(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(client).where(eq(client.id, input.id))
      return { id: input.id }
    }),
})
