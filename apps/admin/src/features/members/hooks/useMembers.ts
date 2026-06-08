import { trpc } from '@/app/trpc'

export function useMembers() {
  const query = trpc.members.list.useQuery()
  return {
    members: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
    error: query.error,
  }
}

export function useInvitations() {
  const query = trpc.members.listInvitations.useQuery()
  return {
    invitations: query.data ?? [],
    isLoading: query.isPending,
    isError: query.isError,
  }
}
