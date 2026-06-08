import { eq } from 'drizzle-orm'
import { user } from '@sb-codex/db'
import { auth } from './auth'
import { db } from './db'

/**
 * Bootstrap the first super admin.
 *
 * The platform has no other way to create the initial super admin: promoting a
 * user requires already being one (`superAdmin.users.setSuperAdmin`). This
 * script creates the account through better-auth (so the password is hashed the
 * same way login expects) then flips `is_super_admin = true` directly.
 *
 * Run against the superuser DATABASE_URL (like migrations) so RLS/grants don't
 * block the write — never the restricted `app` role.
 *
 * Usage (PowerShell):
 *   $env:SUPERADMIN_PASSWORD = "<strong-password>"
 *   pnpm seed:superadmin
 */
async function main() {
  const email = process.env['SUPERADMIN_EMAIL'] ?? 'bouchouchaslim@gmail.com'
  const name = process.env['SUPERADMIN_NAME'] ?? 'Super Admin'
  const password = process.env['SUPERADMIN_PASSWORD']

  if (!password || password.length < 8) {
    console.error(
      'SUPERADMIN_PASSWORD env var is required (min 8 chars). Aborting.',
    )
    process.exit(1)
  }

  // 1. Create the account via better-auth (idempotent: ignore "already exists").
  try {
    await auth.api.signUpEmail({ body: { name, email, password } })
    console.log(`Created account ${email}`)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (/exist/i.test(message)) {
      console.log(`Account ${email} already exists — promoting it.`)
    } else {
      console.error(`Failed to create account: ${message}`)
      process.exit(1)
    }
  }

  // 2. Promote to super admin.
  const result = await db
    .update(user)
    .set({ isSuperAdmin: true })
    .where(eq(user.email, email))
    .returning({ id: user.id })

  if (result.length === 0) {
    console.error(`No user found for ${email} — nothing promoted.`)
    process.exit(1)
  }

  console.log(`${email} is now a super admin.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
