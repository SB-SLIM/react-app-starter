import { createFileRoute, redirect } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { authClient } from '@/features/auth/api/authClient'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const session = await authClient.getSession()
    if (session) throw redirect({ to: '/' })
  },
  component: () => <LoginForm />,
})
