import { z } from 'zod'
import { Button } from '@sb-codex/ui-components'
import { useZodForm } from '@/shared/hooks/useZodForm'
import { useSignIn } from '../hooks/useSignIn'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export function LoginForm() {
  const { signIn, pending, error } = useSignIn()
  const form = useZodForm(schema)

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Super Admin
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Platform management console
          </p>
        </div>

        <form onSubmit={form.handleSubmit(signIn)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-xs text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              {...form.register('password')}
            />
            {form.formState.errors.password && (
              <p className="mt-1 text-xs text-red-600">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
