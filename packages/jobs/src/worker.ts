import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import type { EmailJobData, SearchIndexJobData, WebhookJobData } from './queues'

const REDIS_URL = process.env['REDIS_URL'] ?? 'redis://localhost:6379'
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null })

const emailWorker = new Worker<EmailJobData>(
  'email',
  async (job) => {
    console.log(`[email] Sending to ${job.data.to}: ${job.data.subject}`)
    // Wire real SMTP/Nodemailer here
  },
  { connection },
)

const searchIndexWorker = new Worker<SearchIndexJobData>(
  'search-index',
  async (job) => {
    console.log(
      `[search-index] ${job.data.action} ${job.data.table}/${job.data.id}`,
    )
    // Wire Meilisearch client here
  },
  { connection },
)

const webhookWorker = new Worker<WebhookJobData>(
  'webhook',
  async (job) => {
    await fetch(job.data.url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(job.data.payload),
    })
  },
  { connection },
)

process.on('SIGTERM', async () => {
  await Promise.all([
    emailWorker.close(),
    searchIndexWorker.close(),
    webhookWorker.close(),
  ])
  await connection.quit()
})

console.log(
  'Worker started — listening for jobs on email, search-index, webhook',
)
