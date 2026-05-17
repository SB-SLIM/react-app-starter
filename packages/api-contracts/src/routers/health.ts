import { z } from 'zod'
import { publicProcedure, router } from '../init'

export const healthRouter = router({
  ping: publicProcedure.query(() => ({
    ok: true as const,
    timestamp: new Date().toISOString(),
  })),
  echo: publicProcedure
    .input(z.object({ message: z.string().min(1).max(280) }))
    .query(({ input }) => ({ echoed: input.message })),
})
