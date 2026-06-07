'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { clsx } from 'clsx'
import React from 'react'

export type LabelProps = React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
>

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={clsx(
      'text-sm font-medium leading-none text-gray-700 dark:text-gray-300',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className,
    )}
    {...props}
  />
))
Label.displayName = 'Label'
