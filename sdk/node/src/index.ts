export interface VaultkeyConfig {
  host?: string;
  apiKey: string;
  timeoutMs?: number;
}

export interface SecretHeader {
  id: string;
  key: string;
  project: string;
  env: string;
  version: number;
}

export interface InjectOptions {
  /**
   * When false, keys already present in process.env are skipped.
   * Defaults to true: injected values override the current environment.
   */
  override?: boolean;
}

export class VaultkeyError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'VaultkeyError';
    this.status = status;
  }
}

const DEFAULT_TIMEOUT_MS = 30000;
const RETRY_DELAYS_MS = [300, 900];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class Vaultkey {
  private host: string;
  private apiKey: string;
  private timeoutMs: number;

  constructor(config: VaultkeyConfig) {
    if (!config.apiKey || typeof config.apiKey !== 'string' || !config.apiKey.trim()) {
      throw new VaultkeyError('apiKey must be a non-empty string');
    }
    this.host = config.host || 'http://localhost:8080';
    // Remove trailing slash if present
    if (this.host.endsWith('/')) {
      this.host = this.host.slice(0, -1);
    }
    this.apiKey = config.apiKey;
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  }

  private static isRetryable(err: unknown): boolean {
    if (err instanceof VaultkeyError) {
      return err.status !== undefined && err.status >= 500;
    }
    return true;
  }

  private async requestOnce<T>(path: string, options: RequestInit): Promise<T> {
    const url = `${this.host}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...(options.headers as Record<string, string> | undefined),
    };

    const res = await fetch(url, {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      let message = '';
      try {
        const parsed = JSON.parse(text) as { error?: string };
        message = parsed.error || '';
      } catch {
        message = '';
      }
      throw new VaultkeyError(
        message || `VaultKey request failed with status: ${res.status}`,
        res.status,
      );
    }

    const text = await res.text();
    if (!text.trim()) {
      throw new VaultkeyError(
        `VaultKey returned an empty response for ${path} (status: ${res.status})`,
        res.status,
      );
    }
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new VaultkeyError(
        `VaultKey returned invalid JSON for ${path} (status: ${res.status})`,
        res.status,
      );
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    for (let attempt = 0; ; attempt++) {
      try {
        return await this.requestOnce<T>(path, options);
      } catch (err) {
        if (attempt >= RETRY_DELAYS_MS.length || !Vaultkey.isRetryable(err)) {
          throw err;
        }
        await sleep(RETRY_DELAYS_MS[attempt]);
      }
    }
  }

  /**
   * Retrieves the decrypted value of a single secret key.
   * Throws a VaultkeyError if the secret does not exist.
   */
  async get(key: string, project = 'default', env = 'production'): Promise<string> {
    const path = `/v1/secrets/${encodeURIComponent(key)}?project=${encodeURIComponent(project)}&environment=${encodeURIComponent(env)}`;
    const res = await this.request<{ key: string; value: string; version?: number }>(path);
    if (!res || typeof res.value !== 'string') {
      throw new VaultkeyError(`secret '${key}' not found`, 404);
    }
    return res.value;
  }

  /**
   * Lists the active secret keys (names and metadata) inside a scope.
   */
  async list(project = 'default', env = 'production'): Promise<SecretHeader[]> {
    const path = `/v1/secrets?project=${encodeURIComponent(project)}&environment=${encodeURIComponent(env)}`;
    return this.request<SecretHeader[]>(path);
  }

  /**
   * Retrieves all decrypted secrets in the scope as a key-value record.
   */
  async values(project = 'default', env = 'production'): Promise<Record<string, string>> {
    const path = `/v1/secrets/values?project=${encodeURIComponent(project)}&environment=${encodeURIComponent(env)}`;
    return this.request<Record<string, string>>(path);
  }

  /**
   * Fetches all active secrets for the scope and injects them into process.env in-memory.
   *
   * By default (`override: true`) injected values replace existing process.env entries.
   * Pass `{ override: false }` to leave pre-existing environment variables untouched.
   * Returns the full key-value record that was applied.
   */
  async inject(
    project = 'default',
    env = 'production',
    opts: InjectOptions = {},
  ): Promise<Record<string, string>> {
    const override = opts.override ?? true;
    const secrets = await this.values(project, env);
    for (const [key, value] of Object.entries(secrets)) {
      if (!override && process.env[key] !== undefined) {
        continue;
      }
      process.env[key] = value;
    }
    return secrets;
  }
}
