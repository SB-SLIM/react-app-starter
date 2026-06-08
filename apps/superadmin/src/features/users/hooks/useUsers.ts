import { trpc } from '@/app/trpc'

export function useUsers() {
  const query = trpc.superAdmin.users.list.useQuery()
  return {
    users: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
  }
}

export function useUser(id: string) {
  const query = trpc.superAdmin.users.get.useQuery({ id })
  return {
    user: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
  }
}
