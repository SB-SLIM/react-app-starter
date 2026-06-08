import { useState } from 'react'
import { Plus, MoreHorizontal } from 'lucide-react'
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
import { AccessGuard } from '@sb-codex/acl/client'
import { trpc } from '@/app/trpc'
import { useClients } from '../hooks/useClients'
import { ClientCreateDialog } from './ClientCreateDialog'
import { ClientEditDialog } from './ClientEditDialog'

type Client = ReturnType<typeof useClients>['clients'][number]

export function ClientsTable() {
  const { clients, total, isLoading, isError, error } = useClients()
  const utils = trpc.useUtils()
  const [createOpen, setCreateOpen] = useState(false)
  const [toEdit, setToEdit] = useState<Client | null>(null)
  const [toDelete, setToDelete] = useState<Client | null>(null)

  const deleteClient = trpc.clients.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.clients.list.invalidate(),
        utils.clients.count.invalidate(),
      ])
      toast.success('Client deleted')
      setToDelete(null)
    },
    onError: (err) => toast.error(err.message),
  })

  const columns: ColumnDef<Client>[] = [
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
      cell: ({ row }) => row.original.email ?? '—',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => row.original.phone ?? '—',
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      enableGlobalFilter: false,
      meta: { headerClassName: 'w-12' },
      cell: ({ row }) => (
        <div className="text-right">
          <AccessGuard roles={['owner', 'admin']}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Client actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => setToEdit(row.original)}>
                  Edit
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
          </AccessGuard>
        </div>
      ),
    },
  ]

  if (isError) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Failed to load clients: {error?.message}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {total} total {total === 1 ? 'client' : 'clients'}
        </p>
        <AccessGuard roles={['owner', 'admin']}>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add client
          </Button>
        </AccessGuard>
      </div>
      <DataTable
        columns={columns}
        data={clients}
        isLoading={isLoading}
        searchPlaceholder="Search clients…"
        emptyMessage="No clients yet."
      />

      <ClientCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
      <ClientEditDialog
        client={toEdit}
        onOpenChange={(open) => !open && setToEdit(null)}
      />
      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title={`Delete ${toDelete?.name ?? 'client'}?`}
        description="This permanently removes the client from your workspace. This action cannot be undone."
        confirmLabel="Delete"
        loading={deleteClient.isPending}
        onConfirm={() => {
          if (toDelete) deleteClient.mutate({ id: toDelete.id })
        }}
      />
    </div>
  )
}
