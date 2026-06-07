import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import type {
  EmailJobData,
  ExportJobData,
  SearchIndexJobData,
  WebhookJobData,
} from './queues'

const REDIS_URL = process.env['REDIS_URL'] ?? 'redis://localhost:6379'
const connection = new IORedis(REDIS_URL, { maxRetriesPerRequest: null })

const emailWorker = new Worker<EmailJobData>(
  'email',
  async (job) => {
    const to = Array.isArray(job.data.to) ? job.data.to.join(', ') : job.data.to
    console.log(`[email] Sending to ${to}: ${job.data.subject}`)
    // Wire Nodemailer here
  },
  { connection },
)

const exportWorker = new Worker<ExportJobData>(
  'export',
  async (job) => {
    console.log(
      `[export] ${job.data.resource} (${job.data.format}) for workspace ${job.data.workspaceId}`,
    )
    // Wire CSV/Excel generation + MinIO upload here
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
    exportWorker.close(),
    searchIndexWorker.close(),
    webhookWorker.close(),
  ])
  await connection.quit()
})

console.log(
  'Worker started — listening for jobs on email, export, search-index, webhook',
)
