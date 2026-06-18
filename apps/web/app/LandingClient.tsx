'use client'

import Image from 'next/image'
import { NavBar } from './NavBar'
import { Reveal } from './Reveal'

// ── Primitive components ───────────────────────────────────

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: 'var(--gradient-brand)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
      }}
    >
      {children}
    </span>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.55rem',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: 'var(--tracking-label)',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
      }}
    >
      <span
        style={{
          width: 18,
          height: 2,
          borderRadius: 2,
          background: 'var(--gradient-brand)',
          flexShrink: 0,
        }}
      />
      {children}
    </span>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '0.35rem',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'clamp(2rem, 1.4rem + 2.4vw, 2.85rem)',
          fontWeight: 900,
          letterSpacing: 'var(--tracking-tighter)',
          lineHeight: 1,
          background: 'var(--gradient-brand)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          letterSpacing: '0.01em',
        }}
      >
        {label}
      </span>
    </div>
  )
}

interface TerminalLine {
  type: 'command' | 'success' | 'output' | 'comment' | 'error'
  text: string
}

function Terminal({
  title = 'bash — my-saas',
  lines = [],
  cursor = true,
  style,
}: {
  title?: string
  lines?: TerminalLine[]
  cursor?: boolean
  style?: React.CSSProperties
}) {
  const dot = (color: string) => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
    flexShrink: 0,
  })

  const renderLine = (line: TerminalLine, i: number) => {
    const rowBase: React.CSSProperties = {
      display: 'flex',
      gap: '0.6rem',
      alignItems: 'flex-start',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.875rem',
      lineHeight: 1.7,
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    }
    if (line.type === 'command') {
      return (
        <div key={i} style={rowBase}>
          <span style={{ color: 'var(--accent-terminal)', userSelect: 'none' }}>
            $
          </span>
          <span style={{ color: 'var(--text-primary)' }}>{line.text}</span>
        </div>
      )
    }
    if (line.type === 'success') {
      return (
        <div key={i} style={rowBase}>
          <span style={{ color: 'var(--accent-success)', userSelect: 'none' }}>
            ✓
          </span>
          <span style={{ color: 'var(--zinc-300)' }}>{line.text}</span>
        </div>
      )
    }
    if (line.type === 'error') {
      return (
        <div key={i} style={rowBase}>
          <span style={{ color: 'var(--accent-danger)', userSelect: 'none' }}>
            ✕
          </span>
          <span style={{ color: 'var(--zinc-300)' }}>{line.text}</span>
        </div>
      )
    }
    if (line.type === 'comment') {
      return (
        <div key={i} style={{ ...rowBase, color: 'var(--text-faint)' }}>
          # {line.text}
        </div>
      )
    }
    return (
      <div key={i} style={{ ...rowBase, color: 'var(--text-muted)' }}>
        {line.text}
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface-code)',
        border: '1px solid var(--border-card)',
        boxShadow: 'var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.06)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.55rem',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(255,255,255,0.015)',
        }}
      >
        <span style={dot('#ff5f57')} />
        <span style={dot('#febc2e')} />
        <span style={dot('#28c840')} />
        <span
          style={{
            marginLeft: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-faint)',
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </span>
      </div>
      {/* Body */}
      <div style={{ padding: '1.15rem 1.25rem 1.35rem' }}>
        {lines.map(renderLine)}
        {cursor && (
          <>
            <span
              style={{
                display: 'inline-block',
                width: 9,
                height: 17,
                marginTop: 4,
                background: 'var(--accent-terminal)',
                verticalAlign: 'text-bottom',
                animation: 'sbxBlink 1.05s steps(1) infinite',
              }}
            />
          </>
        )}
      </div>
    </div>
  )
}

interface CardProps {
  icon?: React.ReactNode
  title?: React.ReactNode
  children?: React.ReactNode
  interactive?: boolean
  accent?: 'indigo' | 'emerald' | 'cyan'
  style?: React.CSSProperties
}

