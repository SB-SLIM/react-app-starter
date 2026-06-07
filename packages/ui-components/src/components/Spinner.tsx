'use client'

import React from 'react'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'

export type SpinnerSize = 'sm' | 'md' | 'lg'

export type SpinnerProps = Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
  size?: SpinnerSize
  label?: string
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = 'md', label = 'Loading', className, ...props }, ref) => (
    <Loader2
      ref={ref}
      role="status"
      aria-label={label}
      className={clsx(
        'animate-spin text-gray-400 dark:text-gray-500',
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  ),
)
Spinner.displayName = 'Spinner'
