import React from 'react'
import { clsx } from 'clsx'

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

export const Skeleton: React.FC<SkeletonProps> = ({ className, ...props }) => (
  <div
    className={clsx(
      'animate-pulse rounded bg-gray-200 dark:bg-gray-700',
      className,
    )}
    {...props}
  />
)