function Card({
  icon,
  title,
  children,
  interactive = true,
  accent = 'indigo',
  style,
}: CardProps) {
  const glow =
    accent === 'emerald'
      ? 'var(--glow-emerald)'
      : accent === 'cyan'
        ? '0 8px 30px rgba(34,211,238,0.16)'
        : 'var(--glow-accent-sm)'
  const ring =
    accent === 'emerald'
      ? 'rgba(52,211,153,0.40)'
      : accent === 'cyan'
        ? 'rgba(34,211,238,0.40)'
        : 'var(--border-accent)'

  return (
    <div
      onMouseEnter={
        interactive
          ? (e) => {
              e.currentTarget.style.background = 'var(--surface-card-hover)'
              e.currentTarget.style.borderColor = ring
              e.currentTarget.style.boxShadow = glow
              e.currentTarget.style.transform = 'translateY(-2px)'
            }
          : undefined
      }
      onMouseLeave={
        interactive
          ? (e) => {
              e.currentTarget.style.background = 'var(--surface-card)'
              e.currentTarget.style.borderColor = 'var(--border-card)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'none'
            }
          : undefined
      }
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        padding: '1.5rem',
        background: 'var(--surface-card)',
        border: '1px solid var(--border-card)',
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(var(--blur-glass))',
        WebkitBackdropFilter: 'blur(var(--blur-glass))',
        transition:
          'transform var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
        ...style,
      }}
    >
      {icon && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-inset)',
            border: '1px solid var(--border-card)',
            fontSize: '1.35rem',
          }}
        >
          {icon}
        </div>
      )}
      {title && (
        <h3
          style={{
            fontSize: '1.0625rem',
            fontWeight: 700,
            letterSpacing: 'var(--tracking-tight)',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h3>
      )}
      {children && (
        <div
          style={{
            fontSize: '0.9375rem',
            lineHeight: 'var(--leading-relaxed)',
            color: 'var(--text-secondary)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function LandingButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  style,
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  style?: React.CSSProperties
}) {
  const sizes = {
    sm: {
      fontSize: '0.8125rem',
      padding: '0 0.875rem',
      height: 36,
      borderRadius: 'var(--radius-sm)',
    },
    md: {
      fontSize: '0.9375rem',
      padding: '0 1.125rem',
      height: 44,
      borderRadius: 'var(--radius-md)',
    },
    lg: {
      fontSize: '1.0625rem',
      padding: '0 1.5rem',
      height: 54,
      borderRadius: 'var(--radius-md)',
    },
  }
  const s = sizes[size]

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      color: 'var(--text-on-accent)',
      background: 'var(--gradient-brand-strong)',
      boxShadow: 'var(--glow-accent-sm)',
      borderColor: 'transparent',
    },
    secondary: {
      color: 'var(--text-primary)',
      background: 'var(--surface-card-hover)',
      borderColor: 'var(--border-card)',
      backdropFilter: 'blur(var(--blur-glass))',
    },
    outline: {
      color: 'var(--text-primary)',
      background: 'transparent',
      borderColor: 'var(--border-strong)',
    },
    ghost: {
      color: 'var(--text-secondary)',
      background: 'transparent',
      borderColor: 'transparent',
    },
  }

  const hoverHandlers = {
    primary: {
      enter: (el: HTMLElement) => {
        el.style.boxShadow = 'var(--glow-accent)'
        el.style.transform = 'translateY(-1px)'
      },
      leave: (el: HTMLElement) => {
        el.style.boxShadow = 'var(--glow-accent-sm)'
        el.style.transform = 'none'
      },
    },
    secondary: {
      enter: (el: HTMLElement) => {
        el.style.background = 'rgba(255,255,255,0.07)'
        el.style.borderColor = 'var(--border-strong)'
      },
      leave: (el: HTMLElement) => {
        el.style.background = 'var(--surface-card-hover)'
        el.style.borderColor = 'var(--border-card)'
      },
    },
    outline: {
      enter: (el: HTMLElement) => {
        el.style.borderColor = 'var(--border-accent)'
        el.style.background = 'var(--surface-card)'
      },
      leave: (el: HTMLElement) => {
        el.style.borderColor = 'var(--border-strong)'
        el.style.background = 'transparent'
      },
    },
    ghost: {
      enter: (el: HTMLElement) => {
        el.style.color = 'var(--text-primary)'
        el.style.background = 'var(--surface-card)'
      },
      leave: (el: HTMLElement) => {
        el.style.color = 'var(--text-secondary)'
        el.style.background = 'transparent'
      },
    },
  }

  const h = hoverHandlers[variant]

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: s.height,
    padding: s.padding,
    fontSize: s.fontSize,
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1,
    borderRadius: s.borderRadius,
    border: '1px solid transparent',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    transition:
      'transform var(--dur-fast) var(--ease-out), background var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)',
    ...variantStyles[variant],
    ...style,
  }

  return (
    <a
      href={href ?? '#'}
      style={baseStyle}
      onMouseEnter={(e) => h.enter(e.currentTarget)}
      onMouseLeave={(e) => h.leave(e.currentTarget)}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(0.985)'
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform =
          variant === 'primary' ? 'translateY(-1px)' : 'none'
      }}
    >
      {children}
    </a>
  )
}

