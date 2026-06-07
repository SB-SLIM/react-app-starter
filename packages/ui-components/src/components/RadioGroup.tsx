'use client'

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import { clsx } from 'clsx'
import React from 'react'

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={clsx('grid gap-2', className)}
    {...props}
  />
))
RadioGroup.displayName = 'RadioGroup'

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={clsx(
      'aspect-square h-4 w-4 rounded-full border border-gray-300 text-primary-600',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:border-primary-600 dark:border-gray-600 dark:data-[state=checked]:border-primary-500',
      className,
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <Circle className="h-2.5 w-2.5 fill-primary-600 text-primary-600 dark:fill-primary-500 dark:text-primary-500" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
))
RadioGroupItem.displayName = 'RadioGroupItem'
