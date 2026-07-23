"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vaultkey = void 0;
class Vaultkey {
    host;
    apiKey;
    constructor(config) {
        this.host = config.host || 'http://localhost:8080';
        // Remove trailing slash if present
        if (this.host.endsWith('/')) {
            this.host = this.host.slice(0, -1);
        }
        this.apiKey = config.apiKey;
    }
    async request(path, options = {}) {
        const url = `${this.host}${path}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            ...options.headers,
        };
        const res = await fetch(url, { ...options, headers });
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || `VaultKey request failed with status: ${res.status}`);
        }
        return res.json().catch(() => null);
    }
    /**
     * Retrieves the decrypted value of a single secret key.
     */
    async get(key, project = 'default', env = 'production') {
        const path = `/v1/secrets/${encodeURIComponent(key)}?project=${encodeURIComponent(project)}&environment=${encodeURIComponent(env)}`;
        const res = await this.request(path);
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
     * Fetches all active secrets for the scope and automatically injects them into process.env in-memory.
     */
    async inject(project = 'default', env = 'production') {
        const headers = await this.list(project, env);
        for (const header of headers) {
            const value = await this.get(header.key, project, env);
            process.env[header.key] = value;
        }
    }
}
exports.Vaultkey = Vaultkey;
