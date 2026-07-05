import { test, expect } from '@playwright/test';

test.describe('Admin Keuangan', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test in this suite
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@masjid-alikhlas.or.id');
    await page.getByLabel('Password').fill('AdminIkhlas123');
    await page.getByRole('button', { name: 'Masuk' }).click();
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('Can add a new income record and delete it', async ({ page }) => {
    await page.goto('/admin/keuangan');
    
    // Open Form
    await page.getByText('Tambah Rekam').click();
    
    // Fill Form
    await page.locator('select[name="type"]').selectOption('INCOME');
    await page.locator('input[name="amount"]').fill('500000');
    await page.locator('input[name="description"]').fill('Sedekah hamba Allah (Playwright)');
    await page.locator('select[name="category"]').selectOption('Sedekah');
    
    // Submit
    await page.getByRole('button', { name: 'Simpan', exact: true }).click();
    // Wait for modal to close
    await expect(page.locator('input[name="amount"]')).not.toBeVisible();
    
    // Verify it exists in the table
    await expect(page.getByText('Sedekah hamba Allah (Playwright)')).toBeVisible();

    // Delete it (To clean up)
    page.on('dialog', dialog => dialog.accept()); // Accept confirm dialog
    // Find the row containing our new record and click its delete button
    const row = page.locator('tr').filter({ hasText: 'Sedekah hamba Allah (Playwright)' }).first();
    await row.getByRole('button').click(); // Delete button
    
    // Toast notification check
    await expect(page.getByText('Rekam keuangan dihapus').first()).toBeVisible();
  });
});
