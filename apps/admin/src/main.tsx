import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster, UIProvider } from '@sb-codex/ui-components'
import { router } from './app/router'
import { queryClient } from './app/queryClient'
import { trpc } from './app/trpc'
import { trpcClient } from './app/trpcClient'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UIProvider>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </trpc.Provider>
      <Toaster />
    </UIProvider>
  </StrictMode>,
)
