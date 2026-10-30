const { test, expect } = require('@playwright/test');

// MISSION 2 — Add a Playwright test that first FAILS because of BUG-101.
// Behavior required: enabling "Available bikes only" hides Riverside Park (0 bikes)
// and shows exactly three station cards. Fix public/app.js only AFTER the test fails.

test('BUG-101: available-only filter excludes zero-bike stations', async ({ page }) => {
  await page.goto('/');

  const stationCards = page.locator('[data-testid="station-card"]');
  await expect(stationCards).toHaveCount(4);

  await page.getByLabel('Available bikes only').check();

  await expect(stationCards).toHaveCount(3);
  await expect(page.getByText('Riverside Park')).toBeHidden();
});
