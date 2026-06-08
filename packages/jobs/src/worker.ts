import { createTransport } from 'nodemailer'
import { MeiliSearch } from 'meilisearch'
import { createHmac } from 'crypto'
import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import type {
  EmailJobData,
  ExportJobData,
  SearchIndexJobData,
  WebhookJobData,
} from './queues'
import { env } from './env'

const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null })

const mailer = env.SMTP_HOST
  ? createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: env.SMTP_USER
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined,
    })
  : null

const meili = new MeiliSearch({ host: env.MEILI_URL, apiKey: env.MEILI_KEY })

const emailWorker = new Worker<EmailJobData>(
  'email',
  async (job) => {
    const to = Array.isArray(job.data.to) ? job.data.to : [job.data.to]
    if (!mailer) {
      console.warn(
        '[email] SMTP not configured — skipping',
        to,
        job.data.subject,
      )
      return
    }
    await mailer.sendMail({
      from: env.SMTP_FROM,
      to: to.join(', '),
      subject: job.data.subject,
      html: job.data.html,
      text: job.data.text,
    })
    console.log(`[email] Sent to ${to.join(', ')}: ${job.data.subject}`)
  },
  { connection },
)

const exportWorker = new Worker<ExportJobData>(
  'export',
  async (job) => {
    const { workspaceId, resource, format, notifyEmail } = job.data
    console.log(`[export] ${resource} (${format}) workspace=${workspaceId}`)
    // TODO: query DB by resource+filters → serialize to format → upload to MinIO
    // then optionally enqueue an email notification to notifyEmail
    if (notifyEmail) {
      console.log(`[export] Would notify ${notifyEmail} when done`)
    }
  },
  { connection },
)

const searchIndexWorker = new Worker<SearchIndexJobData>(
  'search-index',
  async (job) => {
    const { table, id, action, data } = job.data
    const index = meili.index(table)
    if (action === 'delete') {
      await index.deleteDocument(id)
      console.log(`[search-index] Deleted ${table}/${id}`)
    } else {
      if (!data) {
        console.warn(
          `[search-index] index action missing data for ${table}/${id}`,
        )
        return
      }
      await index.addDocuments([{ id, ...data }])
      console.log(`[search-index] Indexed ${table}/${id}`)
    }
  },
  { connection },
)

const webhookWorker = new Worker<WebhookJobData>(
  'webhook',
  async (job) => {
    const { url, payload, secret } = job.data
    const body = JSON.stringify(payload)
    const headers: Record<string, string> = {
      'content-type': 'application/json',
    }
    if (secret) {
      const sig = createHmac('sha256', secret).update(body).digest('hex')
      headers['x-webhook-signature'] = `sha256=${sig}`
    }
    const res = await fetch(url, { method: 'POST', headers, body })
    if (!res.ok) throw new Error(`Webhook ${url} responded ${res.status}`)
    console.log(`[webhook] Delivered to ${url} (${res.status})`)
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
