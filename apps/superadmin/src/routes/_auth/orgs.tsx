import { createFileRoute } from '@tanstack/react-router'
import { OrgsTable } from '@/features/orgs/components/OrgsTable'

export const Route = createFileRoute('/_auth/orgs')({
  component: OrgsPage,
})

function OrgsPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Organizations
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          All workspaces on the platform
        </p>
      </div>
      <OrgsTable />
    </div>
  )
}
