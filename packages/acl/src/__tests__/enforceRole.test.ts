import { describe, it, expect } from 'vitest'
import { initTRPC, TRPCError } from '@trpc/server'
import { enforceRole } from '../index'
import type { MemberRole } from '../index'
import type { Context } from '@sb-codex/api-contracts'

// Spin up a test-scoped tRPC instance using the same Context shape.
// This lets us attach enforceRole (which expects Context) without needing
// a real DB — the middleware only touches ctx.memberRole.
const t = initTRPC.context<Context>().create()

const testRouter = t.router({
  adminOrOwner: t.procedure
    .use(enforceRole(['owner', 'admin']))
    .query(() => 'ok'),
  ownerOnly: t.procedure.use(enforceRole(['owner'])).query(() => 'ok'),
  anyMember: t.procedure
    .use(enforceRole(['member', 'admin', 'owner']))
    .query(() => 'ok'),
})

const createCaller = t.createCallerFactory(testRouter)

function caller(memberRole: MemberRole | null) {
  return createCaller({
    requestId: 'test',
    user: { id: 'u1', email: 'a@b.com', name: 'A' },
    workspace: { id: 'ws1', slug: 'ws', name: 'WS' },
    memberRole,
    db: {} as Context['db'],
  })
}

describe('enforceRole middleware', () => {
  it('passes when role is in the allowed list', async () => {
    await expect(caller('admin').adminOrOwner()).resolves.toBe('ok')
    await expect(caller('owner').adminOrOwner()).resolves.toBe('ok')
  })

  it('throws FORBIDDEN when role is not in the allowed list', async () => {
    const err = await caller('member')
      .adminOrOwner()
      .catch((e) => e)
    expect(err).toBeInstanceOf(TRPCError)
    expect(err.code).toBe('FORBIDDEN')
  })

  it('throws FORBIDDEN when memberRole is null', async () => {
    const err = await caller(null)
      .adminOrOwner()
      .catch((e) => e)
    expect(err).toBeInstanceOf(TRPCError)
    expect(err.code).toBe('FORBIDDEN')
  })

  it('member is blocked from owner-only procedures', async () => {
    const err = await caller('member')
      .ownerOnly()
      .catch((e) => e)
    expect(err).toBeInstanceOf(TRPCError)
    expect(err.code).toBe('FORBIDDEN')
  })

  it('member passes when member is explicitly allowed', async () => {
    await expect(caller('member').anyMember()).resolves.toBe('ok')
  })
})
