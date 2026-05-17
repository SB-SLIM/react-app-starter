import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { eq, and } from 'drizzle-orm'
import { organization, member } from '@sb-codex/db'
import { db } from '../db'

declare module 'fastify' {
  interface FastifyRequest {
    workspace: { id: string; slug: string; name: string } | null
  }
}

const tenantPlugin: FastifyPluginAsync = async (app) => {
  app.addHook('preHandler', async (request) => {
    // Auth routes don't need workspace resolution
    if (request.url.startsWith('/api/auth')) {
      request.workspace = null
      return
    }

    const slug =
      (request.headers['x-workspace-slug'] as string | undefined) ??
      extractSubdomainSlug(request.hostname)

    if (!slug || !request.user) {
      request.workspace = null
      return
    }

    const [ws] = await db
      .select({
        id: organization.id,
        slug: organization.slug,
        name: organization.name,
      })
      .from(organization)
      .where(eq(organization.slug, slug))
      .limit(1)

    if (!ws) {
      request.workspace = null
      return
    }

    // Verify the user is a member of this workspace
    const [mem] = await db
      .select({ role: member.role })
      .from(member)
      .where(
        and(
          eq(member.organizationId, ws.id),
          eq(member.userId, request.user.id),
        ),
      )
      .limit(1)

    request.workspace = mem ? ws : null
  })
}

function extractSubdomainSlug(hostname: string): string | undefined {
  const parts = hostname.split('.')
  // "acme.localhost" → "acme"; skip "www" and bare hosts
  if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    return parts[0]
  }
  return undefined
}

export const registerTenantPlugin = fp(tenantPlugin, {
  name: 'tenant',
  dependencies: ['auth'],
})
