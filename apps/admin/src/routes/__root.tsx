import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useNavigate,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { authClient } from '@/features/auth/api/authClient'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  const { session } = authClient.useSession()
  const navigate = useNavigate()

  async function handleSignOut() {
    await authClient.signOut()
    localStorage.removeItem('workspace-slug')
    await navigate({ to: '/sign-in' })
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold">
            SaaS Starter
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {session ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                  activeProps={{ className: 'text-primary-600 font-medium' }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/showcase"
                  className="text-gray-600 hover:text-gray-900"
                  activeProps={{ className: 'text-primary-600 font-medium' }}
                >
                  Showcase
                </Link>
                <span className="text-gray-400">|</span>
                <span className="text-gray-600">{session.user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-gray-900"
                  activeProps={{ className: 'text-primary-600 font-medium' }}
                  activeOptions={{ exact: true }}
                >
                  Sign up
                </Link>
                <Link
                  to="/sign-in"
                  className="text-gray-600 hover:text-gray-900"
                  activeProps={{ className: 'text-primary-600 font-medium' }}
                >
                  Sign in
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
