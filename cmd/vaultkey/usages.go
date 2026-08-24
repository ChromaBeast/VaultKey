package main

import "fmt"

var commandUsage = map[string]string{
	"unlock": `Usage: vaultkey unlock
  Prompts for email and master password (no echo) to unlock the vault.
`,
	"lock": `Usage: vaultkey lock
  Locks the vault, clearing RAM keys.
`,
	"status": `Usage: vaultkey status
  Shows vault locking status.
`,
	"get": `Usage: vaultkey get <key> [--project=p] [--env=e]
  Retrieves and decrypts a secret. Flags must come before the positional key.
`,
	"set": `Usage: vaultkey set <key> [value] [--project=p] [--env=e]
  Stores a secret. If value is omitted it is prompted for without echo.
  Flags must come before positional arguments.
`,
	"list": `Usage: vaultkey list [--project=p] [--env=e]
  Lists all active secret names.
`,
	"delete": `Usage: vaultkey delete <key> [--project=p] [--env=e]
  Deletes a secret after an interactive confirmation prompt.
`,
	"versions": `Usage: vaultkey versions <key> [--project=p] [--env=e]
  Lists all stored versions of a secret.
`,
	"rollback": `Usage: vaultkey rollback <key> --version N [--project=p] [--env=e]
  Restores a secret to an earlier version as a new version.
`,
	"projects": `Usage: vaultkey projects
  Lists project names visible to the current token.
`,
	"pull": `Usage: vaultkey pull [--project=p] [--env=e] [--out=.env]
  Pulls remote secrets to a local .env file.
`,
	"push": `Usage: vaultkey push [--project=p] [--env=e] [--file=.env] [--dry-run]
  Pushes a local .env file to VaultKey. --dry-run parses and validates only.
`,
	"run": `Usage: vaultkey run [--project=p] [--env=e] -- <cmd> [args...]
  Injects secrets into the child process environment.
`,
	"export": `Usage: vaultkey export [--project=p] [--env=e] [--format=dotenv]
  Dumps decrypted secrets in .env format to stdout.
`,
	"audit": `Usage: vaultkey audit [--limit=50] [--offset=0] [--json]
  Shows recent secure audit logs. limit is clamped to 1..500.
`,
	"keys": `Usage: vaultkey keys <create|list|revoke> [args]
  Manages API authorization keys.
`,
	"keys create": `Usage: vaultkey keys create <name> [--permissions=p] [--project=x] [--expires=RFC3339]
  Creates an API key and prints its one-time token.
`,
	"keys list": `Usage: vaultkey keys list
  Lists all API keys.
`,
	"keys revoke": `Usage: vaultkey keys revoke <id>
  Revokes an API key.
`,
}

func printCommandUsage(name string) {
	if name == "" {
		printAllUsage()
		return
	}
	text, ok := commandUsage[name]
	if !ok {
		fmt.Printf("Unknown command: %s\n\n", name)
		printAllUsage()
		return
	}
	fmt.Print(text)
}
