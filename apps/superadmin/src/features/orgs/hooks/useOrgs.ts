import { trpc } from '@/app/trpc'

export function useOrgs() {
  const query = trpc.superAdmin.orgs.list.useQuery()
  return {
    orgs: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
  }
}

export function useOrg(id: string) {
  const query = trpc.superAdmin.orgs.get.useQuery({ id })
  return {
    org: query.data,
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
  }
}
