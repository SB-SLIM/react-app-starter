import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'db',
    environment: 'node',
    coverage: {
      provider: 'v8',
      thresholds: { lines: 70 },
    },
  },
})
