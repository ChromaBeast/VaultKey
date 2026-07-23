export interface VaultkeyConfig {
  host?: string;
  apiKey: string;
}

export interface SecretHeader {
  id: string;
  key: string;
  project: string;
  env: string;
  version: number;
}

export class Vaultkey {
  private host: string;
  private apiKey: string;

  constructor(config: VaultkeyConfig) {
    this.host = config.host || 'http://localhost:8080';
    // Remove trailing slash if present
    if (this.host.endsWith('/')) {
      this.host = this.host.slice(0, -1);
    }
    this.apiKey = config.apiKey;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.host}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `VaultKey request failed with status: ${res.status}`
      );
    }

    return res.json().catch(() => null) as Promise<T>;
  }

  /**
   * Retrieves the decrypted value of a single secret key.
   */
  async get(key: string, project = 'default', env = 'production'): Promise<string> {
    const path = `/v1/secrets/${encodeURIComponent(key)}?project=${encodeURIComponent(project)}&environment=${encodeURIComponent(env)}`;
    const res = await this.request<{ key: string; value: string }>(path);
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
   * Fetches all active secrets for the scope and automatically injects them into process.env in-memory.
   */
  async inject(project = 'default', env = 'production'): Promise<void> {
    const secrets = await this.values(project, env);
    for (const [key, value] of Object.entries(secrets)) {
      process.env[key] = value;
    }
  }
}
