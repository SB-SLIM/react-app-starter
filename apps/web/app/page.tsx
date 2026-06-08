'use client'

import {
  Badge,
  Button,
  Card,
  CardContent,
  Separator,
} from '@sb-codex/ui-components'

const features = [
  {
    icon: '🔐',
    title: 'Auth out of the box',
    description:
      'Email/password + Google OAuth via better-auth. Session management, CSRF protection, email verification included.',
  },
  {
    icon: '🏢',
    title: 'Multi-tenant by design',
    description:
      'Every table has workspace_id. Row-level security enforced at the database layer — no manual WHERE clauses.',
  },
  {
    icon: '⚡',
    title: 'End-to-end type safety',
    description:
      'tRPC v11 + Zod schemas shared between Fastify and React. Refactor a procedure and TypeScript catches the breakage.',
  },
  {
    icon: '🎨',
    title: 'Design system included',
    description:
      'Radix UI primitives + Tailwind v4 + Recharts. StatCard, charts, dialogs, forms — all ready to use.',
  },
  {
    icon: '🔄',
    title: 'Background jobs',
    description:
      'BullMQ + Valkey queues for email, exports, search indexing, and webhooks. Typed payloads, retries built-in.',
  },
  {
    icon: '🚀',
    title: 'CI/CD on day one',
    description:
      "GitHub Actions → GHCR → VPS. Docker Compose + Traefik + Let's Encrypt. Push to main and it ships.",
  },
]

const stack = [
  { label: 'React 19', category: 'Frontend' },
  { label: 'Next.js 15', category: 'Marketing' },
  { label: 'TanStack Router', category: 'Frontend' },
  { label: 'Fastify 5', category: 'Backend' },
  { label: 'tRPC v11', category: 'API' },
  { label: 'Drizzle ORM', category: 'Database' },
  { label: 'PostgreSQL', category: 'Database' },
  { label: 'better-auth', category: 'Auth' },
  { label: 'BullMQ', category: 'Jobs' },
  { label: 'Valkey', category: 'Cache' },
  { label: 'Tailwind v4', category: 'Styling' },
  { label: 'Turborepo', category: 'Monorepo' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
            sb-codex
          </span>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">beta</Badge>
            <a
              href="https://github.com/sb-slim/react-app-starter"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <Button size="sm" asChild>
              <a href="https://hub.slimbouchoucha.tn">Launch app</a>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <Badge variant="outline" className="mb-6">
          Open-source · MIT License
        </Badge>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
          Ship your SaaS
          <br />
          <span className="text-primary-600">in days, not months</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          A batteries-included monorepo starter with auth, multi-tenant API,
          background jobs, a full design system, and a CI/CD pipeline — all
          wired together and ready to ship.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <a href="https://github.com/sb-slim/react-app-starter">
              Get started free
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="https://hub.slimbouchoucha.tn">View live demo</a>
          </Button>
        </div>
      </section>

      <Separator />

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Everything you need to build a SaaS
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Every plugin is independently publishable to npm under{' '}
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-800">
              @sb-codex
            </code>
            .
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator />

      {/* Stack */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-gray-100">
          Modern stack, no lock-in
        </h2>
        <p className="mb-10 text-gray-600 dark:text-gray-400">
          Carefully chosen defaults — swap anything you need.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {stack.map(({ label, category }) => (
            <span key={label} className="group relative">
              <Badge
                variant="secondary"
                className="cursor-default text-sm px-3 py-1"
              >
                {label}
              </Badge>
              <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-gray-700">
                {category}
              </span>
            </span>
          ))}
        </div>
      </section>

      <Separator />

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
          Ready to ship?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-400">
          Bootstrap a new project in one command. Plugins from npm, no packages/
          directory, just your app code.
        </p>
        <pre className="mx-auto mt-8 max-w-md rounded-xl bg-gray-900 p-5 text-left text-sm text-green-400 dark:bg-gray-800">
          <code>pnpm create @sb-codex/sb-app@latest</code>
        </pre>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button size="lg" asChild>
            <a href="https://github.com/sb-slim/react-app-starter">
              Star on GitHub
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="https://hub.slimbouchoucha.tn">Live demo</a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 dark:border-gray-800">
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Built by{' '}
          <a
            href="https://slimbouchoucha.tn"
            className="font-medium hover:text-gray-900 dark:hover:text-gray-100"
          >
            Slim Bouchoucha
          </a>{' '}
          · MIT License
        </p>
      </footer>
    </div>
  )
}
