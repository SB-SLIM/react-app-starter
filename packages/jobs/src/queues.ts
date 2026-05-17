import { Queue } from 'bullmq'
import type IORedis from 'ioredis'

export type EmailJobData = {
  to: string
  subject: string
  html: string
  text?: string
}

export type SearchIndexJobData = {
  table: string
  id: string
  action: 'index' | 'delete'
}

export type WebhookJobData = {
  url: string
  payload: Record<string, unknown>
  workspaceId: string
}

export function createQueues(connection: IORedis) {
  return {
    email: new Queue<EmailJobData>('email', { connection }),
    searchIndex: new Queue<SearchIndexJobData>('search-index', { connection }),
    webhook: new Queue<WebhookJobData>('webhook', { connection }),
  }
}

export type Queues = ReturnType<typeof createQueues>
