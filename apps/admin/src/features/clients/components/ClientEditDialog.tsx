import { useEffect } from 'react'
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

interface ClientData {
  id: string
  name: string
  email: string | null
  phone: string | null
  notes: string | null
}

interface Props {
  client: ClientData | null
  onOpenChange: (open: boolean) => void
}

export function ClientEditDialog({ client, onOpenChange }: Props) {
  const utils = trpc.useUtils()
  const form = useZodForm(schema)

  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        email: client.email ?? undefined,
        phone: client.phone ?? undefined,
        notes: client.notes ?? undefined,
      })
    }
  }, [client, form])

  const update = trpc.clients.update.useMutation({
    onSuccess: async () => {
      await Promise.all([utils.clients.list.invalidate()])
      toast.success('Client updated')
      onOpenChange(false)
    },
    onError: (err) => toast.error(err.message),
  })

  if (!client) return null

  return (
    <Dialog open={!!client} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit((data) =>
            update.mutate({ id: client.id, ...data }),
          )}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Name *</Label>
            <Input id="edit-name" {...form.register('name')} />
            {form.formState.errors.name && (
              <p className="text-xs text-red-600">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-email">Email</Label>
            <Input id="edit-email" type="email" {...form.register('email')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input id="edit-phone" {...form.register('phone')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea id="edit-notes" rows={3} {...form.register('notes')} />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={update.isPending}>
              {update.isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
