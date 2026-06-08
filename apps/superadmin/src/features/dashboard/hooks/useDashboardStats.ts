import { trpc } from '@/app/trpc'

export function useDashboardStats() {
  const query = trpc.superAdmin.dashboard.stats.useQuery()
  return {
    stats: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
  }
}
