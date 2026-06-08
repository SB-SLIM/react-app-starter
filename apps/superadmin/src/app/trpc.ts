import { createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '../../../server/src/trpc/_app'

export const trpc = createTRPCReact<AppRouter>()
