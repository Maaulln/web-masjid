import { test, expect } from '@playwright/test';

test.describe('Authentication & Middleware', () => {
  test('Prevents access to /admin without login', async ({ page }) => {
    await page.goto('/admin');
    
    // Should be redirected to /login?callbackUrl=...
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Masuk Masjid Al-Ikhlas' })).toBeVisible();
  });

  test('Shows error on invalid login', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Email').fill('wrong@email.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Masuk' }).click();
    
    await expect(page.getByText('Email atau Password salah.')).toBeVisible();
  });

  test('Allows admin to login and access dashboard', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Email').fill('admin@masjid-alikhlas.or.id');
    await page.getByLabel('Password').fill('AdminIkhlas123');
    await page.getByRole('button', { name: 'Masuk' }).click();
    
    // Should be redirected to dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    await expect(page.getByRole('heading', { name: 'Ikhtisar' })).toBeVisible();
    
    // Check if Navbar reflects logged in state
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Dashboard Admin' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).not.toBeVisible();
  });
});
