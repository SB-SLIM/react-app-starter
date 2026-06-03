import { useState, useTransition } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authClient } from '../api/authClient'

export function useSignUp() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function signUp(data: { name: string; email: string; password: string }) {
    setError(null)
    startTransition(async () => {
      const signUpRes = await authClient.signUp(
        data.name,
        data.email,
        data.password,
      )
      if (signUpRes.error) {
        setError(signUpRes.error)
        return
      }

      const wsRes = await authClient.createWorkspace(data.name)
      if (wsRes.error) {
        setError(wsRes.error)
        return
      }

      if (wsRes.data) localStorage.setItem('workspace-slug', wsRes.data.slug)
      await navigate({ to: '/dashboard' })
    })
  }

  return { signUp, pending, error }
}
