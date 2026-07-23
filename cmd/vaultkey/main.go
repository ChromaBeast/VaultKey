package main

import (
	"fmt"
	"os"
)

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	subcommand := os.Args[1]
	var err error

	switch subcommand {
	case "unlock":
		err = handleUnlock()
	case "lock":
		err = handleLock()
	case "status":
		err = handleStatus()
	case "get":
		err = handleGet()
	case "set":
		err = handleSet()
	case "list":
		err = handleList()
	case "pull":
		err = handlePull()
	case "push":
		err = handlePush()
	case "run":
		err = handleRun()
	case "export":
		err = handleExport()
	case "audit":
		err = handleAudit()
	case "keys":
		err = handleKeys()
	default:
		fmt.Printf("Unknown subcommand: %s\n", subcommand)
		printUsage()
		os.Exit(1)
	}

	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Print(`VaultKey SaaS - Secure Secrets Manager

Usage:
  vaultkey <command> [arguments]

Commands:
  pull [--project=p] [--env=e] [--out=.env]   Pulls remote secrets to local .env file
  push [--project=p] [--env=e] [--file=.env]  Pushes local .env file to VaultKey
  get <key>                                   Retrieves and decrypts a secret
  set <key> <value>                           Encrypts and stores a secret
  list                                        Lists all active secret names
  run [--project=p] [--env=e] -- <cmd> <args> Injects secrets into child process
  export [--format=dotenv]                    Dumps secrets to .env format
  audit                                       Shows recent secure audit logs
  keys <create|list|revoke>                   Manages API authorization keys
  lock                                        Locks the vault, clearing RAM keys
  status                                      Shows vault locking status

Global Environment Variables:
  VAULTKEY_SERVER                             Server address (default: http://localhost:8080)
  VAULTKEY_TOKEN                              API Key token to authenticate requests
`)
}
