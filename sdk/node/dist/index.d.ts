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
export declare class Vaultkey {
    private host;
    private apiKey;
    constructor(config: VaultkeyConfig);
    private request;
    /**
     * Retrieves the decrypted value of a single secret key.
     */
    get(key: string, project?: string, env?: string): Promise<string>;
    /**
     * Lists the active secret keys (names and metadata) inside a scope.
     */
    list(project?: string, env?: string): Promise<SecretHeader[]>;
    /**
     * Fetches all active secrets for the scope and automatically injects them into process.env in-memory.
     */
    inject(project?: string, env?: string): Promise<void>;
}
