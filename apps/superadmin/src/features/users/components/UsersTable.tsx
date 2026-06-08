import { Shield } from 'lucide-react'
import {
  Button,
  type ColumnDef,
  DataTable,
  toast,
} from '@sb-codex/ui-components'
import { trpc } from '@/app/trpc'
import { useUsers } from '../hooks/useUsers'

type User = ReturnType<typeof useUsers>['users'][number]

export function UsersTable() {
  const { users, isLoading, isError, error } = useUsers()
  const utils = trpc.useUtils()

  const setSuperAdmin = trpc.superAdmin.users.setSuperAdmin.useMutation({
    onSuccess: async () => {
      await utils.superAdmin.users.list.invalidate()
      toast.success('User updated')
    },
    onError: (err: { message: string }) => toast.error(err.message),
  })

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'isSuperAdmin',
      header: 'Super Admin',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.isSuperAdmin && (
            <Shield className="h-4 w-4 text-primary-600 dark:text-primary-400" />
          )}
          <Button
            variant="ghost"
            size="sm"
            disabled={setSuperAdmin.isPending}
            onClick={() =>
              setSuperAdmin.mutate({
                id: row.original.id,
                isSuperAdmin: !row.original.isSuperAdmin,
              })
            }
          >
            {row.original.isSuperAdmin ? 'Revoke' : 'Grant'}
          </Button>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Joined',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ]

  if (isError) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Failed to load users: {error?.message}
      </p>
    )
  }

  return (
    <DataTable
      columns={columns}
      data={users}
      isLoading={isLoading}
      searchPlaceholder="Search users…"
      emptyMessage="No users yet."
    />
  )
}
