import React from 'react'
import { clsx } from 'clsx'

export type CardProps = React.HTMLAttributes<HTMLDivElement>

export interface CardRootProps extends CardProps {
  shadow?: boolean
}

export const Card: React.FC<CardRootProps> = ({
  className,
  shadow = true,
  ...props
}) => (
  <div
    className={clsx(
      'rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
      shadow && 'shadow-sm',
      className,
    )}
    {...props}
  />
)

export const CardHeader: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={clsx('flex flex-col gap-1.5 p-6', className)} {...props} />
)

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  ...props
}) => (
  <h3
    className={clsx(
      'text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100',
      className,
    )}
    {...props}
  />
)

export const CardDescription: React.FC<
  React.HTMLAttributes<HTMLParagraphElement>
> = ({ className, ...props }) => (
  <p
    className={clsx('text-sm text-gray-500 dark:text-gray-400', className)}
    {...props}
  />
)

export const CardContent: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={clsx('p-6 pt-0', className)} {...props} />
)

export const CardFooter: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={clsx('flex items-center p-6 pt-0', className)} {...props} />
)

export const CardAction: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={clsx('flex items-center gap-2', className)} {...props} />
)
