import { afterEach, describe, expect, test } from 'bun:test';
import { buildAuditCsv } from '../src/lib/auditCsv';
import { canWriteSecrets, isAdminRole } from '../src/lib/permissions';
import { apiFetch } from '../src/lib/api';

const originalFetch = globalThis.fetch;
const storage = () => {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value), removeItem: (key: string) => values.delete(key) };
};
Object.assign(globalThis, { sessionStorage: storage(), localStorage: storage() });
afterEach(() => { globalThis.fetch = originalFetch; sessionStorage.removeItem('vk_token'); });

describe('workspace roles', () => {
  test('founders have admin tools; writers and readers have distinct secret permissions', () => {
    expect(isAdminRole('owner')).toBe(true);
    expect(isAdminRole('admin')).toBe(true);
    expect(isAdminRole('write')).toBe(false);
    expect(canWriteSecrets('write')).toBe(true);
    expect(canWriteSecrets('read')).toBe(false);
    expect(canWriteSecrets(undefined)).toBe(false);
  });
});
test('audit CSV escapes quotes, CRLF, and spreadsheet formula prefixes', () => {
  const csv = buildAuditCsv([{ id: '=1+1', action: 'READ', secret_key: 'key,"quoted"', actor: 'a\rb', project: '@SUM(1)' }]);
  expect(csv).toContain("'=1+1");
  expect(csv).toContain('"key,""quoted"""');
  expect(csv).toContain('"a\rb"');
  expect(csv).toContain("'@SUM(1)");
});
test('API requests preserve Headers instances and attach the current session', async () => {
  sessionStorage.setItem('vk_token', 'current');
  let sent: Headers | undefined;
  globalThis.fetch = (async (_input, options) => {
    sent = new Headers(options?.headers);
    return new Response('{"ok":true}', { headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
  await apiFetch('/test', { headers: new Headers({ 'X-Review': 'kept' }) });
  expect(sent?.get('X-Review')).toBe('kept');
  expect(sent?.get('Authorization')).toBe('Bearer current');
});
test('a stale unauthorized request cannot erase a newer login', async () => {
  sessionStorage.setItem('vk_token', 'old');
  globalThis.fetch = (async () => {
    sessionStorage.setItem('vk_token', 'new');
    return new Response('{"error":"invalid api key"}', { status: 401, headers: { 'content-type': 'application/json' } });
  }) as typeof fetch;
  await expect(apiFetch('/test')).rejects.toThrow('invalid api key');
  expect(sessionStorage.getItem('vk_token')).toBe('new');
});