// ── Data ──────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '🔐',
    title: 'Auth out of the box',
    body: 'Email/password + Google OAuth via better-auth — sessions, tokens and guards already wired.',
    accent: 'indigo' as const,
  },
  {
    icon: '🏢',
    title: 'Multi-tenant by design',
    body: 'Row-level security at the DB layer. Every query is scoped to a tenant automatically.',
    accent: 'indigo' as const,
  },
  {
    icon: '⚡',
    title: 'End-to-end type safety',
    body: 'tRPC v11 + Zod. Change a server type and TypeScript catches it on the client instantly.',
    accent: 'emerald' as const,
  },
  {
    icon: '🚀',
    title: 'CI/CD on day one',
    body: 'GitHub Actions → GHCR → VPS. Push to main and it ships, no pipeline to assemble.',
    accent: 'cyan' as const,
  },
]

const STACK = [
  {
    label: 'Frontend',
    items: ['React 19', 'TanStack Router', 'Tailwind v4', 'Radix UI'],
  },
  {
    label: 'Backend',
    items: ['Fastify 5', 'tRPC v11', 'Drizzle ORM', 'better-auth'],
  },
  {
    label: 'Data & Jobs',
    items: ['PostgreSQL', 'Valkey (Redis)', 'BullMQ', 'Meilisearch'],
  },
  {
    label: 'Infra',
    items: ['Docker Compose', 'Traefik v3', 'GitHub Actions', 'Turborepo'],
  },
]

const STATS = [
  { value: '12+', label: 'npm plugins' },
  { value: '100%', label: 'TypeScript' },
  { value: '1', label: 'command to start' },
  { value: '0', label: 'vendor lock-in' },
]

// ── Sections ──────────────────────────────────────────────

