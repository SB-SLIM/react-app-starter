import { trpc } from '@/app/trpc'

/**
 * Clients list backed by `trpc.clients.list` + `trpc.clients.count`.
 * Fetches a generous page; the DataTable handles search/sort/pagination
 * client-side. (Server-side filtering is a later step.)
 */
export function useClients() {
  const list = trpc.clients.list.useQuery({ limit: 100, offset: 0 })
  const count = trpc.clients.count.useQuery()

  return {
    clients: list.data ?? [],
    total: count.data?.total ?? 0,
    isLoading: list.isPending,
    isError: list.isError,
    error: list.error,
  }
}
