import { createEnv, z } from '@sb-codex/config'

export const env = createEnv(
  z.object({
    NODE_ENV: z
      .enum(['development', 'test', 'production'])
      .default('development'),
    HOST: z.string().default('0.0.0.0'),
    PORT: z.coerce.number().int().positive().default(3001),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
      .default('info'),
    CORS_ORIGIN: z.string().default('http://localhost:5173'),
    DATABASE_URL: z
      .string()
      .default('postgresql://postgres:postgres@localhost:5432/saas'),
    REDIS_URL: z.string().default('redis://localhost:6379'),
    BETTER_AUTH_SECRET: z
      .string()
      .min(32)
      .default('change-me-in-production-must-be-32-chars'),
    BETTER_AUTH_URL: z.string().default('http://localhost:3001'),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
  }),
)
