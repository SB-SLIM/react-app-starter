import { useState } from 'react'
import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useNavigate,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { Button, useTheme } from '@sb-codex/ui-components'
import { Menu, Moon, Sun, X } from 'lucide-react'
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

const linkClass =
  'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'
const activeLinkClass = 'text-primary-600 font-medium'
const mobileLinkClass =
  'flex min-h-[44px] items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100'

function RootLayout() {
  const { session } = authClient.useSession()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { role, permissions, isPending: rolePending } = useMemberRole()
  const isAdmin = role === 'owner' || role === 'admin'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  function closeMobileMenu() {
    setMobileMenuOpen(false)
  }

  async function handleSignOut() {
    await authClient.signOut()
    localStorage.removeItem('workspace-slug')
    closeMobileMenu()
    await navigate({ to: '/sign-in' })
  }

  const themeButton = (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
      }
      className="h-9 w-9"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  )

  return (
    <AclProvider role={role} permissions={permissions} isPending={rolePending}>
      <div className="flex min-h-dvh flex-col">
        <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <Link
              to="/"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100"
            >
              SaaS Starter
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-3 text-sm sm:flex sm:gap-4">
              {themeButton}
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
                    className={linkClass}
                    activeProps={{ className: activeLinkClass }}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/clients"
                    className={linkClass}
                    activeProps={{ className: activeLinkClass }}
                  >
                    Clients
                  </Link>
                  <Link
                    to="/showcase"
                    className={linkClass}
                    activeProps={{ className: activeLinkClass }}
                  >
                    Showcase
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/members"
                      className={linkClass}
                      activeProps={{ className: activeLinkClass }}
                    >
                      Members
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/settings"
                      className={linkClass}
                      activeProps={{ className: activeLinkClass }}
                    >
                      Settings
                    </Link>
                  )}
                  <span className="hidden text-gray-400 sm:inline">|</span>
                  <span className="hidden min-w-0 max-w-[160px] truncate text-gray-600 dark:text-gray-300 md:inline">
                    {session.user.email}
                  </span>
                  <button onClick={handleSignOut} className={linkClass}>
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/"
                    className={linkClass}
                    activeProps={{ className: activeLinkClass }}
                    activeOptions={{ exact: true }}
                  >
                    Sign up
                  </Link>
                  <Link
                    to="/sign-in"
                    className={linkClass}
                    activeProps={{ className: activeLinkClass }}
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 sm:hidden"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </nav>

          {/* Mobile menu panel */}
          {mobileMenuOpen && (
            <div className="border-t border-gray-200 bg-white px-4 pb-4 dark:border-gray-800 dark:bg-gray-900 sm:hidden">
              <div className="flex items-center gap-3 py-3">
                {themeButton}
                {session && (
                  <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {session.user.email}
                  </span>
                )}
              </div>
              <div className="flex flex-col text-sm">
                {session ? (
                  <>
                    {(() => {
                      const slug = localStorage.getItem('workspace-slug')
                      return slug ? (
                        <div className="mb-2">
                          <WorkspaceSwitcher currentSlug={slug} />
                        </div>
                      ) : null
                    })()}
                    <Link
                      to="/dashboard"
                      className={mobileLinkClass}
                      activeProps={{ className: activeLinkClass }}
                      onClick={closeMobileMenu}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/clients"
                      className={mobileLinkClass}
                      activeProps={{ className: activeLinkClass }}
                      onClick={closeMobileMenu}
                    >
                      Clients
                    </Link>
                    <Link
                      to="/showcase"
                      className={mobileLinkClass}
                      activeProps={{ className: activeLinkClass }}
                      onClick={closeMobileMenu}
                    >
                      Showcase
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/members"
                        className={mobileLinkClass}
                        activeProps={{ className: activeLinkClass }}
                        onClick={closeMobileMenu}
                      >
                        Members
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/settings"
                        className={mobileLinkClass}
                        activeProps={{ className: activeLinkClass }}
                        onClick={closeMobileMenu}
                      >
                        Settings
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex min-h-[44px] items-center text-left text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/"
                      className={mobileLinkClass}
                      activeProps={{ className: activeLinkClass }}
                      activeOptions={{ exact: true }}
                      onClick={closeMobileMenu}
                    >
                      Sign up
                    </Link>
                    <Link
                      to="/sign-in"
                      className={mobileLinkClass}
                      activeProps={{ className: activeLinkClass }}
                      onClick={closeMobileMenu}
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 bg-gray-50 dark:bg-gray-950">
          <Outlet />
        </main>
        <TanStackRouterDevtools position="bottom-right" />
      </div>
    </AclProvider>
  )
}
