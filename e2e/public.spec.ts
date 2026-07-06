import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('Landing Page renders correctly', async ({ page }) => {
    await page.goto('/');
    
    // Check main title
    await expect(page.getByText('Selamat Datang di Masjid Miftahlul Jannah')).toBeVisible();
    
    // Check Kas summary is rendered
    await expect(page.getByText('Pemasukan Kas')).toBeVisible();
    await expect(page.getByText('Pengeluaran Kas')).toBeVisible();
    await expect(page.getByText('Saldo Sisa Kas')).toBeVisible();
    
    // Check Navbar links
    const navbar = page.locator('nav');
    await expect(navbar.getByRole('link', { name: 'Beranda' })).toBeVisible();
    await expect(navbar.getByRole('link', { name: 'Donasi' })).toBeVisible();
    await expect(navbar.getByRole('link', { name: 'Login' })).toBeVisible();
  });

  test('Donasi Page renders form and shows Captcha error if submitted empty', async ({ page }) => {
    await page.goto('/donasi');
    
    await expect(page.getByRole('heading', { name: 'Donasi Online Masjid' })).toBeVisible();
    
    // Fill required HTML5 inputs to trigger React submit handler
    await page.getByLabel('Jumlah Donasi (Nominal Rp)').fill('50000');

    // Try to submit without filling Turnstile
    await page.getByRole('button', { name: 'Kirim Donasi' }).click();
    
    // Should see validation error
    await expect(page.getByText('Harap selesaikan verifikasi Captcha.')).toBeVisible();
  });
});
