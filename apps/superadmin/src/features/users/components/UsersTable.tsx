import { Shield } from 'lucide-react'
import { type ColumnDef, DataTable, toast } from '@sb-codex/ui-components'
import { PLATFORM_ROLES, type PlatformRole } from '@sb-codex/acl'
import { trpc } from '@/app/trpc'
import { useUsers } from '../hooks/useUsers'

type User = ReturnType<typeof useUsers>['users'][number]

const ROLE_LABELS: Record<PlatformRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  viewer: 'Viewer',
}

export function UsersTable() {
  const { users, isLoading, isError, error } = useUsers()
  const utils = trpc.useUtils()

  const setPlatformRole = trpc.superAdmin.users.setPlatformRole.useMutation({
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
      accessorKey: 'platformRole',
      header: 'Platform Role',
      cell: ({ row }) => {
        const role = row.original.platformRole as PlatformRole | null
        return (
          <div className="flex items-center gap-2">
            {role && (
              <Shield className="h-4 w-4 text-primary-600 dark:text-primary-400" />
            )}
            <select
              className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              value={role ?? ''}
              disabled={setPlatformRole.isPending}
              onChange={(e) =>
                setPlatformRole.mutate({
                  id: row.original.id,
                  platformRole: (e.target.value as PlatformRole) || null,
                })
              }
            >
              <option value="">— No access —</option>
              {PLATFORM_ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
          </div>
        )
      },
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
