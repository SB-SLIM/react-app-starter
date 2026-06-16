import React from 'react'
import { clsx } from 'clsx'
import { Card, CardHeader, CardContent, CardAction } from '../components/Card'

export interface LayoutCardProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  action?: React.ReactNode
  shadow?: boolean
  flush?: boolean
  contentClassName?: string
}

export const LayoutCard: React.FC<LayoutCardProps> = ({
  header,
  action,
  children,
  shadow = true,
  flush = false,
  contentClassName,
  ...rest
}) => {
  const hasHeader = header !== undefined || action !== undefined

  return (
    <Card shadow={shadow} {...rest}>
      {hasHeader && (
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {header}
            {action && <CardAction>{action}</CardAction>}
          </div>
        </CardHeader>
      )}
      <CardContent
        className={clsx(
          !hasHeader && 'pt-6',
          flush && '!p-0',
          contentClassName,
        )}
      >
        {children}
      </CardContent>
    </Card>
  )
}
