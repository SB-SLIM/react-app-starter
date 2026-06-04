# @sb-codex/jobs

BullMQ queue definitions and a worker entrypoint for the sb-codex SaaS starter. Runs background jobs (email, search indexing, webhooks) on Valkey/Redis.

## Installation

```bash
pnpm add @sb-codex/jobs
```

## Usage

```ts
import { createQueues } from '@sb-codex/jobs'

const queues = createQueues(process.env.REDIS_URL!)

await queues.email.add('welcome', { to: 'user@example.com' })
```

## API

| Export                                                 | Description                     |
| ------------------------------------------------------ | ------------------------------- |
| `createQueues(redisUrl)`                               | Create the typed BullMQ queues. |
| `Queues`                                               | Type of the queues object.      |
| `EmailJobData`, `SearchIndexJobData`, `WebhookJobData` | Job payload types.              |

## Worker

```bash
pnpm worker   # start the worker process (consumes the queues)
```

---

Part of the [sb-codex SaaS starter](https://github.com/SB-SLIM/react-app-starter). See [docs/plugins](../../docs/plugins/README.md).
