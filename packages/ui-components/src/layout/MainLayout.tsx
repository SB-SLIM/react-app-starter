'use client'

import React, { useState } from 'react'
import { clsx } from 'clsx'
import { Menu } from 'lucide-react'
import { Sidebar, type SidebarProps } from './Sidebar'

export type MainLayoutProps = {
  sidebar: Omit<SidebarProps, 'collapsed' | 'onCollapse'>
  header?: React.ReactNode
  children: React.ReactNode
  defaultCollapsed?: boolean
}

export function MainLayout({
  sidebar,
  header,
  children,
  defaultCollapsed = false,
}: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile, drawer on sm, persistent on lg */}
      <div
        className={clsx(
          'fixed inset-y-0 left-0 z-40 flex lg:relative lg:z-auto',
          'transform transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <Sidebar
          {...sidebar}
          collapsed={collapsed}
          onCollapse={() => {
            setCollapsed((c) => !c)
            setMobileOpen(false)
          }}
        />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar with mobile menu toggle */}
        <div className="flex h-16 shrink-0 items-center border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5" />
          </button>
          {header}
        </div>

        {/* Desktop header slot */}
        {header && <div className="hidden lg:block">{header}</div>}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
