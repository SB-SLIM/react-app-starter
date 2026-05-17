import { createFileRoute, Link } from '@tanstack/react-router'
import { Button, CardUser } from '@sb-codex/ui-components'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <section className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Multi-tenant SaaS Starter
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-gray-600">
          Open-source foundation: workspaces, collaborators, clients, and
          tenant-isolated data — designed to scale from 100 to 1M+ users.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/dashboard">
            <Button>Open dashboard</Button>
          </Link>
          <a href="https://github.com" target="_blank" rel="noreferrer">
            <Button variant="secondary">GitHub</Button>
          </a>
        </div>
      </section>

      <section className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CardUser
          firstName="Ada"
          lastName="Lovelace"
          avatarUrl="https://i.pravatar.cc/160?img=47"
          description="Workspace owner — full control over members, billing, and settings."
        />
        <CardUser
          firstName="Linus"
          lastName="Torvalds"
          avatarUrl="https://i.pravatar.cc/160?img=12"
          description="Collaborator — manages clients and day-to-day operations."
        />
        <CardUser
          firstName="Grace"
          lastName="Hopper"
          avatarUrl="https://i.pravatar.cc/160?img=32"
          description="Client — read-only access to assigned resources."
        />
      </section>
    </div>
  )
}
