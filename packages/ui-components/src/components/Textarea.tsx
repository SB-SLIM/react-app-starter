import React from 'react'
import { clsx } from 'clsx'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={clsx(
        'flex min-h-[80px] w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm',
        'placeholder:text-gray-400 resize-y',
        'focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'
