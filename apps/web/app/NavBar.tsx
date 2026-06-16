'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@sb-codex/ui-components'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#stack', label: 'Stack' },
  {
    href: 'https://github.com/sb-slim/react-app-starter',
    label: 'GitHub',
    external: true,
  },
]

export function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <span className="text-base font-extrabold tracking-tight sm:text-lg">
          sb
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            -codex
          </span>
        </span>

        {/* Desktop links */}
        <div className="hidden items-center gap-6 sm:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" asChild>
            <a href="https://hub.slimbouchoucha.tn">Launch app →</a>
          </Button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-zinc-400 hover:bg-white/5 sm:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/5 bg-zinc-950 px-4 pb-4 sm:hidden">
          <div className="flex flex-col pt-2">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
