import { Queue } from 'bullmq'
import type IORedis from 'ioredis'

export type EmailJobData = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  workspaceId?: string
}

export type ExportJobData = {
  workspaceId: string
  userId: string
  resource: string
  filters?: Record<string, unknown>
  format: 'csv' | 'xlsx' | 'json'
  notifyEmail?: string
}

export type SearchIndexJobData = {
  table: string
  id: string
  action: 'index' | 'delete'
  data?: Record<string, unknown>
}

export type WebhookJobData = {
  url: string
  payload: Record<string, unknown>
  workspaceId: string
  secret?: string
}

export function createQueues(connection: IORedis) {
  return {
    email: new Queue<EmailJobData>('email', { connection }),
    export: new Queue<ExportJobData>('export', { connection }),
    searchIndex: new Queue<SearchIndexJobData>('search-index', { connection }),
    webhook: new Queue<WebhookJobData>('webhook', { connection }),
  }
}

export type Queues = ReturnType<typeof createQueues>
