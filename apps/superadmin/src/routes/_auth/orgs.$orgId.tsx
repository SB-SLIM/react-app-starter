import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeft } from 'lucide-react'
import { useOrg } from '@/features/orgs/hooks/useOrgs'

export const Route = createFileRoute('/_auth/orgs/$orgId')({
  component: OrgDetailPage,
})

function OrgDetailPage() {
  const { orgId } = Route.useParams()
  const { org, isLoading, isError } = useOrg(orgId)

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
        Loading…
      </div>
    )
  }

  if (isError || !org) {
    return (
      <div className="p-6 text-sm text-red-600 dark:text-red-400">
        Organization not found.
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Link
        to="/orgs"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Organizations
      </Link>

      <div>
        <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-gray-100">
          {org.name}
        </h1>
        <code className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {org.slug}
        </code>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Members ({org.memberCount})
          </h2>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {org.members.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No members.
            </p>
          ) : (
            org.members.map(
              (m: {
                id: string
                name: string
                email: string
                role: string
              }) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {m.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {m.email}
                    </p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {m.role}
                  </span>
                </div>
              ),
            )
          )}
        </div>
      </div>
    </div>
  )
}
