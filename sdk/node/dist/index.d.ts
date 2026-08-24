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
export declare class VaultkeyError extends Error {
    readonly status?: number;
    constructor(message: string, status?: number);
}
export declare class Vaultkey {
    private host;
    private apiKey;
    private timeoutMs;
    constructor(config: VaultkeyConfig);
    private static isRetryable;
    private requestOnce;
    private request;
    /**
     * Retrieves the decrypted value of a single secret key.
     * Throws a VaultkeyError if the secret does not exist.
     */
    get(key: string, project?: string, env?: string): Promise<string>;
    /**
     * Lists the active secret keys (names and metadata) inside a scope.
     */
    list(project?: string, env?: string): Promise<SecretHeader[]>;
    /**
     * Retrieves all decrypted secrets in the scope as a key-value record.
     */
    values(project?: string, env?: string): Promise<Record<string, string>>;
    /**
     * Fetches all active secrets for the scope and injects them into process.env in-memory.
     *
     * By default (`override: true`) injected values replace existing process.env entries.
     * Pass `{ override: false }` to leave pre-existing environment variables untouched.
     * Returns the full key-value record that was applied.
     */
    inject(project?: string, env?: string, opts?: InjectOptions): Promise<Record<string, string>>;
}
