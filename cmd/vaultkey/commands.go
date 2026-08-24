package main

import (
	"bufio"
	"flag"
	"fmt"
	"os"
	"strings"
	"syscall"
	"vaultkey/internal/client"

	"golang.org/x/term"
)

type exitError struct{ code int }

func (e *exitError) Error() string {
	return fmt.Sprintf("child process exited with code %d", e.code)
}

func newFlagSet(name string) *flag.FlagSet {
	fs := flag.NewFlagSet(name, flag.ContinueOnError)
	fs.Usage = func() { fmt.Fprint(os.Stderr, commandUsage[name]) }
	return fs
}

func requireArgs(fs *flag.FlagSet, min, max int) ([]string, error) {
	args := fs.Args()
	if len(args) < min || (max >= 0 && len(args) > max) {
		return nil, fmt.Errorf("expected %s positional argument(s), got %d\n%s", argRange(min, max), len(args), commandUsage[fs.Name()])
	}
	return args, nil
}

func argRange(min, max int) string {
	if max < 0 {
		return fmt.Sprintf("at least %d", min)
	}
	if min == max {
		return fmt.Sprintf("exactly %d", min)
	}
	return fmt.Sprintf("%d to %d", min, max)
}

func handleUnlock() error {
	fs := newFlagSet("unlock")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	if _, err := requireArgs(fs, 0, 0); err != nil {
		return err
	}

	reader := bufio.NewReader(os.Stdin)
	fmt.Print("Email: ")
	emailLine, err := reader.ReadString('\n')
	if err != nil && emailLine == "" {
		return fmt.Errorf("failed to read email: %w", err)
	}
	email := strings.TrimRight(emailLine, "\r\n")

	fmt.Print("Master password: ")
	bytePassword, err := term.ReadPassword(int(syscall.Stdin))
	if err != nil {
		return fmt.Errorf("failed to read password: %w", err)
	}
	fmt.Println()
	password := strings.TrimRight(string(bytePassword), "\r\n")
	clear(bytePassword)

	c := client.NewClient()
	if err := c.Unlock(email, password); err != nil {
		return err
	}
	fmt.Println("Vault unlocked successfully.")
	return nil
}

func handleLock() error {
	fs := newFlagSet("lock")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	if _, err := requireArgs(fs, 0, 0); err != nil {
		return err
	}

	c := client.NewClient()
	if err := c.Lock(); err != nil {
		return err
	}
	fmt.Println("Vault locked.")
	return nil
}

func handleStatus() error {
	fs := newFlagSet("status")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	if _, err := requireArgs(fs, 0, 0); err != nil {
		return err
	}

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

func handleGet() error {
	fs := newFlagSet("get")
	proj := fs.String("project", "default", "scoped project name")
	env := fs.String("env", "production", "scoped environment")
	if err := fs.Parse(os.Args[2:]); err != nil {
		return err
	}
	args, err := requireArgs(fs, 1, 1)
	if err != nil {
		return err
	}
	key := args[0]

	c := client.NewClient()
	val, err := c.GetSecret(*proj, *env, key)
	if err != nil {
		return err
	}
	fmt.Println(val)
	return nil
}
