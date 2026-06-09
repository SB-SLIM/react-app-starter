# Security Policy

## Supported versions

| Version | Supported |
|---|---|
| `main` branch | ✅ |
| Published `0.x.x-beta.*` packages | ✅ |
| Older releases | ❌ |

## Reporting a vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Email: **bouchouchaslim@gmail.com**

Include in your report:
- Description of the vulnerability
- Steps to reproduce
- Affected component (package name, app, or infra)
- Potential impact
- Any suggested fix (optional)

You will receive an acknowledgement within 48 hours and a status update within 7 days.

## Scope

This repository is a multi-tenant SaaS starter. High-impact areas include:

- **Tenant isolation** — RLS policies, `enforceWorkspace` middleware
- **Authentication** — `@sb-codex/auth`, better-auth integration
- **Authorization** — `@sb-codex/acl`, `ROLE_PERMISSIONS` map, `requirePermission`
- **Infrastructure** — Traefik routing, Postgres connection roles, Docker images
- **Secrets handling** — environment variable validation, SMTP, OAuth credentials

## Out of scope

- Vulnerabilities in third-party dependencies (report directly to the upstream project)
- Issues requiring physical access to the VPS
- Social engineering attacks
