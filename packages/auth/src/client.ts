'use client'

import { createAuthClient } from 'better-auth/react'
import { organizationClient } from 'better-auth/client/plugins'

// ── Clean types exposed to consumers ──────────────────────────────────────────

export type AuthUser = {
  id: string
  email: string
  name: string
}

export type AuthSession = {
  user: AuthUser
  activeOrganizationId: string | null
}

export type AuthResult<T = void> =
  | { data: T; error: null }
  | { data: null; error: string }

export type Workspace = {
  id: string
  slug: string
  name: string
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Creates an auth client with a library-agnostic interface.
 * Currently backed by better-auth. To swap the auth library, rewrite this
 * factory — no consuming code outside this file needs to change.
 *
 * @param baseURL - The server base URL (e.g. http://localhost:3001)
 */
export function createSbAuthClient(baseURL: string) {
  const internal = createAuthClient({
    baseURL,
    plugins: [organizationClient()],
  })

  function slugify(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return {
    /** Sign in with email + password. */
    async signIn(
      email: string,
      password: string,
    ): Promise<AuthResult<AuthSession>> {
      const res = await internal.signIn.email({ email, password })
      if (res.error)
        return { data: null, error: res.error.message ?? 'Sign-in failed' }
      const user = res.data?.user
      if (!user) return { data: null, error: 'No user in response' }
      return {
        data: {
          user: { id: user.id, email: user.email, name: user.name },
          activeOrganizationId: null,
        },
        error: null,
      }
    },

    /** Create a new account with email + password. */
    async signUp(
      name: string,
      email: string,
      password: string,
    ): Promise<AuthResult<AuthSession>> {
      const res = await internal.signUp.email({ name, email, password })
      if (res.error)
        return { data: null, error: res.error.message ?? 'Sign-up failed' }
      const user = res.data?.user
      if (!user) return { data: null, error: 'No user in response' }
      return {
        data: {
          user: { id: user.id, email: user.email, name: user.name },
          activeOrganizationId: null,
        },
        error: null,
      }
    },

    /** Sign out the current user. */
    async signOut(): Promise<void> {
      await internal.signOut()
    },

    /** Fetch the current session (non-reactive). */
    async getSession(): Promise<AuthSession | null> {
      const res = await internal.getSession()
      const user = res?.data?.user
      if (!user) return null
      return {
        user: { id: user.id, email: user.email, name: user.name },
        activeOrganizationId: res.data?.session?.activeOrganizationId ?? null,
      }
    },

    /**
     * React hook — returns the current session reactively.
     * Must be called inside a React component or hook.
     */
    useSession(): { session: AuthSession | null; isPending: boolean } {
      const { data, isPending } = internal.useSession()
      const user = data?.user
      return {
        session: user
          ? {
              user: { id: user.id, email: user.email, name: user.name },
              activeOrganizationId: data?.session?.activeOrganizationId ?? null,
            }
          : null,
        isPending,
      }
    },

    /**
     * Create a workspace (organization) for the current user.
     * Slug is auto-derived from the name.
     */
    async createWorkspace(name: string): Promise<AuthResult<Workspace>> {
      const slug = slugify(name)
      const res = await internal.organization.create({ name, slug })
      if (res.error)
        return {
          data: null,
          error: res.error.message ?? 'Failed to create workspace',
        }
      const org = res.data
      if (!org) return { data: null, error: 'No workspace in response' }
      return {
        data: { id: org.id, slug: org.slug, name: org.name },
        error: null,
      }
    },

    /** List the current user's workspaces. */
    async listWorkspaces(): Promise<AuthResult<Workspace[]>> {
      const res = await internal.organization.list()
      if (res.error)
        return {
          data: null,
          error: res.error.message ?? 'Failed to list workspaces',
        }
      const orgs = res.data ?? []
      return {
        data: orgs.map((o) => ({ id: o.id, slug: o.slug, name: o.name })),
        error: null,
      }
    },
  }
}

export type SbAuthClient = ReturnType<typeof createSbAuthClient>
