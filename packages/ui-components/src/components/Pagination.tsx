'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { clsx } from 'clsx'
import { Button } from './Button'

export type PaginationProps = {
  /** Current page, 1-based. */
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  className,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const canPrev = page > 1
  const canNext = page < pageCount

  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div
      className={clsx(
        'flex flex-wrap items-center justify-between gap-3 text-sm',
        className,
      )}
    >
      <p className="text-gray-500 dark:text-gray-400">
        {total === 0 ? (
          'No results'
        ) : (
          <>
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {from}–{to}
            </span>{' '}
            of {total}
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </Button>
        <span className="text-gray-500 dark:text-gray-400">
          Page {page} / {pageCount}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
