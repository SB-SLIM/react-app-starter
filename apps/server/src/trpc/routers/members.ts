import { z } from 'zod'
import { router, workspaceProcedure } from '@sb-codex/api-contracts'
import type { MemberRole } from '@sb-codex/api-contracts'

export const membersRouter = router({
  me: workspaceProcedure
    .output(z.object({ role: z.enum(['owner', 'admin', 'member']) }))
    .query(({ ctx }) => ({ role: ctx.memberRole as MemberRole })),
})
