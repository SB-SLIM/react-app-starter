import { Building2, Users, UserCheck } from 'lucide-react'
import { CardSection } from '@sb-codex/ui-components'
import { useDashboardStats } from '../hooks/useDashboardStats'

export function StatsCards() {
  const { stats, isLoading } = useDashboardStats()

  const cards = [
    { label: 'Organizations', value: stats?.orgs, icon: Building2 },
    { label: 'Users', value: stats?.users, icon: Users },
    { label: 'Members', value: stats?.members, icon: UserCheck },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map(({ label, value, icon: Icon }) => (
        <CardSection key={label}>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary-50 p-2 dark:bg-primary-900/20">
              <Icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {label}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {isLoading ? '—' : (value ?? 0)}
              </p>
            </div>
          </div>
        </CardSection>
      ))}
    </div>
  )
}
