import { test, expect } from '@playwright/test';

test.describe('Admin Kegiatan', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@masjid-alikhlas.or.id');
    await page.getByLabel('Password').fill('AdminIkhlas123');
    await page.getByRole('button', { name: 'Masuk' }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('Can add a new activity and delete it', async ({ page }) => {
    await page.goto('/admin/kegiatan');
    
    // Open Form
    await page.getByRole('button', { name: 'Tambah Kegiatan' }).click();
    
    // Fill Form
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().slice(0, 16); // YYYY-MM-DDThh:mm
    
    const tomorrowEnd = new Date(tomorrow);
    tomorrowEnd.setHours(tomorrowEnd.getHours() + 2);
    const dateStrEnd = tomorrowEnd.toISOString().slice(0, 16);
    
    await page.locator('input[name="title"]').fill('Kajian Fiqih E2E');
    await page.locator('input[name="type"]').fill('Kajian Umum');
    await page.locator('textarea[name="description"]').fill('Membahas bab shalat');
    await page.locator('input[name="startDateTime"]').fill(dateStr);
    await page.locator('input[name="endDateTime"]').fill(dateStrEnd);
    
    // Submit
    await page.getByRole('button', { name: 'Simpan', exact: true }).click();
    // Wait for the modal to close and the page to refresh data
    await expect(page.locator('input[name="title"]')).not.toBeVisible();
    
    // Verify it exists in the table
    await expect(page.getByText('Kajian Fiqih E2E').first()).toBeVisible();

    // Verify it exists on landing page
    await page.goto('/');
    await expect(page.getByText('Kajian Fiqih E2E').first()).toBeVisible();

    // Go back and delete it
    await page.goto('/admin/kegiatan');
    page.on('dialog', dialog => dialog.accept()); 
    const card = page.locator('div.bg-white.rounded-xl.border').filter({ hasText: 'Kajian Fiqih E2E' }).first();
    await card.getByRole('button').click();
    
    // Toast notification check
    await expect(page.getByText('Kegiatan dihapus')).toBeVisible();
  });
});
