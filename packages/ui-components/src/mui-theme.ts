// ─────────────────────────────────────────────────────────────────────────────
// Replace this file with your createTheme() config from your other project.
// Both light and dark variants are exported so UIProvider can switch between
// them when the user toggles the theme.
// ─────────────────────────────────────────────────────────────────────────────
import { createTheme } from '@mui/material/styles'

export const muiLightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

export const muiDarkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})
