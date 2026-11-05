import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, signIn } from './helpers';

test.beforeEach(async ({ page }) => { await signIn(page); });

test('secrets: table, environments and stats', async ({ page }) => {
  await page.goto('/secrets');
  await expect(page.getByRole('heading', { name: 'Secrets', level: 1 })).toBeVisible();
  await expect(page.locator('.secret-key-name', { hasText: 'STRIPE_SECRET_KEY' })).toBeVisible();
  await expect(page.locator('.badge-production').first()).toBeVisible();
  await expect(page.getByLabel('Project summary')).toContainText('Environments');
  await page.waitForTimeout(500);
  await expectNoA11yViolations(page);
});

test('secrets: new secret dialog opens and closes with Escape', async ({ page }) => {
  await page.goto('/secrets');
  await page.getByRole('button', { name: /New Secret/i }).click();
  const dialog = page.getByRole('dialog', { name: /Create secret/i });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('api keys: list, scopes and revoke confirmation', async ({ page }) => {
  await page.goto('/keys');
  await expect(page.getByText('GitHub Actions CI')).toBeVisible();
  await page.getByRole('button', { name: 'Revoke' }).first().click();
  await expect(page.getByRole('dialog', { name: /Revoke API key/i })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.waitForTimeout(300);
  await expectNoA11yViolations(page);
});

test('audit: chain banner reports a verified ledger', async ({ page }) => {
  await page.goto('/audit');
  await expect(page.getByText('Chain verified')).toBeVisible();
  await expect(page.locator('td .badge', { hasText: 'WRITE' }).first()).toBeVisible();
  await page.waitForTimeout(500);
  await expectNoA11yViolations(page);
});

test('billing: shows the current plan and payment history section', async ({ page }) => {
  await page.goto('/billing');
  await expect(page.getByRole('heading', { name: 'Free plan' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Payment history' })).toBeVisible();
  await page.waitForTimeout(500);
  await expectNoA11yViolations(page);
});

test('settings: password form, invite form and team members', async ({ page }) => {
  await page.goto('/settings');
  await expect(page.getByRole('heading', { name: 'Change password' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Invite a teammate' })).toBeVisible();
  await expect(page.getByText('maya@acme.dev')).toBeVisible();
  await page.waitForTimeout(500);
  await expectNoA11yViolations(page);
});

test('command palette opens with the keyboard shortcut', async ({ page }) => {
  await page.goto('/secrets');
  await expect(page.getByRole('heading', { name: 'Secrets', level: 1 })).toBeVisible();
  await page.keyboard.press('ControlOrMeta+k');
  await expect(page.getByRole('dialog', { name: 'Commands' })).toBeVisible();
});
