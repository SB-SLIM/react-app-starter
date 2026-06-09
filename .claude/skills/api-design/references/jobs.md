# Background jobs — BullMQ (`@sb-codex/jobs`)

Read this when adding/modifying a queue, payload, or worker, or enqueuing from the server.

## Layout (`packages/jobs/src/`)

- `queues.ts` — typed payloads + the `createQueues(connection)` factory. Current queues:
  `email`, `export`, `searchIndex` (`'search-index'`), `webhook`.
- `worker.ts` — the worker entrypoint: one `new Worker(...)` per queue, plus a `SIGTERM`
  handler that closes every worker and the Redis connection.
- `env.ts` — `REDIS_URL`, `SMTP_*`, `MEILI_*`.
- `index.ts` — exports `createQueues`, `Queues`, and the payload types (no queue singletons).

## Typed payloads (in `queues.ts`)

```ts
export type EmailJobData = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  workspaceId?: string
}
// + ExportJobData, SearchIndexJobData, WebhookJobData

export function createQueues(connection: IORedis) {
  return {
    email: new Queue<EmailJobData>('email', { connection }),
    export: new Queue<ExportJobData>('export', { connection }),
    searchIndex: new Queue<SearchIndexJobData>('search-index', { connection }),
    webhook: new Queue<WebhookJobData>('webhook', { connection }),
  }
}
```

To add a queue: add a typed payload + a line in `createQueues`, then a matching worker.

## Enqueue (from `apps/server`)

There is **no exported queue singleton** — build queues from a connection:

```ts
import IORedis from 'ioredis'
import { createQueues } from '@sb-codex/jobs'

const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null })
const queues = createQueues(connection) // create once, reuse

await queues.email.add('send-invite', {
  to: 'user@example.com',
  subject: 'You are invited',
  html: '<p>…</p>',
  workspaceId: ctx.workspace.id,
})
```

## Worker (`worker.ts`)

```ts
import { Worker } from 'bullmq'

const emailWorker = new Worker<EmailJobData>(
  'email',
  async (job) => {
    /* handle job.data */
  },
  { connection },
)

// Graceful shutdown — close every worker + the connection
process.on('SIGTERM', async () => {
  await Promise.all([emailWorker.close() /* …other workers */])
  await connection.quit()
})
```

## Rules

- **Typed payloads only** — extend the `*JobData` types in `queues.ts`, never `any`.
- **Idempotency key** for jobs that hit external services (Meilisearch, webhooks, email)
  so retries are safe. The webhook worker signs the body with HMAC (`x-webhook-signature`).
- **RLS-in-worker**: a worker that writes to the DB must wrap writes in a transaction +
  `SET LOCAL app.workspace_id = '<workspaceId from payload>'`, otherwise RLS is not active
  and writes are unscoped. (Payloads that touch tenant data carry `workspaceId`.) See
  `references/rls.md`.
- Throw on failure so BullMQ retries (the webhook worker throws on non-2xx).
