import { test, expect } from '@playwright/test';

test.describe('Admin Qurban', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@masjid-alikhlas.or.id');
    await page.getByLabel('Password').fill('AdminIkhlas123');
    await page.getByRole('button', { name: 'Masuk' }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('Can add a new Qurban mudhohi and delete it', async ({ page }) => {
    await page.goto('/admin/qurban');
    
    // Open Form
    await page.getByRole('button', { name: 'Tambah Mudhohi' }).click();
    
    // Fill Form
    await page.locator('input[name="mudhohiName"]').fill('Bapak Fulan E2E');
    await page.locator('select[name="animalType"]').selectOption('KAMBING');
    
    // Submit
    await page.getByRole('button', { name: 'Simpan', exact: true }).click();
    // Wait for modal to close
    await expect(page.locator('input[name="mudhohiName"]')).not.toBeVisible();
    
    // Verify it exists in the table
    await expect(page.getByText('Bapak Fulan E2E').first()).toBeVisible();

    // Verify filter UI works
    await page.locator('select[name="year"]').selectOption('2025');
    await expect(page.getByRole('heading', { name: 'Manajemen Qurban 2025' })).toBeVisible();

    // Go back to current year and delete
    await page.locator('select').filter({ hasText: '2025' }).selectOption(new Date().getFullYear().toString());
    page.on('dialog', dialog => dialog.accept()); 
    const row = page.locator('tr').filter({ hasText: 'Bapak Fulan E2E' }).first();
    await row.getByRole('button').click();
    
    // Toast notification check
    await expect(page.getByText('Data qurban dihapus')).toBeVisible();
  });
});
