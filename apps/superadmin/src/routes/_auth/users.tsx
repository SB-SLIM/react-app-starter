import { createFileRoute } from '@tanstack/react-router'
import { UsersTable } from '@/features/users/components/UsersTable'

export const Route = createFileRoute('/_auth/users')({
  component: UsersPage,
})

function UsersPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Users
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          All users registered on the platform
        </p>
      </div>
      <UsersTable />
    </div>
  )
}
