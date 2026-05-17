import { test, expect } from '@playwright/test'

/**
 * Tenant isolation suite.
 * Verifies that workspace A cannot access workspace B's data,
 * even when the DB query is issued with a valid session.
 * Requires the full docker-compose stack to be running.
 */

const API = process.env['API_URL'] ?? 'http://api.localhost'

test.describe('tenant isolation (RLS)', () => {
  test('workspace A clients are not visible to workspace B', async ({
    request,
  }) => {
    // This test requires two seeded workspaces: "acme" and "globex"
    // with their own members. Tokens are set via environment.
    const acmeToken = process.env['E2E_ACME_TOKEN']
    const globexToken = process.env['E2E_GLOBEX_TOKEN']

    test.skip(!acmeToken || !globexToken, 'E2E tokens not configured')

    // Create a client in workspace acme
    const createRes = await request.post(`${API}/trpc/clients.create`, {
      headers: {
        'content-type': 'application/json',
        cookie: `better-auth.session_token=${acmeToken}`,
        'x-workspace-slug': 'acme',
      },
      data: { json: { name: 'Acme Client', email: 'client@acme.com' } },
    })
    expect(createRes.ok()).toBeTruthy()

    // Try to read acme's clients using globex's session — should get empty list
    const listRes = await request.get(`${API}/trpc/clients.list`, {
      headers: {
        cookie: `better-auth.session_token=${globexToken}`,
        'x-workspace-slug': 'globex',
      },
    })
    const body = (await listRes.json()) as {
      result: { data: { json: unknown[] } }
    }
    const clients = body.result?.data?.json ?? []
    const acmeClient = (clients as { name: string }[]).find(
      (c) => c.name === 'Acme Client',
    )
    expect(acmeClient).toBeUndefined()
  })
})
