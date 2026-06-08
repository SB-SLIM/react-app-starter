import nodemailer from 'nodemailer'
import { env } from './env'

const transporter = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      auth: env.SMTP_USER
        ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
        : undefined,
    })
  : null

export async function sendEmail(opts: {
  to: string
  subject: string
  html: string
  text?: string
}) {
  if (!transporter) {
    console.log(`[email] (no SMTP) To: ${opts.to} | Subject: ${opts.subject}`)
    return
  }
  await transporter.sendMail({ from: env.SMTP_FROM, ...opts })
}

export function inviteEmailHtml(opts: {
  workspaceName: string
  role: string
  inviterName: string
  acceptUrl: string
}) {
  return `
<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
  <h2 style="margin:0 0 8px">You're invited to ${opts.workspaceName}</h2>
  <p style="color:#6b7280;margin:0 0 24px">
    ${opts.inviterName} has invited you to join <strong>${opts.workspaceName}</strong> as <strong>${opts.role}</strong>.
  </p>
  <a href="${opts.acceptUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
    Accept invitation
  </a>
  <p style="color:#9ca3af;font-size:12px;margin:24px 0 0">
    This invitation expires in 7 days. If you did not expect this, you can ignore this email.
  </p>
</div>`
}
