import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'auth',
    environment: 'node',
    coverage: {
      provider: 'v8',
      thresholds: { lines: 70 },
    },
  },
})
