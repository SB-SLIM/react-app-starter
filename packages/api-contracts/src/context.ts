/**
 * Context shape that the server passes to every tRPC procedure.
 * Phase 3 extends this with db, workspace, session, etc.
 */
export interface Context {
  requestId: string
  user: { id: string } | null
}
