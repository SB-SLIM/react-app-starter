import { trpc } from '@/app/trpc'

export function useWorkspace() {
  const query = trpc.workspace.get.useQuery()
  return {
    workspace: query.data,
    isLoading: query.isPending,
    isError: query.isError,
  }
}
