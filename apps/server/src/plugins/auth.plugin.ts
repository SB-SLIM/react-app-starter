import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { auth } from '../auth'

declare module 'fastify' {
  interface FastifyRequest {
    user: { id: string; email: string; name: string } | null
  }
}

const authPlugin: FastifyPluginAsync = async (app) => {
  // Mount better-auth HTTP handler at /api/auth/*
  app.all('/api/auth/*', async (request, reply) => {
    const url = `${request.protocol}://${request.hostname}${request.url}`
    const webRequest = new Request(url, {
      method: request.method,
      headers: new Headers(request.headers as Record<string, string>),
      body:
        request.method !== 'GET' && request.method !== 'HEAD'
          ? JSON.stringify(request.body)
          : undefined,
    })

    const response = await auth.handler(webRequest)

    void reply.status(response.status)
    response.headers.forEach((value, key) => void reply.header(key, value))
    const body = await response.text()
    return reply.send(body)
  })

  // Resolve session for every request
  app.addHook('preHandler', async (request) => {
    try {
      const session = await auth.api.getSession({
        headers: new Headers(request.headers as Record<string, string>),
      })
      request.user = session?.user
        ? {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
          }
        : null
    } catch {
      request.user = null
    }
  })
}

export const registerAuthPlugin = fp(authPlugin, { name: 'auth' })
