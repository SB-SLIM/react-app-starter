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
  Textarea,
  toast,
} from '@sb-codex/ui-components'
import { useZodForm } from '@/shared/hooks/useZodForm'
import { trpc } from '@/app/trpc'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email').nullish(),
  phone: z.string().nullish(),
  notes: z.string().nullish(),
})

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ClientCreateDialog({ open, onOpenChange }: Props) {
  const utils = trpc.useUtils()
  const form = useZodForm(schema)

  const create = trpc.clients.create.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.clients.list.invalidate(),
        utils.clients.count.invalidate(),
      ])
      toast.success('Client created')
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
          <DialogTitle>Add Client</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((data) => create.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Acme Corp"
              {...form.register('name')}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="contact@acme.com"
              {...form.register('email')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="+1 555 000 0000"
              {...form.register('phone')}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any notes about this client…"
              rows={3}
              {...form.register('notes')}
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
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? 'Creating…' : 'Create client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
