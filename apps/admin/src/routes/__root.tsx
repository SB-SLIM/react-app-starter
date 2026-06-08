import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useNavigate,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { Button, useTheme } from '@sb-codex/ui-components'
import { Moon, Sun } from 'lucide-react'
import { AclProvider } from '@sb-codex/acl/client'
import { authClient } from '@/features/auth/api/authClient'
import { useMemberRole } from '@/features/auth/hooks/useMemberRole'
import { WorkspaceSwitcher } from '@/features/workspace/components/WorkspaceSwitcher'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  const { session } = authClient.useSession()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { role, permissions, isPending: rolePending } = useMemberRole()
  const isAdmin = role === 'owner' || role === 'admin'

  async function handleSignOut() {
    await authClient.signOut()
    localStorage.removeItem('workspace-slug')
    await navigate({ to: '/sign-in' })
  }

  return (
    <AclProvider role={role} permissions={permissions} isPending={rolePending}>
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 sm:py-4">
            <Link
              to="/"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              SaaS Starter
            </Link>
            <div className="flex flex-wrap items-center gap-3 text-sm sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={
                  theme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                }
                className="h-9 w-9"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              {session ? (
                <>
                  {(() => {
                    const slug = localStorage.getItem('workspace-slug')
                    return slug ? (
                      <WorkspaceSwitcher currentSlug={slug} />
                    ) : null
                  })()}
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    activeProps={{ className: 'text-primary-600 font-medium' }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/clients"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    activeProps={{ className: 'text-primary-600 font-medium' }}
                  >
                    Clients
                  </Link>
                  <Link
                    to="/showcase"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    activeProps={{ className: 'text-primary-600 font-medium' }}
                  >
                    Showcase
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/members"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      activeProps={{
                        className: 'text-primary-600 font-medium',
                      }}
                    >
                      Members
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/settings"
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      activeProps={{
                        className: 'text-primary-600 font-medium',
                      }}
                    >
                      Settings
                    </Link>
                  )}
                  <span className="hidden text-gray-400 sm:inline">|</span>
                  <span className="hidden text-gray-600 dark:text-gray-300 md:inline">
                    {session.user.email}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    activeProps={{ className: 'text-primary-600 font-medium' }}
                    activeOptions={{ exact: true }}
                  >
                    Sign up
                  </Link>
                  <Link
                    to="/sign-in"
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    activeProps={{ className: 'text-primary-600 font-medium' }}
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
        <main className="flex-1 bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
        <TanStackRouterDevtools position="bottom-right" />
      </div>
    </AclProvider>
  )
}
