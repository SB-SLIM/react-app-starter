import { test, expect } from '@playwright/test'

test.describe('authentication', () => {
  test('sign-up → email verify → dashboard', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible()

    await page.getByLabel(/email/i).fill(`test+${Date.now()}@example.com`)
    await page.getByLabel(/password/i).fill('Password123!')
    await page.getByRole('button', { name: /sign up/i }).click()

    // After sign-up, user should land on dashboard or verification page
    await expect(page).toHaveURL(/dashboard|verify/)
  })

  test('sign-in with wrong credentials shows error', async ({ page }) => {
    await page.goto('/sign-in')
    await page.getByLabel(/email/i).fill('nobody@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    await page.getByRole('button', { name: /sign in/i }).click()
    await expect(page.getByRole('alert')).toBeVisible()
  })
})
