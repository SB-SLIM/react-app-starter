import { randomUUID } from 'node:crypto'
import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import sensible from '@fastify/sensible'
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify'
import { appRouter, type AppRouter } from '@sb-codex/api-contracts'
import { client } from '@sb-codex/db'
import { env } from './env'
import { db } from './db'
import { createContext } from './trpc/create-context'
import { registerErrorHandler } from './plugins/error-handler'
import { registerAuthPlugin } from './plugins/auth.plugin'
import { registerTenantPlugin } from './plugins/tenant.plugin'

export async function buildServer() {
  const app = Fastify({
    logger: {
      level: env.LOG_LEVEL,
      transport:
        env.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
    genReqId: () => randomUUID(),
    disableRequestLogging: false,
  })

  await app.register(sensible)
  await app.register(helmet, { contentSecurityPolicy: false })
  await app.register(cookie)
  await app.register(cors, {
    origin: env.CORS_ORIGIN.split(',').map((s) => s.trim()),
    credentials: true,
  })
  await app.register(rateLimit, { max: 200, timeWindow: '1 minute' })

  registerErrorHandler(app)
  await app.register(registerAuthPlugin)
  await app.register(registerTenantPlugin)

  app.get('/api/health', () => ({ status: 'ok' }))

  if (env.NODE_ENV === 'development') {
    app.get('/api/dev/clients', () => db.select().from(client))
  }

  app.get('/api/ready', async () => {
    // Verify DB connectivity
    await db.execute('SELECT 1' as unknown as Parameters<typeof db.execute>[0])
    return { status: 'ready', checks: { app: 'ok', db: 'ok' } }
  })

  await app.register(fastifyTRPCPlugin, {
    prefix: '/api/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ error, path }) {
        app.log.error({ err: error, path }, 'tRPC error')
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  })

  return app
}

async function start() {
  const app = await buildServer()
  try {
    await app.listen({ host: env.HOST, port: env.PORT })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
