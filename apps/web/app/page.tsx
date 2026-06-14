'use client'

import { Badge, Button, Separator } from '@sb-codex/ui-components'

const features = [
  {
    icon: '🔐',
    iconBg: 'bg-indigo-500/15',
    title: 'Auth out of the box',
    description:
      'Email/password + Google OAuth via better-auth. Sessions, CSRF, email verification — zero config.',
  },
  {
    icon: '🏢',
    iconBg: 'bg-blue-500/15',
    title: 'Multi-tenant by design',
    description:
      'Every table has workspace_id. Row-level security enforced at the DB layer — no manual WHERE clauses.',
  },
  {
    icon: '⚡',
    iconBg: 'bg-emerald-500/15',
    title: 'End-to-end type safety',
    description:
      'tRPC v11 + Zod between Fastify and React. Break a procedure — TypeScript catches it instantly.',
  },
  {
    icon: '🚀',
    iconBg: 'bg-orange-500/15',
    title: 'CI/CD on day one',
    description:
      "GitHub Actions → GHCR → VPS. Docker + Traefik + Let's Encrypt. Push to main and it ships.",
  },
]

const stack = [
  {
    heading: 'Frontend',
    items: ['React 19', 'TanStack Router', 'Tailwind v4', 'Radix UI'],
  },
  {
    heading: 'Backend',
    items: ['Fastify 5', 'tRPC v11', 'Drizzle ORM', 'better-auth'],
  },
  {
    heading: 'Data & Jobs',
    items: ['PostgreSQL', 'Valkey (Redis)', 'BullMQ', 'Meilisearch'],
  },
  {
    heading: 'Infra',
    items: ['Docker Compose', 'Traefik v3', 'GitHub Actions', 'Turborepo'],
  },
]

const stats = [
  { num: '12+', label: 'npm plugins' },
  { num: '100%', label: 'TypeScript' },
  { num: '1', label: 'command to start' },
  { num: '0', label: 'vendor lock-in' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-extrabold tracking-tight">
            sb
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              -codex
            </span>
          </span>

          <div className="hidden items-center gap-6 sm:flex">
            <a
              href="#features"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#stack"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              Stack
            </a>
            <a
              href="https://github.com/sb-slim/react-app-starter"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              GitHub
            </a>
          </div>

          <Button size="sm" asChild>
            <a href="https://hub.slimbouchoucha.tn">Launch app →</a>
          </Button>
        </nav>
      </header>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-28 lg:py-36">
        <div className="pointer-events-none absolute inset-0 flex items-start justify-center">
          <div className="h-[500px] w-full max-w-3xl translate-y-[-30%] rounded-full bg-indigo-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <Badge
            variant="outline"
            className="mb-6 border-indigo-500/30 bg-indigo-500/5 text-indigo-400"
          >
            <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
            Open-source · MIT License
          </Badge>

          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-7xl">
            The SaaS starter kit
            <br />
            that{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              ships everything.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-zinc-400 sm:text-lg">
            Auth, multi-tenant API, background jobs, a full design system, and
            CI/CD — wired together and ready on day one.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <a href="https://github.com/sb-slim/react-app-starter">
                Get started free →
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://hub.slimbouchoucha.tn">View live demo</a>
            </Button>
          </div>

          {/* Terminal */}
          <div className="mx-auto mt-12 max-w-lg overflow-hidden rounded-xl border border-white/10 bg-zinc-900 text-left shadow-2xl">
            <div className="flex items-center gap-1.5 border-b border-white/5 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
            </div>
            <div className="px-5 py-4 font-mono text-xs sm:text-sm">
              <p className="text-zinc-500">
                ${' '}
                <span className="text-cyan-300">
                  pnpm create @sb-codex/sb-app@latest my-saas
                </span>
              </p>
              <p className="mt-3 text-emerald-400">
                ✓ Created project in ./my-saas
              </p>
              <p className="text-emerald-400">
                ✓ Installed 12 @sb-codex plugins
              </p>
              <p className="text-emerald-400">✓ Ready — run pnpm dev</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="border-y border-white/5">
        <div className="mx-auto grid max-w-3xl grid-cols-2 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-4 py-6 text-center sm:px-6 ${
                i % 2 === 0 ? 'border-r border-white/5' : ''
              } sm:border-r sm:last:border-r-0`}
            >
              <div className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
                {s.num}
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section
        id="features"
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
          What's included
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Everything you need.
          <br />
          Nothing you don't.
        </h2>
        <p className="mt-3 max-w-xl text-zinc-400">
          Each piece is a standalone npm plugin — swap, extend, or skip any of
          them.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-white/8 bg-white/[0.02] p-6 transition-colors hover:border-indigo-500/40"
            >
              <div
                className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg text-xl ${f.iconBg}`}
              >
                {f.icon}
              </div>
              <h3 className="mb-2 font-semibold text-zinc-100">{f.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="opacity-10" />

      {/* ── STACK ── */}
      <section
        id="stack"
        className="bg-white/[0.015] px-4 py-16 sm:px-6 sm:py-24"
      >
        <div className="mx-auto max-w-5xl">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-indigo-400">
            The stack
          </p>
          <h2 className="mt-3 text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
            Modern defaults. No lock-in.
          </h2>

          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stack.map((group) => (
              <div key={group.heading}>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-zinc-600">
                  {group.heading}
                </h4>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-zinc-400"
                    >
                      <span className="h-1 w-1 flex-shrink-0 rounded-full bg-indigo-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="opacity-10" />

      {/* ── QUICK START / CTA ── */}
      <section className="relative overflow-hidden px-4 py-20 text-center sm:px-6 sm:py-28">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-full max-w-xl rounded-full bg-indigo-600/8 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">
            Quick start
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            One command.
            <br />
            Your full SaaS stack.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-zinc-400">
            Bootstrap a new project with plugins from npm — no{' '}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-300">
              packages/
            </code>{' '}
            to maintain.
          </p>

          <div className="mx-auto mt-10 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 text-left shadow-2xl sm:max-w-md">
            <div className="px-5 py-4 font-mono text-xs sm:text-sm">
              <p className="text-zinc-500">
                ${' '}
                <span className="text-cyan-300">
                  pnpm create @sb-codex/sb-app@latest
                </span>
              </p>
              <p className="mt-2 text-zinc-500">
                $ <span className="text-cyan-300">cd my-saas && pnpm dev</span>
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <a href="https://github.com/sb-slim/react-app-starter">
                ⭐ Star on GitHub
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://hub.slimbouchoucha.tn">View live demo</a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <span className="text-base font-extrabold">
            sb
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              -codex
            </span>
          </span>

          <div className="flex flex-wrap justify-center gap-5 sm:gap-8">
            <a
              href="https://github.com/sb-slim/react-app-starter"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-zinc-500 transition-colors hover:text-white"
            >
              GitHub
            </a>
            <a
              href="https://hub.slimbouchoucha.tn"
              className="text-sm text-zinc-500 transition-colors hover:text-white"
            >
              Live demo
            </a>
            <a
              href="https://github.com/sb-slim/react-app-starter/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-zinc-500 transition-colors hover:text-white"
            >
              Changelog
            </a>
          </div>

          <p className="text-xs text-zinc-600">
            Built by{' '}
            <a
              href="https://slimbouchoucha.tn"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-zinc-400"
            >
              Slim Bouchoucha
            </a>{' '}
            · MIT
          </p>
        </div>
      </footer>
    </div>
  )
}
