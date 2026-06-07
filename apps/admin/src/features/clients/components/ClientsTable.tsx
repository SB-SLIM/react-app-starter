import { useState } from 'react'
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
  Pagination,
  Spinner,
} from '@sb-codex/ui-components'
import { trpc } from '@/app/trpc'
import { useClients } from '../hooks/useClients'

type Client = ReturnType<typeof useClients>['clients'][number]

export function ClientsTable() {
  const { clients, total, isLoading, isError, error, page, pageSize, setPage } =
    useClients()
  const utils = trpc.useUtils()
  const [toDelete, setToDelete] = useState<Client | null>(null)

  const deleteClient = trpc.clients.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.clients.list.invalidate(),
        utils.clients.count.invalidate(),
      ])
      setToDelete(null)
    },
  })

  const columns: ColumnDef<Client>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (c) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {c.name}
        </span>
      ),
    },
    { key: 'email', header: 'Email', cell: (c) => c.email ?? '—' },
    { key: 'phone', header: 'Phone', cell: (c) => c.phone ?? '—' },
    {
      key: 'actions',
      header: '',
      headerClassName: 'w-12',
      cell: (c) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Client actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem disabled>Edit</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive onSelect={() => setToDelete(c)}>
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
        Failed to load clients: {error?.message}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center gap-2 py-12 text-sm text-gray-500">
          <Spinner size="sm" /> Loading clients…
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={clients}
          getRowKey={(c) => c.id}
          emptyMessage="No clients yet."
        />
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
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
