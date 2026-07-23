package main

import (
	"flag"
	"fmt"
	"os"
	"strings"
	"syscall"
	"vaultkey/internal/client"

	"golang.org/x/term"
)

// handleUnlock prompts for password without echo and calls the API to derive keys in memory.
func handleUnlock() error {
	fmt.Print("Enter master password: ")
	bytePassword, err := term.ReadPassword(int(syscall.Stdin))
	if err != nil {
		return fmt.Errorf("failed to read password: %w", err)
	}
	fmt.Println()
	password := strings.TrimSpace(string(bytePassword))

	c := client.NewClient()
	if err := c.Unlock(password); err != nil {
		return err
	}
	fmt.Println("Vault unlocked successfully.")
	return nil
}

// handleLock zeroes out the in-memory keys.
func handleLock() error {
	c := client.NewClient()
	if err := c.Lock(); err != nil {
		return err
	}
	fmt.Println("Vault locked.")
	return nil
}

// handleStatus prints locking state and server version details.
func handleStatus() error {
	c := client.NewClient()
	locked, version, err := c.Status()
	if err != nil {
		return err
	}
	state := "Unlocked"
	if locked {
		state = "Locked"
	}
	fmt.Printf("Vault State: %s\n", state)
	fmt.Printf("Version:     %s\n", version)
	return nil
}

// handleGet retrieves and prints a single decrypted secret.
func handleGet() error {
	fs := flag.NewFlagSet("get", flag.ContinueOnError)
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	if len(fs.Args()) < 1 {
		return fmt.Errorf("missing key name. Usage: vaultkey get <key>")
	}
	key := fs.Arg(0)

	c := client.NewClient()
	val, err := c.GetSecret(*proj, *env, key)
	if err != nil {
		return err
	}
	fmt.Println(val)
	return nil
}
