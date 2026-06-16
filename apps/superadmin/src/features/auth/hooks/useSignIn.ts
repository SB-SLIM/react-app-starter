import { useState, useTransition } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authClient } from '../api/authClient'

export function useSignIn() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function signIn(data: { email: string; password: string }) {
    setError(null)
    startTransition(async () => {
      const res = await authClient.signIn(data.email, data.password)
      if (res.error) {
        setError(res.error)
        return
      }
      if (!res.data.user.platformRole) {
        await authClient.signOut()
        setError('This account is not authorized for the admin console.')
        return
      }
      await navigate({ to: '/' })
    })
  }

  return { signIn, pending, error }
}
