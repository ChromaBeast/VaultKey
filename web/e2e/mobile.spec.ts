import { expect, test } from '@playwright/test';
import { mockApi, signIn } from './helpers';

test('landing has no horizontal overflow and the terminal fits', async ({ page }) => {
  await mockApi(page);
  await page.goto('/');
  await expect(page.getByLabel(/Example: vaultkey run/)).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test('app: secrets page fits and the navigation drawer opens', async ({ page }) => {
  await signIn(page);
  await page.goto('/secrets');
  await expect(page.locator('.secret-key-name').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)).toBe(false);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog', { name: 'App navigation' })).toBeVisible();
});
