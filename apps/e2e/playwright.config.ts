import { defineConfig, devices } from '@playwright/test'

const BASE_URL = process.env['BASE_URL'] ?? 'http://localhost:5173'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
  // Spin up the dev stack before running (comment out in CI — use docker compose instead)
  // webServer: {
  //   command: 'pnpm dev:app',
  //   url: BASE_URL,
  //   reuseExistingServer: !process.env['CI'],
  // },
})
