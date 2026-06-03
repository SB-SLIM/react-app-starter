import { createFileRoute, redirect } from '@tanstack/react-router'
import { trpc } from '@/app/trpc'
import { authClient } from '@/features/auth/api/authClient'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const session = await authClient.getSession()
    if (!session) throw redirect({ to: '/sign-in' })
  },
  component: DashboardPage,
})

function DashboardPage() {
  const client = trpc.clients.list.useQuery()
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Workspace overview will live here. Phase 4 wires tenant context,
        auth-guarded loaders, and real tRPC queries.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Members" value="—" />
        <StatCard label="Clients" value={String(client.data?.length || 0)} />
        <StatCard label="Active sessions" value="—" />
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Server health</h2>
        <p className="mt-1 text-sm text-gray-500">
          Live ping over tRPC — proves the admin ↔ Fastify ↔ tRPC pipeline is
          wired end-to-end.
        </p>
        <div className="mt-3">
          <HealthPing />
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function HealthPing() {
  const ping = trpc.health.ping.useQuery(undefined, {
    refetchInterval: 5_000,
  })

  if (ping.isPending) {
    return <span className="text-sm text-gray-500">Pinging server…</span>
  }
  if (ping.isError) {
    return (
      <span className="text-sm text-red-600">
        Server unreachable: {ping.error.message}
      </span>
    )
  }
  return (
    <span className="text-sm text-green-700">
      OK · server timestamp {ping.data.timestamp}
    </span>
  )
}
