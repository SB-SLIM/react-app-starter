'use client'

import React from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { muiLightTheme, muiDarkTheme } from '../mui-theme'

export type Theme = 'light' | 'dark'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'sb-theme'

function getInitialTheme(defaultTheme: Theme): Theme {
  if (typeof window === 'undefined') return defaultTheme
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : defaultTheme
}

export type UIProviderProps = {
  children: React.ReactNode
  /** Theme used before any stored/system preference is resolved. */
  defaultTheme?: Theme
}

/**
 * App-agnostic UI provider. Owns purely presentational concerns (currently the
 * light/dark theme). Data/routing providers (tRPC, Query, Router) stay in each
 * app's composition root — they do not belong here.
 */
export const UIProvider: React.FC<UIProviderProps> = ({
  children,
  defaultTheme = 'light',
}) => {
  const [theme, setThemeState] = React.useState<Theme>(() =>
    getInitialTheme(defaultTheme),
  )

  React.useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () =>
        setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  const muiTheme = theme === 'dark' ? muiDarkTheme : muiLightTheme

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <UIProvider>')
  return ctx
}
