'use client'

import React from 'react'
import { clsx } from 'clsx'
import { X } from 'lucide-react'

export type SidebarItem = {
  label: string
  href: string
  icon?: React.ReactNode
  active?: boolean
}

export type SidebarSection = {
  title?: string
  items: SidebarItem[]
}

export type SidebarProps = {
  logo?: React.ReactNode
  sections: SidebarSection[]
  footer?: React.ReactNode
  collapsed?: boolean
  onCollapse?: () => void
  renderLink?: (item: SidebarItem, children: React.ReactNode) => React.ReactNode
}

export function Sidebar({
  logo,
  sections,
  footer,
  collapsed = false,
  onCollapse,
  renderLink,
}: SidebarProps) {
  const defaultLink = (item: SidebarItem, children: React.ReactNode) => (
    <a href={item.href}>{children}</a>
  )
  const link = renderLink ?? defaultLink

  return (
    <aside
      className={clsx(
        'flex h-full flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950',
        'transition-all duration-200',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
        {!collapsed && <div className="flex items-center gap-2">{logo}</div>}
        {onCollapse && (
          <button
            onClick={onCollapse}
            className="ml-auto flex min-h-[44px] min-w-[44px] items-center justify-center rounded text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
        {sections.map((section, i) => (
          <div key={i}>
            {section.title && !collapsed && (
              <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                {section.title}
              </p>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  {link(
                    item,
                    <span
                      className={clsx(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                        item.active
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
                        collapsed && 'justify-center px-2',
                      )}
                    >
                      {item.icon && (
                        <span className="shrink-0">{item.icon}</span>
                      )}
                      {!collapsed && <span>{item.label}</span>}
                    </span>,
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          {footer}
        </div>
      )}
    </aside>
  )
}
