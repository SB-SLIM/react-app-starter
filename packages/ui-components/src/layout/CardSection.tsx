import React from 'react'
import { LayoutCard } from './LayoutCard'

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
  shadow,
  className,
}) => (
  <LayoutCard
    header={
      title ? (
        <h5 className="text-sm font-semibold leading-tight text-gray-900 dark:text-gray-100">
          {title}
        </h5>
      ) : undefined
    }
    action={actions}
    shadow={shadow}
    className={className}
  >
    {children}
  </LayoutCard>
)
