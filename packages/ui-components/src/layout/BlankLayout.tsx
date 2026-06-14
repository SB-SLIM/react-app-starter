import React from 'react'

export type BlankLayoutProps = {
  children: React.ReactNode
}

export function BlankLayout({ children }: BlankLayoutProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="w-full max-w-md px-4">{children}</div>
    </div>
  )
}
