import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { member, invitation, user, organization } from '@sb-codex/db'
import {
  router,
  workspaceProcedure,
  protectedProcedure,
} from '@sb-codex/api-contracts'
import { adminProcedure } from '@sb-codex/acl'
import type { MemberRole } from '@sb-codex/api-contracts'
import { sendEmail, inviteEmailHtml } from '../../email'
import { env } from '../../env'

const roleEnum = z.enum(['owner', 'admin', 'member'])

const memberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string(),
  role: roleEnum,
  createdAt: z.date(),
})

const invitationSchema = z.object({
  id: z.string(),
  email: z.string(),
  role: z.string().nullable(),
  status: z.string(),
  expiresAt: z.date(),
})

export const membersRouter = router({
  me: workspaceProcedure
    .output(z.object({ role: roleEnum }))
    .query(({ ctx }) => ({ role: ctx.memberRole as MemberRole })),

  list: workspaceProcedure
    .output(z.array(memberSchema))
    .query(async ({ ctx }) => {
      const rows = await ctx.db
        .select({
          id: member.id,
          userId: member.userId,
          name: user.name,
          email: user.email,
          role: member.role,
          createdAt: member.createdAt,
        })
        .from(member)
        .innerJoin(user, eq(user.id, member.userId))
        .where(eq(member.organizationId, ctx.workspace!.id))
      return rows.map((r) => ({ ...r, role: r.role as MemberRole }))
    }),

  invite: adminProcedure
    .input(z.object({ email: z.email(), role: roleEnum.default('member') }))
    .mutation(async ({ ctx, input }) => {
      const workspaceId = ctx.workspace!.id

      const [existingUser] = await ctx.db
        .select({ id: user.id })
        .from(user)
        .where(eq(user.email, input.email))
        .limit(1)

      if (existingUser) {
        const [existing] = await ctx.db
          .select({ id: member.id })
          .from(member)
          .where(
            and(
              eq(member.organizationId, workspaceId),
              eq(member.userId, existingUser.id),
            ),
          )
          .limit(1)
        if (existing)
          throw new Error('User is already a member of this workspace')
      }

      const [existingInvite] = await ctx.db
        .select({ id: invitation.id })
        .from(invitation)
        .where(
          and(
            eq(invitation.organizationId, workspaceId),
            eq(invitation.email, input.email),
            eq(invitation.status, 'pending'),
          ),
        )
        .limit(1)
      if (existingInvite)
        throw new Error('A pending invitation already exists for this email')

      const [ws] = await ctx.db
        .select({ name: organization.name })
        .from(organization)
        .where(eq(organization.id, workspaceId))
        .limit(1)

      const invitationId = randomUUID()
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

      await ctx.db.insert(invitation).values({
        id: invitationId,
        organizationId: workspaceId,
        email: input.email,
        role: input.role,
        status: 'pending',
        expiresAt,
        inviterId: ctx.user!.id,
      })

      const [inviter] = await ctx.db
        .select({ name: user.name })
        .from(user)
        .where(eq(user.id, ctx.user!.id))
        .limit(1)

      const adminUrl = env.BETTER_AUTH_URL.replace(
        '//localhost:3001',
        '//localhost:5173',
      )
      const acceptUrl = `${adminUrl}/invite/${invitationId}`

      await sendEmail({
        to: input.email,
        subject: `You're invited to ${ws?.name ?? 'a workspace'}`,
        html: inviteEmailHtml({
          workspaceName: ws?.name ?? 'the workspace',
          role: input.role,
          inviterName: inviter?.name ?? 'Someone',
          acceptUrl,
        }),
      })

      return { id: invitationId }
    }),

  acceptInvitation: protectedProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [inv] = await ctx.db
        .select()
        .from(invitation)
        .where(
          and(
            eq(invitation.id, input.invitationId),
            eq(invitation.status, 'pending'),
          ),
        )
        .limit(1)

      if (!inv) throw new Error('Invitation not found or already used')
      if (inv.expiresAt < new Date()) throw new Error('Invitation has expired')
      if (inv.email !== ctx.user!.email)
        throw new Error('This invitation was sent to a different email address')

      await ctx.db.insert(member).values({
        id: randomUUID(),
        organizationId: inv.organizationId,
        userId: ctx.user!.id,
        role: inv.role ?? 'member',
        createdAt: new Date(),
      })

      await ctx.db
        .update(invitation)
        .set({ status: 'accepted' })
        .where(eq(invitation.id, input.invitationId))

      return { organizationId: inv.organizationId }
    }),

  updateRole: adminProcedure
    .input(z.object({ userId: z.string(), role: roleEnum }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user!.id)
        throw new Error('You cannot change your own role')

      await ctx.db
        .update(member)
        .set({ role: input.role })
        .where(
          and(
            eq(member.userId, input.userId),
            eq(member.organizationId, ctx.workspace!.id),
          ),
        )

      return { success: true }
    }),

  remove: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.userId === ctx.user!.id)
        throw new Error('You cannot remove yourself')

      await ctx.db
        .delete(member)
        .where(
          and(
            eq(member.userId, input.userId),
            eq(member.organizationId, ctx.workspace!.id),
          ),
        )
      return { success: true }
    }),

  listInvitations: adminProcedure
    .output(z.array(invitationSchema))
    .query(async ({ ctx }) => {
      return ctx.db
        .select({
          id: invitation.id,
          email: invitation.email,
          role: invitation.role,
          status: invitation.status,
          expiresAt: invitation.expiresAt,
        })
        .from(invitation)
        .where(
          and(
            eq(invitation.organizationId, ctx.workspace!.id),
            eq(invitation.status, 'pending'),
          ),
        )
    }),

  cancelInvitation: adminProcedure
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(invitation)
        .set({ status: 'canceled' })
        .where(
          and(
            eq(invitation.id, input.invitationId),
            eq(invitation.organizationId, ctx.workspace!.id),
          ),
        )
      return { success: true }
    }),
})
