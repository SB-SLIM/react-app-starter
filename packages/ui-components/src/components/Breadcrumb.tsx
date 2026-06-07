'use client'

import React from 'react'
import { clsx } from 'clsx'
import { ChevronRight } from 'lucide-react'

export type BreadcrumbItem = {
  label: React.ReactNode
  href?: string
}

export type BreadcrumbProps = {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={clsx('flex items-center', className)}
    >
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300 dark:text-gray-600" />
              )}
              {isLast || !item.href ? (
                <span
                  className={clsx(
                    isLast
                      ? 'font-medium text-gray-900 dark:text-gray-100'
                      : 'hover:text-gray-700 dark:hover:text-gray-300',
                  )}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-gray-700 dark:hover:text-gray-300 hover:underline"
                >
                  {item.label}
                </a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
