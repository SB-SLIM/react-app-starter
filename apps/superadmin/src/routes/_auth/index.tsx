import { createFileRoute } from '@tanstack/react-router'
import { StatsCards } from '@/features/dashboard/components/StatsCards'

export const Route = createFileRoute('/_auth/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Platform-wide overview
        </p>
      </div>
      <StatsCards />
    </div>
  )
}
