import { createFileRoute, redirect } from '@tanstack/react-router'
import { Breadcrumb, PageHeader } from '@sb-codex/ui-components'
import { ClientsTable } from '@/features/clients'
import { authClient } from '@/features/auth/api/authClient'

export const Route = createFileRoute('/clients')({
  beforeLoad: async () => {
    const session = await authClient.getSession()
    if (!session) throw redirect({ to: '/sign-in' })
  },
  component: ClientsPage,
})

function ClientsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
      <Breadcrumb
        items={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Clients' },
        ]}
      />
      <PageHeader
        title="Clients"
        description="Workspace clients backed by the tRPC clients router."
      />
      <ClientsTable />
    </div>
  )
}
