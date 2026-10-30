
const { test, expect } = require('@playwright/test');

test('invalid email blocks reservation', async ({ page }) => {
  await page.goto('/');

  let reservationRequests = 0;

  await page.route('**/api/reservations', async route => {
    reservationRequests++;
    await route.continue();
  });

  const firstStation = page.locator('[data-testid="station-card"]').first();
  await firstStation.getByRole('button').click();

  await page.getByLabel('Email address').fill('not-an-email');
  await page.getByRole('button', { name: 'Confirm reservation' }).click();

  await expect(page.locator('#email-error')).toBeVisible();
  expect(reservationRequests).toBe(0);
});

test('reservation sends correct payload and confirms booking', async ({ page }) => {
  await page.goto('/');

  let receivedPayload;

  await page.route('**/api/reservations', async route => {
    receivedPayload = route.request().postDataJSON();

    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ reservationId: 'CB-DEMO-777' })
    });
  });

  const firstStation = page.locator('[data-testid="station-card"]').first();
  await firstStation.getByRole('button').click();

  await page.getByLabel('Email address').fill('student@example.com');
  await page.getByRole('button', { name: 'Confirm reservation' }).click();

  await expect.poll(() => receivedPayload).toBeTruthy();
  expect(receivedPayload.email).toBe('student@example.com');
  expect(receivedPayload.stationId).toBe('central');

  await expect(page.getByText('CB-DEMO-777')).toBeVisible();
});
