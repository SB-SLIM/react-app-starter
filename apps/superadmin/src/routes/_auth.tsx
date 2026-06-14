import { useState } from 'react'
import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Building2, LayoutDashboard, LogOut, Menu, Users } from 'lucide-react'
import { authClient } from '@/features/auth/api/authClient'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const session = await authClient.getSession()
    if (!session || !session.user.isSuperAdmin) throw redirect({ to: '/login' })
  },
  component: AuthLayout,
})

const navLinkBase =
  'flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
const navLinkActive =
  'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'

function AuthLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()

  async function handleSignOut() {
    await authClient.signOut()
    await navigate({ to: '/login' })
  }

  const navLinks = (
    <nav className="flex flex-col gap-1 p-2">
      <Link
        to="/"
        className={navLinkBase}
        activeProps={{ className: navLinkActive }}
        activeOptions={{ exact: true }}
        onClick={() => setSidebarOpen(false)}
      >
        <LayoutDashboard className="h-4 w-4" />
        Dashboard
      </Link>
      <Link
        to="/orgs"
        className={navLinkBase}
        activeProps={{ className: navLinkActive }}
        onClick={() => setSidebarOpen(false)}
      >
        <Building2 className="h-4 w-4" />
        Organizations
      </Link>
      <Link
        to="/users"
        className={navLinkBase}
        activeProps={{ className: navLinkActive }}
        onClick={() => setSidebarOpen(false)}
      >
        <Users className="h-4 w-4" />
        Users
      </Link>
    </nav>
  )

  return (
    <div className="flex min-h-dvh bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-56 shrink-0 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transform transition-transform duration-200 ease-in-out lg:relative lg:z-auto lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Platform Admin
          </p>
        </div>

        {navLinks}

        <div className="mt-auto border-t border-gray-200 p-2 dark:border-gray-800">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-900 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            Platform Admin
          </span>
        </div>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
