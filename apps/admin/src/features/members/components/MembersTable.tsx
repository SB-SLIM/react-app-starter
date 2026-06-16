import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import {
  Button,
  type ColumnDef,
  ConfirmDialog,
  DataTable,
  toast,
} from '@sb-codex/ui-components'
import { usePermission } from '@sb-codex/acl/client'
import { trpc } from '@/app/trpc'
import { useMembers, useInvitations } from '../hooks/useMembers'
import { RoleSelect } from './RoleSelect'
import { InviteDialog } from './InviteDialog'

type Member = ReturnType<typeof useMembers>['members'][number]
type Invitation = ReturnType<typeof useInvitations>['invitations'][number]

export function MembersTable() {
  const { members, isLoading, isError } = useMembers()
  const { invitations } = useInvitations()
  const utils = trpc.useUtils()
  const [inviteOpen, setInviteOpen] = useState(false)
  const [toRemove, setToRemove] = useState<Member | null>(null)

  const canInvite = usePermission('members:invite')
  const canUpdate = usePermission('members:update')
  const canRemove = usePermission('members:remove')

  const updateRole = trpc.members.updateRole.useMutation({
    onSuccess: async () => {
      await utils.members.list.invalidate()
      toast.success('Role updated')
    },
    onError: (err) => toast.error(err.message),
  })

  const remove = trpc.members.remove.useMutation({
    onSuccess: async () => {
      await utils.members.list.invalidate()
      toast.success('Member removed')
      setToRemove(null)
    },
    onError: (err) => toast.error(err.message),
  })

  const cancelInvitation = trpc.members.cancelInvitation.useMutation({
    onSuccess: async () => {
      await utils.members.listInvitations.invalidate()
      toast.success('Invitation cancelled')
    },
    onError: (err) => toast.error(err.message),
  })

  const memberColumns: ColumnDef<Member>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {row.original.name}
        </span>
      ),
    },
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) =>
        canUpdate ? (
          <div className="w-full max-w-[144px]">
            <RoleSelect
              value={row.original.role}
              onChange={(role) =>
                updateRole.mutate({ userId: row.original.userId, role })
              }
              disabled={updateRole.isPending}
            />
          </div>
        ) : (
          <span className="capitalize text-sm text-gray-600 dark:text-gray-400">
            {row.original.role}
          </span>
        ),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      enableGlobalFilter: false,
      meta: { headerClassName: 'w-12' },
      cell: ({ row }) =>
        canRemove ? (
          <div className="text-right">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 dark:text-red-400"
              onClick={() => setToRemove(row.original)}
            >
              Remove
            </Button>
          </div>
        ) : null,
    },
  ]

  const invitationColumns: ColumnDef<Invitation>[] = [
    { accessorKey: 'email', header: 'Email' },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => (
        <span className="capitalize">{row.original.role ?? 'member'}</span>
      ),
    },
    {
      accessorKey: 'expiresAt',
      header: 'Expires',
      cell: ({ row }) => new Date(row.original.expiresAt).toLocaleDateString(),
    },
    {
      id: 'actions',
      header: '',
      enableSorting: false,
      enableGlobalFilter: false,
      meta: { headerClassName: 'w-12' },
      cell: ({ row }) =>
        canInvite ? (
          <div className="text-right">
            <Button
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700 dark:text-red-400"
              disabled={cancelInvitation.isPending}
              onClick={() =>
                cancelInvitation.mutate({ invitationId: row.original.id })
              }
            >
              Cancel
            </Button>
          </div>
        ) : null,
    },
  ]

  if (isError) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Failed to load members.
      </p>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
            Members ({members.length})
          </h2>
          {canInvite && (
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <UserPlus className="mr-1.5 h-4 w-4" />
              Invite member
            </Button>
          )}
        </div>
        <DataTable
          columns={memberColumns}
          data={members}
          isLoading={isLoading}
          searchPlaceholder="Search members…"
          emptyMessage="No members yet."
        />
      </div>

      {invitations.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
            Pending invitations ({invitations.length})
          </h2>
          <DataTable
            columns={invitationColumns}
            data={invitations}
            enableGlobalFilter={false}
            emptyMessage="No pending invitations."
          />
        </div>
      )}

      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <ConfirmDialog
        open={toRemove !== null}
        onOpenChange={(open) => !open && setToRemove(null)}
        title={`Remove ${toRemove?.name ?? 'member'}?`}
        description="This will remove them from your workspace. They will lose access immediately."
        confirmLabel="Remove"
        loading={remove.isPending}
        onConfirm={() => {
          if (toRemove) remove.mutate({ userId: toRemove.userId })
        }}
      />
    </div>
  )
}
