import React from 'react'
import { clsx } from 'clsx'
import { Card, CardContent } from './Card'

export type StatCardProps = {
  label: string
  value: string | number
  delta?: string
  deltaType?: 'increase' | 'decrease' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  label,
  value,
  delta,
  deltaType = 'neutral',
  icon,
  className,
}: StatCardProps) {
  const deltaColors = {
    increase: 'text-green-600 dark:text-green-400',
    decrease: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-500 dark:text-gray-400',
  }

  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          {icon && (
            <div className="rounded-lg bg-primary-50 p-2 text-primary-600 dark:bg-primary-950 dark:text-primary-400">
              {icon}
            </div>
          )}
        </div>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
          {value}
        </p>
        {delta && (
          <p className={clsx('mt-1 text-xs', deltaColors[deltaType])}>
            {delta}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
