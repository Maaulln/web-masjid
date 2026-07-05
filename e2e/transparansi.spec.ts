import { test, expect } from '@playwright/test';

test.describe('Public Transparency Page', () => {
  test('Renders chart, table, and summary correctly', async ({ page }) => {
    // Navigate to homepage and click the Transparansi link
    await page.goto('/');
    await page.getByRole('link', { name: 'Keuangan' }).click();

    // Verify URL
    await expect(page).toHaveURL(/.*\/transparansi/);

    // Verify Title
    await expect(page.getByRole('heading', { name: 'Transparansi Keuangan' })).toBeVisible();

    // Verify KasSummary
    await expect(page.getByText('Saldo Sisa Kas')).toBeVisible();

    // Verify KasChart
    await expect(page.getByRole('heading', { name: 'Grafik Kas 12 Bulan Terakhir' })).toBeVisible();
    // Recharts container
    await expect(page.locator('.recharts-responsive-container')).toBeVisible();

    // Verify KasTable
    await expect(page.getByRole('heading', { name: 'Riwayat Transaksi Terbaru' })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });
});
