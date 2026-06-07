'use client'

// Read Tailwind CSS custom properties at runtime.
// These are set by theme.css (@theme) and overridable per-tenant.
export function getCssVar(name: string, fallback = '#6366f1'): string {
  if (typeof window === 'undefined') return fallback
  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  )
}

export function getPrimaryColor() {
  return getCssVar('--color-primary-600')
}

export function getPrimaryFaint() {
  return getCssVar('--color-primary-100')
}
