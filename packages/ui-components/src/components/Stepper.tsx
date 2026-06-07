'use client'

import { Check } from 'lucide-react'
import { clsx } from 'clsx'

export type Step = {
  label: string
  description?: string
}

export type StepperProps = {
  steps: Step[]
  /** Zero-based index of the active step. */
  currentStep: number
  className?: string
}

export const Stepper = ({ steps, currentStep, className }: StepperProps) => {
  return (
    <ol className={clsx('flex w-full items-start', className)}>
      {steps.map((step, i) => {
        const isCompleted = i < currentStep
        const isActive = i === currentStep
        const isLast = i === steps.length - 1

        return (
          <li key={i} className={clsx('flex items-start', !isLast && 'flex-1')}>
            <div className="flex flex-col items-center">
              <div
                className={clsx(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                  isCompleted &&
                    'border-primary-600 bg-primary-600 text-white dark:border-primary-500 dark:bg-primary-500',
                  isActive &&
                    'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400',
                  !isCompleted &&
                    !isActive &&
                    'border-gray-300 text-gray-400 dark:border-gray-600 dark:text-gray-500',
                )}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <div className="mt-2 max-w-[8rem] text-center">
                <p
                  className={clsx(
                    'text-xs font-medium',
                    isActive || isCompleted
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-400 dark:text-gray-500',
                  )}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 text-[0.7rem] text-gray-400 dark:text-gray-500">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            {!isLast && (
              <div
                className={clsx(
                  'mt-4 h-0.5 flex-1 transition-colors',
                  isCompleted
                    ? 'bg-primary-600 dark:bg-primary-500'
                    : 'bg-gray-200 dark:bg-gray-700',
                )}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
