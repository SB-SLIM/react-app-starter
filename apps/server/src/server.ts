import { randomUUID } from 'node:crypto'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import sensible from '@fastify/sensible'
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify'
import { appRouter, type AppRouter } from '@sb-codex/api-contracts'
import { env } from './env'
import { createContext } from './trpc/create-context'
import { registerErrorHandler } from './plugins/error-handler'

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
  await app.register(cors, {
    origin: env.CORS_ORIGIN.split(',').map((s) => s.trim()),
    credentials: true,
  })
  // Phase 4 swaps the default in-memory store for the Valkey-backed redis store
  await app.register(rateLimit, {
    max: 200,
    timeWindow: '1 minute',
  })

  registerErrorHandler(app)

  app.get('/health', () => ({ status: 'ok' }))
  app.get('/ready', () => {
    // Phase 3+: also check DB and Valkey here
    return { status: 'ready', checks: { app: 'ok' } }
  })

  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
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