function Hero() {
  return (
    <header
      id="top"
      style={{
        position: 'relative',
        paddingTop: 'clamp(3.5rem, 7vw, 6rem)',
        paddingBottom: 'clamp(3rem, 6vw, 5rem)',
      }}
    >
      {/* Glow blobs */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 620,
          height: 620,
          top: -220,
          left: '50%',
          transform: 'translateX(-55%)',
          borderRadius: '50%',
          background: 'var(--glow-indigo)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 460,
          height: 460,
          top: -120,
          right: '6%',
          borderRadius: '50%',
          background: 'var(--glow-violet)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          paddingInline: 'var(--gutter)',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Badge */}
        <Reveal>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              height: 30,
              padding: '0 0.75rem',
              fontSize: '0.8125rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
              color: 'var(--emerald-300)',
              background: 'var(--surface-card-hover)',
              border: '1px solid var(--border-card)',
              borderRadius: 'var(--radius-pill)',
              backdropFilter: 'blur(var(--blur-glass))',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                position: 'relative',
                display: 'inline-flex',
                width: 7,
                height: 7,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'var(--emerald-400)',
                  opacity: 0.65,
                  animation: 'sbxPulse 2s var(--ease-out) infinite',
                }}
              />
              <span
                style={{
                  position: 'relative',
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--emerald-400)',
                }}
              />
            </span>
            Open-source · MIT License
          </span>
        </Reveal>

        {/* H1 */}
        <Reveal delay={60}>
          <h1
            style={{
              fontSize: 'var(--text-display)',
              fontWeight: 900,
              letterSpacing: 'var(--tracking-tighter)',
              lineHeight: 1.04,
              marginTop: 24,
              maxWidth: '16ch',
              textWrap: 'balance',
              color: 'var(--text-primary)',
            }}
          >
            The SaaS starter kit that ships{' '}
            <GradientText>everything.</GradientText>
          </h1>
        </Reveal>

        {/* Subhead */}
        <Reveal delay={120}>
          <p
            style={{
              marginTop: 22,
              fontSize: 'clamp(1.05rem, 0.95rem + 0.6vw, 1.3rem)',
              color: 'var(--text-secondary)',
              maxWidth: '60ch',
              lineHeight: 1.6,
            }}
          >
            Auth, multi-tenant API, background jobs, a full design system, and
            CI/CD — wired together and ready on day one.
          </p>
        </Reveal>

        {/* CTAs */}
        <Reveal delay={180}>
          <div
            style={{
              display: 'flex',
              gap: 14,
              marginTop: 30,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <LandingButton
              href="https://github.com/sb-slim/react-app-starter"
              size="lg"
            >
              Get started free →
            </LandingButton>
            <LandingButton
              href="https://hub.slimbouchoucha.tn"
              variant="secondary"
              size="lg"
            >
              View live demo
            </LandingButton>
          </div>
        </Reveal>

        {/* Terminal */}
        <Reveal
          delay={240}
          className="w-full"
          style={{ maxWidth: 720, marginTop: 48 }}
        >
          <Terminal
            title="zsh — ~/projects"
            lines={[
              {
                type: 'command',
                text: 'pnpm create @sb-codex/sb-app@latest my-saas',
              },
              { type: 'success', text: 'Created project in ./my-saas' },
              { type: 'success', text: 'Installed 12 @sb-codex plugins' },
              { type: 'success', text: 'Ready — run pnpm dev' },
            ]}
          />
        </Reveal>
      </div>
    </header>
  )
}

