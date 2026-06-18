'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '#features', label: 'Features' },
  { href: '#stack', label: 'Stack' },
  {
    href: 'https://github.com/sb-slim/react-app-starter',
    label: 'GitHub',
    external: true,
  },
]

export function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(9,9,11,0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <nav
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          paddingInline: 'var(--gutter)',
          height: 68,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
        }}
      >
        {/* Logomark + wordmark */}
        <a
          href="#top"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
          }}
        >
          <Image
            src="/logomark.svg"
            alt="sb-codex logomark"
            width={30}
            height={30}
          />
          <span
            style={{
              fontSize: '1.3rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
              lineHeight: 1,
            }}
          >
            sb
            <span
              style={{
                background: 'var(--gradient-brand)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
              }}
            >
              -codex
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }}
          className="hidden sm:flex"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
              style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-secondary)'
              }}
            >
              {l.label}
            </a>
          ))}

          <a
            href="https://hub.slimbouchoucha.tn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 36,
              padding: '0 0.875rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '-0.01em',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid transparent',
              color: 'var(--text-on-accent)',
              background: 'var(--gradient-brand-strong)',
              boxShadow: 'var(--glow-accent-sm)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition:
                'transform var(--dur-fast) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--glow-accent)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--glow-accent-sm)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            Launch app →
          </a>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          className="flex sm:hidden"
        >
          <a
            href="https://hub.slimbouchoucha.tn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 36,
              padding: '0 0.875rem',
              fontSize: '0.8125rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid transparent',
              color: 'var(--text-on-accent)',
              background: 'var(--gradient-brand-strong)',
              boxShadow: 'var(--glow-accent-sm)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Launch →
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 44,
              minWidth: 44,
              borderRadius: 'var(--radius-sm)',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg)',
            paddingInline: 'var(--gutter)',
            paddingBottom: 16,
          }}
          className="sm:hidden"
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', paddingTop: 8 }}
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                {...(l.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 44,
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-secondary)'
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
