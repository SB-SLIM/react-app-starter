export const env = {
  REDIS_URL: process.env['REDIS_URL'] ?? 'redis://localhost:6379',
  SMTP_HOST: process.env['SMTP_HOST'],
  SMTP_PORT: Number(process.env['SMTP_PORT'] ?? 587),
  SMTP_USER: process.env['SMTP_USER'],
  SMTP_PASS: process.env['SMTP_PASS'],
  SMTP_FROM: process.env['SMTP_FROM'] ?? 'noreply@localhost',
  MEILI_URL: process.env['MEILISEARCH_URL'] ?? 'http://localhost:7700',
  MEILI_KEY: process.env['MEILISEARCH_KEY'] ?? '',
}
