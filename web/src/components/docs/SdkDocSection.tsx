import React, { useState } from 'react';
import { DocsCodeBlock } from './DocsCodeBlock';
import { DocsCallout } from './DocsCallout';

interface SdkDocProps {
  onCopy: (id: string, code: string) => void;
  copiedSnippet: string | null;
}

export const SdkDocSection: React.FC<SdkDocProps> = ({ onCopy, copiedSnippet }) => {
  const [selectedSdk, setSelectedSdk] = useState<'node' | 'python' | 'go'>('node');

  const nodeCode = `import { Vaultkey } from 'vaultkey-js';

const vk = new Vaultkey({
  serverUrl: process.env.VAULTKEY_SERVER || 'https://vaultkey.sheershjaiswal.in',
  apiKey: process.env.VAULTKEY_TOKEN
});

// 1. Inject all project secrets into process.env in-memory:
await vk.inject('backend', 'production');

// 2. Or retrieve a specific secret on-demand:
const dbUri = await vk.get('DATABASE_URL');
console.log('Database connected!');`;

  const pythonCode = `from vaultkey import Vaultkey
import os

vk = Vaultkey(
    server_url=os.getenv("VAULTKEY_SERVER", "https://vaultkey.sheershjaiswal.in"),
    api_key=os.getenv("VAULTKEY_TOKEN")
)

# 1. Inject all secrets directly into os.environ in memory:
vk.inject(project="ml-core", env="production")

# 2. Or query a single encrypted variable:
openai_key = vk.get("OPENAI_API_KEY")`;

  const goCode = `package main

import (
	"context"
	"fmt"
	"os"

	"github.com/chromabeast/vaultkey/pkg/client"
)

func main() {
	vk, err := client.New(client.Config{
		ServerURL: os.Getenv("VAULTKEY_SERVER"),
		Token:     os.Getenv("VAULTKEY_TOKEN"),
	})
	if err != nil {
		panic(err)
	}

	// Fetch all secrets for runtime
	secrets, err := vk.GetSecrets(context.Background(), "backend", "production")
	if err != nil {
		panic(err)
	}

	fmt.Println("Loaded secrets count:", len(secrets))
}`;

  return (
    <div className="docs-sdk-root">
      <div id="sdk-intro" className="docs-subtopic-block">
        <p className="docs-lead-text">
          VaultKey provides native client libraries for Node.js / TypeScript, Python, and Go.
          SDKs communicate over authenticated HTTPS, decrypt variables directly into runtime memory,
          and register audit activity transparently.
        </p>

        <DocsCallout type="tip" title="Non-blocking in-memory injection">
          SDK methods like <code className="docs-inline-code">vk.inject()</code> populate your application's
          process environment table on startup and never serialize values to files or caches.
        </DocsCallout>
      </div>

      <div id="sdk-examples" className="docs-subtopic-block mt-10">
        <div className="docs-tabbed-code-box">
          <div className="docs-tabbed-header">
            <div className="docs-tabbed-tabs">
              <button
                type="button"
                className={`docs-tabbed-btn ${selectedSdk === 'node' ? 'is-active' : ''}`}
                onClick={() => setSelectedSdk('node')}
              >
                TypeScript / Node.js
              </button>
              <button
                type="button"
                className={`docs-tabbed-btn ${selectedSdk === 'python' ? 'is-active' : ''}`}
                onClick={() => setSelectedSdk('python')}
              >
                Python
              </button>
              <button
                type="button"
                className={`docs-tabbed-btn ${selectedSdk === 'go' ? 'is-active' : ''}`}
                onClick={() => setSelectedSdk('go')}
              >
                Go Package
              </button>
            </div>
          </div>

          {selectedSdk === 'node' && (
            <div className="p-1">
              <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">
                Install: <code className="text-sky-400">npm install vaultkey-js</code> or <code className="text-sky-400">bun add vaultkey-js</code>
              </div>
              <DocsCodeBlock
                id="sdk-ts-code"
                language="TypeScript"
                code={nodeCode}
                copiedSnippet={copiedSnippet}
                onCopy={onCopy}
              />
            </div>
          )}

          {selectedSdk === 'python' && (
            <div className="p-1">
              <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">
                Install: <code className="text-sky-400">pip install vaultkey</code>
              </div>
              <DocsCodeBlock
                id="sdk-py-code"
                language="Python"
                code={pythonCode}
                copiedSnippet={copiedSnippet}
                onCopy={onCopy}
              />
            </div>
          )}

          {selectedSdk === 'go' && (
            <div className="p-1">
              <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border">
                Install: <code className="text-sky-400">go get github.com/chromabeast/vaultkey/pkg/client</code>
              </div>
              <DocsCodeBlock
                id="sdk-go-code"
                language="Go"
                code={goCode}
                copiedSnippet={copiedSnippet}
                onCopy={onCopy}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
