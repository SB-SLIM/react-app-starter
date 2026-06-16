import React from 'react'
import { LayoutCard } from './LayoutCard'

export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  actions?: React.ReactNode
  shadow?: boolean
  flush?: boolean
  contentClassName?: string
}

export const CardSection: React.FC<CardSectionProps> = ({
  title,
  description,
  actions,
  shadow,
  flush,
  contentClassName,
  children,
  ...rest
}) => (
  <LayoutCard
    header={
      title || description ? (
        <div className="flex flex-col gap-0.5">
          {title && (
            <h5 className="text-sm font-semibold leading-tight text-gray-900 dark:text-gray-100">
              {title}
            </h5>
          )}
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      ) : undefined
    }
    action={actions}
    shadow={shadow}
    flush={flush}
    contentClassName={contentClassName}
    {...rest}
  >
    {children}
  </LayoutCard>
)
