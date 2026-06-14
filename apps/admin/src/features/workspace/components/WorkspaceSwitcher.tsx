import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ChevronsUpDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@sb-codex/ui-components'
import type { Workspace } from '@sb-codex/auth/client'
import { authClient } from '@/features/auth/api/authClient'
import { trpc } from '@/app/trpc'

export function WorkspaceSwitcher({ currentSlug }: { currentSlug: string }) {
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])

  useEffect(() => {
    void authClient.listWorkspaces().then((res) => {
      if (res.data) setWorkspaces(res.data)
    })
  }, [])

  async function switchTo(slug: string) {
    if (slug === currentSlug) return
    localStorage.setItem('workspace-slug', slug)
    await utils.invalidate()
    await navigate({ to: '/dashboard' })
  }

  const currentWs = workspaces.find((w) => w.slug === currentSlug)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800">
        {currentWs?.name ?? currentSlug}
        <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onSelect={() => switchTo(ws.slug)}
            className={ws.slug === currentSlug ? 'font-medium' : ''}
          >
            {ws.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
