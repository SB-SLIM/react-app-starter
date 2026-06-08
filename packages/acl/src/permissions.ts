// Client-safe: pure data + types only, no server dependencies.
// Both the server (index.ts) and the React client (client.tsx) import from here.
// The role→permission MAPPING lives only in index.ts (server) — never shipped
// to the browser. Permissions are `resource:action`.

export const PERMISSIONS = [
  // Clients / CRM
  'clients:read',
  'clients:create',
  'clients:update',
  'clients:delete',
  // Settings / Members
  'members:read',
  'members:invite',
  'members:update',
  'members:remove',
  'settings:read',
  'settings:update',
] as const

export type Permission = (typeof PERMISSIONS)[number]
