'use client'

import React, { useState } from 'react'
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table'
import { EmptyState } from './EmptyState'

export type ColumnDef<TRow> = {
  key: string
  header: React.ReactNode
  cell: (row: TRow) => React.ReactNode
  sortable?: boolean
  className?: string
  headerClassName?: string
}

export type SortDirection = 'asc' | 'desc'

export type SortState = {
  key: string
  direction: SortDirection
}

export type DataTableProps<TRow> = {
  columns: ColumnDef<TRow>[]
  data: TRow[]
  getRowKey: (row: TRow) => string | number
  onSortChange?: (sort: SortState | null) => void
  emptyMessage?: string
  className?: string
}

export function DataTable<TRow>({
  columns,
  data,
  getRowKey,
  onSortChange,
  emptyMessage = 'No data available.',
  className,
}: DataTableProps<TRow>) {
  const [sort, setSort] = useState<SortState | null>(null)

  function handleSort(key: string) {
    const next: SortState =
      sort?.key === key
        ? { key, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' }
    setSort(next)
    onSortChange?.(next)
  }

  return (
    <div className={className}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.headerClassName}>
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {col.header}
                    {sort?.key === col.key ? (
                      sort.direction === 'asc' ? (
                        <ChevronUp className="h-3.5 w-3.5" />
                      ) : (
                        <ChevronDown className="h-3.5 w-3.5" />
                      )
                    ) : (
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
                    )}
                  </button>
                ) : (
                  col.header
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-12 text-center">
                <EmptyState title={emptyMessage} description="" />
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={getRowKey(row)}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    {col.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
