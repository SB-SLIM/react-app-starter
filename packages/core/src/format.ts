import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
} from 'date-fns'

type DateInput = Date | string | number

function toDate(value: DateInput): Date {
  if (value instanceof Date) return value
  if (typeof value === 'string') return parseISO(value)
  return new Date(value)
}

export function formatDate(value: DateInput, pattern = 'MMM d, yyyy'): string {
  return format(toDate(value), pattern)
}

export function formatDateTime(
  value: DateInput,
  pattern = 'MMM d, yyyy HH:mm',
): string {
  return format(toDate(value), pattern)
}

export function formatRelative(value: DateInput, addSuffix = true): string {
  const d = toDate(value)
  if (isToday(d)) return formatDistanceToNow(d, { addSuffix })
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'MMM d, yyyy')
}

export function formatCurrency(
  value: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {},
  locale = 'en-US',
): string {
  return new Intl.NumberFormat(locale, options).format(value)
}
