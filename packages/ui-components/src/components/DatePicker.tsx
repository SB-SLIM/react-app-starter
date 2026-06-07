'use client'

import ReactDatePicker from 'react-datepicker'
import { Calendar } from 'lucide-react'
import { clsx } from 'clsx'

export type DatePickerProps = {
  value?: Date | null
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  /** date-fns format string for the input (default 'MMM d, yyyy'). */
  dateFormat?: string
  /** Wrapper className. */
  className?: string
}

/**
 * Date picker built on react-datepicker, styled to match the design system.
 *
 * Consumers must import the base stylesheet once in their app:
 *   import 'react-datepicker/dist/react-datepicker.css'
 */
export const DatePicker = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  disabled = false,
  dateFormat = 'MMM d, yyyy',
  className,
}: DatePickerProps) => {
  return (
    <div className={clsx('relative', className)}>
      <Calendar className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <ReactDatePicker
        selected={value ?? null}
        onChange={(date: Date | null) => onChange?.(date ?? undefined)}
        dateFormat={dateFormat}
        placeholderText={placeholder}
        disabled={disabled}
        wrapperClassName="w-full"
        className={clsx(
          'h-10 w-full rounded border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm',
          'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-600',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100',
        )}
      />
    </div>
  )
}
