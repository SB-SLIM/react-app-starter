import React from 'react'
import { Card, CardHeader, CardContent, CardAction } from '../components/Card'

export interface CardSectionProps {
  title?: string
  actions?: React.ReactNode
  children: React.ReactNode
  shadow?: boolean
  className?: string
}

export const CardSection: React.FC<CardSectionProps> = ({
  title,
  actions,
  children,
  shadow = true,
  className,
}) => {
  const hasHeader = title !== undefined || actions !== undefined

  return (
    <Card shadow={shadow} className={className}>
      {hasHeader && (
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {title && (
              <h5 className="text-sm font-semibold leading-tight text-gray-900 dark:text-gray-100">
                {title}
              </h5>
            )}
            {actions && <CardAction>{actions}</CardAction>}
          </div>
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  )
}
