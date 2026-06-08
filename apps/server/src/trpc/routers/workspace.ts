import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { organization } from '@sb-codex/db'
import { router, workspaceProcedure } from '@sb-codex/api-contracts'
import { requirePermission } from '@sb-codex/acl'

const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullable(),
})

export const workspaceRouter = router({
  get: workspaceProcedure.output(workspaceSchema).query(async ({ ctx }) => {
    const [ws] = await ctx.db
      .select({
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
        logo: organization.logo,
      })
      .from(organization)
      .where(eq(organization.id, ctx.workspace!.id))
      .limit(1)
    if (!ws) throw new Error('Workspace not found')
    return ws
  }),

  update: requirePermission('settings:update')
    .input(z.object({ name: z.string().min(1) }))
    .output(workspaceSchema)
    .mutation(async ({ ctx, input }) => {
      const rows = await ctx.db
        .update(organization)
        .set({ name: input.name })
        .where(eq(organization.id, ctx.workspace!.id))
        .returning({
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo,
        })
      const row = rows[0]
      if (!row) throw new Error('Workspace not found')
      return row
    }),
})
