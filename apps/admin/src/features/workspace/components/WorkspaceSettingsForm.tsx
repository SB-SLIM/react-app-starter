import { useEffect } from 'react'
import { z } from 'zod'
import { Button, Input, Label, toast } from '@sb-codex/ui-components'
import { trpc } from '@/app/trpc'
import { useZodForm } from '@/shared/hooks/useZodForm'
import { useWorkspace } from '../hooks/useWorkspace'

const schema = z.object({ name: z.string().min(1, 'Name is required') })

export function WorkspaceSettingsForm() {
  const { workspace, isLoading } = useWorkspace()
  const utils = trpc.useUtils()

  const form = useZodForm(schema, { defaultValues: { name: '' } })

  useEffect(() => {
    if (workspace) form.reset({ name: workspace.name })
  }, [workspace, form])

  const update = trpc.workspace.update.useMutation({
    onSuccess: (data) => {
      toast.success('Workspace updated')
      utils.workspace.get.invalidate()
      form.reset({ name: data.name })
    },
    onError: (err) => toast.error(err.message),
  })

  if (isLoading) return <p className="text-sm text-gray-500">Loading…</p>

  return (
    <form
      onSubmit={form.handleSubmit((values) => update.mutate(values))}
      className="space-y-4 max-w-md"
    >
      <div className="space-y-1.5">
        <Label htmlFor="ws-name">Workspace name</Label>
        <Input
          id="ws-name"
          {...form.register('name')}
          aria-invalid={!!form.formState.errors.name}
        />
        {form.formState.errors.name && (
          <p className="text-xs text-red-500">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-1 text-sm text-gray-500">
        <p>
          <span className="font-medium text-gray-700 dark:text-gray-300">
            Slug:
          </span>{' '}
          {workspace?.slug}
        </p>
      </div>

      <Button type="submit" disabled={update.isPending}>
        {update.isPending ? 'Saving…' : 'Save changes'}
      </Button>
    </form>
  )
}
