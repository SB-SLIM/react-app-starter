'use client'

import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { clsx } from 'clsx'

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  default:
    'bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
  outline:
    'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
  ghost:
    'bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
  link: 'bg-transparent text-primary-600 underline-offset-4 hover:underline dark:text-primary-400',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 min-h-[32px] px-3 text-xs',
  md: 'h-10 min-h-[44px] px-4 text-sm',
  lg: 'h-11 min-h-[44px] px-6 text-base',
  icon: 'h-10 w-10 min-h-[44px] min-w-[44px] p-0',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'default', size = 'md', asChild = false, className, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref as never}
        className={clsx(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          variant !== 'link' && sizeStyles[size],
          className,
        )}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export default Button
