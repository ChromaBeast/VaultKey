package main

import (
	"errors"
	"flag"
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		printAllUsage()
		os.Exit(1)
	}

	subcommand := os.Args[1]

	switch subcommand {
	case "-h", "--help", "help":
		target := ""
		if len(os.Args) > 2 {
			target = os.Args[2]
		}
		printCommandUsage(target)
		if target != "" {
			if _, ok := commandUsage[target]; !ok {
				os.Exit(1)
			}
		}
		os.Exit(0)
	case "unlock":
		exit(handleUnlock())
	case "lock":
		exit(handleLock())
	case "status":
		exit(handleStatus())
	case "get":
		exit(handleGet())
	case "set":
		exit(handleSet())
	case "list":
		exit(handleList())
	case "delete":
		exit(handleDelete())
	case "versions":
		exit(handleVersions())
	case "rollback":
		exit(handleRollback())
	case "projects":
		exit(handleProjects())
	case "pull":
		exit(handlePull())
	case "push":
		exit(handlePush())
	case "run":
		exit(handleRun())
	case "export":
		exit(handleExport())
	case "audit":
		exit(handleAudit())
	case "keys":
		exit(handleKeys())
	default:
		fmt.Printf("Unknown subcommand: %s\n\n", subcommand)
		printAllUsage()
		os.Exit(1)
	}
}

func exit(err error) {
	if err == nil {
		return
	}
	if errors.Is(err, flag.ErrHelp) {
		os.Exit(0)
	}
	fmt.Fprintf(os.Stderr, "Error: %v\n", err)
	var ee *exitError
	if errors.As(err, &ee) {
		os.Exit(ee.code)
	}
	os.Exit(1)
}

func printAllUsage() {
	fmt.Print(`VaultKey SaaS - Secure Secrets Manager

Usage:
  vaultkey <command> [arguments]

Commands:
  unlock                                      Prompts for email/password to unlock the vault
  lock                                        Locks the vault, clearing RAM keys
  status                                      Shows vault locking status
  get <key> [--project=p] [--env=e]           Retrieves and decrypts a secret
  set <key> [value] [--project=p] [--env=e]   Stores a secret (prompts if value omitted)
  list [--project=p] [--env=e]                Lists all active secret names
  delete <key> [--project=p] [--env=e]        Deletes a secret after confirmation
  versions <key> [--project=p] [--env=e]      Lists all versions of a secret
  rollback <key> --version N [--project=p] [--env=e]
                                              Restores a secret to an earlier version
  projects                                    Lists project names
  pull [--project=p] [--env=e] [--out=.env]   Pulls remote secrets to a local .env file
  push [--project=p] [--env=e] [--file=.env] [--dry-run]
                                              Pushes a local .env file to VaultKey
  run [--project=p] [--env=e] -- <cmd> [args...]
                                              Injects secrets into child process
  export [--project=p] [--env=e] [--format=dotenv]
                                              Dumps secrets in .env format to stdout
  audit [--limit=50] [--offset=0] [--json]    Shows recent secure audit logs
  keys <create|list|revoke>                   Manages API authorization keys

Note: flags must come BEFORE positional arguments.

Global Environment Variables:
  VAULTKEY_SERVER                             Server address (default: http://localhost:8080)
  VAULTKEY_TOKEN                              API Key token to authenticate requests
  VAULTKEY_TIMEOUT                            Request timeout as Go duration (default: 30s)
`)
}
