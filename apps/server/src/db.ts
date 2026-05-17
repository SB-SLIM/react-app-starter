import { createDb } from '@sb-codex/db'
import { env } from './env'

export const db = createDb(env.DATABASE_URL)
