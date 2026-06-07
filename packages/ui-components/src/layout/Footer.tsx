import React from 'react'
import { clsx } from 'clsx'

export type FooterLink = { label: string; href: string }
export type FooterColumn = { title: string; links: FooterLink[] }

export type FooterProps = {
  logo?: React.ReactNode
  tagline?: string
  columns?: FooterColumn[]
  bottom?: React.ReactNode
  className?: string
  renderLink?: (link: FooterLink) => React.ReactNode
}

export function Footer({
  logo,
  tagline,
  columns,
  bottom,
  className,
  renderLink,
}: FooterProps) {
  const defaultLink = (link: FooterLink) => (
    <a
      href={link.href}
      className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
    >
      {link.label}
    </a>
  )
  const link = renderLink ?? defaultLink

  return (
    <footer
      className={clsx(
        'border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top: logo + columns */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          {(logo || tagline) && (
            <div className="col-span-2 md:col-span-2">
              {logo}
              {tagline && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {tagline}
                </p>
              )}
            </div>
          )}

          {/* Link columns */}
          {columns?.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>{link(l)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        {bottom && (
          <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-800">
            {bottom}
          </div>
        )}
      </div>
    </footer>
  )
}
