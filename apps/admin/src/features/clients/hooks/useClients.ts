import { useState } from 'react'
import { trpc } from '@/app/trpc'

const PAGE_SIZE = 10

/**
 * Paginated clients list backed by `trpc.clients.list` + `trpc.clients.count`.
 * Exposes 1-based `page` state that drives the `offset` query input.
 */
export function useClients() {
  const [page, setPage] = useState(1)
  const offset = (page - 1) * PAGE_SIZE

  const list = trpc.clients.list.useQuery({ limit: PAGE_SIZE, offset })
  const count = trpc.clients.count.useQuery()

  return {
    clients: list.data ?? [],
    total: count.data?.total ?? 0,
    isLoading: list.isPending,
    isError: list.isError,
    error: list.error,
    page,
    pageSize: PAGE_SIZE,
    setPage,
  }
}
