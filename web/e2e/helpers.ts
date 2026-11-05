import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

export const FIXTURES = {
  secrets: [
    { id: 's1', key: 'STRIPE_SECRET_KEY', project: 'backend', env: 'production', version: 4, created_by: 'u1', updated_at: ago(120) },
    { id: 's2', key: 'DATABASE_URL', project: 'backend', env: 'production', version: 7, created_by: 'u1', updated_at: ago(1500) },
    { id: 's3', key: 'SENDGRID_API_KEY', project: 'backend', env: 'staging', version: 2, created_by: 'u1', updated_at: ago(4300) },
    { id: 's4', key: 'REDIS_URL', project: 'backend', env: 'development', version: 3, created_by: 'u1', updated_at: ago(10080) },
  ],
  keys: [
    { id: 'k1', name: 'GitHub Actions CI', permissions: 'write', last_used: ago(12), created_at: ago(9000), active: true },
    { id: 'k2', name: 'Old deploy key', permissions: 'admin', created_at: ago(200000), active: false },
  ],
  audit: ['WRITE', 'READ', 'ROLLBACK'].map((action, i) => ({
    id: `a${i}`, action, secret_key: 'STRIPE_SECRET_KEY', project: 'backend', actor: 'sheersh@acme.dev',
    ip_address: '203.0.113.24', hmac: `9f3ac71e${i}d41`, created_at: ago(i * 90),
  })),
  users: [
    { id: 'u1', email: 'sheersh@acme.dev', role: 'owner', created_at: ago(300000) },
    { id: 'u2', email: 'maya@acme.dev', role: 'write', created_at: ago(120000) },
  ],
};

/** Answer every API call with fixtures so pages render without a backend. */
export async function mockApi(page: Page): Promise<void> {
  // Third-party widgets are not part of these tests and are unreachable in CI.
  await page.route(/challenges\.cloudflare\.com|checkout\.razorpay\.com/, (route) => route.abort());
  await page.route('**/v1/**', (route) => {
    const url = route.request().url();
    const json = (body: unknown) => route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) });
    if (url.includes('/v1/audit/verify')) return json({ verified: true });
    if (url.includes('/v1/audit')) return json(FIXTURES.audit);
    if (url.includes('/v1/api-keys')) return json(FIXTURES.keys);
    if (url.includes('/v1/users')) return json(FIXTURES.users);
    if (url.includes('/v1/projects')) return json(['backend']);
    if (url.includes('/v1/payments/config')) return json({ enabled: false, key_id: '' });
    if (url.includes('/v1/secrets')) return json(FIXTURES.secrets);
    return json([]);
  });
}

/** Seed the same session storage the app reads, as an admin of a free workspace. */
export async function signIn(page: Page): Promise<void> {
  await page.addInitScript(() => {
    sessionStorage.setItem('vk_token', 'test-token');
    localStorage.setItem('vk_user', JSON.stringify({ id: 'u1', org_id: 'o1', email: 'sheersh@acme.dev', role: 'admin' }));
    localStorage.setItem('vk_org', JSON.stringify({ id: 'o1', name: 'Acme Cloud', slug: 'acme', plan: 'free' }));
  });
  await mockApi(page);
}

/** Fail on serious or critical accessibility violations, with a readable message. */
export async function expectNoA11yViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  const summary = serious.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} node(s), e.g. ${v.nodes.slice(0, 5).map((n) => n.target.join(' ')).join(' | ')}`);
  expect(summary, 'serious or critical accessibility violations').toEqual([]);
}
