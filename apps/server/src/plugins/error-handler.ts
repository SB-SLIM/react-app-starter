import type { FastifyError, FastifyInstance } from 'fastify'

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request, reply) => {
    request.log.error({ err: error, reqId: request.id }, 'request failed')

    if (error.validation) {
      reply.status(400).send({
        error: 'ValidationError',
        issues: error.validation,
      })
      return
    }

    const status = error.statusCode ?? 500
    reply.status(status).send({
      error: error.name || 'Error',
      message: status >= 500 ? 'Internal server error' : error.message,
    })
  })
}
