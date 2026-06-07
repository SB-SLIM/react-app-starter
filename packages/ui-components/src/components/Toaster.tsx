'use client'

import { Toaster as SonnerToaster } from 'sonner'

export type ToasterProps = React.ComponentProps<typeof SonnerToaster>

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            'rounded border border-gray-200 bg-white text-gray-900 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100',
          description: 'text-gray-500 dark:text-gray-400',
          actionButton: 'bg-primary-600 text-white',
          cancelButton:
            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
          error:
            'border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100',
          success:
            'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100',
        },
      }}
      {...props}
    />
  )
}

export { toast } from 'sonner'
