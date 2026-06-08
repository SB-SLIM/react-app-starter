import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/db/vitest.config.ts',
  'packages/auth/vitest.config.ts',
  'packages/api-contracts/vitest.config.ts',
  'packages/core/vitest.config.ts',
  'packages/acl/vitest.config.ts',
])
