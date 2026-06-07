import React from 'react'
import { clsx } from 'clsx'

export type HeaderProps = {
  left?: React.ReactNode
  center?: React.ReactNode
  right?: React.ReactNode
  className?: string
  sticky?: boolean
}

export function Header({
  left,
  center,
  right,
  className,
  sticky = true,
}: HeaderProps) {
  return (
    <header
      className={clsx(
        'flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4',
        'dark:border-gray-800 dark:bg-gray-950',
        sticky && 'sticky top-0 z-40',
        className,
      )}
    >
      <div className="flex items-center gap-3">{left}</div>
      {center && <div className="flex items-center">{center}</div>}
      <div className="flex items-center gap-3">{right}</div>
    </header>
  )
}
