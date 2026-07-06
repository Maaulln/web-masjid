import { test, expect } from '@playwright/test';

test.describe('Performance Metrics', () => {
  test('Landing page should load fast and render correctly', async ({ page }) => {
    // Navigate to the landing page
    const response = await page.goto('/');
    
    // Ensure page loaded successfully
    expect(response?.status()).toBe(200);

    // Wait for the network to be idle to ensure all resources (including optimized images) are loaded
    await page.waitForLoadState('networkidle');

    // Get performance timing metrics
    const timingString = await page.evaluate(() => JSON.stringify(window.performance.timing));
    const timing = JSON.parse(timingString);

    // Calculate Page Load Time (Time from navigation start to load event end)
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
    
    // Log the performance metrics
    console.log(`Page Load Time: ${pageLoadTime}ms`);
    
    // Optional: Calculate Time to First Byte (TTFB)
    const ttfb = timing.responseStart - timing.navigationStart;
    console.log(`Time to First Byte (TTFB): ${ttfb}ms`);

    // Verify the page load time is under an acceptable threshold (e.g. 3000ms for testing, ideally much lower in prod)
    // For local dev, this might be slightly higher, but caching should help.
    expect(pageLoadTime).toBeLessThan(5000); 

    // Make sure hero image is visible (checking if next/image works)
    const heroImage = page.locator('img[alt="Mosque Interior"]');
    await expect(heroImage).toBeVisible();
    
    // Check if gallery images are visible
    const galleryImage = page.locator('img[alt="Kajian Jamaah"]');
    await expect(galleryImage).toBeVisible();
  });
});
