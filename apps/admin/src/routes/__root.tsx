import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'

export interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-gray-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold">
            SaaS Starter
          </Link>
          <div className="flex gap-4 text-sm">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900"
              activeProps={{ className: 'text-brand-600 font-medium' }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-600 hover:text-gray-900"
              activeProps={{ className: 'text-brand-600 font-medium' }}
            >
              Dashboard
            </Link>
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
