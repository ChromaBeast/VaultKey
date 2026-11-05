import { expect, test } from '@playwright/test';
import { expectNoA11yViolations, mockApi } from './helpers';

const PAGES: [string, RegExp][] = [
  ['/', /App secrets/i],
  ['/how-it-works', /From your vault/i],
  ['/security', /Understand the vault/i],
  ['/pricing', /Start free/i],
  ['/docs', /Developer Docs/i],
  ['/contact', /Contact us/i],
  ['/terms', /Terms of Service/i],
  ['/login', /Sign in/i],
  ['/signup', /Create your account/i],
];

test.beforeEach(async ({ page }) => { await mockApi(page); });

for (const [path, heading] of PAGES) {
  test(`${path} renders and has no serious accessibility violations`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 }).first()).toContainText(heading);
    await page.waitForTimeout(500); // let entry animations settle before contrast checks
    await expectNoA11yViolations(page);
  });
}

test('landing hero shows the terminal and a working nav', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel(/Example: vaultkey run/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Copy command' })).toBeVisible();
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Pricing' }).click();
  await expect(page).toHaveURL(/\/pricing$/);
});

test('unknown routes show the 404 page', async ({ page }) => {
  await page.goto('/definitely-not-a-page');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
});

test('robots.txt and sitemap.xml are served', async ({ request }) => {
  expect((await request.get('/robots.txt')).ok()).toBeTruthy();
  expect(await (await request.get('/sitemap.xml')).text()).toContain('<urlset');
});
