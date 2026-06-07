'use client'

import React from 'react'
import { clsx } from 'clsx'
import { Calendar } from 'lucide-react'

export type DatePickerProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
>

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full">
      <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        ref={ref}
        type="date"
        className={clsx(
          'flex h-10 w-full rounded border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100',
          'dark:[color-scheme:dark]',
          className,
        )}
        {...props}
      />
    </div>
  ),
)
DatePicker.displayName = 'DatePicker'
