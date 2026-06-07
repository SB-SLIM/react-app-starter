import React from 'react'
import { clsx } from 'clsx'

export type LandingHeaderProps = {
  logo: React.ReactNode
  nav?: React.ReactNode
  cta?: React.ReactNode
  className?: string
}

export function LandingHeader({
  logo,
  nav,
  cta,
  className,
}: LandingHeaderProps) {
  return (
    <header
      className={clsx(
        'sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md',
        'dark:border-gray-800 dark:bg-gray-950/80',
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <div className="shrink-0">{logo}</div>
          {nav && (
            <nav className="hidden md:flex items-center gap-6">{nav}</nav>
          )}
        </div>
        {cta && <div className="flex items-center gap-4">{cta}</div>}
      </div>
    </header>
  )
}
