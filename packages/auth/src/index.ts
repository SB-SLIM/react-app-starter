import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organization } from 'better-auth/plugins'
import { schema, type Database } from '@sb-codex/db'

export interface AuthConfig {
  secret: string
  baseURL: string
  trustedOrigins: string[]
  googleClientId?: string
  googleClientSecret?: string
}

export function createAuth(db: Database, config: AuthConfig) {
  return betterAuth({
    secret: config.secret,
    baseURL: config.baseURL,
    trustedOrigins: config.trustedOrigins,
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
        organization: schema.organization,
        member: schema.member,
        invitation: schema.invitation,
      },
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // set true in production
    },
    user: {
      additionalFields: {
        // Surfaced on the session so apps can gate access. `input: false`
        // prevents clients from self-granting it via signup/update payloads.
        // 'owner' | 'admin' | 'viewer' | null
        platformRole: { type: 'string', input: false, defaultValue: null },
      },
    },
    socialProviders:
      config.googleClientId && config.googleClientSecret
        ? {
            google: {
              clientId: config.googleClientId,
              clientSecret: config.googleClientSecret,
            },
          }
        : {},
    plugins: [organization()],
  })
}

export type AuthInstance = ReturnType<typeof createAuth>