function StatsBar() {
  return (
    <section
      style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        paddingInline: 'var(--gutter)',
        paddingBottom: 'var(--section-y)',
      }}
    >
      <Reveal>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-card)',
            backdropFilter: 'blur(var(--blur-glass))',
            overflow: 'hidden',
          }}
        >
          {STATS.map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: '28px 0',
                borderLeft: i > 0 ? '1px solid var(--border-subtle)' : 'none',
              }}
            >
              <Stat value={s.value} label={s.label} />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function Features() {
  return (
    <section
      id="features"
      style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        paddingInline: 'var(--gutter)',
        paddingBottom: 'var(--section-y)',
      }}
    >
      <Reveal>
        <div
          style={{
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            marginBottom: 48,
          }}
        >
          <SectionLabel>What&apos;s included</SectionLabel>
          <h2
            style={{
              fontSize: 'var(--text-h2)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}
          >
            Everything you need.{' '}
            <GradientText>Nothing you don&apos;t.</GradientText>
          </h2>
        </div>
      </Reveal>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
        }}
      >
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 70}>
            <Card
              icon={f.icon}
              title={f.title}
              accent={f.accent}
              style={{ height: '100%' }}
            >
              {f.body}
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Stack() {
  return (
    <section
      id="stack"
      style={{
        position: 'relative',
        paddingBlock: 'var(--section-y)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      {/* Violet glow blob */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          width: 520,
          height: 520,
          bottom: -200,
          left: '8%',
          borderRadius: '50%',
          background: 'var(--glow-violet)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          paddingInline: 'var(--gutter)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Reveal>
          <div
            style={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              marginBottom: 48,
            }}
          >
            <SectionLabel>Under the hood</SectionLabel>
            <h2
              style={{
                fontSize: 'var(--text-h2)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
              }}
            >
              Modern defaults. <GradientText>No lock-in.</GradientText>
            </h2>
          </div>
        </Reveal>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
          }}
        >
          {STACK.map((col, i) => (
            <Reveal key={col.label} delay={i * 70}>
              <Card interactive={false} style={{ height: '100%', gap: 18 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}
                >
                  {col.label}
                </span>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                >
                  {col.items.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: '0.98rem',
                        color: 'var(--text-primary)',
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          background: 'var(--accent)',
                          flexShrink: 0,
                        }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section
      id="start"
      style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        paddingInline: 'var(--gutter)',
        paddingBottom: 'var(--section-y)',
      }}
    >
      <Reveal>
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--radius-2xl)',
            border: '1px solid var(--border-card)',
            background: 'var(--surface-card)',
            backdropFilter: 'blur(var(--blur-glass))',
            padding: 'clamp(2rem, 5vw, 4rem)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 40,
            alignItems: 'center',
          }}
        >
          {/* Indigo glow top-right */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              width: 420,
              height: 420,
              top: -160,
              right: -80,
              borderRadius: '50%',
              background: 'var(--glow-indigo)',
              filter: 'blur(100px)',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Left: text + buttons */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2
              style={{
                fontSize: 'var(--text-h2)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
              }}
            >
              One command. <GradientText>Your full SaaS stack.</GradientText>
            </h2>
            <p
              style={{
                marginTop: 18,
                color: 'var(--text-secondary)',
                fontSize: '1.05rem',
                lineHeight: 1.6,
                maxWidth: '40ch',
              }}
            >
              Scaffold, install, and run — then start shipping features instead
              of plumbing.
            </p>
            <div
              style={{
                display: 'flex',
                gap: 14,
                marginTop: 28,
                flexWrap: 'wrap',
              }}
            >
              <LandingButton href="https://github.com/sb-slim/react-app-starter">
                ⭐ Star on GitHub
              </LandingButton>
              <LandingButton
                href="https://hub.slimbouchoucha.tn"
                variant="outline"
              >
                View live demo
              </LandingButton>
            </div>
          </div>

          {/* Right: terminal */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <Terminal
              title="zsh — quick start"
              cursor={false}
              lines={[
                {
                  type: 'command',
                  text: 'pnpm create @sb-codex/sb-app@latest',
                },
                { type: 'comment', text: 'scaffolds the monorepo' },
                { type: 'command', text: 'cd my-saas && pnpm dev' },
                { type: 'success', text: 'Local: http://localhost:3000' },
              ]}
            />
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Footer() {
  return (
    <footer
      style={{ borderTop: '1px solid var(--border-subtle)', paddingBlock: 40 }}
    >
      <div
        style={{
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          paddingInline: 'var(--gutter)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 20,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logomark + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/logomark.svg" alt="" width={26} height={26} />
          <span
            style={{
              fontSize: '1.05rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: 'var(--text-primary)',
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
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 26 }}>
          {[
            {
              href: 'https://github.com/sb-slim/react-app-starter',
              label: 'GitHub',
            },
            { href: 'https://hub.slimbouchoucha.tn', label: 'Live demo' },
            {
              href: 'https://github.com/sb-slim/react-app-starter/blob/main/CHANGELOG.md',
              label: 'Changelog',
            },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
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
        </div>

        <span style={{ fontSize: '0.875rem', color: 'var(--text-faint)' }}>
          Built by{' '}
          <a
            href="https://slimbouchoucha.tn"
            target="_blank"
            rel="noreferrer"
            style={{
              color: 'inherit',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--zinc-400)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'inherit'
            }}
          >
            Slim Bouchoucha
          </a>{' '}
          · MIT
        </span>
      </div>
    </footer>
  )
}

// ── Page root ─────────────────────────────────────────────

export function LandingClient() {
  return (
    <div
      style={{
        position: 'relative',
        overflowX: 'clip',
        minHeight: '100dvh',
        background: 'var(--bg)',
      }}
    >
      <NavBar />
      <Hero />
      <StatsBar />
      <Features />
      <Stack />
      <CTA />
      <Footer />
    </div>
  )
}
