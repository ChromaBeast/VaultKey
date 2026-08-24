"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaultkey = exports.VaultkeyError = void 0;
class VaultkeyError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.name = 'VaultkeyError';
        this.status = status;
    }
}
exports.VaultkeyError = VaultkeyError;
const DEFAULT_TIMEOUT_MS = 30000;
const RETRY_DELAYS_MS = [300, 900];
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
class Vaultkey {
    host;
    apiKey;
    timeoutMs;
    constructor(config) {
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
    static isRetryable(err) {
        if (err instanceof VaultkeyError) {
            return err.status !== undefined && err.status >= 500;
        }
        return true;
    }
    async requestOnce(path, options) {
        const url = `${this.host}${path}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            ...options.headers,
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
                const parsed = JSON.parse(text);
                message = parsed.error || '';
            }
            catch {
                message = '';
            }
            throw new VaultkeyError(message || `VaultKey request failed with status: ${res.status}`, res.status);
        }
        const text = await res.text();
        if (!text.trim()) {
            throw new VaultkeyError(`VaultKey returned an empty response for ${path} (status: ${res.status})`, res.status);
        }
        try {
            return JSON.parse(text);
        }
        catch {
            throw new VaultkeyError(`VaultKey returned invalid JSON for ${path} (status: ${res.status})`, res.status);
        }
    }
    async request(path, options = {}) {
        for (let attempt = 0;; attempt++) {
            try {
                return await this.requestOnce(path, options);
            }
            catch (err) {
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
    async get(key, project = 'default', env = 'production') {
        const path = `/v1/secrets/${encodeURIComponent(key)}?project=${encodeURIComponent(project)}&environment=${encodeURIComponent(env)}`;
        const res = await this.request(path);
        if (!res || typeof res.value !== 'string') {
            throw new VaultkeyError(`secret '${key}' not found`, 404);
        }
        return res.value;
    }
    /**
     * Lists the active secret keys (names and metadata) inside a scope.
     */
    async list(project = 'default', env = 'production') {
        const path = `/v1/secrets?project=${encodeURIComponent(project)}&environment=${encodeURIComponent(env)}`;
        return this.request(path);
    }
    /**
     * Retrieves all decrypted secrets in the scope as a key-value record.
     */
    async values(project = 'default', env = 'production') {
        const path = `/v1/secrets/values?project=${encodeURIComponent(project)}&environment=${encodeURIComponent(env)}`;
        return this.request(path);
    }
    /**
     * Fetches all active secrets for the scope and injects them into process.env in-memory.
     *
     * By default (`override: true`) injected values replace existing process.env entries.
     * Pass `{ override: false }` to leave pre-existing environment variables untouched.
     * Returns the full key-value record that was applied.
     */
    async inject(project = 'default', env = 'production', opts = {}) {
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
exports.Vaultkey = Vaultkey;
