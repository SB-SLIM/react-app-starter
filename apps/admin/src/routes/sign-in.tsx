import { createFileRoute } from '@tanstack/react-router'
import { LoginForm } from '@/features/auth/components/LoginForm'

export const Route = createFileRoute('/sign-in')({
  component: () => <LoginForm />,
})
