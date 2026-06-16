import React from 'react'
import { Card, CardHeader, CardContent, CardAction } from '../components/Card'

export interface LayoutCardProps {
  header?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
  shadow?: boolean
  className?: string
}

export const LayoutCard: React.FC<LayoutCardProps> = ({
  header,
  action,
  children,
  shadow = true,
  className,
}) => {
  const hasHeader = header !== undefined || action !== undefined

  return (
    <Card shadow={shadow} className={className}>
      {hasHeader && (
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {header}
            {action && <CardAction>{action}</CardAction>}
          </div>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  )
}
