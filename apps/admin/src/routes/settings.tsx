import { createFileRoute } from '@tanstack/react-router'
import { Breadcrumb, PageHeader } from '@sb-codex/ui-components'
import { WorkspaceSettingsForm } from '@/features/workspace/components/WorkspaceSettingsForm'
import { requireRole } from '@/shared/lib/roleGuard'

export const Route = createFileRoute('/settings')({
  beforeLoad: requireRole(['owner', 'admin']),
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Settings' },
        ]}
      />
      <PageHeader
        title="Workspace Settings"
        description="Manage your workspace name and details."
      />
      <WorkspaceSettingsForm />
    </div>
  )
}
