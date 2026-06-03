import { createFileRoute } from '@tanstack/react-router'
import { SignupForm } from '@/features/auth/components/SignupForm'

export const Route = createFileRoute('/')({
  component: () => <SignupForm />,
})
