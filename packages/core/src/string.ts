export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function truncate(
  value: string,
  maxLength: number,
  suffix = '…',
): string {
  if (value.length <= maxLength) return value
  return value.slice(0, maxLength - suffix.length) + suffix
}

export function capitalize(value: string): string {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

export function initials(name: string, max = 2): string {
  return name
    .split(/\s+/)
    .slice(0, max)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')
}
