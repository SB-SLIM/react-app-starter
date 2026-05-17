import { z } from 'zod'

/**
 * Parse a record (typically process.env) against a Zod object schema and return
 * the typed result. Throws — and prints the formatted error — if validation fails.
 *
 * Apps should call this once at startup and re-export the resulting object,
 * so the rest of the codebase never touches process.env directly.
 */
export function createEnv<TSchema extends z.ZodObject<z.ZodRawShape>>(
  schema: TSchema,
  source: Record<string, string | undefined> = process.env,
): z.infer<TSchema> {
  const parsed = schema.safeParse(source)
  if (!parsed.success) {
    console.error('Invalid environment variables:')
    console.error(JSON.stringify(parsed.error.format(), null, 2))
    throw new Error('Invalid environment variables')
  }
  return parsed.data
}

export { z }
