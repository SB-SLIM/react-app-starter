import {
  createFileRoute,
  Outlet,
  redirect,
  useNavigate,
} from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { Building2, LayoutDashboard, LogOut, Users } from 'lucide-react'
import { authClient } from '@/features/auth/api/authClient'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const session = await authClient.getSession()
    if (!session || !session.user.isSuperAdmin) throw redirect({ to: '/login' })
  },
  component: AuthLayout,
})

function AuthLayout() {
  const navigate = useNavigate()

  async function handleSignOut() {
    await authClient.signOut()
    await navigate({ to: '/login' })
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <aside className="w-56 shrink-0 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Platform Admin
          </p>
        </div>
        <nav className="flex flex-col gap-1 p-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            activeProps={{
              className:
                'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
            }}
            activeOptions={{ exact: true }}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            to="/orgs"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            activeProps={{
              className:
                'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
            }}
          >
            <Building2 className="h-4 w-4" />
            Organizations
          </Link>
          <Link
            to="/users"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            activeProps={{
              className:
                'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400',
            }}
          >
            <Users className="h-4 w-4" />
            Users
          </Link>
        </nav>
        <div className="absolute bottom-0 w-56 border-t border-gray-200 p-2 dark:border-gray-800">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
