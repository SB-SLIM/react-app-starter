import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { Button, toast } from '@sb-codex/ui-components'
import { trpc } from '@/app/trpc'
import { authClient } from '@/features/auth/api/authClient'

export const Route = createFileRoute('/invite/$invitationId')({
  beforeLoad: async ({ location }) => {
    const session = await authClient.getSession()
    if (!session)
      throw redirect({
        to: '/sign-in',
        search: { redirect: location.href },
      })
  },
  component: AcceptInvitePage,
})

function AcceptInvitePage() {
  const { invitationId } = Route.useParams()
  const navigate = useNavigate()

  const accept = trpc.members.acceptInvitation.useMutation({
    onSuccess: async (data) => {
      toast.success('You have joined the workspace!')
      await navigate({ to: '/dashboard' })
      window.location.reload()
    },
    onError: (err) => toast.error(err.message),
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800 text-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Workspace invitation
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          You've been invited to join a workspace. Click below to accept.
        </p>
        {accept.isError && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/20">
            {accept.error.message}
          </p>
        )}
        <Button
          className="w-full"
          disabled={accept.isPending || accept.isSuccess}
          onClick={() => accept.mutate({ invitationId })}
        >
          {accept.isPending ? 'Accepting…' : 'Accept invitation'}
        </Button>
      </div>
    </div>
  )
}
