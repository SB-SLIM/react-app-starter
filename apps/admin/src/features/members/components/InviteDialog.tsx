import { z } from 'zod'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  toast,
} from '@sb-codex/ui-components'
import { useZodForm } from '@/shared/hooks/useZodForm'
import { trpc } from '@/app/trpc'
import { RoleSelect } from './RoleSelect'
import type { MemberRole } from '@sb-codex/acl/client'

const schema = z.object({
  email: z.email('Enter a valid email'),
  role: z.enum(['owner', 'admin', 'member']).default('member'),
})

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteDialog({ open, onOpenChange }: Props) {
  const utils = trpc.useUtils()
  const form = useZodForm(schema)

  const invite = trpc.members.invite.useMutation({
    onSuccess: async () => {
      await utils.members.listInvitations.invalidate()
      toast.success('Invitation sent')
      form.reset()
      onOpenChange(false)
    },
    onError: (err) => toast.error(err.message),
  })

  function handleOpenChange(open: boolean) {
    if (!open) form.reset()
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((data) => invite.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="colleague@example.com"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-600">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Role</Label>
            <RoleSelect
              value={(form.watch('role') as MemberRole) ?? 'member'}
              onChange={(role) => form.setValue('role', role)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={invite.isPending}>
              {invite.isPending ? 'Sending…' : 'Send invitation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
