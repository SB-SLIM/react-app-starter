import { z } from 'zod'
import { count } from 'drizzle-orm'
import { client, member } from '@sb-codex/db'
import { router, workspaceProcedure } from '@sb-codex/api-contracts'

export const dashboardRouter = router({
  stats: workspaceProcedure
    .output(
      z.object({
        clients: z.number(),
        members: z.number(),
      }),
    )
    .query(async ({ ctx }) => {
      const [clientsRow] = await ctx.db.select({ n: count() }).from(client)
      const [membersRow] = await ctx.db.select({ n: count() }).from(member)
      return {
        clients: clientsRow?.n ?? 0,
        members: membersRow?.n ?? 0,
      }
    }),
})
