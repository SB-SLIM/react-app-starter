import { createFileRoute } from '@tanstack/react-router'
import { Breadcrumb, PageHeader } from '@sb-codex/ui-components'
import { requireRole } from '@/shared/lib/roleGuard'

export const Route = createFileRoute('/members')({
  beforeLoad: requireRole(['owner', 'admin']),
  component: MembersPage,
})

function MembersPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Members' },
        ]}
      />
      <PageHeader
        title="Members"
        description="Manage workspace members and roles. Only owners and admins can access this page."
      />
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Member management coming soon.
      </p>
    </div>
  )
}
