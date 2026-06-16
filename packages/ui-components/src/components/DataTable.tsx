'use client'

import * as React from 'react'
import {
  type ColumnDef,
  type RowData,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { clsx } from 'clsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './Table'
import { EmptyState } from './EmptyState'
import { Input } from './Input'
import { Skeleton } from './Skeleton'
import { Pagination } from './Pagination'

// Per-column styling hooks, set via `meta` on a column def.
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string
    headerClassName?: string
  }
}

export type { ColumnDef } from '@tanstack/react-table'
export { createColumnHelper } from '@tanstack/react-table'

export type DataTableProps<TData> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[]
  data: TData[]
  pageSize?: number
  enableGlobalFilter?: boolean
  searchPlaceholder?: string
  emptyMessage?: string
  isLoading?: boolean
  className?: string
}

export const DataTable = <TData,>({
  columns,
  data,
  pageSize = 10,
  enableGlobalFilter = true,
  searchPlaceholder = 'Search…',
  emptyMessage = 'No data available.',
  isLoading = false,
  className,
}: DataTableProps<TData>) => {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  const leafColumns = table.getAllLeafColumns()
  const { pageIndex, pageSize: currentPageSize } = table.getState().pagination
  const filteredCount = table.getFilteredRowModel().rows.length

  return (
    <div className={clsx('space-y-3', className)}>
      {enableGlobalFilter && (
        <div className="relative max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort()
                  const sorted = header.column.getIsSorted()
                  return (
                    <TableHead
                      key={header.id}
                      className={header.column.columnDef.meta?.headerClassName}
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="inline-flex min-h-[44px] items-center gap-1 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {sorted === 'asc' ? (
                            <ChevronUp className="h-3.5 w-3.5" />
                          ) : sorted === 'desc' ? (
                            <ChevronDown className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                          )}
                        </button>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: currentPageSize }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {leafColumns.map((col) => (
                    <TableCell key={col.id}>
                      <Skeleton className="h-4 w-3/4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={leafColumns.length}
                  className="py-12 text-center"
                >
                  <EmptyState title={emptyMessage} description="" />
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {table.getPageCount() > 1 && (
        <Pagination
          page={pageIndex + 1}
          pageSize={currentPageSize}
          total={filteredCount}
          onPageChange={(p) => table.setPageIndex(p - 1)}
        />
      )}
    </div>
  )
}
