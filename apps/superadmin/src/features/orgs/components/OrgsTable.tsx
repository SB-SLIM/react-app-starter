import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { MoreHorizontal } from 'lucide-react'
import {
  Button,
  type ColumnDef,
  ConfirmDialog,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  toast,
} from '@sb-codex/ui-components'
import { trpc } from '@/app/trpc'
import { useOrgs } from '../hooks/useOrgs'

type Org = ReturnType<typeof useOrgs>['orgs'][number]

export function OrgsTable() {
  const { orgs, isLoading, isError, error } = useOrgs()
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  const [toDelete, setToDelete] = useState<Org | null>(null)

  const deleteOrg = trpc.superAdmin.orgs.delete.useMutation({
    onSuccess: async () => {
      await utils.superAdmin.orgs.list.invalidate()
      await utils.superAdmin.dashboard.stats.invalidate()
      toast.success('Organization deleted')
      setToDelete(null)
    },
    onError: (err: { message: string }) => toast.error(err.message),
  })

  const columns: ColumnDef<Org>[] = [
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
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800">
          {row.original.slug}
        </code>
      ),
    },
    {
      accessorKey: 'memberCount',
      header: 'Members',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      enableGlobalFilter: false,
      meta: { headerClassName: 'w-12' },
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Org actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onSelect={() =>
                  navigate({
                    to: '/orgs/$orgId',
                    params: { orgId: row.original.id },
                  })
                }
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                destructive
                onSelect={() => setToDelete(row.original)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  if (isError) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Failed to load organizations: {error?.message}
      </p>
    )
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={orgs}
        isLoading={isLoading}
        searchPlaceholder="Search organizations…"
        emptyMessage="No organizations yet."
      />
      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`Delete ${toDelete?.name ?? 'organization'}?`}
        description="This permanently removes the organization and all its data. This action cannot be undone."
        confirmLabel="Delete"
        loading={deleteOrg.isPending}
        onConfirm={() => {
          if (toDelete) deleteOrg.mutate({ id: toDelete.id })
        }}
      />
    </>
  )
}
