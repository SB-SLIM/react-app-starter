import { z } from 'zod'
import { eq, count, desc } from 'drizzle-orm'
import { organization, member, user } from '@sb-codex/db'
import { router } from '@sb-codex/api-contracts'
import { PLATFORM_ROLES, type PlatformRole } from '@sb-codex/acl'
import {
  superAdminProcedure,
  platformOwnerProcedure,
} from '../superAdminProcedure'

const platformRoleEnum = z.enum(PLATFORM_ROLES)

const orgSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullable(),
  createdAt: z.date(),
  memberCount: z.number(),
})

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  platformRole: platformRoleEnum.nullable(),
  createdAt: z.date(),
})

export const superAdminRouter = router({
  dashboard: router({
    stats: superAdminProcedure
      .output(
        z.object({ orgs: z.number(), users: z.number(), members: z.number() }),
      )
      .query(async ({ ctx }) => {
        const [orgsRow] = await ctx.db.select({ n: count() }).from(organization)
        const [usersRow] = await ctx.db.select({ n: count() }).from(user)
        const [membersRow] = await ctx.db.select({ n: count() }).from(member)
        return {
          orgs: orgsRow?.n ?? 0,
          users: usersRow?.n ?? 0,
          members: membersRow?.n ?? 0,
        }
      }),
  }),

  orgs: router({
    list: superAdminProcedure
      .output(z.array(orgSchema))
      .query(async ({ ctx }) => {
        const rows = await ctx.db
          .select({
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
            logo: organization.logo,
            createdAt: organization.createdAt,
            memberCount: count(member.id),
          })
          .from(organization)
          .leftJoin(member, eq(member.organizationId, organization.id))
          .groupBy(organization.id)
          .orderBy(desc(organization.createdAt))
        return rows.map((r) => ({ ...r, memberCount: r.memberCount ?? 0 }))
      }),

    get: superAdminProcedure
      .input(z.object({ id: z.string() }))
      .output(
        orgSchema.extend({
          members: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
              role: z.string(),
            }),
          ),
        }),
      )
      .query(async ({ ctx, input }) => {
        const [org] = await ctx.db
          .select({
            id: organization.id,
            name: organization.name,
            slug: organization.slug,
            logo: organization.logo,
            createdAt: organization.createdAt,
            memberCount: count(member.id),
          })
          .from(organization)
          .leftJoin(member, eq(member.organizationId, organization.id))
          .where(eq(organization.id, input.id))
          .groupBy(organization.id)

        if (!org) throw new Error('Organization not found')

        const members = await ctx.db
          .select({
            id: member.id,
            role: member.role,
            name: user.name,
            email: user.email,
          })
          .from(member)
          .innerJoin(user, eq(user.id, member.userId))
          .where(eq(member.organizationId, input.id))

        return { ...org, memberCount: org.memberCount ?? 0, members }
      }),

    delete: superAdminProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await ctx.db.delete(organization).where(eq(organization.id, input.id))
        return { success: true }
      }),
  }),

  users: router({
    list: superAdminProcedure
      .output(z.array(userSchema))
      .query(async ({ ctx }) => {
        return ctx.db
          .select({
            id: user.id,
            name: user.name,
            email: user.email,
            platformRole: user.platformRole,
            createdAt: user.createdAt,
          })
          .from(user)
          .orderBy(desc(user.createdAt))
      }),

    get: superAdminProcedure
      .input(z.object({ id: z.string() }))
      .output(
        userSchema.extend({
          orgs: z.array(
            z.object({ id: z.string(), name: z.string(), role: z.string() }),
          ),
        }),
      )
      .query(async ({ ctx, input }) => {
        const [u] = await ctx.db
          .select({
            id: user.id,
            name: user.name,
            email: user.email,
            platformRole: user.platformRole,
            createdAt: user.createdAt,
          })
          .from(user)
          .where(eq(user.id, input.id))
          .limit(1)
        if (!u) throw new Error('User not found')

        const orgs = await ctx.db
          .select({
            id: organization.id,
            name: organization.name,
            role: member.role,
          })
          .from(member)
          .innerJoin(organization, eq(organization.id, member.organizationId))
          .where(eq(member.userId, input.id))

        return { ...u, orgs }
      }),

    // Only platform owners can grant/revoke platform roles
    setPlatformRole: platformOwnerProcedure
      .input(
        z.object({
          id: z.string(),
          platformRole: platformRoleEnum.nullable(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        await ctx.db
          .update(user)
          .set({ platformRole: input.platformRole as PlatformRole | null })
          .where(eq(user.id, input.id))
        return { success: true }
      }),
  }),
})
